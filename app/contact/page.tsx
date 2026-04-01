import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="reveal-up">

            <span className="section-num">Contact</span>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    margin: "0.75rem 0 1.5rem",
                }}
            >
                Let&apos;s start a{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400 }}>
                    meaningful
                </em>{" "}
                conversation.
            </h1>

            <div
                style={{
                    height: "1px",
                    width: "3rem",
                    background: "var(--border-solid)",
                    opacity: 0.4,
                    marginBottom: "2rem",
                }}
            />

            <p
                style={{
                    color: "var(--text-muted)",
                    maxWidth: "400px",
                    marginBottom: "3.5rem",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                }}
            >
                Currently seeking software engineering internships for Summer
                2025. Open to full-time roles starting 2026. I respond to every
                message — expect a reply within 48 hours.
            </p>

            {/* Primary email */}
            <div style={{ marginBottom: "3rem" }}>
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.625rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                        opacity: 0.6,
                        display: "block",
                        marginBottom: "0.75rem",
                    }}
                >
                    Digital Residence
                </span>
                <a
                    href="mailto:lubabdesu@gmail.com"
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1.1rem",
                        color: "var(--primary)",
                        textDecoration: "underline",
                        textUnderlineOffset: "6px",
                        textDecorationColor: "var(--border)",
                        transition: "color 300ms ease",
                    }}
                >
                    lubabdesu@gmail.com
                </a>
            </div>

            {/* Social links */}
            <nav
                style={{
                    display: "flex",
                    gap: "2rem",
                    alignItems: "center",
                }}
            >
                {[
                    { href: "https://github.com/LubabDesu", label: "GitHub" },
                    { href: "https://www.linkedin.com/in/lucasyan", label: "LinkedIn" },
                ].map(({ href, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            textDecoration: "none",
                            transition: "color 300ms ease",
                        }}
                    >
                        {label}
                    </a>
                ))}
            </nav>

            {/* Availability note */}
            <div
                style={{
                    marginTop: "5rem",
                    padding: "2rem 2.5rem",
                    background: "var(--surface-low)",
                    border: "1px solid var(--border)",
                    borderRadius: "2px",
                    maxWidth: "440px",
                }}
            >
                <h4
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        margin: "0 0 0.5rem",
                    }}
                >
                    Available for select projects.
                </h4>
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        margin: 0,
                        fontWeight: 300,
                    }}
                >
                    Currently booking for Summer 2025 internships &amp; new
                    grad 2026.
                </p>
            </div>
        </div>
    );
}
