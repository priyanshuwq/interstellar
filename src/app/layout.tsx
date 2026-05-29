import type { Metadata } from "next";
import {
  Inter,
  Space_Grotesk,
  Space_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

// display: swap — text renders with fallback font while custom font loads
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  // Not in hero path — defer loading
  preload: false,
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Interstellar — A Cinematic Web Experience",
  description:
    "An interactive, space-themed cinematic experience inspired by Christopher Nolan's Interstellar. Featuring a real-time raymarched black hole, the Endurance spacecraft, and time dilation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${playfair.variable} dark`}
    >
      <head>
        {/* Preconnect to Google Fonts CDN for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS prefetch for static assets on same origin */}
        <link rel="dns-prefetch" href="/" />
      </head>
      <body className="font-sans bg-void text-foreground min-h-screen antialiased overflow-x-hidden">
        {/* Noise overlay — GPU composited with will-change */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-20 mix-blend-overlay bg-noise"
          style={{ willChange: "auto" }}
        />
        {children}
      </body>
    </html>
  );
}
