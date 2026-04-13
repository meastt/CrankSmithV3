import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "How Your Bigger Gravel Tire Changes Your Actual Gear Ratio",
    description: "Wider tires increase effective gear inches. 45mm vs 35mm is a ~6% difference. See how it works.",
    date: "2026-04-14",
    category: "Drivetrain",
    keywords: ["tire circumference gearing", "gravel tire gear inches", "wider tire gear ratio"],
    image: "/images/blog-tire-gearing.webp",
    excerpt: "45mm vs 35mm changes your effective gear inches by ~6%. CrankSmith calculates this automatically."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How much does tire width affect gear ratio?",
            acceptedAnswer: { "@type": "Answer", text: "A 45mm tire adds roughly 6% to your effective gear inches compared to a 35mm tire. That means a 40t chainring with 42mm tires feels like a 42.4t chainring -- a full 2.4 teeth heavier." }
        },
        {
            "@type": "Question",
            name: "What is the effective diameter of a 700x45c tire?",
            acceptedAnswer: { "@type": "Answer", text: "A 700x45c tire has an effective diameter of approximately 707mm, compared to 686mm for a 700x35c tire. This approximately 3% increase in radius translates to a approximately 6% increase in gear inches." }
        },
        {
            "@type": "Question",
            name: "Should I get a smaller chainring if I am going to 50mm tires?",
            acceptedAnswer: { "@type": "Answer", text: "If you are running 50mm+ tires and climbing steep terrain, dropping from a 42t to a 40t or 38t chainring restores the climbing gear you lose from the larger tire diameter." }
        },
        {
            "@type": "Question",
            name: "Does tire pressure change gear ratio?",
            acceptedAnswer: { "@type": "Answer", text: "Minimally. A 5 PSI difference in a 45mm tire changes the tire profile by less than 1mm -- less than 0.3% change in effective diameter." }
        },
        {
            "@type": "Question",
            name: "What gear ratio is good for gravel?",
            acceptedAnswer: { "@type": "Answer", text: "A popular all-around gravel setup is 40t chainring with a 10-44t or 10-52t cassette. For mountainous terrain with big tires, drop to 38t or 34t with a 10-52t cassette." }
        }
    ]
};

