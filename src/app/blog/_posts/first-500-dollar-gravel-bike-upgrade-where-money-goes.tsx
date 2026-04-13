import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "The First $500 Upgrade on a Gravel Bike: Where the Money Actually Goes",
    description: "ROI-ranked gravel bike upgrades: which components return the most performance per dollar, and which upgrades are overhyped. Specific product recommendations for 2026.",
    date: "2026-04-29",
    category: "Drivetrain",
    keywords: ["best gravel bike upgrades", "gravel bike upgrade priority", "first upgrade gravel bike", "gravel bike upgrade list 2026", "gravel bike performance upgrades"],
    image: "/images/gravel-bike-first-500-upgrade-priority.webp",
    excerpt: "Tires return the most per dollar. Wheels look the best on Instagram. Here's the actual ROI order for your first $500 of gravel upgrades."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is the best first upgrade for a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Tires are the highest-return first upgrade for any gravel bike. Switching from stock OEM tires (typically heavy, tube-type, narrower) to quality tubeless-ready tires (Maxxis Rambler, Teravail Cannonball, WTB Riddler) at the widest size your frame accommodates costs $120-180 and delivers better rolling speed, more grip, fewer flats, and greater comfort simultaneously. No other $180 upgrade touches those combined gains." } },
        { "@type":="Question", "name": "Is upgrading to tubeless worth it on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — especially on gravel. Tubeless allows lower tire pressures for more grip and compliance, eliminates pinch flats entirely, and self-seals punctures up to 3mm. The cost is typically $60-120 for a conversion kit (tape, valves, sealant) if your rims are tubeless-ready. The time-to-puncture-flat ratio on gravel makes tubeless one of the most practical upgrades in the sport." } },
        { "@type": "Question", "name": "Are carbon wheels worth the upgrade on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "For competitive riders, yes. A quality carbon gravel wheelset (1,400-1,600g, 35-42mm depth) saves 300-500g over OEM alloy wheels, provides real aero benefit, and often improves tubeless seating compared to budget alloy rims. For recreational riders, the $1,200-2,500 cost rarely returns equivalent value compared to tires, cockpit fit, or other upgrades." } },
        { "@type": "Question", "name": "Does upgrading handlebars improve gravel bike performance?", "acceptedAnswer": { "@type": "Answer", "text": "A proper gravel handlebar (flared drops, 12-16° flare) significantly improves control, reduces fatigue, and allows riding drops on technical terrain. Most stock gravel bars have 4-8° flare. If your bike came with road bars, upgrading to gravel-specific bars (PRO Discover, Enve G-Series, Salsa Cowbell 3) for $100-200 is one of the best comfort and control upgrades available." } },
        { "@type": "Question", "name": "Should I upgrade my gravel drivetrain before wheels?", "acceptedAnswer": { "@type": "Answer", "text": "Only if your drivetrain is genuinely limiting you — wrong gear range, unreliable shifting, or major wear. Drivetrain upgrades are expensive ($500-1,500 for a groupset) relative to the performance gain compared to tires or wheels. If your existing drivetrain shifts reliably and covers the terrain you ride, maintain it rather than upgrade." } }
    ]
};

