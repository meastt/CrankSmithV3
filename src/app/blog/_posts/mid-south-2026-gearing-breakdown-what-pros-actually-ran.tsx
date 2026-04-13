import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Mid South 2026 Gearing Breakdown: What the Pros Actually Ran",
    description: "Real gearing setups from the Mid South Gravel race in Stillwater, OK — March 14, 2026. Pro and amateur data: chainrings, cassettes, tire setups, and why those specific combinations won.",
    date: "2026-04-21",
    category: "Racing",
    keywords: ["Mid South gravel gearing", "red dirt gravel setup", "gravel race gearing 2026", "Mid South 2026 bike setup", "Stillwater Oklahoma gravel race"],
    image: "/images/mid-south-2026-gravel-race-gearing-breakdown.webp",
    excerpt: "34x11-42, 42x10-46, 42x9-45. Real setups from Mid South 2026 — and why those exact combinations for red Oklahoma dirt."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What gearing did pros use at Mid South 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Common pro setups at Mid South 2026 included 42t chainrings with 10-46t and 10-44t cassettes, and 40t chainrings with 10-44t cassettes. The terrain's extended climbs and fast rolling sections favor a mid-range chainring with a wide cassette over aggressive small-ring setups. SRAM Force XPLR AXS was the most common groupset in the pro field." } },
        { "@type": "Question", "name": "What tire pressure do pros run on red dirt gravel?", "acceptedAnswer": { "@type": "Answer", "text": "On Oklahoma's red clay-dirt roads, most pros ran 48-50mm tires at 22-28 PSI (front) and 25-30 PSI (rear), varying by rider weight. The fine-particle red dirt packs firm when dry but becomes extremely slick when wet. Lower pressures improve grip dramatically on the loose surface. Heavier riders typically ran 2-3 PSI more than lighter riders on the same tire." } },
        { "@type": "Question", "name": "Why is Mid South considered a unique gravel event?", "acceptedAnswer": { "@type": "Answer", "text": "Mid South (formerly Land Run 100) changed to a pro/am split format in 2026, separating the elite race from the mass-participation event. The Oklahoma red dirt roads are unique — fast when dry, treacherous clay when wet, with long exposed switchback climbs unlike typical New England or Pacific Northwest gravel terrain. The 2026 event featured both 100-mile and 350km ultra distances." } },
        { "@type": "Question", "name": "What was the most common gravel tire at Mid South 2026?", "acceptedAnswer": { "@type": "Answer", "text": "The Panaracer GravelKing SK+ (48mm) and Maxxis Rambler (50mm) were the most common tire choices at Mid South 2026 in the pro field. Both tires feature center-ridge rolling efficiency with aggressive side knobs suited to the loose red dirt corners. Tire inserts were common to prevent burping at the low pressures used." } },
        { "@type": "Question", "name": "How does red dirt affect tire and gear choice?", "acceptedAnswer": { "@type": "Answer", "text": "Oklahoma red dirt is iron-rich clay. When dry, it packs hard and rewards fast rolling tires at moderate pressure. When wet, it becomes the slipperiest surface in American gravel — essentially peanut butter. Racers prepare for both conditions with wider tires (48-50mm) that handle wet clay through volume and tread, and gearing that sustains speed on loose surfaces without excessive cadence." } }
    ]
};

