import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bike Weight Calculator & Upgrade Planner | CrankSmith',
  description: 'Estimate full-bike weight, evaluate gram-saving upgrades, and prioritize component changes by impact.',
};

export default function BikeWeightCalculatorFeaturePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CrankSmith Bike Weight Calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "description": "Estimate your bike's total weight and simulate upgrade savings across components.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "https://cranksmith.com/features/bike-weight-calculator"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bike Weight Calculator</h1>
        <p className="text-stone-300 mb-8">Import your current build, estimate total system weight, and simulate upgrade paths before spending money.</p>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-3">What you get</h2>
          <ul className="list-disc pl-5 text-stone-300 space-y-1">
            <li>Baseline build weight snapshot</li>
            <li>Upgrade simulation workflows</li>
            <li>Quick-win optimization recommendations</li>
          </ul>
        </div>

        <Link href="/weight" className="inline-flex px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold">Open Weight Tool</Link>
      </article>
    </div>
  );
}
