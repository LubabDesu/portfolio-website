---
title: "Attention in Transformers"
slug: "transformer-attention"
description: "Core mechanics of attention and why it replaced recurrence as the central operation."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Deep Learning"]
projectSlug: "transformer"
status: "wip"
---

## 1. Introduction

This post breaks down scaled dot-product attention as the core primitive behind transformers.

## 2. Background / Motivation

Show what long-range dependency handling looked like before attention-first models.

## 3. Approach / Implementation

### 3.1 Intuition

Explain query-key matching and value aggregation in plain language.

### 3.2 Math Walkthrough

- Score matrix: `QK^T / sqrt(d_k)`
- Weight matrix: `softmax(scores)`
- Output: `weights * V`

### 3.3 Tradeoffs

- Expressive and parallelizable
- Quadratic memory with sequence length

## 4. Results / Findings

Record common failure modes and shape mistakes.

## 5. Reflections / Future Work

Point to child posts for attention variants and optimizations.

## 6. Conclusion

Attention is the central abstraction that the rest of the architecture composes around.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
