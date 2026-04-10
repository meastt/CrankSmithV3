import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CrankSmith Blog — Gravel Bike Builds, Compatibility & Tech",
    description: "Expert guides on gravel bike builds, tire compatibility, drivetrain gearing, and component standards. Real data, no fluff. Built for riders who build.",
    openGraph: {
        title: "CrankSmith Blog — Gravel Bike Builds & Tech",
        description: "Expert guides on gravel bike builds, tire compatibility, drivetrain gearing, and component standards.",
        type: "website"
    }
};

const blogPosts = [
    {
        slug: "45mm-is-the-new-minimum-gravel-tire",
        title: "45mm Is the New Minimum Gravel Tire — Here's Why",
        excerpt: "Every 2026 frame clears 50mm+. Riders are pushing past 40mm and never looking back. The data backs it up.",
        category: "Big Tires",
        date: "2026-04-10",
        image: "/images/blog-45mm-minimum.jpg"
    },
    {
        slug: "the-gravel-mullet-road-shifter-mtb-derailleur",
        title: "The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works",
        excerpt: "SRAM AXS (native), Shimano GRX × XT/XTR (cable pull ratios), Wolf Tooth Tanpan. Full compatibility matrix.",
        category: "Drivetrain",
        date: "2026-04-11",
        image: "/images/blog-gravel-mullet.jpg"
    },
    {
        slug: "1x-vs-2x-gravel-2026-numbers",
        title: "1x vs 2x on Gravel in 2026: The Actual Numbers",
        excerpt: "Gear range percentages, cadence gap sizes, chain drop risk, and who really needs which setup.",
        category: "Drivetrain",
        date: "2026-04-12",
        image: "/images/blog-1x-vs-2x.jpg"
    },
    {
        slug: "how-tire-width-changes-gravel-gear-ratio",
        title: "How Your Bigger Gravel Tire Changes Your Actual Gear Ratio",
        excerpt: "45mm vs 35mm changes your effective gear inches by ~6%. CrankSmith calculates this automatically.",
        category: "Drivetrain",
        date: "2026-04-14",
        image: "/images/blog-tire-gearing.jpg"
    },
    {
        slug: "unbound-gravel-2026-tire-gear-setup",
        title: "Unbound Gravel 2026: The Ultimate Tire & Gear Setup Guide",
        excerpt: "World's most iconic gravel race. May 28-31, Emporia KS. What pros ran vs what works for the rest of us.",
        category: "Racing",
        date: "2026-04-15",
        image: "/images/blog-unbound-2026.jpg"
    },
    {
        slug: "gravel-tire-psiby-width-guide-2026",
        title: "Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25\")",
        excerpt: "Optimal PSI for every width at different rider weights and terrain. Hookless rim max pressure limits. Tubeless minimums to prevent burping.",
        category: "Big Tires",
        date: "2026-04-16",
        image: "/images/blog-tire-pressure-guide.jpg"
    },
    {
        slug: "every-gravel-frame-that-fits-2-25in-tires",
        title: "Every 2026 Gravel Frame That Fits 2.25-Inch Tires",
        excerpt: "Allied Able (57mm), Lauf Seigla (50mm), 3T Extrema (54mm), Specialized Diverge 4 (55mm) — definitive list.",
        category: "Big Tires",
        date: "2026-04-17",
        image: "/images/blog-2-25-frames.jpg"
    },
    {
        slug: "hookless-vs-hooked-gravel-wheels-safety-guide",
        title: "Hookless vs Hooked Gravel Wheels: The Safety Guide That Actually Matters",
        excerpt: "ETRTO standards updated. 28mm tires on 25mm internal hookless = non-compliant. Max pressure 72.5 PSI. When hooked is non-negotiable.",
        category: "Standards",
        date: "2026-04-21",
        image: "/images/blog-hookless-safety.jpg"
    },
    {
        slug: "rockshox-rudy-vs-rigid-gravel-suspension",
        title: "RockShox Rudy vs Rigid Fork: Is Gravel Suspension Worth It in 2026?",
        excerpt: "800g heavier but elite racers pair it with narrow tires instead of wide + rigid. The full trade-off analysis.",
        category: "Suspension",
        date: "2026-04-22",
        image: "/images/blog-suspension-vs-rigid.jpg"
    },
    {
        slug: "gravel-tubeless-setup-guide",
        title: "Gravel Tubeless Setup: What Seals, What Tapes, What Goes Wrong",
        excerpt: "Tape layers by rim width. Sealant ml by tire volume. Burping fix on hookless: lower pressure + sealant boost.",
        category: "Setup",
        date: "2026-04-24",
        image: "/images/blog-tubeless-setup.jpg"
    },
];

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">CrankSmith Blog</h1>
                <p className="text-xl text-gray-400 mb-16 max-w-2xl">
                    Deep dives into gravel bike builds, tire compatibility, drivetrain gearing, and component standards. Real data from the 2026 scene.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all"
                        >
                            <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">
                                {post.category} • {post.date}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-gray-400 leading-relaxed">
                                {post.excerpt}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}