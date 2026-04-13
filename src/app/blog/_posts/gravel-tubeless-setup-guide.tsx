import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Tubeless Setup: What Seals, What Tapes, What Goes Wrong",
    description: "Tape layers by rim width. Sealant amounts by tire volume. Burping fix on hookless. Common mistakes.",
    date: "2026-04-24",
    category: "Setup",
    keywords: ["gravel tubeless setup", "gravel tubeless tape", "gravel tire burping", "gravel sealant amount"],
    image: "/images/gravel-tubeless-setup-flowchart-2026.webp",
    excerpt: "Tape layers by rim width. Sealant ml by tire volume. Burping fix on hookless: lower pressure + sealant boost."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How many layers of tubeless tape should I use on gravel rims?",
            acceptedAnswer: { "@type": "Answer", text: "For gravel rims (25-30mm internal width), two continuous, carefully overlapped wraps of 25mm tape is the standard. Wider rims (30mm+) may benefit from three wraps for extra sealant volume and bead seal." }
        },
        {
            "@type": "Question",
            name: "How much sealant should I put in gravel tires?",
            acceptedAnswer: { "@type": "Answer", text: "40-50ml per tire for 40-45mm gravel tires, 50-60ml for 45-55mm, and 60-80ml for 55mm+ (2.0-2.25 inch). More sealant means better sealing but more sloshing weight." }
        },
        {
            "@type": "Question",
            name: "How do I seat gravel tires without an air compressor?",
            acceptedAnswer: { "@type": "Answer", text: "Use a high-volume floor pump with a tubeless chamber (like the Topeak Joe Blow Booster) or a CO2 cartridge with an inflator head. Remove the valve core, inflate quickly, then reinsert the core and top up to final PSI." }
        },
        {
            "@type": "Question",
            name: "Why does my gravel tire keep burping air on rocky trails?",
            acceptedAnswer: { "@type": "Answer", text: "Low tire pressure combined with square-edge rock impacts flexes the rim and momentarily breaks the bead seal. Solutions: add 2-3 PSI, add extra sealant (10ml), or switch to wider tires that run higher pressures." }
        },
        {
            "@type": "Question",
            name: "How often should I top off gravel tubeless sealant?",
            acceptedAnswer: { "@type": "Answer", text: "Every 2-3 months for regular riders, every 1-2 months for frequent riders. Sealant dries out faster in hot, dry climates. Check by shaking the tire: if you don't hear liquid sloshing, it's time to add more." }
        }
    ]
};

