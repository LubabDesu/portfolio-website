"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home", exact: true },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/resume", label: "Resume" },
    { href: "/blogs", label: "Blogs" },
    { href: "/contact", label: "Contact" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact = false) => {
        if (exact) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside className="sidebar">
            <Link href="/" className="sidebar-name">
                Lucas Yan
            </Link>

            <nav className="sidebar-nav">
                {links.map(({ href, label, exact }) => (
                    <Link
                        key={href}
                        href={href}
                        className="nav-link"
                        aria-current={isActive(href, exact) ? "page" : undefined}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                ucsd<br />math–cs
            </div>
        </aside>
    );
}
