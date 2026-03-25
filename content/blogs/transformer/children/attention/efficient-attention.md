---
title: "Efficient Attention Approaches"
slug: "transformer-efficient-attention"
description: "Survey of strategies to reduce quadratic attention memory and compute costs."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Efficiency"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

Efficient attention variants target long-context workloads under hardware constraints.

## 2. Background / Motivation

Vanilla attention scales poorly with sequence length. It has a complexity of O(n^2), which is hence poses issues with long context lengths and also implies that memory requirements are also an issue. A lot of research has been done in this space to make attention keep its main use (of providing infomration on which key-value pairs are the most relevant), whilst reducing the time and space complexity of the attention mechanism itself. Below are some of the work that has been done in the field.

## 3. Approach / Implementation

### 3.1 Sparse Attention

Sparse methods compute only a subset of token pairs instead of all `N x N` interactions.  
While the theoretical bound is still O(n^2), it saves us a bunch of computations as not all N x N KV pairs are chosen.
Hence, we can save compute and memory, but crucially one key consideration is how we will decide which subset of the N tokens to compute attention for. There has to be some heuristic avaialble for us to accurately decide which tokens are worth calculating, and which are not. (look more into this)

### 3.2 Low-Rank and Kernel Methods

Low-rank and kernel approaches approximate full attention with cheaper math.  
They are often faster on long sequences, though approximation quality can vary by task. (REDO!!)

### 3.3 The attention by Kimi Moonshot AI (READ UP)

### 3.4 Practical Tradeoffs

Efficient attention is usually most helpful when context is large enough that vanilla attention becomes the bottleneck.  
For shorter contexts, the extra implementation complexity can outweigh speed gains.

## 4. Results / Findings

Approximation error is often acceptable in retrieval-heavy or broad-context tasks.  
Precision-sensitive tasks may still prefer exact attention if latency budget allows.

## 5. Reflections / Future Work

A benchmark by context length is essential, because crossover points can be surprising across hardware.  
I want to compare both wall-clock latency and memory peak, not just FLOPs.

## 6. Conclusion

Efficiency methods trade exactness for tractability at scale.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
