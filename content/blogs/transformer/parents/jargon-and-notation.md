---
title: "Transformer Jargon and Notation"
slug: "transformer-jargon"
description: "Quick-reference glossary for transformer terminology, symbols, and tensor shapes."
date: "2026-02-15"
tags: ["Transformers", "NLP", "Deep Learning", "Jargon"]
projectSlug: "transformer"
status: "published"
---

## 1. Introduction

This post will define some common jargon and notation before going further into this very, very, VERY deep rabbit hole of machine learning.

## 2. Background / Motivation

Readers often get blocked by overloaded terms like token, embedding, context window, hidden size, and head dimension.
When I first started out, all these terms really threw me off and I was just so confused, but after some time all these concepts just clicked. Spend some time grappling with it and you will be good!

## 3. Reference Terms

### 3.1 Core Terms

**Token** — The basic unit of text a model works with. A tokenizer splits your input into tokens before the model sees anything. And yes! A token can be a word, a subword chunk, punctuation, or a space.

_Intuitively, think of tokens as components of words. So for instance, if "smart" is (0) and "er" of index (1) are both tokens in our vocabulary, then "smarter" will be tokenised to "smart", "er" --> (0), (1)_

---

**Embedding** — A fixed-length vector of numbers that represents a token. Each token ID maps to this vector via a learned lookup table at the start of the model.

_Embeddings are like how the model understands the tokens. Formally embeddings are high-dimensional values of tokens that is contextualised and represents its meaning._

---

**Positional encoding** — A signal added to each token's embedding that tells the model where that token sits in the sequence. Without it, attention has no concept of order.

_In language, and in many other faucets of life, the order of things matter. "The cat sat on the mat" vs "The mat sat on the cat" has some differences in meaning... so positional encoding is when each token is also "equipped" with a position to tell the model at which part of the sentence / input the token is at._

---

**Attention head** — One attention computation with its own learned Q, K, V weight matrices. Models run many heads in parallel so each can specialize in different token relationships.

_The key to transformer's success in my opinion (and many others' opinions). Attention head intuitively tells you how each token relates to one another. A high attention score between 2 tokens basically implies that they are highly related! like if bank and river has a high attention score, the model is thinking something like "oh bank here probably relates more to the water body than the financial institution"_

---

**Encoder** — The stack of blocks that reads the full input and builds a contextual representation of each token. Every token can attend to every other token (bidirectional).

_Part of the transformer architecture. It basically understands the input in a higher dimension, or helps the model get a richer understanding of the input._

---

**Decoder** — Generates output tokens one at a time, each conditioned on all previously generated tokens. In encoder-decoder models it also attends to encoder outputs via cross-attention.

_Part of the transformer architecture as well. Takes an input / representation and literally "decodes" it as the name suggests. It produces output tokens autoregressively, or token-by-token. The next token i is basically conditioned upon the previously generated tokens from 1 to i-1, and this process is known as autoregressive generation._

---

**Context window** — The maximum number of tokens a model can attend to in one forward pass. Anything beyond this limit is completely invisible to the model.

_Very simply put, it's the short term "memory"._

---

**Hidden state** — A token's vector representation at a given layer. It starts as the raw embedding and gets updated by each successive block as it passes through the network.

_Intuitively, it's how the model understands what each word mean. The word "a" can look like [1,2,3,4] to a model._

---

**Layer norm** — Normalizes a token's feature vector across its dimensions, keeping values from growing too large or too small as the network gets deeper.

_To gain intuition — say a token's features are `[2, 5, 8]`:_

```
mean       = (2 + 5 + 8) / 3 = 5
std        = sqrt(((2-5)² + (5-5)² + (8-5)²) / 3) ≈ 2.45
normalized = [-1.22, 0.0, 1.22]
```

_All features are now centred at 0 with unit variance. No single feature dominates, and gradients stay healthy deep in the network._

---

**Feed-forward network (FFN / MLP)** — A two-layer MLP applied to each token independently after attention. Adds a non-linear transformation on top of what attention mixed together.

_Intuitively, how I understood it was how the model further understood it. Attention told me what I should pay attention to, and this FFN layer tells me what I know or understand from whatever needed attention._

---

**Logits** — Raw, unnormalized scores from the final linear layer, one per vocabulary token at each position.

_Literally the unfiltered opinion of the model._

---

**Softmax** — Turns a vector of logits into a probability distribution that sums to 1. Used in attention (score to weight) and at the output head (logit to token probability).

_To filter the unfiltered opinion. Say the model's logits for the next token are:_

```
logits:   [2.0,  1.0,  0.1]   →  ["cat", "dog", "fish"]
exp:      [7.39, 2.72, 1.11]  →  sum = 11.22
softmax:  [0.66, 0.24, 0.10]  →  66% cat, 24% dog, 10% fish
```

---

**Cross-entropy loss** — The training signal. Measures how surprised the model is by the correct next token. `loss = -log(p_correct)`. Lower is better.

_If the image was a cat, and the model outputs 90% confidence that it is a cat, then the loss is low (-log(0.9) = 0.105), conversely if the model only outputs a confidence of 10%, then the loss is very high (-log(0.1) = 2.302). Basically, it penalizes confident wrong predictions and rewards confident correct ones._

---

**Vocabulary / vocab size (V)** — The full set of tokens the model knows. Every input maps into this set at tokenization time, and every output is a distribution over all V tokens.

### 3.2 Common Symbols

- B: batch size
- T/S/N: sequence length
- d_model: hidden dimension (size of every token's vector throughout the model)
- h: number of attention heads
- d_k: per-head key/query dimension (`d_model / h`)
- d_v: per-head value dimension (usually equal to d_k)
- V: vocabulary size (number of distinct tokens the model knows)
- L: number of layers (depth of the model)
- W_Q, W_K, W_V: learned projection matrices that produce Q, K, V from the input
- W_O: output projection matrix applied after concatenating all attention heads

### 3.3 Shape Cheatsheet

- Input embeddings: `(B, T, d_model)`
- Q/K/V per head: `(B, h, T, d_k)`
- Attention scores: `(B, h, T, T)`

### 3.4 Intuition for concepts

Some concepts were initially pretty hard for me to grasp, so I seeked an intuition I could actually hold onto for each concept.

- Query, Key, Value vectors : Think of it like this. Imagine you are the token - Query vector for a token is telling us "What am I looking for", Key vector is "What type of information do I have" and Value vector is "What I actually contain"
  Ultimlately attention score is a calculation of relevance, hence the Query and Key vectors are compared (usually with dot product or something similar)

## 4. Terms I Found Most Confusing Initially

QKV, especially the difference between Query and Keys!

## 5. Conclusion

There is a lot more jargon and notation in the ML/AI world, which I am very new to as well, but follow me as I learn, and hopefully learn from whatever I already know if you are just starting out! I think it is a super cool space to be in, although it's expanding at a crazy pace ;-;!!

## 6. Links & References

- Vaswani et al. 2017, "Attention Is All You Need": https://arxiv.org/abs/1706.03762
