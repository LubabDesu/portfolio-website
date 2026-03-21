"use client";

import { useState, useRef, useCallback } from "react";

type Props = { onTranscript: (text: string) => void };
type Status = "idle" | "recording" | "transcribing" | "done" | "error";

export default function Recorder({ onTranscript }: Props) {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        setError(null);
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
    }, []);

    const stopRecording = useCallback(() => {
        recorderRef.current?.stop();
        setStatus("transcribing");
    }, []);

    const transcribe = async (blob: Blob) => {
        try {
            const { pipeline } = await import("@huggingface/transformers");
            // whisper-small.en: ~500MB, downloads once, cached in browser IndexedDB
            const transcriber = await pipeline(
                "automatic-speech-recognition",
                "Xenova/whisper-small.en",
            );
            const arrayBuffer = await blob.arrayBuffer();
            const audioCtx = new AudioContext({ sampleRate: 16000 });
            const decoded = await audioCtx.decodeAudioData(arrayBuffer);
            const result = await transcriber(decoded.getChannelData(0), {
                chunk_length_s: 30,
                stride_length_s: 5,
            });
            const text = Array.isArray(result)
                ? result.map((r: { text: string }) => r.text).join(" ")
                : (result as { text: string }).text;
            onTranscript(text.trim());
            setStatus("done");
        } catch (err) {
            setError(String(err));
            setStatus("error");
        }
    };

    return (
        <section
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
            }}
        >
            <h2>1. Record</h2>
            {status === "idle" && (
                <button
                    onClick={startRecording}
                    style={{ padding: "0.5rem 1.5rem", fontSize: "1rem" }}
                >
                    Start Recording
                </button>
            )}
            {status === "recording" && (
                <button
                    onClick={stopRecording}
                    style={{
                        padding: "0.5rem 1.5rem",
                        fontSize: "1rem",
                        background: "#c00",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Stop Recording
                </button>
            )}
            {status === "transcribing" && (
                <p>
                    Transcribing...{" "}
                    <em>
                        (first run: downloading Whisper model ~500MB, may take a
                        few minutes)
                    </em>
                </p>
            )}
            {status === "done" && (
                <p style={{ color: "green" }}>Transcription complete</p>
            )}
            {status === "error" && (
                <p style={{ color: "red" }}>Error: {error}</p>
            )}
        </section>
    );
}
