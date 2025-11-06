import { projects } from "../../lib/projects";
import ProjectCard from "../../components/ProjectCard";

export default function Projects() {
    const sorted = projects;
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {sorted.map((p) => (
                    <ProjectCard key={p.slug} {...p} />
                ))}
            </div>
        </div>
    );
}
