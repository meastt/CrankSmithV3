import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bike Build Guides & Technical Resources | CrankSmith",
    description: "Expert technical guides for bicycle mechanics and enthusiasts. Learn about mullet drivetrains, bottom bracket standards, gear ratios, and component compatibility. Free resources for road, gravel, and MTB builds.",
    keywords: ["bike build guide", "bicycle technical guide", "mullet drivetrain guide", "bottom bracket guide", "T47 guide", "bike compatibility guide", "cycling technical resources"],
    openGraph: {
        title: "Bike Build Guides | CrankSmith",
        description: "Expert technical guides for bicycle mechanics and enthusiasts.",
        type: "website"
    }
};

const guides = [
    {
        slug: "gravel-groupsets-explained",
        title: "Gravel Drivetrain & Groupset Configurations", // Updated title
        excerpt: "Technical analysis of 1x vs 2x systems, Mullet drivetrain compatibility (SRAM/Shimano), and gear range optimization.", // Updated excerpt
        category: "Drivetrain",
        date: "2025-12-04",
        image: "/images/guide-gravel-mullet-main.jpg" // Added image
    },
    {
        slug: "bottom-bracket-standards",
        title: "Bottom Bracket Shells & Bearing Standards", // Updated title
        excerpt: "Comprehensive specification guide for BSA, PF30, T47, and DUB. Shell dimensions, bearing fitment, and creak elimination.", // Updated excerpt
        category: "Standards",
        date: "2025-12-02",
        image: "/images/guide-bb-t47-main.jpg" // Added image
    },
    {
        slug: "brake-mount-standards",
        title: "Disc Brake Mounting Systems & Compatibility", // Updated title
        excerpt: "Standardization of Flat Mount, Post Mount, and IS. Rotor size adaptation logic and caliper compatibility matrices.", // Updated excerpt
        category: "Braking",
        date: "2025-11-28",
        image: "/images/guide-brake-mount-main.jpg" // Added image
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
                            {/* Added image div and Image component */}
                            {guide.image && (
                                <div className="aspect-video relative w-full mb-6 rounded-xl overflow-hidden">
                                    <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
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
