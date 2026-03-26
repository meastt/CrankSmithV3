import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CrankSmith Features | Compatibility, Gearing, and Weight Tools',
  description: 'Explore CrankSmith feature landing pages for bike compatibility checking, drivetrain analysis, and weight optimization.',
};

const featurePages = [
  { href: '/features/bike-compatibility-checker', title: 'Bike Compatibility Checker', description: 'Validate frame, drivetrain, brake, and wheel compatibility before you buy parts.' },
  { href: '/features/gear-ratio-calculator', title: 'Gear Ratio Calculator', description: 'Compare chainring and cassette setups for speed and climbing outcomes.' },
  { href: '/features/bike-weight-calculator', title: 'Bike Weight Calculator', description: 'Estimate bike weight and simulate upgrade savings.' },
];

export default function FeaturesIndexPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Feature Landing Pages</h1>
        <p className="text-stone-400 mb-10">Browse high-intent feature pages designed for search, AI retrieval, and conversion.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {featurePages.map((feature) => (
            <Link key={feature.href} href={feature.href} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500/40 transition-colors">
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-sm text-stone-400">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
