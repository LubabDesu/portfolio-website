import Image from "next/image";
import Link from "next/link";
import * as fs from "fs";

export default function Home() {
    const path: string = "./headshot.jpg";
    return (
        <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-5xl flex-col justify-center px-8">
                <section className="flex flex-col gap-6">
                    <h1 className="text-4xl font-bold tracking-tight leading-tight text-black dark:text-white">
                        Hi, I’m Lucas <span className="wave">👋</span>
                    </h1>

                    <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-300">
                        I'm a Math–CS student at UC San Diego. I love building
                        full-stack apps, machine learning tools, and interactive
                        AI systems that help people learn and create faster.
                    </p>

                    <div className="flex gap-6 mt-2">
                        <Link
                            href="/projects"
                            className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium hover:opacity-80 transition dark:bg-white dark:text-black"
                        >
                            View Projects
                        </Link>

                        <Link
                            href="/contact"
                            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        >
                            Contact Me
                        </Link>
                        <Link
                            href="/resume"
                            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
                        >
                            Resume
                        </Link>
                    </div>
                </section>

                {fs.existsSync(path) && (
                    <section className="mt-16">
                        <Image
                            src="/headshot.jpg"
                            width={180}
                            height={180}
                            alt="Lucas headshot"
                            className="rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm"
                        />
                    </section>
                )}
            </main>
        </div>
    );
}
