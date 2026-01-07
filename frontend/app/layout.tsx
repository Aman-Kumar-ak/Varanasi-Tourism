import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import FloatingButtonGroup from "@/components/common/FloatingButtonGroup";
import BackButton from "@/components/common/BackButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Varanasi Tourism Guide",
  description: "Complete guide to Varanasi - Spiritual significance, places to visit, transportation, hotels, restaurants, and more",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Providers>
          <main className="flex-grow">
            {children}
          </main>
          <BackButton />
          <FloatingButtonGroup />
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

