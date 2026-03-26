import Link from 'next/link';
import type { Metadata } from 'next';
import templates from '@/data/templates.json';

export const metadata: Metadata = {
  title: 'Bike Build Showcase | CrankSmith',
  description: 'Explore indexable example bike builds and launch each build in the CrankSmith builder.',
};

export default function ShowcaseIndexPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Build Showcase</h1>
        <p className="text-stone-400 mb-10">Indexable example builds for road, gravel, and MTB riders.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/showcase/${template.id}`}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400/40 transition-colors"
            >
              <p className="text-xs uppercase text-cyan-400 tracking-wider mb-2">{template.category}</p>
              <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
              <p className="text-sm text-stone-400">{template.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
