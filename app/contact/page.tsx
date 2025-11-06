"use client";

import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { Typography } from "@mui/material";

export default function Contact() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-36">
            <p className="mb-10 font-extrabold text-6xl">
                Let’s Connect <span className="wave">👋</span>
            </p>

            <Typography
                variant="body1"
                className="max-w-2xl text-neutral-600 dark:text-neutral-300 mb-8"
            >
                If you’re working on something interesting or think I could be a
                good fit — feel free to reach out! Actively seeking SWE + ML
                internship opportunities for Summer 2026.
            </Typography>
            <div className="mt-8 mb-8 my-8 flex items-center gap-6">
                <IconButton
                    href="https://github.com/LubabDesu"
                    target="_blank"
                    aria-label="GitHub"
                    sx={{
                        color: "white", // uses theme color
                        transition: "transform 120ms ease",
                        "&:hover": {
                            transform: "translateY(-3px)",
                        },
                    }}
                >
                    <GitHubIcon fontSize="large" />
                </IconButton>
                <IconButton
                    href="www.linkedin.com/in/lucasyan"
                    target="_blank"
                    aria-label="GitHub"
                    sx={{
                        color: "white",
                        transition: "transform 120ms ease, color 120ms ease",
                        "&:hover": {
                            transform: "translateY(-3px)",
                        },
                    }}
                >
                    <LinkedInIcon fontSize="large" />
                </IconButton>
                <IconButton
                    href="mailto:lubabdesu@gmail.com"
                    target="_blank"
                    aria-label="GitHub"
                    sx={{
                        color: "white",
                        transition: "transform 120ms ease",
                        "&:hover": { transform: "translateY(-3px)" },
                    }}
                >
                    <EmailIcon fontSize="large" />
                </IconButton>
            </div>
        </div>
    );
}
