import { QueryProvider } from "@/components/query-provider";
import { TRIP_DESCRIPTION, TRIP_NAME } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { Toaster } from "sonner";
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
  title: TRIP_NAME,
  description: TRIP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={cn(pretendard.variable, tossface.variable)}
      suppressHydrationWarning
    >
      <body className="bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
