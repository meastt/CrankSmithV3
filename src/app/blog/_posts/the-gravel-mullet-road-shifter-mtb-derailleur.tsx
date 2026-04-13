import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works",
    description: "Complete compatibility matrix for mullet gravel drivetrains: SRAM AXS, Shimano GRX × XT/XTR, Wolf Tooth Tanpan, RoadLink.",
    date: "2026-04-11",
    category: "Drivetrain",
    keywords: ["gravel mullet drivetrain", "road shifter mtb derailleur", "sram axs mullet", "shimano grx xt", "wolf tooth tanpan"],
    image: "/images/gravel-mullet-drivetrain-compatibility-2026.webp",
    excerpt: "SRAM AXS (native), Shimano GRX × XT/XTR (cable pull ratios), Wolf Tooth Tanpan. Full compatibility matrix."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is a mullet drivetrain on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "A mullet drivetrain combines road or gravel shifters with a mountain bike rear derailleur and cassette. This unlocks MTB gearing range (like 10-52t) while keeping drop-bar ergonomics. With SRAM AXS, the wireless ecosystem makes this native — any AXS Road shifter pairs directly with any AXS MTB derailleur." } },
        { "@type": "Question", "name": "Can you mix SRAM AXS road shifters with MTB derailleurs?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. SRAM AXS is designed around universal wireless compatibility. Any AXS Road shifter (Force AXS, Rival AXS, Red AXS, or XPLR) pairs directly with any AXS MTB derailleur (Eagle XX1, X01, GX). Just be sure to use a 12-speed Eagle chain, as Flattop road chains are not compatible with Eagle pulleys and cassettes." } },
        { "@type": "Question", "name": "How do you mix Shimano GRX with mountain bike derailleurs?", "acceptedAnswer": { "@type": "Answer", "text": "For mechanical setups, cable pull ratios differ between road and MTB, so you need a converter like the Wolf Tooth Tanpan to make a road lever actuate an MTB derailleur. For Di2 electronic, you can mix XT Di2 rear derailleurs with GRX Di2 shifters if you solve E-Tube project compatibility (may require specific display/junction units)." } },
        { "@type": "Question", "name": "What rear derailleur capacity do you need for a gravel mullet?", "acceptedAnswer": { "@type": "Answer", "text": "For a 10-52t cassette with a single chainring, you need a rear derailleur with at least 42 teeth of total capacity (52 - 10 = 42). Modern MTB derailleurs like SRAM Eagle GX, X01, or XX1 handle this natively." } },
        { "@type": "Question", "name": "Is a mullet drivetrain good for gravel racing?", "acceptedAnswer": { "@type": "Answer", "text": "Mullet setups are popular at events like Mid South and Unbound Gravel where punchy climbs demand low gears. A 42x10-46 or 42x10-52 setup gives you both a fast top gear for descents and a climbing gear low enough for steep, loose gravel." } }
    ]
};

export default function PostMullet({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 11, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">SRAM AXS makes it native. Shimano needs a converter. Here is the full compatibility matrix so you can build yours without guesswork.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-mullet-drivetrain-compatibility-2026.webp"
                        alt="SRAM AXS mullet drivetrain exploded view showing road shifter to MTB derailleur cable routing — CrankSmith compatibility guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related reading: <a href="https://www.sram.com/en/sram/models/hd-axs-air-b1" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">SRAM AXS Compatibility Documentation</a> • <a href="https://wolftoothcomponents.com/collections/roadlink" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Wolf Tooth RoadLink & Tanpan</a></em></p>

                        <p className="lead text-xl text-stone-200">
                            A &ldquo;mullet&rdquo; drivetrain is the most popular gravel build trend of the last three years: <strong>road or gravel shifters up front, mountain bike derailleur and cassette out back</strong>. The result? Drop-bar ergonomics with MTB gearing range — up to 10-52t (520%). If you&apos;ve ever ground to a halt on a steep gravel climb wishing for one more gear, this is your answer.
                        </p>

                        <h2 className="text-white mt-12 mb-6">SRAM AXS: The Native Mullet</h2>
                        <p>SRAM&apos;s wireless AXS ecosystem was designed around universal cross-compatibility. Any AXS Road shifter (Force, Rival, Red, or XPLR) pairs directly with any AXS Mountain derailleur (Eagle XX1, X01, GX). No adapters, no converters, no cable pull math. Just pair in the app and ride.</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">AXS Mullet — What You Need</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>Shifter:</strong> Any AXS Road (Force, Rival, Red, XPLR)</li>
                                <li><strong>Derailleur:</strong> Any AXS MTB Eagle (XX1, X01, GX)</li>
                                <li><strong>Cassette:</strong> 10-52t Eagle (or 10-50t, 11-50t)</li>
                                <li><strong>Chain:</strong> 12-speed Eagle chain only (NOT Flattop road chain — it won&apos;t engage Eagle pulleys/cassettes)</li>
                                <li><strong>Crankset:</strong> 1x Road or MTB — does not matter to the system</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Shimano GRX: The Cable Pull Problem</h2>
                        <p>Shimano is stricter. Mechanical road shifters pull a different cable ratio than MTB derailleurs, so you can&apos;t just wire them together. For mechanical builds, you need a <strong>Wolf Tooth Tanpan</strong> (cable pull converter) to translate the GRX lever&apos;s pull into MTB derailleur travel. Alternatively, the <strong>Wolf Tooth RoadLink</strong> extends derailleur hanger reach for larger cassettes — but this won&apos;t solve cable pull mismatch.</p>

                        <p>For Di2 electronic, it&apos;s more promising but less plug-and-play. You can mix XT Di2 rear derailleurs with GRX Di2 shifters <em>if</em> you resolve the E-Tube project compatibility checks, which often requires a specific display unit or SC-MT800 junction box. Not elegant, but it works once configured.</p>

                        <h2 className="text-white mt-12 mb-6">Real-World Mullet Setups From the 2026 Scene</h2>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">Mid South 2026 Pro Setups</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li>34x11-42 — fast on red dirt, adequate for climbs</li>
                                <li>42x10-46 — the balanced choice</li>
                                <li>42x9-45 — aggressive, for strong riders</li>
                                <li>42x10-52 — climbing-focused, heavy cassette</li>
                                <li>46x10-46 — big-ring rocket for fast sections</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Does Your Build Actually Work Together?</h2>
                        <p>The mullet trend has tripped up more builders than any other gravel modification in the past year. SRAM makes it easy, but Shimano requires careful part selection. And even with SRAM, you need to verify that your chosen shifter firmware version supports the MTB derailleur, that your chainline works with your crankset, and that your derailleur hanger is compatible with modern wide-range cassettes.</p>
                        <p>CrankSmith checks all of this automatically. Select your frame, shifter, derailleur, cassette, and crank, and the builder will flag any incompatibilities before you spend hundreds on parts that don&apos;t work together.</p>
                        <p>Running wider tires with your mullet setup? Your <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">effective gearing shifts taller</Link> with every extra mm of tire width. And for loose-surface PSI at events like Mid South or Unbound, the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI calculator</a> gives personalized recommendations.</p>
                        <p>For the full technical deep-dive on all modern gravel drivetrain standards, check our <Link href="/guides/gravel-groupsets-explained" className="text-cyan-400 hover:underline">Gravel Drivetrain & Groupset Configurations guide</Link> covering BSA vs PF30, T47, and bearing choices.</p>
                    </div>

                    <BlogCTA heading="Verify Your Mullet Setup" sub="Select your shifter, derailleur, cassette, and crank. CrankSmith will flag any incompatibilities before you buy." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
