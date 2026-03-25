> **Accuracy flags before you review:**
>
> - [Section 7, References]: The linked paper (arxiv 1706.03762) is "Attention Is All You Need" — the original transformer paper. That's likely not what you meant here; you probably want links to the specific efficient attention papers (e.g., Sparse Transformer, Longformer, Linformer, FlashAttention, etc.).
> - [Section 3.3]: "Kimi Moonshot AI" attention — I'm not certain which specific mechanism you're referring to. Kimi (Moonshot AI) is a Chinese AI lab known for long-context work (e.g., their MoonCake KV cache paper), but the most widely-cited "efficient attention from a Chinese lab" in 2024–2025 is DeepSeek's MLA (Multi-head Latent Attention from DeepSeek-V2). Could be either. Left as TODO — please fill in the paper name.

---

title: "Efficient attention approaches"
slug: "transformer-efficient-attention"
description: "A survey of strategies to reduce the quadratic memory and compute costs of vanilla attention, from sparse methods to kernel approximations."
date: "2026-03-23"
tags: ["Transformers", "Attention", "Efficiency"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"

---

## 1. Introduction

Vanilla attention doesn't scale. The `O(n²)` complexity means doubling your sequence length quadruples both memory and compute. A lot of work has gone into making attention cheaper without losing what makes it useful — figuring out which key-value pairs actually matter for a given query. This post covers some of the directions that research has taken, plus a few mechanisms I found genuinely interesting.

## 2. Background / Motivation

The problem is pretty concrete. Standard scaled dot-product attention computes a full `N × N` matrix of pairwise interactions between every token in the sequence — every query attends to every key. For a sequence of length `N`, that's `O(N²)` time and `O(N²)` memory. For short sequences this is fine, but as `N` grows (documents, long conversations, massive codebases), it becomes the bottleneck fast.

Do we actually need all `N²` interactions? I think of it like reading a long document to answer a question: you don't re-read every sentence with equal attention. You're pattern-matching and skipping. Most tokens probably aren't that relevant to most other tokens. A lot of research has tried to preserve what attention does well while cutting down the time and space cost.

## 3. Approach / Implementation

### 3.1 Sparse attention

Sparse methods compute only a subset of token pairs instead of all `N × N` interactions. The theoretical worst-case bound is still `O(N²)`, but in practice the number of pairs computed is much smaller — often `O(N log N)` or even `O(N)` depending on the sparsity pattern. That translates to real compute and memory savings.

The hard part is deciding which pairs to compute. You need some heuristic that's accurate enough to keep the useful interactions without accidentally throwing away signal.

Different approaches handle this differently. Some use fixed, local windows where each token only attends to its `k` nearest neighbors — you get local context but lose long-range interactions. Others add global tokens (like a `[CLS]` token) that attend to everything, letting long-range information flow through that bottleneck. Some methods try to learn the sparsity pattern dynamically, but that adds its own overhead. <!-- ⚠️ ACCURACY NOTE: Worth double-checking specific paper attributions here — e.g., Longformer, BigBird, Sparse Transformer. Consider naming them explicitly once you've read the papers. (look more into this) -->

<!-- TODO: expand 3.1 — add specific papers (Sparse Transformer, Longformer, BigBird), worked example of a local window pattern, and discussion of what kinds of tasks each sparsity pattern suits best. -->

### 3.2 Low-rank and kernel methods

<!-- TODO: Lucas marked this section "REDO!!" — rewrite from scratch once you've read the relevant papers. Key papers to look at: Linformer (low-rank approximation of the attention matrix), Performer (kernel approximation via random features), FNet (replaces attention with Fourier transforms entirely). The core idea is approximating the N×N attention matrix as a product of two smaller matrices, or reformulating attention so the matrix multiply order changes and avoids materializing the full N×N matrix. -->

Low-rank and kernel approaches approximate full attention with cheaper math. <!-- ⚠️ ACCURACY NOTE: Placeholder text from original notes — Lucas flagged this as needing a full rewrite. --> They are often faster on long sequences, though approximation quality can vary by task.

### 3.3 The attention mechanism from Kimi / Moonshot AI

<!-- TODO: Lucas flagged this as "(READ UP)" — fill in after reading the paper. Likely either the MoonCake KV cache paper from Moonshot AI, or possibly you're thinking of DeepSeek's MLA (Multi-head Latent Attention) from DeepSeek-V2. The section title needs to be updated with the actual mechanism name once confirmed. Include: what the core idea is, how it differs from vanilla attention, and the efficiency gains claimed. -->

### 3.4 Practical tradeoffs

<!-- TODO: expand once the above sections are filled in — the tradeoffs will be clearer after working through the specific methods. Some starting points: sparse methods add implementation complexity and may hurt on tasks that need dense long-range interactions; kernel/low-rank methods introduce approximation error that can hurt precision-sensitive tasks; hardware matters a lot (FlashAttention is exact but hardware-aware, and that alone gives large speedups without approximation). -->

Efficient attention is usually most helpful when the context is large enough that vanilla attention becomes the bottleneck. For shorter sequences, the extra implementation complexity can outweigh the speed gains — you'd think the more efficient method always wins, but that's often not actually true in practice for typical sequence lengths.

## 4. Results / Findings

<!-- TODO: fill in after reading the papers — note benchmark results, which methods win on which tasks, and where approximation error starts to matter. -->

From what I've read so far, approximation error is often acceptable in retrieval-heavy or broad-context tasks where you need some signal from across a long document, but precision-sensitive tasks may still prefer exact attention if the latency budget allows. The crossover point where efficient methods actually start winning in wall-clock time (not just FLOPs) is also surprisingly hardware-dependent.

## 5. Reflections / Future Work

One thing I want to do is run an actual benchmark by context length, because crossover points can be surprising across different hardware. I also want to compare both wall-clock latency and memory peak, not just FLOPs — FLOPs alone can be misleading because memory bandwidth is often the real bottleneck, not raw compute.

<!-- TODO: once you've read the papers, add thoughts on which approach seems most practically useful, what the field seems to be converging on (e.g., FlashAttention seems to have become the de-facto standard for exact attention due to hardware-awareness), and open questions. -->

## 6. Conclusion

The `N²` term in vanilla attention is doing a lot of redundant work. These methods attack that from different angles: compute only a structured sparse subset, approximate the attention matrix with a low-rank factorization, or reorder the computation so you never have to materialize the full matrix. Which one makes sense depends on the task and the hardware — there's no free lunch, just different tradeoffs.

<!-- TODO: update once sections 3.2–3.4 are filled in. -->

## 7. Links & References

<!-- ⚠️ ACCURACY NOTE: The link below is to "Attention Is All You Need" (the original transformer paper, 1706.03762) — probably not what you want here. Replace with links to the specific efficient attention papers once you've read them. -->

- Paper: https://arxiv.org/abs/1706.03762
- Sparse Transformer (Child et al. 2019): <!-- TODO: add link -->
- Longformer (Beltagy et al. 2020): <!-- TODO: add link -->
- Linformer (Wang et al. 2020): <!-- TODO: add link -->
- Performer (Choromanski et al. 2020): <!-- TODO: add link -->
- FlashAttention (Dao et al. 2022): <!-- TODO: add link -->
