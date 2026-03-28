import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC Learning App",
  description: "Fun ABC learning app for kids with Grok API, animation, and photo upload"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
