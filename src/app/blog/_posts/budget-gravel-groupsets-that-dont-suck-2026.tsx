import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Budget Gravel Groupsets That Don't Suck in 2026",
    description: "SRAM Apex XPLR AXS, MicroShift Advent X, Shimano CUES — the best budget gravel groupsets under $700 in 2026, ranked honestly by performance per dollar.",
    date: "2026-05-06",
    category: "Drivetrain",
    keywords: ["budget gravel groupset 2026", "best cheap gravel drivetrain", "SRAM Apex XPLR review", "MicroShift Advent X review", "Shimano CUES gravel"],
    image: "/images/shimano-grx-sram-axs-campagnolo-ekar-comparison-2026.webp",
    excerpt: "You don't need Force AXS to ride great gravel. Here are the budget groupsets that actually deliver in 2026."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is the best budget gravel groupset in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "SRAM Apex XPLR AXS (~$650-800 complete) is the best value electronic gravel groupset. For mechanical, MicroShift Advent X (~$250-350) offers genuine value with a real clutch derailleur and 11-48t cassette range. Shimano GRX 600 (~$500-600) is the most reliable mid-tier mechanical option with a proven track record. The 'best' depends on whether you prioritize wireless convenience (Apex AXS), ultimate value (MicroShift), or reliability (GRX 600)." } },
        { "@type": "Question", "name": "Is MicroShift Advent X good enough for serious gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, for most riders. MicroShift Advent X is a legitimate 10-speed 1x drivetrain with a proper clutch derailleur that matches SRAM GX in chain retention. The 11-48t cassette gives a range similar to higher-end drivetrains. Shifting feel is noticeably less refined than GRX or SRAM, with more lever effort — acceptable for recreational riding but noticeable on long days. The low price point ($50-80 complete mechanical drivetrain options) makes it unbeatable for the budget-conscious." } },
        { "@type": "Question", "name": "What is SRAM Apex XPLR AXS?", "acceptedAnswer": { "@type": "Answer", "text": "SRAM Apex XPLR AXS is the entry-level wireless electronic gravel groupset from SRAM. It uses the same AXS wireless protocol as Force and Red AXS but with heavier components. The complete groupset (derailleurs, shifters, cassette, chain, crankset, brakes) runs $650-900 depending on retailer and spec. It delivers genuine wireless shifting, the AXS app integration, and is compatible with the broader AXS ecosystem." } },
        { "@type": "Question", "name": "Is Shimano CUES good for gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Shimano CUES (U6000/U8000) is designed for utility cycling but works well on gravel for riders who prioritize drivetrain longevity over weight. The LinkGlide chain technology extends chain life 3× compared to standard chains — significant for high-mileage commuter-gravel riders. CUES is heavier than GRX but more durable under sustained use. Not ideal for racing; excellent for touring, bikepacking, and heavy daily use." } },
        { "@type": "Question", "name": "Can I mix and match budget groupset components?", "acceptedAnswer": { "@type": "Answer", "text": "Within brands, often yes. SRAM mechanical derailleurs work with SRAM cable shifters across most generations. Shimano components are generally cross-compatible within speed tiers. MicroShift uses Shimano-compatible cable pull ratios, meaning MicroShift shifters can work with Shimano mechanical derailleurs. Always check compatibility before mixing — electronic systems are completely proprietary and not cross-compatible." } }
    ]
};

