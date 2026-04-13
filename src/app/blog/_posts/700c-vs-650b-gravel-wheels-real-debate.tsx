import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "700c vs 650b Gravel Wheels: The Real Debate",
    description: "700c rolls faster. 650b fits wider tires at the same clearance. Here's when each makes sense in 2026, and what flip-chip gravel frames actually change.",
    date: "2026-05-04",
    category: "Standards",
    keywords: ["700c vs 650b gravel", "650b gravel wheel benefits", "which wheel size gravel bike", "flip chip 700c 650b", "650b gravel tire clearance"],
    image: "/images/gravel-rim-width-internal-25mm-28mm-30mm-guide.webp",
    excerpt: "700c for speed. 650b for width. The choice is more nuanced than that — here's when each wheel size actually makes sense."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Should I run 700c or 650b on my gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "700c for most gravel riding. At equivalent tire widths (40-50mm), 700c rolls faster and has a larger tire selection. 650b makes sense when: your frame has limited tire clearance and you want to run 50mm+ tires (650b x 2.1\" fits in a frame that clears 40mm 700c), you're on a smaller frame where 700c proportions feel wrong, or you want the lower center of gravity of 650b for very technical terrain." } },
        { "@type": "Question", "name": "What is the equivalent 650b tire width to a 700c tire?", "acceptedAnswer": { "@type": "Answer", "text": "A 650b x 2.1\" tire (53mm wide) has roughly the same outer diameter as a 700c x 38mm tire. A 650b x 2.25\" tire is equivalent in diameter to approximately a 700c x 50mm tire. The 650b wheel's smaller rim compensates for the wider tire — the result is a similar overall wheel diameter with a fatter tire profile. This is why frames with limited 700c clearance can often accept much wider 650b tires." } },
        { "@type": "Question", "name": "Is 700c or 650b faster on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "At the same tire width, 700c is faster. The larger wheel rolls over obstacles more easily and maintains momentum better. But the comparison only makes sense at the same tire width — and 650b's advantage is fitting wider tires in the same frame. A 650b x 2.1\" tire may be slower than a 700c x 50mm on smooth gravel, but faster than a 700c x 38mm on rough terrain because of the volume and pressure difference." } },
        { "@type": "Question", "name": "What does a flip chip do for 700c vs 650b?", "acceptedAnswer": { "@type": "Answer", "text": "Flip-chip frames that support both 700c and 650b use the geometry adjustment to compensate for the different wheel diameters. 650b wheels are approximately 27mm smaller in diameter than 700c, which would otherwise lower the bottom bracket by ~13mm and change the geometry. The flip chip raises the BB and adjusts head tube angle to maintain consistent geometry between wheel sizes." } },
        { "@type": "Question", "name": "Can I switch between 700c and 650b on my gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Only on frames specifically designed for dual wheel sizes — typically with flip-chip dropouts (Salsa Warbird, Canyon Grail, some Specialized Diverge models). Standard gravel frames are designed for one wheel size. Physically you can often mount 650b wheels in a 700c frame (the tire clears because it's smaller), but the geometry will be off — the bike will handle differently than designed." } }
    ]
};

export default function Post700cVs650b({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • May 4, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">700c vs 650b Gravel Wheels: The Real Debate</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">700c rolls faster. 650b fits more tire. The real question is when wider matters more than faster.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-rim-width-internal-25mm-28mm-30mm-guide.webp"
                        alt="Gravel wheel cross-section comparison showing tire profile differences at different rim and tire widths — CrankSmith 700c vs 650b guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            The 700c vs 650b debate isn&apos;t about which is objectively better — it&apos;s about which is better for your frame, your terrain, and your tire preferences. Here&apos;s the framework to make the decision clearly.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Physics Summary</h2>
                        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-cyan-500/20">
                                <h3 className="text-cyan-400 font-bold mb-3">700c (622mm BEAD)</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Larger diameter rolls over obstacles more easily</li>
                                    <li>Faster at equal tire widths</li>
                                    <li>Far more tire selection (40-57mm)</li>
                                    <li>Better suited to open, fast gravel</li>
                                    <li>Standard for most riders</li>
                                    <li>Typical clearance: 40-55mm for modern frames</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">650b (584mm BEAD)</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Smaller diameter, fits wider tires in same clearance</li>
                                    <li>Lower center of gravity — better handling on tech terrain</li>
                                    <li>Limited tire selection vs 700c</li>
                                    <li>Better on small frames where 700c looks proportionally wrong</li>
                                    <li>Pairs with 2.0-2.25&quot; tires for massive volume</li>
                                    <li>Some frames support both via flip chips</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Clearance Advantage: The Key 650b Use Case</h2>
                        <p>This is where 650b makes its clearest argument. A frame that clears 700c×40mm will typically clear 650b×2.1&quot; (53mm actual width). Why? The 650b rim is 38mm smaller in diameter — so even though the tire is wider, the overall outer diameter is similar, meaning the frame&apos;s chainstay bridge and fork crown have the same clearance. You get a dramatically wider tire in the same frame.</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Equivalent Outer Diameters</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-6">700c Tire</th>
                                            <th className="text-left py-2">Equivalent 650b</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-6">700c × 32mm</td><td className="py-2">650b × 1.75&quot; (47mm)</td></tr>
                                        <tr><td className="py-2 pr-6">700c × 38mm</td><td className="py-2">650b × 2.0&quot; (51mm)</td></tr>
                                        <tr><td className="py-2 pr-6">700c × 45mm</td><td className="py-2">650b × 2.1&quot; (53mm)</td></tr>
                                        <tr><td className="py-2 pr-6">700c × 50mm</td><td className="py-2">650b × 2.2&quot; (56mm)</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Approximate. Actual outer diameter depends on inflation pressure and casing construction.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">When to Choose Each</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { scenario: "General gravel road riding", pick: "700c × 42-50mm — fastest, most tire options" },
                                { scenario: "Bikepacking on mixed terrain", pick: "650b × 2.1-2.25\" if frame supports it — maximum volume" },
                                { scenario: "Frame limited to 40mm 700c clearance", pick: "650b × 2.0\" — get 51mm tire in the same frame" },
                                { scenario: "Small frame (50cm or under)", pick: "650b — better proportions, longer chainstay relative to frame" },
                                { scenario: "Racing fast gravel events", pick: "700c — always faster at equivalent width" },
                            ].map(({ scenario, pick }) => (
                                <div key={scenario} className="flex gap-4 items-center bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-gray-300 text-sm flex-1">{scenario}</span>
                                    <span className="text-cyan-400 font-bold text-sm whitespace-nowrap text-right">{pick}</span>
                                </div>
                            ))}
                        </div>

                        <p>Before switching wheel sizes, validate that your frame genuinely supports the tire width you want. Use <Link href="/builder" className="text-cyan-400 hover:underline">CrankSmith</Link> to enter your frame model, current wheel size, and target tire — and confirm clearance before buying new wheels.</p>
                    </div>

                    <BlogCTA heading="Validate Your Wheel Size Choice" sub="Enter your frame and target tire in CrankSmith to confirm 700c or 650b clearance for your setup." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
