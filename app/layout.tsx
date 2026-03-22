import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Punk Racing League",
  description: "The Punk Racing League is an online sim racing league on Nascar Racing 2003 Season",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head title="Punk Racing League"></head>
      <body>

        <NavBar />

        <main style={{ padding: "24px" }}>
          {children}
        </main>

      </body>
    </html>
  )
}
