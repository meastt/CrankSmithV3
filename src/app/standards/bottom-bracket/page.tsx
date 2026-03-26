import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bottom Bracket Standards Reference | CrankSmith',
  description: 'Technical reference for BSA, T47, PF30, and BB86 bottom bracket standards.',
};

export default function BottomBracketStandardsPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Bottom Bracket Standards</h1>
        <p className="text-stone-300 mb-6">Use this reference to identify shell type and spindle interface requirements before selecting a crank and BB combo.</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/10"><tr><th className="p-3 text-left">Standard</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Typical Width</th></tr></thead>
            <tbody>
              <tr className="border-t border-white/10"><td className="p-3">BSA</td><td className="p-3">Threaded</td><td className="p-3">68/73mm</td></tr>
              <tr className="border-t border-white/10"><td className="p-3">T47</td><td className="p-3">Threaded</td><td className="p-3">68/86mm</td></tr>
              <tr className="border-t border-white/10"><td className="p-3">PF30</td><td className="p-3">Press-Fit</td><td className="p-3">68/73mm</td></tr>
              <tr className="border-t border-white/10"><td className="p-3">BB86</td><td className="p-3">Press-Fit</td><td className="p-3">86.5mm</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
