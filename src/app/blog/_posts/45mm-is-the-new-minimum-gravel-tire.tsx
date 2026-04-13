import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "45mm Is the New Minimum Gravel Tire — Here's Why",
    description: "Why 45mm has become the standard minimum gravel tire width in 2026. Rolling resistance data, comfort metrics, and which frames support it.",
    date: "2026-04-10",
    category: "Big Tires",
    keywords: ["gravel tire width 2026", "45mm gravel tire", "minimum gravel tire size", "wide gravel tires", "gravel tire clearance"],
    image: "/images/gravel-tire-width-45mm-minimum-2026.webp",
    excerpt: "Every 2026 frame clears 50mm+. Riders are pushing past 40mm and never looking back. The data backs it up."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Why is 45mm the new minimum gravel tire width?", "acceptedAnswer": { "@type": "Answer", "text": "Modern 2026 gravel frames are designed with 50mm+ clearances as standard. At 45mm, riders get the sweet spot of rolling resistance, puncture protection, and comfort at lower pressures. Narrower tires (35-40mm) are increasingly viewed as outdated for real-world gravel riding." } },
        { "@type": "Question", "name": "What are the benefits of wider gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "Wider gravel tires (45mm+) offer faster rolling on rough surfaces (proven by testing), increased puncture protection, greater forgiveness over unseen obstacles, and the ability to run lower pressures for more grip and comfort." } },
        { "@type": "Question", "name": "Do wider gravel tires slow you down on pavement?", "acceptedAnswer": { "@type": "Answer", "text": "Very large tires (50mm+) can feel ponderous on pavement and squirmy in corners on hard-packed gravel. For mixed road/gravel riding, 45mm is often the best compromise — fast enough on tarmac while still excelling on gravel." } },
        { "@type": "Question", "name": "What internal rim width is best for 45mm gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "For 45mm gravel tires, an internal rim width of 23-28mm is recommended. Wider internal rims (28mm+) provide better side support for wider tires and allow lower pressures, but always check the manufacturer's compatibility chart." } },
        { "@type": "Question", "name": "How do I know if my gravel frame fits 45mm tires?", "acceptedAnswer": { "@type": "Answer", "text": "Most 2026 gravel frames accommodate at least 45mm. Check your frame manufacturer's official clearance specs. Use the CrankSmith builder to validate your exact frame and tire combination, including room for mud." } }
    ]
};

export default function Post45mm({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Big Tires • April 10, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">45mm Is the New Minimum Gravel Tire — Here&apos;s Why</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Every major 2026 gravel frame clears 50mm+. Riders are pushing past 40mm and never looking back. The data backs it up.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-tire-width-45mm-minimum-2026.webp"
                        alt="45mm gravel tire cross-section technical blueprint with dimension callouts and PSI ranges — CrankSmith compatibility guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            If you&apos;re still running 35mm or 40mm tires on your gravel bike, you&apos;re riding on last decade&apos;s setup. <strong>45mm has become the accepted minimum for general gravel riding</strong>, and for good reason. The combination of rolling efficiency, puncture protection, and the ability to run lower pressures for grip makes wider tires objectively faster on most real-world gravel surfaces.
                        </p>

                        <h2 className="text-white mt-12 mb-6">What Changed?</h2>
                        <p className="text-sm text-gray-500 -mt-4 mb-4"><em>Related reading: <a href="https://www.bikeradar.com/features/opinion/dont-buy-a-gravel-bike-without-50mm-tyre-clearance" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">BikeRadar: &quot;Don&apos;t Buy a Gravel Bike Without 50mm Tyre Clearance&quot;</a> • <a href="https://www.cyclingweekly.com/news/the-next-big-things-in-gravel-2026-2027-tech-predictions" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">CyclingWeekly&apos;s 2026-27 Gravel Tech Predictions</a></em></p>

                        <p>The 2026 gravel frame market has shifted. Where 40mm clearance was once considered generous, <strong>50mm is now the baseline expectation</strong> for new gravel bikes. The Specialized Diverge clears 55mm. The Allied Able handles 57mm. Even mid-range carbon frames are opening up their chainstays and fork crowns to accommodate 50mm+ rubber.</p>

                        <p>This isn&apos;t just manufacturer marketing — it reflects real rider behavior. On Reddit and gravel forums, riders who switch from 35mm or 40mm to 45mm consistently report faster times on rough gravel, fewer flats, and a more comfortable ride without a measurable speed penalty on pavement. The physics: at lower pressures (20-30 PSI range for wider tires), the tire deforms around obstacles instead of bouncing off them, maintaining momentum. For personalized PSI recommendations by weight and tire width, try the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI Tire Pressure Calculator</a>.</p>

                        <h2 className="text-white mt-12 mb-6">The Rolling Resistance Reality</h2>
                        <p>Independent testing has confirmed what gravel racers already knew: <strong>wider tires often roll faster than narrow tires on rough surfaces</strong>. A 45mm tire at 30 PSI will outperform a 35mm tire at 50 PSI on anything but perfectly smooth tarmac. The energy lost to suspension (your body vibrating) far exceeds the marginal increase in tire deformation. See <a href="https://www.bikeradar.com/advice/technical/wider-tyres-are-faster" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">BikeRadar&apos;s independent tire testing</a> for the full data.</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">Real-World Tire Width Feedback (2026)</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>35-40mm:</strong> &ldquo;Feels outdated on real gravel.&rdquo; Fast on pavement, harsh on rough stuff.</li>
                                <li><strong>45mm:</strong> The standard. Fast on rough, comfortable, confident in corners.</li>
                                <li><strong>50mm:</strong> Preferred by aggressive riders. More grip, more comfort, slightly heavier.</li>
                                <li><strong>55mm+:</strong> For 2.1&quot;+ setups. Best on technical terrain, ponderous on pavement.</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">So What Should You Run?</h2>
                        <p>For most gravel riders in 2026, <strong>45mm is the sweet spot</strong>. It&apos;s wide enough to excel on real gravel while still feeling planted on hard-pack and pavement. If you&apos;re racing or riding technical terrain, 50mm is increasingly the choice. Only drop to 40mm or below if your rides are predominantly pavement with occasional gravel sections.</p>
                        <p>The real question isn&apos;t &ldquo;how wide can I go&rdquo; — it&apos;s &ldquo;does my frame actually fit the tire I want?&rdquo; That&apos;s where CrankSmith comes in. Enter your frame model and target tire size, and the builder checks real clearance data including room for mud, which most manufacturers don&apos;t publish.</p>

                        <h2 className="text-white mt-12 mb-6">Going Even Wider?</h2>
                        <p>If 45mm isn&apos;t enough for your terrain, some 2026 frames officially clear <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">2.25-inch (57mm) MTB tires</Link>. And if you&apos;re running wider tires, your <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">effective gearing changes too</Link> — wider tires = larger circumference = taller gears. CrankSmith calculates all of this automatically.</p>
                    </div>

                    <BlogCTA heading="Check Your Frame&apos;s Clearance" sub="Enter your gravel frame and tire size to validate fitment — including mud clearance." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
