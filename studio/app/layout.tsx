export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    fontFamily: "monospace",
                    padding: "2rem",
                    maxWidth: "960px",
                    margin: "0 auto",
                }}
            >
                <h1
                    style={{
                        borderBottom: "2px solid #000",
                        paddingBottom: "0.5rem",
                    }}
                >
                    Blog Studio
                </h1>
                {children}
            </body>
        </html>
    );
}
