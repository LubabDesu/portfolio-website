---
title: "Grouped Query Attention"
slug: "transformer-gqa"
description: "The middle ground between MHA and MQA — groups of heads share K/V projections."
date: "2026-02-15"
tags: ["Transformers", "Attention", "GQA", "Llama", "Mistral"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

After reading about MQA, the immediate question I had was: okay, sharing K/V across all heads is aggressive and gives you big speedups, but is there a smoother tradeoff? Going from 32 K/V head groups to 1 feels like a big jump. What if you just go to, say, 8?

That's the idea behind Grouped Query Attention from Ainslie et al. 2023. Instead of one shared K/V (MQA) or one K/V per Q head (MHA), you have g groups, and each group of Q heads shares one K and one V projection. It's simple, it interpolates between the two extremes, and it's now the default in most modern open-source LLMs — Llama 3, Mistral, Mixtral, Gemma all use it.

## 2. Background / Motivation

The motivation is basically: MQA's quality loss is real, even if it's small. Specifically, the paper notes that on some tasks the quality gap between MQA and MHA is big enough to matter, and this is particularly true when you try to take a pretrained MHA model and convert it to MQA post-hoc (which the paper also explores).

But the memory bandwidth problem MQA solves is real too. So the question is whether you can capture most of MQA's efficiency gains while recovering most of MHA's quality.

_Intuitively, I think of it like committee structures. MHA is everyone doing their own research. MQA is everyone reading from one shared briefing document. GQA is having research subteams — each subteam has its own shared notes, but different subteams have different notes._

The hypothesis is that nearby heads in MHA already tend to learn somewhat redundant K/V representations anyway, so grouping them and making them share doesn't cost much in quality. I don't know if that's actually been verified empirically at the level of individual head similarity, but it's a reasonable guess.

## 3. Approach / Implementation

### 3.1 The Grouping

Say you have h = 32 query heads and g = 8 groups. Each group has h/g = 4 query heads, and those 4 heads share one K projection and one V projection. So you now have:
- 32 Q projections (one per head, unchanged)
- 8 K projections (one per group)
- 8 V projections (one per group)

Head i belongs to group floor(i / (h/g)). All heads in a group use the same K and V to compute their attention outputs, then those outputs are concatenated and projected just like in standard MHA.

Numerical Example: With h = 32 heads, g = 8 groups, d_k = 128. MHA KV cache per token per layer: 2 × 32 × 128 = 8192 values. GQA KV cache per token per layer: 2 × 8 × 128 = 2048 values. MQA KV cache: 2 × 128 = 256 values. So GQA is 4× cheaper than MHA and 8× more expensive than MQA. It's genuinely in the middle.

### 3.2 Endpoints as Special Cases

One thing I liked about the paper's framing is that GQA unifies MHA and MQA as special cases:
- g = h: each head has its own K/V → standard MHA
- g = 1: all heads share one K/V → MQA
- 1 < g < h: GQA

This makes the design space feel clean. You have one knob (g) that controls the quality-efficiency tradeoff continuously.

### 3.3 Converting Pretrained MHA Models

The paper also proposes a method to convert an existing MHA checkpoint to GQA or MQA without full retraining. The idea is to take the h K/V head weight matrices and, for each group, mean-pool the corresponding head weights. So if you're going from h = 32 to g = 8, you take heads 0-3 and average their K weight matrices to get the single group-0 K matrix.

Then you do some additional pretraining (not full pretraining from scratch — more like a fine-tuning run on a fraction of the original training tokens) to let the model adapt.

This is actually really useful practically. You don't always have the budget to train a fresh model with GQA from scratch. Being able to convert Llama 2 (which used MHA) to something like Llama 3's architecture is valuable.

## 4. Results / Findings

The paper's main finding is that GQA with g = 8 (on a 32-head model) is nearly identical to MHA in quality and nearly as fast as MQA in inference speed. That's a pretty good deal.

More specifically on quality: the gap between MHA and GQA (g = 8) on summarization benchmarks is very small — within noise. The gap between MHA and MQA is more noticeable. So you recover most of the quality by just having a few groups rather than one.

On speed: most of the memory bandwidth savings come from reducing the KV cache size, and GQA with g = 8 already gets a 4× reduction vs MHA. Going from g = 8 all the way to g = 1 (MQA) gives another 8× on top — but that larger step also means giving up all the per-group flexibility. So in practice, GQA already captures a lot of the efficiency win without making that full commitment.

The conversion results are also interesting — converted models with a short fine-tuning run do close to as well as models trained with GQA from scratch. That was surprising to me. I expected more catastrophic forgetting or at least more quality loss. Apparently the mean-pooling initialization is actually a pretty good starting point.

## 5. Reflections / Future Work

What I find interesting here is less the math (it's genuinely just a simple grouping) and more the fact that this is now the standard. When a technique gets adopted by Llama 3, Mistral, and basically every competitive open-source model, it's not just because it's slightly clever — it's because the tradeoff it targets (good quality, reasonable KV cache, fast decoding) is exactly what you need for practical deployment.

I do wonder whether g = 8 is always the right choice or whether people are just copying Llama's hyperparameters. The paper suggests you should tune g, but in practice I see g = 8 everywhere. Maybe it's "good enough" and nobody wants to do the ablation.

Also: GQA is one axis of the quality-efficiency tradeoff, but it doesn't push as hard as it could on memory savings. DeepSeek's MLA approach (which I'll write about next) is way more aggressive — compressing the K/V representations into a low-dimensional latent space rather than just reducing the head count. GQA is clean and practical; MLA is "we really need to squeeze every bit of memory we can."

## 6. Conclusion

GQA sits in a sweet spot that MHA and MQA don't. MHA is quality-optimal but memory-heavy. MQA is fast but gives up some quality. GQA with g around 8 gets you most of MHA's quality and most of MQA's speed improvement for a 32-head model. The fact that you can also convert pretrained MHA models to GQA with short fine-tuning runs makes it practically useful beyond just new model training. It's not a particularly deep idea, but it's a well-executed one, which is why it's everywhere now.

## 7. Links & References

- Paper (Ainslie et al. 2023): https://arxiv.org/abs/2305.13245
- Llama 3 technical report: https://ai.meta.com/blog/meta-llama-3/
