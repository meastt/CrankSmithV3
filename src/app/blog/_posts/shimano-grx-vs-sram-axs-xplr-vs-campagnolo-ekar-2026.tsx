import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Shimano GRX vs SRAM AXS XPLR vs Campagnolo Ekar — 2026 Gravel Groupset Comparison",
    description: "Spec table, weight comparison, gear range, price breakdown, and key differences between the three major gravel groupsets in 2026. Plus budget alternatives that actually work.",
    date: "2026-04-20",
    category: "Drivetrain",
    keywords: ["best gravel groupset 2026", "gravel drivetrain comparison", "Shimano GRX vs SRAM AXS", "Campagnolo Ekar review", "gravel groupset guide"],
    image: "/images/shimano-grx-sram-axs-campagnolo-ekar-comparison-2026.webp",
    excerpt: "Three groupsets. One table. Who wins on weight, range, price, and reliability — and which budget options are worth looking at."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is the best gravel groupset in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "For most gravel riders, SRAM Rival XPLR AXS offers the best balance of weight, wireless convenience, and price (~$700-900 complete). Shimano GRX 820 is the better choice for riders who prefer wired shifting, Shimano ergonomics, or need maximum reliability in extended remote use. Campagnolo Ekar 13-speed suits riders who want the finest mechanical shifting and tightest gear steps." } },
        { "@type": "Question", "name": "Is SRAM AXS worth the price premium over Shimano GRX?", "acceptedAnswer": { "@type": "Answer", "text": "For wireless shifting alone, yes — if you value the convenience of trimless, cable-free shifting. SRAM AXS also offers better app customization (shift points, battery monitoring) and a more tightly integrated ecosystem (power meters, dropper posts, all via AXS protocol). If you ride primarily dry trails and don't care about wireless, GRX 820 mechanical is significantly cheaper with comparable performance." } },
        { "@type": "Question", "name": "How many speeds is Campagnolo Ekar?", "acceptedAnswer": { "@type": "Answer", "text": "Campagnolo Ekar is a 13-speed mechanical groupset — the only 13-speed offering in gravel. With a 9-42t cassette and 38t chainring option, it delivers exceptional gear range for a mechanical system. The extra cog allows smaller steps between gears than comparable 12-speed systems, which is particularly beneficial for cadence-conscious riders." } },
        { "@type": "Question", "name": "Does Shimano GRX work with SRAM components?", "acceptedAnswer": { "@type": "Answer", "text": "No — Shimano and SRAM are not cross-compatible at the groupset level. GRX shifters only work with GRX/Shimano derailleurs and vice versa. Campagnolo Ekar is equally proprietary. Mixing components requires workarounds (such as Wolf Tooth Tanpan or Jtek ShiftMate adapters) that have limitations." } },
        { "@type": "Question", "name": "What gravel groupset works best with flat mount brakes?", "acceptedAnswer": { "@type": "Answer", "text": "All three major gravel groupsets — SRAM AXS XPLR, Shimano GRX, and Campagnolo Ekar — use flat mount hydraulic disc brakes as standard. They are all compatible with flat mount frames. The brake caliper quality varies: SRAM's Level and Force brakes tend to have better initial bite, while Shimano's GRX brakes are widely praised for modulation and consistent feel." } }
    ]
};

