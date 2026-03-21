import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        maxWidth: "860px",
                        margin: "0 auto",
                        padding: "2rem 1.5rem 4rem",
                    }}
                >
                    <header style={{ marginBottom: "2rem" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "6px",
                            }}
                        >
                            <h1
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "26px",
                                    fontWeight: 800,
                                    letterSpacing: "-0.02em",
                                    color: "var(--text)",
                                    lineHeight: 1,
                                }}
                            >
                                BLOG STUDIO
                            </h1>
                            <span className="tag">local</span>
                        </div>
                        <p
                            style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                letterSpacing: "0.06em",
                            }}
                        >
                            voice → whisper → kimi k2 → github pr
                        </p>
                    </header>
                    {children}
                </div>
            </body>
        </html>
    );
}
