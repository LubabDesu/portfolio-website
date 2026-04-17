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
            <span className="section-num">Blog</span>
            <h1 className="page-title" style={{ marginTop: "0.75rem" }}>Writing & notes.</h1>
            <span className="page-subtitle">By project or topic</span>
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