export default function PostHowTireWidthGearing({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Drivetrain
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        How Tire Width Changes Your Gravel Gearing -- The Math No One Talks About
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 14, 2026 -- 9 min read</p>

                    <FeaturedImage
                        src="/images/gravel-tire-width-affects-gear-ratio-2026.webp"
                        alt="Gear ratio schematic showing 35mm, 45mm, and 50mm gravel tire cross-sections with cyan measurement lines calculating effective gear inches"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Switching from 35mm to 50mm tires is the exact same effective gear change as swapping from a 40t to a 43t chainring.</strong></p>

                        <p>No new cranks. No new cassette. Just different tires. And suddenly your bike feels geared too tall for the climbs you used to handle fine.</p>

                        <p>Let us break down the math, because it matters every time you put bigger rubber on a gravel bike.</p>

                        <h2 className="text-white mt-12 mb-6">The Math Behind Effective Gear Inches</h2>

                        <p>Gear inches tell you how far your bike moves forward with one full pedal revolution:</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 text-center my-6">
                            <p className="text-white font-mono text-sm">
                                Effective Gear Inches = (Chainring divided by Cog) times (Tire Diameter in Inches)
                            </p>
                        </div>

                        <p>The tire diameter includes the rim plus the tire height on both sides. For a 700c rim (622mm bead seat diameter):</p>

                        <ul className="space-y-2">
                            <li><strong>700x35c tire:</strong> 622 + (35 times 2) = 692mm approximately <strong>27.2 inches</strong> diameter</li>
                            <li><strong>700x45c tire:</strong> 622 + (45 times 2) = 712mm approximately <strong>28.0 inches</strong> diameter</li>
                            <li><strong>700x50c tire:</strong> 622 + (50 times 2) = 722mm approximately <strong>28.4 inches</strong> diameter</li>
                            <li><strong>27.5x2.0 inch MTB tire:</strong> approximately <strong>29.1 inches</strong> diameter</li>
                        </ul>

                        <p>That means a 45mm tire has a 2.9% larger diameter than a 35mm tire. And because gear inches are proportional to diameter, <strong>it makes your entire gear range 2.9% taller. Every gear.</strong></p>

                        <h2 className="text-white mt-12 mb-6">The Real-World Impact: 40t with 45mm vs 35mm</h2>

                        <p>Let us use the most common modern gravel setup: 40t chainring, 10-44t cassette.</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6">
                            <p className="text-white text-sm font-semibold mb-3">Lowest gear (40t divided by 44t):</p>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li>With 35mm tires: <strong className="text-cyan-400">24.7 gear inches</strong> (easy climbing)</li>
                                <li>With 45mm tires: <strong className="text-orange-400">25.5 gear inches</strong> (noticeably harder)</li>
                                <li>With 50mm tires: <strong className="text-red-400">25.8 gear inches</strong> (that is a 42t chainring feeling)</li>
                            </ul>
                        </div>

                        <p>That 25.5 gear inches with 45mm tires? That is equivalent to running a <strong>41.2t chainring</strong> -- and chainrings only come in whole numbers. You have essentially upped your chainring by 1.2 teeth just by changing tires.</p>

                        <p>For a 150-lb rider on 8% grades, the difference between 24.7 and 25.8 gear inches is about <strong>2.2 additional watts</strong> per pedal stroke. That does not sound like much until you are 40 minutes into a steep gravel climb on a hot day and you are standing up when your buddy on narrower tires is still spinning.</p>

                        <h2 className="text-white mt-12 mb-6">When Does This Actually Matter?</h2>

                        <h3 className="text-white mt-8 mb-4">1. You Are Building Around Wide Tires</h3>
                        <p>If you are buying a new frame that clears 50mm+ and you plan to run big tires year-round, size your chainring accordingly. A 38t or even 36t chainring with a 10-52t cassette makes more sense than the standard 40t.</p>

                        <h3 className="text-white mt-8 mb-4">2. You Switch Between a Road and Gravel Quiver</h3>
                        <p>If you have one bike with 35mm slicks for fast road days and the same bike with 50mm knobbies for weekend trail rides, your gearing is going to feel like two different bikes. <Link href="/blog/1x-vs-2x-gravel-2026-numbers" className="text-cyan-400 hover:underline">This is one reason some riders prefer 2x</Link> -- it gives you enough range to cover both setups.</p>

                        <h3 className="text-white mt-8 mb-4">3. You Are Running an Unbound Build (50mm+ in Kansas)</h3>
                        <p>Riders using 50mm+ tires for Unbound Gravel should consider a smaller chainring (36-38t) paired with a 10-52t cassette. <Link href="/blog/unbound-gravel-2026-tire-gear-setup" className="text-cyan-400 hover:underline">We break down full Unbound setups in our dedicated guide</Link>.</p>

                        <h2 className="text-white mt-12 mb-6">Compensating: What Should You Change?</h2>

                        <h3 className="text-white mt-8 mb-4">Option A: Smaller Chainring (Easiest, Cheapest)</h3>
                        <p>Drop your chainring by 2-4 teeth. A 40t to 38t swap costs about $40 and takes 20 minutes. This perfectly compensates for the gear increase from 35mm to 50mm tires.</p>

                        <h3 className="text-white mt-8 mb-4">Option B: Bigger Cassette</h3>
                        <p>Upgrade to a 10-44t (SRAM XDR) or 10-52t. If you are running a 2x crankset, front derailleur clearance may limit cassette size -- another reason <Link href="/blog/the-gravel-mullet-road-shifter-mtb-derailleur" className="text-cyan-400 hover:underline">mullet drivetrains are so popular</Link>.</p>
                        <p>For a comprehensive breakdown of all modern gravel groupset options including the full 1x vs 2x landscape, see our <Link href="/guides/gravel-groupsets-explained" className="text-cyan-400 hover:underline">Gravel Drivetrain & Groupset Configurations guide</Link>.</p>

                        <h3 className="text-white mt-8 mb-4">Option C: Accept It (The Fast Approach)</h3>
                        <p>Many Unbound racers run big gearing because they prioritize top speed on the rolling Flint Hills. If you are strong and your courses are more rolling than mountainous, you might be fine.</p>

                        <h2 className="text-white mt-12 mb-6">Key Takeaways</h2>
                        <ul className="space-y-1">
                            <li>Every 5mm of tire width adds roughly 1-1.5% to your effective gear ratio</li>
                            <li>A 35mm to 50mm tire swap feels like a 2-3 tooth bigger chainring</li>
                            <li>Compensate with a smaller chainring (not a bigger cassette -- it is cheaper)</li>
                            <li>For 2.1-inch+ tires, a 34-36t chainring with 10-52t cassette is the smart setup for climbing terrain</li>
                        </ul>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-cyan-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Pro tip:</strong> If your bike came stock with a 40t chainring and 40mm tires, and you want to run 50mm+ for bikepacking, drop to a 38t chainring. It is a $40 fix that makes your climbing feel like it did before the tire upgrade.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Calculate Your Exact Gear Range" sub="Enter your chainring, cassette, and tire size -- see gear inches, cadence-to-speed charts, and drivetrain compatibility." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
