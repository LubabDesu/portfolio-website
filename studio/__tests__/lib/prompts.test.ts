import { buildSystemPrompt, buildUserPrompt } from "../../lib/prompts";
import type { BlogEntry } from "../../lib/blogs";

const mockTree: BlogEntry[] = [
    {
        slug: "transformer-parents-intro",
        title: "Intro",
        description: "desc",
        tags: ["AI"],
        projectSlug: "transformer",
        parentSlug: null,
        pathHint: "transformer/parents/intro",
    },
];

describe("buildSystemPrompt", () => {
    it("returns a non-empty string", () => {
        expect(buildSystemPrompt().length).toBeGreaterThan(50);
    });
    it("instructs model to return JSON only", () => {
        expect(buildSystemPrompt().toLowerCase()).toContain("json");
    });
});

describe("buildUserPrompt", () => {
    it("includes the transcript in the output", () => {
        const prompt = buildUserPrompt({
            transcript: "hello world",
            blogTree: mockTree,
        });
        expect(prompt).toContain("hello world");
    });
    it("includes the blog tree as JSON", () => {
        const prompt = buildUserPrompt({
            transcript: "test",
            blogTree: mockTree,
        });
        expect(prompt).toContain("transformer/parents/intro");
    });
    it("includes today's date", () => {
        const today = new Date().toISOString().split("T")[0];
        const prompt = buildUserPrompt({
            transcript: "test",
            blogTree: mockTree,
        });
        expect(prompt).toContain(today);
    });
    it("appends feedback when provided", () => {
        const prompt = buildUserPrompt({
            transcript: "test",
            blogTree: mockTree,
            feedback: "make it shorter",
        });
        expect(prompt).toContain("make it shorter");
    });
});
