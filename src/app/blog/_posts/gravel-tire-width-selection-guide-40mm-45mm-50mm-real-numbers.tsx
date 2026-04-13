import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Tire Width Guide: 40mm vs 45mm vs 50mm vs 2.25\" — Real Numbers",
    description: "Rolling resistance data, weight penalties per mm, grip comparisons, and gear inch tables for every major gravel tire width. Actual numbers, not marketing copy.",
    date: "2026-04-19",
    category: "Big Tires",
    keywords: ["gravel tire size comparison", "what width gravel tires should I run", "40mm vs 45mm gravel tire", "50mm gravel tire rolling resistance", "gravel tire selection guide 2026"],
    image: "/images/gravel-tire-width-selection-40-45-50-comparison-2026.webp",
    excerpt: "Rolling resistance, grip, weight, and effective gearing — all four metrics compared across every major gravel tire width."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What width gravel tire should I run?", "acceptedAnswer": { "@type": "Answer", "text": "For most gravel riders in 2026, 45mm is the best all-around choice. It rolls fast on rough surfaces (verified by independent testing), offers good grip, and is widely supported by modern frames. Only go narrower (40mm) if your rides are primarily pavement. Go wider (50mm+) if you ride technical terrain or bikepacking where traction and comfort outweigh slight weight penalty." } },
        { "@type": "Question", "name": "Do wider gravel tires actually roll faster?", "acceptedAnswer": { "@type": "Answer", "text": "On rough gravel, yes. Independent testing shows that wider tires at lower pressures have lower total system rolling resistance on anything rougher than smooth tarmac. The energy saved from reduced suspension losses (body not bouncing) exceeds the marginal increase in tire deformation. A 45mm tire at 28 PSI consistently outperforms a 35mm tire at 55 PSI on gravel." } },
        { "@type": "Question", "name": "How much heavier are wider gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "Roughly 30-60g per 5mm of additional width, depending on casing construction. Going from a 40mm to 45mm tire adds about 40-50g per tire (80-100g for the pair). From 45mm to 50mm adds another 40-60g. For most riders, the traction and comfort gains of wider tires far outweigh the weight penalty on actual gravel terrain." } },
        { "@type": "Question", "name": "How does tire width affect gear ratios?", "acceptedAnswer": { "@type": "Answer", "text": "Each 5mm of additional tire width adds roughly 1.5-2% to the tire's circumference, making your gearing effectively taller by that percentage. Going from 40mm to 50mm tires (25mm difference in circumference change) is approximately a 3-4% taller effective gear. This is significant enough to consider when selecting cassette range — wider tires need a lower gear to maintain the same climbing feel." } },
        { "@type": "Question", "name": "Is a 50mm gravel tire too wide for road riding?", "acceptedAnswer": { "@type": "Answer", "text": "50mm tires feel noticeably different on pavement — slower to accelerate, slightly more steering effort, and more pronounced rolling resistance on smooth surfaces. For mixed-terrain riders doing significant pavement miles, 45mm is a better compromise. Pure gravel riders who rarely touch tarmac will appreciate the 50mm's grip and comfort advantages." } }
    ]
};

