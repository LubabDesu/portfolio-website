import Link from "next/link";
import type { BlogMeta } from "../lib/blogs";

export default function BlogCard({ blog }: { blog: BlogMeta }) {
    const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <article
            style={{
                paddingBottom: "1.5rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1rem",
                    marginBottom: "0.3rem",
                }}
            >
                <span
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        flexShrink: 0,
                        fontFamily: "var(--font-body)",
                    }}
                >
                    {formattedDate}
                </span>

                <Link
                    href={`/blogs/${blog.slug}`}
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        fontWeight: 300,
                        color: "var(--text)",
                        textDecoration: "none",
                    }}
                    className="blog-title-link"
                >
                    {blog.title}
                </Link>

                {blog.status === "wip" && (
                    <span className="tag" style={{ flexShrink: 0 }}>
                        wip
                    </span>
                )}
            </div>

            {blog.description && (
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        margin: "0 0 0.6rem",
                        lineHeight: 1.6,
                    }}
                >
                    {blog.description}
                </p>
            )}

            {blog.tags?.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                    }}
                >
                    {blog.tags.map((t) => (
                        <span key={t} className="tag">
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </article>
    );
}
