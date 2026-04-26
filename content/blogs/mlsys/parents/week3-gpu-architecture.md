---
title: "GPU architecture from first principles"
slug: "mlsys-week3-gpu-architecture"
description: "Week three of ML Systems. How GPUs actually work: streaming multiprocessors, warp execution, memory hierarchy, the Roofline model, and why bank conflicts and memory coalescing matter."
date: "2026-04-26"
tags: ["MLSys", "GPU", "CUDA", "Systems", "Hardware"]
projectSlug: "mlsys"
status: "draft"
---

## 1. Introduction

Week three is the GPU week, and honestly it's the one I was most looking forward to. I've been writing CUDA-adjacent code for a while (mostly through PyTorch), but I've always had a gap in understanding what's actually happening at the hardware level. This week filled in a lot of that.

The reading is based on Modal's GPU Glossary, which covers GPU architecture pretty thoroughly. My notes below are organized around the concepts I found most clarifying, not strictly the order of the reading.

---

## 2. The hardware: SMs, cores, and memory

### 2.1 Streaming multiprocessors

The fundamental unit of parallelism on an NVIDIA GPU is the **Streaming Multiprocessor (SM)**. A GPU is essentially a large collection of SMs, the H100 has 132 of them. Each SM is a somewhat self-contained processor with its own compute units, register file, and shared memory.

Within each SM, there are 4 **Warp Schedulers**. A warp is a group of 32 threads that execute together (more on this later). The warp schedulers decide which warp to run on each clock cycle. The key insight is that the schedulers can switch between warps very quickly, which is how GPUs hide latency, while one warp is waiting on a memory fetch, another warp can be executing.

### 2.2 Types of compute units

GPUs have a few different types of compute units within each SM:

**CUDA cores** handle general-purpose floating point and integer arithmetic. Think of them as the "general" compute units, anything that doesn't fit a more specialized pattern goes here.

**Tensor cores** are specialized units for matrix multiply-accumulate operations. They operate on small tiles of matrices (4x4 or 8x8, depending on the architecture) and perform the multiply-accumulate in a single instruction. This is why matrix multiplication on GPUs is so much faster than naive implementations, the hardware has dedicated circuitry for exactly that operation.

**Special Function Units (SFUs)** handle specific transcendental functions: exponentials, sine, cosine, etc. These are expensive in general-purpose compute but common in ML (activations, softmax), so having dedicated hardware for them makes sense.

In Hopper (H100) and Blackwell (B100) architectures, there's also the **Tensor Memory Accelerator (TMA)**, which is a coprocessor specifically for moving multidimensional arrays around within GPU memory. The TMA operates asynchronously, you kick off a data movement operation and it runs independently of the main compute, so you don't have to stall waiting for the data to arrive. This frees up other compute resources.

### 2.3 Memory hierarchy

GPU memory has the same hierarchy structure as CPU memory, just with different names and different characteristics.

At the top (fastest, smallest): **registers** and **caches** use SRAM. Very fast, low capacity.

