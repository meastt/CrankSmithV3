import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Flat Mount vs Post Mount Brakes on Gravel: Rotor Size Limits",
    description: "Flat mount vs post mount brake standards for gravel bikes — which calipers work, maximum rotor sizes, adapter logic, and why flat mount dominates in 2026.",
    date: "2026-04-25",
    category: "Standards",
    keywords: ["gravel brake mount standards", "flat mount max rotor size", "flat mount vs post mount gravel", "gravel disc brake standards", "flat mount 180mm adapter"],
    image: "/images/gravel-flat-mount-vs-post-mount-brake-rotor-sizes.webp",
    excerpt: "Flat mount is everywhere on gravel in 2026. But there's a rotor size ceiling — and the adapter situation is less obvious than it looks."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is the maximum rotor size for flat mount gravel brakes?", "acceptedAnswer": { "@type": "Answer", "text": "Standard flat mount is designed for 140mm and 160mm rotors. 160mm is the maximum direct-mount size on most flat mount frames. 180mm rotors can be used on flat mount front forks via a flat mount to flat mount +20mm adapter (e.g., Shimano SM-MA-F180D/D2). Rear flat mount is almost universally capped at 160mm without custom adapters." } },
        { "@type": "Question", "name": "Is post mount still used on gravel bikes in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Very rarely on new frames. Post mount (IS mount) is still found on some alloy adventure frames, older frames, and occasionally on fork lowers where additional caliper adjustability is needed. All premium carbon gravel frames in 2026 use flat mount as standard. Post mount allows larger rotors more easily via IS adapters, which is why it persists in some MTB applications." } },
        { "@type": "Question", "name": "Can I run a 180mm rotor on a flat mount gravel fork?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, using a flat mount to flat mount +20mm offset adapter (from Shimano, TRP, or third-party). Most fork manufacturers specify whether their flat mount tabs are machined to accept the +20mm adapter — check the fork spec sheet. Running a 180mm rotor provides more braking power and better heat dissipation for steep descents or loaded bikepacking rides." } },
        { "@type": "Question", "name": "What caliper brands work with flat mount gravel frames?", "acceptedAnswer": { "@type": "Answer", "text": "All major gravel disc brake calipers use flat mount as standard in 2026: Shimano GRX, SRAM Force/Rival/Apex Level, TRP Spyre and Hylex, Paul Components, Hope RX4+, and Magura MT5 (via adapter). Flat mount has a universal 2-bolt interface — compatibility is near-universal between frame brands and caliper brands." } },
        { "@type": "Question", "name": "Does rotor size affect gravel bike handling?", "acceptedAnswer": { "@type": "Answer", "text": "Larger rotors (160mm vs 140mm) provide more braking power and better heat management — critical on long descents and for loaded bikepacking. They add a small amount of rotational weight (typically 40-80g per rotor for road to 160mm upgrade). For most gravel riding, 160mm front and 140mm rear is the ideal balance. Some riders run 180mm front for alpine or heavily loaded riding." } }
    ]
};

