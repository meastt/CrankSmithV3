import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Racing: Unbound vs Mid South vs SBT GRVL — Which Suits You?",
    description: "Terrain comparison, distances, difficulty, vibe, and entry logistics for Unbound Gravel, Mid South, and SBT GRVL. Three major gravel events compared with Life Time Grand Prix context.",
    date: "2026-05-05",
    category: "Racing",
    keywords: ["Unbound Gravel 2026", "Mid South vs SBT GRVL", "which gravel race to enter", "Life Time Grand Prix gravel", "best gravel events 2026"],
    image: "/images/mid-south-2026-gravel-race-gearing-breakdown.webp",
    excerpt: "Three races. Three completely different challenges. Here's how to figure out which one is actually right for you in 2026."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Which is harder: Unbound Gravel or SBT GRVL?", "acceptedAnswer": { "@type": "Answer", "text": "SBT GRVL is harder in terms of climbing — it runs through the Colorado mountains with 8,000-10,000 feet of elevation gain. Unbound (200-mile course) is harder in terms of total distance and mental endurance — 200 miles of relentless Kansas Flint Hills with 11,000+ feet of cumulative climbing across rolling terrain, typically in heat above 30°C. Most riders find Unbound the more demanding event overall, particularly at the 200-mile distance." } },
        { "@type": "Question", "name": "Is Unbound Gravel part of the Life Time Grand Prix?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Unbound Gravel is a flagship event in the Life Time Grand Prix series, which also includes Sea Otter Classic XC, Leadville Trail 100 MTB, Crusher in the Tushar, Chequamegon 40, and Steamboat Gravel. The Grand Prix requires completing all events in the series to qualify for prize money. Unbound 200 counts for the highest points value in the gravel segment." } },
        { "@type": "Question", "name": "When should I enter my first gravel race?", "acceptedAnswer": { "@type": "Answer", "text": "Start with a 100km or shorter event, ideally a local or regional race without the logistics complexity of destination events like Unbound. If you're targeting a major event, start with the Mid South 100-mile format (manageable for most fit recreational cyclists), then consider SBT GRVL 100-mile, then Unbound 100-mile. Save Unbound 200 for after you have 1-2 big gravel races under your belt." } },
        { "@type": "Question", "name": "How do I get into Unbound Gravel 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Unbound Gravel uses a lottery system for most entry slots. Registration opens in fall and closes quickly — the 200-mile course typically fills within minutes. Some slots are available through qualifying events, charity fundraising, and volunteer programs. Life Time Grand Prix invitees receive guaranteed entries. Check the Life Time website in September for the current year's registration schedule." } },
        { "@type": "Question", "name": "What bike is best for SBT GRVL?", "acceptedAnswer": { "@type": "Answer", "text": "SBT GRVL (Steamboat Springs, CO) features mountain dirt roads, loose gravel, and extended climbs. The optimal setup is a modern gravel bike with 45-50mm tires, a small enough chainring for sustained alpine climbing (38-40t is common), and strong brakes for the descents. A lightweight carbon frame has more advantage here than at flat Midwest events. Many riders run a suspension fork or RockShox Rudy for the extended rough sections." } }
    ]
};

