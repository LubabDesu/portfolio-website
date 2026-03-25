---
title: "Encoder Block Walkthrough"
slug: "transformer-encoder-block-walkthrough"
description: "Step-by-step walkthrough of one encoder block with tensor shapes and residual paths."
date: "2026-02-15"
tags: ["Transformers", "Encoder", "Architecture"]
projectSlug: "transformer"
parentSlug: "transformer-encoder-decoder"
status: "wip"
---

## 1. Introduction

Walk through one encoder block from input embeddings to output states.

## 2. Background / Motivation

Encoder blocks are reused deeply, so shape discipline matters.

## 3. Approach / Implementation

### 3.1 Self-Attention Sublayer

The encoder first runs self-attention so each token can gather context from the whole input.  
This is where token meaning starts shifting from local to context-aware.

### 3.2 Feed-Forward Sublayer

A position-wise MLP then transforms each token independently.  
You can think of this as feature refinement after context mixing.

### 3.3 Residual and Normalization

Residual paths preserve the previous signal so optimization stays stable.  
Layer norm keeps activations in a healthy range as depth increases.

## 4. Results / Findings

If training is unstable, I usually inspect norm placement and learning rate before anything else.  
Shape mistakes are easy to catch, but normalization mistakes can quietly degrade training.

## 5. Reflections / Future Work

Pre-norm is generally easier to train in deeper stacks, so it is my default.  
I still want a small side-by-side run to document when post-norm is fine.

## 6. Conclusion

Encoder blocks refine token representations through repeated attention and MLP composition.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
