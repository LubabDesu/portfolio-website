import Link from "next/link";

export default function Home() {
    return (
        <div className="reveal-up" style={{ paddingTop: "5rem" }}>
            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    margin: "0 0 1.5rem",
                }}
            >
                Lucas Yan
            </h1>

            <p
                style={{
                    maxWidth: "480px",
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                    margin: "0 0 2.5rem",
                }}
            >
                Math–CS student at UC San Diego. I build full-stack apps,
                machine learning tools, and interactive AI systems.
            </p>

            <div
                className="reveal-up reveal-delay-1"
                style={{ display: "flex", gap: "2rem", fontSize: "0.9rem" }}
            >
                <Link href="/projects" className="link-btn">
                    Projects
                </Link>
                <Link
                    href="/resume"
                    style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                    }}
                >
                    Resume
                </Link>
                <Link
                    href="/contact"
                    style={{
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                    }}
                >
                    Contact
                </Link>
            </div>
        </div>
    );
}
