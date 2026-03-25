// components/ProjectCard.tsx
import Link from "next/link";
import type { Project } from "../lib/projects";

export default function ProjectCard(p: Project) {
    return (
        <article
            style={{
                paddingBottom: "2rem",
                marginBottom: "2rem",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "0.4rem",
                }}
            >
                <h3
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.3rem",
                        fontWeight: 300,
                        margin: 0,
                        color: "var(--text)",
                    }}
                >
                    {p.title}
                </h3>

                {p.year && (
                    <span
                        style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            flexShrink: 0,
                        }}
                    >
                        {p.year}
                    </span>
                )}

                {p.status && (
                    <span className="tag" style={{ flexShrink: 0 }}>
                        {p.status}
                    </span>
                )}
            </div>

            <p
                style={{
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    margin: "0 0 0.75rem",
                    lineHeight: 1.6,
                }}
            >
                {p.description}
            </p>

            {p.tags?.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                        marginBottom: "0.75rem",
                    }}
                >
                    {p.tags.map((t) => (
                        <span key={t} className="tag">
                            {t}
                        </span>
                    ))}
                </div>
            )}

            {(p.href || p.repo) && (
                <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.875rem" }}>
                    {p.href && (
                        <Link className="link-btn" href={p.href} target="_blank">
                            Live
                        </Link>
                    )}
                    {p.repo && (
                        <Link className="link-btn" href={p.repo} target="_blank">
                            Code
                        </Link>
                    )}
                </div>
            )}
        </article>
    );
}
