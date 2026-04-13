import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Unbound Gravel 2026: The Ultimate Tire & Gear Setup Guide",
    description: "Tire and gearing strategies for Unbound Gravel 2026 in Emporia, Kansas. What pros run vs what works.",
    date: "2026-04-15",
    category: "Racing",
    keywords: ["unbound gravel 2026", "unbound tire setup", "unbound gearing", "emporia gravel"],
    image: "/images/blog-unbound-2026.webp",
    excerpt: "World's most iconic gravel race. May 28-31, Emporia KS. What pros ran vs what works for the rest of us."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What tire size should I run at Unbound Gravel 2026?",
            acceptedAnswer: { "@type": "Answer", text: "Most competitors run 45-50mm tires. 45mm is the sweet spot -- enough volume for ruts and rocks while maintaining rolling speed on paved and hard-pack transitions. Racers on the XL (200 miles) sometimes go up to 50mm for comfort." }
        },
        {
            "@type": "Question",
            name: "What gearing is recommended for Unbound Gravel?",
            acceptedAnswer: { "@type": "Answer", text: "Popular setups: 40t chainring with 10-44t or 10-52t cassette for XL riders. The steepest climbs in the Flint Hills hit 15-18% on loose gravel, so a low gear under 21 gear inches is essential." }
        },
        {
            "@type": "Question",
            name: "Is hookless OK for Unbound Gravel?",
            acceptedAnswer: { "@type": "Answer", text: "Hookless wheels are fine for Unbound if your tire is hookless-approved. ETRTO 2024-2025 standards require running no more than 72.5 PSI on 25mm internal width hookless rims. Most Unbound riders run 25-35 PSI in 45-50mm tires, well within limits." }
        },
        {
            "@type": "Question",
            name: "What tires do Unbound Gravel winners use?",
            acceptedAnswer: { "@type": "Answer", text: "Recent Unbound finishers have used: WTB Riddler 45c (most popular), Specialized Pathfinder Pro 42mm, Pirelli Cinturato Gravel M 45mm, and Schwalbe G-One RS 45mm." }
        },
        {
            "@type": "Question",
            name: "Should I use a dropper post for Unbound Gravel?",
            acceptedAnswer: { "@type": "Answer", text: "A growing number of Unbound competitors run dropper posts (30.9mm, approximately 100mm travel). The 15% loose-gravel descents become much more manageable at speed with a dropper." }
        }
    ]
};

