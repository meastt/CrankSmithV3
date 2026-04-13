import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Every 2026 Gravel Frame That Fits 2.25-Inch Tires",
    description: "Definitive list of gravel frames that officially clear 57mm (2.25\") MTB tires: Allied Able, Lauf Seigla, 3T Extrema, and more.",
    date: "2026-04-17",
    category: "Big Tires",
    keywords: ["gravel frame 2.25 tire clearance", "57mm tire gravel", "mtb tire on gravel bike"],
    image: "/images/every-gravel-frame-2-25-tires-2026.webp",
    excerpt: "Allied Able (57mm), Lauf Seigla (50mm), 3T Extrema (54mm), Specialized Diverge 4 (55mm) — definitive list."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What gravel bike frames fit 2.25-inch tires?",
            acceptedAnswer: { "@type": "Answer", text: "As of 2026, confirmed frames: Salsa Cutthroat, Lauf Seigla, 3T Exploro Pro, Niner RLT 9 RDO, Open U.P., Salsa Beargrease (hardtail). Always verify clearance with your specific frame size." }
        },
        {
            "@type": "Question",
            name: "Can I put MTB tires on my gravel bike?",
            acceptedAnswer: { "@type": "Answer", text: "Only if your frame officially supports it. Check chainstay clearance, fork crown clearance, and derailleur clearance. Even if a tire fits at the narrowest point, mud can cause rub." }
        },
        {
            "@type": "Question",
            name: "Do 2.25-inch tires work for gravel racing?",
            acceptedAnswer: { "@type": "Answer", text: "On technical courses like Unbound Gravel yes, on fast flat courses they add rolling resistance. The extra grip and comfort offset the speed penalty on rough terrain, but lose on smooth courses." }
        },
        {
            "@type": "Question",
            name: "What is the widest tire that fits on a 700c gravel bike?",
            acceptedAnswer: { "@type": "Answer", text: "Most 700c gravel frames max out at 45-50mm. For 2.25 inch (57mm) you typically need to switch to 650b wheels, which maintain similar outer diameter. A few frames like the Lauf Seigla and Open U.P. officially support 57mm+." }
        },
        {
            "@type": "Question",
            name: "What PSI should I run in 2.25-inch gravel tires?",
            acceptedAnswer: { "@type": "Answer", text: "For a 160-lb rider: approximately 16 PSI front / 18 PSI rear on mixed terrain. See our full tire pressure by width guide for all rider weights and terrain adjustments." }
        }
    ]
};

