import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Freehub Standards Reference | CrankSmith',
  description: 'Reference for HG, XD, XDR, Microspline, and N3W cassette interface standards.',
};

export default function FreehubStandardsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Freehub Standards</h1>
        <p className="text-stone-300 mb-6">Use this guide to match cassette mount interfaces with wheel freehub bodies and avoid expensive compatibility mistakes.</p>
      </article>
    </div>
  );
}
