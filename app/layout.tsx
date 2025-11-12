import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voice JKN Agent - Asisten Suara JKN & Curhat Aman",
  description:
    "Asisten suara dwibahasa untuk peserta JKN dengan fitur konsultasi dan dukungan kesehatan mental",
  keywords: ["JKN", "BPJS", "kesehatan", "mental health", "voice assistant"],
  authors: [{ name: "Voice JKN Agent Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
