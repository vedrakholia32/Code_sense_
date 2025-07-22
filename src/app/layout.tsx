import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ErrorSense - AI Error Analyzer",
  description: "AI-powered error explanation and debugging assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
