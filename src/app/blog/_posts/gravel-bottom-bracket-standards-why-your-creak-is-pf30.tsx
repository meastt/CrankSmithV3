import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Bottom Bracket Standards on Gravel Bikes: Why Your Creak Is Probably PF30",
    description: "T47 vs PF30 vs BSA vs DUB — what every gravel rider needs to know about bottom bracket standards, why press-fit creaks, and which standard has won the 2026 market.",
    date: "2026-04-23",
    category: "Standards",
    keywords: ["gravel bottom bracket standards", "T47 vs PF30 gravel", "gravel bike creak fix", "bottom bracket standards 2026", "T47 bottom bracket"],
    image: "/images/gravel-bottom-bracket-standards-t47-pf30-2026.webp",
    excerpt: "If your gravel bike creaks and you can't find the source, it's probably your bottom bracket. Here's the full breakdown of what you're dealing with."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Why do PF30 bottom brackets creak?", "acceptedAnswer": { "@type": "Answer", "text": "PF30 bottom brackets creak because the plastic or alloy bearing cups are pressed into an oversized carbon or alloy shell. Any flex, micro-movement, or contamination between the cup's outer diameter and the shell's inner diameter creates a creak. Carbon frames amplify this because they have slightly more flex than aluminum. It's a design flaw, not a manufacturing defect — the press-fit interface just can't provide as consistent a preload as threads." } },
        { "@type": "Question", "name": "Is T47 better than PF30 for gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, for almost all gravel riders. T47 uses standard M47x1.0mm threads — meaning the bearing cups thread into the frame like a traditional threaded BB. You get tool-assisted installation, consistent preload, field-repairability, and no creak from the shell interface. T47 maintains the wide 30mm shell diameter of modern cranksets (SRAM DUB, Shimano's 24mm, FSA's BB386) while adding the reliability of threads." } },
        { "@type": "Question", "name": "What bottom bracket does SRAM Transmission use?", "acceptedAnswer": { "@type": "Answer", "text": "SRAM's Transmission groupsets (XX SL, XX, X0) require Universal Derailleur Hanger (UDH) dropout compatibility on the frame side, and use DUB (Durable Uniform Bash) crankset spindles. DUB spindles are 28.99mm diameter — compatible with T47, PF30 (via cups), BSA, and BB386EVO shells using appropriate DUB-specific bottom bracket cups." } },
        { "@type": "Question", "name": "Can I convert a PF30 frame to threaded bottom bracket?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Several manufacturers offer threaded conversion solutions for PF30 shells. Wheels Manufacturing and Enduro Bearings both make T47 thread-in inserts that bond into the PF30 shell, effectively converting it to T47 threaded. This eliminates creak permanently and adds serviceability. The conversion typically costs $50-80 for the insert set plus installation." } },
        { "@type": "Question", "name": "What are the most common bottom bracket standards in gravel bikes?", "acceptedAnswer": { "@type": "Answer", "text": "In order of 2026 market prevalence for gravel frames: T47 (growing rapidly, now dominant on premium carbon gravel bikes), BSA/English threaded (most common on alloy and budget frames), PF30 (legacy standard, fewer new frames), and BB386EVO (niche, used by a few European brands). BSA remains common for repairability; T47 is replacing PF30 as the modern threaded standard for wide shells." } }
    ]
};

