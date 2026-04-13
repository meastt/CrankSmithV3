import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Drivetrain Wear: When Your Chain, Cassette and Chainring Actually Need Replacing",
    description: "Chain stretch percentages, gravel-specific wear factors, 1x vs 2x wear patterns, and the actual intervals that make sense for gravel riding — not road cycling assumptions.",
    date: "2026-04-30",
    category: "Drivetrain",
    keywords: ["gravel drivetrain wear", "when to replace gravel bike chain", "chain stretch 0.5 vs 0.75", "gravel cassette replacement", "drivetrain maintenance gravel"],
    image: "/images/gravel-drivetrain-wear-chain-cassette-replacement.webp",
    excerpt: "0.5% stretch means replace the chain. Hit 0.75% and you're likely replacing the cassette too. Here's what this looks like in real gravel miles."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "How often should you replace a gravel bike chain?", "acceptedAnswer": { "@type": "Answer", "text": "For gravel riding, replace your chain when it reads 0.5% stretch on a chain checker (Park Tool CC-4 or equivalent). In terms of mileage, this typically corresponds to 1,500-2,500 miles on gravel depending on conditions. Dusty or muddy riding dramatically accelerates wear — some gravel riders see 0.5% at under 1,000 miles in wet, gritty conditions. Check chain wear every 300-500 miles." } },
        { "@type": "Question", "name": "What's the difference between 0.5% and 0.75% chain wear?", "acceptedAnswer": { "@type": "Answer", "text": "At 0.5% elongation, chain wear is developing but the cassette and chainring are typically still good — replace the chain and maintain your cassette and chainring. At 0.75%, the chain wear pattern has usually been transferred to the cassette and chainring teeth. Replacing only the chain at this point will cause the new chain to skip on the worn cogs. You'll need to replace chain, cassette, and often the chainring as a set." } },
        { "@type": "Question", "name": "Does 1x cause faster chainring wear on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. On a 1x drivetrain, the chain always runs on the same chainring — there's no front shift to distribute wear. This concentrates wear on fewer chainring teeth compared to a 2x system where front shifting spreads wear across two rings. Narrow-Wide tooth profile helps retention but doesn't reduce wear rate. Expect to replace your 1x chainring every 2-3 chain replacements, or when tooth profile shows visible sharpening." } },
        { "@type": "Question", "name": "What accelerates gravel drivetrain wear?", "acceptedAnswer": { "@type": "Answer", "text": "The major gravel-specific wear accelerators are: (1) Dry dust and grit — fine particles embed in the chain rollers and act as sandpaper on cassette teeth; (2) Mud — wet clay packs into the chain and causes rapid stretch; (3) Cross-chaining on 1x — running the chain at extreme angles creates additional lateral wear; (4) Running under-lubricated — dry chains wear significantly faster. Wet lube in muddy conditions, dry/wax lube in dusty conditions." } },
        { "@type": "Question", "name": "Does chain waxing extend gravel drivetrain life?", "acceptedAnswer": { "@type": "Answer", "text": "In dry, dusty conditions, yes significantly. Waxed chains attract far less grit than wet-lubed chains, which dramatically reduces abrasive wear. The tradeoff: wax is less durable in wet or muddy conditions and requires more frequent re-application. For dry gravel events (Kansas, Oklahoma) waxed chains are increasingly standard in the race field. For mixed conditions, a quality wet lube or chain wax hybrid is more practical." } }
    ]
};

