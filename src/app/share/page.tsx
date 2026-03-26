import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared Build | CrankSmith',
  description: 'Shared bike build preview from CrankSmith.',
  robots: {
    index: false,
    follow: true,
  },
};

interface SharedBuild {
  frameName?: string;
  totalWeight?: number;
  climbingScore?: number;
  speedRange?: { min?: number; max?: number };
  parts?: { type: string; name: string }[];
}

function decodeBuildPayload(raw: string | undefined): SharedBuild | null {
  if (!raw) return null;

  try {
    const json = Buffer.from(decodeURIComponent(raw), 'base64').toString('utf8');
    return JSON.parse(json) as SharedBuild;
  } catch {
    return null;
  }
}

export default async function SharePage({
  searchParams,
}: {
  searchParams: Promise<{ build?: string }>;
}) {
  const params = await searchParams;
  const build = decodeBuildPayload(params.build);

  return (
    <div className="min-h-screen bg-stone-950 text-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Shared Build</h1>
        <p className="text-stone-400 mb-10">Preview a shared CrankSmith build and launch the tools to configure your own version.</p>

        {!build ? (
          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10">
            <p className="text-red-300">This shared build link is invalid or expired.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h2 className="text-2xl font-bold mb-2">{build.frameName || 'Custom Build'}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-stone-500">Weight</span>
                  <p className="font-mono text-lg">{typeof build.totalWeight === 'number' ? `${(build.totalWeight / 1000).toFixed(2)} kg` : '--'}</p>
                </div>
                <div>
                  <span className="text-stone-500">Climbing Score</span>
                  <p className="font-mono text-lg">{typeof build.climbingScore === 'number' ? build.climbingScore.toFixed(0) : '--'}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
              <h3 className="font-semibold text-lg mb-4">Key Components</h3>
              <ul className="space-y-2 text-sm">
                {(build.parts || []).map((part) => (
                  <li key={`${part.type}-${part.name}`} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-stone-500 uppercase">{part.type}</span>
                    <span>{part.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/builder?new=true" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold">Open Builder</Link>
          <Link href="/showcase" className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/5">Browse Showcase Builds</Link>
        </div>
      </div>
    </div>
  );
}
