import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "2.25-Inch Gravel Tires: When Your Gravel Bike Becomes a Light MTB",
    description: "What actually happens when you mount 2.25-inch MTB-width tires on a gravel frame. Geometry trade-offs, rim width compatibility, effective gear inch changes, and which setups actually work.",
    date: "2026-04-18",
    category: "Big Tires",
    keywords: ["MTB tires on gravel bikes", "2.25 inch gravel clearance", "wide tire gravel setup", "700c 2.25 gravel", "gravel bike tire clearance"],
    image: "/images/gravel-225-inch-tires-light-mtb-setup-2026.webp",
    excerpt: "The frame list post tells you which bikes fit 2.25\". This post tells you what happens when you actually run them — and whether you should."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Can a gravel bike actually run 2.25-inch tires?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, but only on specific frames with 57mm+ clearance at the chainstay and fork crown. Frames like the Specialized Diverge (55mm), Allied Able (57mm), and several Salsa and Specialized models officially clear 2.25\" (57mm) 700c tires. Always verify exact clearance specs — nominal frame ratings often don't account for tire casing growth under pressure." } },
        { "@type": "Question", "name": "What rim width is needed for 2.25-inch gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "For 2.25\" (57mm) gravel tires, you need at least 25-30mm internal rim width. Narrower rims (21-23mm internal) will make the tire sit too tall and narrow, reducing the sidewall support that makes wide tires effective. The ETRTO recommends a 25-30mm internal for optimal 55-60mm tire performance." } },
        { "@type": "Question", "name": "How does a 2.25-inch tire change effective gearing?", "acceptedAnswer": { "@type": "Answer", "text": "A 700c x 2.25\" tire has a roughly 7% larger circumference than a 700c x 40mm tire. This means your effective gearing is about 7% taller — a 34t chainring with a 2.25\" tire rolls the same distance per pedal revolution as a 36.5t ring with a 40mm tire. You'll need to compensate with a lower cassette cog or smaller chainring for the same climbing feel." } },
        { "@type": "Question", "name": "Is a gravel bike with 2.25 tires the same as a hardtail MTB?", "acceptedAnswer": { "@type": "Answer", "text": "Not quite. A gravel bike with 2.25\" tires has a much longer wheelbase, slacker head angle relative to a gravel norm but steeper than MTB, drop bars, and road-derived geometry. It handles technical terrain better than a pure gravel setup but lacks the MTB-specific geometry, suspension travel options, and handling characteristics of a dedicated hardtail." } },
        { "@type": "Question", "name": "What are the best 700c x 2.25-inch gravel tires in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Top options in 2026 include the Teravail Cannonball 700x2.25\" (fast-rolling center tread, aggressive side knobs), WTB Resolute 700x42mm (not quite 2.25 but popular), and Panaracer GravelKing SK+ 700x43mm. True 2.25\" options are more limited than 50-55mm. CrossMark II 700x2.25\" from Maxxis is another proven option for mixed terrain." } },
        { "@type": "Question", "name": "Does running 2.25 tires require different brake rotors?", "acceptedAnswer": { "@type": "Answer", "text": "No — brake rotor size is determined by frame/fork mount compatibility, not tire width. However, running significantly larger tires does raise your bottom bracket height relative to the ground slightly, which can affect standover height and cornering feel. Rotor size stays the same." } }
    ]
};

