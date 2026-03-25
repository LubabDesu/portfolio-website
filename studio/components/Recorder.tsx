"use client";

import { useState, useRef, useCallback } from "react";

type Props = { onTranscript: (text: string) => void };
type Status = "idle" | "recording" | "transcribing" | "done" | "error";

export default function Recorder({ onTranscript }: Props) {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [capturedText, setCapturedText] = useState<string>("");
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const transcribe = useCallback(async (blob: Blob) => {
        try {
            const form = new FormData();
            form.append("audio", blob, "audio.webm");
            const res = await fetch("/api/transcribe", {
                method: "POST",
                body: form,
            });
            const data = await res.json() as { ok: boolean; text?: string; error?: string };
            if (!data.ok) throw new Error(data.error ?? "Transcription failed");
            const trimmed = (data.text ?? "").trim();
            setCapturedText(trimmed);
            onTranscript(trimmed);
            setStatus("done");
        } catch (err) {
            setError(String(err));
            setStatus("error");
        }
    }, [onTranscript]);

    const startRecording = useCallback(async () => {
        setError(null);
        setCapturedText("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };
            recorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                await transcribe(
                    new Blob(chunksRef.current, { type: "audio/webm" }),
                );
            };
            recorder.start();
            recorderRef.current = recorder;
            setStatus("recording");
        } catch (err) {
            setError(String(err));
            setStatus("error");
        }
    }, [transcribe]);

    const stopRecording = useCallback(() => {
        recorderRef.current?.stop();
        setStatus("transcribing");
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <span className="badge">1</span>
                <h2>Capture</h2>
                {status === "recording" && (
                    <span
                        style={{
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "10px",
                            color: "var(--rec)",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                        }}
                    >
                        <span
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "var(--rec)",
                                animation: "pulse-ring 1.4s ease infinite",
                                display: "inline-block",
                            }}
                        />
                        REC
                    </span>
                )}
            </div>

            <div className="card-body">
                {status === "idle" && (
                    <button className="btn btn-primary" onClick={startRecording}>
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 16a8 8 0 0 0 8-8h-2a6 6 0 0 1-12 0H4a8 8 0 0 0 8 8zm-1 2h2v3h-2v-3z" />
                        </svg>
                        Start Recording
                    </button>
                )}

                {status === "recording" && (
                    <button
                        className="btn btn-danger btn-recording"
                        onClick={stopRecording}
                    >
                        <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                        Stop Recording
                    </button>
                )}

                {status === "transcribing" && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            color: "var(--text-muted)",
                            fontSize: "12px",
                        }}
                    >
                        <span className="spinner" />
                        <span>Transcribing with Groq Whisper…</span>
                    </div>
                )}

                {status === "error" && (
                    <div className="error-banner">
                        {error}
                        <br />
                        <button
                            className="btn btn-ghost"
                            style={{ marginTop: 8, padding: "5px 12px" }}
                            onClick={() => setStatus("idle")}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {capturedText && (
                    <div
                        className="animate-in"
                        style={{ marginTop: status === "done" ? 0 : 14 }}
                    >
                        {status === "done" && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        letterSpacing: "0.1em",
                                        color: "var(--success)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Captured transcript
                                </span>
                                <button
                                    className="btn btn-ghost"
                                    style={{ padding: "4px 10px", fontSize: "11px" }}
                                    onClick={startRecording}
                                >
                                    Re-record
                                </button>
                            </div>
                        )}
                        <div className="transcript-box">{capturedText}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
