---
title: "Multi-Query Attention"
slug: "transformer-mqa"
description: "How sharing K/V heads across queries shrinks the KV cache without killing quality."
date: "2026-02-15"
tags: ["Transformers", "Attention", "MQA", "Inference Efficiency"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

When I first learned about multi-head attention, I took for granted that every head has its own Q, K, and V projections. That's just how it works, right? Turns out Noam Shazeer asked "wait, do they all actually need their own K and V?" back in 2019, and the answer was basically no. That's Multi-Query Attention — you keep per-head queries, but all heads share a single set of keys and values.

At first I thought this sounded like a weird corner-cutting trick, but the motivation becomes really clear once you understand what's bottlenecking inference in practice.

## 2. Background / Motivation

The issue isn't compute — it's memory bandwidth. During autoregressive decoding (generating one token at a time), the model has to load the K and V tensors for every previous token on every step. That is the KV cache, and it grows with sequence length. For standard MHA with h heads, you're storing 2 × h × d_k values per token per layer. That adds up fast.

_Think of it like reading a book: you can do arithmetic quickly in your head, but if you have to flip back to re-read the same passage on every single page, the bottleneck is the flipping, not the arithmetic._

GPUs are actually quite fast at doing the floating point ops in attention. But loading those K and V tensors from memory on every decode step? That's where time goes. The compute sits idle waiting for data to arrive. This is called being memory-bandwidth bound.

So Shazeer's idea was: what if we just have one K and one V for all h heads? Each head still gets its own Q projection, so they still ask different questions. But they all look up answers from the same shared key-value store.

## 3. Approach / Implementation

### 3.1 The Change

In standard MHA, for h heads and model dimension d_model, each head i has:
- Q_i = X W_i^Q, where W_i^Q ∈ R^(d_model × d_k)
- K_i = X W_i^K, where W_i^K ∈ R^(d_model × d_k)
- V_i = X W_i^V, where W_i^V ∈ R^(d_model × d_v)

In MQA, you replace this with:
- Q_i = X W_i^Q (still h different Q projections)
- K = X W^K (one shared K projection)
- V = X W^V (one shared V projection)

Then head i computes attention normally: softmax(Q_i K^T / sqrt(d_k)) V.

That's the whole thing. It's a tiny change on paper.

### 3.2 KV Cache Savings

This is where it gets satisfying. With standard MHA, the KV cache for one layer stores:
- h × d_k values for K, per token
- h × d_v values for V, per token

With MQA, it's just:
- d_k values for K, per token
- d_v values for V, per token

Numerical Example: Say d_model = 4096 and h = 32 heads with d_k = 128. MHA KV cache per token per layer is 2 × 32 × 128 = 8192 values. MQA KV cache per token per layer is 2 × 128 = 256 values. That's a 32× reduction in KV cache size, which directly translates to faster memory loads during decoding.

### 3.3 What About Quality?

This was my main concern when I first read about this. You're throwing away a ton of parameters — doesn't that hurt? The paper reports that MQA is slightly worse than MHA on some tasks but the gap is smaller than you'd expect. The Q projections still vary per head, so different heads can still attend to different positions. They just can't use different views of the values.

The paper also notes that you can compensate somewhat by making other parts of the model bigger. Since you freed up memory, you can afford larger batch sizes or longer sequences for the same hardware budget.

## 4. Results / Findings

The main result from the paper is that MQA gives large speedups during autoregressive decoding with only small quality loss on encoder-decoder tasks. On the specific tasks Shazeer evaluated (translation, summarization), MQA came close to MHA quality while being significantly faster at inference time.

The memory bandwidth argument checks out in practice. The speedup isn't from doing fewer FLOPs — the number of attention operations doesn't change much. It's from loading far less data from memory per step.

What's also interesting is that MQA didn't really take off immediately in 2019. The paper sort of sat there quietly, and then once large-scale inference became the main bottleneck everyone cared about (GPT-3 era and after), people rediscovered it. PaLM used MQA. Falcon used MQA. It became a standard trick.

## 5. Reflections / Future Work

The memory bandwidth framing was a bit of a mindset shift for me. I was so used to thinking about ML efficiency in terms of FLOPs that I hadn't really internalized that at inference time, you can be bandwidth-bound instead. The roofline model from computer architecture explains this nicely — operations have both a compute cost and a memory cost, and whichever is slower dominates.

One thing that bothers me a little: all heads sharing K and V means the "diversity" of the attention patterns is limited by what different Q projections can extract from the same K. In MHA, head i can learn a completely different view of the sequence through its own K_i. In MQA, all heads ask different questions but they're all reading from the same lookup table. I don't have a strong intuition for how much this matters in practice vs in theory.

It also raised the question for me: is there a middle ground? Share K and V across some heads but not all of them? That's basically what GQA (Grouped Query Attention) does, and I'll get into that in the next article.

## 6. Conclusion

MQA is a simple idea with a concrete payoff. Share K and V across all heads, keep Q per-head. You get dramatically smaller KV cache (32× in the example above), faster decode steps because you're loading way less from memory, and you give up a modest amount of quality. For models that need to run efficiently at inference time with long contexts, that tradeoff is often worth it. It's one of those cases where a small architectural change has a big practical impact.

## 7. Links & References

- Paper (Shazeer 2019): https://arxiv.org/abs/1911.02150
