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

    return (
        <section
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
            }}
        >
            <h2>3. Article</h2>
            {transcript && (
                <details style={{ marginBottom: "0.75rem" }}>
                    <summary
                        style={{
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            color: "#555",
                        }}
                    >
                        View transcript
                    </summary>
                    <p
                        style={{
                            fontStyle: "italic",
                            color: "#666",
                            marginTop: "0.5rem",
                            fontSize: "0.85rem",
                        }}
                    >
                        {transcript}
                    </p>
                </details>
            )}
            <textarea
                value={content}
                onChange={(e) => onChange(e.target.value)}
                rows={24}
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                }}
                placeholder="Generated article will appear here..."
            />
            <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
            >
                <input
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Feedback for regeneration (optional)... press Enter to submit"
                    style={{ flex: 1, padding: "0.4rem 0.75rem" }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !isGenerating && transcript) {
                            onRegenerate(feedback);
                            setFeedback("");
                        }
                    }}
                />
                <button
                    onClick={() => {
                        onRegenerate(feedback);
                        setFeedback("");
                    }}
                    disabled={isGenerating || !transcript}
                    style={{ padding: "0.4rem 1rem", whiteSpace: "nowrap" }}
                >
                    {isGenerating ? "Generating..." : "Regenerate"}
                </button>
            </div>
        </section>
    );
}