export default function Post225InchTires({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Big Tires • April 18, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">2.25-Inch Gravel Tires: When Your Gravel Bike Becomes a Light MTB</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">The frame list tells you which bikes fit them. This post tells you what actually happens when you run them — and whether it&apos;s worth it.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-225-inch-tires-light-mtb-setup-2026.webp"
                        alt="2.25-inch wide gravel tire next to standard MTB tire for comparison with 57mm dimension callout — CrankSmith gravel compatibility guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">Every Gravel Frame That Fits 2.25&quot; Tires</Link> • <Link href="/blog/45mm-is-the-new-minimum-gravel-tire" className="text-cyan-400 hover:underline">45mm Is the New Minimum Gravel Tire</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            We already covered <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">which frames physically clear 2.25-inch tires</Link>. But fitting a tire and riding it effectively are different things. When you mount MTB-width rubber on a gravel frame, you&apos;re not just changing tires — you&apos;re changing the effective geometry, gearing, and handling character of the entire bike. Here&apos;s what actually happens.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Clearance Reality</h2>
                        <p>A 700c x 2.25&quot; tire measures roughly 57mm wide when inflated on an appropriately sized rim. That&apos;s meaningfully different from the 50mm that most &quot;wide tire&quot; gravel frames accommodate. The gap that matters isn&apos;t just the manufacturer&apos;s stated clearance — it&apos;s the actual inflated width of your specific tire on your specific rim, plus at least 5mm of mud clearance on each side.</p>

                        <p>Tire casings vary significantly between brands. A nominally &quot;2.25-inch&quot; tire might measure 54mm on a 25mm internal rim or 59mm on a 30mm internal rim. Run the same tire on too-narrow rims and it grows taller, not wider — and that&apos;s where you run into crown and chainstay clearance issues even on frames rated for 2.25&quot;.</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-3">Real Clearance Numbers for 700c x 2.25&quot;</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left py-2 pr-6 text-gray-400 font-medium">Internal Rim Width</th>
                                            <th className="text-left py-2 pr-6 text-gray-400 font-medium">Inflated Width (approx.)</th>
                                            <th className="text-left py-2 text-gray-400 font-medium">Clearance Needed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-6">21mm (too narrow)</td><td className="py-2 pr-6">55-56mm tall, narrow</td><td className="py-2 text-amber-400">61mm+</td></tr>
                                        <tr><td className="py-2 pr-6">25mm (minimum)</td><td className="py-2 pr-6">57-58mm</td><td className="py-2 text-cyan-400">63mm+ (incl. mud)</td></tr>
                                        <tr><td className="py-2 pr-6">28-30mm (optimal)</td><td className="py-2 pr-6">58-60mm</td><td className="py-2 text-cyan-400">65mm+ (incl. mud)</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Always measure your actual inflated tire before assuming nominal specs apply.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Gearing Math You Can't Ignore</h2>
                        <p>This is the part most tire-width discussions skip entirely. A 700c x 2.25&quot; tire has a circumference of approximately 2,325mm. A 700c x 40mm tire has a circumference of roughly 2,170mm. That&apos;s a <strong>7% difference in rollout per pedal revolution</strong>.</p>

                        <p>In practice, this means:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li>A 34t chainring with 2.25&quot; tires feels like a <strong>36.4t chainring</strong> with 40mm tires</li>
                            <li>Climbing in your easiest gear (e.g., 34x46t) now gives you 7% fewer pedal strokes per vertical foot</li>
                            <li>Top-end speed increases slightly — but that&apos;s rarely the concern at 2.25&quot; widths</li>
                        </ul>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-3">Effective Gear Inches: 34t Chainring Comparison</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 font-medium mb-2">With 40mm tire</p>
                                    <p>34t × 46t = <strong className="text-white">19.7 gear inches</strong></p>
                                    <p>34t × 11t = <strong className="text-white">82.4 gear inches</strong></p>
                                </div>
                                <div>
                                    <p className="text-cyan-400 font-medium mb-2">With 2.25&quot; tire (+7%)</p>
                                    <p>34t × 46t = <strong className="text-white">21.1 gear inches</strong></p>
                                    <p>34t × 11t = <strong className="text-white">88.2 gear inches</strong></p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Use <Link href="/builder" className="text-cyan-400 hover:underline">CrankSmith&apos;s drivetrain lab</Link> to calculate your exact effective gearing with any tire size.</p>
                        </div>

                        <p>The fix is simple: drop your chainring size. If you were running a 34t ring with 45mm tires and climbing felt right, consider a 32t with 2.25&quot; tires to restore the same climbing ratio.</p>

                        <h2 className="text-white mt-12 mb-6">Geometry Shifts</h2>
                        <p>Wider, taller tires do change how a gravel bike handles — but not in the ways people expect. The real changes are:</p>

                        <ul className="list-disc pl-5 space-y-3 mt-4">
                            <li><strong>Bottom bracket height increases slightly</strong> — more tire volume means the BB sits fractionally higher relative to ground. On a gravel bike with an already high BB (for ground clearance), this is rarely noticeable but reduces the planted feel at low speed.</li>
                            <li><strong>Effective wheelbase grows marginally</strong> — wider tires deform into an oval contact patch. The center of the contact patch moves very slightly rearward. Imperceptible in practice.</li>
                            <li><strong>Trail changes negligibly</strong> — unless you&apos;re running a different tire diameter (700c vs 650b), the steering geometry stays mostly intact.</li>
            <li><strong>Handling at speed is different</strong> — 2.25&quot; tires require more input to change direction than 45mm tires. Not sluggish, but deliberate. At gravel speeds this is rarely an issue. On pavement it feels like riding a different category of bike.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Who Actually Should Run These?</h2>
                        <p>This setup isn&apos;t for everyone — or even most gravel riders. It makes real sense for:</p>

                        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-cyan-500/20">
                                <h3 className="text-cyan-400 font-bold mb-2">Good fit ✓</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Bikepacking on mixed terrain (jeep roads, singletrack, gravel)</li>
                                    <li>Events like Crusher in the Tushar, Dirty Kanza XL — technical, variable surfaces</li>
                                    <li>Riders who own one bike and ride trails casually on weekends</li>
                                    <li>Loaded touring where volume and stability matter over speed</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-red-500/20">
                                <h3 className="text-red-400 font-bold mb-2">Poor fit ✗</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Race-focused gravel (weight penalty, added rolling resistance on gravel)</li>
                                    <li>Primarily road/tarmac riding</li>
                                    <li>Frames with less than 57mm clearance (clearance will be dangerously tight)</li>
                                    <li>Anyone who needs fine gearing steps over raw climbing range</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Bottom Line</h2>
                        <p>Running 2.25&quot; tires on a gravel bike is a legitimate and increasingly popular choice for adventure riders who want one versatile bike. But it requires matching components: a wide enough rim (25mm+ internal), a frame that actually clears the inflated tire with mud room, and a smaller chainring to compensate for the taller gearing. Get those three things right, and it works brilliantly. Skip any one of them and you&apos;ll be trimming tire sidewalls or spinning out on climbs.</p>

                        <p>Before you commit, check your frame&apos;s actual clearance against your specific tire brand and rim width combination. CrankSmith does this automatically when you <Link href="/builder" className="text-cyan-400 hover:underline">enter your build</Link> — it flags potential clearance conflicts based on real casing dimensions, not just nominal sizes.</p>
                    </div>

                    <BlogCTA heading="Validate Your 2.25&quot; Setup" sub="Enter your frame, rim width, and tire to check real clearance — plus see how gearing changes with wider tires." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
