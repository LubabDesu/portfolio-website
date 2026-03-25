---
title: "Decoder Block Walkthrough"
slug: "transformer-decoder-block-walkthrough"
description: "Step-by-step walkthrough of masked self-attention, cross-attention, and generation flow."
date: "2026-02-15"
tags: ["Transformers", "Decoder", "Architecture"]
projectSlug: "transformer"
parentSlug: "transformer-encoder-decoder"
status: "wip"
---

## 1. Introduction

Walk through one decoder block with focus on autoregressive constraints.

## 2. Background / Motivation

Decoder behavior determines generation quality and latency.

## 3. Approach / Implementation

### 3.1 Masked Self-Attention

The decoder attends only to previous tokens, never future ones.  
That keeps training behavior aligned with autoregressive inference.

### 3.2 Cross-Attention with Encoder Outputs

After self-attention, decoder states query encoder outputs for source information.  
This is how generation stays grounded in the input rather than only in prior generated tokens.

### 3.3 Final Projection to Vocabulary

The block output is mapped to vocabulary logits, then softmax gives token probabilities.  
At decode time, sampling strategy (greedy, top-k, nucleus) strongly affects output style.

## 4. Results / Findings

Two common bugs are off-by-one target shifts and incorrect causal masks.  
Both can produce fluent-looking output that is actually poorly trained.

## 5. Reflections / Future Work

Key/value caching is a major speedup for long generation runs and is worth implementing early.  
I also want to document how cache shape changes when batching variable-length prompts.

## 6. Conclusion

Decoder blocks combine constrained context use with source conditioning for controlled generation.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