At the bottom (slowest, largest): **VRAM** (the GPU's main RAM, what `nvidia-smi` shows) uses DRAM. Slow relative to registers, we're talking hundreds of nanoseconds for a DRAM access vs a few cycles for a register access, but capacity is in the tens of gigabytes.

The memory hierarchy maps directly onto the thread hierarchy:
- Threads → individual cores, use the SM's **register file**
- Thread blocks → SMs, use the SM's **shared memory** (the L1 cache)
- The whole grid → all SMs, use **global GPU RAM** (VRAM)

This mapping is not incidental, it's the core of how you write efficient GPU code. You want to keep your working set in registers, overflow to shared memory, and minimize accesses to global VRAM as much as possible.

---

## 3. Code execution: kernels and thread hierarchy

### 3.1 From Python to hardware

When you write a CUDA kernel, you're writing in C++. That C++ gets compiled to **PTX** (Parallel Thread Execution), which is NVIDIA's intermediate representation, a hardware-independent assembly format. PTX then gets compiled down to **SASS**, the actual assembly format for a specific GPU architecture. This two-step compilation lets NVIDIA evolve the hardware architecture without breaking all existing CUDA code.

A **kernel** is the fundamental unit of CUDA code, it's basically a function that runs on the GPU. Each thread executes the same kernel code but on different data (the SPMD model, Single Program Multiple Data).

### 3.2 Thread hierarchy

Threads are organized into a three-level hierarchy:

1. **Threads** are the basic execution unit. Each thread has its own registers and its own program counter.
2. **Thread blocks** are groups of threads that can communicate through shared memory (the SM cache). All threads in a block are guaranteed to run on the same SM.
3. **The grid** is the collection of all thread blocks for a given kernel launch. Different blocks can (and often do) run on different SMs.

This hierarchy is nice because it gives you a way to organize parallelism that maps cleanly to the hardware. The shared memory within a block is fast because it's on the SM. Communication between blocks has to go through global memory, which is slow.

In practice, you also have **cuBLAS** sitting on top of all this, CUDA Basic Linear Algebra Subroutines. It's a library of highly optimized routines for things like matrix-matrix multiplication. Worth noting: cuBLAS uses column-major ordering (like FORTRAN), not row-major (like C), which is a common source of bugs when you're interfacing between PyTorch (which uses row-major internally) and cuBLAS.

---

## 4. Performance analysis: the Roofline model

### 4.1 The two limits

For any GPU program, performance is ultimately bounded by one of two things: how fast you can move data from memory, or how fast you can do math. The **Roofline model** is a simple framework for figuring out which one is your bottleneck.

You plot two things:
- **Memory bandwidth**: the maximum rate at which data can move between memory levels, measured in GB/s.
- **Arithmetic bandwidth** (also called compute throughput): the peak rate at which the hardware can do arithmetic, measured in FLOPs/s.

Given a specific operation, you compute its **arithmetic intensity**: how many FLOPs does it do per byte of data it reads/writes. If the arithmetic intensity is below a certain threshold (the roofline inflection point), you're memory-bound, you're waiting on data more than you're doing useful math. If it's above, you're compute-bound.

Matrix multiplication has high arithmetic intensity (you reuse each element many times in the computation), so it tends to be compute-bound. Element-wise operations like addition have low arithmetic intensity, so they tend to be memory-bound.

This matters a lot for deciding how to optimize. If you're memory-bound, the priority is reducing memory traffic (fusion, better memory access patterns). If you're compute-bound, the priority is getting better hardware utilization.

### 4.2 Little's Law for latency hiding

Memory access latency on GPUs is hundreds of cycles. If every time a thread had to wait for a memory fetch the SM just sat idle, performance would be terrible. The solution is to have many warps in flight simultaneously, so that while some warps are stalled waiting on memory, others can be executing.

**Little's Law** gives you a way to calculate how much concurrency you need to fully hide latency:

```
Concurrency (ops) = Latency (s) × Throughput (ops/s)
```

So if memory latency is 300ns and throughput is 2000 ops/s, you need 600 concurrent operations in flight to keep the hardware busy. This is why GPUs run with thousands of concurrent threads, you need that many to absorb all the latency.

---

## 5. Warp execution: states, occupancy, divergence

### 5.1 Warp states

A warp transitions through several states during execution:

- **Active**: the warp has started executing but isn't done. Having many active warps simultaneously is what gives you high **occupancy** (the ratio of active warps to the maximum number of active warps the SM can hold).
- **Eligible**: an active warp that's ready to execute its next instruction right now.
- **Stalled**: an active warp that's blocked, usually waiting on a memory fetch from VRAM or a long arithmetic operation.
- **Selected**: the warp the warp scheduler actually chose to run on this clock cycle.

The scheduler picks from the eligible warps each cycle. The goal is to always have something eligible, so when one warp stalls, another is ready to run. High occupancy helps with this because you have more warps to draw from.

**Issue efficiency** measures how effectively the scheduler keeps the execution pipelines busy. It drops when warps stall faster than other warps become eligible, or due to warp divergence.

### 5.2 Warp divergence

Warp divergence happens when threads within the same warp take different paths through an `if/else` branch. Because all 32 threads in a warp execute the same instruction at the same time (SIMT, Single Instruction Multiple Threads), divergence forces the warp to execute both branches serially: run the `if` branch with the threads that took that path active, then run the `else` branch with the other threads active.

The penalty is roughly proportional to how balanced the split is. A 50/50 split is worst case, you're effectively halving your parallelism. A 95/5 split is much better.

This is one of those things that's easy to reason about in theory but bites you in practice when you're writing kernels with conditional logic.

---

## 6. Bottleneck calculation

### 6.1 Working through an example

The reading gives a concrete example of calculating hardware bottlenecks on an H100, which I found really useful. The H100 SM can run a maximum of 32 thread blocks or 64 warps, has 65,536 registers, and 228 KB of shared memory.

Suppose your program uses 32 threads per block (one warp per block), 8 registers per thread, and 12 KB of shared memory per block. What's the bottleneck?

**Register limit**: 32 threads × 8 registers = 256 registers per block. Total registers / registers per block = 65,536 / 256 = 256 blocks. So registers aren't the bottleneck, you could run 256 blocks before running out of registers.

**Hardware block limit**: the SM can only run 32 blocks at once regardless. So this is a limit, but not the tightest one.

**Shared memory limit**: 228 KB / 12 KB per block = 19 blocks. This is the bottleneck. Shared memory limits you to 19 concurrent blocks per SM.

So in this scenario, you're not memory bandwidth bound, you're not register bound, you're bound by shared memory capacity. Knowing this tells you where to focus optimization: either reduce shared memory usage per block, or accept the 19-block limit and make sure each block does enough work to justify it.

### 6.2 The value of this analysis

This kind of bottleneck analysis is what separates "runs on a GPU" from "runs efficiently on a GPU." You can have code that uses the GPU but leaves most of the hardware idle because you're hitting one limit while all the others have headroom. The Roofline model and occupancy calculations together give you a systematic way to find which constraint is actually binding.

---

## 7. Memory access patterns

### 7.1 Memory coalescing

GPUs improve memory bandwidth utilization through **coalescing**: when multiple threads in a warp access memory addresses that are adjacent to each other, the hardware merges those accesses into a single memory fetch (called a DRAM burst). So 32 threads each reading from consecutive addresses becomes one memory transaction instead of 32 separate ones.

The practical implication is that your memory access pattern matters a lot. If thread `i` reads element `A[i]`, that's a coalesced access. If thread `i` reads element `A[i * 32]`, that's a strided access that can't be coalesced, and you're potentially using 1/32 of your memory bandwidth.

### 7.2 Bank conflicts

Shared memory (the fast per-SM cache) is physically divided into 32 **banks**. The hardware can access all 32 banks simultaneously, so in the ideal case 32 threads can read from shared memory in a single cycle.

A **bank conflict** happens when multiple threads in a warp try to access different addresses that happen to be in the same bank. Because one bank can only service one access at a time, the requests serialize, you get 2-way, 4-way, or even 32-way bank conflicts that degrade shared memory bandwidth proportionally.

The standard fix is to pad shared memory allocations slightly (add one extra element per row, for instance) to shift the alignment so that what would be conflicting accesses end up in different banks. This is one of those micro-optimizations that can give 2-5x speedups on memory-intensive kernels.

---

## 8. Reflections

GPU architecture is one of those topics that I found much more coherent once I understood the fundamental constraint: the hardware is trying to hide memory latency through massive parallelism, and all the design decisions (warp scheduling, thread hierarchy, coalescing, occupancy) flow from that one goal.

The Roofline model and the occupancy/bottleneck calculations are the kind of mental tools I want to actually use when I'm writing or optimizing GPU code, not just as abstract concepts but as actual analysis steps. I've been in the habit of just "trying things and seeing if they're faster," which works but is a lot slower than actually reasoning about which constraint you're trying to improve.

Next week we're getting into compiler abstractions (Triton and TVM), which I think will build directly on this hardware understanding.

---

## 9. Links & References

- Modal GPU Glossary: https://modal.com/gpu-glossary
- NVIDIA H100 Architecture: https://resources.nvidia.com/en-us-tensor-core/gtc22-whitepaper-hopper
