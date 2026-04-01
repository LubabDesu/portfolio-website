import Link from "next/link";

export default function Home() {
    return (
        <div className="reveal-up" style={{ paddingTop: "6rem" }}>

            <span className="page-label">Math–CS · UC San Diego</span>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                    margin: "0 0 2rem",
                    maxWidth: "600px",
                }}
            >
                Building things at the edge of{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>
                    math, code,
                </em>{" "}
                and AI.
            </h1>

            <p
                style={{
                    maxWidth: "420px",
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    margin: "0 0 3rem",
                }}
            >
                Full-stack apps, machine learning tools, and interactive AI
                systems. Focused on clarity, craft, and things that actually
                work.
            </p>

            <div
                className="reveal-up reveal-delay-1"
                style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
            >
                <Link href="/projects" className="btn-primary">
                    View Projects
                    <span style={{ fontSize: "1rem", lineHeight: 1 }}>→</span>
                </Link>
                <Link
                    href="/contact"
                    style={{
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        transition: "color 300ms ease",
                    }}
                >
                    Get in touch
                </Link>
            </div>

            {/* Decorative divider */}
            <div
                className="reveal-up reveal-delay-2"
                style={{
                    marginTop: "6rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                }}
            >
                <div style={{ height: "1px", width: "2rem", background: "var(--border-solid)", opacity: 0.4 }} />
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.625rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        opacity: 0.6,
                    }}
                >
                    Currently open to internships & new grad roles
                </span>
            </div>
        </div>
    );
}
