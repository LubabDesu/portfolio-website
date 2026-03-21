"use client";

import { useState } from "react";

type Props = {
    transcript: string;
    content: string;
    onChange: (content: string) => void;
    onRegenerate: (feedback: string) => void;
    isGenerating: boolean;
};

export default function ArticleEditor({
    transcript,
    content,
    onChange,
    onRegenerate,
    isGenerating,
}: Props) {
    const [feedback, setFeedback] = useState("");

    const handleRegenerate = () => {
        onRegenerate(feedback);
        setFeedback("");
    };

    return (
        <div className="card animate-in">
            <div className="card-header">
                <span className="badge">3</span>
                <h2>Article</h2>
                <span
                    style={{
                        marginLeft: "auto",
                        fontSize: "10px",
                        color: "var(--text-muted)",
                    }}
                >
                    {content.length > 0
                        ? `${content.length} chars`
                        : "awaiting generation"}
                </span>
            </div>
            <div className="card-body">
                <textarea
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    rows={22}
                    className="field-input"
                    style={{
                        resize: "vertical",
                        lineHeight: 1.75,
                        fontSize: "12.5px",
                        minHeight: "300px",
                    }}
                    placeholder="Generated article will appear here…"
                />
                <div className="divider" />
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        className="field-input"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Feedback for regeneration… (Enter to submit)"
                        style={{ flex: 1 }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isGenerating && transcript) {
                                handleRegenerate();
                            }
                        }}
                    />
                    <button
                        className="btn btn-ghost"
                        onClick={handleRegenerate}
                        disabled={isGenerating || !transcript}
                        style={{ flexShrink: 0 }}
                    >
                        {isGenerating ? (
                            <>
                                <span className="spinner" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="1 4 1 10 7 10" />
                                    <path d="M3.51 15a9 9 0 1 0 .49-3.71" />
                                </svg>
                                Regenerate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
