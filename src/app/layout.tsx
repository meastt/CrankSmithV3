import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrankSmith Pro | Professional Bicycle Configurator",
  description: "Build your dream bike with CrankSmith Pro. The ultimate professional bicycle configurator for enthusiasts and mechanics.",
  keywords: ["bicycle", "configurator", "bike builder", "cycling", "mechanic", "custom bike"],
  authors: [{ name: "CrankSmith Team" }],
  openGraph: {
    title: "CrankSmith Pro",
    description: "Professional Bicycle Configurator",
    url: "https://cranksmith.pro",
    siteName: "CrankSmith Pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrankSmith Pro",
    description: "Professional Bicycle Configurator",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white flex flex-col min-h-screen`}
      >
        <Providers>
          <ServiceWorkerRegister />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
