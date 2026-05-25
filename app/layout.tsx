import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MockFlow — Cinematic Mobile Mockup Videos",
  description:
    "Transform your app recordings into cinematic phone mockup videos automatically. Premium presentation, zero effort.",
  keywords:
    "mobile mockup, app video, phone mockup, cinematic mockup, app recording, video generator",
  openGraph: {
    title: "MockFlow — Cinematic Mobile Mockup Videos",
    description:
      "Transform your app recordings into cinematic phone mockup videos automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>{children}</body>
    </html>
  );
}
