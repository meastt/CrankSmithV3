import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Axle Standards: Boost, 142×12, and Why Thru-Axle Size Matters",
    description: "From QR to 142×12 to 148×12 Boost — what changed, why it matters for gravel bikes, and how to validate hub and frame compatibility in 2026.",
    date: "2026-04-24",
    category: "Standards",
    keywords: ["gravel axle spacing", "gravel thru-axle standards", "Boost gravel bike", "142x12 vs 148x12 gravel", "thru-axle size explained"],
    image: "/images/gravel-axle-standards-boost-142x12-2026.webp",
    excerpt: "QR is dead. 142×12 is standard. 148×12 Boost is creeping in on 2026 gravel frames. Here's what each one means for your build."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is the standard rear axle spacing on gravel bikes?", "acceptedAnswer": { "@type": "Answer", "text": "142×12mm (142mm O.L.D., 12mm axle diameter) is the standard rear axle spacing for gravel bikes. The 12mm thru-axle provides significantly more rigidity than the old 9mm quick-release skewer, and 142mm O.L.D. is the universal standard for road and gravel-specific hubs in 2026. Many 2026 frames are also offering optional 148×12mm Boost spacing, particularly those targeting the adventure/bikepacking segment." } },
        { "@type": "Question", "name": "What is Boost axle spacing on gravel bikes?", "acceptedAnswer": { "@type": "Answer", "text": "Boost spacing (148×12mm rear) moves the hub flanges outward by 3mm per side compared to standard 142mm. This increases the spoke bracing angle, improving wheel stiffness. Originally an MTB standard, Boost is appearing on 2026 adventure gravel frames because it enables wider tire clearance (the chain stay can be shaped to clear wider tires with the wider hub spacing) and stiffer wheel builds." } },
        { "@type": "Question", "name": "Is a 142mm hub compatible with a 148mm Boost frame?", "acceptedAnswer": { "@type": "Answer", "text": "No — 142mm hubs cannot be used in 148mm Boost frames without an adapter kit. The axle won't reach the dropout on both sides. Some hub manufacturers (DT Swiss, Hope) offer conversion end caps that allow switching between standards, but it's not universally available. Always confirm your frame's O.L.D. before purchasing wheels or hubs." } },
        { "@type": "Question", "name": "What thru-axle thread standard is most common on gravel bikes?", "acceptedAnswer": { "@type": "Answer", "text": "M12×1.0mm (12mm diameter, 1.0mm pitch thread) is the most common rear thru-axle threading. Some brands use M12×1.5mm. Front forks are typically M15×1.5mm (15mm thru-axle). Always confirm your frame manufacturer's specification — using the wrong thread pitch will damage the dropout threads." } },
        { "@type": "Question", "name": "Does thru-axle size affect tire clearance?", "acceptedAnswer": { "@type": "Answer", "text": "Not directly — tire clearance is set by the chainstay and fork crown dimensions, not the axle. However, Boost spacing (148mm) indirectly enables wider tire clearance because the wider hub allows the frame designer to shape the chainstays to provide more tire room while maintaining the structural rigidity needed for the wider hub. This is one reason Boost frames often quote higher tire clearance limits." } }
    ]
};

