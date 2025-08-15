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
  title: "Navin Silk - Wholesale Dress Calculator",
  description: "Professional wholesale dress calculator for bulk orders. Calculate total pieces and pricing for Palazzo Suits, Lehengas, Anarkalis, and more.",
  keywords: "wholesale dress calculator, bulk orders, dress pricing, Navin Silk, palazzo suit, lehenga, anarkali",
  authors: [{ name: "Navin Silk" }],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "Navin Silk - Wholesale Dress Calculator",
    description: "Professional wholesale dress calculator for bulk orders",
    url: "https://your-domain.vercel.app",
    siteName: "Navin Silk",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Navin Silk Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navin Silk - Wholesale Dress Calculator",
    description: "Professional wholesale dress calculator for bulk orders",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}