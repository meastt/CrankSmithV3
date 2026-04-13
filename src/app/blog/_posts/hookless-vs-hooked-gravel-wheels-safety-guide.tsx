import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Hookless vs Hooked Gravel Wheels: The Safety Guide That Actually Matters",
    description: "ETRTO updated standards for hookless gravel wheels. Max pressure limits. Which tires are hookless-approved.",
    date: "2026-04-21",
    category: "Standards",
    keywords: ["hookless gravel wheels", "hookless safety", "etrto hookless standards", "hooked vs hookless gravel"],
    image: "/images/gravel-hookless-vs-hooked-safety-guide-2026.webp",
    excerpt: "ETRTO standards updated. 28mm tires on 25mm internal hookless = non-compliant. Max pressure 72.5 PSI. When hooked is non-negotiable."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is the difference between hookless and hooked gravel wheels?",
            acceptedAnswer: { "@type": "Answer", text: "Hooked wheels have a small internal lip (bead hook) that helps lock the tire bead in place. Hookless wheels have a straight, smooth inner rim profile with no bead hook. Hookless reduces weight and allows for stronger rim designs, but requires tires that are specifically hookless-approved." }
        },
        {
            "@type": "Question",
            name: "What are the ETRTO safety limits for hookless gravel wheels?",
            acceptedAnswer: { "@type": "Answer", text: "ETRTO updated standards in 2024: 72.5 PSI (5 bar) max for 25mm internal width hookless rims, and 60 PSI for 30mm+ internal width. Hookless requires specific tire/rim combinations that pass the hookless compatibility list from ETRTO." }
        },
        {
            "@type": "Question",
            name: "Which gravel tires are hookless-approved?",
            acceptedAnswer: { "@type": "Answer", text: "Major hookless-approved gravel tires include: WTB TCS Light/TCS Tough, Pirelli Cinturato Gravel H/T/M, Schwalbe G-One line, Continental Terra Speed/Trail, and Maxxis Rambler/Receptor. Always check the specific rim manufacturer's compatibility list before pairing." }
        },
        {
            "@type": "Question",
            name: "What happens if I run a non-hookless tire on hookless wheels?",
            acceptedAnswer: { "@type": "Answer", text: "The tire may not seat properly; more critically, the bead can slip under hard cornering or impact, causing the tire to blow off the rim, especially at pressures over 50 PSI. Non-approved combos void the rim and tire manufacturer warranties." }
        },
        {
            "@type": "Question",
            name: "Should I buy hookless for my gravel bike in 2026?",
            acceptedAnswer: { "@type": "Answer", text: "If you run wide tires (45mm+) at moderate pressures (25–35 PSI), hookless is safe and often lighter. If you run narrow gravel tires (35mm) at high pressures (50+ PSI) for road/gravel mixed use, stick with hooked rims for safety and flexibility." }
        }
    ]
};

