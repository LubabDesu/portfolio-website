---
title: "How PyTorch and TensorFlow actually execute your code"
slug: "mlsys-week2-frameworks"
description: "Week two of ML Systems. A deep dive into PyTorch's JIT compilation pipeline (TorchDynamo + TorchInductor) and TensorFlow's distributed dataflow architecture."
date: "2026-04-26"
tags: ["MLSys", "PyTorch", "TensorFlow", "Compilers", "Systems"]
projectSlug: "mlsys"
status: "draft"
---

## 1. Introduction

Week two is where things get more technical, we're looking at PyTorch and TensorFlow not as "tools for training models" but as systems with specific architectural choices and tradeoffs. The reading covers the original papers for both, so you get the design rationale, not just the API.

I'll be honest: before this week I had a pretty shallow understanding of what happens between `loss.backward()` and the actual GPU operations. This filled in a lot of that gap.

---

## 2. PyTorch's execution model

### 2.1 Eager mode vs graph mode

PyTorch has two main ways of executing code, and they represent fundamentally different philosophies.

**Eager mode** (the default) is define-by-run. Your model is just Python code, you call operations, they execute immediately, you can print intermediate values, you can use Python control flow. Debugging is extremely natural because it behaves like normal Python. The tradeoff is performance: Python is slow, and eager mode can't do the global optimizations (like fusing operations together) that a compiled graph could.

**Graph mode** is define-and-run. You first build a computation graph by tracing or scripting your model, then you execute that graph. The graph representation lets the system do things like operator fusion, hardware-specific optimization, and ahead-of-time compilation. The tradeoff is that it's much harder to debug, you're no longer looking at Python executing line by line, you're looking at an abstract graph representation.

The tension between these two has been the defining feature of the PyTorch-vs-TensorFlow debate for years. PyTorch won the research community largely because eager mode is so much easier to work with. But for production serving, you want the performance of graph mode. PyTorch 2.0's bet is: can we get graph-mode performance while keeping eager-mode usability? That's what TorchDynamo is about.

### 2.2 TorchDynamo: JIT compilation in Python

TorchDynamo is the JIT compiler introduced in PyTorch 2.0. The core idea is clever: instead of requiring you to write your model differently (as `torch.jit.script` did), TorchDynamo intercepts and recompiles regular Python code under the hood.

The mechanism it uses is CPython's frame evaluation hook. In CPython, a **frame** is the data structure that represents a function call, it holds the local variables, the bytecode being executed, etc. Python 3.8 introduced a hook that lets you intercept the evaluation of any frame before CPython runs it. TorchDynamo uses this to intercept PyTorch code as it's about to execute.

Here's the pipeline, roughly:

1. **Interception**: When Python is about to evaluate a frame, TorchDynamo creates a `PyFrameObject` and intercepts it.
2. **Initial checks**: Should we even bother compiling this? TorchDynamo skips things like standard library calls (numpy, etc.), previously failed compilations, and cache overflow situations.
3. **Guard evaluation**: Before reusing a compiled version, TorchDynamo checks guards, conditions like "this tensor still has shape `(32, 512)`." If the guards pass, use the cached compiled code. If not, recompile.
4. **Symbolic analysis**: TorchDynamo reads through the bytecode instruction by instruction, identifies PyTorch math operations, and extracts them into an FX Graph. Non-PyTorch code (pure Python control flow, etc.) becomes a "graph break", TorchDynamo falls back to normal Python execution for those parts.
5. **Bytecode replacement**: TorchDynamo generates new Python bytecode on the fly that calls the compiled graph instead of the original operations.

When a graph break happens, when TorchDynamo hits something it can't compile, it falls back to calling a "slow Python continuation function" to finish the work. Ideally you want your model to compile into one big graph with no breaks, but in practice breaks happen and TorchDynamo degrades gracefully.

### 2.3 TorchInductor: the compilation backend

TorchDynamo extracts the FX Graph. TorchInductor takes that graph and turns it into machine code. It's the compilation backend for PyTorch 2.0.

TorchInductor targets different hardware through different compilers: **Triton** for GPUs, **C++** for CPUs. I find this interesting because Triton is way closer to Python in feel than CUDA is, so targeting Triton is a somewhat unusual choice, but it makes the backend more hackable and portable.

One key mechanism is **decompositions**: before optimizing, TorchInductor breaks complex operations down into simpler primitives. `LayerNorm`, for instance, gets decomposed into `sum`, `sub`, `mul`, etc. The advantage is that the compiler only needs to learn how to optimize the small primitive operations, not every possible high-level operation. Then during optimization it can re-fuse those primitives in hardware-efficient ways.

The FX Graph uses a loop-level **intermediate representation (IR)**, which means the IR is itself executable Python code. Think of it as somewhere between raw machine code and high-level Python: more abstract than assembly, more structured than normal Python. This gives the IR a lot of expressive power without sacrificing analyzability.

### 2.4 Scheduling and fusion

