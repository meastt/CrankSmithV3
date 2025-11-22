import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [category, comparison] = slug;

    // Format: t47-vs-bsa -> T47 vs BSA
    const title = comparison
        ? `${comparison.replace(/-/g, ' ').toUpperCase()} Compatibility Guide`
        : 'Bike Part Compatibility Checker';

    return {
        title: `${title} | CrankSmith Pro`,
        description: `Technical analysis: Can you mix ${comparison?.replace(/-/g, ' ')}? Find out with the CrankSmith Logic Engine.`,
    };
}

export default async function CompatibilityPage({ params }: Props) {
    const { slug } = await params;
    const [category, comparison] = slug;

    // Mock Logic for Demo (In production, this would query the DB/Logic Engine)
    let verdict = "unknown";
    let reason = "Select a valid comparison.";
    let title = "Compatibility Checker";

    if (category === "bottom-bracket" && comparison === "t47-vs-bsa") {
        title = "Can you install a BSA Bottom Bracket in a T47 Shell?";
        verdict = "no";
        reason = "No. T47 uses a 47mm diameter shell, while BSA (English Threaded) uses a standard ~34mm (1.37\") diameter. They are physically incompatible without an adapter system (which is rare and typically not recommended).";
    } else if (category === "drivetrain" && comparison === "sram-eagle-vs-road") {
        title = "Can you use SRAM Eagle Derailleur with Road Shifters?";
        verdict = "yes";
        reason = "Yes, BUT only with AXS (Electronic). Mechanical Eagle derailleurs have a different cable pull ratio than Road shifters. For electronic AXS, they are cross-compatible (Mullet build).";
    }

    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8 uppercase tracking-wider font-mono">
                    <Link href="/" className="hover:text-blue-400">Home</Link> / Compatibility / {category}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-12 leading-tight">
                    {title}
                </h1>

                {/* Verdict Block */}
                <div className={`rounded-2xl p-8 mb-12 border ${verdict === 'yes' ? 'bg-green-500/10 border-green-500/20' :
                        verdict === 'no' ? 'bg-red-500/10 border-red-500/20' :
                            'bg-yellow-500/10 border-yellow-500/20'
                    }`}>
                    <div className="flex items-start gap-6">
                        <div className="shrink-0">
                            {verdict === 'yes' && <CheckCircle className="w-12 h-12 text-green-500" />}
                            {verdict === 'no' && <XCircle className="w-12 h-12 text-red-500" />}
                            {verdict === 'unknown' && <AlertTriangle className="w-12 h-12 text-yellow-500" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                                {verdict === 'yes' ? 'Compatible' : verdict === 'no' ? 'Not Compatible' : 'Analysis Required'}
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {reason}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Deep Dive (Placeholder for Programmatic Content) */}
                <div className="prose prose-invert max-w-none mb-16">
                    <h3>Technical Analysis</h3>
                    <p>
                        When considering <strong>{comparison?.replace(/-/g, ' ')}</strong>, it is crucial to look at the interface standards.
                        CrankSmith Pro validates these connections by checking:
                    </p>
                    <ul>
                        <li>Physical Dimensions (Shell Width, Diameter)</li>
                        <li>Thread Pitch / Press-Fit Tolerances</li>
                        <li>Chainline Implications</li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Don't Guess. Validate.</h3>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Building a bike is expensive. Use the CrankSmith Logic Engine to simulate this exact build and check for clearance, chainline, and ratio issues before you buy.
                    </p>
                    <Link
                        href="/builder"
                        className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
                    >
                        Start Configuration <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
