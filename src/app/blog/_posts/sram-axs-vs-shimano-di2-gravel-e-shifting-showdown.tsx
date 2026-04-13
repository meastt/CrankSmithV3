import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "SRAM AXS vs Shimano Di2 for Gravel: E-Shifting Showdown",
    description: "SRAM AXS vs Shimano Di2 for gravel — battery life, weight, customization, cross-compatibility, crash recovery, and the honest price comparison for 2026.",
    date: "2026-05-02",
    category: "Drivetrain",
    keywords: ["SRAM AXS vs Shimano Di2 gravel", "best electronic gravel groupset", "AXS vs Di2 battery life", "electronic gravel drivetrain 2026", "wireless vs wired gravel shifting"],
    image: "/images/sram-axs-vs-shimano-di2-gravel-e-shifting.webp",
    excerpt: "SRAM is wireless. Shimano is wired. Both are excellent. Here's the 2026 comparison you actually need to make the call."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Is SRAM AXS or Shimano Di2 better for gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Both are excellent — the choice comes down to priorities. SRAM AXS is fully wireless (no cables to route), offers better ecosystem integration (dropper posts, power meters all via AXS), and has superior customization via the AXS app. Shimano Di2 is wired (easier battery management, no separate module), has an outstanding track record for reliability, and GRX Di2 is typically $300-500 less than SRAM Force AXS at equivalent spec." } },
        { "@type": "Question", "name": "How long does SRAM AXS battery last on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "SRAM AXS derailleur batteries last approximately 60 hours of active shifting. The shifter pods use CR2032 coin cells lasting 1-2 years of typical riding. For a 100-mile gravel event, a single charge has more than enough capacity. For bikepacking expeditions of 5-7+ days with no charging ability, you'd need to carry a USB-C backup power source for the derailleur." } },
        { "@type": "Question", "name": "Can you use SRAM shifters with Shimano derailleurs?", "acceptedAnswer": { "@type": "Answer", "text": "No — SRAM and Shimano electronic systems are not cross-compatible. Each uses proprietary communication protocols. The only cross-brand electronic solution is using SRAM mechanical shifters with a Tanpan or ShiftMate adapter to a Shimano electronic derailleur, but this is a workaround, not a native integration." } },
        { "@type": "Question", "name": "What happens to SRAM AXS after a crash?", "acceptedAnswer": { "@type": "Answer", "text": "SRAM AXS derailleurs have a 'CrashGuard' mechanism that allows the derailleur to pivot backward under impact and spring back into position. This protects against hanger damage far better than mechanical systems. In field reports, AXS derailleurs survive hanger-benders that would destroy a mechanical derailleur. The wireless nature also means no cable housing to damage." } },
        { "@type": "Question", "name": "Is electronic shifting worth it on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "For riders who race or do long events: yes. Electronic shifting delivers precise shifts under load (useful on steep climbs), eliminates cable stretch causing missed shifts mid-race, and (for AXS) removes cable routing entirely from long remote bikepacking routes. For recreational riders, the $500-800 premium over a comparable mechanical groupset is harder to justify — mechanical shifting on quality components (GRX 600, SRAM Rival) is completely reliable for most riding." } }
    ]
};

