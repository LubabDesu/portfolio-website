// lib/resume.ts
export type ResumeItem = {
    id: string;
    title: string; // Role / Degree
    org: string; // Company / School
    location?: string;
    start: string; // "Jun 2025"
    end: string; // "Present" or "Sep 2024"
    bullets: string[]; // impact bullets
    tags?: string[]; // small chips
};

export const experience: ResumeItem[] = [
    {
        id: "ucsd-aisc",
        title: "Project Lead + Software Developer",
        org: "UCSD AI Student Collective",
        start: "Nov 2025",
        end: "June 2026",
        location: "UCSD",
        bullets: [
            "Building internal tools and web features to improve learning workflows.",
            "Contributing across frontend and backend in an agile startup environment.",
        ],
        tags: ["Full Stack", "React", "Node.js"],
    },
    {
        id: "kitesense-2025",
        title: "Full Stack Software Engineer Intern",
        org: "KiteSense",
        start: "Nov 2025",
        end: "Feb 2026",
        location: "Singapore • Remote",
        bullets: [
            "Building internal tools and web features to improve learning workflows.",
            "Contributing across frontend and backend in an agile startup environment.",
        ],
        tags: ["Full Stack", "React", "Node.js"],
    },
    {
        id: "dso-2025",
        title: "Machine Learning Intern (Multimodal/Agents)",
        org: "DSO National Laboratories",
        start: "Jun 2025",
        end: "Aug 2025",
        location: "Singapore",
        bullets: [
            "Developed agentic workflow for automated storyboard generation (LangGraph).",
            "Integrated Qwen-VL, Mistral, and Llama-3.1 for agentic workflow.",
        ],
        tags: ["LangGraph", "Multimodal AI", "Python"], // can show as chips later
    },
    {
        id: "ucsd-research-2025",
        title: "Undergraduate Researcher (Music AI)",
        org: "UC San Diego",
        start: "Jan 2025",
        end: "Sep 2025",
        location: "San Diego, CA",
        bullets: [
            "Exploring DL models for orchestral→piano reduction under Prof. Dubnov.",
            "Implemented Transformers to capture long-term musical structure; $7,500 research grant.",
        ],
        tags: ["Transformers", "Music ML", "Research"],
    },
    {
        id: "robosub-2025",
        title: "Web Developer (Frontend)",
        org: "Triton Robosub",
        start: "Jan 2025",
        end: "Jun 2025",
        location: "San Diego, CA",
        bullets: [
            "Built responsive club website using React and reusable components.",
        ],
        tags: ["React", "Frontend"],
    },
    {
        id: "dso-2024",
        title: "Machine Learning Intern",
        org: "DSO National Laboratories",
        start: "Jan 2024",
        end: "May 2024",
        location: "Singapore",
        bullets: [
            "Built speaker-change detection using SpeechBrain + ECAPA-TDNN embeddings.",
        ],
        tags: ["Speech", "Python"],
    },
    {
        id: "saf-2022",
        title: "Signals Platoon Commander",
        org: "Singapore Armed Forces",
        start: "Jan 2022",
        end: "Nov 2023",
        location: "Singapore",
        bullets: [
            "Led 30-person platoon maintaining operational communications readiness.",
        ],
        tags: ["Leadership", "Operations"],
    },
    {
        id: "ucsd-education",
        title: "B.S. Mathematics–Computer Science",
        org: "UC San Diego",
        start: "Sep 2024",
        end: "Present (Expected June 2027)",
        location: "San Diego, CA",
        bullets: [
            "4.0 GPA; ML-focused curriculum (CSE 151A, CSE 101, MATH 109/154/184).",
        ],
        tags: ["Math-CS", "ML Focus"],
    },
];
