import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="reveal-up">
            <h1 className="page-title">Contact</h1>

            <p
                style={{
                    color: "var(--text-muted)",
                    maxWidth: "440px",
                    marginBottom: "3rem",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                }}
            >
                Currently seeking software engineering internships for Summer 2025.
                Open to full-time roles starting 2026.
            </p>

            <hr className="divider" />

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    marginTop: "2.5rem",
                }}
            >
                <a
                    href="https://github.com/LubabDesu"
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn"
                    style={{ fontSize: "1rem" }}
                >
                    GitHub →
                </a>
                <a
                    href="https://www.linkedin.com/in/lucasyan"
                    target="_blank"
                    rel="noreferrer"
                    className="link-btn"
                    style={{ fontSize: "1rem" }}
                >
                    LinkedIn →
                </a>
                <a
                    href="mailto:lubabdesu@gmail.com"
                    className="link-btn"
                    style={{ fontSize: "1rem" }}
                >
                    lubabdesu@gmail.com →
                </a>
            </nav>
        </div>
    );
}