export default function PostDrivetrainWear({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 30, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Drivetrain Wear: When Your Chain, Cassette &amp; Chainring Actually Need Replacing</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">0.5% stretch means replace the chain. Hit 0.75% and you&apos;re probably replacing the cassette too. Here&apos;s what this looks like in real gravel miles.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-drivetrain-wear-chain-cassette-replacement.webp"
                        alt="Worn gravel bike chain measured with Park Tool CC-4 chain checker showing 0.75% stretch alongside worn cassette cog — CrankSmith drivetrain maintenance guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/the-gravel-mullet-road-shifter-mtb-derailleur" className="text-cyan-400 hover:underline">The Gravel Mullet Drivetrain Guide</Link> • <Link href="/blog/1x-vs-2x-gravel-2026-numbers" className="text-cyan-400 hover:underline">1x vs 2x on Gravel</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Gravel is harder on drivetrains than road. Dust, mud, and grit act as abrasives between every moving surface. Most drivetrain maintenance intervals are designed for road riding — and they&apos;re dangerously optimistic for gravel. Here&apos;s what the actual numbers look like.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Understanding Chain Wear Percentages</h2>
                        <p>Chain wear is measured as elongation — how much longer the chain has become relative to a new chain. A 12-inch (30.48cm) pitch spans exactly 12 links when new. As the pins and rollers wear, the pitch increases. A chain checker like the <a href="https://www.parktool.com/product/chain-checker-plus-cc-4" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Park Tool CC-4</a> measures this elongation on a 0% (new), 0.5%, and 0.75% scale.</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Chain Wear Action Guide</h3>
                            <div className="space-y-3">
                                {[
                                    { level: "0% – 0.5%", label: "Good", action: "Chain is fine. Clean and lube, continue riding.", color: "text-green-400", bg: "border-green-500/20" },
                                    { level: "0.5%", label: "Replace Chain", action: "Replace chain now. Cassette and chainring likely still good if you haven't been lazy.", color: "text-amber-400", bg: "border-amber-500/20" },
                                    { level: "0.75%", label: "Replace Chain + Cassette", action: "Chain wear has transferred to cassette. New chain will skip. Replace both (and inspect chainring).", color: "text-red-400", bg: "border-red-500/20" },
                                    { level: "1.0%+", label: "Full Drivetrain", action: "Chain, cassette, and chainring all need replacement. Expensive lesson.", color: "text-red-600", bg: "border-red-700/20" },
                                ].map(({ level, label, action, color, bg }) => (
                                    <div key={level} className={`flex gap-4 p-4 rounded-lg border bg-white/3 ${bg}`}>
                                        <div className="w-20 shrink-0">
                                            <p className={`font-mono font-bold ${color}`}>{level}</p>
                                            <p className={`text-xs font-bold ${color}`}>{label}</p>
                                        </div>
                                        <p className="text-gray-300 text-sm">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Real Gravel Miles: How Fast Does This Happen?</h2>
                        <p>Chain wear rate varies enormously by conditions. A rough guide for gravel-specific riding:</p>

                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Conditions</th>
                                        <th className="text-left p-3">Miles to 0.5%</th>
                                        <th className="text-left p-3">Miles to 0.75%</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Dry, dusty gravel (dry western US)", "800–1,500mi", "1,200–2,000mi"],
                                        ["Mixed conditions (Midwest, spring)", "1,200–2,000mi", "1,800–2,800mi"],
                                        ["Road-like packed gravel (asphalt base)", "2,000–3,000mi", "3,000–4,000mi"],
                                        ["Muddy/wet (PNW, winter UK)", "500–900mi", "800–1,300mi"],
                                        ["Wax-lubed chain (dry conditions)", "2,000–3,500mi", "3,000–5,000mi"],
                                    ].map(([cond, m05, m075]) => (
                                        <tr key={cond} className="hover:bg-white/5">
                                            <td className="p-3 text-gray-300">{cond}</td>
                                            <td className="p-3 text-amber-400 font-medium">{m05}</td>
                                            <td className="p-3 text-red-400 font-medium">{m075}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-2">Highly variable by rider weight, chainring-to-cassette ratio alignment, and lube quality. Check chain wear every 300-500 miles.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">1x vs 2x Wear Patterns</h2>
                        <p>On a <strong>1x drivetrain</strong>, the chain always runs on the same 34-42t ring. There&apos;s no front shifting to distribute wear. Chainring teeth show visible sharpening (shark-fin profile) faster than on 2x. Replace your 1x chainring every 2-3 chain replacements, or when teeth visibly taper.</p>
                        <p className="mt-4">On a <strong>2x drivetrain</strong>, wear is distributed across two rings but the chain is also longer (more links = more potential wear points). The front derailleur creates additional friction. In practice, 2x and 1x cassettes wear at similar rates on gravel.</p>

                        <h2 className="text-white mt-12 mb-6">The Lube Matters More Than You Think</h2>
                        <p>The right lube for your conditions extends chain life 2-3×:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Dry/dusty gravel:</strong> Chain wax (Squirt, Silca Super Secret) — doesn&apos;t attract grit, longest chain life in dry conditions</li>
                            <li><strong>Mixed/wet:</strong> Quality wet lube (Finish Line Wet, Muc-Off C3) — more durable than wax when conditions are unpredictable</li>
                            <li><strong>Mud/heavy rain:</strong> Heavy wet lube or ceramic-based lube — prioritize retention over cleanliness</li>
                        </ul>
                        <p className="mt-4">Avoid generic hardware store oils and spray lubricants on gravel — they wash out quickly and attract grit aggressively.</p>
                    </div>

                    <BlogCTA heading="Track Your Build Components" sub="Log your drivetrain components in CrankSmith to track mileage and get replacement reminders." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
