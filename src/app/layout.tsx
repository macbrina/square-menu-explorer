import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Menu Explorer",
    template: "%s | Menu Explorer",
  },
  description:
    "Browse restaurant menus powered by the Square Catalog API. Filter by location, category, price, and size — built for Per Diem.",
  keywords: [
    "restaurant menu",
    "Square API",
    "catalog",
    "Per Diem",
    "menu explorer",
  ],
  authors: [{ name: "Precious Mbaekwe" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Menu Explorer",
    description:
      "Browse restaurant menus powered by the Square Catalog API — built for Per Diem.",
    type: "website",
    locale: "en_US",
    siteName: "Menu Explorer",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Menu Explorer" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu Explorer",
    description:
      "Browse restaurant menus powered by the Square Catalog API — built for Per Diem.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
