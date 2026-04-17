---
title: "Deep Learning — CSE151B + Qwen3 4B Math Challenge"
slug: "cse151b-deep-learning"
description: "What I learned in deep learning class and the approaches I'm planning for a Qwen3 4B math reasoning challenge."
date: "2026-04-05"
tags: ["Deep Learning", "CSE151B", "Qwen3", "Fine-Tuning", "LoRA", "Math", "LLMs"]
projectSlug: "cse151b"
status: "published"
---

## 1. Introduction

CSE151B is the deep learning course at UCSD, and honestly it was one of the most satisfying courses I've taken as a Math-CS student. Not because it was easy — it really wasn't — but because for the first time things I'd been vaguely aware of (backprop, CNNs, overfitting) actually got explained properly and made sense.

This post is the overview for my CSE151B series. Part one covers what the course actually taught me, and part two covers a competition I'm about to do: fine-tuning or prompting Qwen3 4B to get the best possible performance on math problems. I'm going to document the whole process here as I figure it out.

---

## 2. What I learned in CSE151B

### 2.1 The basics: neural networks and backprop

A neural network is, at its core, just a composition of functions. You have an input, it flows through a bunch of layers, and you get an output. Each layer does a linear transformation followed by a nonlinear activation — ReLU, sigmoid, tanh, whatever. The forward pass is straightforward; you're just computing `f(g(h(x)))` over and over.

The hard part is training. Backpropagation is the algorithm that computes gradients through all those composed functions using the chain rule from calculus. IMO the math itself isn't that bad once you sit down and work through it — it's literally just the chain rule applied recursively. What tripped me up more was the bookkeeping: which dimension is which, where the transpose goes, what shape the gradient should be. That part took a while.

Gradient descent is then how you actually use those gradients: take a small step in the direction that reduces the loss. Stochastic gradient descent (SGD) does this on mini-batches instead of the full dataset, which is faster and honestly also helps with generalization in a way I still find a bit mysterious.

### 2.2 Training tricks that actually matter

This is where the course got really practical and also where I think a lot of people get tripped up. You can't just stack layers and gradient descent your way to a good model — there's a bunch of stuff you have to do right.

**Regularization** is about preventing overfitting, and there are a few main tools:
- _L2 regularization_ adds a penalty proportional to the squared magnitude of the weights. Intuitively it's like saying "all else equal, prefer smaller weights" — the model can't just memorize training examples by making some weights arbitrarily large.
- _L1 regularization_ is similar but uses absolute value, and it actually tends to push weights to exactly zero, which gives you sparsity.
- _Dropout_ randomly zeros out a fraction of activations during training. The intuition is that each neuron can't rely on any specific other neuron always being there, so the network learns more robust features. At test time you turn it off and scale the outputs.
- _Batch normalization_ normalizes activations within a layer to have zero mean and unit variance (then applies learned scale and shift). It makes training way more stable and lets you use higher learning rates. I was confused for a while about why it helps — the honest answer is it's a bit complicated and there are multiple competing explanations.

**Optimizers** also matter a lot more than I expected. Vanilla SGD works but converges slowly. Adam is the workhorse — it maintains per-parameter adaptive learning rates based on a running estimate of the first and second moments of the gradients. In practice you just use Adam and it works pretty well. There's also learning rate schedules (warm-up, cosine decay) that help a lot, especially for larger models.

**The generalization gap** is the difference between your training loss and validation loss. If it's big, you're overfitting. The train/val/test split matters: train on train, tune hyperparameters on val, evaluate on test. Never touch the test set until you're done. I know this sounds obvious but I've definitely accidentally snuck test set information into my decisions.

Transfer learning is huge in practice. Starting from a pretrained model and fine-tuning on your task almost always beats training from scratch, especially when you have limited data. The idea is that a model trained on a large general dataset has already learned useful representations, and you just need to adapt the last few layers (or all of them, depending on how different your task is).

### 2.3 CNNs

Convolutional neural networks are specifically designed for grid-structured data like images. The key operation is convolution: a small filter (say 3x3) slides across the input, and at each position computes a dot product. This gives the network _translational equivariance_ — if you shift the input, the feature maps shift too. Pooling (max pool, average pool) then downsamples the feature maps and gives some translational invariance.

Famous architectures: VGG is a straightforward deep stack of 3x3 convolutions — not fancy, but it worked really well for its time. ResNet introduced skip connections (residual connections), where the input of a block gets added directly to its output. This lets you train much deeper networks without the gradients vanishing. _Intuitively, the skip connection gives gradients a shortcut path to flow backwards — even if the block weights are tiny, the gradient can still propagate through the skip._

I actually found CNNs click faster than fully-connected networks for me, maybe because the spatial intuition is easier to hold onto.

### 2.4 Where transformers fit in

We covered the basics of transformers in the course, but I'm writing a whole separate series on that. The short version: transformers replaced RNNs as the dominant architecture for sequence data, and the key ingredient is self-attention, which lets every token directly attend to every other token regardless of how far apart they are. Attention is what this entire blog is partially named after, lol.

The connection to deep learning more broadly: transformers are just another neural network architecture. They still use backprop, still need regularization, still overfit, still benefit from the same optimizer tricks. Yea, the architecture is different, but the training machinery is the same.

---

## 3. The Qwen3 4B math challenge

