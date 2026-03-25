import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Pro } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    variable: "--font-cormorant",
    display: "swap",
});

const crimson = Crimson_Pro({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
    variable: "--font-crimson",
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
            className={`${cormorant.variable} ${crimson.variable}`}
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
