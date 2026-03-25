import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./md";

export type BlogMeta = {
    slug: string;
    title: string;
    description: string;
    date: string; // ISO date in frontmatter, e.g. "2025-07-30"
    tags: string[];
    projectSlug?: string;
    parentSlug?: string;
    image?: string;
    featured?: boolean;
    status?: "shipped" | "wip";
    href?: string;
    repo?: string;
};

export type Blog = BlogMeta & {
    bodyHtml: string; // rendered HTML from Markdown content
};

const BLOG_DIR = path.join(process.cwd(), "content", "blogs");

function getMarkdownFilesRecursive(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;
        if (entry.name.startsWith("_")) continue;

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getMarkdownFilesRecursive(fullPath));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".md")) {
            files.push(fullPath);
        }
    }

    return files;
}

function deriveSlugFromPath(filePath: string): string {
    const relative = path.relative(BLOG_DIR, filePath).replace(/\\/g, "/");
    return relative.replace(/\.md$/, "").replace(/\//g, "-");
}

function getBlogFileIndex(): Map<string, string> {
    const markdownFiles = getMarkdownFilesRecursive(BLOG_DIR).sort();
    const index = new Map<string, string>();

    for (const filePath of markdownFiles) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        const slug =
            typeof data.slug === "string" && data.slug.trim().length > 0
                ? data.slug.trim()
                : deriveSlugFromPath(filePath);

        if (index.has(slug)) {
            throw new Error(
                `Duplicate blog slug "${slug}" found at ${filePath} and ${index.get(
                    slug
                )}`
            );
        }
        index.set(slug, filePath);
    }

    return index;
}

export function getAllSlugs(): string[] {
    return Array.from(getBlogFileIndex().keys());
}

export function getBlogFile(slug: string): string {
    const filePath = getBlogFileIndex().get(slug);
    if (!filePath) {
        throw new Error(`Blog "${slug}" not found in ${BLOG_DIR}`);
    }
    return fs.readFileSync(filePath, "utf-8");
}

function parseBlogMeta(slug: string, raw: string): BlogMeta {
    const { data } = matter(raw);
    // minimal validation with helpful error
    if (!data.title || !data.description || !data.date) {
        throw new Error(`Missing required frontmatter in ${slug}.md`);
    }
    const parsedDate =
        data.date instanceof Date
            ? data.date.toISOString().slice(0, 10)
            : String(data.date);
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return {
        slug,
        title: data.title,
        description: data.description,
        date: parsedDate,
        tags,
        projectSlug: data.projectSlug,
        parentSlug: data.parentSlug,
        image: data.image,
        featured: data.featured ?? false,
        status: data.status,
        href: data.href,
        repo: data.repo,
    };
}

export function getBlogMeta(slug: string): BlogMeta {
    const raw = getBlogFile(slug);
    return parseBlogMeta(slug, raw);
}

export async function getBlog(slug: string): Promise<Blog> {
    const raw = getBlogFile(slug);
    const { content } = matter(raw);
    const bodyHtml = await markdownToHtml(content);
    return {
        ...parseBlogMeta(slug, raw),
        bodyHtml,
    };
}

export function getAllBlogMetaSorted(): BlogMeta[] {
    const index = getBlogFileIndex();
    const metas = Array.from(index.entries()).map(([slug, filePath]) =>
        parseBlogMeta(slug, fs.readFileSync(filePath, "utf-8"))
    );
    // newest first
    return metas.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
