import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Tire Inserts: Are They Actually Worth $50?",
    description: "What tire inserts actually do for gravel, which brands perform well in 2026, the weight penalty reality, and whether you need them for your specific riding style.",
    date: "2026-05-03",
    category: "Big Tires",
    keywords: ["gravel tire inserts worth it", "best tire inserts gravel 2026", "CushCore gravel", "tire insert burp prevention", "gravel tubeless inserts"],
    image: "/images/gravel-tire-inserts-worth-it-2026.webp",
    excerpt: "Tire inserts are becoming standard equipment at gravel races in 2026. The question isn't whether they work — it's whether they work for your riding."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Do tire inserts prevent pinch flats on gravel?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Tire inserts (foam rings inside tubeless tires) prevent pinch flats by supporting the tire carcass against rim impact. Even if you run zero pressure after a puncture, the foam prevents the tire from bottoming out against the rim. For gravel riders who push low pressures for grip, inserts provide confidence to run 20-25 PSI without fear of pinch flatting on rocks or square-edged hits." } },
        { "@type": "Question", "name": "Do tire inserts prevent tubeless burping?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — this is their most underrated benefit for gravel. Tubeless tires can 'burp' air when the bead momentarily loses contact with the rim during hard cornering or impact (especially with hookless rims). Inserts fill enough of the tire cavity to maintain bead seat pressure under these loads, dramatically reducing burping. Riders using inserts can often run 2-3 PSI lower without burp risk." } },
        { "@type": "Question", "name": "How much weight do tire inserts add?", "acceptedAnswer": { "@type": "Answer", "text": "Most gravel-specific inserts add 75-150g per tire (150-300g per wheel set). This is meaningful rotational weight — equivalent to upgrading from alloy to entry-level carbon wheels and then putting the weight back in. For racing, weigh the flat protection and lower-pressure grip benefits against the weight penalty based on your course's terrain." } },
        { "@type": "Question", "name": "What are the best tire inserts for gravel in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Top gravel tire inserts in 2026: Tannus Armour (lightest at ~75g per insert, excellent for 40-50mm tires), CushCore Gravel (heavier at ~150g but maximum protection), Rimpact Original (good balance, hookless rim compatible), and Vittoria Air-Liner Road (for lighter 40-45mm tire setups). Most racers use Tannus Armour for its weight advantage; bikepacking riders favor CushCore for maximum sidewall protection." } },
        { "@type": "Question", "name": "Can I use tire inserts with hookless rims?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — inserts are actually more beneficial with hookless rims since hookless beads have a higher burping risk at low pressures. Confirm compatibility with your specific insert brand — most are hookless-compatible, but some designs can make bead seating more difficult. Rimpact explicitly designs for hookless compatibility. Always seat the tire on the rim before installing the insert." } }
    ]
};

export default function PostTireInserts({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Big Tires • May 3, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Tire Inserts: Are They Actually Worth $50?</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Standard equipment at 2026 gravel races. The question isn&apos;t whether they work — it&apos;s whether they work for your specific riding.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-tire-inserts-worth-it-2026.webp"
                        alt="Gravel tire insert foam being installed into wide tubeless gravel tire showing foam profile and tire cavity cross-section — CrankSmith insert guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <Link href="/blog/gravel-tubeless-setup-guide" className="text-cyan-400 hover:underline">Gravel Tubeless Setup Guide</Link> • <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">Hookless vs Hooked Wheels Safety Guide</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            Tire inserts were an MTB thing for years — too heavy, too hard to install, and unnecessary on hardpack gravel. That narrative has flipped. In 2026, inserts are standard equipment for serious gravel racers and bikepacking riders. Here&apos;s what changed, and whether you actually need them.
                        </p>

                        <h2 className="text-white mt-12 mb-6">What Inserts Actually Do</h2>
                        <p>Tire inserts are foam rings (polyurethane, EVA foam, or open-cell variants) that sit inside the tire cavity, between the rim and the inner tread. They provide three benefits specifically relevant to gravel:</p>

                        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: "Burp Prevention", desc: "Fills cavity enough to maintain bead seat pressure during hard cornering and impacts. Riders run 2-3 PSI lower without burp risk." },
                                { title: "Run-Flat Ability", desc: "After a sealant-resistant puncture, ride out on the foam insert rather than on the rim. 3-5 miles at reduced speed is realistic." },
                                { title: "Pinch Flat Protection", desc: "Prevents tire carcass from bottoming against the rim on square-edged hits. Especially valuable on rock-strewn terrain." },
                            ].map(({ title, desc }) => (
                                <div key={title} className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                    <h3 className="text-cyan-400 font-bold mb-2 text-sm">{title}</h3>
                                    <p className="text-gray-300 text-xs">{desc}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Weight Reality</h2>
                        <p>Inserts add rotational weight — the worst kind for climbing. Real numbers for common gravel inserts:</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="space-y-3">
                                {[
                                    { name: "Tannus Armour (gravel)", weight: "~75g per insert", notes: "Lightest. Best race option. 40-50mm tires." },
                                    { name: "Rimpact Original", weight: "~100g per insert", notes: "Hookless-compatible design. Good middle ground." },
                                    { name: "Vittoria Air-Liner Road", weight: "~90g per insert", notes: "For smaller/road-width gravel tires (38-45mm)." },
                                    { name: "CushCore Gravel", weight: "~150g per insert", notes: "Maximum protection. Best for bikepacking and technical terrain." },
                                ].map(({ name, weight, notes }) => (
                                    <div key={name} className="flex gap-4 items-start">
                                        <span className="font-medium text-white text-sm w-40 shrink-0">{name}</span>
                                        <span className="text-amber-400 font-bold text-sm w-28 shrink-0">{weight}</span>
                                        <span className="text-gray-400 text-sm">{notes}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Per-insert weight. Pair = 2×. Most riders run inserts front and rear for full benefit.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Are They Worth It For You?</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { scenario: "Racing on rocky, technical terrain (Crusher in Tushar, SBT GRVL)", verdict: "Yes — burp prevention + run-flat ability are race-defining", use: true },
                                { scenario: "Bikepacking remote routes where a flat could strand you", verdict: "Yes — run-flat capability is invaluable far from support", use: true },
                                { scenario: "Hookless rims where you push close to minimum pressure", verdict: "Yes — inserts dramatically reduce hookless burp risk", use: true },
                                { scenario: "Racing on Midwest packed gravel (flat, less rocky)", verdict: "Maybe — burp prevention less critical, weight penalty matters more", use: false },
                                { scenario: "Recreational rides with easy trail access and spare tube backup", verdict: "Probably not — conventional tubeless sealant is enough", use: false },
                            ].map(({ scenario, verdict, use }) => (
                                <div key={scenario} className={`flex gap-3 p-4 rounded-lg border ${use ? "border-green-500/20 bg-green-900/5" : "border-white/10 bg-white/3"}`}>
                                    <span className={`text-xl ${use ? "text-green-400" : "text-gray-500"}`}>{use ? "✓" : "–"}</span>
                                    <div>
                                        <p className="text-white text-sm font-medium">{scenario}</p>
                                        <p className="text-gray-400 text-sm mt-1">{verdict}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p><strong>The bottom line:</strong> if you race or ride technical terrain on tubeless, inserts are worth the $50 per pair and the 150-300g weight hit. If you mostly ride smooth packed gravel recreationally, invest that $50 in better sealant and save the weight for climbing.</p>
                    </div>

                    <BlogCTA heading="Check If Your Wheel Supports Inserts" sub="Enter your rim internal width and tire size to confirm insert compatibility in CrankSmith." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
