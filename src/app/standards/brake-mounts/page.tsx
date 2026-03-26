import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brake Mount Standards Reference | CrankSmith',
  description: 'Reference for flat mount, post mount, and IS standards with compatibility context.',
};

export default function BrakeMountStandardsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Brake Mount Standards</h1>
        <p className="text-stone-300 mb-6">Review flat mount, post mount, and IS mounting conventions and the adapter implications for rotor sizing.</p>
      </article>
    </div>
  );
}
