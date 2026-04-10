import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "The Big Tire Revolution | Gravel Tire Width Guide 2026",
    description: "Comprehensive guide to the 45mm+ gravel tire revolution. Everything you need to know about wider tires, clearance, pressure, and real-world performance.",
    keywords: ["gravel tire width", "big tire revolution", "45mm gravel tire", "2.25 inch gravel tire", "gravel tire clearance", "wide gravel tires", "gravel bike tire pressure"],
    openGraph: {
        title: "The Big Tire Revolution | Gravel Tire Width Guide 2026",
        description: "Comprehensive guide to the 45mm+ gravel tire revolution.",
        type: "website",
    }
};

export default function BigTireRevolutionPage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <article className="container mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Hub Page • The Big Tire Revolution</div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">The Big Tire Revolution</h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        45mm is the new minimum. 2.25″ MTB tires now fit on gravel frames. This hub covers everything you need to know about the wider tire movement.
                    </p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                    <p className="lead text-xl text-stone-200">
                        The gravel bike scene has shifted dramatically in 2026. Where 35–40mm tires were once the norm, <strong>45mm is now the accepted minimum</strong> for general gravel riding, and frames are clearing 50–57mm (2.25″ MTB tires) as standard.
                    </p>

                    <h2 className="text-white mt-12 mb-6">Why Wider Tires Win</h2>
                    <p>Wider gravel tires aren’t just a trend—they’re backed by physics and rider experience:</p>
                    <ul>
                        <li><strong>Lower rolling resistance on rough surfaces</strong> – The tire conforms to the ground instead of bouncing.</li>
                        <li><strong>Better puncture protection</strong> – More rubber between you and debris.</li>
                        <li><strong>Lower pressure = more grip & comfort</strong> – You can safely drop PSI without pinch flats.</li>
                        <li><strong>Increased confidence in corners</strong> – A larger contact patch means more traction.</li>
                    </ul>

                    <h2 className="text-white mt-12 mb-6">The 45mm Standard</h2>
                    <p>45mm has emerged as the sweet spot for most gravel riders. It’s wide enough to excel on real gravel while still feeling planted on pavement. Every new 2026 gravel frame clears at least 50mm, making 45mm a safe, future‑proof choice.</p>

                    <h2 className="text-white mt-12 mb-6">2.25″ MTB Tires on Gravel Bikes</h2>
                    <p>Some frames now officially clear 57mm (2.25″) tires. When you cross that line, your gravel bike becomes a lightweight MTB. The benefits are immense on technical terrain, but there are trade‑offs in weight and pavement feel.</p>

                    <div className="my-12 bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Explore the Cluster Posts</h3>
                        <p className="text-gray-300 mb-6">Deep dives on each aspect of the big‑tire movement:</p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link
                                href="/blog/45mm-is-the-new-minimum-gravel-tire"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">45mm Is the New Minimum Gravel Tire</h4>
                                <p className="text-gray-400 text-sm">Why 45mm has become the baseline for general gravel riding.</p>
                            </Link>
                            <Link
                                href="/blog/gravel-tire-pressure-by-width-the-definitive-guide"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Gravel Tire Pressure by Width</h4>
                                <p className="text-gray-400 text-sm">Optimal PSI for 40mm, 45mm, 50mm, 55mm, and 2.25″ tires.</p>
                            </Link>
                            <Link
                                href="/blog/every-gravel-frame-that-fits-2-25-inch-tires"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">Every Gravel Frame That Fits 2.25″ Tires</h4>
                                <p className="text-gray-400 text-sm">A definitive list of frames with 57mm+ clearance.</p>
                            </Link>
                            <Link
                                href="/blog/2-25-inch-gravel-tires-when-your-gravel-bike-becomes-a-light-mtb"
                                className="block p-6 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500 transition-all"
                            >
                                <h4 className="text-xl font-bold text-white mb-2">2.25″ Gravel Tires: When Your Gravel Bike Becomes a Light MTB</h4>
                                <p className="text-gray-400 text-sm">What changes when you put MTB rubber on a 700c gravel frame.</p>
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-white mt-12 mb-6">How to Choose Your Tire Width</h2>
                    <p>Selecting the right width depends on your terrain, riding style, and frame clearance:</p>
                    <ul>
                        <li><strong>40–45mm:</strong> Ideal for mixed road/gravel, fast group rides, and riders who prioritize speed on pavement.</li>
                        <li><strong>45–50mm:</strong> The sweet spot for most pure gravel riding. Enough volume for comfort and grip without feeling ponderous.</li>
                        <li><strong>50–57mm (2.25″):</strong> For technical terrain, bikepacking, and riders who want maximum capability off‑road.</li>
                    </ul>

                    <div className="my-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-4">Check Your Frame’s Clearance</h3>
                        <p className="text-gray-300 mb-6">The CrankSmith builder lets you enter your frame model and target tire size to validate fitment—including mud clearance that manufacturers often omit.</p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Open Builder
                        </Link>
                    </div>

                    <h2 className="text-white mt-12 mb-6">Tire Pressure Matters</h2>
                    <p>Wider tires allow lower pressures, but you still need to stay within safe limits. Use our tire pressure calculator to get personalized PSI recommendations for your weight, tire width, and terrain.</p>
                    <p>Cross‑link: For e‑gravel bikes, see <Link href="https://ebikepsi.com" className="text-cyan-400 hover:underline">ebikepsi.com</Link> for specific e‑bike tire pressure guidance.</p>
                </div>
            </article>
        </div>
    );
}