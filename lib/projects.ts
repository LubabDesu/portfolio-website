export type Project = {
    slug: string; // future-proof for /projects/[slug]
    title: string;
    description: string;
    tags: string[];
    href?: string; // live demo
    repo?: string; // GitHub
    image?: string; // e.g. "/projects/tracker.png" in /public
    year?: number;
    featured?: boolean; // for pinning to top
    status?: "shipped" | "wip"; // optional
};

export const projects: readonly Project[] = [
    {
        slug: "piano-practice-tracker",
        title: "Piano Practice Tracker",
        description: "Track sessions, goals, and streaks with clean charts.",
        tags: ["Next.js", "FastAPI", "Postgres"],
        href: "https://your-live-link.com",
        repo: "https://github.com/you/piano-tracker",
        image: "/projects/piano-tracker.png",
        year: 2025,
        featured: true,
        status: "shipped",
    },
    {
        slug: "leetcode-ai-assistant",
        title: "LeetCode AI Assistant",
        description:
            "Chrome extension that gives contextual hints while coding.",
        tags: ["TypeScript", "Chrome", "LLM"],
        repo: "https://github.com/you/leetcode-ai",
        year: 2025,
        status: "wip",
    },
    {
        slug: "storyboarding-agent",
        title: "Agentic Workflow for Storyboard Generation",
        description: "Generate a storyboard with a single prompt.",
        tags: ["LangGraph", "Python", "Agentic AI"],
        repo: "https://github.com/LubabDesu/Storyboarding-agent",
        image: "/projects/piano-tracker.png",
        year: 2025,
        featured: true,
        status: "shipped",
    },
] as const;
