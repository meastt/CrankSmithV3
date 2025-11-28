import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CrankSmith",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "description": "Professional bicycle compatibility checker and builder tool for performance cyclists. Validates part compatibility, calculates gear ratios, weight, and performance metrics for road, gravel, and MTB builds.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "Bicycle part compatibility validation",
      "Real-time gear ratio calculations",
      "Weight tracking and optimization",
      "Drivetrain compatibility checker",
      "Bottom bracket compatibility",
      "Axle standard validation",
      "Mullet drivetrain support"
    ],
    "screenshot": "https://cranksmith.com/icon-512.png",
    "url": "https://cranksmith.com",
    "author": {
      "@type": "Organization",
      "name": "CrankSmith Team"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen bg-stone-950 relative noise-overlay">
        <Hero />
        <Features />
      </main>
    </>
  );
}