export default function PostFirstUpgrade({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 29, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">The First $500 Upgrade on a Gravel Bike: Where the Money Actually Goes</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Tires return the most per dollar. Wheels look best on Instagram. Here&apos;s the actual ROI-ranked order for your first $500 in gravel upgrades.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-bike-first-500-upgrade-priority.webp"
                        alt="Flat lay of gravel bike upgrade components: tires, wheelset, cockpit, and dropper post with ROI value indicators — CrankSmith upgrade guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            Most gravel bikes under $3,000 ship with compromises — heavy tires, box-section alloy wheels, narrow drops, and sometimes even tube-type setups in 2026. That&apos;s where the margins are. Here&apos;s how to spend your first $500 in upgrades to extract the maximum performance from any stock gravel bike.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The ROI-Ranked Upgrade List</h2>

                        <div className="my-6 space-y-4">
                            {[
                                {
                                    rank: "#1",
                                    title: "Tires + Tubeless Setup",
                                    cost: "$120–$200",
                                    roi: "Highest",
                                    desc: "Replace stock OEM tires with quality tubeless-ready rubber at the maximum width your frame clears. Then convert to tubeless. Combined, this delivers faster rolling on gravel, more grip, fewer flats, and more comfort. The Maxxis Rambler 45mm or Teravail Cannonball 42mm are proven choices. Add Stans tubeless tape, quality valves, and ~2oz of sealant per tire.",
                                    tags: ["Grip", "Speed", "Flat protection", "Comfort"],
                                },
                                {
                                    rank: "#2",
                                    title: "Gravel Handlebars (if on road bars)",
                                    cost: "$100–$200",
                                    roi: "Very High",
                                    desc: "If your bike shipped with road bars (4° flare or less), upgrading to proper gravel bars with 12-16° flare transforms technical terrain confidence and reduces hand fatigue on long rides. The PRO Discover ($120) and Salsa Cowbell 3 ($150) are excellent entry-level options. If you already have flared drops, skip this.",
                                    tags: ["Control", "Comfort", "Technical terrain"],
                                },
                                {
                                    rank: "#3",
                                    title: "Saddle (if current saddle doesn't fit)",
                                    cost: "$80–$200",
                                    roi: "High (if needed)",
                                    desc: "No one talks about saddles as upgrades, but a mis-fitting saddle kills the joy of every ride. Get a pressure map fit at a bike shop before buying. The WTB Volt/Volt Race or Fizik Terra Argo are popular gravel-specific options. ROI is conditional — only invest if your current saddle genuinely hurts.",
                                    tags: ["Comfort", "Position"],
                                },
                                {
                                    rank: "#4",
                                    title: "Cockpit: Stem Length & Bar Reach",
                                    cost: "$40–$120",
                                    roi: "High (if needed)",
                                    desc: "Stock stem length is rarely optimal. A 10-15mm shorter stem improves handling on technical gravel; a longer stem adds stability on open roads. This is a $40-80 change that can transform bike fit. Only invest after establishing that fit is the issue — try a professional bike fit first.",
                                    tags: ["Fit", "Handling"],
                                },
                                {
                                    rank: "#5",
                                    title: "Chainring Size Optimization",
                                    cost: "$40–$80",
                                    roi: "Situational",
                                    desc: "If your stock chainring is too big or too small for your terrain, swapping it is cheap and effective. Going from a 42t to 38t for more climbing range costs $50-70 and is immediately noticeable. See the <a href='/blog/1x-vs-2x-gravel-2026-numbers' class='text-cyan-400 hover:underline'>1x vs 2x numbers post</a> for range calculations before committing.",
                                    tags: ["Gearing", "Climbing"],
                                    isHTML: true,
                                },
                            ].map(({ rank, title, cost, roi, desc, tags, isHTML }) => (
                                <div key={rank} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <div className="flex gap-3 items-baseline mb-3">
                                        <span className="text-cyan-400 font-bold text-xl font-mono">{rank}</span>
                                        <h3 className="text-white font-bold text-lg">{title}</h3>
                                        <span className="text-gray-400 text-sm ml-auto whitespace-nowrap">{cost}</span>
                                    </div>
                                    {isHTML ? (
                                        <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: desc }} />
                                    ) : (
                                        <p className="text-gray-300 text-sm">{desc}</p>
                                    )}
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {tags.map(tag => <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">{tag}</span>)}
                                        <span className="text-xs bg-cyan-900/40 text-cyan-400 px-2 py-1 rounded ml-auto">ROI: {roi}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">What to Upgrade Later</h2>
                        <p>After tires and fit, the next logical category is wheels — but that&apos;s typically $1,000-2,500 for a meaningful improvement, which blows past the &ldquo;first $500&rdquo; budget. When you&apos;re ready, a quality alloy set with wide internal rims (25-28mm) and tubeless compatibility is the minimum to consider. Carbon comes after that.</p>

                        <p className="mt-4">Drivetrain upgrades only make sense when you&apos;re limited by gear range (chainring swap is cheaper than a new groupset), reliability, or weight targets for a specific event. Maintaining your existing groupset well is significantly cheaper than replacing it prematurely. Use <Link href="/builder" className="text-cyan-400 hover:underline">CrankSmith&apos;s weight tool</Link> to track your build&apos;s total weight and identify where meaningful savings are actually available.</p>
                    </div>

                    <BlogCTA heading="Build Your Upgrade Path" sub="Enter your current build components in CrankSmith to track weight and see where your upgrade dollars return the most." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