export default function PostTireWidthSelectionGuide({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Big Tires • April 19, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Tire Width Guide: 40mm vs 45mm vs 50mm vs 2.25&rdquo; — Real Numbers</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Rolling resistance, grip, weight penalty per mm, and gear inch tables. Four metrics across every major gravel tire width.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-tire-width-selection-40-45-50-comparison-2026.webp"
                        alt="Gravel tire width comparison chart showing 40mm, 45mm, 50mm, and 2.25-inch cross-sections with rolling resistance curves and weight data — CrankSmith tire guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/45mm-is-the-new-minimum-gravel-tire" className="text-cyan-400 hover:underline">45mm Is the New Minimum Gravel Tire</Link> • <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI Tire Pressure Calculator</a></em></p>

                        <p className="lead text-xl text-stone-200">
                            &ldquo;What tire width should I run?&rdquo; is the question every gravel cyclist asks eventually. The honest answer depends on your terrain, your frame clearance, and your priorities — but instead of vague guidance, here are the actual numbers across four key metrics: rolling resistance, weight, grip, and effective gearing.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Rolling Resistance: What the Data Shows</h2>
                        <p>The counterintuitive truth — confirmed repeatedly by independent testing at <a href="https://www.bicyclerollingresistance.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">bicyclerollingresistance.com</a> and internal testing by tire brands — is that <strong>wider tires often roll faster on rough surfaces</strong>. Why? Two reasons:</p>

                        <ol className="list-decimal pl-5 space-y-2 mt-4">
                            <li><strong>Lower operating pressure:</strong> A 45mm tire at 28 PSI has a larger contact patch and deforms around obstacles instead of bouncing off them. That deflection absorbs energy that would otherwise travel into your body (as vibration) and back into the road as noise.</li>
                            <li><strong>Reduced suspension losses:</strong> Your body is heavy. Every vibration that travels from the road through the tire into you and back costs energy. Wider tires reduce this systemic loss significantly on rough terrain.</li>
                        </ol>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Rolling Resistance Summary by Surface</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Width</th>
                                            <th className="text-left py-2 pr-4">Smooth Tarmac</th>
                                            <th className="text-left py-2 pr-4">Packed Gravel</th>
                                            <th className="text-left py-2">Rough/Loose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">40mm</td>
                                            <td className="py-2 pr-4 text-green-400">Fastest</td>
                                            <td className="py-2 pr-4 text-amber-400">Mid</td>
                                            <td className="py-2 text-red-400">Slowest</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">45mm</td>
                                            <td className="py-2 pr-4 text-amber-400">Very good</td>
                                            <td className="py-2 pr-4 text-green-400">Fastest</td>
                                            <td className="py-2 text-green-400">Fast</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">50mm</td>
                                            <td className="py-2 pr-4 text-amber-400">Good</td>
                                            <td className="py-2 pr-4 text-green-400">Very fast</td>
                                            <td className="py-2 text-green-400">Fastest</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">2.25&quot; (57mm)</td>
                                            <td className="py-2 pr-4 text-red-400">Slowest</td>
                                            <td className="py-2 pr-4 text-amber-400">Good</td>
                                            <td className="py-2 text-green-400">Fastest</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Rankings are relative within category and assume appropriate PSI for each width.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Weight Penalty Per Width</h2>
                        <p>Wider tires are heavier — that&apos;s unavoidable. But the penalty is often overstated. Here&apos;s the actual range for quality gravel tires (tubeless-ready, single compound):</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="space-y-3">
                                {[
                                    { width: "38-40mm", range: "280–360g", note: "Road-to-gravel crossover. Maxxis Receptor, Panaracer GravelKing" },
                                    { width: "42-45mm", range: "350–430g", note: "Most popular. Teravail Cannonball, WTB Riddler, Vittoria Terreno Mix" },
                                    { width: "47-50mm", range: "400–490g", note: "Performance big-tire. Maxxis Rambler, Schwalbe G-One Ultrabite" },
                                    { width: "55-57mm (2.25\")", range: "500–620g", note: "Adventure/bikepacking. Teravail Cannonball 2.25, Maxxis CrossMark II" },
                                ].map(({ width, range, note }) => (
                                    <div key={width} className="flex gap-4 items-start">
                                        <span className="text-cyan-400 font-mono font-bold w-24 shrink-0">{width}</span>
                                        <span className="text-white font-bold w-24 shrink-0">{range}</span>
                                        <span className="text-gray-400 text-sm">{note}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Weight stated per tire. Pair weight = approx. 2×.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Grip: Where Width Actually Matters</h2>
                        <p>Wider tires provide more grip in two ways: <strong>larger contact patch</strong> and <strong>lower operating pressure</strong>. Lower PSI means the tread conforms to surface irregularities. This matters most in:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Loose over hard (sand over hardpack, gravel over clay)</li>
                            <li>Wet roots and rocks</li>
                            <li>Off-camber sections where side-knob engagement matters</li>
                            <li>Deep mud (though tread pattern matters more than width here)</li>
                        </ul>
                        <p className="mt-4">On dry hardpack and compact gravel, grip differences between 40mm and 50mm are negligible. The gains are surface-specific, not universal.</p>

                        <h2 className="text-white mt-12 mb-6">Effective Gearing Changes</h2>
                        <p>Every 5mm of additional tire width adds roughly 1.5-2% to circumference. This makes your effective gearing proportionally taller. Here&apos;s how that plays out for a common 34t chainring setup:</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">34t Chainring — Effective Gear Inches by Tire Width</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Tire Width</th>
                                            <th className="text-left py-2 pr-4">Easiest (×46t)</th>
                                            <th className="text-left py-2 pr-4">Hardest (×11t)</th>
                                            <th className="text-left py-2">Change vs 40mm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-4">40mm</td><td className="py-2 pr-4">19.3 gi</td><td className="py-2 pr-4">80.8 gi</td><td className="py-2 text-gray-500">baseline</td></tr>
                                        <tr><td className="py-2 pr-4">45mm</td><td className="py-2 pr-4">19.8 gi</td><td className="py-2 pr-4">82.8 gi</td><td className="py-2 text-amber-400">+2.5%</td></tr>
                                        <tr><td className="py-2 pr-4">50mm</td><td className="py-2 pr-4">20.3 gi</td><td className="py-2 pr-4">84.9 gi</td><td className="py-2 text-amber-400">+5.1%</td></tr>
                                        <tr><td className="py-2 pr-4">2.25&quot; (57mm)</td><td className="py-2 pr-4">21.1 gi</td><td className="py-2 pr-4">88.3 gi</td><td className="py-2 text-red-400">+9.2%</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">If going from 40mm to 50mm feels like climbing got harder, it has — by about 5%. A 32t chainring restores parity.</p>
                        </div>

                        <p>For most riders switching from 40mm to 45mm, the gear change is small enough to ignore. Going to 50mm or 2.25&quot; tires warrants reconsidering your chainring size. Use <Link href="/builder" className="text-cyan-400 hover:underline">CrankSmith&apos;s drivetrain calculator</Link> to run your exact numbers. For optimal PSI for each tire width and your rider weight, see the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI Tire Pressure Calculator</a>.</p>

                        <h2 className="text-white mt-12 mb-6">The Simple Decision Framework</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { label: "Mostly pavement with occasional gravel", rec: "40-42mm" },
                                { label: "Mixed gravel: rides with pavement connections", rec: "45mm (best all-around)" },
                                { label: "Technical gravel, bikepacking, rough stuff", rec: "48-50mm" },
                                { label: "Multi-surface adventure / light singletrack", rec: "2.25\" if your frame clears it" },
                            ].map(({ label, rec }) => (
                                <div key={label} className="flex gap-4 items-center bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-gray-300 text-sm flex-1">{label}</span>
                                    <span className="text-cyan-400 font-bold text-sm whitespace-nowrap">{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <BlogCTA heading="Simulate Your Actual Gearing" sub="Enter your chainring, cassette, and tire width to see your exact gear range and effective gear inches." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
