import { projects } from "../../lib/projects";
import ProjectCard from "../../components/ProjectCard";

export default function Projects() {
    const sorted = projects;
    return (
        <div className="reveal-up">
            <h1 className="page-title">Projects</h1>
            <span className="page-subtitle">Selected work</span>
            <div style={{ display: "grid", gap: "2.5rem" }}>
                {sorted.map((p) => (
                    <ProjectCard key={p.slug} {...p} />
                ))}
            </div>
        </div>
    );
}
