import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Axle Standards Reference | CrankSmith',
  description: 'Reference chart for common road, gravel, and MTB axle standards used in compatibility checks.',
};

export default function AxleStandardsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Axle Standards</h1>
        <p className="text-stone-300 mb-6">Frame and wheel axle mismatches are one of the most common build blockers. Validate front and rear standards before checkout.</p>
      </article>
    </div>
  );
}
