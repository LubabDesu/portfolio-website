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
        <main className="max-w-4xl mx-auto px-4 py-12">
            <article className="surface-panel p-6 md:p-8 reveal-up">
                <header className="mb-8 border-b border-slate-700/70 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 uppercase tracking-wide">
                        {formatBlogDate(post.date)}
                    </p>
                    {!!post.tags?.length && (
                        <ul className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((t) => (
                                <li
                                    key={t}
                                    className="chip"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>
                    )}
                </header>

                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                />
            </article>
        </main>
    );
}
