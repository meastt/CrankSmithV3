
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import { Validator } from "@/lib/validation";
import { Component } from '@/lib/types/compatibility';
import { resolveStandard } from "../standards";

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [category, comparison] = slug;

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

    let verdict: "yes" | "no" | "unknown" = "unknown";
    let reason = "Select a valid comparison.";
    let title = "Compatibility Checker";
    let details: string[] = [];

    // Parse comparison slug: e.g. "t47-vs-bsa" -> host="t47", guest="bsa"
    const parts = comparison?.split("-vs-");

    if (parts?.length === 2) {
        const [hostSlug, guestSlug] = parts;

        if (category === "bottom-bracket") {
            // Host = Frame, Guest = BB
            const frame = resolveStandard(hostSlug, "Frame") as Component | null;
            const bb = resolveStandard(guestSlug, "BottomBracket") as Component | null;

            if (frame && bb) {
                title = `Can you install a ${bb.name} in a ${frame.name}?`;

                const buildData = {
                    frame: frame,
                    bottomBracket: bb,
                    wheels: [],
                    tires: []
                };

                const result = Validator.validateBuild(buildData);
                const relevantIssues = result.issues.filter(i =>
                    i.componentId === bb.id && i.conflictingComponentId === frame.id
                );

                if (relevantIssues.length === 0) {
                    verdict = "yes";
                    reason = `Yes, the ${bb.name} is designed to fit the ${frame.name} standard.`;
                } else {
                    verdict = "no";
                    reason = `No, these standards are incompatible.`;
                    details = relevantIssues.map(i => i.message);
                }
            } else {
                reason = `Standards not found in database: ${hostSlug} or ${guestSlug} `;
            }

        } else if (category === "wheels") {
            // Host = Frame, Guest = Wheel
            const frame = resolveStandard(hostSlug, "Frame") as Component | null;
            const wheel = resolveStandard(guestSlug, "Wheel") as Component | null;

            if (frame && wheel) {
                title = `Will a ${wheel.name} fit a ${frame.name}?`;

                // Allow assignment to 'position' now that it exists on ComponentSpecs
                if (!wheel.specs.position) wheel.specs.position = 'Rear';

                const buildData = {
                    frame: frame,
                    wheels: [wheel],
                    tires: []
                };

                const result = Validator.validateBuild(buildData);
                const relevantIssues = result.issues.filter(i =>
                    (i.componentId === wheel.id && i.conflictingComponentId === frame.id)
                );

                if (relevantIssues.length === 0) {
                    verdict = "yes";
                    reason = `Yes, the axle standards match.`;
                } else {
                    verdict = "no";
                    reason = "No, the axle standards do not match.";
                    details = relevantIssues.map(i => i.message);
                }
            }
        }
    }

    // Generate FAQ Schema for SEO
    const faqSchema = comparison ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": title,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `${reason} ${details.join(' ')} `
            }
        }, {
            "@type": "Question",
            "name": `How does CrankSmith validate ${comparison.replace(/-/g, ' ')} compatibility ? `,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "CrankSmith validates compatibility by checking interface standards, physical dimensions (shell width, diameter), thread pitch tolerances, and axle standards (length, pitch, diameter). Our logic engine simulates real-world mechanic validation rules."
            }
        }]
    } : null;

    return (
        <>
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
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
                    <div className={`rounded - 2xl p - 8 mb - 12 border ${verdict === 'yes' ? 'bg-green-500/10 border-green-500/20' :
                            verdict === 'no' ? 'bg-red-500/10 border-red-500/20' :
                                'bg-yellow-500/10 border-yellow-500/20'
                        } `}>
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
                                {details.length > 0 && (
                                    <ul className="mt-4 list-disc list-inside text-red-400">
                                        {details.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Technical Deep Dive */}
                    <div className="prose prose-invert max-w-none mb-16">
                        <h3>Technical Analysis</h3>
                        <p>
                            When considering <strong>{comparison?.replace(/-/g, ' ')}</strong>, it is crucial to look at the interface standards.
                            CrankSmith Pro validates these connections by checking:
                        </p>
                        <ul>
                            <li>Physical Dimensions (Shell Width, Diameter)</li>
                            <li>Thread Pitch / Press-Fit Tolerances</li>
                            <li>Axle Standards (Length, Pitch, Diameter)</li>
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
        </>
    );
}
