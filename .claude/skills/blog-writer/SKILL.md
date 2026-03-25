---
name: blog-writer
description: Write blog posts in Lucas Yan's personal voice and style for lucasyan.com/blogs. Use this skill whenever the user asks to write, draft, generate, or expand a blog post, article, or learning writeup — even if they just say "write this up", "turn my notes into a post", or "help me write about X". Also use when working with content in /content/blogs/ or when given a transcript/notes to consolidate into a post.
---

# Blog Writer — Lucas Yan's Voice

Lucas writes as a learning journal that doubles as a recruiter showcase and a resource for other students. Posts are personal, honest, and technically grounded — not academic papers, not tutorials, but "here's what I figured out and how I thought through it."

---

## Step 0: Before writing — accuracy check

Read the input carefully. If anything seems factually questionable (wrong year, misattributed paper, confused concept), **do not silently correct it or silently keep it**. Instead:

1. Add a `<!-- ⚠️ ACCURACY NOTE: [your concern] -->` comment inline at the relevant sentence.
2. Prepend a short block at the very top of the draft (before the frontmatter):

```
> **Accuracy flags before you review:**
> - [Section X]: [What seemed off and why]
```

Phrase suggestions in Lucas's voice (see below). He must approve all changes — don't rewrite facts on his behalf.

---

## Step 1: Infer post type and hierarchy level

Determine which of these this post is, using context clues from the input:

| Level                      | What it is                                                          | Frontmatter                        |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| **Project overview**       | Top-level intro to a project (what it is, why he built it)          | `projectSlug` set, no `parentSlug` |
| **Parent post**            | A conceptual section within a project series (e.g., "Attention")    | `projectSlug` + no `parentSlug`    |
| **Child post (deep dive)** | A specific sub-topic within a parent (e.g., "Multi-Head Attention") | `projectSlug` + `parentSlug`       |

If you genuinely can't tell, ask one targeted question before writing.

---

## Step 2: Generate frontmatter

```yaml
---
title: "Title in sentence case, no filler words"
slug: "kebab-case-slug" # descriptive, URL-safe
description: "1–2 sentences. What this post covers and why it matters."
date: "YYYY-MM-DD" # today's date
tags: ["Tag1", "Tag2"] # 2–4 tags, title case
projectSlug: "project-slug" # omit if standalone
parentSlug: "parent-slug" # omit if not a child post
status: "wip" # default to "wip" unless input is complete
---
```

Only include optional fields (image, repo, href, featured) if the input explicitly mentions them.

---

## Step 3: Write in Lucas's voice

The goal is to sound like a smart CS/Math student explaining something to a friend after figuring it out himself — not a textbook, not a tutorial, not a polished tech blog. His writing is his thinking, made readable.

### Specific linguistic patterns (use these, don't substitute cleaner alternatives)

**Connectors he actually uses:** "hence", "therefore", "thus", "so", "as such", "consequently"
These appear frequently and naturally.

**Softeners and intensifiers:** "basically", "fundamentally", "very", "extremely", "quite"
Lucas uses these a lot — "very fundamentally", "extremely rich", "basically the encoder just...". Keep them in; stripping them makes it sound formal.

**Analogy openers — use his template:**
> ✓ "Intuitively, I like to think of it as..."
> ✓ "Think of it as..."
> ✗ "The intuition here is simple:" (too clean, too AI)
> ✗ "To understand this, consider..." (textbook phrasing)

**Self-correction mid-sentence with "or at least":**
Lucas hedges and qualifies his own opinions in the same breath.
> ✓ "One would naturally expect the team of 10 to perform with much higher accuracy, or at least personally I believed that the team of 10 would most likely outperform the team of 1."
> ✗ "Multi-head attention outperforms single-head attention."

**Inclusive framing before an opinion:**
> ✓ "One would naturally expect..."
> ✓ "you'd think that..."
> ✓ "personally I believed / I thought"

**Rhetorical questions to introduce a problem or challenge an assumption:**
> ✓ "How do we decide the number of heads? The more the merrier?"
> ✓ "Why is this bad?"
Use sparingly — 1-2 per post max. Don't force them into every section.

