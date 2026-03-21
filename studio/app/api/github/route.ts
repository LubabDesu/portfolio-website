import { NextRequest, NextResponse } from "next/server";
import { pushBlogAsPR, type ArticleMeta } from "../../../lib/github";

export async function POST(req: NextRequest) {
    try {
        const { article, prTitle } = (await req.json()) as {
            article: ArticleMeta;
            prTitle: string;
        };

        if (!article?.slug) {
            return NextResponse.json(
                { ok: false, error: "article.slug is required" },
                { status: 400 },
            );
        }

        const { prUrl, branchName } = await pushBlogAsPR(
            process.env.GITHUB_TOKEN!,
            {
                owner: process.env.GITHUB_OWNER!,
                repo: process.env.GITHUB_REPO!,
                article,
                prTitle,
            },
        );

        return NextResponse.json({ ok: true, prUrl, branchName });
    } catch (err) {
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 },
        );
    }
}
