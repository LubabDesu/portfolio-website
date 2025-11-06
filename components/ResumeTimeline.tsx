"use client";

import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { ResumeItem } from "../lib/resume";

type Props = { items: ResumeItem[] };

function formatDateRange(start: string, end?: string) {
    return end ? `${start} — ${end}` : start;
}

export default function ResumeTimeline({ items }: Props) {
    const sorted = [...items].sort((a, b) => {
        // Put "Present" items first, then compare year numbers when possible
        const aEnd = (a.end ?? "").toLowerCase();
        const bEnd = (b.end ?? "").toLowerCase();
        if (aEnd === "present" && bEnd !== "present") return -1;
        if (bEnd === "present" && aEnd !== "present") return 1;

        // Try to extract the year at the end of "Mon YYYY"
        const year = (s?: string) =>
            Number((s ?? "").match(/\b(\d{4})\b/)?.[1] ?? 0);
        return year(b.end) - year(a.end) || year(b.start) - year(a.start);
    });
    return (
        <Timeline position="alternate">
            {sorted.map((it, i) => (
                <TimelineItem key={it.id}>
                    <TimelineOppositeContent
                        color="text.secondary"
                        sx={{ minWidth: 140 }}
                    >
                        {formatDateRange(it.start, it.end)}
                        {it.location ? ` · ${it.location}` : ""}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        <TimelineDot />
                        {i < sorted.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent sx={{ pb: 4 }}>
                        <div className="font-semibold">
                            {it.title}
                            {it.org ? (
                                <span className="text-neutral-500 dark:text-neutral-400">
                                    {" "}
                                    · {it.org}
                                </span>
                            ) : null}
                        </div>

                        {it.bullets && it.bullets.length > 0 && (
                            <ul className="mt-2 list-disc ps-5 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                                {it.bullets.map((b, idx) => (
                                    <li key={idx}>{b}</li>
                                ))}
                            </ul>
                        )}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
