---
title: "Multi-head Latent Attention"
slug: "transformer-mla"
description: "DeepSeek's approach to compressing the KV cache into a low-rank latent space."
date: "2026-02-15"
tags: ["Transformers", "Attention", "MLA", "DeepSeek", "KV Cache"]
projectSlug: "transformer"
parentSlug: "transformer-attention"
status: "wip"
---

## 1. Introduction

MQA and GQA reduce KV cache memory by reducing the number of K/V heads. That's one way to approach the problem. DeepSeek V2 takes a completely different angle: instead of reducing how many K/V representations you have, they compress the K/V representations themselves into a much smaller latent vector, and then decompress back to full size at attention time.

This is Multi-head Latent Attention (MLA), and it's the attention mechanism behind DeepSeek V2 and V3. When I first read about it I found it genuinely confusing, so I want to try to explain it the way I wish someone had explained it to me.

## 2. Background / Motivation

Let me start with why the KV cache is so expensive for large models. In a standard transformer, if you have n_layers layers, h heads, d_k = d_v = 128 (typical), and a sequence of length T, then the total KV cache size is:

n_layers × T × 2 × h × d_k

For a big model like GPT-4-scale (say n_layers = 96, h = 96, d_k = 128), that's 96 × T × 2 × 96 × 128 = about 2.4M values per token across all layers. With float16 at 2 bytes each, that's roughly 4.7 MB per token. For a 32k context window, you're looking at around 150 GB just for the KV cache. This is a real constraint.

GQA helps by reducing h (effectively). MLA's approach is different: what if you could represent each token's K/V contribution in a low-dimensional latent vector c_t ∈ R^d_c, where d_c << h × d_k? Then at attention time, you decompress c_t back to full K and V matrices, do attention, and discard the decompressed tensors. You only store c_t in the KV cache.

_I find it helpful to think of it as a compressed file format. Instead of storing the full K/V matrices (the uncompressed image), you store a compact latent code (a JPEG), and only decode it when you actually need to compute attention. The cache holds the JPEGs, not the raw bitmaps._

## 3. Approach / Implementation

### 3.1 Compression and Decompression

For each token at position t, MLA computes a compressed latent vector:

c_t^KV = X_t W^DKV

where W^DKV ∈ R^(d_model × d_c) is a down-projection matrix, and d_c is the compressed dimension (much smaller than h × d_k). This c_t^KV is what gets stored in the KV cache.

At attention time, K and V are reconstructed from c_t^KV:

K_t = c_t^KV W^UK
V_t = c_t^KV W^UV

where W^UK ∈ R^(d_c × (h × d_k)) and W^UV ∈ R^(d_c × (h × d_v)) are up-projection matrices. So the stored dimension is d_c, but the attended dimension is h × d_k as usual.

Numerical Example: Say h = 128 heads, d_k = 128. Standard KV cache per token per layer: 2 × 128 × 128 = 32768 values. With d_c = 512, MLA KV cache per token per layer: 512 values. That's a 64× reduction, which is far more aggressive than GQA.

### 3.2 The Query Side

MLA also applies low-rank compression to the queries, though this doesn't affect KV cache size (queries aren't cached — you recompute them for the current token). The query is computed as:

q_t = (X_t W^DQ) W^UQ

where W^DQ is a down-projection to some compressed query dimension d_c^Q. This is more of a parameter efficiency thing — it reduces the parameter count of the Q projection without hurting expressiveness much.

### 3.3 RoPE Complication

Here's where it gets messy, and I had to read this section of the paper a few times. Rotary positional embeddings (RoPE) are applied to Q and K to inject position information. But RoPE is applied after the projection, meaning the K matrices have position baked in. This means you can't just store the raw c_t^KV in the cache and apply RoPE lazily at decode time — because the RoPE transform depends on the position of the token, and that changes how the compressed representation decompresses.

The solution in MLA is to split K into two components: one that is RoPE-encoded (computed from a separate "decoupled" key projection) and one that is not (decompressed from the latent). Specifically:

K_t = [K_t^C ; k_t^R]

where K_t^C is the content-based key decompressed from c_t^KV, and k_t^R is a small RoPE-encoded key computed from a dedicated projection. Only k_t^R gets RoPE applied. Queries get a similar split treatment.

This adds some complexity, but the key insight is: you still only cache c_t^KV (and k_t^R, which is small), so the cache savings hold.

### 3.4 Absorbing the Up-Projection

One more optimization the paper mentions: at inference, you don't have to actually materialize the decompressed K_t and V_t tensors. Instead, you can absorb the up-projection matrices W^UK and W^UV into the Q projections and output projections mathematically. The attention scores become:

score_i = Q_i K_t^T = (X_t W_i^Q (W^UK)^T) c_t^KV^T

So you compute a modified query W_i^Q (W^UK)^T once per layer, and then at each decode step you're just doing a dot product with c_t^KV directly. This is nice because it means you never actually decompress — you compute in the latent space.

## 4. Results / Findings

DeepSeek V2 reports that MLA achieves comparable quality to standard MHA with 64× smaller KV cache per token. In practice, this lets DeepSeek V2 serve much longer contexts with the same GPU memory, or the same context length with much cheaper serving infrastructure.

The quality results are strong — DeepSeek V2 with MLA is competitive with or better than models of similar size using standard MHA or GQA. So it's not a quality-sacrificing trick; the compression is accurate enough that the model learns well.

One thing worth noting: the up-projection matrices W^UK and W^UV are learned during training. The model learns to represent K/V information in the compressed latent space. This is not a hand-designed compression scheme — it's fully end-to-end trained.

## 5. Reflections / Future Work

MLA is the most technically involved of the three attention variants I've written about, and honestly when I first read the DeepSeek V2 paper I got lost at the RoPE complication section. The absorbed-projection trick also took me a while to see why it works — it's just the associativity of matrix multiplication, but it's not obvious at first glance.

What I find most interesting conceptually is that MLA is doing something fundamentally different from MQA/GQA. Those methods accept that you need to store K/V for all positions and just optimize how many K/V copies you need. MLA asks whether the K/V content itself can be expressed more compactly. It's a dimensionality reduction angle on the same problem.

The question I'd want answered is: what is in c_t^KV? Is it interpretable? In MHA, the K/V projections have somewhat interpretable structure — you can probe what each head attends to. With a low-rank latent code sitting in the middle, that interpretability gets murky. I have no good answer here. It's just something I'd want to understand better.

Also: is MLA architecture-specific to models that are trained from scratch with it? The GQA paper showed you can convert MHA checkpoints to GQA with modest fine-tuning. I'd be surprised if you could do the same with MLA — the latent compression seems like something the model needs to learn from the beginning. But I could be wrong.

## 6. Conclusion

MLA is the most aggressive KV cache compression approach of the three. Where GQA reduces the number of K/V heads, MLA compresses the K/V representations into a low-rank latent space, achieving 64× cache savings in the DeepSeek V2 implementation. The RoPE handling adds some engineering complexity, but the absorbed-projection trick means you can do attention directly in the latent space at inference time. The quality doesn't degrade significantly. It's a clever solution to a hard engineering problem, and it's probably why DeepSeek can serve the models they do at the reported costs.

## 7. Links & References

- DeepSeek V2 Paper: https://arxiv.org/abs/2405.04434
- DeepSeek V3 Technical Report: https://arxiv.org/abs/2412.19437
