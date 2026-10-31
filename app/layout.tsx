import type { Metadata } from "next";
import { Inter, Playfair_Display, Roboto } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { LangProvider } from "@/lib/i18n";
import "./tokens.css";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], variable: "--ff-playfair", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--ff-roboto", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--ff-inter", display: "swap" });
// The design system's Lucide icon font: one glyph per icon, drawn in currentColor.
const lucide = localFont({ src: "./fonts/lucide.woff2", variable: "--ff-lucide", display: "block", preload: false });

export const metadata: Metadata = {
  title: "Air Dive Alor",
  icons: { icon: "/brand/logo-mark-white.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${roboto.variable} ${inter.variable} ${lucide.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
