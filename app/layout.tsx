import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorium Prapemrosesan Teks NLP",
  description: "Media pembelajaran interaktif prapemrosesan teks untuk perkuliahan NLP.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