export default function PostBudgetGroupsets({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • May 6, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Budget Gravel Groupsets That Don&apos;t Suck in 2026</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">You don&apos;t need Force AXS or GRX Di2 to ride fast gravel. Here are the budget options that genuinely deliver.</p>
                    </div>

                    <FeaturedImage
                        src="/images/shimano-grx-sram-axs-campagnolo-ekar-comparison-2026.webp"
                        alt="Premium gravel groupset derailleurs compared — budget alternatives available from SRAM Apex, MicroShift, and Shimano CUES — CrankSmith groupset guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/shimano-grx-vs-sram-axs-xplr-vs-campagnolo-ekar-2026" className="text-cyan-400 hover:underline">Shimano GRX vs SRAM AXS vs Campagnolo Ekar</Link> • <Link href="/blog/1x-vs-2x-gravel-2026-numbers" className="text-cyan-400 hover:underline">1x vs 2x on Gravel: The Numbers</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            The $2,000 groupset is aspirational. The $400 groupset is what most people actually ride, and it can be excellent. Here&apos;s the honest breakdown of 2026&apos;s budget gravel drivetrain options, ranked by real-world performance value.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Budget Tier: Under $700 Complete</h2>

                        <div className="my-6 space-y-5">
                            {[
                                {
                                    name: "SRAM Apex XPLR AXS",
                                    price: "$650–$900",
                                    type: "Electronic wireless 1x",
                                    speeds: "12-speed",
                                    range: "10-44t cassette",
                                    highlight: true,
                                    pros: ["Wireless — no cables from shifters", "Full AXS ecosystem compatible", "Real electronic precision at entry-level price", "Lighter than mechanical options slightly"],
                                    cons: ["Most expensive on this list", "Battery adds complexity for long expeditions", "Heavier than Force/Red AXS"],
                                    verdict: "Best budget electronic gravel groupset. If you want wireless and can't afford Force AXS, Apex XPLR AXS is the answer.",
                                },
                                {
                                    name: "Shimano GRX 600",
                                    price: "$500–$650",
                                    type: "Mechanical 1x (or 2x)",
                                    speeds: "11-speed",
                                    range: "11-42t cassette",
                                    highlight: false,
                                    pros: ["Shimano's legendary reliability", "Excellent brake modulation", "Available in 1x and 2x", "Wide service network worldwide"],
                                    cons: ["11-speed limits max cassette range vs 12-speed", "Mechanical — cable stretch over time", "Heavier than GRX 820"],
                                    verdict: "Most reliable mechanical gravel option. The proven choice for riders who want it to just work — everywhere, for years.",
                                },
                                {
                                    name: "Shimano CUES U6000",
                                    price: "$350–$500",
                                    type: "Mechanical",
                                    speeds: "11-speed",
                                    range: "11-46t cassette",
                                    highlight: false,
                                    pros: ["LinkGlide 3× chain life extension", "Budget-friendly", "Excellent for heavy-use / commuter-gravel"],
                                    cons: ["Heavier than GRX", "Less refined shift feel", "Not racing-oriented"],
                                    verdict: "Best for high-mileage riders who care about longevity over shift quality. Think 10,000+ miles/year.",
                                },
                                {
                                    name: "MicroShift Advent X",
                                    price: "$250–$350",
                                    type: "Mechanical 1x",
                                    speeds: "10-speed",
                                    range: "11-48t cassette",
                                    highlight: false,
                                    pros: ["Lowest price on this list", "Real clutch derailleur for chain retention", "11-48t range is genuinely impressive", "Shimano-compatible cable pull"],
                                    cons: ["Shift lever feel is noticeably stiffer than competitors", "10-speed cassette has larger gear steps", "Less widely serviced globally"],
                                    verdict: "Best absolute value. If budget is the #1 constraint, Advent X delivers a working, complete 1x drivetrain at a price no major brand can match.",
                                },
                            ].map(({ name, price, type, speeds, range, pros, cons, verdict, highlight }) => (
                                <div key={name} className={`bg-white/5 p-6 rounded-xl border ${highlight ? "border-cyan-500/30" : "border-white/10"}`}>
                                    <div className="flex gap-4 items-baseline mb-3 flex-wrap">
                                        <h3 className={`font-bold text-lg ${highlight ? "text-cyan-400" : "text-white"}`}>{name}</h3>
                                        <span className="text-gray-400 text-sm">{type}</span>
                                        <span className="text-gray-400 text-sm">{speeds} • {range}</span>
                                        <span className={`ml-auto font-bold ${highlight ? "text-cyan-400" : "text-white"}`}>{price}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-green-400 font-bold text-xs mb-1 uppercase">Pros</p>
                                            <ul className="list-disc pl-4 space-y-1 text-gray-300">{pros.map(p => <li key={p}>{p}</li>)}</ul>
                                        </div>
                                        <div>
                                            <p className="text-red-400 font-bold text-xs mb-1 uppercase">Cons</p>
                                            <ul className="list-disc pl-4 space-y-1 text-gray-300">{cons.map(c => <li key={c}>{c}</li>)}</ul>
                                        </div>
                                    </div>
                                    <p className="text-cyan-200 text-sm font-medium bg-cyan-900/20 p-3 rounded-lg">{verdict}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Bottom Line</h2>
                        <p>Budget doesn&apos;t mean bad. MicroShift Advent X at $300 will get you up any trail that GRX Di2 at $1,500 will — just with a little more lever effort. SRAM Apex XPLR AXS brings genuine electronic shifting to the budget tier. For most recreational riders, the performance gap between a $400 groupset and a $1,500 groupset is far smaller than the price difference suggests.</p>
                        <p className="mt-4">Build your budget groupset into CrankSmith and validate it against your frame, cassette range requirements, and drivetrain before purchasing.</p>
                    </div>

                    <BlogCTA heading="See What Fits Your Budget in the Builder" sub="Enter your budget groupset components to validate compatibility and compare gear range against premium alternatives." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
