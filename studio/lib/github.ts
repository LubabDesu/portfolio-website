import { Octokit } from "@octokit/rest";

export type ArticleMeta = {
    title: string;
    slug: string;
    description: string;
    date: string;
    tags: string[];
    projectSlug: string | null;
    parentSlug: string | null;
    status: string;
    suggestedFilePath: string;
    content: string;
};

export function buildMarkdownFile(article: ArticleMeta): string {
    const lines: string[] = [
        "---",
        `title: "${article.title}"`,
        `slug: "${article.slug}"`,
        `description: "${article.description}"`,
        `date: "${article.date}"`,
        `tags: [${article.tags.map((t) => `"${t}"`).join(", ")}]`,
    ];

    if (article.projectSlug)
        lines.push(`projectSlug: "${article.projectSlug}"`);
    if (article.parentSlug) lines.push(`parentSlug: "${article.parentSlug}"`);
    lines.push(`status: "${article.status}"`);
    lines.push("---");

    return `${lines.join("\n")}\n\n${article.content}`;
}

export type PushParams = {
    owner: string;
    repo: string;
    article: ArticleMeta;
    prTitle: string;
};

export async function pushBlogAsPR(
    token: string,
    params: PushParams,
): Promise<{ prUrl: string; branchName: string }> {
    const { owner, repo, article, prTitle } = params;
    const octokit = new Octokit({ auth: token });

    const { data: ref } = await octokit.git.getRef({
        owner,
        repo,
        ref: "heads/main",
    });
    const mainSha = ref.object.sha;

    const branchName = `blog/${article.slug}`;
    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: mainSha,
    });

    const fileContent = buildMarkdownFile(article);
    await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: article.suggestedFilePath,
        message: `feat: add blog post "${article.slug}"`,
        content: Buffer.from(fileContent).toString("base64"),
        branch: branchName,
    });

    const { data: pr } = await octokit.pulls.create({
        owner,
        repo,
        title: prTitle,
        body: `Auto-generated via Blog Studio.\n\n**Slug:** \`${article.slug}\`\n**Tags:** ${article.tags.join(", ")}\n**File:** \`${article.suggestedFilePath}\``,
        head: branchName,
        base: "main",
    });

    return { prUrl: pr.html_url, branchName };
}