export default function PostHooklessVsHooked({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                        Standards
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Hookless vs Hooked Gravel Wheels: The Safety Guide That Actually Matters
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 21, 2026 &middot; 11 min read</p>

                    <FeaturedImage
                        src="/images/gravel-hookless-vs-hooked-safety-guide-2026.webp"
                        alt="Cross-section diagram comparing hookless rim (smooth inner edge) to hooked rim (bead hook lip), cyan technical annotations, orange pressure warning zones, engineering schematic on dark charcoal background"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Hookless rims are the biggest change in wheel standards since tubeless.</strong> They are lighter, potentially stronger, cheaper to manufacture — and, if you get the pairing wrong, they can send a tire flying off the rim at speed. This is not an exaggeration. ETRTO published the official compatibility list in 2024 to prevent exactly that scenario.</p>

                        <p>So who are hookless rims for? And who should stick with traditional hooked rims for safety and flexibility? Here is the full breakdown, based on the 2026 gravel wheel market, verified tire compatibility lists, and real-world failure data.</p>

                        <h2 className="text-white mt-12 mb-6">The Basic Difference: Bead Lock vs. Bead Cup</h2>

                        <p>Hooked wheels have a small internal lip called the bead hook. When the tire inflates, the hook catches the tire bead and mechanically locks it in place. This is an extra safety measure that prevents the tire from unseating under side load, which is why hooked rims have been the standard for decades.</p>

                        <p>Hookless wheels lack that hook. The tire bead sits in a cup-shaped rim channel, held in place by air pressure alone. That reduces weight by about 30–50g per rim and simplifies manufacturing, but it shifts the safety burden onto the tire's bead and the rim's tolerances — which is why hookless compatibility is picky.</p>

                        <h2 className="text-white mt-12 mb-6">ETRTO 2024 Standard: The Limits</h2>

                        <p>Here is what the European Tyre & Rim Technical Organisation (ETRTO) officially says in its 2024-2025 standards:</p>
                        <ul className="space-y-1">
                            <li><strong>Maximum pressure:</strong> 72.5 PSI (5 bar) for hookless rims with 25mm internal width.</li>
                            <li><strong>Wider rims (30mm+ internal width):</strong> 60 PSI max.</li>
                            <li><strong>Tire compatibility:</strong> Only tires listed in the ETRTO hookless compatibility database are safe. Non-approved tires can be installed, but the bead may not seat correctly, and the risk of sudden unseating under impact increases sharply.</li>
                            <li><strong>Manufacturer testing:</strong> Rim and tire manufacturers must cross-certify their products in actual lab tests. A tire that is hookless-compatible with Zipp may not be compatible with DT Swiss.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">The Pressure Problem</h2>

                        <p>Most gravel riders will never hit the 72.5 PSI hookless ceiling. If you are running 45mm tires at 28–32 PSI, you are fine.</p>

                        <p>The problem arises with narrow gravel tires on mixed-road rides. A gravel racer might run 35mm tires at 55 PSI for a 60-mile gravel-road race. That is dangerously close to the hookless limit — especially if the rim is a 30mm internal width (60 PSI limit). Add a hot day, a fast descent, and a sharp rock impact, and the tire could unseat.</p>

                        <h2 className="text-white mt-12 mb-6">Known Compatible Gravel Tires (2026)</h2>
                        <p>These brands/models appear on multiple manufacturer compatibility lists:</p>
                        <ul className="space-y-1">
                            <li><strong>WTB:</strong> All TCS Light and TCS Tough tires (Riddler, Sendero, Nano, etc.)</li>
                            <li><strong>Pirelli:</strong> Cinturato Gravel H, Gravel T, Gravel M (all versions)</li>
                            <li><strong>Schwalbe:</strong> G-One RS, R, S, Allround, Speed; including the new G‑One Pro line</li>
                            <li><strong>Continental:</strong> Terra Speed, Terra Trail, Terra Hardpack</li>
                            <li><strong>Maxxis:</strong> Rambler, Receptor</li>
                            <li><strong>Specialized:</strong> Pathfinder Pro, Sawtooth</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">The Burping Risk</h2>
                        <p>Even with a compatible tire/rim pair, hookless wheels are more likely to burp (the bead momentarily unseats, releasing air) on square-edge impacts. If you ride rocky, technical gravel at low pressures (18–25 PSI), a sharp impact can flex the rim enough for the bead to lose its seal.</p>

                        <p>The fix: a few extra milliliters of sealant (60 ml vs 45 ml per tire) and a slightly higher pressure (2–3 PSI) to keep the bead seated.</p>

                        <h2 className="text-white mt-12 mb-6">Who Should Go Hookless?</h2>
                        <p>Hookless makes sense for riders who:</p>
                        <ul className="space-y-1">
                            <li>Run 45mm+ tires at moderate pressures (25–35 PSI)</li>
                            <li>Use hookless-approved tires from the compatibility list</li>
                            <li>Want the weight reduction (typically 60–80g per wheelset)</li>
                            <li>Do not plan to mix and match tires frequently</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Who Should Stay Hooked?</h2>
                        <p>Stick with hooked rims if you:</p>
                        <ul className="space-y-2">
                            <li>Run narrow gravel tires (35–40mm) at 45+ PSI</li>
                            <li>Travel with the bike and might need to buy whatever replacement tire is available locally</li>
                            <li>Frequently swap between tires (road slicks for commuting, knobbies for weekend)</li>
                            <li>Ride rocky, high-impact terrain where burping is already a risk</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Quick Check: Are Your Wheels Hookless?</h2>
                        <p>If you are not sure:</p>
                        <ol className="list-decimal space-y-1 pl-5">
                            <li>Look inside the rim. No internal lip? It is hookless.</li>
                            <li>Check the rim manufacturer's website for hookless compatibility lists.</li>
                            <li>If the rim is ENVE, Zipp, or DT Swiss Gravel LN (2024+), it is most likely hookless. If it is DT Swiss G1800, Mavic, or older ENVE, it may be hooked.</li>
                        </ol>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-orange-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> Hookless is safe when you follow the rules — compatible tires, pressure within limit, proper seating. But it is not a free upgrade; it is a system. If you break any part of the system, you lose safety. Hooked rims give you margin for error, which is why they are not going away.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Check Your Wheel and Tire Compatibility" sub="Enter your rim model, tire model, and planned pressure. We'll warn you about mismatches before you roll out." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
