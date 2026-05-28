import { QueryProvider } from "@/components/query-provider";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/pretendard.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

const tossface = localFont({
  src: "./fonts/toss-face.ttf",
  variable: "--font-tossface",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "요나고 2박 3일 여행",
  description: "돗토리현 · 요나고 · 2026.6.1–6.3",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${tossface.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="bg-background min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
