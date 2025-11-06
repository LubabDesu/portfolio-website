// components/ProjectCard.tsx
import Link from "next/link";
import type { Project } from "../lib/projects";

export default function ProjectCard(p: Project) {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-sm transition">
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                {p.status && (
                    <span className="text-xs rounded-full border px-2 py-1 border-neutral-200 dark:border-neutral-800">
                        {p.status.toUpperCase()}
                    </span>
                )}
            </div>

            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {p.description}
            </p>

            {p.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                        <span
                            key={t}
                            className="text-xs rounded-full border px-2 py-1 border-neutral-200 dark:border-neutral-800"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            )}

            {(p.href || p.repo) && (
                <div className="mt-4 flex gap-3 text-sm">
                    {p.href && (
                        <Link
                            className="underline underline-offset-4"
                            href={p.href}
                            target="_blank"
                        >
                            Live
                        </Link>
                    )}
                    {p.repo && (
                        <Link
                            className="underline underline-offset-4"
                            href={p.repo}
                            target="_blank"
                        >
                            Code
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
