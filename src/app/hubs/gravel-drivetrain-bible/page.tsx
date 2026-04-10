import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gravel Drivetrain Bible | 1x vs 2x, Mullet Builds, Gear Ratios",
    description: "Complete guide to gravel drivetrain selection: 1x vs 2x, mullet compatibility, gear ratios, and real‑world gearing strategies for 2026.",
    keywords: ["gravel drivetrain", "1x vs 2x gravel", "mullet drivetrain", "gravel gear ratio", "gravel groupset", "sram axs gravel", "shimano grx"],
    openGraph: {
        title: "Gravel Drivetrain Bible | 1x vs 2x, Mullet Builds, Gear Ratios",
        description: "Complete guide to gravel drivetrain selection for 2026.",
        type: "website",
    }
};

export default function GravelDrivetrainBiblePage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <article className="container mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Hub Page • Gravel Drivetrain Bible</div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Gravel Drivetrain Bible</h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        1x vs 2x, mullet compatibility, gear ratios, and real‑world gearing strategies for the 2026 gravel season.
                    </p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                    <p className="lead text-xl text-stone-200">
                        Gravel drivetrains have evolved faster than any other component category. <strong>1x dominates, 2x is fading, and “mullet” builds</strong> (road shifters + MTB derailleurs) are the go‑to for riders who need massive range without sacrificing drop‑bar ergonomics.
                    </p>

                    <h2 className="text-white mt-12 mb-6">The 1x vs 2x Decision</h2>
                    <p>Choosing between a single chainring and a double isn’t about right or wrong—it’s about matching your terrain and riding style.</p>

                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">1x (One‑By)</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>Pros:</strong> Simplicity, better chain retention, lighter weight, no front derailleur to limit tire clearance.</li>
                                <li><strong>Range:</strong> Up to 520% (10‑52t cassettes).</li>
                                <li><strong>Cons:</strong> Larger jumps between gears (15–20% cadence changes).</li>
                                <li><strong>Best for:</strong> Technical gravel, bikepacking, riders who prioritize reliability over cadence perfection.</li>
                            </ul>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">2x (Two‑By)</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>Pros:</strong> Tight gear steps (8–10% jumps), ideal for maintaining optimal cadence on flats and rollers.</li>
                                <li><strong>Range:</strong> Typically 470–500%.</li>
                                <li><strong>Cons:</strong> Higher chain‑drop risk, front derailleur cage limits rear tire width.</li>
                                <li><strong>Best for:</strong> Mixed road/gravel, racing on rolling terrain, riders who value cadence consistency.</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-white mt-12 mb-6">The Mullet Revolution</h2>
                    <p>A “mullet” drivetrain pairs road or gravel shifters with a mountain‑bike rear derailleur and cassette. This unlocks MTB‑level range (10‑52t) while keeping drop‑bar hoods.</p>
                    <ul>
                        <li><strong>SRAM AXS:</strong> Native wireless compatibility. Any AXS Road shifter works with any AXS MTB derailleur.</li>
                        <li><strong>Shimano GRX:</strong> Mechanical setups need a cable‑pull converter (Wolf Tooth Tanpan). Di2 electronic mixing is possible with proper E‑Tube configuration.</li>
                    </ul>

                    <h2 className="text-white mt-12 mb-6">Gear Ratio Math</h2>
                    <p>Your tire width changes your effective gear inches. A 45mm tire has a ~6% larger circumference than a 35mm tire, making your gearing effectively taller. Always calculate gear inches with your actual tire size, not just the cassette numbers.</p>

                    <div className="my-12 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Explore the Cluster Posts</h3>
                        <p className="text-gray-300 mb-6">Deep dives on each aspect of gravel drivetrain selection:</p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link
                                href="/blog/the-gravel-mullet-road-shifter-mtb-derailleur"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">The Gravel Mullet: Road Shifter + MTB Derailleur</h4>
                                <p className="text-gray-400 text-sm">Every combo that actually works—SRAM AXS, Shimano GRX, Wolf Tooth Tanpan.</p>
                            </Link>
                            <Link
                                href="/blog/1x-vs-2x-gravel-2026-numbers"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">1x vs 2x on Gravel in 2026: The Actual Numbers</h4>
                                <p className="text-gray-400 text-sm">Gear‑range percentages, cadence gaps, and chain‑retention data.</p>
                            </Link>
                            <Link
                                href="/blog/how-your-bigger-gravel-tire-changes-your-actual-gear-ratio"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">How Your Bigger Gravel Tire Changes Your Actual Gear Ratio</h4>
                                <p className="text-gray-400 text-sm">Wider tires increase effective gear inches. Calculate the real difference.</p>
                            </Link>
                            <Link
                                href="/blog/unbound-gravel-2026-the-ultimate-tire-gear-setup-guide"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Unbound Gravel 2026: The Ultimate Tire & Gear Setup Guide</h4>
                                <p className="text-gray-400 text-sm">What pros run at the world’s biggest gravel race—and what regular riders can learn.</p>
                            </Link>
                            <Link
                                href="/blog/mid-south-2026-gearing-breakdown-what-pros-actually-ran"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Mid South 2026 Gearing Breakdown</h4>
                                <p className="text-gray-400 text-sm">Real setups from the red‑dirt gravel race—34×11‑42, 42×10‑46, and more.</p>
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-white mt-12 mb-6">Groupset Ecosystem Breakdown</h2>
                    <p>2026 brings more options than ever:</p>
                    <ul>
                        <li><strong>SRAM AXS XPLR:</strong> Wireless, 1x‑specific, 10‑44t cassette range. The premium choice.</li>
                        <li><strong>Shimano GRX:</strong> Mechanical and Di2 electronic, 1x and 2x variants. Still the reliability benchmark.</li>
                        <li><strong>SRAM Apex XPLR AXS:</strong> Affordable electronic shifting with hydraulic brakes.</li>
                        <li><strong>Shimano CUES:</strong> Budget‑friendly 1x and 2x groups that replace older Claris/Sora/Tiagra.</li>
                        <li><strong>Campagnolo Ekar:</strong> 13‑speed mechanical, 9‑42t cassette. Niche but loved by enthusiasts.</li>
                    </ul>

                    <div className="my-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Build Your Drivetrain in CrankSmith</h3>
                        <p className="text-gray-300 mb-6">The CrankSmith builder validates compatibility between shifters, derailleurs, cassettes, and cranksets. Enter your parts and see if they work together—before you buy.</p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Open Builder
                        </Link>
                    </div>

                    <h2 className="text-white mt-12 mb-6">Real‑World Gearing Strategies</h2>
                    <p>Your ideal gearing depends on your terrain:</p>
                    <ul>
                        <li><strong>Flat to rolling gravel:</strong> A 40‑42t chainring with a 10‑44t or 11‑40t cassette gives plenty of top‑end and enough low range for short climbs.</li>
                        <li><strong>Hilly/mountainous gravel:</strong> Drop to a 36‑38t chainring and pair it with a 10‑52t cassette for sub‑1:1 climbing gears.</li>
                        <li><strong>Mixed road/gravel:</strong> Consider 2x (46/30t or 48/31t) with an 11‑34t cassette for tight steps on the road and adequate low gears off‑road.</li>
                    </ul>
                </div>
            </article>
        </div>
    );
}