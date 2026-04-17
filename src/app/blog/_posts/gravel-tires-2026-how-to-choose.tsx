import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Tires 2026: How to Choose (Width + Tread + Protection)",
    description: "A gravel tire decision guide for 2026: width vs rolling speed, tread vs traction, and protection (tubeless + sealant + inserts) — then build the compatible setup in CrankSmith.",
    date: "2026-04-17",
    category: "Tires",
    keywords: [
        "gravel tires 2026",
        "how to choose gravel tires",
        "tread pattern for gravel",
        "tubeless gravel reliability",
        "tire protection inserts",
        "best gravel tire for speed",
        "best gravel tire for comfort",
    ],
    image: "/images/gravel-tires-how-to-choose-2026.webp",
    excerpt:
        "Choose gravel tires with confidence: width, tread, and protection decisions — with a clean funnel to build the exact compatible setup.",
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What gravel tire width should I choose in 2026?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most 2026 gravel riders should start with 45mm for the best all-around mix of comfort, grip, and rolling speed. If your terrain is mostly smooth and you do lots of pavement, 40mm can work; if you ride technical terrain or want maximum traction/comfort, 50mm+ may be the better choice — within your frame clearance.",
            },
        },
        {
            "@type": "Question",
            "name": "Tread: do I want faster tires or more knobs for gravel?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Start by matching tread to your worst conditions, not your best roads. If you see lots of loose corners, wet roots, or muddy sections, a more aggressive center/side tread improves real-world traction. For speed on dry packed gravel, a more rolling tread will reduce fatigue and effort.",
            },
        },
        {
            "@type": "Question",
            "name": "Is tubeless still the default for gravel in 2026?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "For most gravel riders, tubeless is still the reliability and comfort sweet spot: lower pressures, fewer pinch flats, and better impact absorption. But compatibility matters — rim/tire/tubeless-ready status and correct setup (sealant + maintenance) are what make it reliable.",
            },
        },
        {
            "@type": "Question",
            "name": "Do tire inserts help on gravel?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Inserts can reduce puncture risk and make lower pressures more manageable. They’re most worth it for riders who prioritize puncture reliability over the extra weight/complexity trade-offs, especially on long remote rides.",
            },
        },
    ],
};

export default function PostGravelTiresHowToChoose({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Tires • April 17, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Tires 2026: How to Choose (Width + Tread + Protection)</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                            A decision guide that keeps gravel authority in CrankSmith: width, tread, and protection choices — then build the compatible setup.
                        </p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-tires-how-to-choose-2026.webp"
                        alt="Gravel tires decision guide illustration for 2026 showing tire width, tread patterns, and tubeless protection concepts — CrankSmith"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            The fastest way to choose gravel tires is to decide three things in order: <strong>width</strong> (fit + comfort + speed), <strong>tread</strong> (traction vs rolling), and <strong>protection</strong> (tubeless reliability + puncture strategy).
                        </p>

                        <h2 className="text-white mt-10 mb-4">1) Width: comfort and speed come from the same choice</h2>
                        <p>
                            In 2026, most gravel riders should start around <strong>45mm</strong>. Wider tires let you run lower pressures with better impact absorption and traction — and on rough gravel that often translates into better real-world speed.
                        </p>
                        <p>
                            Want the numbers? Use the width/PSI and gear implications:
                            <ul>
                                <li>
                                    <Link href="/blog/gravel-tire-width-selection-guide-40mm-45mm-50mm-real-numbers" className="text-cyan-400 hover:underline">Tire width selection guide</Link>
                                </li>
                                <li>
                                    <Link href="/blog/gravel-tire-psiby-width-guide-2026" className="text-cyan-400 hover:underline">PSI by tire width</Link>
                                </li>
                            </ul>
                        </p>

                        <h2 className="text-white mt-10 mb-4">2) Tread: match your worst conditions</h2>
                        <p>
                            Dry packed gravel doesn’t need the same tread as wet, rooty corners or loose climbs. Choose tread based on the conditions you actually ride most — not the best-case scenario.
                        </p>

                        <h2 className="text-white mt-10 mb-4">3) Protection: reliability is a system</h2>
                        <p>
                            Tubeless setups get their reliability from compatibility + correct sealant + maintenance. Inserts can add insurance on long rides.
                        </p>
                        <p>
                            Next steps:
                            <ul>
                                <li>
                                    <Link href="/blog/gravel-tubeless-setup-guide" className="text-cyan-400 hover:underline">Tubeless setup guide</Link>
                                </li>
                                <li>
                                    <Link href="/blog/gravel-tire-inserts-worth-it-2026" className="text-cyan-400 hover:underline">Are inserts worth it?</Link>
                                </li>
                            </ul>
                        </p>

                        <h2 className="text-white mt-10 mb-4">Want the “best for X” answer?</h2>
                        <p>
                            Choose a direction and we’ll funnel it into a build:
                        </p>
                        <ul>
                            <li>
                                <Link href="/blog/best-gravel-racing-tires-2026" className="text-cyan-400 hover:underline">Best Gravel Racing Tires 2026</Link>
                            </li>
                            <li>
                                <Link href="/blog/best-gravel-tires-for-comfort-2026" className="text-cyan-400 hover:underline">Best Gravel Tires for Comfort 2026</Link>
                            </li>
                        </ul>

                        <BlogCTA heading="Build your tire + wheel + standards match" />
                        <BackLink />
                    </div>
                </article>
            </div>
        </>
    );
}
