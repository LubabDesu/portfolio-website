---
title: "Encoder and Decoder Blocks"
slug: "transformer-encoder-decoder"
description: "How encoder and decoder stacks are structured and how information flows between them."
date: "2026-02-15"
tags: ["Transformers", "Encoder", "Decoder", "Architecture"]
projectSlug: "transformer"
status: "wip"
---

## 1. Introduction

This post explains each block in encoder and decoder stacks and why each sublayer exists.

## 2. Background / Motivation

Outline how modular blocks enable depth, reuse, and scaling.

## 3. Approach / Implementation

### 3.1 Encoder Block

- Self-attention
- Feed-forward network
- Residual plus layer norm

### 3.2 Decoder Block

- Masked self-attention
- Cross-attention to encoder outputs
- Feed-forward network

### 3.3 Data Flow

Track tensor shapes through one full forward pass.

## 4. Results / Findings

List implementation gotchas, especially masking and shape alignment.

## 5. Reflections / Future Work

Add diagrams and pseudocode snippets in child posts.

## 6. Conclusion

Encoder and decoder stacks are reusable compositions of attention and feed-forward layers.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
