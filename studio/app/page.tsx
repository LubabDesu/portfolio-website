"use client";

import { useState, useCallback, useRef } from "react";
import Recorder from "../components/Recorder";
import MetadataPanel, { type ArticleDraft } from "../components/MetadataPanel";
import ArticleEditor from "../components/ArticleEditor";
import PublishPanel from "../components/PublishPanel";

function PromptInspector({ prompt }: { prompt: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="terminal animate-in" style={{ marginBottom: "10px" }}>
            <div className="terminal-bar" onClick={() => setOpen((o) => !o)}>
                <span
                    className="terminal-dot"
                    style={{ background: "#e05252" }}
                />
                <span
                    className="terminal-dot"
                    style={{ background: "#d4a853" }}
                />
                <span
                    className="terminal-dot"
                    style={{ background: "#3d9e5f" }}
                />
                <span
                    style={{
                        marginLeft: "6px",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        flexGrow: 1,
                    }}
                >
                    Prompt Inspector
                </span>
                <span
                    style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                    }}
                >
                    {open ? "▲ hide" : "▼ show"}
                </span>
            </div>
            {open && (
                <pre className="terminal-body">
                    {prompt
                        .split("\n")
                        .map((line, i) => {
                            if (line.startsWith("## ")) {
                                return (
                                    <span key={i} className="t-section">
                                        {line}
                                        {"\n"}
                                    </span>
                                );
                            }
                            if (line.trim().startsWith('"')) {
                                return (
                                    <span key={i} className="t-value">
                                        {line}
                                        {"\n"}
                                    </span>
                                );
                            }
                            return (
                                <span key={i}>
                                    {line}
                                    {"\n"}
                                </span>
                            );
                        })}
                </pre>
            )}
        </div>
    );
}

export default function StudioPage() {
    const [transcript, setTranscript] = useState("");
    const [draft, setDraft] = useState<ArticleDraft | null>(null);
    const [promptSent, setPromptSent] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);

    const generateAbortRef = useRef<AbortController | null>(null);
    const publishAbortRef = useRef<AbortController | null>(null);

    const generate = useCallback(async (text: string, feedback: string) => {
        setIsGenerating(true);
        setGenerateError(null);
        const controller = new AbortController();
        generateAbortRef.current = controller;
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: text, feedback }),
                signal: controller.signal,
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error as string);
            setDraft(data.article as ArticleDraft);
            setPromptSent((data.promptSent as string) ?? null);
            setPrUrl(null);
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setGenerateError(String(err));
        } finally {
            generateAbortRef.current = null;
            setIsGenerating(false);
        }
    }, []);

    const handleTranscript = useCallback(
        (text: string) => {
            setTranscript(text);
            generate(text, "");
        },
        [generate],
    );

    const handlePublish = async (prTitle: string) => {
        if (!draft) return;
        setIsPublishing(true);
        const controller = new AbortController();
        publishAbortRef.current = controller;
        try {
            const res = await fetch("/api/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ article: draft, prTitle }),
                signal: controller.signal,
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error as string);
            setPrUrl(data.prUrl as string);
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            alert(`Publish failed: ${String(err)}`);
        } finally {
            publishAbortRef.current = null;
            setIsPublishing(false);
        }
    };

    return (
        <div>
            <Recorder onTranscript={handleTranscript} />

            {isGenerating && (
                <div
                    className="card animate-in"
                    style={{ marginBottom: "10px" }}
                >
                    <div
                        className="card-body"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span className="spinner" />
                        <span style={{ color: "var(--text-muted)", fontSize: "12px", flex: 1 }}>
                            Generating with Kimi K2…
                        </span>
                        <button
                            className="btn btn-ghost"
                            style={{ padding: "4px 10px", fontSize: "11px" }}
                            onClick={() => generateAbortRef.current?.abort()}
                        >
                            Stop
                        </button>
                    </div>
                </div>
            )}

            {generateError && (
                <div className="error-banner animate-in">{generateError}</div>
            )}

            {promptSent && <PromptInspector prompt={promptSent} />}

            {draft && (
                <>
                    <MetadataPanel
                        draft={draft}
                        onChange={(updated) => setDraft(updated)}
                    />
                    <ArticleEditor
                        transcript={transcript}
                        content={draft.content}
                        onChange={(content) =>
                            setDraft({ ...draft, content })
                        }
                        onRegenerate={(feedback) =>
                            generate(transcript, feedback)
                        }
                        isGenerating={isGenerating}
                    />
                    <PublishPanel
                        slug={draft.slug}
                        suggestedFilePath={draft.suggestedFilePath}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                        prUrl={prUrl}
                        onStop={() => publishAbortRef.current?.abort()}
                    />
                </>
            )}
        </div>
    );
}
