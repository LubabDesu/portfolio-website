import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { collectBlogTree, slugFromPath, type BlogEntry } from "../../lib/blogs";

describe("slugFromPath", () => {
    it("converts nested path to kebab slug", () => {
        expect(slugFromPath("transformer/parents/intro.md")).toBe(
            "transformer-parents-intro",
        );
    });
    it("strips .md extension", () => {
        expect(slugFromPath("foo/bar.md")).toBe("foo-bar");
    });
});

describe("collectBlogTree", () => {
    let tmpDir: string;

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "studio-test-"));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("returns empty array for empty directory", () => {
        expect(collectBlogTree(tmpDir)).toEqual([]);
    });

    it("skips files starting with _ or .", () => {
        fs.writeFileSync(
            path.join(tmpDir, "_template.md"),
            "---\ntitle: skip\n---\n",
        );
        fs.writeFileSync(
            path.join(tmpDir, ".hidden.md"),
            "---\ntitle: skip\n---\n",
        );
        expect(collectBlogTree(tmpDir)).toHaveLength(0);
    });

    it("parses frontmatter into BlogEntry", () => {
        const dir = path.join(tmpDir, "transformer", "parents");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
            path.join(dir, "intro.md"),
            '---\ntitle: "Intro"\ndescription: "desc"\ntags: ["AI"]\nprojectSlug: "transformer"\n---\nBody text\n',
        );
        const tree = collectBlogTree(tmpDir);
        expect(tree).toHaveLength(1);
        expect(tree[0]).toMatchObject<Partial<BlogEntry>>({
            title: "Intro",
            description: "desc",
            tags: ["AI"],
            projectSlug: "transformer",
            pathHint: "transformer/parents/intro",
        });
    });

    it("recursively collects nested files", () => {
        const d1 = path.join(tmpDir, "a", "parents");
        const d2 = path.join(tmpDir, "b", "children", "parent-1");
        fs.mkdirSync(d1, { recursive: true });
        fs.mkdirSync(d2, { recursive: true });
        fs.writeFileSync(
            path.join(d1, "post.md"),
            "---\ntitle: A\ndescription: a\ntags: []\n---\n",
        );
        fs.writeFileSync(
            path.join(d2, "child.md"),
            "---\ntitle: B\ndescription: b\ntags: []\nparentSlug: parent-1\n---\n",
        );
        expect(collectBlogTree(tmpDir)).toHaveLength(2);
    });
});
