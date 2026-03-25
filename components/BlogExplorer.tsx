"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogMeta } from "../lib/blogs";

type BlogExplorerProps = {
    blogs: BlogMeta[];
    projectLabels: Record<string, string>;
};

type ProjectGroup = {
    projectKey: string;
    projectLabel: string;
    parents: BlogMeta[];
    childrenByParent: Record<string, BlogMeta[]>;
    orphanChildren: BlogMeta[];
};

type ViewMode = "project-tree" | "topic-filter";

const MODE_LABELS: { key: ViewMode; label: string }[] = [
    { key: "project-tree", label: "By Project" },
    { key: "topic-filter", label: "By Topic" },
];

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

function parseDateToTimestamp(dateValue: string): number {
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
    if (isoMatch) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]);
        const day = Number(isoMatch[3]);
        return Date.UTC(year, month - 1, day);
    }

    const parsed = Date.parse(dateValue);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
}

function formatBlogDate(dateValue: string): string {
    const timestamp = parseDateToTimestamp(dateValue);
    if (Number.isNaN(timestamp)) return dateValue;
    return BLOG_DATE_FORMATTER.format(timestamp);
}

function byNewestFirst(a: BlogMeta, b: BlogMeta) {
    const bTimestamp = parseDateToTimestamp(b.date);
    const aTimestamp = parseDateToTimestamp(a.date);
    const safeB = Number.isNaN(bTimestamp) ? 0 : bTimestamp;
    const safeA = Number.isNaN(aTimestamp) ? 0 : aTimestamp;
    return safeB - safeA;
}

