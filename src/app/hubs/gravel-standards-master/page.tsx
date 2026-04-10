import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gravel Standards Master | Hookless, BB, Suspension, Tubeless",
    description: "Complete guide to gravel bike standards: hookless vs hooked rims, bottom bracket types, suspension forks, and tubeless setup.",
    keywords: ["gravel bike standards", "hookless rims", "bottom bracket standards", "gravel suspension fork", "tubeless gravel", "T47 vs PF30", "flat mount brakes"],
    openGraph: {
        title: "Gravel Standards Master | Hookless, BB, Suspension, Tubeless",
        description: "Complete guide to gravel bike standards for 2026.",
        type: "website",
    }
};

export default function GravelStandardsMasterPage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <article className="container mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Hub Page • Gravel Standards Master</div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Gravel Standards Master</h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Hookless rims, bottom bracket types, suspension forks, and tubeless setup—the standards that define modern gravel bikes.
                    </p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                    <p className="lead text-xl text-stone-200">
                        Gravel bikes have inherited standards from road, mountain, and cyclocross—but not all of them work well together. <strong>Hookless rims, T47 bottom brackets, short‑travel suspension forks, and tubeless setups</strong> are now central to the 2026 gravel experience.
                    </p>

                    <h2 className="text-white mt-12 mb-6">Hookless vs Hooked Rims</h2>
                    <p>Hookless rims are lighter, stronger, and cheaper to manufacture—but they come with strict compatibility rules.</p>
                    <ul>
                        <li><strong>Max pressure:</strong> 72.5 PSI (5 bar) per ETRTO/ISO standards.</li>
                        <li><strong>Tire compatibility:</strong> Only use tires marked “hookless compatible.”</li>
                        <li><strong>Rim‑width match:</strong> Tire width must be at least 1.5× the internal rim width (e.g., 28 mm internal needs a 42 mm+ tire).</li>
                        <li><strong>Burping risk:</strong> Lower pressures reduce risk, but improper combos can cause sudden air loss.</li>
                    </ul>
                    <p><strong>Hooked rims</strong> are more forgiving and allow higher pressures, but they’re heavier and often more expensive.</p>

                    <h2 className="text-white mt-12 mb-6">Bottom Bracket Standards</h2>
                    <p>The bottom bracket is the most notorious source of creaks. Knowing your shell type is essential.</p>
                    <div className="grid md:grid-cols-3 gap-4 my-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold">BSA (Threaded)</h3>
                            <p className="text-sm text-gray-400">The classic. Reliable, creak‑free, easy to service. Limited to 24 mm spindles (Shimano HTII).</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold">T47 (Threaded)</h3>
                            <p className="text-sm text-gray-400">The modern savior. PF30 diameter with threads—no creaks, fits 30 mm spindles. Becoming universal.</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold">PF30 (Press‑Fit)</h3>
                            <p className="text-sm text-gray-400">Lightweight but prone to creaking. Requires precise manufacturing. Best upgraded to T47 via adapters.</p>
                        </div>
                    </div>

                    <h2 className="text-white mt-12 mb-6">Suspension Forks on Gravel Bikes</h2>
                    <p>Short‑travel forks (30–40 mm) are gaining acceptance. The RockShox Rudy 30 mm is the gold standard.</p>
                    <ul>
                        <li><strong>Weight penalty:</strong> ~400 g heavier than a rigid carbon fork.</li>
                        <li><strong>Speed gain:</strong> On rough terrain, a suspension fork can be faster than a wider tire because it keeps the bike tracking straight.</li>
                        <li><strong>Who needs it:</strong> Riders tackling chunky gravel, washboard, or long‑distance events where comfort equals speed.</li>
                    </ul>
                    <p>Elite racers are pairing <strong>narrow tires with suspension</strong> instead of wide tires + rigid—a sign that suspension is becoming a performance tool, not just a comfort item.</p>

                    <h2 className="text-white mt-12 mb-6">Tubeless Setup for Gravel</h2>
                    <p>Tubeless is non‑negotiable for serious gravel riding. The benefits are flat protection, lower pressures, and better ride quality.</p>
                    <ul>
                        <li><strong>Sealant:</strong> 60–90 ml per tire for 45–50 mm widths. Refresh every 3–6 months.</li>
                        <li><strong>Tape:</strong> Two layers of 30 mm tape for a 25 mm internal rim. Always overlap at the valve.</li>
                        <li><strong>Burping fix:</strong> On hookless rims, lower pressure slightly and add more sealant.</li>
                        <li><strong>Valves:</strong> Presta 40–60 mm length, with removable cores for easy sealant injection.</li>
                    </ul>

                    <div className="my-12 bg-gradient-to-r from-amber-900/30 to-rose-900/30 p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Explore the Cluster Posts</h3>
                        <p className="text-gray-300 mb-6">Deep dives on each standard:</p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link
                                href="/blog/hookless-vs-hooked-gravel-wheels-the-safety-guide-that-actually-matters"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Hookless vs Hooked Gravel Wheels: The Safety Guide</h4>
                                <p className="text-gray-400 text-sm">ETRTO standards, max pressures, and compatibility rules you must follow.</p>
                            </Link>
                            <Link
                                href="/blog/rockshox-rudy-vs-rigid-fork-is-gravel-suspension-worth-it-in-2026"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">RockShox Rudy vs Rigid Fork</h4>
                                <p className="text-gray-400 text-sm">Weight penalty, speed gain, and who should consider a suspension fork.</p>
                            </Link>
                            <Link
                                href="/blog/gravel-tubeless-setup-what-seals-what-tapes-what-goes-wrong"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Gravel Tubeless Setup</h4>
                                <p className="text-gray-400 text-sm">Sealant amounts, tape layers, valve types, and burping fixes.</p>
                            </Link>
                            <Link
                                href="/guides/bottom-bracket-standards"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Bottom Bracket Standards Guide</h4>
                                <p className="text-gray-400 text-sm">BSA, PF30, T47, and DUB—what they are and how to avoid creaks.</p>
                            </Link>
                            <Link
                                href="/guides/brake-mount-standards"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Brake Mount Standards Guide</h4>
                                <p className="text-gray-400 text-sm">Flat Mount vs Post Mount vs IS—adapter logic and rotor‑size limits.</p>
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-white mt-12 mb-6">Brake Mount Standards</h2>
                    <p>Gravel bikes use a mix of Flat Mount (road‑style) and Post Mount (MTB‑style).</p>
                    <ul>
                        <li><strong>Flat Mount:</strong> Sleek, integrated, but limited to 160 mm rotors front (180 mm with an adapter).</li>
                        <li><strong>Post Mount:</strong> Bulky but robust, supports up to 200 mm rotors with adapters.</li>
                        <li><strong>IS (International Standard):</strong> Legacy standard that always requires an adapter.</li>
                    </ul>
                    <p>You cannot put Flat Mount calipers on a Post Mount frame, but you can adapt Post Mount calipers to a Flat Mount frame (with a bulky adapter).</p>

                    <div className="my-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Check Your Standards in CrankSmith</h3>
                        <p className="text-gray-300 mb-6">The CrankSmith builder validates compatibility between your frame, wheels, brakes, and bottom bracket. Enter your parts and see if they match—before you build.</p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Open Builder
                        </Link>
                    </div>

                    <h2 className="text-white mt-12 mb-6">The 2026 Standards Outlook</h2>
                    <ul>
                        <li><strong>Hookless dominance:</strong> Most new wheelsets are hookless. Know the rules.</li>
                        <li><strong>T47 everywhere:</strong> New frames are adopting T47 threaded shells.</li>
                        <li><strong>Suspension acceptance:</strong> Short‑travel forks are moving from niche to mainstream.</li>
                        <li><strong>Tubeless default:</strong> All serious gravel wheels ship tubeless‑ready; tubes are for emergencies only.</li>
                    </ul>
                </div>
            </article>
        </div>
    );
}