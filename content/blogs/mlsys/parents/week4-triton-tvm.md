---
title: "How Triton and TVM make GPU programming not terrible"
slug: "mlsys-week4-triton-tvm"
description: "Week four of ML Systems. Triton raises the abstraction from individual threads to multi-dimensional tiles; TVM introduces extensible hardware intrinsics for end-to-end ML compilation. Both are trying to close the gap between 'runs on GPU' and 'runs efficiently on GPU.'"
date: "2026-04-26"
tags: ["MLSys", "Triton", "TVM", "Compilers", "GPU", "Systems"]
projectSlug: "mlsys"
status: "draft"
---

## 1. Introduction

Week four follows naturally from week three. Now that we understand how GPUs actually work, SMs, warps, memory hierarchy, coalescing, the question becomes: how do we write code that exploits all of that without requiring every programmer to be a CUDA expert?

The reading covers two compiler frameworks: **Triton** and **TVM**. They approach the problem from different angles, which makes them interesting to compare. Triton raises the abstraction level so programmers reason about tiles instead of threads. TVM takes a more end-to-end approach and focuses on recognizing and substituting hardware-specific operations at compile time.

---

## 2. Why CUDA is painful to write

### 2.1 The SPMD model

CUDA follows the **SPMD** model, Single Program, Multiple Data. You write one kernel function, and it gets executed by every thread in the grid, each identifying itself by its thread index. The kernel for thread `(blockIdx.x, threadIdx.x)` might read from `A[blockIdx.x * blockDim.x + threadIdx.x]`, for instance.

The issue is that this forces you to think about everything in terms of individual threads: which element does this specific thread read? Which elements does this thread write? How do threads in the same block collaborate through shared memory? When do I need a `__syncthreads()` barrier?

A significant portion of writing a CUDA kernel is bookkeeping that has nothing to do with the actual computation being performed. You're managing indices, synchronization, and memory movement, all of which are just boilerplate infrastructure around the actual math.

### 2.2 The performance gap

The result is that writing a CUDA kernel that's actually fast, that uses coalesced memory access, avoids bank conflicts, achieves good occupancy, fuses correctly with adjacent operations, is genuinely hard. Most people don't write CUDA directly; they either use libraries like cuBLAS and cuDNN, or they rely on frameworks like PyTorch to generate efficient kernels automatically.

But there's a gap: cuBLAS gives you highly optimized matmul, but as soon as you want something slightly custom (a fused attention variant, a novel activation function, a specialized normalization), you're back to writing CUDA from scratch. Triton is trying to fill that gap.

---

## 3. Triton: tiles instead of threads

### 3.1 The programming model

Triton preserves the grid-based launch structure from CUDA, but changes the fundamental unit of a kernel instance from a single thread to a **tile**, a multi-dimensional block of data.

In CUDA, kernel instance `(bx, tx)` is responsible for a single scalar output. In Triton, kernel instance `pid` is responsible for a `BLOCK_SIZE x BLOCK_SIZE` tile of the output. The programmer writes code that operates on those tiles using Python-like syntax, and the parallelism within the tile is handled automatically by the Triton JIT compiler.

This is a big deal. It means you never have to write `blockIdx.x * blockDim.x + threadIdx.x` to figure out which element you're responsible for. You just say "give me tile number `pid`" and work with that tile as if it's a small array. Synchronization primitives are gone, Triton handles that internally.

The parallel execution that a CUDA programmer would write by hand (explicitly assigning operations to threads, inserting `__syncthreads()`, loading cooperatively from global to shared memory) is generated automatically by the compiler. You write what the computation is; Triton figures out how to parallelize it efficiently.

### 3.2 Machine-independent optimizations

Triton's JIT has two levels of passes: machine-independent (applied to the Triton IR) and machine-dependent (applied later when targeting specific hardware).

**Pre-fetching** is one of the more interesting machine-independent optimizations. I initially read this and thought it was just loop reordering, but it's more subtle. In a naive implementation, iteration `N` of a loop loads a tile, waits for the load to complete, then computes on it. The full memory latency is paid every iteration.

