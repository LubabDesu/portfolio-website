---
title: "Attention in Transformers"
slug: "transformer-attention"
description: "Core mechanics of attention and why it replaced recurrence as the central operation."
date: "2026-02-15"
tags: ["Transformers", "Attention", "Deep Learning"]
projectSlug: "transformer"
status: "published"
---

## 1. Introduction

If I had to pick one concept that made modern language models possible, it's this one. Attention is the reason GPT, Claude, Gemini, and every other LLM you've heard of can actually understand context — not just the word right in front of them, but how words relate across an entire sentence or paragraph. I spent an embarrassingly long time being confused by it, and then one day it just clicked. Hopefully I can save you some of that confusion.

## 2. Background / Motivation

To understand why attention matters, you need to know what came before it.

Before transformers, the dominant approach for sequence modeling was RNNs (Recurrent Neural Networks) and their fancier cousins, LSTMs. The basic idea was to process tokens one by one, left to right, passing a hidden state from step to step like a game of telephone. That hidden state was supposed to carry the "memory" of everything that came before.

The problem? The further back a piece of information was, the harder it was to remember. By the time you're processing the 50th word in a sentence, the hidden state has been updated 49 times, and whatever signal from the first word was there has been slowly diluted. This is the infamous **vanishing gradient problem** — gradients shrink exponentially as you backprop through many timesteps, and the model stops learning long-range dependencies.

LSTMs helped by adding gating mechanisms to control what gets remembered and what gets forgotten, but it was still fundamentally sequential — you couldn't process token 5 until you'd finished with tokens 1 through 4. No parallelization, slow training, and long-range context still suffered.

Then came "Attention Is All You Need" (Vaswani et al., 2017), and the whole paradigm shifted. The key insight: instead of passing context through a chain of hidden states, let every token directly attend to every other token simultaneously. No sequentiality. No bottlenecked hidden states. Just direct pairwise comparison.

## 3. Approach / Implementation

### 3.1 Intuition

Here's the framing that actually made it click for me. Imagine you're trying to understand the word "bank" in a sentence.

In "I deposited money at the bank", bank relates strongly to "deposited" and "money".  
In "We sat by the river bank", it relates more to "river" and "sat".

Attention lets the model ask: _for this word, which other words matter most?_ And it answers that question by comparing a learned "query" vector from the current token against "key" vectors from all other tokens. High similarity = pay more attention. Low similarity = mostly ignore.

_Think of it like a search engine, but inside the model. Your query is what you're looking for. The keys are what every other token offers. The values are what you actually get back when there's a match._

### 3.2 Math Walkthrough

The formal operation is called **scaled dot-product attention**, and it's not as scary as it sounds.

You start by projecting each token's embedding into three vectors: Q (query), K (key), and V (value). These are learned linear projections — the model figures out what good queries, keys, and values look like through training.

Then you compute attention scores by taking the dot product of each query against all the keys:

```
scores = Q * K^T
```

This gives you a matrix of raw relevance scores — every token against every other token. But there's a catch. In high dimensions, dot products can get very large, and if you just run softmax on huge values, the gradients become tiny and learning stalls. So you scale down by the square root of d_k (the key dimension):

```
scaled_scores = Q * K^T / sqrt(d_k)
```

Then softmax turns those scores into weights that sum to 1:

```
weights = softmax(scaled_scores)
```

And finally, you use those weights to take a weighted average of the value vectors:

```
output = weights * V
```

Each token's output is a weighted blend of every other token's values, where the weights came from learned relevance. Three matrix multiplications and a softmax. That's the core of the whole thing.

### 3.3 Tradeoffs

Full parallelization: every token attends to every other token simultaneously, so training can actually use GPUs the way they're meant to be used. And genuine long-range dependency modeling: token 1 and token 100 can directly influence each other, no chain of updates in between.

The cost is that the scores matrix is O(T²) in sequence length. For short sequences, not a problem. For 100k tokens you're computing 10 billion pairwise scores, and memory explodes. That quadratic scaling is what drove a ton of follow-up work in efficient attention, which I cover in a separate post.

## 4. Results / Findings

The original paper's results were pretty decisive. On translation benchmarks (WMT 2014 English-to-German, English-to-French), the transformer outperformed every prior model while training in a fraction of the time, because of the parallelization. RNN-based models were trained sequentially on GPUs that were being used like CPUs — attention let the actual parallel compute capacity of the hardware be used properly.

One thing that surprised me is that attention also turned out to be surprisingly interpretable, at least superficially. You can visualize the attention weights and often see the model focusing on relevant words. "bank" attending to "river" in one context, attending to "money" in another. It doesn't always tell you the full story of what the model is doing, but it's a lot more inspectable than the internals of an LSTM hidden state.

## 5. Reflections

The scaling by sqrt(d_k) is one of those things that's easy to overlook but genuinely matters. The original paper barely dwells on it, but if you remove it and train, your loss curves look a lot worse. It's a small numerical stabilization trick that makes a real difference in practice.

What I find most interesting in hindsight is how much of what transformers can do follows from just this one operation. Position encoding, multi-head attention, cross-attention in encoder-decoder models — they're all layered on top of this same primitive. Get the core mechanism, and the rest of the architecture starts to feel logical rather than arbitrary.

## 6. Conclusion

Attention is the mechanism that lets every token in a sequence directly look at every other token, weighting its outputs by learned relevance scores. It replaced recurrence because it's parallelizable and handles long-range context without degradation. Everything else in the transformer — multi-head attention, masking, cross-attention — builds on this foundation.

The child posts in this series go deeper into specific variants and tradeoffs: multi-head attention, self-attention mechanics, causal vs. bidirectional masking, and efficient attention approaches for long sequences.

## 7. Links & References

- Vaswani et al. 2017, "Attention Is All You Need": https://arxiv.org/abs/1706.03762
