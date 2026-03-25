import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string): Promise<string> {
    const file = await unified()
        .use(remarkParse) // Markdown -> mdast
        .use(remarkGfm) // GitHub-flavored MD
        .use(remarkRehype, { allowDangerousHtml: true }) // mdast -> hast
        .use(rehypeRaw) // parse any inline HTML in MD
        .use(rehypeHighlight) // syntax highlighting
        .use(rehypeStringify) // hast -> HTML string
        .process(markdown);

    return String(file);
}
