import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numbers Learning",
  description: "Fun numbers learning app for kids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
