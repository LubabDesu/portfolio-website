"use client";

import ResumeTimeline from "../../components/ResumeTimeline";
import { experience } from "../../lib/resume";
export default function Resume() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
            <div className="mt-8">
                <ResumeTimeline items={experience} />
            </div>
        </div>
    );
}
