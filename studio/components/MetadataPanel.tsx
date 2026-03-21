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
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div style={{ marginBottom: "0.5rem" }}>
            <label
                style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    marginBottom: "2px",
                }}
            >
                {label}
            </label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: "100%", padding: "0.3rem 0.5rem" }}
            />
        </div>
    );
}

export default function MetadataPanel({ draft, onChange }: Props) {
    const set = (key: keyof ArticleDraft) => (v: string) =>
        onChange({ ...draft, [key]: v });
    return (
        <section
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
            }}
        >
            <h2>
                2. Metadata{" "}
                <span
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: "normal",
                        color: "#888",
                    }}
                >
                    (edit freely)
                </span>
            </h2>
            <Field label="Title" value={draft.title} onChange={set("title")} />
            <Field label="Slug" value={draft.slug} onChange={set("slug")} />
            <Field
                label="Description"
                value={draft.description}
                onChange={set("description")}
            />
            <Field label="Date" value={draft.date} onChange={set("date")} />
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
                label="Project Slug"
                value={draft.projectSlug ?? ""}
                onChange={(v) => onChange({ ...draft, projectSlug: v || null })}
            />
            <Field
                label="Parent Slug"
                value={draft.parentSlug ?? ""}
                onChange={(v) => onChange({ ...draft, parentSlug: v || null })}
            />
            <Field
                label="File Path in Repo"
                value={draft.suggestedFilePath}
                onChange={set("suggestedFilePath")}
            />
        </section>
    );
}
