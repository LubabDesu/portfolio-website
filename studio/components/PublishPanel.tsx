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
        <section
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
            }}
        >
            <h2>4. Publish</h2>
            <p
                style={{
                    fontSize: "0.85rem",
                    color: "#555",
                    margin: "0 0 0.75rem",
                }}
            >
                Branch: <code>blog/{slug}</code> → File:{" "}
                <code>{suggestedFilePath}</code>
            </p>
            <div style={{ marginBottom: "0.75rem" }}>
                <label
                    style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        marginBottom: "2px",
                    }}
                >
                    PR Title
                </label>
                <input
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    style={{ width: "100%", padding: "0.3rem 0.5rem" }}
                />
            </div>
            <button
                onClick={() => onPublish(prTitle)}
                disabled={isPublishing || !slug}
                style={{
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                {isPublishing ? "Creating PR..." : "Push to GitHub"}
            </button>
            {prUrl && (
                <p style={{ marginTop: "1rem", color: "green" }}>
                    PR created:{" "}
                    <a href={prUrl} target="_blank" rel="noreferrer">
                        {prUrl}
                    </a>
                    <br />
                    <span style={{ fontSize: "0.85rem", color: "#555" }}>
                        Vercel will create a preview deployment automatically.
                    </span>
                </p>
            )}
        </section>
    );
}
