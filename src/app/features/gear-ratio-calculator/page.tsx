import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gear Ratio Calculator for Cyclists | CrankSmith',
  description: 'Compare drivetrain setups, cadence, speed, and climbing potential with the CrankSmith Drivetrain Lab.',
};

export default function GearRatioCalculatorFeaturePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Gear Ratio Calculator</h1>
        <p className="text-stone-300 mb-8">Test chainring + cassette combinations and compare speed curves, cadence outcomes, and climbing limits before changing your drivetrain.</p>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-3">Use cases</h2>
          <ul className="list-disc pl-5 text-stone-300 space-y-1">
            <li>Road compact vs semi-compact comparison</li>
            <li>Gravel 1x vs 2x optimization</li>
            <li>Mullet drivetrain viability checks</li>
          </ul>
        </div>

        <Link href="/performance" className="inline-flex px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold">Open Drivetrain Lab</Link>
      </article>
    </div>
  );
}
