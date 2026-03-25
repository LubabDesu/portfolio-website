import BlogExplorer from "../../components/BlogExplorer";
import { getAllBlogMetaSorted } from "../../lib/blogs";
import { projects } from "../../lib/projects";

export default function BlogsPage() {
    const blogs = getAllBlogMetaSorted();
    const projectLabels = Object.fromEntries(
        projects.map((project) => [project.slug, project.title])
    );

    return (
        <div className="reveal-up">
            <h1 className="page-title">Blog</h1>
            <span className="page-subtitle">Notes by project or topic</span>
            <BlogExplorer
                blogs={blogs}
                projectLabels={{
                    independent: "General Learnings",
                    budgetify: "Budgetify",
                    ...projectLabels,
                }}
            />
        </div>
    );
}