export default function PostUnbound2026({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                        Racing
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Unbound Gravel 2026: The Ultimate Tire and Gear Setup Guide
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 15, 2026 -- 11 min read</p>

                    <FeaturedImage
                        src="/images/unbound-gravel-2026-setup-flint-hills.webp"
                        alt="Cyclist racing through the Flint Hills gravel roads of Kansas during Unbound Gravel event, golden hour amber sky, dust trail, adventure cycling photography"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Unbound Gravel is the defining event of the gravel racing calendar.</strong> 200 miles. Over 20,000 feet of climbing. The Flint Hills of Kansas with their relentless rolling terrain, loose limestone gravel, and brutal exposure to sun and wind.</p>

                        <p>Whether you are racing the XL or just trying to finish the MID, your tire and gearing choices will make or break your day.</p>

                        <h2 className="text-white mt-12 mb-6">The Terrain Dictates the Setup</h2>

                        <p>Unbound is unique. It is not alpine climbing, and it is not flat desert gravel. The Flint Hills roll in waves: 3-8% grinds climbing out of drainage crossings, punctuated by brief punchy sections at 12-18% that catch you in the granny gear.</p>

                        <p>That combination means you need:</p>
                        <ul className="space-y-1">
                            <li><strong>Tire width:</strong> Enough volume for hours of chunky gravel (45-50mm)</li>
                            <li><strong>Low gear:</strong> Under 21 gear inches for 15% loose-gravel climbs</li>
                            <li><strong>High gear:</strong> Enough top end for paved sections and fast descents</li>
                            <li><strong>Reliability:</strong> Hookless-approved tires with puncture protection</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">What the Pros Run (2024-2025 Setups)</h2>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6">
                            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Pro-Level Unbound Setups:</p>
                            <div className="space-y-4 text-sm text-gray-300">
                                <div>
                                    <p className="text-white font-semibold">Ted King (2025):</p>
                                    <p>WTB Riddler 45c TCS Light -- SRAM Red AXS 1x -- 42t / 10-44t -- ENVE G23 hookless -- 35 PSI front / 38 PSI rear</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Laurens ten Dam:</p>
                                    <p>Specialized Pathfinder Pro 42mm -- 2x GRX 810 (46/30t) -- 11-40t cassette -- Roval Terra C -- 32 PSI</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Top 10% Amateur (2025 XL):</p>
                                    <p>Pirelli Cinturato Gravel M 45mm -- Rival AXS 1x -- 40t / 10-52t -- DT Swiss G1800 -- Dropper post -- 30 PSI w/ Stan&apos;s NoTubes</p>
                                </div>
                            </div>
                        </div>

                        <p>Notice the pattern? <strong>45mm is the dominant tire width</strong>, 40-42t chainrings are standard, and 1x drivetrains have largely replaced 2x even among top finishers.</p>

                        <h2 className="text-white mt-12 mb-6">The Everyday Rider Setup (What You Should Actually Run)</h2>

                        <p>Most people doing Unbound are not chasing podiums -- they want to finish. Here is the recommended setup for first-time XL riders:</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30 my-6">
                            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider text-cyan-400">Recommended First-Time Unbound XL Setup:</p>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p><strong>Tire:</strong> WTB Riddler 45c TCS Light or Schwalbe G-One RS 45mm</p>
                                <p><strong>Drivetrain:</strong> SRAM Rival AXS 1x -- 40t / 10-52t (20.6 gear inches lowest)</p>
                                <p><strong>Wheels:</strong> Hookless-approved, 25-30mm internal width</p>
                                <p><strong>Pressure:</strong> 28-32 PSI (rider weight + 140-160 lbs range)</p>
                                <p><strong>Sealant:</strong> Stan&apos;s NoTubes or Orange Seal (60ml per tire)</p>
                                <p><strong>Extras:</strong> Dropper post (optional), chain checker, master link, CO2 kit</p>
                            </div>
                        </div>

                        <p>The <strong>40t/52t combo</strong> gives you a 20.6 gear-inch lowest gear with 45mm tires. If you are under 140 lbs and struggle on steep climbs, consider a 38t chainring.</p>

                        <h2 className="text-white mt-12 mb-6">Tire Pressure Strategy for Unbound</h2>

                        <p>Key factors: <strong>rider weight</strong>, <strong>tire width</strong>, <strong>hookless vs hooked</strong>, and <strong>course conditions</strong>. For a 160-lb rider on 45mm tires:</p>

                        <ul className="space-y-1">
                            <li><strong>Dry/fast:</strong> 30 PSI front / 32 PSI rear</li>
                            <li><strong>Wet/muddy:</strong> 26 PSI front / 28 PSI rear (more grip)</li>
                            <li><strong>Hookless rims:</strong> Stay under 50 PSI per ETRTO standards</li>
                        </ul>

                        <p>Too high wastes watts on chunky gravel. Too low risks pinch flats on sharp limestone. Sweet spot: 28-32 PSI tubeless with quality sealant.</p>

                        <p>Need your exact PSI? <Link href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">The eBikePSI calculator</Link> works for any bike -- enter rider weight + bike weight + tire width for a data-driven starting point.</p>

                        <h2 className="text-white mt-12 mb-6">Hookless at Unbound: Are You OK?</h2>

                        <p>Yes, as long as your tire is hookless-approved. The popular Unbound choices (WTB Riddler TCS, Pirelli Cinturato, Schwalbe G-One RS) are all hookless-safe.</p>

                        <p>The real risk is <strong>rock strikes causing bead separation</strong> on sharp limestone at speed. Set pressure high enough to avoid bottoming out, use 60ml+ sealant, and carry a spare tube and tire boot as backup.</p>

                        <p>We wrote a detailed breakdown of <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">hookless vs hooked safety standards</Link> for the full ETRTO limits and compatibility details.</p>

                        <h2 className="text-white mt-12 mb-6">Weather Scenarios</h2>

                        <h3 className="text-white mt-8 mb-4">Dry and Hot (90% of Editions)</h3>
                        <p>Hydration is your enemy, not gear. Run 45mm fast-rolling tread. 30 PSI. Fresh sealant.</p>

                        <h3 className="text-white mt-8 mb-4">Wet and Muddy (2019 Edition)</h3>
                        <p>Switch to 50mm tires with aggressive tread (WTB Nano 650b). Lower to 24-26 PSI for grip on slick limestone.</p>

                        <h3 className="text-white mt-8 mb-4">Wind (Always)</h3>
                        <p>The exposed Flint Hills have no tree cover for 100+ miles. Bring more water than you think and use the aero benefit of a well-positioned body on hard-pack.</p>

                        <h2 className="text-white mt-12 mb-6">What NOT to Do</h2>
                        <ul className="space-y-2">
                            <li><strong>Do not</strong> run an untested tire -- if it has not survived 10+ hours with sealant, do not gamble</li>
                            <li><strong>Do not</strong> use road gearing (50/34t) -- the climbs will punish you</li>
                            <li><strong>Do not</strong> skip the tubeless check -- a leaking valve or cracked rim tape will DNF you at mile 30</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Bottom Line</h2>
                        <div className="bg-gray-900/30 p-5 rounded-xl border border-amber-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">45mm tires, 40t chainring, 10-52t cassette, hookless-approved setup, 30 PSI.</strong> This is the proven formula for first-time XL finishers. Adjust based on your local training terrain. Check your exact gearing with our calculator before committing to parts.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Check Your Unbound Gear Setup" sub="Enter your chainring, cassette, and tire size to see if your gearing is enough for the Flint Hills." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
