/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";

type Props = {
    params: Promise<{ slug: string }>;
};

const infographicData: Record<string, {
    title: string;
    description: string;
    image: string;
    category: string;
    embedCodeSnippet: string;
    relatedBlog: string;
    relatedBlogTitle: string;
    altText: string;
    bodyContent: React.ReactNode;
}> = {
    "gravel-tire-comparison": {
        title: "Gravel Tire Width Comparison Infographic",
        description: "Visual comparison of gravel tire widths: 40mm, 45mm, 50mm, 2.25\" — performance, comfort, rolling speed data.",
        image: "/images/gravel-tire-width-45mm-minimum-2026.webp",
        category: "Big Tires",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/gravel-tire-comparison\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/45mm-is-the-new-minimum-gravel-tire",
        relatedBlogTitle: "45mm Is the New Minimum Gravel Tire",
        altText: "Gravel tire width comparison chart showing 40mm, 45mm, 50mm, and 2.25\" tire cross-sections with PSI ranges — CrankSmith infographic",
        bodyContent: (
            <>
                <p>The most-asked question in the gravel community. At what point does wider become <em>too wide</em>, and when does it become the <em>smart</em> choice? This infographic compares the four most common gravel tire widths against rolling resistance, comfort, pinch-flat risk, and terrain suitability.</p>
                <p><strong>Key insight:</strong> 45mm has become the new minimum for mixed-surface riding. It is the width where comfort gains outpace rolling resistance penalties for most riders on real-world gravel.</p>
                <p>The comparison is built from ETRTO tire/rim compatibility data, published rolling resistance numbers, and real-world ride feedback from gravel racers and tourers.</p>
            </>
        ),
    },
    "mullet-drivetrain-compatibility": {
        title: "Gravel Mullet Drivetrain Compatibility Matrix Infographic",
        description: "Every verified road shifter × MTB derailleur combination for mullet gravel builds.",
        image: "/images/gravel-mullet-drivetrain-compatibility-2026.webp",
        category: "Drivetrain",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/mullet-drivetrain-compatibility\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/the-gravel-mullet-road-shifter-mtb-derailleur",
        relatedBlogTitle: "Gravel Mullet Drivetrains — Every Combo That Works",
        altText: "Mullet drivetrain compatibility matrix — all verified road shifter to MTB derailleur combinations for 2026 gravel builds — CrankSmith infographic",
        bodyContent: (
            <>
                <p>The &ldquo;mullet&rdquo; setup — a road shifter paired with an MTB rear derailleur — has become the gravel default for riders who want 10–12 speed road shifting with a 42t or 50t MTB cassette. But the compatibility matrix is not obvious, and a wrong combination results in indexing failure.</p>
                <p><strong>This infographic maps every verified combination</strong>: SRAM AXS Eagle road to MTB, Shimano GRX with XT/XTR via Wolf Tooth Tanpan or GoatLink, Campagnolo Ekar direct (no mullet needed), and the microSHIFT options.</p>
                <p>Use this as your compatibility reference before ordering parts. Every pairing in the chart has been tested.</p>
            </>
        ),
    },
    "1x-vs-2x-gear-range": {
        title: "1x vs 2x Gear Range Comparison Infographic",
        description: "Gear-inch-by-gear-inch visual comparison of 1x and 2x gravel drivetrains.",
        image: "/images/gravel-1x-vs-2x-gear-range-comparison-2026.webp",
        category: "Drivetrain",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/1x-vs-2x-gear-range\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/1x-vs-2x-gravel-2026-numbers",
        relatedBlogTitle: "1x vs 2x on Gravel in 2026",
        altText: "1x vs 2x gravel gear range comparison chart — gear inches by cog, cadence gaps, terrain suitability — CrankSmith infographic",
        bodyContent: (
            <>
                <p>The 1x vs 2x debate is not about simplicity vs range. It is about <strong>cadence continuity</strong>. A 2x drivetrain gives you smaller jumps between gears, which means you stay in your optimal cadence window more often. A 1x drivetrain gives you fewer components to maintain, less chain-drop risk, and a cleaner cockpit — but with wider gear jumps.</p>
                <p><strong>This infographic</strong> shows gear-by-gear comparison (in gear inches), cadence gap analysis (how big is the jump from one gear to the next?), and terrain suitability — which setup performs better on climbs, flats, and descents.</p>
            </>
        ),
    },
    "hookless-vs-hooked-safety": {
        title: "Hookless vs Hooked Rim Safety Limits Infographic",
        description: "ETRTO 2024 official limits for hookless rims: tire compatibility, pressure ceilings, and burp-prevention data.",
        image: "/images/gravel-hookless-vs-hooked-safety-guide-2026.webp",
        category: "Standards",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/hookless-vs-hooked-safety\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/hookless-vs-hooked-gravel-wheels-safety-guide",
        relatedBlogTitle: "Hookless vs Hooked Gravel Wheels Safety Guide",
        altText: "Hookless vs hooked rim safety limits infographic — ETRTO 2024 compatibility, pressure ceilings, burping risk — CrankSmith infographic",
        bodyContent: (
            <>
                <p>Hookless rims are lighter and stronger — until the wrong tire blows off. After several incidents, ETRTO published the official <strong>2024 Compatibility List</strong>: only tires with 622mm bead seats under 5 bar (72 PSI) max pressure can be paired with hookless rims.</p>
                <p><strong>This infographic</strong> maps: which tires are ETRTO-approved for hookless use, what the max PSI ceiling is per rim width, and the burping risk threshold for each combination. If you are riding hookless, this is your safety reference.</p>
                <p>Use this image on your blog, forum, or media site — attribution appreciated but not required for non-commercial sharing.</p>
            </>
        ),
    },
    "gravel-frame-tire-clearance": {
        title: "2026 Gravel Frame Tire Clearance Database Infographic",
        description: "Which gravel frame accepts 27.5×2.2\" or 700×50c+ — complete visual comparison table.",
        image: "/images/gravel-frames-2-25-tires-2026.webp",
        category: "Standards",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/gravel-frame-tire-clearance\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/every-gravel-frame-that-fits-2-25in-tires",
        relatedBlogTitle: "Every Gravel Frame That Fits 2.25-Inch Tires",
        altText: "2026 gravel frame tire clearance database — frame-by-frame max tire size comparison — CrankSmith infographic",
        bodyContent: (
            <>
                <p>Tire clearance is becoming the #1 frame selection criterion for gravel riders. If you want to run 45mm+ tires, you need a frame that physically has the room. This visual table ranks all 2026 gravel frames by maximum tire clearance.</p>
                <p><strong>Key insight:</strong> 700×50c / 27.5×2.125 is the practical upper limit for most gravel frames, with a handful accepting 27.5×2.25&quot; (57mm+).</p>
                <p>Use this when comparing bikes — it is the single most important compatibility spec you will check.</p>
            </>
        ),
    },
    "rockshox-rudy-vs-rigid-fork": {
        title: "RockShox Rudy vs Rigid Fork — Trade-off Comparison Infographic",
        description: "Weight penalty, fatigue reduction, ride quality — the visual breakdown of the gravel suspension question.",
        image: "/images/gravel-rockshox-rudy-vs-rigid-fork-2026.webp",
        category: "Components",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/rockshox-rudy-vs-rigid-fork\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/rockshox-rudy-vs-rigid-gravel-suspension",
        relatedBlogTitle: "RockShox Rudy vs Rigid Fork: Is Gravel Suspension Worth It?",
        altText: "RockShox Rudy vs rigid gravel fork comparison — weight, fatigue, ride quality trade-offs — CrankSmith infographic",
        bodyContent: (
            <>
                <p>The RockShox Rudy is the first gravel-specific suspension fork, and it is polarizing. 40mm of travel, 1,350g claimed weight, $700–$1,400. That is a lot to add to a gravel bike.</p>
                <p><strong>This infographic</strong> breaks down the trade-offs visually: weight penalty (830g vs rigid carbon), fatigue reduction on long rides, handling changes (geometry shift from +20–30mm axle-to-crown), and the rider profiles who actually benefit.</p>
                <p>Answer to the obvious question: <strong>yes, you feel the weight</strong>, especially on climbs. <strong>But</strong> — on washboard, washboard descents, the Rudy&apos;s vibration isolation is genuinely game-changing for riders who go numb by hour 3.</p>
            </>
        ),
    },
    "gravel-tubeless-setup-flowchart": {
        title: "Gravel Tubeless Setup Flowchart",
        description: "Complete step-by-step visual guide: tape, valves, sealant, burp-fix — no more guesswork.",
        image: "/images/gravel-tubeless-setup-flowchart-2026.webp",
        category: "Setup",
        embedCodeSnippet: "<iframe src=\"https://cranksmith.com/infographics/gravel-tubeless-setup-flowchart\" width=\"800\" height=\"600\"></iframe>",
        relatedBlog: "/blog/gravel-tubeless-setup-guide",
        relatedBlogTitle: "Gravel Tubeless Setup — Step-by-Step Guide",
        altText: "Gravel tubeless tire setup flowchart — tape application, valve installation, sealant pour, burp-fix steps — CrankSmith infographic",
        bodyContent: (
            <>
                <p>Every gravel rider eventually goes tubeless. The question is whether it takes 10 minutes or 3 hours — and that entirely depends on following the right sequence.</p>
                <p><strong>This flowchart</strong> walks through every step: rim tape application (how many wraps), valve stem installation (seal the hole first), tire seating (soap trick, compressor trick, booster trick), sealant injection (amount per tire width), and the burp-fix protocol for when a bead won&apos;t seat.</p>
                <p>Bookmark this, print it, tape it to your workbench bench.</p>
            </>
        ),
    },
};

