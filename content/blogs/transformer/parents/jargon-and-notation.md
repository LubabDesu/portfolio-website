---
title: "Transformer Jargon and Notation"
slug: "transformer-jargon"
description: "Quick-reference glossary for transformer terminology, symbols, and tensor shapes."
date: "2026-02-15"
tags: ["Transformers", "NLP", "Deep Learning", "Jargon"]
projectSlug: "transformer"
status: "wip"
---

## 1. Introduction

This post will define some common jargon and notation that one should know before going further into this very very deep rabbit hole of machine learning

## 2. Background / Motivation

Readers often get blocked by overloaded terms like token, embedding, context window, hidden size, and head dimension.

## 3. Reference Terms

### 3.1 Core Terms

- Token:
  Intuitively, think of tokens as components of words. So for instance, if "smart" is (0) and "er" of index (1) are both tokens in our vocabulary, then "smarter" will be tokenised to "smart", "er" --> (0), (1)

- Embedding: Embeddings are like how the model understands the tokens. Formally embeddings are high-dimensional values of tokens that is contextualised and represents its meaning.

- Positional encoding: in language, and in many other faucets of life, the order of things matter. "The cat sat on the mat" vs "The mat sat on the cat" has some differences in meaning... so positional encoding is when each token is also "equipped" with a position to tell the model at which part of the sentence / input the token is at.

- Attention head: The key to transformer's success in my opinion (and many others' opinions)
  Attention head intuitively tells you how each token relates to one another. A high attention score between 2 tokens basically implies that they are highly related! like if bank and river has a high attention score, the model is thinking something like "oh bank here probably relates more to the water body than the financial institution"

- Encoder : Part of the trasnformer architecture. It basically understands the input in a higher dimension, or helps the model get a richer understanding of the input

- Decoder : Part of the transformer architecture as well. Takes an input / representation and literally "decodes" it as the name suggests. It produces output tokens autoregressively, or token-by-token. The next token i is basically conditioned upon the previously generated tokens from 1 to i-1, and this process is known as autoregressive generation.

### 3.2 Common Symbols

- B: batch size
- T/S/N: sequence length
- d_model: hidden dimension
- h: number of attention heads
- d_k: per-head key/query dimension

### 3.3 Shape Cheatsheet

- Input embeddings: `(B, T, d_model)`
- Q/K/V per head: `(B, h, T, d_k)`
- Attention scores: `(B, h, T, T)`

### 3.4 Intuition for concepts

Some concepts were initially pretty hard for me to grasp, so I seeked getting a human understandable intuition for each of the concepts.

- Query, Key, Value vectors : Think of it like this. Imagine you are the token - Query vector for a token is telling us "What am I looking for", Key vector is "What type of information do I have" and Value vector is "What I actually contain"
  Ultimlately attention score is a calculation of relevance, hence the Query and Key vectors are compared (usually with dot product or something similar)

## 4. Results / Findings

NIL

## 5. Reflections / Future Work

NIL

## 6. Conclusion

This post is the shared vocabulary layer for the rest of the transformer series.

## 7. Links & References

- Paper: https://arxiv.org/abs/1706.03762
