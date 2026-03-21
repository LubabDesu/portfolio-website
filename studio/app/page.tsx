"use client";

import { useState, useCallback } from "react";
import Recorder from "../components/Recorder";
import MetadataPanel, { type ArticleDraft } from "../components/MetadataPanel";
import ArticleEditor from "../components/ArticleEditor";
import PublishPanel from "../components/PublishPanel";

export default function StudioPage() {
    const [transcript, setTranscript] = useState("");
    const [draft, setDraft] = useState<ArticleDraft | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [prUrl, setPrUrl] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);

    const generate = useCallback(async (text: string, feedback: string) => {
        setIsGenerating(true);
        setGenerateError(null);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: text, feedback }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error as string);
            setDraft(data.article as ArticleDraft);
            setPrUrl(null);
        } catch (err) {
            setGenerateError(String(err));
        } finally {
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
        try {
            const res = await fetch("/api/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ article: draft, prTitle }),
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error as string);
            setPrUrl(data.prUrl as string);
        } catch (err) {
            alert(`Publish failed: ${String(err)}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div>
            <Recorder onTranscript={handleTranscript} />

            {isGenerating && <p>Generating article with Kimi K2...</p>}
            {generateError && (
                <p style={{ color: "red" }}>
                    Generation error: {generateError}
                </p>
            )}

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
                    />
                </>
            )}
        </div>
    );
}
