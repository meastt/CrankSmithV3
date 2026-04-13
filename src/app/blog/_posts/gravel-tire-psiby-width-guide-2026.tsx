import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25\")",
    description: "Optimal PSI for 40mm, 45mm, 50mm, 55mm, 2.1, and 2.25 inch gravel tires. Rider weight and terrain charts. Hookless rim limits.",
    date: "2026-04-16",
    category: "Big Tires",
    keywords: ["gravel tire pressure guide", "gravel tire psi", "hookless max pressure", "gravel tire pressure by width"],
    image: "/images/gravel-tire-pressure-psiby-width-2026.webp",
    excerpt: "Optimal PSI for every width at different rider weights and terrain. Hookless rim max pressure limits. Tubeless minimums to prevent burping."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What PSI should I run in 45mm gravel tires?",
            acceptedAnswer: { "@type": "Answer", text: "For a 150-lb rider on 45mm tires: 30-32 PSI for hard-pack, 26-28 PSI for loose gravel, 24-26 PSI for mud. Add 2 PSI per 20 lbs of rider weight above 150 lbs." }
        },
        {
            "@type": "Question",
            name: "What is the maximum PSI for hookless gravel wheels?",
            acceptedAnswer: { "@type": "Answer", text: "ETRTO 2024 standards set the maximum at 72.5 PSI (5 bar) for 25mm internal width hookless rims, and 60 PSI for 30mm+ internal width. Most gravel riders run 25-40 PSI, well within limits." }
        },
        {
            "@type": "Question",
            name: "How does tire width affect optimal pressure?",
            acceptedAnswer: { "@type": "Answer", text: "Each 5mm of additional width lets you drop roughly 2-3 PSI for the same casing deflection. A 50mm tire runs about 6-8 PSI lower than a 40mm tire with the same rider." }
        },
        {
            "@type": "Question",
            name: "Does rider weight affect gravel tire pressure?",
            acceptedAnswer: { "@type": "Answer", text: "Yes. Every 20 lbs of rider weight above or below 150 lbs adjusts your optimal pressure by approximately 2 PSI. A 180-lb rider on 45mm tires runs about 4 PSI more than a 140-lb rider." }
        },
        {
            "@type": "Question",
            name: "Should I run the same pressure front and rear?",
            acceptedAnswer: { "@type": "Answer", text: "No. The rear tire carries roughly 60% of total weight. Run the rear 2-4 PSI higher than the front. Example: 26 PSI front, 29 PSI rear for a 160-lb rider on 50mm tires on mixed terrain." }
        }
    ]
};

