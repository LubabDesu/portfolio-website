import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export type BlogEntry = {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    projectSlug: string | null;
    parentSlug: string | null;
    pathHint: string; // relative path without .md, e.g. "transformer/parents/intro"
};

export function slugFromPath(relativePath: string): string {
    return relativePath
        .replace(/\.md$/, "")
        .replace(/\\/g, "/")
        .replace(/\//g, "-")
        .toLowerCase();
}

export function collectBlogTree(contentPath: string): BlogEntry[] {
    const results: BlogEntry[] = [];
    collect(contentPath, contentPath, results);
    return results;
}

function collect(base: string, dir: string, results: BlogEntry[]): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collect(base, full, results);
        } else if (entry.name.endsWith(".md")) {
            const rel = path.relative(base, full);
            const pathHint = rel.replace(/\.md$/, "").replace(/\\/g, "/");
            const { data } = matter(fs.readFileSync(full, "utf-8"));
            results.push({
                slug: (data.slug as string) ?? slugFromPath(rel),
                title: (data.title as string) ?? "",
                description: (data.description as string) ?? "",
                tags: (data.tags as string[]) ?? [],
                projectSlug: (data.projectSlug as string) ?? null,
                parentSlug: (data.parentSlug as string) ?? null,
                pathHint,
            });
        }
    }
}
