import { projects } from "../../lib/projects";
import ProjectCard from "../../components/ProjectCard";

export default function Projects() {
    const sorted = projects;
    return (
        <div className="reveal-up">
            <span className="section-num">Projects</span>
            <h1 className="page-title" style={{ marginTop: "0.75rem" }}>Selected work.</h1>
            <span className="page-subtitle">Things I&apos;ve built</span>
            <div style={{ display: "grid", gap: "2.5rem" }}>
                {sorted.map((p) => (
                    <ProjectCard key={p.slug} {...p} />
                ))}
            </div>
        </div>
    );
}
