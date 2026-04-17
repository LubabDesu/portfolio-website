import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const notoSerif = Noto_Serif({
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
    variable: "--font-noto-serif",
    display: "swap",
});

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Lucas Yan",
    description:
        "Math–CS student at UC San Diego. Building full-stack apps, ML tools, and AI systems.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${notoSerif.variable} ${manrope.variable}`}
        >
            <body>
                <div className="layout">
                    <Sidebar />
                    <main className="main-content">{children}</main>
                </div>
            </body>
        </html>
    );
}
