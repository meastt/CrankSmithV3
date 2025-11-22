import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Technical Guides | CrankSmith Pro",
    description: "Deep dive technical guides for bicycle mechanics and frame builders. Mullet drivetrains, T47 standards, and more.",
};

const guides = [
    {
        slug: "mullet-drivetrain-guide",
        title: "The Definitive Guide to Mullet Drivetrains (2025)",
        excerpt: "How to mix Road controls with MTB gearing. A complete breakdown of AXS, Di2, and mechanical hack solutions.",
        category: "Drivetrain",
        date: "2025-11-22",
    },
    {
        slug: "t47-explained",
        title: "T47 Bottom Brackets Explained",
        excerpt: "The best of both worlds? Why T47 is taking over and how to choose the right cup for your frame.",
        category: "Standards",
        date: "2025-11-20",
    },
    {
        slug: "gravel-gearing-1x-vs-2x",
        title: "Gravel Gearing: 1x vs 2x Deep Dive",
        excerpt: "Should you ditch the front derailleur? We analyze gear range, jumps between gears, and chain retention.",
        category: "Gearing",
        date: "2025-11-18",
    },
];

export default function GuidesIndexPage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Technical Guides</h1>
                <p className="text-xl text-gray-400 mb-16 max-w-2xl">
                    In-depth analysis for the modern mechanic. No fluff, just specs, standards, and compatibility logic.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {guides.map((guide) => (
                        <Link
                            key={guide.slug}
                            href={`/guides/${guide.slug}`}
                            className="group block bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all"
                        >
                            <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">
                                {guide.category} • {guide.date}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                {guide.title}
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                {guide.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
