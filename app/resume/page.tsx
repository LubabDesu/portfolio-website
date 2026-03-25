"use client";
import ResumeTimeline from "../../components/ResumeTimeline";
import { experience } from "../../lib/resume";

export default function ResumePage() {
    return (
        <div className="reveal-up">
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "2rem",
                    marginBottom: "3rem",
                }}
            >
                <h1 className="page-title" style={{ margin: 0 }}>
                    Resume
                </h1>
                <a
                    href="/resume.pdf"
                    download="Lucas-Yan-Resume.pdf"
                    className="link-btn"
                    style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}
                >
                    Download PDF
                </a>
            </div>
            <ResumeTimeline items={experience} />
        </div>
    );
}