export default function PostGravelRacingComparison({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Racing • May 5, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Racing: Unbound vs Mid South vs SBT GRVL — Which Suits You?</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Three completely different challenges. Here&apos;s how to figure out which one is right for you in 2026.</p>
                    </div>

                    <FeaturedImage
                        src="/images/mid-south-2026-gravel-race-gearing-breakdown.webp"
                        alt="Gravel cyclists racing on red Oklahoma dirt roads at Mid South 2026 — CrankSmith gravel racing event comparison guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/mid-south-2026-gearing-breakdown-what-pros-actually-ran" className="text-cyan-400 hover:underline">Mid South 2026 Gearing Breakdown</Link> • <Link href="/blog/unbound-gravel-2026-tire-gear-setup" className="text-cyan-400 hover:underline">Unbound Gravel 2026 Tire &amp; Gear Setup</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Three races define American gravel in 2026. Unbound is the ultra. Mid South is the classic. SBT GRVL is the mountain challenge. Choosing between them is less about which is &ldquo;better&rdquo; and more about knowing yourself as a rider.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Event Comparison at a Glance</h2>
                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Category</th>
                                        <th className="text-left p-3 text-amber-400">Unbound Gravel</th>
                                        <th className="text-left p-3 text-red-400">Mid South</th>
                                        <th className="text-left p-3 text-blue-400">SBT GRVL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Location", "Emporia, KS", "Stillwater, OK", "Steamboat Springs, CO"],
                                        ["Month", "June", "March", "August"],
                                        ["Main distance", "200 miles (322km)", "100 miles / 200 miles", "100 miles (145km)"],
                                        ["Elevation (main dist.)", "~11,000ft", "~6,500ft", "~9,500ft"],
                                        ["Terrain", "Flint Hills limestone, hard pack/mud", "Red Oklahoma dirt, rolling hills", "Mountain dirt roads, loose alpine"],
                                        ["Surface difficulty", "Rutted, variable, remote", "Fast when dry, treacherous when wet", "Rocky, loose, technical climbs"],
                                        ["Weather risk", "Heat + t-storms", "Cold/rain (March)", "Afternoon t-storms"],
                                        ["Entry method", "Lottery + qualifier", "First come / Pro/Am", "Registration (fills fast)"],
                                        ["Life Time GP", "Yes — flagship", "No (2026)", "Yes — included"],
                                        ["Vibe", "Epic sufferfest", "Classic Americana", "Mountain adventure"],
                                    ].map(([cat, unbound, midsouth, sbt]) => (
                                        <tr key={cat} className="hover:bg-white/5">
                                            <td className="p-3 text-gray-400 font-medium">{cat}</td>
                                            <td className="p-3 text-amber-200">{unbound}</td>
                                            <td className="p-3 text-red-200">{midsouth}</td>
                                            <td className="p-3 text-blue-200">{sbt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Which One Is Right For You?</h2>
                        <div className="my-6 space-y-4">
                            {[
                                {
                                    event: "Unbound Gravel",
                                    color: "amber",
                                    fits: "Riders who want the ultimate gravel experience. You've done shorter events and want to know if you can go 200 miles. The 100-mile option is more accessible — it's still hard, but a realistic first major gravel race for fit riders who've trained properly.",
                                    notFits: "First-time gravel racers. The 200-mile distance, lottery entry, and logistical demands of travel to Kansas in June make this a tough first event."
                                },
                                {
                                    event: "Mid South",
                                    color: "red",
                                    fits: "Road cyclists making the jump to gravel racing. March timing is before full race season. The 100-mile format is legitimate but not crazy. Red dirt racing culture is welcoming. New pro/am format means mass participation has its own separate start.",
                                    notFits: "Riders allergic to cold and mud — March in Oklahoma can be both. If you need guaranteed dry conditions to enjoy yourself, this isn't the event."
                                },
                                {
                                    event: "SBT GRVL",
                                    color: "blue",
                                    fits: "Climbers and mountain riders who want a visually spectacular event. Steamboat Springs is beautiful. The climbing is sustained and technical. If you've railed mountain downhills on a gravel bike, you'll love SBT's descents.",
                                    notFits: "Altitude-sensitive riders or those whose fitness is built for long flat power. The alpine elevation (8,000-10,000ft) slows everyone down — if you live at sea level, factor in acclimatization time."
                                },
                            ].map(({ event, color, fits, notFits }) => (
                                <div key={event} className={`bg-white/5 p-5 rounded-xl border border-${color}-500/20`}>
                                    <h3 className={`text-${color}-400 font-bold text-lg mb-3`}>{event}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-green-400 font-bold text-xs mb-1 uppercase tracking-wider">Good Fit</p>
                                            <p className="text-gray-300 text-sm">{fits}</p>
                                        </div>
                                        <div>
                                            <p className="text-red-400 font-bold text-xs mb-1 uppercase tracking-wider">Not Ideal If</p>
                                            <p className="text-gray-300 text-sm">{notFits}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Life Time Grand Prix Factor</h2>
                        <p>The <a href="https://www.lifetime.life/life-time-grand-prix.html" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Life Time Grand Prix</a> in 2026 includes Unbound and SBT GRVL among its mandatory events. If you&apos;re targeting the full series, both are required — which means building a race schedule around their June and August dates. Mid South is not a 2026 GP event, which makes it more accessible to riders who want the experience without the series pressure.</p>

                        <p className="mt-4">For event-specific gearing, tire, and setup recommendations, see the <Link href="/blog/unbound-gravel-2026-tire-gear-setup" className="text-cyan-400 hover:underline">Unbound Gravel 2026 Setup Guide</Link> and the <Link href="/blog/mid-south-2026-gearing-breakdown-what-pros-actually-ran" className="text-cyan-400 hover:underline">Mid South Gearing Breakdown</Link>. Then build your race-specific setup in CrankSmith.</p>
                    </div>

                    <BlogCTA heading="Build Your Race Bike in CrankSmith" sub="Enter your event, terrain, and components to validate your complete race setup." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
