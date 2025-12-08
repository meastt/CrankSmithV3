import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "CrankSmith | The Ultimate Bicycle Builder & Compatibility Tool",
  description: "Build your dream bike with confidence. Check part compatibility, calculate gear ratios, optimize tire pressure, and estimate weight. The precision tool for serious cyclists.",
  keywords: ["bike compatibility checker", "bicycle gear ratio calculator", "bike builder tool", "bike weight calculator", "drivetrain compatibility", "tire pressure calculator", "cycling tool", "bike part compatibility"],
  authors: [{ name: "CrankSmith Team" }],
  openGraph: {
    title: "CrankSmith | The Ultimate Bicycle Builder & Compatibility Tool",
    description: "Build your dream bike with confidence. Check part compatibility, calculate gear ratios, optimize tire pressure, and estimate weight.",
    url: "https://cranksmith.com",
    siteName: "CrankSmith",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrankSmith | The Ultimate Bicycle Builder & Compatibility Tool",
    description: "Build your dream bike with confidence. Check part compatibility, calculate gear ratios, and optimize tire pressure.",
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
    <html lang="en" suppressHydrationWarning className="dark" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased bg-[#030712] text-slate-100 flex flex-col min-h-screen`}
      >
        <Providers>
          <ServiceWorkerRegister />
          <OfflineIndicator />
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TR57T617HK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-TR57T617HK');
          `}
        </Script>
      </body>
    </html>
  );
}