export default function PostTirePressureByWidth({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                        Big Tires
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25 inch)
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 16, 2026 &middot; 10 min read</p>

                    <FeaturedImage
                        src="/images/gravel-tire-pressure-psiby-width-2026.webp"
                        alt="Technical pressure reference chart showing 6 gravel tire widths from 40mm to 57mm with PSI recommendations, ETRTO hookless limits, dark background data visualization"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Run the wrong PSI in your gravel tires and no component upgrade will save you.</strong> Run the right PSI and a budget setup beats an overpriced one every time. Tire pressure is the single most impactful adjustment on any gravel bike — and most riders are running it 5-10 PSI wrong.</p>

                        <p>Here is why that happens: every pressure guide online stops at 45mm. Nobody is talking about 50mm, 55mm, or 2.25-inch tires. But if you are running those widths — and an increasing number of gravel riders are — those 45mm charts actively mislead you.</p>

                        <h2 className="text-white mt-12 mb-6">The PSI Table (All Widths, All Rider Weights)</h2>

                        <p>Here is the data you actually need, based on mixed terrain (loose-to-hard-pack gravel, some pavement, a few technical climbs):</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6 overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-2 text-cyan-400 font-semibold">Tire Width</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">140 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">160 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">180 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">200 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">220 lbs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">40mm</td>
                                        <td className="text-center">26 F / 28 R</td>
                                        <td className="text-center">28 F / 30 R</td>
                                        <td className="text-center">30 F / 32 R</td>
                                        <td className="text-center">32 F / 34 R</td>
                                        <td className="text-center">34 F / 36 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">45mm</td>
                                        <td className="text-center">22 F / 24 R</td>
                                        <td className="text-center">24 F / 26 R</td>
                                        <td className="text-center">26 F / 28 R</td>
                                        <td className="text-center">28 F / 30 R</td>
                                        <td className="text-center">30 F / 32 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">50mm</td>
                                        <td className="text-center">18 F / 20 R</td>
                                        <td className="text-center">20 F / 22 R</td>
                                        <td className="text-center">22 F / 24 R</td>
                                        <td className="text-center">24 F / 26 R</td>
                                        <td className="text-center">26 F / 28 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">55mm (2.0&quot;)</td>
                                        <td className="text-center">15 F / 17 R</td>
                                        <td className="text-center">17 F / 19 R</td>
                                        <td className="text-center">19 F / 21 R</td>
                                        <td className="text-center">21 F / 23 R</td>
                                        <td className="text-center">23 F / 25 R</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5">57mm (2.25&quot;)</td>
                                        <td className="text-center">14 F / 16 R</td>
                                        <td className="text-center">16 F / 18 R</td>
                                        <td className="text-center">18 F / 20 R</td>
                                        <td className="text-center">20 F / 22 R</td>
                                        <td className="text-center">22 F / 24 R</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-3">F = Front, R = Rear. Values for standard hooked rims. Hookless: see max PSI section below.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">How to Read This Table</h2>

                        <p><strong>This is your starting point.</strong> If you are a 170-lb rider on 45mm tires: interpolate between 160 and 180, so roughly 25 F / 27 R. If you are a 210-lb rider on 50mm tires: interpolate to about 25 F / 27 R.</p>

                        <p>The F/R split exists because your rear tire carries roughly 60% of total weight (rider + bike), so it needs higher pressure to maintain the same casing deflection as the front. Run the same PSI on both and your rear will blow through the casing faster and be more prone to pinch flats.</p>

                        <p>For a quick starting point, the <Link href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI tire pressure calculator</Link> is built on the same rider-weight-plus-tire-width formula. Even though it is designed for e-bikes, the core physics is the same — just enter your combined rider weight and tire size.</p>

                        <h2 className="text-white mt-12 mb-6">The Hookless Pressure Ceiling</h2>

                        <p>If you are running hookless rims (and most new gravel wheels are), you cannot run arbitrary pressure. ETRTO 2024 standards set the absolute maximum at:</p>

                        <ul className="space-y-1">
                            <li><strong>72.5 PSI (5 bar)</strong> for 25mm internal width hookless rims</li>
                            <li><strong>Below 60 PSI</strong> for 30mm+ internal width hookless rims</li>
                        </ul>

                        <p>In practice, most riders on 45mm+ tires will never hit these ceilings. The danger zone is with narrow gravel tires (35-40mm) on aggressive hookless rims where riders try to run road-level pressures. At those widths, stick to hooked rims if you want 55+ PSI.</p>

                        <p>For the full breakdown of hookless vs hooked safety, rim brands, and which tires are hookless-approved, read our <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">hookless vs hooked safety guide</Link>.</p>

                        <h2 className="text-white mt-12 mb-6">Terrain Adjustments</h2>

                        <p>Once you have your baseline PSI from the table, adjust based on conditions:</p>

                        <ul className="space-y-1">
                            <li><strong>Smooth hard-pack / pavement:</strong> Add 2-3 PSI (faster rolling, more responsive).</li>
                            <li><strong>Loose gravel / washboard:</strong> Subtract 2-3 PSI (more grip, more compliance).</li>
                            <li><strong>Mud / wet:</strong> Subtract 2 PSI (better traction in corners, more contact patch).</li>
                            <li><strong>Rocky technical trails:</strong> Subtract 1-2 PSI but watch minimum pressures to avoid pinch flats on sharp impacts.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">The 2.25 inch Gravel Tire — Yes, Really</h2>

                        <p>As shown in the table, 57mm (2.25 inch) tires at 160 lbs rider weight run ~16 F / 18 R. That is mountain bike territory. And it works brilliantly for gravel riders who want absurd levels of grip and comfort on technical trails.</p>

                        <p>The catch: you need a frame that clears 57mm tires. Not all gravel frames do. Check our <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">complete list of 2026 gravel frames that officially fit 2.25 inch tires</Link>.</p>

                        <p>Also note: going from 45mm to 57mm changes your effective gear ratio by about 6% — that is equivalent to going from a 40t to a 42t chainring. <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">Read our tire width gearing guide</Link> to see exactly how it affects your setup.</p>

                        <h2 className="text-white mt-12 mb-6">How to Dial It In</h2>
                        <ol className="space-y-2 list-decimal pl-5">
                            <li>Squirt your tires to the table baseline</li>
                            <li>Ride your typical routes and note: do you feel the bike squirming? Go up 2 PSI. Does it feel harsh or bouncy? Drop 2 PSI.</li>
                            <li>Refine over 3-4 rides. Your sweet spot will be within +/- 2 PSI of the table.</li>
                        </ol>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-sky-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> The table above gets you within 3 PSI of optimal. Ride it in from there. And if your tires feel wrong, pressure is the first thing to check — before new tires, before new wheels, before any component change.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Dial In Your Bike Build" sub="Enter your tire width, weight, and riding style. We will find compatible components and flag any mismatches." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
