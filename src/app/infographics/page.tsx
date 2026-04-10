import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Gravel Cycling Infographics & Data Visualizations | CrankSmith",
    description: "Free embeddable infographics for gravel cyclists: tire width comparisons, drivetrain compatibility matrices, ETRTO safety charts. Share these on your blog or forum.",
    keywords: ["gravel cycling infographics", "tire width chart", "mullet drivetrain compatibility", "gear range comparison", "gravel data visuals"],
    openGraph: {
        title: "Gravel Cycling Infographics — Free to Embed | CrankSmith",
        description: "Download or embed our data-driven gravel cycling infographics. Free for blogs, forums, and media.",
        type: "website",
        images: ["/images/gravel-tire-width-chart-2026.webp"],
    },
};

const infographics = [
    {
        slug: "gravel-tire-comparison",
        title: "Gravel Tire Width Comparison Chart",
        description: "40mm vs 45mm vs 50mm vs 2.25\" — real-world performance data, comfort, rolling speed, and terrain suitability.",
        image: "/images/gravel-tire-width-45mm-minimum-2026.webp",
        category: "Big Tires",
    },
    {
        slug: "mullet-drivetrain-compatibility",
        title: "Mullet Drivetrain Compatibility Matrix 2026",
        description: "Every working road shifter × MTB derailleur combination, verified on gravel builds.",
        image: "/images/gravel-mullet-drivetrain-compatibility-2026.webp",
        category: "Drivetrain",
    },
    {
        slug: "1x-vs-2x-gear-range",
        title: "1x vs 2x Gear Range Visual Guide",
        description: "Gear-inch-by-gear-inch comparison of 1x and 2x gravel setups with cadence gap analysis.",
        image: "/images/gravel-1x-vs-2x-gear-range-comparison-2026.webp",
        category: "Drivetrain",
    },
    {
        slug: "hookless-vs-hooked-safety",
        title: "Hookless vs Hooked Rim Safety Limits",
        description: "ETRTO 2024 official limits, tire/rim compatibility, and burp-prevention thresholds.",
        image: "/images/gravel-hookless-vs-hooked-safety-guide-2026.webp",
        category: "Standards",
    },
    {
        slug: "gravel-frame-tire-clearance",
        title: "Every 2026 Gravel Frame That Fits 700×50mm Tires",
        description: "Frame-by-frame tire clearance database: the bikes that accept 27.5×2.2\" or 700×50c+.",
        image: "/images/gravel-frames-2-25-tires-2026.webp",
        category: "Standards",
    },
    {
        slug: "rockshox-rudy-vs-rigid-fork",
        title: "RockShox Rudy vs Rigid Fork: Trade-off Comparison",
        description: "Weight, fatigue data, ride quality — the visual breakdown of the gravel suspension question.",
        image: "/images/gravel-rockshox-rudy-vs-rigid-fork-2026.webp",
        category: "Components",
    },
    {
        slug: "gravel-tubeless-setup-flowchart",
        title: "Gravel Tubeless Setup Flowchart",
        description: "Step-by-step: tape → valve → sealant → burp-fix. The complete visual guide.",
        image: "/images/gravel-tubeless-setup-flowchart-2026.webp",
        category: "Setup",
    },
];

export default function InfographicsIndex() {
    return (
        <div className="min-h-screen" style={{ background: "hsl(220, 43%, 11%)" }}>
            <div className="max-w-6xl mx-auto px-4 py-12">
                <Link href="/blog" className="inline-flex items-center text-cyan-400 hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Gravel Cycling Infographics
                </h1>
                <p className="text-gray-400 text-lg mb-4 max-w-3xl">
                    Free, embeddable data visualizations from <strong className="text-white">CrankSmith</strong>. Bloggers, forum moderators, and cycling media — feel free to use these images with attribution.
                </p>
                <p className="text-sm text-gray-500 mb-12 max-w-3xl">
                    Attribution: Use <code className="text-cyan-400">cranksmith.com/[infographic-slug]</code> when embedding. No permission needed for non-commercial use.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {infographics.map((ig) => (
                        <Link
                            key={ig.slug}
                            href={`/infographics/${ig.slug}`}
                            className="group block bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-colors"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={ig.image}
                                    alt={ig.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                                        {ig.category}
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-gray-500" />
                                </div>
                                <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                                    {ig.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    {ig.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
