import Link from 'next/link';
import type { Metadata } from 'next';
import templates from '@/data/templates.json';

type Props = { params: Promise<{ slug: string }> };

function getTemplate(slug: string) {
  return templates.find((template) => template.id === slug);
}

export async function generateStaticParams() {
  return templates.map((template) => ({ slug: template.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) {
    return { title: 'Showcase Build | CrankSmith' };
  }

  return {
    title: `${template.name} Build Showcase | CrankSmith`,
    description: template.description,
  };
}

export default async function ShowcaseBuildPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) {
    return (
      <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Build not found</h1>
          <Link href="/showcase" className="text-cyan-400">Back to Showcase</Link>
        </div>
      </div>
    );
  }

  const partCount = Object.values(template.parts || {}).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-wider text-cyan-400 mb-2">{template.category}</p>
        <h1 className="text-4xl font-bold mb-4">{template.name}</h1>
        <p className="text-stone-300 mb-8">{template.description}</p>

        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
          <h2 className="text-xl font-semibold mb-3">Build Snapshot</h2>
          <p className="text-stone-400">This template includes {partCount} pre-selected components and is ready to open in the builder.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/garage" className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold">Open from Garage Templates</Link>
          <Link href="/builder?new=true" className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/5">Start Fresh Build</Link>
        </div>
      </article>
    </div>
  );
}
