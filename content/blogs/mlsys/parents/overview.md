---
title: "ML Systems: what I'm learning and why it matters"
slug: "mlsys-overview"
description: "Overview of my CSE 291 ML Systems reading series at UCSD. Covers the full stack from deployment philosophy to GPU hardware to compiler abstractions."
date: "2026-04-26"
tags: ["MLSys", "Systems", "GPU", "Compilers", "Overview"]
projectSlug: "mlsys"
status: "draft"
---

## 1. What this series is

I'm taking CSE 291 (ML Systems) at UCSD this quarter, and I'm documenting the weekly readings here. Not as formal summaries, more as "what actually clicked for me and why."

The course covers the full stack of building and deploying ML systems in production: frameworks, hardware, compilers, distributed training, inference optimization. It's the part of ML I've always known matters but never had a structured way to learn.

---

## 2. Why ML Systems specifically

Most ML education focuses on the modeling side: architectures, training objectives, evaluation. That's all important, but it leaves a big gap. Why does PyTorch 2.0 compile your code? What's actually happening when a GPU runs a matmul? Why does Flash Attention exist and why is it faster?

ML Systems is where those questions get answered. The field exists because ML at production scale has systems problems that pure modeling doesn't touch: silent failure modes, distributed training coordination, memory hierarchy optimization, hardware-specific compilation. Once AlexNet showed that scale beats clever algorithms, the bottleneck shifted to infrastructure, and MLSys became the field that deals with that.

---

## 3. Series roadmap

**Week 1: The paradigm shift.** What makes ML systems different from regular software. Code-dependent vs data-dependent. Silent vs explicit failures. The AI Systems Triangle (Models, Data, Infrastructure as interdependent pillars) and the 5 Pillars of AI Engineering.

**Week 2: Frameworks.** How PyTorch and TensorFlow actually execute your code. TorchDynamo's JIT compilation through CPython's frame evaluation hook, TorchInductor as the compilation backend, and TensorFlow's distributed dataflow architecture with mutable state.

**Week 3: GPU architecture.** How GPUs actually work. Streaming Multiprocessors, warp scheduling, memory hierarchy, the Roofline model for bottleneck analysis, latency hiding via Little's Law, memory coalescing, and bank conflicts.

**Week 4: Compiler abstractions.** Triton raises the programming abstraction from threads to tiles, letting the compiler handle parallelism. TVM takes an end-to-end approach: graph-level operator fusion, data layout transformation, and extensible hardware intrinsics via tensorization.

---

## 4. Prerequisites

Basic familiarity with ML training (what a forward and backward pass are) and some Python. You don't need to know CUDA or systems programming going in, though week 3 and 4 will go deeper if you do.
