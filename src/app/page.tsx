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
      <main className="min-h-screen bg-gray-950 relative">
        {/* Global Blueprint Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <Hero />
          <Features />
        </div>
      </main>
    </>
  );
}
