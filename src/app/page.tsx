
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://cranksmith.com/#app",
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
    "sameAs": [
      "https://www.instagram.com/cranksmith",
      "https://twitter.com/cranksmith",
      "https://github.com/cranksmith"
    ],
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
      "@id": "https://cranksmith.com/#identity",
      "name": "CrankSmith Team",
      "url": "https://cranksmith.com",
      "sameAs": [
        "https://www.instagram.com/cranksmith",
        "https://twitter.com/cranksmith"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="min-h-screen bg-stone-950 relative">
        <DashboardGrid />
      </div>
    </>
  );
}