export default function PostGroupsetComparison2026({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 20, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Shimano GRX vs SRAM AXS XPLR vs Campagnolo Ekar — 2026</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Three groupsets. One table. Weight, range, price, and the questions nobody asks — answered with real specs.</p>
                    </div>

                    <FeaturedImage
                        src="/images/shimano-grx-sram-axs-campagnolo-ekar-comparison-2026.webp"
                        alt="Shimano GRX, SRAM AXS XPLR, and Campagnolo Ekar gravel groupset derailleurs compared side by side — CrankSmith drivetrain guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Want full depth on how these systems work? See the <Link href="/guides/gravel-groupsets-explained" className="text-cyan-400 hover:underline">CrankSmith Gravel Groupsets Explained Guide</Link>. This post is the quick comparison.</em></p>

                        <p className="lead text-xl text-stone-200">
                            Three companies make groupsets designed specifically for gravel. They have different philosophies — wireless vs mechanical, 12 vs 13 speed, Japanese precision vs Italian romance — and very different price points. Here&apos;s the honest comparison without the brand loyalty.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Spec Table</h2>

                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Spec</th>
                                        <th className="text-left p-3 text-cyan-400">GRX 820</th>
                                        <th className="text-left p-3 text-green-400">Force XPLR AXS</th>
                                        <th className="text-left p-3 text-amber-400">Ekar 13s</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Speed", "12", "12", "13"],
                                        ["Shifting type", "Mechanical (Di2 option)", "Wireless electronic", "Mechanical"],
                                        ["Cassette range", "10-45t (Di2: 10-51t)", "10-44t (Eagle: 10-52t)", "9-42t"],
                                        ["Chainring options", "40t, 42t, 46/30t", "40t, 43t, 46/33t", "38t, 40t"],
                                        ["Groupset weight*", "~2,700g", "~2,550g (no cables)", "~2,800g"],
                                        ["Price (complete)**", "$600–$1,400", "$900–$2,400", "$850–$1,200"],
                                        ["Battery life", "N/A (mechanical)", "~60h shifting", "N/A (mechanical)"],
                                        ["Brake type", "Hydraulic disc", "Hydraulic disc", "Hydraulic disc"],
                                        ["Brake mount", "Flat mount", "Flat mount", "Flat mount"],
                                        ["UDH compatible", "No", "Yes (Transmission)", "No"],
                                    ].map(([spec, grx, sram, ekar]) => (
                                        <tr key={spec} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 text-gray-400 font-medium">{spec}</td>
                                            <td className="p-3 text-cyan-200">{grx}</td>
                                            <td className="p-3 text-green-200">{sram}</td>
                                            <td className="p-3 text-amber-200">{ekar}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-2">*Approximate. **Complete groupset: derailleurs, shifters, cassette, chain, brakes, crankset.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Key Differences</h2>

                        <div className="my-6 space-y-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-cyan-500/20">
                                <h3 className="text-cyan-400 font-bold mb-2">Shimano GRX 820 — The Reliable Workhorse</h3>
                                <p className="text-sm text-gray-300">GRX remains the most widely deployed gravel groupset on the market, and for good reason. The ergonomics are excellent, the hydraulic brakes have outstanding modulation, and the mechanical version is repairable anywhere in the world with a cable and barrel adjuster. The 12-speed range covers most terrain. Di2 electronic option adds wireless shifting at a significant cost premium. <strong>Best for:</strong> All-weather riding, international bikepacking, riders who prioritize brake feel and repairability.</p>
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-green-500/20">
                                <h3 className="text-green-400 font-bold mb-2">SRAM Force/Rival XPLR AXS — The Tech Stack</h3>
                                <p className="text-sm text-gray-300">SRAM went all-in on wireless. AXS eliminates cables entirely — no cable stretch, no housing routing, just a Bluetooth module and a coin cell battery. The ecosystem is tight: dropper posts, power meters, and shifting all talk to the same app. The XPLR Eagle cassette (optional) extends to 10-52t for massive range. Rival XPLR AXS is the value version, ~$400 cheaper than Force with negligible performance difference. <strong>Best for:</strong> Tech-forward riders, those who prioritize shifting convenience and ecosystem integration.</p>
                            </div>

                            <div className="bg-white/5 p-5 rounded-xl border border-amber-500/20">
                                <h3 className="text-amber-400 font-bold mb-2">Campagnolo Ekar 13-Speed — The Niche Choice</h3>
                                <p className="text-sm text-gray-300">Ekar&apos;s 13-speed cassette gives the tightest gear steps of any gravel groupset — important for riders who hate the cadence jumps that come with wide-range 12-speed setups. The 9-42t cassette is relatively compact, which suits fast terrain better than sustained climbing. The mechanics are superb. The catch: if something breaks in the backcountry, you need Campagnolo-specific parts. <strong>Best for:</strong> Road-oriented gravel riders, those who prioritize gear step feel over maximum range.</p>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Budget Options That Don&apos;t Suck</h2>
                        <p>If the prices above made you wince, these alternatives deliver real gravel performance at much lower cost:</p>

                        <ul className="list-disc pl-5 space-y-3 mt-4">
                            <li><strong>SRAM Apex XPLR AXS (~$650-800)</strong> — Entry wireless 1x. Same AXS protocol, slightly heavier components. The best bang-for-buck electronic gravel groupset in 2026.</li>
                            <li><strong>Shimano GRX 610 (~$500-650)</strong> — 11-speed, mechanical, proven reliability. Not as wide-ranging as 12-speed but completely capable for most riding.</li>
                            <li><strong>Shimano CUES U6000 (~$350-450)</strong> — LinkGlide technology extends chain life 3× over standard 12-speed. Ideal for high-mileage commuter-gravel riders.</li>
                            <li><strong>MicroShift Advent X (~$250-350)</strong> — 10-speed with 11-48t cassette and real clutch derailleur. Genuinely good performance at an absurdly low price point.</li>
                        </ul>

                        <p className="mt-6">For a deeper look at how these drivetrain systems work under the hood — gear ratios, compatibility matrices, electronic protocol differences — see the <Link href="/guides/gravel-groupsets-explained" className="text-cyan-400 hover:underline">full Gravel Groupsets Explained guide</Link>.</p>
                    </div>

                    <BlogCTA heading="Build Around Any Groupset" sub="Enter your frame, groupset, and tire choice to validate compatibility and check your full gear range." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
