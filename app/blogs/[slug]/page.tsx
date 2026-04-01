import { getAllSlugs, getBlog } from "../../../lib/blogs";

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

export async function generateStaticParams() {
    // tell Next to prebuild each /blogs/[slug]
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlog(slug);
    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            images: post.image ? [post.image] : [],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlog(slug);

    return (
        <div className="reveal-up">
            <header style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                <h1
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        margin: "0 0 0.6rem",
                        color: "var(--text)",
                    }}
                >
                    {post.title}
                </h1>
                <time
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        display: "block",
                        marginBottom: "0.75rem",
                    }}
                >
                    {formatBlogDate(post.date)}
                </time>
                {!!post.tags?.length && (
                    <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", listStyle: "none", padding: 0, margin: 0 }}>
                        {post.tags.map((t) => (
                            <li key={t}>
                                <span className="tag">{t}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </header>

            <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
        </div>
    );
}
