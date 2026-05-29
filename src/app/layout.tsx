import type { Metadata } from "next";
import { Inter, Space_Grotesk, Space_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Interstellar — A Cinematic Web Experience",
  description: "An interactive, space-themed cinematic experience inspired by Christopher Nolan's Interstellar. Featuring a real-time raymarched black hole, the Endurance spacecraft, and time dilation.",
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
      <body className="font-sans bg-void text-foreground min-h-screen antialiased overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-50 opacity-20 mix-blend-overlay bg-noise" />
        {children}
      </body>
    </html>
  );
}
