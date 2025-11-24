import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

const guideData: Record<string, { title: string; description: string; date: string; category: string }> = {
    "mullet-drivetrain-guide": {
        title: "The Definitive Guide to Mullet Drivetrains (2025)",
        description: "Learn how to mix Road controls with MTB gearing for the ultimate gravel setup. Complete breakdown of AXS, Di2, and mechanical solutions.",
        date: "2025-11-22",
        category: "Drivetrain"
    },
    "t47-explained": {
        title: "T47 Bottom Brackets Explained",
        description: "Complete guide to T47 bottom bracket standard. Learn why T47 is taking over and how to choose the right cup for your frame.",
        date: "2025-11-20",
        category: "Standards"
    },
    "gravel-gearing-1x-vs-2x": {
        title: "Gravel Gearing: 1x vs 2x Deep Dive",
        description: "Should you ditch the front derailleur? We analyze gear range, jumps between gears, and chain retention for gravel bikes.",
        date: "2025-11-18",
        category: "Gearing"
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = guideData[slug] || { title: "Technical Guide", description: "Technical guide for bicycle mechanics." };

    return {
        title: `${guide.title} | CrankSmith`,
        description: guide.description,
        keywords: ["bicycle", "bike build", "cycling", guide.category.toLowerCase(), slug.replace(/-/g, ' ')],
        openGraph: {
            title: guide.title,
            description: guide.description,
            type: "article",
            publishedTime: guide.date,
        }
    };
}

export default async function GuidePage({ params }: Props) {
    const { slug } = await params;
    const guide = guideData[slug];

    // Generate schema for the article
    const articleSchema = guide ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "datePublished": guide.date,
        "dateModified": guide.date,
        "author": {
            "@type": "Organization",
            "name": "CrankSmith Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CrankSmith",
            "logo": {
                "@type": "ImageObject",
                "url": "https://cranksmith.com/icon-512.png"
            }
        },
        "articleSection": guide.category,
        "keywords": [guide.category.toLowerCase(), "bicycle", "bike build", slug.replace(/-/g, ' ')]
    } : null;

    // Content: T47 Explained
    if (slug === "t47-explained") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • 2025-11-20</div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">T47 Bottom Brackets Explained</h1>
                        <p className="text-xl text-gray-400 leading-relaxed">The best of both worlds? Why T47 is taking over.</p>
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>T47 is essentially a threaded version of PF30. It uses the same 46mm shell diameter but adds threads (M47x1.0). This solves the creaking issues of PressFit while maintaining the stiffness and crank compatibility of a large shell.</p>
                        <h2>Internal vs External</h2>
                        <p><strong>T47 Internal (86mm width):</strong> Bearings sit inside the shell. Used on road bikes to mimic BB86.</p>
                        <p><strong>T47 External (68mm width):</strong> Bearings sit outside. Used on adventure bikes to mimic BSA.</p>
                    </div>
                </article>
            </div>
            </>
        );
    }

    // Content: Gravel Gearing
    if (slug === "gravel-gearing-1x-vs-2x") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">Gearing • 2025-11-18</div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Gravel Gearing: 1x vs 2x</h1>
                        <p className="text-xl text-gray-400 leading-relaxed">The eternal debate: Range vs Steps.</p>
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>1x offers simplicity and chain retention (clutch derailleurs). 2x offers tighter gear steps for maintaining cadence.</p>
                        <h2>The Verdict</h2>
                        <p>If you race on flat terrain, 2x is superior for cadence control. If you ride technical singletrack or steep climbs, 1x with a 10-52t cassette is the winner.</p>
                    </div>
                </article>
            </div>
            </>
        );
    }

    // Content: Mullet Drivetrain (Existing)
    if (slug === "mullet-drivetrain-guide") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">
                            Drivetrain • 2025-11-22
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            The Definitive Guide to Mullet Drivetrains
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Business in the front, party in the back. How to combine Road ergonomics with Mountain Bike range.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p>
                            The "Mullet" drivetrain has become the gold standard for gravel racing and bikepacking.
                            By pairing drop-bar shifters (Road) with a massive wide-range cassette (MTB), you get the speed for the flats and the winching gears for the steepest climbs.
                        </p>

                        <h2>The Problem: Cable Pull & Protocols</h2>
                        <p>
                            You can't just bolt a Shimano XT derailleur to your 105 shifters.
                            Road and MTB components typically use different "languages":
                        </p>
                        <ul>
                            <li><strong>Mechanical:</strong> Different cable pull ratios (how much cable moves per click).</li>
                            <li><strong>Electronic:</strong> Different wireless protocols or firmware blocks.</li>
                        </ul>

                        <h2>Solution A: The SRAM AXS Ecosystem (Easiest)</h2>
                        <p>
                            SRAM made this easy. All AXS components talk to each other.
                            You can pair <strong>SRAM Red/Force/Rival AXS shifters</strong> with an <strong>Eagle AXS (XX1/X01/GX) rear derailleur</strong>.
                        </p>
                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
                            <strong>Pro Tip:</strong> If you are using the new "Transmission" (T-Type) derailleurs, you MUST have a UDH (Universal Derailleur Hanger) compatible frame.
                        </div>

                        <h2>Solution B: The Shimano GRX/Di2 Mix</h2>
                        <p>
                            Shimano is stricter. Officially, GRX is the widest range you can get (11-42t or 10-51t on 12s).
                            However, for 11-speed Di2 users, you can often run an XT Di2 rear derailleur if you use the correct junction box setup, though it is not officially supported in the E-Tube app for all combinations.
                        </p>

                        <h2>Solution C: Mechanical Hacks (Tanpan / Shiftmate)</h2>
                        <p>
                            For mechanical purists, you need a "translator." Devices like the <strong>Wolf Tooth Tanpan</strong> change the cable pull ratio, allowing a road shifter to pull the correct amount of cable for an MTB derailleur.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-3xl font-bold text-white mb-6">Planning a Mullet Build?</h3>
                        <p className="text-gray-400 mb-8 text-lg">
                            Don't guess if your chainline will work. Simulate your exact frame, crank, and cassette combination in the CrankSmith Logic Engine.
                        </p>
                        <Link
                            href="/builder"
                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/25"
                        >
                            Build My Mullet <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </article>
            </div>
            </>
        );
    }

    // Fallback for guide not found
    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-4 text-center">
            <h1 className="text-2xl text-white">Guide not found</h1>
            <Link href="/guides" className="text-blue-400 mt-4 block">Back to Guides</Link>
        </div>
    );
}