export default function PostBottomBracketStandards({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 23, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Bottom Bracket Standards on Gravel Bikes: Why Your Creak Is Probably PF30</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">T47 is winning. PF30 creaks. Here&apos;s what every gravel rider needs to know, and what to do about it.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-bottom-bracket-standards-t47-pf30-2026.webp"
                        alt="T47 threaded vs PF30 press-fit bottom bracket cross-section comparison diagram for gravel bikes — CrankSmith standards guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Deep dive: <Link href="/guides/bottom-bracket-standards" className="text-cyan-400 hover:underline">CrankSmith Bottom Bracket Standards Guide</Link> • <Link href="/standards/bottom-bracket" className="text-cyan-400 hover:underline">BB Standards Reference</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            If your gravel bike develops a creak you can&apos;t eliminate — saddle, pedals, handlebars, and seatpost all checked — it&apos;s probably your bottom bracket. And if your frame is from the 2015-2022 era, it&apos;s almost certainly PF30. Here&apos;s why that standard creaks by design, and where the market has moved.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Standards Landscape in 2026</h2>

                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Standard</th>
                                        <th className="text-left p-3">Shell ID</th>
                                        <th className="text-left p-3">Interface</th>
                                        <th className="text-left p-3">2026 Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr><td className="p-3 font-medium text-cyan-300">T47</td><td className="p-3">47mm</td><td className="p-3">Threaded (M47×1.0)</td><td className="p-3 text-green-400">Growing — new standard for premium gravel</td></tr>
                                    <tr><td className="p-3 font-medium">BSA/English</td><td className="p-3">34.8mm</td><td className="p-3">Threaded (1.37"×24tpi)</td><td className="p-3 text-green-400">Stable — common on alloy/budget</td></tr>
                                    <tr><td className="p-3 font-medium">PF30</td><td className="p-3">46mm</td><td className="p-3">Press-fit</td><td className="p-3 text-amber-400">Legacy — fewer new frames</td></tr>
                                    <tr><td className="p-3 font-medium">BB386EVO</td><td className="p-3">46mm</td><td className="p-3">Press-fit</td><td className="p-3 text-amber-400">Niche — European brands only</td></tr>
                                    <tr><td className="p-3 font-medium">PressFit 86</td><td className="p-3">41mm</td><td className="p-3">Press-fit</td><td className="p-3 text-red-400">Dying — Shimano/cheap bikes</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Why PF30 Creaks</h2>
                        <p>PF30 uses a 46mm inner diameter shell. Bearing cups have a 46mm outer diameter and are pressed in — no threads. The interference fit relies on precise tolerances between the cup and shell. When those tolerances slip — from frame flex, temperature cycling, moisture, or simply wear — micro-movement between the cup and shell creates a creak. In carbon frames, which flex more than aluminum, this is almost inevitable over time.</p>
                        <p className="mt-4">The fix for chronic PF30 creak is either: (a) re-grease the cups and press them back in, which is temporary, or (b) install threaded conversion inserts (T47-to-PF30 adapters from Wheels Manufacturing or Enduro) that epoxy into the shell and give you threaded installation. Option B costs ~$60-80 and is permanent.</p>

                        <h2 className="text-white mt-12 mb-6">Why T47 Is Winning</h2>
                        <p>T47 solves PF30&apos;s problem by maintaining the wide 47mm internal diameter (enough for 30mm spindles and DUB) while adding M47×1.0mm threads. You install it with a proper torque wrench, achieve consistent preload every time, and can service it anywhere with a simple hex key and pin spanner.</p>
                        <p className="mt-4">By 2026, essentially every premium carbon gravel frame from Specialized, Trek, Cannondale, Allied, and Enve ships with T47. Several have also adopted UDH (Universal Derailleur Hanger) as the companion standard for SRAM Transmission compatibility. The two standards are increasingly paired on new frames.</p>

                        <h2 className="text-white mt-12 mb-6">What To Do With Your Frame</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { shell: "T47", action: "Run any T47-compatible BB. SRAM DUB T47, Shimano T47 Hollowtech II, or Chris King T47 for maximum durability." },
                                { shell: "BSA/English", action: "Traditional threaded — easy. Install any standard 68mm English threaded BB. Works with virtually all cranksets via appropriate spindle adapters." },
                                { shell: "PF30 (creaking)", action: "Convert to T47 with threaded inserts, or try Hope Threaded PF30 cups which use a thread-together design to preload themselves." },
                                { shell: "PF30 (not creaking)", action: "Leave it. If it's working, premptive surgery isn't needed. Use high-quality cups (Wheels Mfg, Enduro, CeramicSpeed) and grease on installation." },
                            ].map(({ shell, action }) => (
                                <div key={shell} className="flex gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-cyan-400 font-bold font-mono w-28 shrink-0">{shell}</span>
                                    <span className="text-gray-300 text-sm">{action}</span>
                                </div>
                            ))}
                        </div>

                        <p>For the full compatibility matrix — which cranksets work with which shells and which adapters are needed — see the <Link href="/guides/bottom-bracket-standards" className="text-cyan-400 hover:underline">CrankSmith Bottom Bracket Standards Guide</Link> or the <Link href="/standards/bottom-bracket" className="text-cyan-400 hover:underline">BB Standards Reference</Link>.</p>
                    </div>

                    <BlogCTA heading="Check Your BB Standard + Crankset" sub="Enter your frame and crankset to verify compatibility and find the right bottom bracket for your build." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
