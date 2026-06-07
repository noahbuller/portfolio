import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://whoisnoahbuller.com"),
  title: "Noah Buller — Software Engineer",
  description:
    "Portfolio of Noah Buller, software engineer. Take a drive through the city.",
  openGraph: {
    title: "Noah Buller — Software Engineer",
    description:
      "Portfolio of Noah Buller, software engineer. Take a drive through the city.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noah Buller — Software Engineer",
    description:
      "Portfolio of Noah Buller, software engineer. Take a drive through the city.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