### 3.1 What the challenge is

Qwen3 4B is a recent open-weight language model from Alibaba with 4 billion parameters. The challenge is to get it to perform as well as possible on math reasoning benchmarks — think GSM8K (grade school math word problems) and MATH (harder competition-style problems). The goal is to squeeze as much math reasoning ability as possible out of a 4B model, which is small enough to run on a consumer GPU but by default definitely not state-of-the-art on hard math.

This is interesting to me for a few reasons. One, math is a domain where you can actually evaluate correctness — either the answer is right or it isn't. Two, reasoning is one of the things LLMs are notoriously inconsistent at, so there's real room to improve. Three, 4B is a constrained size so you have to be clever.

### 3.2 Approaches I'm planning to try

There are a few different levers you can pull here, and they're not mutually exclusive:

**Supervised Fine-Tuning (SFT)** is the most direct approach. Take a dataset of (problem, solution) pairs — GSM8K, MATH, NuminaMath — and fine-tune the model on them. The model learns to produce outputs that look like the correct solutions. SFT is relatively simple to implement and can give solid gains, but it's fundamentally limited by the quality and coverage of your training data.

**LoRA / QLoRA** is how you actually make fine-tuning feasible on a 4B model without massive compute. Instead of updating all 4 billion parameters, LoRA adds small low-rank matrices to the attention weight matrices and only trains those. So instead of updating a big W, you update W + A×B where A and B are much smaller. QLoRA extends this by quantizing the base model weights to 4-bit, which cuts memory use dramatically. The tradeoff is you have less capacity for the fine-tuning to express itself — whether that's a serious constraint for math reasoning, I genuinely don't know yet.

**Chain of Thought (CoT) prompting** is on the prompting side rather than fine-tuning. You tell the model to "think step by step" before giving its final answer, and this actually improves performance on multi-step reasoning tasks quite a bit. The intuition is that the model is effectively given more "working space" — it can use the intermediate tokens as scratch work rather than having to jump straight to the answer. You can also provide few-shot examples of correct step-by-step reasoning in the prompt.

**Reinforcement learning methods** — RLHF, GRPO, PPO — are the more powerful but more complex approach. Instead of just imitating correct solutions, you train the model with a reward signal: it gets rewarded when it produces a correct answer. This lets the model potentially discover reasoning strategies that weren't in the training data, since it's optimizing for outcomes rather than imitating behavior. GRPO and PPO are specific algorithms for doing this. DPO (Direct Preference Optimization) is a cleaner alternative that sidesteps the need for a separate reward model by framing it as a classification problem. I'm genuinely not sure I'll have time to implement RL methods properly, but it's on the list.

**Self-consistency decoding** is a neat inference-time trick. Instead of generating one solution, you generate many (say 20) and then majority-vote on the final answer. This works because even if each individual sample has some chance of error, the correct reasoning path tends to be more consistent than the wrong ones. It doesn't require any fine-tuning, just more compute at inference time.

**Prompt engineering** — system prompts, few-shot examples — sounds almost too simple, but it can give meaningful gains, especially combined with CoT. Getting the format right matters; you want the model to output structured step-by-step solutions that are easy to parse for the final answer.

### 3.3 What I'm most unsure about

A few things I'm genuinely uncertain about going in:

How much does LoRA capacity limit the gains from SFT? If the task requires really absorbing new mathematical knowledge versus just adjusting the format and style of reasoning, a low-rank update might not be expressive enough. I don't know where math fine-tuning falls on that spectrum.

Whether RL methods are worth the engineering cost at this scale. In theory GRPO-style training should be very powerful for math since you have an exact verifier (check if the answer is right). In practice, RL training is notoriously finicky — reward hacking, unstable training, hyperparameter sensitivity. Not sure I can pull it off cleanly.

How much data diversity matters. GSM8K is pretty narrow and the model might have seen much of it already. MATH and NuminaMath cover more ground. I'm curious whether mixing these datasets actually helps or whether it just dilutes the signal.

---

## 4. Reflections

Deep learning was one of those courses that feels like it opens a lot of doors at once. You finish it knowing the basics of how basically everything in modern ML works, but also acutely aware that there are like ten more levels of depth below each topic you touched. The Qwen3 challenge is a chance to actually get my hands dirty with the LLM fine-tuning side, which the course only touched on.

I'll write more detailed child articles as I go through the actual experiments. Most of them will probably start with "this didn't work as well as expected," which honestly feels like how research is supposed to go.

---

## 5. Links & References

- Goodfellow, Bengio, Courville — _Deep Learning_ (the textbook): https://www.deeplearningbook.org/
- He et al. 2015, "Deep Residual Learning for Image Recognition" (ResNet): https://arxiv.org/abs/1512.03385
- Hu et al. 2021, "LoRA: Low-Rank Adaptation of Large Language Models": https://arxiv.org/abs/2106.09685
- Wei et al. 2022, "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models": https://arxiv.org/abs/2201.11903
- Wang et al. 2022, "Self-Consistency Improves Chain of Thought Reasoning in Language Models": https://arxiv.org/abs/2203.11171
- Rafailov et al. 2023, "Direct Preference Optimization": https://arxiv.org/abs/2305.18290
- Qwen3 model page: https://huggingface.co/Qwen/Qwen3-4B
