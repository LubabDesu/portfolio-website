import type { BlogEntry } from "./blogs";

export function buildSystemPrompt(skills?: {
    blogWriter?: string;
    humanizer?: string;
}): string {
    const base = `You are a writing assistant that generates technical blog posts in the author's personal voice.

You output ONLY valid JSON — no markdown fences, no preamble, no explanation. Just the raw JSON object.`;

    const voiceSection = skills?.blogWriter
        ? `\n\n== VOICE & STYLE GUIDE ==\n${skills.blogWriter}`
        : "";

    const humanizeSection = skills?.humanizer
        ? `\n\n== AVOID THESE AI WRITING PATTERNS ==\n${skills.humanizer}`
        : "";

    return base + voiceSection + humanizeSection;
}

export function buildUserPrompt(params: {
    transcript: string;
    blogTree: BlogEntry[];
    feedback?: string;
}): string {
    const { transcript, blogTree, feedback } = params;
    const today = new Date().toISOString().split("T")[0];
    const tree = JSON.stringify(blogTree, null, 2);

    return `## Existing blog tree (use pathHint to understand the folder convention):
${tree}

## Author's voice recording (transcribed):
"${transcript}"

${feedback ? `## Revision instructions:\n${feedback}\n\n` : ""}## Task:
Generate a blog post based on the transcript. Analyze the blog tree to decide:
- Is this a parent post (new top-level topic for a project) or a child post (deep-dive under an existing parent)?
- Which projectSlug does it belong to? (null if it doesn't fit any existing project)
- What parentSlug should it reference? (null if this is a parent post)
- What file path should it live at? Follow the convention: "content/blogs/{project}/parents/{slug}.md" for parents, "content/blogs/{project}/children/{parent-slug}/{slug}.md" for children.

Output a single JSON object with these exact fields:
{
  "title": "string",
  "slug": "string (kebab-case, unique, not already in the tree)",
  "description": "string (1-2 sentences)",
  "date": "${today}",
  "tags": ["string"],
  "projectSlug": "string | null",
  "parentSlug": "string | null",
  "status": "wip",
  "suggestedFilePath": "content/blogs/...",
  "content": "string (full markdown article body, NO frontmatter)"
}`;
}
