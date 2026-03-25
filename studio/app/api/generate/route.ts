import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import { collectBlogTree } from "../../../lib/blogs";
import { buildSystemPrompt, buildUserPrompt } from "../../../lib/prompts";
import { BLOG_WRITER_SKILL, HUMANIZER_SKILL } from "../../../lib/skills";

const CONTENT_PATH = path.resolve(
    process.env.PORTFOLIO_CONTENT_PATH ?? "../content/blogs",
);
const MODEL = process.env.OPENROUTER_MODEL ?? "moonshotai/kimi-k2";

export async function POST(req: NextRequest) {
    try {
        const { transcript, feedback } = (await req.json()) as {
            transcript: string;
            feedback?: string;
        };

        if (!transcript?.trim()) {
            return NextResponse.json(
                { ok: false, error: "transcript is required" },
                { status: 400 },
            );
        }

        const blogTree = collectBlogTree(CONTENT_PATH);
        const userPrompt = buildUserPrompt({ transcript, blogTree, feedback });

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        { role: "system", content: buildSystemPrompt({ blogWriter: BLOG_WRITER_SKILL, humanizer: HUMANIZER_SKILL }) },
                        { role: "user", content: userPrompt },
                    ],
                    temperature: 0.6,
                    response_format: { type: "json_object" },
                }),
            },
        );

        if (!response.ok) {
            const err = await response.text();
            return NextResponse.json(
                { ok: false, error: `OpenRouter error: ${err}` },
                { status: 502 },
            );
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content as string;

        // Strip markdown fences if model wraps output despite instructions
        const jsonStr = rawContent
            .replace(/^```(?:json)?\n?/, "")
            .replace(/\n?```$/, "")
            .trim();
        const article = JSON.parse(jsonStr);

        return NextResponse.json({ ok: true, article, promptSent: userPrompt });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 },
        );
    }
}
