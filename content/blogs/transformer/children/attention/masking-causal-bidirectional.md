---
title: "Masking: Causal vs Bidirectional"
slug: "transformer-masking-causal-vs-bidirectional"
description: "How masking strategy changes what each token can attend to during training and inference."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Masking"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

Masking controls visibility in attention and defines model behavior.

## 2. Background / Motivation

Autoregressive generation and bidirectional encoding require different constraints.

## 3. Approach / Implementation

### 3.1 Causal Masking

Causal masking blocks attention to future tokens, so each position only sees the past and present.  
That is what makes autoregressive generation valid at training and inference time.

### 3.2 Bidirectional Attention

Bidirectional masking allows a token to attend both left and right context.  
This is great for understanding tasks, but it does not match next-token generation constraints.

### 3.3 Padding and Combined Masks

Padding masks remove fake tokens introduced for batching.  
In practice, models combine causal and padding masks, and most bugs come from shape/broadcast mismatches.

## 4. Results / Findings

The most common failure is silently attending to padding, which hurts quality in a hard-to-debug way.  
Another frequent issue is using a mask convention opposite to what the framework expects.

## 5. Reflections / Future Work

A small mask-visualization helper catches many issues before full training runs.  
I want to keep one example per mask type in tests as a guardrail.

## 6. Conclusion

Mask choice is a core design decision, not just an implementation detail.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
