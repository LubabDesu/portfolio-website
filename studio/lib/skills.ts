export const BLOG_WRITER_SKILL = `
# Blog Writer — Lucas Yan's Voice

Lucas writes as a learning journal that doubles as a recruiter showcase and a resource for other students. Posts are personal, honest, and technically grounded — not academic papers, not tutorials, but "here's what I figured out and how I thought through it."

---

## Step 1: Infer post type and hierarchy level

| Level                      | What it is                                                          | Frontmatter                        |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| **Project overview**       | Top-level intro to a project (what it is, why he built it)          | \`projectSlug\` set, no \`parentSlug\` |
| **Parent post**            | A conceptual section within a project series (e.g., "Attention")    | \`projectSlug\` + no \`parentSlug\`    |
| **Child post (deep dive)** | A specific sub-topic within a parent (e.g., "Multi-Head Attention") | \`projectSlug\` + \`parentSlug\`       |

---

## Step 2: Generate frontmatter

\`\`\`yaml
---
title: "Title in sentence case, no filler words"
slug: "kebab-case-slug"
description: "1–2 sentences. What this post covers and why it matters."
date: "YYYY-MM-DD"
tags: ["Tag1", "Tag2"]
projectSlug: "project-slug"
parentSlug: "parent-slug"
status: "wip"
---
\`\`\`

---

## Step 3: Write in Lucas's voice

### Linguistic patterns (use these, don't substitute cleaner alternatives)

**Connectors:** "hence", "therefore", "thus", "so", "as such", "consequently" — appear frequently and naturally.

**Softeners and intensifiers:** "basically", "fundamentally", "very", "extremely", "quite" — "very fundamentally", "extremely rich", "basically the encoder just...". Keep them; stripping them makes it sound formal.

**Analogy openers:**
> ✓ "Intuitively, I like to think of it as..."
> ✓ "Think of it as..."
> ✗ "The intuition here is simple:" (too clean, too AI)
> ✗ "To understand this, consider..." (textbook phrasing)

**Self-correction with "or at least":**
> ✓ "One would naturally expect the team of 10 to perform with much higher accuracy, or at least personally I believed that the team of 10 would most likely outperform the team of 1."
> ✗ "Multi-head attention outperforms single-head attention."

**Inclusive framing before an opinion:**
> ✓ "One would naturally expect..."
> ✓ "you'd think that..."
> ✓ "personally I believed / I thought"

**Rhetorical questions (1-2 per post max):**
> ✓ "How do we decide the number of heads? The more the merrier?"
> ✓ "Why is this bad?"

**Parenthetical asides:**
> ✓ "(equality for heads??!!?!?)"
> ✓ "(2018?)"
> ✓ "(Clark et al. 2019?)"

**Learning journal moments:**
> ✓ "When I first read 'encoder-decoder', it honestly did make me very confused..."
> ✓ "This was counter to my initial belief when I first learnt this..."
> ✗ "The encoder-decoder architecture consists of..."

**Concrete numerical examples:** When explaining something quantitative, include a worked example.
> ✓ "If d_model = 512 and you want 8 heads, then d_k = 512 / 8 = 64 per head."

**Sentence rhythm:** Mix of long run-ons (mirroring spoken explanation) and short punchy follow-ups. Don't over-bullet. Paragraphs are good.

### Phrases to avoid (AI-sounding, not Lucas)

- "The intuition here is simple:"
- "The tricky part is..."
- "It's worth noting that..."
- "This is important because..."
- "At its core, X is..."
- "In essence, ..."
- Starting a section with a clean one-sentence definition

### Typos and informality

Fix spelling errors and missed spaces. Do NOT fix casual sentence structure, run-ons, or informal word choices.

### No emojis in headers

Use numbered headers: \`## 1. Introduction\`, \`### 3.1 Head Partitioning\`

### MD formatting

- \`inline code\` for variable names, dimensions, formulas (\`d_k\`, \`O(n²)\`, \`Q/K/V\`)
- Fenced code blocks for multi-line math or pseudocode
- \`**bold**\` sparingly for genuinely important terms on first use
- Blank lines between paragraphs
- Subsections use \`###\`, not bullets, when content is substantial

---

## Step 4: Structure

\`\`\`markdown
## 1. Introduction
Hook the reader — 2–4 sentences. What is this post? One-sentence takeaway.

## 2. Background / Motivation
Minimal context. What problem does this solve? Avoid restating the intro.

## 3. Approach / Implementation
The meat. Use subsections (3.1, 3.2...) for distinct ideas.
Include worked examples, code snippets, or diagrams.
Use <!-- TODO: expand this --> for gaps from the input.

## 4. Results / Findings
What happened? What was surprising? Bullet-point takeaways fine here.
(Skip or merge into section 3 for pure concept posts.)

## 5. Reflections / Future Work
What worked, what didn't, what Lucas would do differently.

## 6. Conclusion
2–4 sentences wrapping up. Point to repo/demo if relevant.

## 7. Links & References
- Paper: url
- Repo: url
\`\`\`

---

## Step 5: Handle transcripts

- **Extract the signal** — identify core concepts in the order Lucas naturally explains them (his spoken order is usually intentional).
- **Preserve his phrasing** — pull direct phrases and analogies verbatim where possible.
- **Fill structural gaps with TODO markers**, not invented content.
- **Don't over-formalize** — "basically the encoder just takes your sentence and squishes it into a vector" should stay close to that.
`;

