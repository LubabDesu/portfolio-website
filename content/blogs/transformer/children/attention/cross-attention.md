---
title: "Cross-Attention"
slug: "transformer-cross-attention"
description: "How decoder queries attend to encoder outputs in sequence-to-sequence models."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Cross-Attention"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

Cross-attention connects decoder states to encoder context.

## 2. Background / Motivation

Needed for conditional generation tasks like translation and summarization.

## 3. Approach / Implementation

### 3.1 Source of Q, K, V

In decoder cross-attention, queries come from the decoder state, while keys and values come from encoder outputs.  
That design lets generated tokens ask focused questions about the source sequence.

### 3.2 Alignment Patterns

Early layers often learn rough alignment, while later layers refine details like agreement and wording.  
For translation-like tasks, you can often see source-target alignment emerge clearly.

### 3.3 Failure Cases

If encoder states are weak, cross-attention has little useful signal to retrieve.  
It can also over-focus on a few tokens and miss broader context, especially with noisy inputs.

## 4. Results / Findings

Cross-attention usually improves factual grounding because the decoder can directly re-check source tokens before generating.  
It is one of the key reasons encoder-decoder models stay strong on conditional generation tasks.

## 5. Reflections / Future Work

Simple heatmaps are helpful but incomplete.  
I want to add layer-wise alignment snapshots so it is easier to see where grounding breaks down.

## 6. Conclusion

Cross-attention is the bridge between generated tokens and source context.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
