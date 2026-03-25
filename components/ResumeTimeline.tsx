"use client";

import * as React from "react";
import { ResumeItem } from "../lib/resume";

type Props = { items: ResumeItem[] };

function formatDateRange(start: string, end?: string) {
    return end ? `${start} — ${end}` : start;
}

export default function ResumeTimeline({ items }: Props) {
    const sorted = [...items].sort((a, b) => {
        // Put "Present" items first, then compare year numbers when possible
        const aEnd = (a.end ?? "").toLowerCase();
        const bEnd = (b.end ?? "").toLowerCase();
        if (aEnd === "present" && bEnd !== "present") return -1;
        if (bEnd === "present" && aEnd !== "present") return 1;

        // Try to extract the year at the end of "Mon YYYY"
        const year = (s?: string) =>
            Number((s ?? "").match(/\b(\d{4})\b/)?.[1] ?? 0);
        return year(b.end) - year(a.end) || year(b.start) - year(a.start);
    });

    return (
        <div
            style={{
                borderLeft: "2px solid var(--border)",
                paddingLeft: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
            }}
        >
            {sorted.map((it) => (
                <div key={it.id} style={{ position: "relative" }}>
                    {/* Timeline dot */}
                    <div
                        style={{
                            position: "absolute",
                            left: "-1.75rem",
                            top: "0.35rem",
                            width: "0.4rem",
                            height: "0.4rem",
                            borderRadius: "50%",
                            backgroundColor: "var(--border)",
                            border: "1px solid var(--text-muted)",
                            flexShrink: 0,
                        }}
                    />

                    {/* Date and location */}
                    <div
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            marginBottom: "0.3rem",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        {formatDateRange(it.start, it.end)}
                        {it.location ? ` · ${it.location}` : ""}
                    </div>

                    {/* Title and org */}
                    <div
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            fontWeight: 300,
                            color: "var(--text)",
                            marginBottom: "0.4rem",
                        }}
                    >
                        {it.title}
                        {it.org ? (
                            <span style={{ color: "var(--text-muted)" }}>
                                {" "}
                                · {it.org}
                            </span>
                        ) : null}
                    </div>

                    {/* Bullets */}
                    {it.bullets && it.bullets.length > 0 && (
                        <ul
                            style={{
                                margin: "0 0 0.75rem",
                                paddingLeft: "1.1rem",
                                fontSize: "0.9rem",
                                lineHeight: 1.7,
                                color: "var(--text-muted)",
                            }}
                        >
                            {it.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    )}

                    {/* Tags */}
                    {it.tags && it.tags.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.4rem",
                            }}
                        >
                            {it.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
