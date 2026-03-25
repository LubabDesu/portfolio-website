import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audio = formData.get("audio") as Blob;

        if (!audio) {
            return NextResponse.json(
                { ok: false, error: "audio is required" },
                { status: 400 },
            );
        }

        const groqForm = new FormData();
        groqForm.append("file", audio, "audio.webm");
        groqForm.append("model", "whisper-large-v3");

        const res = await fetch(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: groqForm,
            },
        );

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json(
                { ok: false, error: `Groq error: ${err}` },
                { status: 502 },
            );
        }

        const data = await res.json();
        return NextResponse.json({ ok: true, text: data.text as string });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 },
        );
    }
}