export default function PostAXSvsDi2({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • May 2, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">SRAM AXS vs Shimano Di2 for Gravel: E-Shifting Showdown</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">SRAM is wireless. Shimano is wired. Both are excellent. Here&apos;s the 2026 comparison you actually need to make the call.</p>
                    </div>

                    <FeaturedImage
                        src="/images/sram-axs-vs-shimano-di2-gravel-e-shifting.webp"
                        alt="SRAM AXS wireless and Shimano Di2 wired gravel bike shifter hoods facing each other — CrankSmith e-shifting comparison 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/shimano-grx-vs-sram-axs-xplr-vs-campagnolo-ekar-2026" className="text-cyan-400 hover:underline">Full 3-Way Groupset Comparison (incl. Campagnolo Ekar)</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Both SRAM AXS and Shimano Di2 deliver flawless electronic shifting. The real differences are in architecture — wireless vs wired, ecosystem depth, crash behavior, and total cost. Here&apos;s the honest head-to-head for gravel in 2026.
                        </p>

                        <h2 className="text-white mt-12 mb-6">Head-to-Head Comparison</h2>

                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Category</th>
                                        <th className="text-left p-3 text-green-400">SRAM Force AXS</th>
                                        <th className="text-left p-3 text-cyan-400">Shimano GRX Di2</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Connection", "Fully wireless (no cables)", "Wired (E-tube internal)"],
                                        ["Battery", "90h derailleur + CR2032 pods", "Internal junction + satellite pods, ~1,000km"],
                                        ["Charging", "USB-C, ~1h full charge", "USB-A port, charges in-frame"],
                                        ["App", "AXS app — full customization", "E-Tube Project — solid, less depth"],
                                        ["Ecosystem", "AXS dropper, PM, all interconnected", "Di2 only — brakes separate"],
                                        ["Crash protection", "CrashGuard — bounces back from impacts", "Standard derailleur — more hanger damage risk"],
                                        ["Cable routing", "Clean — zero cables from shifter", "E-tube wires still need routing"],
                                        ["Shift quality", "Excellent — decisive and fast", "Excellent — smooth, precise"],
                                        ["Customization", "Multi-shift, auto-trim, satellite pods", "Synchro Shift, Di2 satellite switches"],
                                        ["Price (complete)", "$1,500–$2,200 Force level", "$1,200–$1,700 GRX Di2 level"],
                                    ].map(([cat, sram, shimano]) => (
                                        <tr key={cat} className="hover:bg-white/5">
                                            <td className="p-3 text-gray-400 font-medium">{cat}</td>
                                            <td className="p-3 text-green-200">{sram}</td>
                                            <td className="p-3 text-cyan-200">{shimano}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Decisive Differences</h2>

                        <div className="my-6 space-y-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-green-500/20">
                                <h3 className="text-green-400 font-bold mb-2">SRAM AXS Wins On: Wireless Freedom + Ecosystem</h3>
                                <p className="text-sm text-gray-300">No cables from shifters to derailleur fundamentally changes frame routing. On adventure gravel bikes with complex internal routing, AXS is dramatically easier to maintain and modifies cleanly. The AXS ecosystem is the clincher for SRAM users: one app controls shifting, dropper post, and power meter. Battery swapping the derailleur takes 15 seconds. For bikepacking, CrashGuard&apos;s impact recovery is a real-world advantage.</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-cyan-500/20">
                                <h3 className="text-cyan-400 font-bold mb-2">Shimano Di2 Wins On: Value + Reliability Track Record</h3>
                                <p className="text-sm text-gray-300">GRX Di2 is $300-500 less than Force AXS at equivalent spec. The wired E-tube system has a decade-plus track record across every major race on earth. Battery management is simpler — one charge point, linear indicator, no pod batteries to track. For riders who just want flawless shifting without managing multiple components, Di2&apos;s system architecture is simpler. Shimano&apos;s brake feel also remains slightly preferred by many GRX users.</p>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Verdict by Rider Type</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { type: "Racing / gran fondos", pick: "Either — equal shifting performance. SRAM for ecosystem, Di2 for value." },
                                { type: "Bikepacking / multi-day", pick: "SRAM AXS — CrashGuard, cable-free, ecosystem. Bring backup USB-C power." },
                                { type: "Budget-conscious upgrader", pick: "Shimano GRX Di2 — $400-500 less, equal performance." },
                                { type: "SRAM AXS user already (dropper, PM)", pick: "SRAM AXS — ecosystem integration is genuinely useful." },
                                { type: "Undecided between mechanical and e-shifting", pick: "Try mechanical GRX 820 first. E-shifting is a luxury, not a requirement." },
                            ].map(({ type, pick }) => (
                                <div key={type} className="flex gap-4 items-start bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-gray-300 text-sm w-52 shrink-0">{type}</span>
                                    <span className="text-cyan-300 text-sm">{pick}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <BlogCTA heading="Build With Either System" sub="Enter your AXS or Di2 components in CrankSmith to compare compatibility and see the full gear range." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
