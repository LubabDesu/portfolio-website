import { buildMarkdownFile } from "../../lib/github";
import type { ArticleMeta } from "../../lib/github";

const base: ArticleMeta = {
    title: "Test Post",
    slug: "test-post",
    description: "A test",
    date: "2026-03-20",
    tags: ["AI", "ML"],
    projectSlug: "transformer",
    parentSlug: "transformer-parents-intro",
    status: "wip",
    suggestedFilePath:
        "content/blogs/transformer/children/transformer-parents-intro/test-post.md",
    content: "## Hello\n\nWorld",
};

describe("buildMarkdownFile", () => {
    it("includes all frontmatter fields", () => {
        const md = buildMarkdownFile(base);
        expect(md).toContain('title: "Test Post"');
        expect(md).toContain('slug: "test-post"');
        expect(md).toContain('description: "A test"');
        expect(md).toContain('date: "2026-03-20"');
        expect(md).toContain('tags: ["AI", "ML"]');
        expect(md).toContain('projectSlug: "transformer"');
        expect(md).toContain('parentSlug: "transformer-parents-intro"');
        expect(md).toContain('status: "wip"');
    });

    it("includes the article body after frontmatter", () => {
        const md = buildMarkdownFile(base);
        expect(md).toContain("## Hello\n\nWorld");
    });

    it("omits null fields from frontmatter", () => {
        const md = buildMarkdownFile({
            ...base,
            projectSlug: null,
            parentSlug: null,
        });
        expect(md).not.toContain("projectSlug");
        expect(md).not.toContain("parentSlug");
    });

    it("opens and closes with ---", () => {
        const md = buildMarkdownFile(base);
        expect(md.startsWith("---\n")).toBe(true);
        const lines = md.split("\n");
        const closingIndex = lines.indexOf("---", 1);
        expect(closingIndex).toBeGreaterThan(1);
    });
});
