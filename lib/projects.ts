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
        slug: "novasync",
        title: "NovaSync",
        description:
            "Agentic AI travel planner built at a hackathon. AWS Bedrock Nova 2 Lite agent runs 20+ tool-use iterations (Ticketmaster, Open-Meteo, Google Places) to research a day-by-day itinerary. Human-in-the-loop review before finalizing. Nova Act books restaurants autonomously. Live streaming action feed.",
        tags: ["AWS Bedrock", "Nova Act", "FastAPI", "React", "Agentic AI"],
        repo: "https://github.com/LubabDesu/nova-hackathon",
        year: 2026,
        status: "shipped",
    },
    {
        slug: "mini-autograd",
        title: "Mini Autograd Engine",
        description:
            "Reverse-mode autodiff engine from scratch with a dynamic computational graph, 20+ ops (MatMul, Softmax, LayerNorm, etc.), and topological-sort backward pass. Trained a decoder-only transformer entirely on the engine with no PyTorch autograd.",
        tags: ["Python", "PyTorch", "ML Systems", "Transformers"],
        year: 2026,
        status: "shipped",
    },
    {
        slug: "tse-meemli",
        title: "Triton Software Engineering - Meemli",
        description:
            "A centralized program management platform for Meemli that streamlines student attendance, program oversight, and role-based access for administrators and teachers in a single, simplified interface.",
        tags: ["MERN", "Typescript"],
        // href: "https://your-live-link.com",
        repo: "https://github.com/TritonSE/Meemli",
        image: "/projects/piano-tracker.png",
        year: 2026,
        featured: true,
        status: "wip",
    },
    {
        slug: "universal-job-tracker",
        title: "Universal Job Tracker: Automating the Search with AI & MCP",
        description:
            "A high-end automation tool that uses a custom Chrome extension to detect job applications and an MCP server to instantly log them into Notion. The system triggers an AI enrichment phase that summarizes job descriptions and generates dedicated interview prep pages before you even close the browser tab.",
        tags: [
            "TypeScript",
            "React",
            "Chrome Extension API",
            "MCP SDK",
            "Notion API",
            "OpenRouter",
        ],
        year: 2026,
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
