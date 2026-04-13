import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Aero Gains on Gravel: Deep Section Wheels vs Narrow Tires — Real Watts",
    description: "Actual watt savings from aero gravel wheels on real gravel terrain, how surface roughness changes the calculation, and why position matters more than any component.",
    date: "2026-04-27",
    category: "Standards",
    keywords: ["gravel bike aerodynamics", "aero wheels gravel", "deep section wheels gravel", "watts saved gravel aero", "aero upgrade gravel bike"],
    image: "/images/gravel-aero-wheels-deep-section-vs-narrow-tires.webp",
    excerpt: "Wind tunnel data was built for smooth roads. Here's what actually happens to aero gains when the surface turns to gravel."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Do aero wheels make a difference on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, but the gains are significantly reduced compared to smooth road. On gravel, aerodynamic drag is reduced by rough surfaces increasing rolling resistance, variable headwind from terrain (trees, hills), and lower average speeds. A wheelset saving 12 watts at 40 km/h on tarmac might save 6-8 watts on a fast gravel race course, and 2-4 watts on technical, slow gravel. Position improvements (lower bars, aero helmet) typically save 20-30+ watts — far more than wheels." } },
        { "@type": "Question", "name": "What is the most aero upgrade on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Position is by far the most impactful aero upgrade — specifically, lowering your torso angle (lower bar height relative to saddle) and tucking your elbows. An aggressive position saves 20-40 watts compared to an upright position at gravel race speeds. After position: aero helmet (10-20W), skinsuit vs jersey (5-15W), aero wheelset (3-12W depending on conditions), tire selection (3-8W)." } },
        { "@type": "Question", "name": "What depth aero wheel is best for gravel?", "acceptedAnswer": { "@type": "Answer", "text": "For gravel, 35-45mm rim depth is the practical optimum. Deeper rims (50mm+) save more watts but become unrideable in crosswinds on exposed gravel terrain and add rotational weight that hurts on punchy climbs. Lighter rims under 30mm depth are purely climbing tools. The 35-45mm range delivers real aero benefit while remaining manageable in mixed conditions." } },
        { "@type": "Question", "name": "Do narrow tires help aerodynamics on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "On smooth surfaces, narrower tires are more aerodynamic — the frontal area is smaller. On gravel, narrower tires must run higher pressure (worse rolling resistance on rough surfaces), which typically eliminates any aero advantage. At gravel speeds on rough terrain, the rolling resistance penalty of narrow high-pressure tires far outweighs the modest aero benefit. In 2026, wider tires at lower pressure are consistently faster on gravel regardless of aerodynamics." } },
        { "@type": "Question", "name": "Is there a weight vs aero trade-off for gravel wheels?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, and terrain determines which matters more. On a course with >5% sustained climbing, lighter wheels (<1,500g per pair) outperform heavier aero wheels. On flat or rolling gravel (where most big events take place), aero wins at speeds above 27-30 km/h. Most competitive gravel racers in 2026 favor 1,400-1,600g wheelsets with 35-45mm depth — balancing weight, aero, and stiffness." } }
    ]
};

