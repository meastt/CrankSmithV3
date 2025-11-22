import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    // In a real app, fetch title from DB/CMS
    const title = slug === "mullet-drivetrain-guide"
        ? "The Definitive Guide to Mullet Drivetrains (2025)"
        : "Technical Guide";

    return {
        title: `${title} | CrankSmith Pro`,
        description: "Learn how to mix Road controls with MTB gearing for the ultimate gravel setup.",
    };
}

export default async function GuidePage({ params }: Props) {
    const { slug } = await params;

    // Mock Content
    if (slug !== "mullet-drivetrain-guide") {
        return (
            <div className="min-h-screen bg-gray-950 pt-24 px-4 text-center">
                <h1 className="text-2xl text-white">Guide not found</h1>
                <Link href="/guides" className="text-blue-400 mt-4 block">Back to Guides</Link>
            </div>
        );
    }

    return (
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
    );
}