With pre-fetching, iteration `N` computes on the data that was loaded in the previous iteration, while simultaneously the memory unit is already loading data for iteration `N+1`. Load and compute overlap. The latency is hidden behind useful work rather than wasted as a stall. This is essentially the same latency-hiding strategy we discussed in week three (Little's Law), but now automated at the compiler level.

**Peephole optimization** is simpler in concept: the compiler scans the IR for redundant operation patterns and eliminates them. A classic example is a double transpose: `(x^T)^T` is mathematically a no-op. The compiler detects this pattern and removes both transposes entirely, saving both the memory bandwidth and execution time of two operations.

### 3.3 Machine-dependent optimizations

The machine-dependent passes handle hardware-specific concerns. Triton decomposes work across a three-tier hierarchy that maps to the GPU memory hierarchy we covered last week:

- **Tiles** are managed in shared memory (the fast per-SM cache)
- **Micro-tiles** fit in the register file of a core
- **Nano-tiles** map directly to ALUs or SIMD lanes

This hierarchical decomposition is what lets Triton target hardware efficiently. The programmer specifies tile dimensions; Triton figures out the micro-tile and nano-tile sizes that map efficiently to the underlying hardware.

At the micro-tile level, Triton also handles **memory coalescing** automatically: it reorders threads internally within each micro-tile so that adjacent threads access adjacent memory locations. This is exactly the pattern we need for good memory bandwidth utilization, but in CUDA you'd have to engineer this yourself.

For operations with high arithmetic intensity, GEMM (matrix multiply), attention, Triton automatically stages operands into shared memory and inserts the necessary synchronization barriers. This is often the most tedious part of writing a CUDA kernel, so having the compiler handle it is genuinely useful.

---

## 4. TVM: end-to-end optimization

### 4.1 The problem space

TVM is a different kind of compiler. Where Triton focuses on making it easier to write individual high-performance kernels, TVM is an end-to-end compiler: you give it a complete model (from PyTorch, TensorFlow, etc.) and it generates optimized code for a target hardware backend (CPU, GPU, TPU, or custom accelerators).

The motivation is that the "operator fusion, memory layout, schedule" optimizations that make models fast aren't just about individual kernels, they require reasoning about the entire computation graph. TVM does this globally.

### 4.2 Graph-level optimizations

Before generating any hardware code, TVM performs optimizations at the computation graph level.

**Operator fusion** is probably the most impactful. TVM categorizes operations into four types:

- **Injective** (element-wise): operations like `add`, `multiply`, `relu`. The output shape is the same as the input shape.
- **Reduction**: operations like `sum`, `mean`, `max` that reduce dimensionality.
- **Complex-out-fusable**: operations like `conv2d` where the output shape isn't trivially determined by the input.
- **Opaque**: operations like `sort` that fundamentally cannot be fused.

The fusion rules follow from these categories. Multiple injective operations can collapse into one kernel, a `relu` after a `bias_add` after a `matmul` can all be one kernel. A reduction can be fused with its upstream injective operations.

The win from fusion is avoiding materializing intermediate tensors in global memory. If you fuse `relu(bias_add(matmul(A, B), b))`, you never have to write the `matmul` result or the `bias_add` result to VRAM, you compute them directly in registers and only write the final result. For long chains of element-wise operations, this saves significant memory bandwidth.

TVM also does **data layout transformation** at the graph level, converting tensors from one memory layout to another (NCHW to NHWC, for instance) to better match the target hardware's memory access patterns. Doing this once at the graph level is cleaner than trying to handle it operator-by-operator.

### 4.3 Tensorization: extensible hardware intrinsics

This is the part I found most interesting, and it solves a problem I hadn't thought much about before.

Modern accelerators have specialized instructions for tensor operations. NVIDIA GPUs have `wmma` (warp matrix multiply-accumulate) instructions. TPUs have their own matrix instruction sets. And new accelerators with entirely different instruction sets keep getting released. The problem for a compiler is: how do you support all of these without hardcoding rules for every possible hardware target?

TVM's answer is **tensorization**: an extensible mechanism where users declare hardware intrinsics, and the compiler pattern-matches operations in the computation graph to find subgraphs that match declared intrinsics and replaces them with the corresponding hardware call.

A hardware intrinsic declaration has two components:
1. **Behavior**: the mathematical definition of what the instruction computes (e.g., `C += A @ B` for an `M x K` by `K x N` matrix multiply).
2. **Lowering rule**: the actual code sequence needed to invoke that instruction on the hardware (e.g., the `wmma::load_matrix_sync` + `wmma::mma_sync` + `wmma::store_matrix_sync` calls for NVIDIA's warp-level matrix intrinsics).

During compilation, TVM identifies sub-blocks of the computation that match the behavior of a declared intrinsic. When a match is found, it replaces the entire matched computation (including all the surrounding loops) with a single call using the lowering rule.

This is extensible: if a new accelerator ships with a novel tensor instruction, you can add support by writing one intrinsic declaration, not by modifying the compiler itself. That's a much better scaling property than maintaining a growing table of hardcoded rules.

### 4.4 A concrete example

The reading gives a nice worked example: `C = A × B` for 8×8 matrices. This requires `8^3 = 512` multiply-accumulate operations.

A scalar CPU: 512 individual instructions.

A SIMD CPU processing 8 values at once: 64 vector instructions.

Now suppose your hardware has a 4×4 matrix multiply intrinsic that executes in a single instruction. TVM partitions the 8×8 output into four 4×4 quadrants. Each quadrant requires two 4×4 block multiplications (because `K = 8` has to be split into two tiles of 4). Total: `4 quadrants × 2 multiplications = 8` hardware calls.

512 instructions → 8 instructions. That's the kind of speedup tensorization gives you when the hardware intrinsics are actually utilized.

### 4.5 Automated schedule search

Finding the optimal execution schedule manually is not feasible, there are too many knobs (tile sizes, loop orderings, parallelism strategies) and the interactions between them are complex. TVM automates this with a two-component system:

A **schedule explorer** enumerates valid configurations of the schedule space. It tries different combinations of tile sizes, loop orderings, parallelization choices, etc.

A **learned ML cost model** predicts the runtime of a lowered loop program on a specific hardware backend without actually running it. The cost model is trained on actual hardware measurements and generalizes to new configurations. This lets the explorer evaluate thousands of candidate schedules quickly, only occasionally running the actual hardware measurement to update the cost model.

The combination substantially speeds up optimization compared to exhaustive hardware search. You don't need to run every candidate on the GPU, just the ones the cost model is uncertain about.

---

## 5. Triton vs TVM

They're solving related but different problems:

Triton is a productivity tool for ML practitioners who need to write custom kernels. It raises the abstraction from "manage individual threads" to "operate on tiles," handling the bookkeeping automatically. You write one Triton kernel and it generates efficient GPU code.

TVM is an end-to-end optimization compiler for deploying complete models. It reasons about the whole computation graph, fuses operations, adapts layouts, and maps tensor computations to hardware-specific intrinsics. You give it a model and a hardware target and it figures out the best implementation.

Both are ultimately addressing the same underlying problem: the gap between "ML code that runs" and "ML code that actually exploits the hardware." Triton closes this gap at the kernel level; TVM closes it at the model level. In practice you'd use both, Triton to write custom kernels, TVM to optimize the compilation of the full model.

---

## 6. Reflections

The tensorization mechanism is probably the cleanest design I've seen in this week's material. The extensibility property, "add support for new hardware by writing one intrinsic, not by modifying the compiler", is exactly the right abstraction. It decouples hardware support from compiler internals, which is what lets TVM target such a wide variety of backends.

Triton I find more immediately practical. The idea of "write code at the tile level, get thread-level performance" is compelling, and it explains why Flash Attention was written in Triton, it's exactly the kind of custom operation (fused attention with precise control over the memory access pattern) that doesn't exist as a library primitive but is too important to leave unoptimized.

This week felt like the culmination of the hardware + software stack. We went from GPU architecture (week 3) to PyTorch's JIT compiler (week 2) to compiler abstractions for custom kernels and end-to-end optimization (week 4). The next question I have is how all of this fits together in actual deployed LLM inference, which I think is where this is going.

---

## 7. Links & References

- Tillet, P., et al. (2019). Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations. https://www.eecs.harvard.edu/~htk/publication/2019-mapl-tillet-kung-cox.pdf
- Chen, T., et al. (2018). TVM: An Automated End-to-End Optimizing Compiler for Deep Learning. https://arxiv.org/abs/1802.04799
- OpenAI Triton docs: https://triton-lang.org/