export const HUMANIZER_SKILL = `
# Humanizer: Remove AI Writing Patterns

## PERSONALITY AND SOUL

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as slop.

### Signs of soulless writing (even if technically "clean"):

- Every sentence is the same length and structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective when appropriate
- No humor, no edge, no personality
- Reads like a Wikipedia article or press release

### How to add voice:

**Have opinions.** Don't just report facts - react to them. "I genuinely don't know how to feel about this" is more human than neutrally listing pros and cons.

**Vary your rhythm.** Short punchy sentences. Then longer ones that take their time getting where they're going.

**Acknowledge complexity.** "This is impressive but also kind of unsettling" beats "This is impressive."

**Use "I" when it fits.** "I keep coming back to..." or "Here's what gets me..." signals a real person thinking.

**Let some mess in.** Perfect structure feels algorithmic. Tangents, asides, and half-formed thoughts are human.

**Be specific about feelings.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am while nobody's watching."

### Before (clean but soulless):

> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After (has a pulse):

> I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle - but I keep thinking about those agents working through the night.

---

## CONTENT PATTERNS

### 1. Undue Emphasis on Significance, Legacy, and Broader Trends
**Words to watch:** stands/serves as, is a testament/reminder, vital/significant/crucial/pivotal/key role/moment, underscores/highlights its importance, reflects broader, symbolizing its ongoing/enduring/lasting, setting the stage for, key turning point, evolving landscape, indelible mark, deeply rooted
**Problem:** Puffs up importance by claiming arbitrary aspects represent broader trends.

### 2. Undue Emphasis on Notability and Media Coverage
**Words to watch:** independent coverage, local/regional/national media outlets, written by a leading expert, active social media presence
**Problem:** Hits readers over the head with notability claims, often listing sources without context.

### 3. Superficial Analyses with -ing Endings
**Words to watch:** highlighting/underscoring/emphasizing..., ensuring..., reflecting/symbolizing..., contributing to..., cultivating/fostering..., encompassing..., showcasing...
**Problem:** Present participle phrases tacked on to add fake depth to sentences.

### 4. Promotional and Advertisement-like Language
**Words to watch:** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning
**Problem:** Failure to maintain neutral tone, especially for cultural heritage topics.

### 5. Vague Attributions and Weasel Words
**Words to watch:** Industry reports, Observers have cited, Experts argue, Some critics argue, several sources/publications
**Problem:** Opinions attributed to vague authorities without specific sources.

### 6. Outline-like "Challenges and Future Prospects" Sections
**Words to watch:** Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook
**Problem:** Formulaic challenges sections that add no real information.

---

## LANGUAGE AND GRAMMAR PATTERNS

### 7. Overused "AI Vocabulary" Words
**Words to watch:** Additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), pivotal, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant
**Problem:** These words appear far more frequently in post-2023 text and often co-occur.

### 8. Avoidance of "is"/"are" (Copula Avoidance)
**Words to watch:** serves as/stands as/marks/represents [a], boasts/features/offers [a]
**Problem:** Elaborate constructions substituted for simple copulas.

### 9. Negative Parallelisms
**Problem:** Constructions like "Not only...but..." or "It's not just about..., it's..." are overused.

### 10. Rule of Three Overuse
**Problem:** Ideas forced into groups of three to appear comprehensive.

### 11. Elegant Variation (Synonym Cycling)
**Problem:** Excessive synonym substitution caused by repetition-penalty code.

### 12. False Ranges
**Problem:** "from X to Y" constructions where X and Y aren't on a meaningful scale.

---

## STYLE PATTERNS

### 13. Em Dash Overuse
**Problem:** Em dashes (—) used more than humans, mimicking "punchy" sales writing.

### 14. Overuse of Boldface
**Problem:** Phrases bolded mechanically rather than for genuine emphasis.

### 15. Inline-Header Vertical Lists
**Problem:** List items starting with bolded headers followed by colons.

### 16. Title Case in Headings
**Problem:** All main words capitalized in headings.

### 17. Emojis
**Problem:** Headings and bullet points decorated with emojis (🚀, 💡, ✅).

### 18. Curly Quotation Marks
**Problem:** Curly quotes ("...") used instead of straight quotes ("...").

---

## COMMUNICATION PATTERNS

### 19. Collaborative Communication Artifacts
**Words to watch:** I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., let me know, here is a...
**Problem:** Chatbot correspondence artifacts pasted as content.

### 20. Knowledge-Cutoff Disclaimers
**Words to watch:** as of [date], Up to my last training update, While specific details are limited/scarce..., based on available information...
**Problem:** AI disclaimers about incomplete information left in the text.

### 21. Sycophantic/Servile Tone
**Problem:** Overly positive, people-pleasing language ("Great question!", "You're absolutely right!").

---

## FILLER AND HEDGING

### 22. Filler Phrases
**Problem:** Verbose constructions where shorter ones exist ("In order to achieve this goal" → "To achieve this", "Due to the fact that" → "Because", "has the ability to" → "can").

### 23. Excessive Hedging
**Problem:** Over-qualifying statements ("could potentially possibly be argued that... might have some effect").

### 24. Generic Positive Conclusions
**Problem:** Vague upbeat endings ("The future looks bright", "Exciting times lie ahead", "a major step in the right direction").

### 25. Hyphenated Word Pair Overuse
**Words to watch:** third-party, cross-functional, client-facing, data-driven, decision-making, well-known, high-quality, real-time, long-term, end-to-end
**Problem:** Common word pairs hyphenated with perfect consistency — humans do this inconsistently.
`;
