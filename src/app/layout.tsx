import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrankSmith | Professional Bicycle Compatibility & Builder Tool",
  description: "Professional bike compatibility checker and builder tool. Validate part compatibility, calculate gear ratios, and engineer your dream build with precision. Free compatibility checker for road, gravel, and MTB.",
  keywords: ["bike compatibility checker", "bicycle gear ratio calculator", "bike builder tool", "bike weight calculator", "drivetrain compatibility", "bottom bracket compatibility", "mullet drivetrain", "cycling tool", "bike part compatibility"],
  authors: [{ name: "CrankSmith Team" }],
  openGraph: {
    title: "CrankSmith | Professional Bicycle Compatibility & Builder Tool",
    description: "Professional bike compatibility checker and builder tool. Validate part compatibility, calculate gear ratios, and engineer your dream build.",
    url: "https://cranksmith.com",
    siteName: "CrankSmith",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrankSmith | Bike Compatibility & Builder Tool",
    description: "Professional bike compatibility checker. Validate parts, calculate gear ratios, and build with confidence.",
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
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
