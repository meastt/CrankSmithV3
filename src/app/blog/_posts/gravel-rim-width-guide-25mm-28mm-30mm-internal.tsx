import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Rim Width Guide: 25mm vs 28mm vs 30mm Internal",
    description: "ETRTO compatibility charts, actual inflated widths by rim and tire combinations, hookless vs hooked considerations, and the optimal internal rim width for every major gravel tire size.",
    date: "2026-04-26",
    category: "Standards",
    keywords: ["gravel internal rim width", "best rim width 45mm tire", "gravel rim width guide 2026", "ETRTO gravel compatibility", "hookless rim width"],
    image: "/images/gravel-rim-width-internal-25mm-28mm-30mm-guide.webp",
    excerpt: "Internal rim width changes how your tire actually inflates — not just by width but by height and profile. Here are the actual numbers for every major combination."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What internal rim width is best for 45mm gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "For 45mm gravel tires, 23-28mm internal rim width is the recommended range. A 25mm internal rim is the sweet spot — it provides proper sidewall support for a 45mm tire without making the profile excessively wide. A 28mm internal rim will inflate the tire slightly wider and lower, increasing contact patch and volume." } },
        { "@type": "Question", "name": "Does internal rim width affect tire pressure?", "acceptedAnswer": { "@type": "Answer", "text": "Indirectly. Wider internal rims make tires inflate wider and lower (shorter tire height for the same tire width). This lower-profile shape means the tire can generally run slightly lower pressure while maintaining sidewall support. Some manufacturers recommend 1-2 PSI lower target pressure for tires mounted on rims at the wider end of their ETRTO range." } },
        { "@type": "Question", "name": "What is the maximum tire width for a 25mm internal rim?", "acceptedAnswer": { "@type": "Answer", "text": "Per ETRTO 2021 guidelines, a 25mm internal rim is compatible with tires from 42-62mm (622 BEAD, 700c). Practically, 25mm internal is ideal for 40-50mm tires. Going above 55mm on a 25mm internal rim is not recommended — sidewall support becomes inadequate and the tire may flex excessively under load." } },
        { "@type": "Question", "name": "Do hookless rims require different tire width limits?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Hookless (straight-wall) rims have more aggressive tire width requirements and stricter pressure limits. Most hookless gravel rims are rated for tires 40mm or wider and a maximum pressure of 72.5 PSI (5 bar). The wider minimum tire requirement exists because narrower tires at higher pressures can pop off a hookless bead under load. Always check your specific hookless rim manufacturer's tire compatibility list." } },
        { "@type": "Question", "name": "What is the difference between internal and external rim width?", "acceptedAnswer": { "@type": "Answer", "text": "Internal rim width is the measurement between the inner walls of the rim — this is what determines tire fit and inflation profile. External rim width is the overall width of the rim from outer wall to outer wall. External width affects aerodynamics and the rim's visual appearance. For tire compatibility, always reference internal rim width." } }
    ]
};