export default function PostAxleStandards({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 24, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Axle Standards: Boost, 142×12, and Why Thru-Axle Size Matters</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">QR is dead. 142×12 is standard. 148×12 Boost is creeping into 2026 gravel frames. Here&apos;s what that means for your hub and wheel choices.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-axle-standards-boost-142x12-2026.webp"
                        alt="Gravel bike axle standards comparison diagram: 142x12mm thru-axle vs 148x12mm Boost with QR reference — CrankSmith standards guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Reference: <Link href="/standards/axles" className="text-cyan-400 hover:underline">CrankSmith Axle Standards Reference Page</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Axle standards affect hub compatibility, wheel stiffness, and — indirectly — tire clearance. Understanding them is essential when buying wheels for a gravel build, spec&apos;ing a replacement hub, or evaluating frame options. Here&apos;s the complete picture for 2026.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Evolution: QR → Thru-Axle → Boost</h2>
                        <p>Quick release (QR) used a 5mm skewer through a hollow axle in cup-and-cone dropouts. It worked fine for decades on road bikes but introduced flex under the lateral loads of disc brakes. The industry shifted to thru-axle because a solid 12mm shaft locks directly into closed dropouts, virtually eliminating flex under braking.</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Rear Axle Standards — Quick Reference</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Standard</th>
                                            <th className="text-left py-2 pr-4">O.L.D.</th>
                                            <th className="text-left py-2 pr-4">Axle Dia.</th>
                                            <th className="text-left py-2">2026 Usage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr><td className="py-2 pr-4 font-medium">Quick Release</td><td className="py-2 pr-4">130/135mm</td><td className="py-2 pr-4">5mm skewer</td><td className="py-2 text-red-400">Dead for gravel</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium text-cyan-300">142×12 Thru-Axle</td><td className="py-2 pr-4">142mm</td><td className="py-2 pr-4">12mm</td><td className="py-2 text-green-400">Standard gravel</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium">148×12 Boost</td><td className="py-2 pr-4">148mm</td><td className="py-2 pr-4">12mm</td><td className="py-2 text-cyan-400">Adventure/gravel+ frames</td></tr>
                                        <tr><td className="py-2 pr-4 font-medium">157×12 Super Boost</td><td className="py-2 pr-4">157mm</td><td className="py-2 pr-4">12mm</td><td className="py-2 text-amber-400">MTB only, rare gravel</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Why Boost Is Appearing on Gravel Frames</h2>
                        <p>Boost (148×12mm) moves each hub flange 3mm further outward compared to 142mm. The practical consequences:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>More wheel stiffness</strong> — wider flange spacing improves spoke bracing angle. A 148mm Boost wheel is laterally stiffer than an equivalent 142mm build, all else equal.</li>
                            <li><strong>Wider tire clearance potential</strong> — the chainstay shape that accommodates 148mm spacing often also provides more room for wider tires. Not automatic, but common.</li>
                            <li><strong>Better chainline for 1x</strong> — the Boost offset shifts chainline outward, which suits 1x drivetrains and MTB-derived cassettes (useful for mullet setups).</li>
                        </ul>
                        <p className="mt-4">The trade-off: a 148mm Boost frame requires 148mm Boost-specific hubs. You can&apos;t put a standard 142mm hub in a 148mm dropout — the axle won&apos;t reach both sides. Some hubs (DT Swiss 350, Hope Pro 5) offer conversion end caps, but this is the exception, not the rule.</p>

                        <h2 className="text-white mt-12 mb-6">Front Axle: Almost Always 100×12mm</h2>
                        <p>Front forks on gravel bikes are almost universally 100×12mm thru-axle. The threading is typically M12×1.0mm or M12×1.5mm — check your fork specification before buying a replacement axle. Some brands (Specialized, Canyon) use proprietary axle heads. Front Boost (110×15mm) exists on some MTB-origin forks but is rare on purpose-built gravel forks.</p>

                        <h2 className="text-white mt-12 mb-6">Hub &amp; Frame Compatibility Summary</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { frame: "Standard gravel frame (142mm)", hub: "142mm O.L.D. hubs required. Any standard road/gravel hub." },
                                { frame: "Boost gravel frame (148mm)", hub: "148mm Boost hubs required. Or DT Swiss/Hope with Boost conversion end caps." },
                                { frame: "Flip-chip frame (142/148mm)", hub: "Check which mode before buying. Typically ships in 142mm mode." },
                            ].map(({ frame, hub }) => (
                                <div key={frame} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                    <p className="text-cyan-400 font-bold text-sm">{frame}</p>
                                    <p className="text-gray-300 text-sm mt-1">{hub}</p>
                                </div>
                            ))}
                        </div>

                        <p>For the full compatibility table including freehub standards (HG, XD, Micro Spline) by axle standard, see the <Link href="/standards/axles" className="text-cyan-400 hover:underline">CrankSmith Axle Standards Reference</Link>.</p>
                    </div>

                    <BlogCTA heading="Validate Your Frame × Hub Compatibility" sub="Enter your frame and hub specifications to confirm axle standard compatibility before you buy." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