The scheduling phase in TorchInductor decides two things: which operations get fused together, and what order the GPU kernels run in. It also handles memory planning, when can a buffer be freed, can this buffer be reused somewhere else?

**Operator fusion** is the process of combining multiple operations into a single GPU kernel. Why does this matter? Because every time you launch a separate GPU kernel, there's overhead, memory reads/writes, kernel launch latency. If you can fuse a `relu` into a `matmul` so they run in a single kernel, you avoid reading from and writing to global memory for the intermediate result. For long chains of element-wise operations after a matmul, fusion can give pretty dramatic speedups.

Triton Codegen (the part that actually generates Triton code) also introduces several targeted optimizations. **Indexing simplification** flattens multi-dimensional array access to 2D flat memory addresses, which apparently saves a lot of developer (and compiler) headache. **Common subexpression elimination (CSE)** reuses previously computed values rather than recomputing them. **Reduction modes** pick between using ultra-fast registers for small reductions or more complex loop structures for larger ones.

### 2.5 Dynamic shapes

One practical problem in production serving is that the shapes of your tensors change at runtime. Batch size varies depending on how many requests come in. Sequence length varies depending on the input. Some models have data-dependent output shapes.

This is a problem for compiled code, because traditionally you'd compile a kernel for a specific set of shapes. PyTorch 2.0 has several strategies for handling this. One is specialization, you compile separate kernels for specific shapes and cache them. For `0/1` specifically, PyTorch specializes to correctly capture broadcasting semantics (where a dimension of size 1 behaves differently from a dimension of size 2).

---

## 3. TensorFlow's architecture

### 3.1 Distributed dataflow

TensorFlow is architecturally a distributed dataflow system, which is a pretty different design philosophy from PyTorch. In a TF computation graph, vertices represent operations and edges represent data flowing between them. The graph is the primary abstraction, not Python code, but an explicit dataflow structure.

The key innovation that TensorFlow introduced (relative to earlier systems) is **mutable state**. In a pure dataflow system, nodes are stateless, they take inputs and produce outputs. TensorFlow added nodes that can hold mutable state in memory buffers. A variable node doesn't do the computation directly; instead, it **owns a buffer** (a chunk of memory). When you run a variable node, it gives you back a reference handle, basically a pointer to that buffer. This paradigm shift made in-place weight updates feasible at scale.

### 3.2 Why mutable state matters

Before this, if you wanted to update a weight during training, you basically had to throw away the existing graph and rebuild a new one with the updated values. For a model with a billion weights, that would be extraordinarily expensive. The mutable state design means you can update those weights in place, coordinate training steps (one machine can be reading while another is writing updates), and share those parameters across hundreds of machines in a cluster.

Think of it as: the variable is a name for a location in memory, not a value. When you do a weight update, you're updating what's stored at that location, not creating a new variable.

### 3.3 Fault tolerance

In large-scale distributed training, machines fail. Not occasionally, pretty much guaranteed, especially over long training runs. TensorFlow addresses fault tolerance through the graph structure itself rather than through some external checkpoint manager.

The system augments the computation graph with explicit `Save` and `Restore` operation nodes. Periodically, TensorFlow executes the `Save` nodes, which write the current values of all variable buffers to a persistent distributed file system. If a machine fails, execution is interrupted and the system restarts by executing the `Restore` nodes, pulling the most recent parameters back into memory. Because this is built into the graph, it's a first-class feature rather than something bolted on.

### 3.4 PyTorch vs TensorFlow

The comparison is interesting because the two systems are really targeting somewhat different pain points:

TensorFlow effectively solves the problem of distributed dataflow for very large models, its architecture is specifically designed for training across many machines with many parameters.

PyTorch's improvements in 2.0 are targeting a different bottleneck: native Python execution is too slow. TorchDynamo and TorchInductor are fundamentally about mitigating that bottleneck through JIT compilation, while keeping the Python-centric, eager-by-default developer experience.

Both have contributed enormously to the ML ecosystem. The interesting observation from the reading is that they've converged in some ways, TensorFlow has added eager execution support (tf.function for opt-in compilation), and PyTorch has added graph compilation. But their core architectural philosophies are still pretty different.

---

## 4. Reflections

The thing that stuck with me most is how much thought went into TorchDynamo's design. The decision to use CPython's frame evaluation hook is clever because it's completely transparent to the user, your existing code works without any changes. You get the performance of compiled code without having to restructure your model or sprinkle `@torch.jit.script` decorators everywhere.

I also found the TensorFlow variable/buffer paradigm genuinely interesting. The insight that "a variable is a pointer to a memory location, not a value" seems simple but it's what makes parameter sharing and in-place updates feasible at the scale of a billion-parameter model. That's a systems design decision that has real algorithmic consequences.

---

## 5. Links & References

- Ansel, J., et al. (2024). PyTorch 2: Faster Machine Learning Through Dynamic Python Compilation. https://arxiv.org/abs/2312.14238
- Abadi, M., et al. (2016). TensorFlow: A System for Large-Scale Machine Learning. https://arxiv.org/abs/1605.08695