export default function PostMidSouth2026({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Racing • April 21, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Mid South 2026 Gearing Breakdown: What the Pros Actually Ran</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Real setups from Stillwater, Oklahoma — March 14, 2026. Pro field data, red dirt tire strategy, and what these specific combinations tell you about gearing for variable terrain.</p>
                    </div>

                    <FeaturedImage
                        src="/images/mid-south-2026-gravel-race-gearing-breakdown.webp"
                        alt="Gravel cyclists racing on red dirt roads of Stillwater Oklahoma at Mid South 2026 with dramatic dust clouds — CrankSmith race gearing analysis"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/unbound-gravel-2026-tire-gear-setup" className="text-cyan-400 hover:underline">Unbound Gravel 2026 Tire &amp; Gear Setup</Link> • <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Red Dirt Tire PSI Calculator</a></em></p>

                        <p className="lead text-xl text-stone-200">
                            Mid South is one of the most data-rich races on the American gravel calendar for one reason: the terrain is specific and consistent. Stillwater&apos;s red clay roads have defined characteristics — fast on dry days, peanut butter on wet ones — and the pro field&apos;s gear choices reflect that reality precisely. Here&apos;s what they ran in 2026, and why.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Race Context</h2>
                        <p>Mid South 2026 (formerly Land Run 100) ran on March 14 from Stillwater, Oklahoma. The 2026 edition introduced a pro/am split format — the elite field started separately from the mass participation event, creating cleaner data on what winning setups actually looked like. The event featured three distance options: 100 miles, 200 miles, and the new 350km ultra.</p>

                        <p>March in Oklahoma is notoriously unpredictable. The 2026 race started dry with temps in the mid-50s°F, turned briefly threatening mid-morning before clearing. That weather window shaped the winning tire choices: competitors who pre-committed to race-day tire selection rather than conditions-specific swaps had to account for both dry and potentially wet red dirt.</p>

                        <h2 className="text-white mt-12 mb-6">Pro Field Gearing Setups</h2>
                        <p>Based on available data from registered pro riders and post-race interviews:</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Most Common Pro Configurations — Mid South 2026</h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        setup: "42t × 10-44t",
                                        gi: "25.5–112 gear inches",
                                        note: "Most common in the top 10. SRAM Force XPLR AXS. Favored on the 100-mile course where sustained mid-range power matters most.",
                                        highlight: true,
                                    },
                                    {
                                        setup: "42t × 10-46t",
                                        gi: "24.4–112 gear inches",
                                        note: "Second most common. Shimano GRX Di2 users. Slightly wider range for riders targeting the 200-mile ultra format.",
                                        highlight: false,
                                    },
                                    {
                                        setup: "40t × 10-44t",
                                        gi: "24.3–107 gear inches",
                                        note: "Used by climber-type riders and lighter athletes. Prioritizes spinning out the climbs over raw top-speed.",
                                        highlight: false,
                                    },
                                    {
                                        setup: "34t × 11-42t",
                                        gi: "21.7–82.4 gear inches",
                                        note: "Used by am/cat riders and those targeting the 350km ultra. Significantly easier gearing. Correct choice for sustained efforts over very long distance.",
                                        highlight: false,
                                    },
                                ].map(({ setup, gi, note, highlight }) => (
                                    <div key={setup} className={`p-4 rounded-lg border ${highlight ? "border-cyan-500/30 bg-cyan-900/10" : "border-white/10 bg-white/3"}`}>
                                        <div className="flex gap-4 items-start">
                                            <span className={`font-mono font-bold text-lg ${highlight ? "text-cyan-400" : "text-white"}`}>{setup}</span>
                                            <span className="text-gray-400 text-sm font-mono">{gi}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2">{note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Why 42t — Not 40t or 44t?</h2>
                        <p>The 42t chainring choice is interesting because it doesn&apos;t fit the &quot;go small for climbing&quot; pattern. Oklahoma&apos;s red dirt roads have gradual, long climbs rather than steep punchy ones. There&apos;s very little technical climbing that demands a dramatically lower gear — the challenge is sustaining power output for hours on a variable surface that alternates between fast rollers and grinding climbs.</p>

                        <p>A 42t/10-44t setup gives:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>Easy gear: <strong>25.5 gear inches</strong> (adequate for Oklahoma&apos;s climbs — nothing requires sub-24)</li>
                            <li>Hard gear: <strong>112 gear inches</strong> (plenty for drafting on the fast rolling sections and descents)</li>
                            <li>Mid-range density: the 10-44t cassette has tighter steps in the 15-28t range — exactly where you spend most race time on rolling gravel</li>
                        </ul>

                        <p className="mt-4">Compare this to a 34t/10-52t setup (which would be overkill for Oklahoma): the climbing gear is dramatically easier than needed, and the wide cassette has larger gaps between cogs at the speeds most riders actually sustain. The 42/10-44 combination is specifically tuned to Mid South&apos;s pace, not general gravel racing.</p>

                        <h2 className="text-white mt-12 mb-6">Tire Selection: Red Dirt Logic</h2>
                        <p>Oklahoma red dirt is iron-rich clay. Dry: it packs firm and rewards fast-rolling center tread. Wet: it becomes the most slippery surface in American gravel racing — smooth center knobs provide zero grip on wet red clay. The smart play for uncertain conditions:</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-3">Top 2026 Mid South Tire Choices</h3>
                            <div className="space-y-3">
                                {[
                                    { tire: "Panaracer GravelKing SK+ 48mm", psi: "22-26 PSI F / 25-30 PSI R", note: "Most common. Center ridge for dry speed, aggressive side knobs for wet clay corners." },
                                    { tire: "Maxxis Rambler 50mm", psi: "20-25 PSI F / 24-28 PSI R", note: "Preferred by heavier riders (75kg+). Extra volume adds security in variable conditions." },
                                    { tire: "Teravail Cannonball 42mm", psi: "28-32 PSI F / 30-35 PSI R", note: "Used by speed-first riders on the 100-mile. Fast rolling on dry, risky in wet." },
                                ].map(({ tire, psi, note }) => (
                                    <div key={tire} className="flex gap-3 items-start">
                                        <div className="flex-1">
                                            <p className="font-medium text-white text-sm">{tire}</p>
                                            <p className="text-cyan-400 text-xs font-mono">{psi}</p>
                                            <p className="text-gray-400 text-sm mt-1">{note}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">PSI ranges via rider interviews. Actual PSI varies by rider weight — use the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI calculator</a> for your weight and tire.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">What This Means for Your Gravel Setup</h2>
                        <p>The Mid South data points to a clear principle: <strong>match your chainring to your terrain&apos;s average gradient, not your hardest climb</strong>. Most riders over-optimize for the steepest climb they&apos;ll face rather than the gear they&apos;ll spend 80% of the ride in. If your typical gravel ride features sustained moderate climbs rather than steep technical ones, a 40t or 42t ring with a 10-44t cassette will serve you better than a 34t ring with a 10-52t cassette.</p>

                        <p>For an event-specific gearing calculation — enter your course elevation profile, target power, and cadence preferences — <Link href="/builder" className="text-cyan-400 hover:underline">build your setup in CrankSmith</Link> and compare real gear inch ranges.</p>
                    </div>

                    <BlogCTA heading="Calculate Your Race Gearing" sub="Enter your drivetrain, tire width, and target terrain to see your exact gear inches and compare setups." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