export default function PostAeroGravel({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 27, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Aero Gains on Gravel: Deep Section Wheels vs Narrow Tires — Real Watts</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Wind tunnel numbers were built for smooth roads. Here&apos;s what actually happens to aero gains when the surface turns to gravel.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-aero-wheels-deep-section-vs-narrow-tires.webp"
                        alt="Side-by-side comparison of aero gravel cyclist with 50mm deep section wheels vs shallow wheels with CFD airflow visualization — CrankSmith aero analysis"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            The aero upgrade conversation on gravel is real but misframed. Marketing copy quotes watt savings measured in velodrome conditions. Gravel is not a velodrome. Here&apos;s how those numbers actually hold up on real terrain, and where to actually invest if speed is the goal.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Why Gravel Changes the Aero Equation</h2>
                        <p>Three factors significantly reduce aero gains on gravel compared to smooth road:</p>
                        <ol className="list-decimal pl-5 space-y-3 mt-4">
                            <li><strong>Lower average speed.</strong> Aerodynamic drag scales with the square of speed. At 30 km/h (typical gravel race pace), drag is only 56% of what it is at 40 km/h (typical road race pace). A wheel saving 15W on a road course saves ~8W on gravel.</li>
                            <li><strong>Variable terrain blocks wind.</strong> Trees, ridgelines, and elevation changes mean you&apos;re rarely in a clean headwind on gravel. Aero benefits are maximized in sustained exposed headwinds — which may represent only 20-40% of a gravel ride.</li>
                            <li><strong>Surface roughness dominates at gravel speeds.</strong> Rolling resistance on rough gravel contributes more to total resistance than aerodynamic drag. Optimizing tires (width, compound, pressure) returns more speed than wheel aerodynamics on technical terrain.</li>
                        </ol>

                        <h2 className="text-white mt-12 mb-6">Real Watt Savings by Component</h2>
                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Estimated Watt Savings at 30 km/h on Mixed Gravel</h3>
                            <div className="space-y-3">
                                {[
                                    { item: "Position (upright → aggressive)", range: "20–40W", impact: "Transformative" },
                                    { item: "Aero helmet vs standard road helmet", range: "8–18W", impact: "High" },
                                    { item: "Skinsuit vs traditional jersey + bib", range: "5–12W", impact: "High" },
                                    { item: "Aero wheelset (35-45mm vs 25mm box)", range: "3–10W", impact: "Moderate" },
                                    { item: "Narrower tires (but higher pressure)", range: "-2–+5W", impact: "Mixed (often negative on rough terrain)" },
                                    { item: "Aero frame vs standard frame", range: "1–5W", impact: "Low at gravel speeds" },
                                ].map(({ item, range, impact }) => (
                                    <div key={item} className="flex gap-4 items-center">
                                        <span className="text-gray-300 text-sm flex-1">{item}</span>
                                        <span className="text-cyan-400 font-bold text-sm w-20 text-right">{range}</span>
                                        <span className="text-gray-500 text-xs w-32 text-right hidden md:block">{impact}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Estimates based on available gravel-specific testing and scaled from controlled road test data. Actual savings vary significantly by terrain and conditions.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Wheel Depth Sweet Spot for Gravel</h2>
                        <p>If you&apos;re buying wheels primarily for gravel, <strong>35-45mm rim depth</strong> is the practical optimum for most riders and events:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Under 30mm depth:</strong> Pure climbing wheel. Minimal aero benefit. Best for alpine races or very hilly courses.</li>
                            <li><strong>35-45mm:</strong> Best balance. Real aero savings on fast sections, manageable in crosswinds, not punishing on climbs.</li>
                            <li><strong>50mm+:</strong> Maximum aero — but requires calm conditions and a course where sustained speed is achievable. Crosswind handling becomes challenging on exposed gravel roads.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">The Honest Priority Order</h2>
                        <p>If you want to go faster on gravel and have a limited budget, here&apos;s the honest investment order:</p>
                        <ol className="list-decimal pl-5 space-y-2 mt-4">
                            <li><strong>Fit and position</strong> (free with a professional bike fit, ~$200-300)</li>
                            <li><strong>Tire optimization</strong> — right width, right compound, tubeless setup (~$120-180)</li>
                            <li><strong>Aero helmet</strong> (~$200-300)</li>
                            <li><strong>Skinsuit</strong> (~$150-250)</li>
                            <li><strong>Aero wheelset</strong> (~$1,000-2,500)</li>
                        </ol>
                        <p className="mt-4">The wheelset comes last not because it doesn&apos;t work, but because the items above it deliver more return per dollar on real-world gravel terrain. Use CrankSmith to <Link href="/builder" className="text-cyan-400 hover:underline">compare wheel weight vs depth trade-offs</Link> for your specific build.</p>
                    </div>

                    <BlogCTA heading="Compare Wheel Weight vs Aero Trade-Off" sub="Enter your wheel options in CrankSmith to compare weight, stiffness, and aero depth for your build." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
