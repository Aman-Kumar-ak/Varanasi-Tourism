import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import FloatingButtonGroup from "@/components/common/FloatingButtonGroup";
import BackButton from "@/components/common/BackButton";

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
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <main className="flex-grow">
            {children}
          </main>
          <BackButton />
          <Suspense fallback={null}>
            <FloatingButtonGroup />
          </Suspense>
          <ScrollToTopButton />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

