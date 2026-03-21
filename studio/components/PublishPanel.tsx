"use client";

import { useState, useEffect } from "react";

type Props = {
    slug: string;
    suggestedFilePath: string;
    onPublish: (prTitle: string) => void;
    isPublishing: boolean;
    prUrl: string | null;
};

export default function PublishPanel({
    slug,
    suggestedFilePath,
    onPublish,
    isPublishing,
    prUrl,
}: Props) {
    const [prTitle, setPrTitle] = useState("");

    useEffect(() => {
        setPrTitle(`feat: add blog post "${slug}"`);
    }, [slug]);

    return (
        <div className="card animate-in">
            <div className="card-header">
                <span className="badge">4</span>
                <h2>Publish</h2>
            </div>
            <div className="card-body">
                <div
                    style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "10px 12px",
                        marginBottom: "14px",
                        fontSize: "11.5px",
                        color: "var(--text-muted)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    <span>
                        Branch:{" "}
                        <code
                            style={{
                                color: "var(--accent)",
                                fontSize: "11px",
                            }}
                        >
                            blog/{slug || "…"}
                        </code>
                    </span>
                    <span>
                        File:{" "}
                        <code
                            style={{
                                color: "var(--text)",
                                fontSize: "11px",
                            }}
                        >
                            {suggestedFilePath || "…"}
                        </code>
                    </span>
                </div>

                <div className="field" style={{ marginBottom: "16px" }}>
                    <label className="field-label">PR Title</label>
                    <input
                        className="field-input"
                        value={prTitle}
                        onChange={(e) => setPrTitle(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-publish"
                    onClick={() => onPublish(prTitle)}
                    disabled={isPublishing || !slug}
                >
                    {isPublishing ? (
                        <>
                            <span className="spinner" style={{ borderTopColor: "#fff" }} />
                            Creating PR…
                        </>
                    ) : (
                        <>
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <line x1="12" y1="19" x2="12" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                            Push to GitHub
                        </>
                    )}
                </button>

                {prUrl && (
                    <div className="success-banner animate-in">
                        <span style={{ fontWeight: 600 }}>PR created</span>
                        <a href={prUrl} target="_blank" rel="noreferrer">
                            {prUrl}
                        </a>
                        <span
                            style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                            }}
                        >
                            Vercel preview deployment will start automatically.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
