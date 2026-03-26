import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bike Compatibility Checker | CrankSmith',
  description: 'Use CrankSmith to validate bike part compatibility across frame standards, drivetrain protocols, brakes, and wheel interfaces.',
};

export default function BikeCompatibilityCheckerFeaturePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bike Compatibility Checker</h1>
        <p className="text-stone-300 mb-8">CrankSmith checks drivetrain protocol matching, bottom bracket shell compatibility, axle standards, brake mount fit, and wheel/freehub alignment in one workflow.</p>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-3">What it validates</h2>
          <ul className="list-disc pl-5 text-stone-300 space-y-1">
            <li>Frame ⇄ Fork / Wheel / Tire interface fit</li>
            <li>BB shell ⇄ crank spindle compatibility</li>
            <li>Shifter ⇄ derailleur protocol and speed matching</li>
            <li>Brake fluid and mount safety checks</li>
          </ul>
        </div>

        <Link href="/builder?new=true" className="inline-flex px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold">Launch Compatibility Builder</Link>
      </article>
    </div>
  );
}
