---
title: "Multi-Head Attention"
slug: "transformer-multi-head-attention"
description: "Why multiple attention heads help capture diverse token relationships."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Multi-Head Attention"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

The attention mechanism is the core of every modern language model. ChatGPT, Gemini, Claude, and your favourite LLM uses attention at its core to "understand" language. But why multi-head attention? What's the point of multiple heads? What do they actually learn?

## 2. Background / Motivation

Single-head attention can under-represent diverse relationships. A single attention head computes only one weighted summary of the sequence. However, natural language in itself has multiple types of relationships and extremely rich. Having one singular head attempt to embody all these relationships will be perhaps a little too much for that head, and thus lead to some information loss. That singular head can't possibly capture syntactic, semnatic and coreference relationships all at once. However, we want to model language and capture the complex relationships as much as possible, as such, the solution proposed in the paper we all know, "Attention is all you need", is simple and elegant. Just have multiple heads then! Each head will have its own learned QKV projections, and eventually concatenate and project the outputs.

Intuitively, I like to think of it as having an individual vs having a team of 10 working on a task, but each member of the 10 focusses on just one aspect of the task. One would naturally expect the team of 10 to perform with much higher accuracy, or at least personally I believed that the team of 10 would most likely outperform the team of 1.

## 3. Approach / Implementation

### 3.1 Head Partitioning

Instead of one big attention operation, the model splits channels into multiple smaller heads.  
As aforementioned, each head gets its own Q/K/V projections and can specialize in different patterns, hence we are subdividing the model's total dimensions evenly across each head. The per-head dimension is hence d_k = d_model / h, where h is the number of heads.

Numerical Example : If the dimension of hte model is 512, and you want 8 heads, d_k = 512 / 8 = 64 per head.

### 3.2 Concatenation and Output Projection

The eventual outputs of each head are then concatenated together to get one output of d_model size, hence the overall computation and cost will be roughly the same as the original attention mechanism.

### 3.3 Practical Head Counts

How do we decide the number of heads? The more the merrier?

Not necessarily, more heads does not imply better results. If you consider the above equation, more heads means that the dimension of each head gets smaller.

Let's consider an extreme case : say we want 512 heads in the above example, then d_k = 512 / 512 = 1. Each head has a dimensino of 1, why is this bad? Because with a dimension of 1, it is extremely difficult to accurately capture complex relationships like semantics using on a dimension of 1. And more formally, each head loses expressiveness. Hence in practice, we need a balanced d_model and head count, which is part of hyperparameter tuning.

## 4. What and how do heads actually learn?

### 4.1 What the heads actually learn in practice

Probing experiements by researchers (Clark et al. 2019?) reveal that heads in trained BERT style models (encoder only) naturally specialize in a certain aspect, without any form of explicit supervision or instruction.

Head Type A : Syntactic dependency
Head Type B : Positional offset
Head Type C : Coreference
Head Type D : Rare token patterns
Head Type E : Local context
Head Type F : Semantic similarity

And very interestingly, which was counter to my initial belief when I first learnt this, not all heads are equal. Yes, some heads are less important than others (equality for heads??!!?!?) and Voita et al. even found that in many models, only a small subset of these heads are truly essential. The rest of the heads can actually be pruned without much performance loss. This has motivated sparse attention and head-pruning research, where they try to limit computations to the heads that actually matter.

### 4.2

## 4. Results / Findings

Multi-head attention tends to outperform single-head at similar model size because it captures multiple relation types in parallel.  
The tradeoff is extra projection overhead and memory movement.

## 5. Reflections / Future Work

A clean next step is a small ablation on head count while keeping parameter budget fixed.  
That usually reveals a sweet spot instead of a monotonic gain.

## 6. Conclusion

Multi-head structure improves representational coverage with manageable compute tradeoffs.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
