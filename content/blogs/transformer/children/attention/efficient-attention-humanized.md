---
title: "Efficient attention approaches"
slug: "transformer-efficient-attention-humanized"
description: "A survey of strategies to reduce the quadratic memory and compute costs of vanilla attention, from sparse methods to kernel approximations."
date: "2026-03-23"
tags: ["Transformers", "Attention", "Efficiency"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

> **Accuracy flags before you review:**
>
> - [Section 7, References]: The linked paper (arxiv 1706.03762) is "Attention Is All You Need" — the original transformer paper. That's likely not what you meant here; you probably want links to the specific efficient attention papers (e.g., Sparse Transformer, Longformer, Linformer, FlashAttention, etc.).
> - [Section 3.3]: "Kimi Moonshot AI" attention — I'm not certain which specific mechanism you're referring to. Kimi (Moonshot AI) is a Chinese AI lab known for long-context work (e.g., their MoonCake KV cache paper), but the most widely-cited "efficient attention from a Chinese lab" in 2024–2025 is DeepSeek's MLA (Multi-head Latent Attention from DeepSeek-V2). Could be either. Left as TODO — please fill in the paper name.

## 1. Introduction

Vanilla attention is very powerful but it doesn't scale — the `O(n²)` complexity means doubling your sequence length quadruples your memory and compute. A ton of research has gone into making it cheaper without throwing away what actually makes it useful, which is the ability to figure out which key-value pairs matter for a given query. This article consolidates some interesting directions the field has taken, and honestly some of the mechanisms I found really cool.

## 2. Background / Motivation

The core problem is pretty simple. Standard scaled dot-product attention computes a full `N × N` matrix of pairwise interactions between every token — every query attends to every key. For a sequence of length `N`, that's `O(N²)` time and `O(N²)` memory. For short sequences this is fine, but as `N` gets massive, massive (think long documents, long conversations, codebases), this becomes the bottleneck very quickly.

The fundamental question is: do we actually need all `N²` interactions? Intuitively, I like to think of it as when you're reading a long document and answering a question, you don't re-read every single sentence with equal attention. You're pattern-matching and skipping. Most tokens are probably not that relevant to most other tokens. Hence, a lot of research has gone into making attention keep its main use whilst reducing the time and space complexity of the mechanism itself. Below are some of the main approaches.

## 3. Approach / Implementation

### 3.1 Sparse attention

Sparse methods compute only a subset of token pairs instead of all `N × N` interactions. While the theoretical worst-case bound is still `O(N²)`, you save a bunch of computation because not all `N × N` KV pairs are chosen — in practice the number of pairs computed is much smaller, often `O(N log N)` or even `O(N)` depending on the sparsity pattern.

So we can save compute and memory, but the key question is: how do we decide which subset of the `N` tokens to actually compute attention for? There has to be some heuristic available to accurately decide which tokens are worth attending to and which aren't.

A few different strategies have been tried here. Some approaches use fixed, local windows — each token only attends to its `k` nearest neighbors in the sequence, so you get local context but lose long-range interactions. Others add global tokens (like a `[CLS]` token) that attend to everything, letting long-range information flow through that bottleneck. Some methods try to learn the sparsity pattern dynamically, but this introduces its own overhead. <!-- ⚠️ ACCURACY NOTE: Worth double-checking specific paper attributions here — e.g., Longformer, BigBird, Sparse Transformer. Consider naming them explicitly once you've read the papers. (look more into this) -->

<!-- TODO: expand 3.1 — add specific papers (Sparse Transformer, Longformer, BigBird), worked example of a local window pattern, and discussion of what kinds of tasks each sparsity pattern suits best. -->

### 3.2 Low-rank and kernel methods

<!-- TODO: Lucas marked this section "REDO!!" — rewrite from scratch once you've read the relevant papers. Key papers to look at: Linformer (low-rank approximation of the attention matrix), Performer (kernel approximation via random features), FNet (replaces attention with Fourier transforms entirely). The core idea is approximating the N×N attention matrix as a product of two smaller matrices, or reformulating attention so the matrix multiply order changes and avoids materializing the full N×N matrix. -->

Low-rank and kernel approaches approximate full attention with cheaper math. <!-- ⚠️ ACCURACY NOTE: Placeholder text from original notes — Lucas flagged this as needing a full rewrite. --> They tend to be faster on long sequences, though how much approximation quality you lose depends a lot on the task.

### 3.3 The attention mechanism from Kimi / Moonshot AI

<!-- TODO: Lucas flagged this as "(READ UP)" — fill in after reading the paper. Likely either the MoonCake KV cache paper from Moonshot AI, or possibly you're thinking of DeepSeek's MLA (Multi-head Latent Attention) from DeepSeek-V2. The section title needs to be updated with the actual mechanism name once confirmed. Include: what the core idea is, how it differs from vanilla attention, and the efficiency gains claimed. -->

### 3.4 Practical tradeoffs

<!-- TODO: expand once the above sections are filled in — the tradeoffs will be clearer after working through the specific methods. Some starting points: sparse methods add implementation complexity and may hurt on tasks that need dense long-range interactions; kernel/low-rank methods introduce approximation error that can hurt precision-sensitive tasks; hardware matters a lot (FlashAttention is exact but hardware-aware, and that alone gives large speedups without approximation). -->

Efficient attention is usually most helpful when the context is large enough that vanilla attention becomes the real bottleneck. For shorter sequences, the extra implementation complexity can outweigh the speed gains — you'd think the more efficient method always wins, but that's often not actually true in practice for typical sequence lengths.

## 4. Results / Findings

<!-- TODO: fill in after reading the papers — note benchmark results, which methods win on which tasks, and where approximation error starts to matter. -->

From what I've read so far, approximation error is often acceptable in retrieval-heavy or broad-context tasks where you need some signal from across a long document, but precision-sensitive tasks may still prefer exact attention if the latency budget allows. The crossover point where efficient methods actually start winning in wall-clock time (not just FLOPs) is also surprisingly hardware-dependent.

## 5. Reflections / Future Work

One thing I want to do is run an actual benchmark by context length, because crossover points can be surprising across different hardware. I also want to compare both wall-clock latency and memory peak, not just FLOPs — FLOPs alone can be misleading since memory bandwidth is often the real bottleneck, not raw compute.

<!-- TODO: once you've read the papers, add thoughts on which approach seems most practically useful, what the field seems to be converging on (e.g., FlashAttention seems to have become the de-facto standard for exact attention due to hardware-awareness), and open questions. -->

## 6. Conclusion

The fundamental insight across all these methods is basically the same: the `N²` term in vanilla attention is doing a lot of redundant work. Sparse methods cut it by only computing a subset of pairs. Low-rank and kernel approaches cut it by approximating the matrix cheaply or reordering the computation so you never materialize the full thing. The right choice depends a lot on the task and hardware, or at least that's what the benchmarks suggest — I want to verify this myself.

<!-- TODO: update once sections 3.2–3.4 are filled in. -->

## 7. Links & References

<!-- ⚠️ ACCURACY NOTE: The link below is to "Attention Is All You Need" (the original transformer paper, 1706.03762) — probably not what you want here. Replace with links to the specific efficient attention papers once you've read them. -->

- Paper: https://arxiv.org/abs/1706.03762
- Sparse Transformer (Child et al. 2019): <!-- TODO: add link -->
- Longformer (Beltagy et al. 2020): <!-- TODO: add link -->
- Linformer (Wang et al. 2020): <!-- TODO: add link -->
- Performer (Choromanski et al. 2020): <!-- TODO: add link -->
- FlashAttention (Dao et al. 2022): <!-- TODO: add link -->
