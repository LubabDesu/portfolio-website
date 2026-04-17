"use client";
import ResumeTimeline from "../../components/ResumeTimeline";
import { experience } from "../../lib/resume";

export default function ResumePage() {
    return (
        <div className="reveal-up">
            <header style={{ marginBottom: "4rem" }}>
                <span className="section-num">01</span>
                <div
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "2rem",
                        marginTop: "0.75rem",
                    }}
                >
                    <h1 className="page-title" style={{ margin: 0 }}>
                        Experience &amp; Education
                    </h1>
                    <a
                        href="/resume.pdf"
                        download="Lucas-Yan-Resume.pdf"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--text-muted)",
                            textDecoration: "none",
                            borderBottom: "1px solid var(--border-solid)",
                            paddingBottom: "1px",
                            transition: "color 300ms ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Download PDF
                    </a>
                </div>
            </header>
            <ResumeTimeline items={experience} />
        </div>
    );
}