**Parenthetical asides for uncertainty, humor, or side thoughts:**
> ✓ "(equality for heads??!!?!?)"
> ✓ "(2018?)"
> ✓ "(Clark et al. 2019?)"

**Learning journal moments — share confusion and surprise:**
Lucas writes about what tripped him up and what surprised him. This is intentional.
> ✓ "When I first read 'encoder-decoder', it honestly did make me very confused..."
> ✓ "This was counter to my initial belief when I first learnt this..."
> ✗ "The encoder-decoder architecture consists of..."

**Concrete numerical examples:**
When explaining something quantitative, include a worked example with actual values.
> ✓ "If d_model = 512 and you want 8 heads, then d_k = 512 / 8 = 64 per head."

**Sentence rhythm:** Mix of long run-ons that mirror spoken explanation and short punchy follow-ups. Don't over-bullet things. Paragraphs are good.

### Phrases to avoid (these sound like AI wrote it, not Lucas)

- "The intuition here is simple:"
- "The tricky part is..."
- "It's worth noting that..."
- "This is important because..."
- "At its core, X is..."
- "In essence, ..."
- Starting a section with a clean one-sentence definition

### Typos and informality

Fix typos (spelling errors, missed spaces) — Lucas wants clean text.
Do NOT fix casual sentence structure, run-ons, or informal word choices. Those are the voice.

### No emojis in headers

Use numbered headers: `## 1. Introduction`, `### 3.1 Head Partitioning`

### MD formatting

Format properly for markdown rendering:

- Use `inline code` for variable names, dimensions, formulas (e.g., `d_k`, `O(n²)`, `Q/K/V`)
- Use fenced code blocks for multi-line math or pseudocode
- Use `**bold**` sparingly for genuinely important terms on first use
- Blank lines between paragraphs
- Subsections use `###`, not bullets, when the content is substantial enough to warrant a header

---

## Step 4: Structure

Use this section structure. Adapt sections to fit — not every post needs all of them, and you can rename/merge where it makes sense.

```markdown
## 1. Introduction

What is this post about? Why does it matter? One-sentence takeaway.
Keep it short — 2–4 sentences. Hook the reader with something relatable or surprising.

## 2. Background / Motivation

Minimal context a smart reader needs. What problem does this solve? What motivated it?
Avoid restating the intro.

## 3. Approach / Implementation

The meat. Use subsections (3.1, 3.2...) for distinct ideas.
Include worked examples, code snippets, or diagrams as appropriate.
Use <!-- TODO: expand this --> for gaps from the input.

## 4. Results / Findings

What happened? What was surprising? Bullet-point takeaways are fine here.
(Skip or merge into section 3 for pure concept posts with no experiments.)

## 5. Reflections / Future Work

What worked, what didn't, what Lucas would do differently.
Open questions and next steps.

## 6. Conclusion

2–4 sentences wrapping up the main idea. Point to repo/demo if relevant.

## 7. Links & References

- Paper: url
- Repo: url
```

---

## Step 5: Handle transcripts specifically

When the input is a spoken transcript (rambling, informal, repetitive):

1. **Extract the signal** — identify the core concepts and the order Lucas naturally explains them in. His spoken order is usually intentional.
2. **Preserve his phrasing** — pull direct phrases and analogies from the transcript verbatim where possible. His casual language is the style, not a flaw to fix.
3. **Fill structural gaps with TODO markers**, not invented content.
4. **Don't over-formalize** — a transcript that says "basically the encoder just takes your sentence and squishes it into a vector" should stay close to that, not become "the encoder maps input sequences to dense vector representations."

---

## What this skill produces

A markdown file with:

- Complete frontmatter
- Accuracy flags block (if any issues found)
- Full draft in Lucas's voice with TODO markers for genuine gaps
- Inline `<!-- ⚠️ ACCURACY NOTE: ... -->` comments where facts were uncertain

Do not produce a clean, polished academic writeup. The goal is a post that sounds like Lucas wrote it after learning something, not like a Wikipedia article or a research paper intro.
