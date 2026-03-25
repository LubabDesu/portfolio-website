---
title: "Self-Attention"
slug: "transformer-self-attention"
description: "Detailed walkthrough of self-attention mechanics and tensor shapes."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Self-Attention"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

Deep dive into how self-attention computes contextualized token representations.

## 2. Background / Motivation

Explain why pairwise token interaction is powerful.

## 3. Approach / Implementation

### 3.1 Q, K, V Projection

Each token vector is projected three ways: query, key, and value.  
You can think of query as "what I am looking for," key as "what I offer," and value as "the information I pass along."

### 3.2 Score Computation and Softmax

We score token-to-token relevance with a dot product between queries and keys.  
After scaling and softmax, each row becomes attention weights that sum to 1, so every token builds a weighted view of the full sentence.

### 3.3 Output Aggregation

Those weights are used to mix value vectors into a new representation per token.  
The result is contextual: the same word can end up with different meaning depending on surrounding words.

## 4. Results / Findings

In practice, this lets models capture long-distance relationships that RNN-style models often struggle with.  
A useful sanity check is that attention weights should be sharp for decisive context and flatter for ambiguous context.

## 5. Reflections / Future Work

I still find attention maps useful for debugging, but they are not a full explanation of model reasoning.  
Next step is pairing maps with token-level ablations for better interpretability.

## 6. Conclusion

Self-attention provides context-sensitive token representations in one parallel operation.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