function formatLabelFromSlug(slug: string): string {
    return slug
        .split(/[-_]/g)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function resolveGroupLabel(
    projectKey: string,
    projectLabels: Record<string, string>
): string {
    const mappedLabel = projectLabels[projectKey];
    if (mappedLabel) return mappedLabel;
    if (projectKey === "independent") return "General Learnings";
    return formatLabelFromSlug(projectKey);
}

export default function BlogExplorer({ blogs, projectLabels }: BlogExplorerProps) {
    const [mode, setMode] = useState<ViewMode>("project-tree");
    const [selectedTopic, setSelectedTopic] = useState("All");

    const topics = useMemo(() => {
        const allTags = blogs.flatMap((blog) => blog.tags ?? []);
        return ["All", ...Array.from(new Set(allTags)).sort()];
    }, [blogs]);

    const projectGroups = useMemo<ProjectGroup[]>(() => {
        const grouped = new Map<string, BlogMeta[]>();

        for (const blog of blogs) {
            const key = blog.projectSlug ?? "independent";
            const existing = grouped.get(key);
            if (existing) {
                existing.push(blog);
            } else {
                grouped.set(key, [blog]);
            }
        }

        return Array.from(grouped.entries())
            .map(([projectKey, groupBlogs]) => {
                const sorted = [...groupBlogs].sort(byNewestFirst);
                const parents = sorted.filter((blog) => !blog.parentSlug);
                const children = sorted.filter((blog) => !!blog.parentSlug);
                const parentSlugSet = new Set(parents.map((blog) => blog.slug));

                const childrenByParent: Record<string, BlogMeta[]> = {};
                const orphanChildren: BlogMeta[] = [];

                for (const child of children) {
                    const parentSlug = child.parentSlug;
                    if (!parentSlug) {
                        continue;
                    }

                    if (!parentSlugSet.has(parentSlug)) {
                        orphanChildren.push(child);
                        continue;
                    }

                    if (!childrenByParent[parentSlug]) {
                        childrenByParent[parentSlug] = [];
                    }
                    childrenByParent[parentSlug].push(child);
                }

                for (const key of Object.keys(childrenByParent)) {
                    childrenByParent[key].sort(byNewestFirst);
                }
                orphanChildren.sort(byNewestFirst);

                return {
                    projectKey,
                    projectLabel: resolveGroupLabel(projectKey, projectLabels),
                    parents,
                    childrenByParent,
                    orphanChildren,
                };
            })
            .sort((a, b) => {
                const newestA = a.parents[0] ?? a.orphanChildren[0];
                const newestB = b.parents[0] ?? b.orphanChildren[0];
                if (!newestA || !newestB) return 0;
                return byNewestFirst(newestA, newestB);
            });
    }, [blogs, projectLabels]);

    const filteredBlogs = useMemo(() => {
        if (selectedTopic === "All") return blogs;
        return blogs.filter((blog) => blog.tags.includes(selectedTopic));
    }, [blogs, selectedTopic]);

    return (
        <div>
            {/* Mode toggle */}
            <div
                style={{
                    display: "flex",
                    gap: "1.5rem",
                    marginBottom: "2.5rem",
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: "0.75rem",
                }}
                className="reveal-up reveal-delay-1"
            >
                {MODE_LABELS.map((option) => (
                    <button
                        key={option.key}
                        type="button"
                        onClick={() => setMode(option.key)}
                        className="link-btn"
                        style={{
                            color: mode === option.key ? "var(--text)" : "var(--text-muted)",
                            textDecorationColor: mode === option.key ? "var(--text-muted)" : "transparent",
                            fontWeight: mode === option.key ? 500 : 400,
                        }}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {mode === "project-tree" ? (
                <div style={{ display: "grid", gap: "3rem" }}>
                    {projectGroups.map((group) => (
                        <section key={group.projectKey} className="reveal-up">
                            {/* Group header */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: "1rem",
                                    marginBottom: "1.25rem",
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "1.1rem",
                                        fontWeight: 400,
                                        margin: 0,
                                        letterSpacing: "0.01em",
                                    }}
                                >
                                    {group.projectLabel}
                                </h2>
                                <span
                                    style={{
                                        fontSize: "0.72rem",
                                        color: "var(--text-muted)",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    {group.parents.length} {group.parents.length === 1 ? "post" : "posts"}
                                </span>
                            </div>

                            <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "0 0 1.25rem" }} />

                            {group.parents.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                                    No posts yet for this project.
                                </p>
                            ) : (
                                <div style={{ display: "grid", gap: "1.75rem" }}>
                                    {group.parents.map((parent) => {
                                        const children = group.childrenByParent[parent.slug] ?? [];
                                        return (
                                            <article key={parent.slug}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "baseline",
                                                        justifyContent: "space-between",
                                                        gap: "1rem",
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    <Link href={`/blogs/${parent.slug}`}>
                                                        <h3
                                                            style={{
                                                                fontFamily: "var(--font-display)",
                                                                fontSize: "1.15rem",
                                                                fontWeight: 300,
                                                                margin: 0,
                                                                lineHeight: 1.2,
                                                            }}
                                                        >
                                                            {parent.title}
                                                        </h3>
                                                    </Link>
                                                    <time
                                                        style={{
                                                            fontSize: "0.75rem",
                                                            color: "var(--text-muted)",
                                                            letterSpacing: "0.04em",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {formatBlogDate(parent.date)}
                                                    </time>
                                                </div>

                                                {parent.description && (
                                                    <p
                                                        style={{
                                                            margin: "0.4rem 0 0",
                                                            fontSize: "0.875rem",
                                                            color: "var(--text-muted)",
                                                            lineHeight: 1.7,
                                                            maxWidth: "560px",
                                                        }}
                                                    >
                                                        {parent.description}
                                                    </p>
                                                )}

                                                {children.length > 0 && (
                                                    <div
                                                        style={{
                                                            marginTop: "0.9rem",
                                                            paddingLeft: "1rem",
                                                            borderLeft: "1px solid var(--border)",
                                                            display: "grid",
                                                            gap: "0.6rem",
                                                        }}
                                                    >
                                                        {children.map((child) => (
                                                            <div key={child.slug}>
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "baseline",
                                                                        justifyContent: "space-between",
                                                                        gap: "1rem",
                                                                        flexWrap: "wrap",
                                                                    }}
                                                                >
                                                                    <Link href={`/blogs/${child.slug}`}>
                                                                        <span
                                                                            style={{
                                                                                fontSize: "0.875rem",
                                                                                fontFamily: "var(--font-body)",
                                                                            }}
                                                                        >
                                                                            {child.title}
                                                                        </span>
                                                                    </Link>
                                                                    <time
                                                                        style={{
                                                                            fontSize: "0.72rem",
                                                                            color: "var(--text-muted)",
                                                                            letterSpacing: "0.04em",
                                                                            whiteSpace: "nowrap",
                                                                        }}
                                                                    >
                                                                        {formatBlogDate(child.date)}
                                                                    </time>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            )}

                            {group.orphanChildren.length > 0 && (
                                <div style={{ marginTop: "1.25rem" }}>
                                    <p
                                        style={{
                                            fontSize: "0.72rem",
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                            margin: "0 0 0.5rem",
                                        }}
                                    >
                                        Unlinked sub-articles
                                    </p>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.3rem" }}>
                                        {group.orphanChildren.map((child) => (
                                            <li key={child.slug}>
                                                <Link
                                                    href={`/blogs/${child.slug}`}
                                                    style={{ fontSize: "0.875rem" }}
                                                >
                                                    {child.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            ) : (
                <div>
                    {/* Topic filter */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <label
                            htmlFor="topic-filter"
                            style={{
                                fontSize: "0.82rem",
                                color: "var(--text-muted)",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Topic
                        </label>
                        <select
                            id="topic-filter"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            style={{
                                border: "1px solid var(--border)",
                                background: "var(--bg)",
                                color: "var(--text)",
                                padding: "0.25rem 0.6rem",
                                fontSize: "0.82rem",
                                fontFamily: "var(--font-body)",
                                cursor: "pointer",
                            }}
                        >
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>
                                    {topic}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "grid", gap: "2rem" }}>
                        {filteredBlogs.map((blog) => (
                            <article key={blog.slug} className="reveal-up">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: "0.6rem",
                                        flexWrap: "wrap",
                                        marginBottom: "0.35rem",
                                    }}
                                >
                                    <span className="tag">
                                        {resolveGroupLabel(
                                            blog.projectSlug ?? "independent",
                                            projectLabels
                                        )}
                                    </span>
                                    {blog.status === "wip" && (
                                        <span className="tag" style={{ color: "var(--text-muted)" }}>
                                            WIP
                                        </span>
                                    )}
                                </div>

                                <Link href={`/blogs/${blog.slug}`}>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "1.15rem",
                                            fontWeight: 300,
                                            margin: "0.1rem 0 0.25rem",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {blog.title}
                                    </h3>
                                </Link>

                                <time
                                    style={{
                                        display: "block",
                                        fontSize: "0.75rem",
                                        color: "var(--text-muted)",
                                        letterSpacing: "0.04em",
                                        marginBottom: "0.4rem",
                                    }}
                                >
                                    {formatBlogDate(blog.date)}
                                </time>

                                {blog.description && (
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: "0.875rem",
                                            color: "var(--text-muted)",
                                            lineHeight: 1.7,
                                            maxWidth: "560px",
                                        }}
                                    >
                                        {blog.description}
                                    </p>
                                )}

                                {blog.tags.length > 0 && (
                                    <ul
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "0.4rem",
                                            listStyle: "none",
                                            padding: 0,
                                            margin: "0.6rem 0 0",
                                        }}
                                    >
                                        {blog.tags.map((tag) => (
                                            <li key={`${blog.slug}-${tag}`}>
                                                <span className="tag">{tag}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "1.25rem 0 0" }} />
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