export default function PostRimWidthGuide({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 26, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Rim Width Guide: 25mm vs 28mm vs 30mm Internal</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Internal rim width changes how your tire actually inflates — in width, height, and sidewall support. Here are the real ETRTO numbers.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-rim-width-internal-25mm-28mm-30mm-guide.webp"
                        alt="Gravel wheel internal rim width cross-sections: 21mm, 25mm, 28mm, 30mm with ETRTO tire compatibility chart — CrankSmith rim guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">Hookless vs Hooked Gravel Wheels Safety Guide</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Your tire&apos;s listed width is a nominal measurement made on a reference rim. Mount that same tire on a rim 5mm wider and it will inflate wider and lower. On a rim 5mm narrower, it inflates taller and narrower. Understanding this relationship is essential for optimizing your gravel setup — especially as rim widths continue to grow.
                        </p>

                        <h2 className="text-white mt-12 mb-6">How Internal Width Changes Tire Profile</h2>
                        <p>Every tire has an ETRTO-specified reference rim width for its nominal measurement. Mounting on a different width shifts the profile. As a general rule:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Every <strong>+2mm of internal rim width</strong> adds approximately <strong>+0.5-1mm of inflated tire width</strong></li>
                            <li>Wider rims also make tires sit lower (shorter section height), increasing contact patch area</li>
                            <li>This lower, wider profile improves stability and cornering, but reduces ground clearance slightly</li>
                        </ul>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Actual Inflated Width: 45mm Tire Across Rim Widths</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Internal Width</th>
                                            <th className="text-left py-2 pr-4">Inflated Width</th>
                                            <th className="text-left py-2">Profile Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-4 font-medium">21mm</td><td className="py-2 pr-4">~43mm</td><td className="py-2 text-gray-400">Tall, narrow profile. On the narrow edge of compatibility.</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium text-cyan-300">25mm</td><td className="py-2 pr-4">~45mm</td><td className="py-2 text-gray-400">Reference. Optimal support and cornering for 45mm tire.</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium">28mm</td><td className="py-2 pr-4">~47-48mm</td><td className="py-2 text-gray-400">Wider contact patch, lower section height. Good grip.</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium">30mm</td><td className="py-2 pr-4">~49-50mm</td><td className="py-2 text-gray-400">Low profile. Check frame clearance before mounting.</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Values approximate. Actual width varies by tire brand and casing construction.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">ETRTO Compatibility Matrix</h2>
                        <p>The ETRTO (European Tyre and Rim Technical Organisation) publishes minimum and maximum rim width ranges for each tire size. For gravel:</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Tire Width</th>
                                            <th className="text-left py-2 pr-4">Min Internal</th>
                                            <th className="text-left py-2 pr-4">Recommended</th>
                                            <th className="text-left py-2">Max Internal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-4">38-40mm</td><td className="py-2 pr-4">19mm</td><td className="py-2 pr-4 text-cyan-400">21-25mm</td><td className="py-2">28mm</td></tr>
                                        <tr><td className="py-2 pr-4">42-45mm</td><td className="py-2 pr-4">21mm</td><td className="py-2 pr-4 text-cyan-400">25-28mm</td><td className="py-2">30mm</td></tr>
                                        <tr><td className="py-2 pr-4">47-50mm</td><td className="py-2 pr-4">23mm</td><td className="py-2 pr-4 text-cyan-400">25-30mm</td><td className="py-2">35mm</td></tr>
                                        <tr><td className="py-2 pr-4">55-57mm (2.25&quot;)</td><td className="py-2 pr-4">25mm</td><td className="py-2 pr-4 text-cyan-400">28-35mm</td><td className="py-2">40mm</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Hookless Rims: Stricter Rules</h2>
                        <p>Hookless (straight-wall) rims are increasingly common on gravel carbon wheelsets. The hookless bead shelf requires wider minimum tire widths and significantly lower pressure limits compared to traditional hooked rims. Key rules:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Most hookless gravel rims require <strong>40mm minimum</strong> tire width</li>
                            <li>Maximum pressure typically <strong>72.5 PSI (5 bar)</strong> — critical for tubeless setup</li>
                            <li>Some 30mm internal hookless rims may support lower tire widths — always check the rim manufacturer&apos;s specific compatibility list</li>
                            <li>Never mount a tire not on the hookless approved list for your specific rim</li>
                        </ul>
                        <p className="mt-4">For the complete hookless safety and compatibility analysis, see the <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">Hookless vs Hooked Gravel Wheels Safety Guide</Link>.</p>

                        <h2 className="text-white mt-12 mb-6">The Simple Recommendation</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { tire: "Running 40mm or smaller", rim: "21-25mm internal" },
                                { tire: "Running 42-47mm (most gravel riders)", rim: "25-28mm internal (25mm is the sweet spot)" },
                                { tire: "Running 48-55mm (big tire setup)", rim: "28-30mm internal" },
                                { tire: "Running 2.25\" / 57mm", rim: "30mm+ internal minimum" },
                            ].map(({ tire, rim }) => (
                                <div key={tire} className="flex gap-4 items-center bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-gray-300 text-sm flex-1">{tire}</span>
                                    <span className="text-cyan-400 font-bold text-sm whitespace-nowrap">{rim}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <BlogCTA heading="Check Rim Width for Your Tire" sub="Enter your rim and tire in CrankSmith to verify ETRTO compatibility and hookless pressure limits." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