export default function InfographicPage({ params }: Props) {
    const resolved = React.use(params);
    const slug = (resolved as { slug: string }).slug;
    const data = infographicData[slug];

    if (!data) {
        return (
            <div className="min-h-screen" style={{ background: "hsl(220, 43%, 11%)" }}>
                <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Infographic Not Found</h1>
                    <Link href="/infographics" className="text-cyan-400 hover:underline">
                        ← Back to Infographics
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "hsl(220, 43%, 11%)" }}>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Link href="/infographics" className="inline-flex items-center text-cyan-400 hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Infographics
                </Link>

                <div className="mb-4">
                    <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                        {data.category}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {data.title}
                </h1>

                <p className="text-gray-400 text-lg mb-8">
                    {data.description}
                </p>

                {/* Infographic Image */}
                <div className="rounded-lg overflow-hidden border border-gray-800 mb-8">
                    <img
                        src={data.image}
                        alt={data.altText}
                        className="w-full h-auto"
                        loading="eager"
                    />
                </div>

                {/* Embed Code */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Share2 className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-white font-semibold">Embed This Infographic</h2>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                        Copy this HTML to embed on your blog, forum, or website. Attribution appreciated but not required for non-commercial use.
                    </p>
                    <code className="block bg-gray-950 rounded p-3 text-sm text-cyan-400 overflow-x-auto">
                        {data.embedCodeSnippet}
                    </code>
                </div>

                {/* Body Content */}
                <div className="prose prose-invert max-w-none mb-12">
                    <div className="text-gray-300 space-y-4">
                        {data.bodyContent}
                    </div>
                </div>

                {/* Related Blog Post */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-transparent rounded-lg border border-cyan-500/30 p-6 mb-12">
                    <p className="text-cyan-400 text-sm font-medium mb-2">Related Article</p>
                    <Link
                        href={data.relatedBlog}
                        className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors"
                    >
                        {data.relatedBlogTitle} →
                    </Link>
                </div>
            </div>

            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ImageObject",
                        name: data.title,
                        description: data.description,
                        contentUrl: `https://cranksmith.com${data.image}`,
                        author: {
                            "@type": "Organization",
                            name: "CrankSmith",
                            url: "https://cranksmith.com",
                        },
                        license: "https://creativecommons.org/licenses/by-nc/4.0/",
                    }),
                }}
            />
        </div>
    );
}
