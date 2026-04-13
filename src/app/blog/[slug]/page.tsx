import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { posts } from "../_posts/registry";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        return { title: "Post Not Found | CrankSmith Blog" };
    }

    const { metadata: meta } = post;

    return {
        title: `${meta.title} | CrankSmith Blog`,
        description: meta.description,
        keywords: [...meta.keywords, "gravel bike", "bike build", "cranksmith", meta.category.toLowerCase()],
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: "article",
            publishedTime: meta.date,
            images: meta.image ? [{ url: `https://cranksmith.com${meta.image}` }] : [],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = posts[slug];

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Post Not Found</h1>
                    <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const { metadata: meta, Component } = post;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": meta.title,
        "description": meta.description,
        "datePublished": meta.date,
        "dateModified": meta.date,
        "author": { "@type": "Organization", "name": "CrankSmith Team" },
        "publisher": {
            "@type": "Organization",
            "name": "CrankSmith",
            "logo": { "@type": "ImageObject", "url": "https://cranksmith.com/icon-512.png" }
        },
        "image": meta.image ? `https://cranksmith.com${meta.image}` : undefined,
        "articleSection": meta.category,
        "keywords": meta.keywords
    };

    return <Component articleSchema={articleSchema} />;
}
