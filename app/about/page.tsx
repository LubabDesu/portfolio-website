export default function AboutPage() {
    return (
        <div className="reveal-up">
            <span className="section-num">About</span>
            <h1 className="page-title" style={{ marginTop: "0.75rem" }}>Who I am.</h1>
            <span className="page-subtitle">Math–CS · UC San Diego</span>

            <section style={{ marginBottom: "2rem" }}>
                <p
                    style={{
                        maxWidth: "580px",
                        lineHeight: 1.8,
                        color: "var(--text-muted)",
                    }}
                >
                    I build intelligent, human-centered software that boosts
                    learning and creativity.
                </p>
            </section>

            <hr className="divider" />

            <section style={{ marginBottom: "2rem" }}>
                <h2
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        marginBottom: "1rem",
                        letterSpacing: "0.01em",
                    }}
                >
                    Focus Areas
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {["Python", "TypeScript", "ML Systems", "Agentic AI", "LLMs"].map((skill) => (
                        <span key={skill} className="tag">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            <hr className="divider" />

            <section style={{ marginBottom: "2rem" }}>
                <h2
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        marginBottom: "1rem",
                    }}
                >
                    Highlights
                </h2>
                <ul
                    style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "grid",
                        gap: "0.6rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.8,
                    }}
                >
                    <li>Incoming SWE Intern at Visa, Singapore (Summer 2026)</li>
                    <li>ML Intern at DSO National Labs — LangGraph storyboard agent</li>
                    <li>Built mini autograd engine; trained transformer on it from scratch</li>
                    <li>NovaSync: agentic travel planner w/ autonomous booking (hackathon)</li>
                </ul>
            </section>

            <hr className="divider" />

            <section>
                <h2
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        marginBottom: "1rem",
                    }}
                >
                    Outside Work
                </h2>
                <p
                    style={{
                        maxWidth: "580px",
                        lineHeight: 1.8,
                        color: "var(--text-muted)",
                    }}
                >
                    Classical piano (Chopin), Japanese, lifting/running, and
                    8-ball pool.
                </p>
            </section>
        </div>
    );
}
