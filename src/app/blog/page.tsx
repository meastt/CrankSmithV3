import Link from "next/link";
import { Metadata } from "next";
import { posts } from "./_posts/registry";

export const metadata: Metadata = {
    title: "CrankSmith Blog — Gravel Bike Builds, Compatibility & Tech",
    description: "Expert guides on gravel bike builds, tire compatibility, drivetrain gearing, and component standards. Real data, no fluff. Built for riders who build.",
    openGraph: {
        title: "CrankSmith Blog — Gravel Bike Builds & Tech",
        description: "Expert guides on gravel bike builds, tire compatibility, drivetrain gearing, and component standards.",
        type: "website"
    }
};

const blogPosts = Object.entries(posts).map(([slug, { metadata: meta }]) => ({
    slug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category,
    date: meta.date,
    image: meta.image,
})).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
