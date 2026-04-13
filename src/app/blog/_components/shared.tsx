import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function BlogCTA({ heading = "Check Your Bike\u0027s Compatibility", sub }: { heading?: string; sub?: string }) {
    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <Link href="/builder" className="block p-8 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                <h3 className="text-2xl font-bold text-white mb-2">{heading}</h3>
                <p className="text-cyan-200 mb-4">{sub || "Enter your frame, tire size, and components in the CrankSmith builder to validate your entire setup."}</p>
                <span className="inline-flex items-center text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">Open CrankSmith Builder <ArrowRight className="ml-2 w-5 h-5" /></span>
            </Link>
        </div>
    );
}

export function BackLink() {
    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
        </div>
    );
}

export function FeaturedImage({ src, alt, priority = true }: { src: string; alt: string; priority?: boolean }) {
    return (
        <div className="mb-8 rounded-2xl overflow-hidden border border-white/10">
            <Image
                src={src}
                alt={alt}
                width={1280}
                height={720}
                className="w-full h-auto"
                priority={priority}
            />
        </div>
    );
}