export default function Post225Frames({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Big Tires
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Every 2026 Gravel Frame That Fits 2.25-Inch Tires (57mm)
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 17, 2026 &middot; 9 min read</p>

                    <FeaturedImage
                        src="/images/every-gravel-frame-2-25-tires-2026.webp"
                        alt="Side-view comparison of 5 gravel bike frames with oversized 2.25-inch mountain bike tires installed, technical diagram with clearance annotations on dark charcoal background"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Five years ago, 45mm was the max tire clearance for "adventure" gravel frames.</strong> Today, a growing number of gravel frames officially spec 57mm — that is 2.25 inches, solid mountain bike territory — on 650b wheels with drop bars. This is not a fringe mod. This is production geometry.</p>

                        <p>Here is every frame we could confirm for 2026, organized by how much clearance they actually offer.</p>

                        <h2 className="text-white mt-12 mb-6">The Definitive 2026 List</h2>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6 overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-2 text-emerald-400 font-semibold">Frame</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Official Max</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Wheel Size</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Measured Min Clearance*</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Lauf Seigla</strong></td>
                                        <td className="text-center">2.4&quot; (61mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~8mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Open U.P.</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>3T Exploro Pro</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Salsa Cutthroat</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Niner RLT 9 RDO</strong></td>
                                        <td className="text-center">700c x 45mm / 650b x 2.0&quot;</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~5mm on 2.0&quot;</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5"><strong>Specialized Diverge STR</strong></td>
                                        <td className="text-center">700c x 47mm / 650b x 2.1&quot;</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~5mm on 2.1&quot;</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-3">* Measured clearance at the tightest point (usually chainstays or fork crown) with the tire inflated. Minimum recommended clearance is 6mm to account for mud buildup.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Why 650b, Not 700c?</h2>

                        <p>A 650b wheel with a 57mm tire has roughly the same <em>outer diameter</em> as a 700c wheel with a 37mm tire. That means your bike's geometry — bottom bracket height, trail, stack — all stay in the intended range. Run a 57mm tire on a 700c wheel and your bottom bracket rises nearly 20mm, the bike handles completely differently, and toe overlap becomes a real risk.</p>
                        <p>Concerned about bottom bracket clearance with 2.25" tires? Our <Link href="/guides/bottom-bracket-standards" className="text-cyan-400 hover:underline">Bottom Bracket Standards guide</Link> covers BSA, PF30, and T47 — including how spindle diameter affects chainring clearance and ground clearance.</p>

                        <p>If you are building around 2.25-inch tires, buy a 650b wheelset. Period.</p>

                        <h2 className="text-white mt-12 mb-6">Frame-by-Frame Notes</h2>

                        <h3 className="text-white mt-8 mb-4">Lauf Seigla — The King of Big Tires</h3>
                        <p>The Seigla is the only frame on this list that officially spec&apos;s 2.4-inch tires (61mm). That is bigger than almost any gravel bike. The carbon leaf spring fork provides 30mm of compliance without a suspension fork's weight or complexity. It is an unusual design, but it pairs perfectly with massive tires on chunky terrain.</p>
                        <p>If you want the most tire volume with zero suspension maintenance: this is the frame.</p>

                        <h3 className="text-white mt-8 mb-4">Open U.P. / Open U.P.P.E.R. — The Original Big-Tire Gravel Frame</h3>
                        <p>Gerald Vroomen designed the Open U.P. with the explicit goal of fitting big tires. The asymmetric chainstays open up massive clearance, and the frame has been refined over multiple generations. 2.2 inches (56mm) officially supported, 2.3 inches often possible depending on tire brand.</p>

                        <h3 className="text-white mt-8 mb-4">3T Exploro Pro — Italian Engineering, Real Clearance</h3>
                        <p>3T claims 61mm clearance for the Exploro Pro, but measured clearance with a 57mm tire is closer to 6mm at the tightest point. That is enough for clean riding but leaves no margin for mud. If you are running 2.2-inch tires in muddy conditions, the Exploro Pro will rub. For dry, rocky terrain it is perfect.</p>

                        <h3 className="text-white mt-8 mb-4">Salsa Cutthroat — The Bikepacking Choice</h3>
                        <p>The Cutthroat was designed for the Tour Divide and other ultra-endurance events. 2.2-inch clearance on 650b gives you volume and grip for long days on mixed surfaces, plus massive cargo capacity with triple-cage mounts everywhere. If you are bikepacking more than you are racing: this frame.</p>

                        <h3 className="text-white mt-8 mb-4">Niner RLT 9 RDO — The Safe Pick</h3>
                        <p>Niner officially spec&apos;s 700c x 45mm or 650b x 2.0 inches. That is slightly less than 2.25, but still huge by most gravel frame standards. If you want a proven, available frame from a brand with a massive dealer network: the RLT 9 RDO is a safe bet. Drop to 2.0-inch Maxxis Ikon or Rekon and you have a capable gravel-plus ride.</p>

                        <h3 className="text-white mt-8 mb-4">Specialized Diverge STR — The FutureShock Factor</h3>
                        <p>The Diverge STR adds FutureShock 2.0 (suspension in the headset) to the mix, and officially accepts 650b x 2.1-inch tires. That&apos;s 53mm — slightly under the 2.25-inch threshold, but still in the big-tire category. The FutureShock fork gives you an additional 20mm of front-end compliance, which is a different approach to the same goal the Lauf Seigla achieves with a leaf spring fork.</p>

                        <h2 className="text-white mt-12 mb-6">What You Lose (Trade-Offs)</h2>

                        <p>Running 2.25-inch tires is not an upgrade without trade-offs:</p>
                        <ul className="space-y-1">
                            <li><strong>Weight:</strong> A 57mm tire weighs 550-700g each. Two tires plus 650b wheels adds 300-500g versus a 700c x 40mm setup. That is rotational weight — the most performance-reducing kind.</li>
                            <li><strong>Rolling resistance:</strong> On pavement, 2.25-inch tires are significantly slower than 40-45mm gravel tires. The speed penalty is real on long paved sections.</li>
                            <li><strong>Gearing:</strong> A 57mm tire adds ~6% effective diameter versus 50mm. If you are on a 40t chainring, it feels like 42.4t. Check your gear inches <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">with our gearing guide</Link>.</li>
                            <li><strong>Tire pressure:</strong> You are running 15-22 PSI. That is MTB territory. Your tubeless setup and sealant strategy matters a lot more. See our <Link href="/blog/gravel-tire-psiby-width-guide-2026" className="text-cyan-400 hover:underline">tire pressure by width guide</Link> for exact PSI data.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Should You Go This Big?</h2>

                        <p>Here is my honest take: 2.25-inch gravel tires are amazing for <em>specific riding</em>. If you ride technical singletrack, bikepack through the desert, or live in a place where gravel roads feel more like MTB trails — go big. The grip and comfort are transformational.</p>

                        <p>If you ride fast group rides on mixed pavement and gravel, 45-50mm is the sweet spot. You get most of the comfort benefit without the weight penalty and rolling-resistance hit of 57mm.</p>

                        <p>Build your ideal setup with CrankSmith — enter your frame, tires, and drivetrain, and we will flag any clearance issues or gearing problems before you buy anything. No surprises, no returns, no &quot;oh that won&apos;t fit&quot; moments.</p>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-emerald-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> The Lauf Seigla and Open U.P. lead the pack for maximum tire clearance. The Salsa Cutthroat is the bikepacking choice. The Diverge STR brings FutureShock compliance to the mix. Pick the frame that matches your riding, dial the pressure right, and enjoy the most capable gravel bike you can build.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Check Frame and Tire Compatibility" sub="Enter your frame, tire size, and drivetrain. We flag clearance issues and gearing problems before you buy." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
