import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Best Gravel Racing Tires 2026 (Fast + Controlled) — CrankSmith",
    description: "The best gravel racing tire choices for 2026: fast rolling feel, predictable traction, and setup reliability — then build your exact racing wheel/tire + standards in CrankSmith.",
    date: "2026-04-17",
    category: "Tires",
    keywords: [
        "best gravel racing tires 2026",
        "gravel race tire",
        "fast rolling gravel tires",
        "tubeless gravel racing",
        "tires for unbound style gravel",
        "CrankSmith",
    ],
    image: "/images/best-gravel-racing-tires-2026.webp",
    excerpt: "Fast, controlled gravel tires for racing in 2026 — tuned for rolling speed on dry packed gravel while staying confident when it turns technical.",
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What tread style is fastest for gravel racing?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "For most race days, a tire with a smooth/fast center and moderately spaced side knobs is the sweet spot. It rolls efficiently on dry packed gravel while still giving you cornering bite when terrain gets loose or wet."
            },
        },
        {
            "@type": "Question",
            "name": "What width should gravel racers run in 2026?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Start with 45mm for most racers. It keeps you fast enough on rough gravel and gives enough comfort/traction at lower pressure for technical sections. Go wider only when clearance + rim/tire compatibility supports it."
            },
        },
        {
            "@type": "Question",
            "name": "Tubeless or tubed for gravel racing?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tubeless is typically the reliability/comfort advantage: fewer pinch flats, better impact absorption, and traction you can tune with pressure. If you go tubeless, make sure your wheel is tubeless-ready and that you’re using the correct sealant + setup."
            },
        },
        {
            "@type": "Question",
            "name": "Do racing tires need inserts?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Usually no, but inserts can be useful when your route is puncture-heavy or you want lower-pressure comfort without fear. If you’re prioritizing time-to-reliability, test your setup before race day."
            },
        },
    ],
};

export default function PostBestGravelRacingTires2026({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Tires for Racing • April 17, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Best Gravel Racing Tires 2026 (Fast + Controlled)</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                            The goal isn’t max knobs — it’s fast rolling plus predictable traction when the surface goes unpredictable. Use this to pick your race-ready tire setup.
                        </p>
                    </div>

                    <FeaturedImage
                        src="/images/best-gravel-racing-tires-2026.webp"
                        alt="Best gravel racing tires 2026 illustrated guide for fast rolling center tread and controlled side knobs — CrankSmith"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            Best racing tires are a compromise: <strong>low deformation loss</strong> in the center for rolling speed, plus <strong>side bite</strong> for cornering control.
                        </p>

                        <h2 className="text-white mt-10 mb-4">1) Choose a center-first tread for rolling speed</h2>
                        <p>
                            Look for a tire with a relatively smooth or tightly packed center and side knobs that come alive when you lean. That combo keeps you fast on dry packed sections and gives confidence on loose turns.
                        </p>

                        <h2 className="text-white mt-10 mb-4">2) Use width for control — not just comfort</h2>
                        <p>
                            In most race scenarios, <strong>45mm</strong> is the best starting point in 2026. It lets you run traction-tuned pressures without feeling harsh or unstable.
                        </p>
                        <p>
                            For width specifics:
                            <ul>
                                <li><Link href="/blog/gravel-tire-width-selection-guide-40mm-45mm-50mm-real-numbers" className="text-cyan-400 hover:underline">Tire width selection guide</Link></li>
                            </ul>
                        </p>

                        <h2 className="text-white mt-10 mb-4">3) Tubeless setup reliability (race-ready)</h2>
                        <p>
                            Tubeless still wins for racing if the setup is correct. Make sure wheel/tire compatibility matches your tubeless-ready system, then tune sealant and maintenance.
                        </p>
                        <p>
                            Next:
                            <ul>
                                <li><Link href="/blog/gravel-tubeless-setup-guide" className="text-cyan-400 hover:underline">Tubeless setup guide</Link></li>
                            </ul>
                        </p>

                        <BlogCTA heading="Build your race tire + wheel + standards match" />
                        <BackLink />
                    </div>
                </article>
            </div>
        </>
    );
}
