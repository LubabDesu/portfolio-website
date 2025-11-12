"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// tiny helper for class merging
function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

const links = [
    { href: "/", label: "Home", exact: true },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/resume", label: "Resume" },
    { href: "/contact", label: "Contact" },
    { href: "/blogs", label: "Blogs" },
];

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (href: string, exact = false) => {
        if (exact) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    };
    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/60 backdrop-blur-md dark:bg-neutral-950/60 dark:border-neutral-800">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo / Name */}
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight hover:opacity-80 transition"
                >
                    Lucas Yan
                </Link>

                <ul className="flex items-center gap-10 text-sm font-medium">
                    {links.map(({ href, label, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={cx(
                                        "transition",
                                        active
                                            ? // ACTIVE STYLE
                                              "text-blue-600 dark:text-blue-400 underline underline-offset-8 decoration-2"
                                            : // INACTIVE STYLE
                                              "hover:text-blue-600 dark:hover:text-blue-400"
                                    )}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}
