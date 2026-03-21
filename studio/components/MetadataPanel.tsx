"use client";

export type ArticleDraft = {
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

type Props = { draft: ArticleDraft; onChange: (updated: ArticleDraft) => void };

function Field({
    label,
    value,
    onChange,
    span,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    span?: boolean;
}) {
    return (
        <div className="field" style={span ? { gridColumn: "1 / -1" } : {}}>
            <label className="field-label">{label}</label>
            <input
                className="field-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default function MetadataPanel({ draft, onChange }: Props) {
    const set = (key: keyof ArticleDraft) => (v: string) =>
        onChange({ ...draft, [key]: v });

    return (
        <div className="card animate-in">
            <div className="card-header">
                <span className="badge">2</span>
                <h2>Metadata</h2>
                <span
                    style={{
                        marginLeft: "auto",
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                    }}
                >
                    AI suggestion — edit freely
                </span>
            </div>
            <div className="card-body">
                <div className="field-grid">
                    <Field
                        label="Title"
                        value={draft.title}
                        onChange={set("title")}
                        span
                    />
                    <Field
                        label="Slug"
                        value={draft.slug}
                        onChange={set("slug")}
                    />
                    <Field
                        label="Date"
                        value={draft.date}
                        onChange={set("date")}
                    />
                    <Field
                        label="Description"
                        value={draft.description}
                        onChange={set("description")}
                        span
                    />
                    <Field
                        label="Tags (comma-separated)"
                        value={draft.tags.join(", ")}
                        onChange={(v) =>
                            onChange({
                                ...draft,
                                tags: v
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                            })
                        }
                    />
                    <Field
                        label="Status"
                        value={draft.status}
                        onChange={set("status")}
                    />
                    <Field
                        label="Project Slug"
                        value={draft.projectSlug ?? ""}
                        onChange={(v) =>
                            onChange({ ...draft, projectSlug: v || null })
                        }
                    />
                    <Field
                        label="Parent Slug"
                        value={draft.parentSlug ?? ""}
                        onChange={(v) =>
                            onChange({ ...draft, parentSlug: v || null })
                        }
                    />
                    <Field
                        label="File Path in Repo"
                        value={draft.suggestedFilePath}
                        onChange={set("suggestedFilePath")}
                        span
                    />
                </div>
            </div>
        </div>
    );
}
