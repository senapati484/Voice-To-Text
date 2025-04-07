import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Custom display font
const display = localFont({
  src: "../fonts/ClashDisplay-Bold.woff2",
  variable: "--font-display",
  display: "swap",
});

// Custom text font
const text = localFont({
  src: "../fonts/Satoshi-Bold.woff2",
  variable: "--font-text",
  display: "swap",
});

export const metadata = {
  title: "Real-Time Voice to Text",
  description: "Instant voice transcription with redundancy prevention",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${display.variable} ${text.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
