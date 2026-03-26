import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bike Standards Hub | CrankSmith',
  description: 'Reference hub for bottom bracket, axle, freehub, and brake mount standards used in CrankSmith compatibility checks.',
};

const hubs = [
  { href: '/standards/bottom-bracket', name: 'Bottom Bracket Standards' },
  { href: '/standards/axles', name: 'Axle Standards' },
  { href: '/standards/freehub', name: 'Freehub Standards' },
  { href: '/standards/brake-mounts', name: 'Brake Mount Standards' },
];

export default function StandardsHubPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Standards Knowledge Hub</h1>
        <p className="text-stone-400 mb-10">Canonical technical references that explain the standards powering CrankSmith compatibility logic.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {hubs.map((hub) => (
            <Link key={hub.href} href={hub.href} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500/40 transition-colors">
              <h2 className="text-xl font-semibold">{hub.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
