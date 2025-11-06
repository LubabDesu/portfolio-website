"use client";

import Typography from "@mui/material/Typography";

export default function AboutPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="grid grid-cols-12 gap-10">
                {/* Sidebar */}
                <aside className="col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Lucas Yan
                            </h1>
                            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                                Math–CS @ UCSD · SWE / ML
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {[
                                    "Next.js",
                                    "TypeScript",
                                    "Python",
                                    "LLMs",
                                ].map((t) => (
                                    <span
                                        key={t}
                                        className="text-xs rounded-full border px-3 py-1 border-neutral-200 dark:border-neutral-800"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <nav className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 text-sm">
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#intro"
                                        className="hover:underline"
                                    >
                                        Intro
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#focus"
                                        className="hover:underline"
                                    >
                                        Focus
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#highlights"
                                        className="hover:underline"
                                    >
                                        Highlights
                                    </a>
                                </li>
                                <li>
                                    <a href="#life" className="hover:underline">
                                        Outside Work
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Main */}
                <main className="col-span-8 space-y-10">
                    <section
                        id="intro"
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h2 className="text-lg font-semibold">Intro</h2>
                        <p className="mt-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            I build intelligent, human-centered software that
                            boosts learning and creativity.
                        </p>
                    </section>

                    <section
                        id="focus"
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h2 className="text-lg font-semibold">Focus Areas</h2>
                        <ul className="mt-3 grid gap-2 text-neutral-700 dark:text-neutral-300">
                            <li>• Full-stack: Next.js, TS, FastAPI</li>
                            <li>• Multimodal AI + agentic workflows</li>
                        </ul>
                    </section>

                    <section
                        id="highlights"
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h2 className="text-lg font-semibold">Highlights</h2>
                        <ul className="mt-3 grid gap-2 text-neutral-700 dark:text-neutral-300">
                            <li>
                                • Real-time storyboard agent @ DSO (LangGraph,
                                LLMs)
                            </li>
                            <li>• Piano reduction research</li>
                            <li>• $7.5k summer grant</li>
                        </ul>
                    </section>

                    <section
                        id="life"
                        className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6"
                    >
                        <h2 className="text-lg font-semibold">Outside Work</h2>
                        <p className="mt-3 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            Classical piano (Chopin), Japanese, lifting/running,
                            and 8-ball pool.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
}