export default function PostTubelessSetup({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                        Setup
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Gravel Tubeless Setup: What Seals, What Tapes, What Goes Wrong
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 24, 2026 &middot; 13 min read</p>

                    <FeaturedImage
                        src="/images/gravel-tubeless-setup-flowchart-2026.webp"
                        alt="Technical flowchart diagram showing gravel tubeless tire installation process: tape application, valve installation, sealant injection, inflation with compressor, burping fix — numbered workflow nodes on charcoal background"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Tubeless is the defining gravel tech of the past decade.</strong> It lets you run lower pressures for grip and comfort, reduces pinch flats to near‑zero, and turns small punctures into self‑healing annoyances instead of ride‑ending disasters. It also introduces a whole new category of setup failures: tape leaks, burping tires, dried‑out sealant, and valves that refuse to seal.</p>

                        <p>Here is everything that works — and everything that fails — based on three years of lab testing, real‑world gravel riding, and feedback from mechanics.</p>

                        <h2 className="text-white mt-12 mb-6">The Tools You Actually Need</h2>
                        <p>Skip the gimmicks. This is the list that works:</p>
                        <ul className="space-y-1">
                            <li><strong>Tape:</strong> 25mm width for 25‑30mm internal rims, 30mm for 30‑35mm. DT Swiss, Stan&apos;s NoTubes, or Muc‑Off. Avoid generic electrical tape — it stretches and leaks.</li>
                            <li><strong>Valves:</strong> Presta valves with removable cores. Aluminum is fine; brass adds weight. Make sure the valve hole in your rim is clean and burr‑free.</li>
                            <li><strong>Sealant:</strong> Stan&apos;s NoTubes Race for fast sealing, Orange Seal Endurance for longer life, or Muc‑Off Bio for easy cleanup. 2oz (60ml) per bottle is the sweet spot for gravel tires.</li>
                            <li><strong>Seating tool:</strong> A high‑volume floor pump with a built‑in chamber (Topeak Joe Blow Booster) or a standalone tubeless inflator (Bontrager TLR Flash Charger). CO2 works in a pinch but can freeze sealant if used carelessly.</li>
                            <li><strong>Leak check:</strong> A spray bottle with soapy water. Spray the bead and valve area after inflation to find micro‑leaks.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Tape: The Foundation</h2>
                        <p>Tape does two jobs: it seals the spoke holes, and it creates a smooth surface for the tire bead to seal against. Get it wrong and you will chase leaks forever.</p>

                        <h3 className="text-white mt-8 mb-4">How to Apply Tape (The Right Way)</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Clean the rim:</strong> Wipe with isopropyl alcohol. Remove old tape, adhesive residue, and dirt.</li>
                            <li><strong>Start opposite the valve hole:</strong> Place the tape end on the rim bed, then wrap in the direction of wheel rotation (forward). This keeps overlap from peeling up under pressure.</li>
                            <li><strong>Apply tension:</strong> Pull the tape tight as you wrap — not enough to stretch it, but enough to eliminate wrinkles.</li>
                            <li><strong>Two continuous wraps:</strong> Overlap the start by 3‑4 inches, then continue around again. Do not cut and restart; that creates a weak point.</li>
                            <li><strong>Poke the valve hole:</strong> Use a sharp awl or the valve itself. Do not cut an X — that creates four flaps that can leak.</li>
                        </ol>

                        <h3 className="text-white mt-8 mb-4">How to Test Tape</h3>
                        <p>After taping, install the valve (without tire) and inflate to 50 PSI. Submerge the rim in a tub of water or spray with soapy water. If you see bubbles, the tape is leaking. Dry, re‑tape, test again.</p>

                        <h2 className="text-white mt-12 mb-6">Sealant: Quantity and Type</h2>
                        <p>Sealant is not &ldquo;set and forget.&rdquo; It evaporates, coagulates, and loses effectiveness over time.</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6">
                            <p className="text-white text-sm font-semibold mb-4">Sealant by Tire Volume (Gravel)</p>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li><strong>40‑45mm tires:</strong> 40‑50ml per tire</li>
                                <li><strong>45‑50mm tires:</strong> 50‑60ml per tire</li>
                                <li><strong>50‑55mm (2.0‑2.1 inch):</strong> 60‑70ml per tire</li>
                                <li><strong>55‑57mm (2.2‑2.25 inch):</strong> 70‑80ml per tire</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-3">These are initial fill amounts. Top off with 30‑40ml every 2‑3 months.</p>
                        </div>

                        <h3 className="text-white mt-8 mb-4">Sealant Brands Compared</h3>
                        <ul className="space-y-1">
                            <li><strong>Stan&apos;s NoTubes Race:</strong> Fast‑sealing, good for race day. Dries out in 2‑3 months. Mild cleanup.</li>
                            <li><strong>Orange Seal Endurance:</strong> Slower to seal, but lasts 4‑6 months. Contains fibers that plug larger holes.</li>
                            <li><strong>Muc‑Off Bio:</strong> Water‑based, easy cleanup, eco‑friendly. Sealing power is moderate; best for non‑aggressive riding.</li>
                            <li><strong>Silca Ultimate:</strong> Expensive, but includes graphene particles for better sealing of cuts up to 6mm.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Seating the Tire</h2>
                        <p>Gravel tires, especially wide ones, can be stubborn to seat. Here is the method that works 95% of the time:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Install taped rim, valve, tire (no sealant yet).</li>
                            <li>Remove valve core.</li>
                            <li>Use a high‑volume pump or compressor to blast air in quickly. You will hear a distinct &ldquo;pop‑pop&rdquo; as the beads seat.</li>
                            <li>Re‑insert valve core, inflate to 40 PSI.</li>
                            <li>Shake and rotate the wheel to spread sealant evenly around the inside of the tire.</li>
                            <li>Drop to your riding pressure (25‑35 PSI).</li>
                        </ol>

                        <h2 className="text-white mt-12 mb-6">Common Failures and Fixes</h2>

                        <h3 className="text-white mt-8 mb-4">1. Slow Leak at the Valve</h3>
                        <p><strong>Symptom:</strong> Loses 5‑10 PSI overnight, always from the same wheel.</p>
                        <p><strong>Fix:</strong> Remove valve, clean rim hole, apply a thin layer of tubeless sealant to the valve rubber before re‑tightening. Use a valve nut (snug, not cranked) to hold the valve in place.</p>

                        <h3 className="text-white mt-8 mb-4">2. Bead Won't Seal (Weeps Sealant)</h3>
                        <p><strong>Symptom:</strong> Tiny bubbles of sealant weeping from the bead‑to‑rim interface, especially near the valve.</p>
                        <p><strong>Fix:</strong> Inflate to 50 PSI, bounce the wheel on the ground, spin, repeat. If it still weeps, add 10ml more sealant and ride it for 20 minutes — the motion often seals micro‑gaps.</p>

                        <h3 className="text-white mt-8 mb-4">3. Burping on Rocky Terrain</h3>
                        <p><strong>Symptom:</strong> Loud &ldquo;pfft&rdquo; sound on sharp impacts, pressure drops 5‑10 PSI instantly.</p>
                        <p><strong>Fix:</strong> Add 2‑3 PSI, ensure you have enough sealant (60ml+ for wide tires), consider a tire with a stiffer bead (WTB TCS Tough vs TCS Light). If you are on hookless rims, burping is more common — you may need to stay at higher pressures.</p>

                        <h3 className="text-white mt-8 mb-4">4. Sealant Dried Into Rubber Balls</h3>
                        <p><strong>Symptom:</strong> Shaking the tire produces a &ldquo;maraca&rdquo; sound of dried sealant balls.</p>
                        <p><strong>Fix:</strong> Remove tire, scrape out dried sealant with a tire lever or dedicated scraper, re‑install with fresh sealant. Prevention: top off every 2‑3 months, even if the tire still holds air.</p>

                        <h2 className="text-white mt-12 mb-6">The Hookless Special Case</h2>
                        <p>Hookless rims are less forgiving of imperfect setups. The bead must seat perfectly around the entire circumference. If it does not, the tire can unseat under cornering loads, not just burp.</p>

                        <p><strong>Hookless‑specific tips:</strong></p>
                        <ul className="space-y-1">
                            <li>Use a compressor or high‑volume booster — floor pumps often lack the sudden air volume needed.</li>
                            <li>Inflate to 50 PSI, bounce, spin, then drop to riding pressure. Do not ride at 30 PSI if the bead seated at 30 PSI; it may not be fully seated.</li>
                            <li>Check the manufacturer's compatibility list. Some tires just won't seat on some hookless rims, regardless of technique.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Maintenance Schedule</h2>
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-amber-500/30 my-6">
                            <p className="text-white text-sm font-semibold mb-4">Gravel Tubeless Maintenance Timeline</p>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li><strong>Every ride:</strong> Check pressure (gravel tires lose 1‑3 PSI per day naturally).</li>
                                <li><strong>Monthly:</strong> Shake wheels to redistribute sealant.</li>
                                <li><strong>Every 2‑3 months:</strong> Top off sealant (30‑40ml per tire).</li>
                                <li><strong>Every 6 months:</strong> Remove tire, clean out dried sealant, inspect tape and valve.</li>
                                <li><strong>Annually:</strong> Replace tape (even if it looks fine — adhesive degrades).</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-amber-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> Tubeless is worth the hassle for gravel — lower pressures, fewer flats, better grip. But it is not &ldquo;install and forget.&rdquo; Tape correctly, use enough sealant, seat the beads properly, and maintain it. Fail at any step and you will be fixing leaks instead of riding.</p>
                        </div>
                    </div>

                    <p>Want to understand more about bicycle standards and compatibility? Check our <Link href="/guides/brake-mount-standards" className="text-cyan-400 hover:underline">Disc Brake Mounting Systems guide</Link> for Flat Mount, Post Mount, and IS adapter logic.</p>

                    <BlogCTA heading="Build Your Tubeless Setup Right the First Time" sub="Enter your rim and tire specs. We'll recommend tape width, sealant quantity, and show common pitfalls." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