export default function PostBrakeMountStandards({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 25, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Flat Mount vs Post Mount Brakes on Gravel: Rotor Size Limits</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Flat mount dominates gravel in 2026 — but there&apos;s a rotor size ceiling, and the adapter logic is less obvious than manufacturers make it sound.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-flat-mount-vs-post-mount-brake-rotor-sizes.webp"
                        alt="Flat mount vs post mount disc brake calipers on gravel fork with 160mm rotor — CrankSmith brake standards guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Deep dive: <Link href="/guides/brake-mount-standards" className="text-cyan-400 hover:underline">CrankSmith Brake Mount Standards Guide</Link> • <Link href="/standards/brake-mounts" className="text-cyan-400 hover:underline">Brake Mount Reference</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Every premium gravel frame in 2026 ships with flat mount disc brake tabs. It&apos;s the standard. But flat mount has rotor size limitations that most riders don&apos;t discover until they try to upgrade to 180mm front rotors and realize their frame or fork wasn&apos;t machined for the adapter. Here&apos;s what you need to know.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Flat Mount vs Post Mount: The Core Difference</h2>

                        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-cyan-500/20">
                                <h3 className="text-cyan-400 font-bold mb-3">Flat Mount</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Two M6 bolts directly into frame/fork</li>
                                    <li>Caliper sits flush and low profile</li>
                                    <li>140mm and 160mm direct mount</li>
                                    <li>180mm via +20mm adapter (if frame allows)</li>
                                    <li>Lighter, cleaner aesthetics</li>
                                    <li><strong>Standard on all premium gravel 2026</strong></li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-3">Post Mount (IS Mount)</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li>Two M6 bolts through frame tabs, caliper slides</li>
                                    <li>Adjustable position for alignment</li>
                                    <li>140mm, 160mm, 180mm, 203mm via IS adapters</li>
                                    <li>Heavier, less aerodynamic</li>
                                    <li>Found on alloy adventure frames, MTB</li>
                                    <li><strong>Rare on new gravel frames</strong></li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Rotor Size Reality</h2>
                        <p>Flat mount is designed for 140mm and 160mm rotors as direct mounts. To run 180mm, you need a +20mm offset flat mount adapter. These adapters require specific machining on the frame&apos;s or fork&apos;s flat mount tabs — not all frames and forks have this. Check your manufacturer&apos;s spec sheet for whether the&nbsp;&ldquo;FM+20mm adapter compatible&rdquo; language appears.</p>

                        <div className="my-8 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-4">Rotor Size by Mount Type</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-gray-400">
                                            <th className="text-left py-2 pr-4">Mount</th>
                                            <th className="text-left py-2 pr-4">140mm</th>
                                            <th className="text-left py-2 pr-4">160mm</th>
                                            <th className="text-left py-2 pr-4">180mm</th>
                                            <th className="text-left py-2">203mm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Flat Mount (front)</td>
                                            <td className="py-2 pr-4 text-green-400">Direct</td>
                                            <td className="py-2 pr-4 text-green-400">Direct</td>
                                            <td className="py-2 pr-4 text-amber-400">+20mm adapter*</td>
                                            <td className="py-2 text-red-400">No</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Flat Mount (rear)</td>
                                            <td className="py-2 pr-4 text-green-400">Direct</td>
                                            <td className="py-2 pr-4 text-green-400">Direct</td>
                                            <td className="py-2 pr-4 text-red-400">No</td>
                                            <td className="py-2 text-red-400">No</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 pr-4 font-medium">Post Mount (IS)</td>
                                            <td className="py-2 pr-4 text-green-400">IS adapters</td>
                                            <td className="py-2 pr-4 text-green-400">IS adapters</td>
                                            <td className="py-2 pr-4 text-green-400">IS adapters</td>
                                            <td className="py-2 text-green-400">IS adapters</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">*Flat mount to flat mount +20mm adapter (e.g., Shimano SM-MA-F180D/D2). Frame/fork must be machined to accept it.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Which Rotor Size for Gravel?</h2>
                        <p>For most gravel riding, <strong>160mm front / 140mm or 160mm rear</strong> is the ideal combination. 160mm front provides ample stopping power for any gradient and weather condition. The rear rarely needs more than 140mm — rear braking contributes less to total stopping force, and a smaller rotor saves rotational weight where it matters less.</p>

                        <p className="mt-4">Consider upgrading to 180mm front if you:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>Ride loaded bikepacking with 10kg+ cargo</li>
                            <li>Regularly descend sustained steep grades (alpine gravel, mountain passes)</li>
                            <li>Experience brake fade or boiling fluid during descents</li>
                        </ul>

                        <p className="mt-4">For a compatibility check on your specific frame, fork, caliper, and rotor combination, see the <Link href="/guides/brake-mount-standards" className="text-cyan-400 hover:underline">CrankSmith Brake Mount Standards Guide</Link>.</p>
                    </div>

                    <BlogCTA heading="Check Your Brake × Rotor × Frame Compatibility" sub="Enter your frame, fork, and caliper to validate rotor size limits and adapter requirements." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
