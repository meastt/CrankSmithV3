import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string }>;
};

const blogData: Record<string, { title: string; description: string; date: string; category: string; keywords: string[]; image: string }> = {
    "45mm-is-the-new-minimum-gravel-tire": {
        title: "45mm Is the New Minimum Gravel Tire — Here's Why",
        description: "Why 45mm has become the standard minimum gravel tire width in 2026. Rolling resistance data, comfort metrics, and which frames support it.",
        date: "2026-04-10",
        category: "Big Tires",
        keywords: ["gravel tire width 2026", "45mm gravel tire", "minimum gravel tire size", "wide gravel tires", "gravel tire clearance"],
        image: "/images/gravel-tire-width-45mm-minimum-2026.webp"
    },
    "the-gravel-mullet-road-shifter-mtb-derailleur": {
        title: "The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works",
        description: "Complete compatibility matrix for mullet gravel drivetrains: SRAM AXS, Shimano GRX × XT/XTR, Wolf Tooth Tanpan, RoadLink.",
        date: "2026-04-11",
        category: "Drivetrain",
        keywords: ["gravel mullet drivetrain", "road shifter mtb derailleur", "sram axs mullet", "shimano grx xt", "wolf tooth tanpan"],
        image: "/images/gravel-mullet-drivetrain-compatibility-2026.webp"
    },
    "1x-vs-2x-gravel-2026-numbers": {
        title: "1x vs 2x on Gravel in 2026: The Actual Numbers",
        description: "Gear range comparisons, cadence gap analysis, and chain retention data for 1x and 2x gravel drivetrain setups.",
        date: "2026-04-12",
        category: "Drivetrain",
        keywords: ["1x vs 2x gravel", "gravel drivetrain range", "gravel gear ratio", "single ring gravel"],
        image: "/images/gravel-1x-vs-2x-gear-range-comparison-2026.webp"
    },
    "how-tire-width-changes-gravel-gear-ratio": {
        title: "How Your Bigger Gravel Tire Changes Your Actual Gear Ratio",
        description: "Wider tires increase effective gear inches. 45mm vs 35mm is a ~6% difference. See how it works.",
        date: "2026-04-14",
        category: "Drivetrain",
        keywords: ["tire circumference gearing", "gravel tire gear inches", "wider tire gear ratio"],
        image: "/images/blog-tire-gearing.webp"
    },
    "unbound-gravel-2026-tire-gear-setup": {
        title: "Unbound Gravel 2026: The Ultimate Tire & Gear Setup Guide",
        description: "Tire and gearing strategies for Unbound Gravel 2026 in Emporia, Kansas. What pros run vs what works.",
        date: "2026-04-15",
        category: "Racing",
        keywords: ["unbound gravel 2026", "unbound tire setup", "unbound gearing", "emporia gravel"],
        image: "/images/blog-unbound-2026.webp"
    },
    "gravel-tire-psiby-width-guide-2026": {
        title: "Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25\")",
        description: "Optimal PSI for 40mm, 45mm, 50mm, 55mm, 2.1, and 2.25 inch gravel tires. Rider weight and terrain charts. Hookless rim limits.",
        date: "2026-04-16",
        category: "Big Tires",
        keywords: ["gravel tire pressure guide", "gravel tire psi", "hookless max pressure", "gravel tire pressure by width"],
        image: "/images/gravel-tire-pressure-psiby-width-2026.webp"
    },
    "every-gravel-frame-that-fits-2-25in-tires": {
        title: "Every 2026 Gravel Frame That Fits 2.25-Inch Tires",
        description: "Definitive list of gravel frames that officially clear 57mm (2.25\") MTB tires: Allied Able, Lauf Seigla, 3T Extrema, and more.",
        date: "2026-04-17",
        category: "Big Tires",
        keywords: ["gravel frame 2.25 tire clearance", "57mm tire gravel", "mtb tire on gravel bike"],
        image: "/images/every-gravel-frame-2-25-tires-2026.webp"
    },
    "hookless-vs-hooked-gravel-wheels-safety-guide": {
        title: "Hookless vs Hooked Gravel Wheels: The Safety Guide That Actually Matters",
        description: "ETRTO updated standards for hookless gravel wheels. Max pressure limits. Which tires are hookless-approved.",
        date: "2026-04-21",
        category: "Standards",
        keywords: ["hookless gravel wheels", "hookless safety", "etrto hookless standards", "hooked vs hookless gravel"],
        image: "/images/blog-hookless-safety.webp"
    },
    "rockshox-rudy-vs-rigid-gravel-suspension": {
        title: "RockShox Rudy vs Rigid Fork: Is Gravel Suspension Worth It in 2026?",
        description: "800g weight penalty. Elite racers using it instead of wide tires. The pros, cons, and real speed data.",
        date: "2026-04-22",
        category: "Suspension",
        keywords: ["rockshox rudy gravel", "gravel suspension fork", "gravel fork weight"],
        image: "/images/blog-suspension-vs-rigid.webp"
    },
    "gravel-tubeless-setup-guide": {
        title: "Gravel Tubeless Setup: What Seals, What Tapes, What Goes Wrong",
        description: "Tape layers by rim width. Sealant amounts by tire volume. Burping fix on hookless. Common mistakes.",
        date: "2026-04-24",
        category: "Setup",
        keywords: ["gravel tubeless setup", "gravel tubeless tape", "gravel tire burping", "gravel sealant amount"],
        image: "/images/blog-tubeless-setup.webp"
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = blogData[slug] || { title: "CrankSmith Blog", description: "Gravel bike builds, compatibility, and tech.", keywords: [] as string[], category: "General", date: "", image: "" };

    return {
        title: `${post.title} | CrankSmith Blog`,
        description: post.description,
        keywords: [...post.keywords, "gravel bike", "bike build", "cranksmith", post.category.toLowerCase()],
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            images: post.image ? [{ url: `https://cranksmith.com${post.image}` }] : [],
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogData[slug];

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

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": { "@type": "Organization", "name": "CrankSmith Team" },
        "publisher": {
            "@type": "Organization",
            "name": "CrankSmith",
            "logo": { "@type": "ImageObject", "url": "https://cranksmith.com/icon-512.png" }
        },
        "image": post.image ? `https://cranksmith.com${post.image}` : undefined,
        "articleSection": post.category,
        "keywords": post.keywords
    };

    /* Route to individual post renderers */
    if (slug === "45mm-is-the-new-minimum-gravel-tire") return <Post45mm articleSchema={articleSchema} />;
    if (slug === "the-gravel-mullet-road-shifter-mtb-derailleur") return <PostMullet articleSchema={articleSchema} />;
    if (slug === "1x-vs-2x-gravel-2026-numbers") return <Post1xVs2x articleSchema={articleSchema} />;
    if (slug === "how-tire-width-changes-gravel-gear-ratio") return <PostHowTireWidthGearing articleSchema={articleSchema} />;
    if (slug === "unbound-gravel-2026-tire-gear-setup") return <PostUnbound2026 articleSchema={articleSchema} />;
    if (slug === "gravel-tire-psiby-width-guide-2026") return <PostTirePressureByWidth articleSchema={articleSchema} />;
    if (slug === "every-gravel-frame-that-fits-2-25in-tires") return <Post225Frames articleSchema={articleSchema} />;

    /* Fallback for posts not yet written */
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">{post.category} • {post.date}</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
                        <p className="text-xl text-gray-400">{post.description}</p>
                    </div>
                    <div className="text-center text-gray-500 mt-12">
                        <p>Full post coming soon. In the meantime, try the <Link href="/builder" className="text-cyan-400 hover:underline">CrankSmith Builder</Link>.</p>
                    </div>
                    <div className="mt-16 border-t border-white/10 pt-12">
                        <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                    </div>
                </article>
            </div>
        </>
    );
}

/* ─── Shared CTA card ─── */
function BlogCTA({ heading = "Check Your Bike&apos;s Compatibility", sub }: { heading?: string; sub?: string }) {
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
function BackLink() {
    return (
        <div className="mt-16 border-t border-white/10 pt-12">
            <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
        </div>
    );
}
function FeaturedImage({ src, alt, priority = true }: { src: string; alt: string; priority?: boolean }) {
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

/* ═══════════════════════════════════════════════════════════
 * POST 1 — 45mm Is the New Minimum Gravel Tire
 * ═══════════════════════════════════════════════════════════ */
function Post45mm({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Why is 45mm the new minimum gravel tire width?", "acceptedAnswer": { "@type": "Answer", "text": "Modern 2026 gravel frames are designed with 50mm+ clearances as standard. At 45mm, riders get the sweet spot of rolling resistance, puncture protection, and comfort at lower pressures. Narrower tires (35-40mm) are increasingly viewed as outdated for real-world gravel riding." } },
            { "@type": "Question", "name": "What are the benefits of wider gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "Wider gravel tires (45mm+) offer faster rolling on rough surfaces (proven by testing), increased puncture protection, greater forgiveness over unseen obstacles, and the ability to run lower pressures for more grip and comfort." } },
            { "@type": "Question", "name": "Do wider gravel tires slow you down on pavement?", "acceptedAnswer": { "@type": "Answer", "text": "Very large tires (50mm+) can feel ponderous on pavement and squirmy in corners on hard-packed gravel. For mixed road/gravel riding, 45mm is often the best compromise — fast enough on tarmac while still excelling on gravel." } },
            { "@type": "Question", "name": "What internal rim width is best for 45mm gravel tires?", "acceptedAnswer": { "@type": "Answer", "text": "For 45mm gravel tires, an internal rim width of 23-28mm is recommended. Wider internal rims (28mm+) provide better side support for wider tires and allow lower pressures, but always check the manufacturer's compatibility chart." } },
            { "@type": "Question", "name": "How do I know if my gravel frame fits 45mm tires?", "acceptedAnswer": { "@type": "Answer", "text": "Most 2026 gravel frames accommodate at least 45mm. Check your frame manufacturer's official clearance specs. Use the CrankSmith builder to validate your exact frame and tire combination, including room for mud." } }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Big Tires • April 10, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">45mm Is the New Minimum Gravel Tire — Here&apos;s Why</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Every major 2026 gravel frame clears 50mm+. Riders are pushing past 40mm and never looking back. The data backs it up.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-tire-width-45mm-minimum-2026.webp"
                        alt="45mm gravel tire cross-section technical blueprint with dimension callouts and PSI ranges — CrankSmith compatibility guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            If you&apos;re still running 35mm or 40mm tires on your gravel bike, you&apos;re riding on last decade&apos;s setup. <strong>45mm has become the accepted minimum for general gravel riding</strong>, and for good reason. The combination of rolling efficiency, puncture protection, and the ability to run lower pressures for grip makes wider tires objectively faster on most real-world gravel surfaces.
                        </p>

                        <h2 className="text-white mt-12 mb-6">What Changed?</h2>
                        <p className="text-sm text-gray-500 -mt-4 mb-4"><em>Related reading: <a href="https://www.bikeradar.com/features/opinion/dont-buy-a-gravel-bike-without-50mm-tyre-clearance" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">BikeRadar: &quot;Don&apos;t Buy a Gravel Bike Without 50mm Tyre Clearance&quot;</a> • <a href="https://www.cyclingweekly.com/news/the-next-big-things-in-gravel-2026-2027-tech-predictions" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">CyclingWeekly&apos;s 2026-27 Gravel Tech Predictions</a></em></p>

                        <p>The 2026 gravel frame market has shifted. Where 40mm clearance was once considered generous, <strong>50mm is now the baseline expectation</strong> for new gravel bikes. The Specialized Diverge clears 55mm. The Allied Able handles 57mm. Even mid-range carbon frames are opening up their chainstays and fork crowns to accommodate 50mm+ rubber.</p>

                        <p>This isn&apos;t just manufacturer marketing — it reflects real rider behavior. On Reddit and gravel forums, riders who switch from 35mm or 40mm to 45mm consistently report faster times on rough gravel, fewer flats, and a more comfortable ride without a measurable speed penalty on pavement. The physics: at lower pressures (20-30 PSI range for wider tires), the tire deforms around obstacles instead of bouncing off them, maintaining momentum. For personalized PSI recommendations by weight and tire width, try the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI Tire Pressure Calculator</a>.</p>

                        <h2 className="text-white mt-12 mb-6">The Rolling Resistance Reality</h2>
                        <p>Independent testing has confirmed what gravel racers already knew: <strong>wider tires often roll faster than narrow tires on rough surfaces</strong>. A 45mm tire at 30 PSI will outperform a 35mm tire at 50 PSI on anything but perfectly smooth tarmac. The energy lost to suspension (your body vibrating) far exceeds the marginal increase in tire deformation. See <a href="https://www.bikeradar.com/advice/technical/wider-tyres-are-faster" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">BikeRadar&apos;s independent tire testing</a> for the full data.</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">Real-World Tire Width Feedback (2026)</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>35-40mm:</strong> &ldquo;Feels outdated on real gravel.&rdquo; Fast on pavement, harsh on rough stuff.</li>
                                <li><strong>45mm:</strong> The standard. Fast on rough, comfortable, confident in corners.</li>
                                <li><strong>50mm:</strong> Preferred by aggressive riders. More grip, more comfort, slightly heavier.</li>
                                <li><strong>55mm+:</strong> For 2.1&quot;+ setups. Best on technical terrain, ponderous on pavement.</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">So What Should You Run?</h2>
                        <p>For most gravel riders in 2026, <strong>45mm is the sweet spot</strong>. It&apos;s wide enough to excel on real gravel while still feeling planted on hard-pack and pavement. If you&apos;re racing or riding technical terrain, 50mm is increasingly the choice. Only drop to 40mm or below if your rides are predominantly pavement with occasional gravel sections.</p>
                        <p>The real question isn&apos;t &ldquo;how wide can I go&rdquo; — it&apos;s &ldquo;does my frame actually fit the tire I want?&rdquo; That&apos;s where CrankSmith comes in. Enter your frame model and target tire size, and the builder checks real clearance data including room for mud, which most manufacturers don&apos;t publish.</p>

                        <h2 className="text-white mt-12 mb-6">Going Even Wider?</h2>
                        <p>If 45mm isn&apos;t enough for your terrain, some 2026 frames officially clear <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">2.25-inch (57mm) MTB tires</Link>. And if you&apos;re running wider tires, your <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">effective gearing changes too</Link> — wider tires = larger circumference = taller gears. CrankSmith calculates all of this automatically.</p>
                    </div>

                    <BlogCTA heading="Check Your Frame&apos;s Clearance" sub="Enter your gravel frame and tire size to validate fitment — including mud clearance." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
 * POST 2 — The Gravel Mullet
 * ═══════════════════════════════════════════════════════════ */
function PostMullet({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "What is a mullet drivetrain on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "A mullet drivetrain combines road or gravel shifters with a mountain bike rear derailleur and cassette. This unlocks MTB gearing range (like 10-52t) while keeping drop-bar ergonomics. With SRAM AXS, the wireless ecosystem makes this native — any AXS Road shifter pairs directly with any AXS MTB derailleur." } },
            { "@type": "Question", "name": "Can you mix SRAM AXS road shifters with MTB derailleurs?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. SRAM AXS is designed around universal wireless compatibility. Any AXS Road shifter (Force AXS, Rival AXS, Red AXS, or XPLR) pairs directly with any AXS MTB derailleur (Eagle XX1, X01, GX). Just be sure to use a 12-speed Eagle chain, as Flattop road chains are not compatible with Eagle pulleys and cassettes." } },
            { "@type": "Question", "name": "How do you mix Shimano GRX with mountain bike derailleurs?", "acceptedAnswer": { "@type": "Answer", "text": "For mechanical setups, cable pull ratios differ between road and MTB, so you need a converter like the Wolf Tooth Tanpan to make a road lever actuate an MTB derailleur. For Di2 electronic, you can mix XT Di2 rear derailleurs with GRX Di2 shifters if you solve E-Tube project compatibility (may require specific display/junction units)." } },
            { "@type": "Question", "name": "What rear derailleur capacity do you need for a gravel mullet?", "acceptedAnswer": { "@type": "Answer", "text": "For a 10-52t cassette with a single chainring, you need a rear derailleur with at least 42 teeth of total capacity (52 - 10 = 42). Modern MTB derailleurs like SRAM Eagle GX, X01, or XX1 handle this natively." } },
            { "@type": "Question", "name": "Is a mullet drivetrain good for gravel racing?", "acceptedAnswer": { "@type": "Answer", "text": "Mullet setups are popular at events like Mid South and Unbound Gravel where punchy climbs demand low gears. A 42x10-46 or 42x10-52 setup gives you both a fast top gear for descents and a climbing gear low enough for steep, loose gravel." } }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 11, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">SRAM AXS makes it native. Shimano needs a converter. Here is the full compatibility matrix so you can build yours without guesswork.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-mullet-drivetrain-compatibility-2026.webp"
                        alt="SRAM AXS mullet drivetrain exploded view showing road shifter to MTB derailleur cable routing — CrankSmith compatibility guide"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related reading: <a href="https://www.sram.com/en/sram/models/hd-axs-air-b1" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">SRAM AXS Compatibility Documentation</a> • <a href="https://wolftoothcomponents.com/collections/roadlink" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Wolf Tooth RoadLink & Tanpan</a></em></p>

                        <p className="lead text-xl text-stone-200">
                            A &ldquo;mullet&rdquo; drivetrain is the most popular gravel build trend of the last three years: <strong>road or gravel shifters up front, mountain bike derailleur and cassette out back</strong>. The result? Drop-bar ergonomics with MTB gearing range — up to 10-52t (520%). If you&apos;ve ever ground to a halt on a steep gravel climb wishing for one more gear, this is your answer.
                        </p>

                        <h2 className="text-white mt-12 mb-6">SRAM AXS: The Native Mullet</h2>
                        <p>SRAM&apos;s wireless AXS ecosystem was designed around universal cross-compatibility. Any AXS Road shifter (Force, Rival, Red, or XPLR) pairs directly with any AXS Mountain derailleur (Eagle XX1, X01, GX). No adapters, no converters, no cable pull math. Just pair in the app and ride.</p>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">AXS Mullet — What You Need</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li><strong>Shifter:</strong> Any AXS Road (Force, Rival, Red, XPLR)</li>
                                <li><strong>Derailleur:</strong> Any AXS MTB Eagle (XX1, X01, GX)</li>
                                <li><strong>Cassette:</strong> 10-52t Eagle (or 10-50t, 11-50t)</li>
                                <li><strong>Chain:</strong> 12-speed Eagle chain only (NOT Flattop road chain — it won&apos;t engage Eagle pulleys/cassettes)</li>
                                <li><strong>Crankset:</strong> 1x Road or MTB — does not matter to the system</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Shimano GRX: The Cable Pull Problem</h2>
                        <p>Shimano is stricter. Mechanical road shifters pull a different cable ratio than MTB derailleurs, so you can&apos;t just wire them together. For mechanical builds, you need a <strong>Wolf Tooth Tanpan</strong> (cable pull converter) to translate the GRX lever&apos;s pull into MTB derailleur travel. Alternatively, the <strong>Wolf Tooth RoadLink</strong> extends derailleur hanger reach for larger cassettes — but this won&apos;t solve cable pull mismatch.</p>

                        <p>For Di2 electronic, it&apos;s more promising but less plug-and-play. You can mix XT Di2 rear derailleurs with GRX Di2 shifters <em>if</em> you resolve the E-Tube project compatibility checks, which often requires a specific display unit or SC-MT800 junction box. Not elegant, but it works once configured.</p>

                        <h2 className="text-white mt-12 mb-6">Real-World Mullet Setups From the 2026 Scene</h2>

                        <div className="my-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold text-lg mb-2">Mid South 2026 Pro Setups</h3>
                            <ul className="list-disc pl-4 space-y-2 text-sm">
                                <li>34x11-42 — fast on red dirt, adequate for climbs</li>
                                <li>42x10-46 — the balanced choice</li>
                                <li>42x9-45 — aggressive, for strong riders</li>
                                <li>42x10-52 — climbing-focused, heavy cassette</li>
                                <li>46x10-46 — big-ring rocket for fast sections</li>
                            </ul>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Does Your Build Actually Work Together?</h2>
                        <p>The mullet trend has tripped up more builders than any other gravel modification in the past year. SRAM makes it easy, but Shimano requires careful part selection. And even with SRAM, you need to verify that your chosen shifter firmware version supports the MTB derailleur, that your chainline works with your crankset, and that your derailleur hanger is compatible with modern wide-range cassettes.</p>
                        <p>CrankSmith checks all of this automatically. Select your frame, shifter, derailleur, cassette, and crank, and the builder will flag any incompatibilities before you spend hundreds on parts that don&apos;t work together.</p>
                        <p>Running wider tires with your mullet setup? Your <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">effective gearing shifts taller</Link> with every extra mm of tire width. And for loose-surface PSI at events like Mid South or Unbound, the <a href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI calculator</a> gives personalized recommendations.</p>
                    </div>

                    <BlogCTA heading="Verify Your Mullet Setup" sub="Select your shifter, derailleur, cassette, and crank. CrankSmith will flag any incompatibilities before you buy." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════
 * POST 3 — 1x vs 2x on Gravel in 2026
 * ═══════════════════════════════════════════════════════════ */
function Post1xVs2x({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Is 1x or 2x better for gravel in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "1x dominates gravel in 2026. The trend toward 1x is clear: SRAM has made 1x AXS the standard for gravel, and Shimano CUES 1x is replacing entry-level 2x on new bikes. 1x offers chain retention via Narrow-Wide chainrings, massive range up to 10-52t (520%), and the front tire clearance that a 2x front derailleur blocks." } },
            { "@type": "Question", "name": "What is the gear range of a typical 1x gravel setup?", "acceptedAnswer": { "@type": "Answer", "text": "A common 1x gravel setup (34t chainring with 10-52t cassette) delivers 520% gear range. A 2x setup with 46/30 chainrings and 11-34t cassette delivers approximately 480%. While 2x has slightly tighter gear steps, 1x gives you a much easier climbing gear." } },
            { "@type": "Question", "name": "Do 2x drivetrains still make sense for gravel?", "acceptedAnswer": { "@type": "Answer", "text": "For predominantly flat or rolling terrain where cadence precision matters more than extreme climbing gears, 2x still has merit. The tighter gear steps (often 8-12% between gears vs 15-20% on 1x) are preferred by road-to-gravel crossover riders. But for technical trails, bikepacking, or mixed terrain, 1x is the safer choice." } },
            { "@type": "Question", "name": "Does a 1x drivetrain limit tire clearance?", "acceptedAnswer": { "@type": "Answer", "text": "No — quite the opposite. A 2x front derailleur cage sits near the chainstay and can limit tire width to ~38-40mm on some frames. Removing the front derailleur (1x setup) frees up that space, allowing the frame to accommodate wider tires. This is one reason why wide-tire gravel builds and 1x drivetrains go hand-in-hand." } },
            { "@type": "Question", "name": "What are the best budget 1x gravel groupsets in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Budget-friendly 1x options in 2026 include SRAM Apex 1 mechanical, Shimano CUES U6000 (11-speed), and MicroShift Advent X (10-speed with 11-48t cassette). SRAM Apex XPLR AXS is the entry point for electronic 1x with hydraulic brakes." } }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • April 12, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">1x vs 2x on Gravel in 2026: The Actual Numbers</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Gear range percentages, cadence gap sizes, chain drop risk, and who really needs which setup.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-1x-vs-2x-gear-range-comparison-2026.webp"
                        alt="1x vs 2x gravel drivetrain gear range comparison chart showing 520% vs 480% range with cassette layouts — CrankSmith gear lab"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="text-sm text-gray-500 -mt-4 mb-6"><em>Related: <a href="https://www.bikeradar.com/features/opinion/2026-the-year-of-the-affordable-gravel-bike" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">BikeRadar: &quot;2026: The Year of the Affordable Gravel Bike&quot;</a> • <Link href="/blog/the-gravel-mullet-road-shifter-mtb-derailleur" className="text-cyan-400 hover:underline">The Gravel Mullet Drivetrain Guide</Link></em></p>

                        <p className="lead text-xl text-stone-200">
                            The 2x drivetrain is dying for gravel. That&apos;s not opinion — it&apos;s the trajectory of every major product launch in 2026. SRAM has made 1x AXS the gravel standard. Shimano CUES 1x is replacing entry-level 2x mechanical on new bikes. Bikeradar called 2026 &ldquo;the year of the affordable gravel bike&rdquo; and almost every sub-$3K complete now ships 1x out of the box. But the real question isn&apos;t what the industry is selling — it&apos;s what works for your riding.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Numbers</h2>
                        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold text-lg mb-2">1x (One-By) Gravel</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li><strong>Range:</strong> 520% (10-52t cassette) or 460% (10-46t)</li>
                                    <li><strong>Gear steps:</strong> 15-20% between cogs (gaps feel large)</li>
                                    <li><strong>Weight savings:</strong> ~300-400g vs 2x (no front derailleur, one less chainring)</li>
                                    <li><strong>Tire clearance:</strong> unrestricted (no FD cage)</li>
                                    <li><strong>Chain drop risk:</strong> low (Narrow-Wide profile)</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold text-lg mb-2">2x (Two-By) Gravel</h3>
                                <ul className="list-disc pl-4 space-y-1 text-sm">
                                    <li><strong>Range:</strong> ~480% (46/30 × 11-34t)</li>
                                    <li><strong>Gear steps:</strong> 8-12% between cogs (smaller gaps)</li>
                                    <li><strong>Weight penalty:</strong> ~300-400g vs 1x</li>
                                    <li><strong>Tire clearance:</strong> limited by FD cage (~38-40mm on many frames)</li>
                                    <li><strong>Chain drop risk:</strong> higher, especially in mud</li>
                                </ul>
                            </div>
                        </div>

                        <h2 className="text-white mt-12 mb-6">The Cadence Gap Problem</h2>
                        <p>The biggest legitimate case for 2x is gear step size. On a 10-52t cassette, shifting from 18t to 21t is a noticeable 16% jump in gear ratio. On flat terrain, that feels like a big cadence change. On a 11-34t 2x cassette, the same shift is roughly 10% — much smoother. For road-to-gravel crossover riders who care about maintaining an optimal cadence, this matters.</p>
                        <p>For everyone else — bikepackers, technical trail riders, gravel race starters — <strong>range matters more than steps</strong>. Having a sub-20 gear inch ratio for steep climbs is more valuable than fine cadence control on the flat bits. And remember: removing that front derailleur opens up <Link href="/blog/45mm-is-the-new-minimum-gravel-tire" className="text-cyan-400 hover:underline">wider tire options</Link> on frames where the FD cage was the limiting factor.</p>

                        <h2 className="text-white mt-12 mb-6">The Budget Angle</h2>
                        <p>2026 is the year of affordable 1x gravel. Budget options that actually work:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>SRAM Apex 1 mechanical</strong> — hydraulic brakes, 11-speed, ~$500, proven reliability</li>
                            <li><strong>Shimano CUES U6000</strong> — 11-speed, LinkGlide durability, budget-friendly</li>
                            <li><strong>SRAM Apex XPLR AXS</strong> — the entry point for electronic 1x + hydraulic (~$800-900 complete)</li>
                            <li><strong>MicroShift Advent X</strong> — clutch derailleur, 11-48t cassette, under $300</li>
                        </ul>
                        <p>The fact that Shimano is replacing entry-level 2x with CUES 1x on new bikes tells you everything about where the market is going.</p>

                        <h2 className="text-white mt-12 mb-6">The Verdict</h2>
                        <p><strong>1x for almost everyone.</strong> The only riders who genuinely benefit from 2x are road-to-gravel crossovers doing predominately flat or rolling terrain. If you ride technical trails, go bikepacking, or face steep climbs, 1x&apos;s range and simplicity win. Plus, removing that front derailleur opens up wider tire options — and as we&apos;ve already covered, <Link href="/blog/45mm-is-the-new-minimum-gravel-tire" className="text-cyan-400 hover:underline">45mm is the new minimum</Link>.</p>
                    </div>

                    <BlogCTA heading="Compare Your 1x and 2x Options" sub="Enter your drivetrain choices and see the actual gear range, steps, and compatibility." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}

function PostHowTireWidthGearing({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How much does tire width affect gear ratio?",
                acceptedAnswer: { "@type": "Answer", text: "A 45mm tire adds roughly 6% to your effective gear inches compared to a 35mm tire. That means a 40t chainring with 42mm tires feels like a 42.4t chainring -- a full 2.4 teeth heavier." }
            },
            {
                "@type": "Question",
                name: "What is the effective diameter of a 700x45c tire?",
                acceptedAnswer: { "@type": "Answer", text: "A 700x45c tire has an effective diameter of approximately 707mm, compared to 686mm for a 700x35c tire. This approximately 3% increase in radius translates to a approximately 6% increase in gear inches." }
            },
            {
                "@type": "Question",
                name: "Should I get a smaller chainring if I am going to 50mm tires?",
                acceptedAnswer: { "@type": "Answer", text: "If you are running 50mm+ tires and climbing steep terrain, dropping from a 42t to a 40t or 38t chainring restores the climbing gear you lose from the larger tire diameter." }
            },
            {
                "@type": "Question",
                name: "Does tire pressure change gear ratio?",
                acceptedAnswer: { "@type": "Answer", text: "Minimally. A 5 PSI difference in a 45mm tire changes the tire profile by less than 1mm -- less than 0.3% change in effective diameter." }
            },
            {
                "@type": "Question",
                name: "What gear ratio is good for gravel?",
                acceptedAnswer: { "@type": "Answer", text: "A popular all-around gravel setup is 40t chainring with a 10-44t or 10-52t cassette. For mountainous terrain with big tires, drop to 38t or 34t with a 10-52t cassette." }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Drivetrain
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        How Tire Width Changes Your Gravel Gearing -- The Math No One Talks About
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 14, 2026 -- 9 min read</p>

                    <FeaturedImage
                        src="/images/gravel-tire-width-affects-gear-ratio-2026.webp"
                        alt="Gear ratio schematic showing 35mm, 45mm, and 50mm gravel tire cross-sections with cyan measurement lines calculating effective gear inches"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Switching from 35mm to 50mm tires is the exact same effective gear change as swapping from a 40t to a 43t chainring.</strong></p>
                        
                        <p>No new cranks. No new cassette. Just different tires. And suddenly your bike feels geared too tall for the climbs you used to handle fine.</p>
                        
                        <p>Let us break down the math, because it matters every time you put bigger rubber on a gravel bike.</p>

                        <h2 className="text-white mt-12 mb-6">The Math Behind Effective Gear Inches</h2>
                        
                        <p>Gear inches tell you how far your bike moves forward with one full pedal revolution:</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 text-center my-6">
                            <p className="text-white font-mono text-sm">
                                Effective Gear Inches = (Chainring divided by Cog) times (Tire Diameter in Inches)
                            </p>
                        </div>

                        <p>The tire diameter includes the rim plus the tire height on both sides. For a 700c rim (622mm bead seat diameter):</p>

                        <ul className="space-y-2">
                            <li><strong>700x35c tire:</strong> 622 + (35 times 2) = 692mm approximately <strong>27.2 inches</strong> diameter</li>
                            <li><strong>700x45c tire:</strong> 622 + (45 times 2) = 712mm approximately <strong>28.0 inches</strong> diameter</li>
                            <li><strong>700x50c tire:</strong> 622 + (50 times 2) = 722mm approximately <strong>28.4 inches</strong> diameter</li>
                            <li><strong>27.5x2.0 inch MTB tire:</strong> approximately <strong>29.1 inches</strong> diameter</li>
                        </ul>

                        <p>That means a 45mm tire has a 2.9% larger diameter than a 35mm tire. And because gear inches are proportional to diameter, <strong>it makes your entire gear range 2.9% taller. Every gear.</strong></p>

                        <h2 className="text-white mt-12 mb-6">The Real-World Impact: 40t with 45mm vs 35mm</h2>
                        
                        <p>Let us use the most common modern gravel setup: 40t chainring, 10-44t cassette.</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6">
                            <p className="text-white text-sm font-semibold mb-3">Lowest gear (40t divided by 44t):</p>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li>With 35mm tires: <strong className="text-cyan-400">24.7 gear inches</strong> (easy climbing)</li>
                                <li>With 45mm tires: <strong className="text-orange-400">25.5 gear inches</strong> (noticeably harder)</li>
                                <li>With 50mm tires: <strong className="text-red-400">25.8 gear inches</strong> (that is a 42t chainring feeling)</li>
                            </ul>
                        </div>

                        <p>That 25.5 gear inches with 45mm tires? That is equivalent to running a <strong>41.2t chainring</strong> -- and chainrings only come in whole numbers. You have essentially upped your chainring by 1.2 teeth just by changing tires.</p>
                        
                        <p>For a 150-lb rider on 8% grades, the difference between 24.7 and 25.8 gear inches is about <strong>2.2 additional watts</strong> per pedal stroke. That does not sound like much until you are 40 minutes into a steep gravel climb on a hot day and you are standing up when your buddy on narrower tires is still spinning.</p>

                        <h2 className="text-white mt-12 mb-6">When Does This Actually Matter?</h2>
                        
                        <h3 className="text-white mt-8 mb-4">1. You Are Building Around Wide Tires</h3>
                        <p>If you are buying a new frame that clears 50mm+ and you plan to run big tires year-round, size your chainring accordingly. A 38t or even 36t chainring with a 10-52t cassette makes more sense than the standard 40t.</p>

                        <h3 className="text-white mt-8 mb-4">2. You Switch Between a Road and Gravel Quiver</h3>
                        <p>If you have one bike with 35mm slicks for fast road days and the same bike with 50mm knobbies for weekend trail rides, your gearing is going to feel like two different bikes. <Link href="/blog/1x-vs-2x-gravel-2026-numbers" className="text-cyan-400 hover:underline">This is one reason some riders prefer 2x</Link> -- it gives you enough range to cover both setups.</p>

                        <h3 className="text-white mt-8 mb-4">3. You Are Running an Unbound Build (50mm+ in Kansas)</h3>
                        <p>Riders using 50mm+ tires for Unbound Gravel should consider a smaller chainring (36-38t) paired with a 10-52t cassette. <Link href="/blog/unbound-gravel-2026-tire-gear-setup" className="text-cyan-400 hover:underline">We break down full Unbound setups in our dedicated guide</Link>.</p>

                        <h2 className="text-white mt-12 mb-6">Compensating: What Should You Change?</h2>
                        
                        <h3 className="text-white mt-8 mb-4">Option A: Smaller Chainring (Easiest, Cheapest)</h3>
                        <p>Drop your chainring by 2-4 teeth. A 40t to 38t swap costs about $40 and takes 20 minutes. This perfectly compensates for the gear increase from 35mm to 50mm tires.</p>

                        <h3 className="text-white mt-8 mb-4">Option B: Bigger Cassette</h3>
                        <p>Upgrade to a 10-44t (SRAM XDR) or 10-52t. If you are running a 2x crankset, front derailleur clearance may limit cassette size -- another reason <Link href="/blog/the-gravel-mullet-road-shifter-mtb-derailleur" className="text-cyan-400 hover:underline">mullet drivetrains are so popular</Link>.</p>

                        <h3 className="text-white mt-8 mb-4">Option C: Accept It (The Fast Approach)</h3>
                        <p>Many Unbound racers run big gearing because they prioritize top speed on the rolling Flint Hills. If you are strong and your courses are more rolling than mountainous, you might be fine.</p>

                        <h2 className="text-white mt-12 mb-6">Key Takeaways</h2>
                        <ul className="space-y-1">
                            <li>Every 5mm of tire width adds roughly 1-1.5% to your effective gear ratio</li>
                            <li>A 35mm to 50mm tire swap feels like a 2-3 tooth bigger chainring</li>
                            <li>Compensate with a smaller chainring (not a bigger cassette -- it is cheaper)</li>
                            <li>For 2.1-inch+ tires, a 34-36t chainring with 10-52t cassette is the smart setup for climbing terrain</li>
                        </ul>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-cyan-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Pro tip:</strong> If your bike came stock with a 40t chainring and 40mm tires, and you want to run 50mm+ for bikepacking, drop to a 38t chainring. It is a $40 fix that makes your climbing feel like it did before the tire upgrade.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Calculate Your Exact Gear Range" sub="Enter your chainring, cassette, and tire size -- see gear inches, cadence-to-speed charts, and drivetrain compatibility." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}

function PostUnbound2026({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What tire size should I run at Unbound Gravel 2026?",
                acceptedAnswer: { "@type": "Answer", text: "Most competitors run 45-50mm tires. 45mm is the sweet spot -- enough volume for ruts and rocks while maintaining rolling speed on paved and hard-pack transitions. Racers on the XL (200 miles) sometimes go up to 50mm for comfort." }
            },
            {
                "@type": "Question",
                name: "What gearing is recommended for Unbound Gravel?",
                acceptedAnswer: { "@type": "Answer", text: "Popular setups: 40t chainring with 10-44t or 10-52t cassette for XL riders. The steepest climbs in the Flint Hills hit 15-18% on loose gravel, so a low gear under 21 gear inches is essential." }
            },
            {
                "@type": "Question",
                name: "Is hookless OK for Unbound Gravel?",
                acceptedAnswer: { "@type": "Answer", text: "Hookless wheels are fine for Unbound if your tire is hookless-approved. ETRTO 2024-2025 standards require running no more than 72.5 PSI on 25mm internal width hookless rims. Most Unbound riders run 25-35 PSI in 45-50mm tires, well within limits." }
            },
            {
                "@type": "Question",
                name: "What tires do Unbound Gravel winners use?",
                acceptedAnswer: { "@type": "Answer", text: "Recent Unbound finishers have used: WTB Riddler 45c (most popular), Specialized Pathfinder Pro 42mm, Pirelli Cinturato Gravel M 45mm, and Schwalbe G-One RS 45mm." }
            },
            {
                "@type": "Question",
                name: "Should I use a dropper post for Unbound Gravel?",
                acceptedAnswer: { "@type": "Answer", text: "A growing number of Unbound competitors run dropper posts (30.9mm, approximately 100mm travel). The 15% loose-gravel descents become much more manageable at speed with a dropper." }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                        Racing
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Unbound Gravel 2026: The Ultimate Tire and Gear Setup Guide
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 15, 2026 -- 11 min read</p>

                    <FeaturedImage
                        src="/images/unbound-gravel-2026-setup-flint-hills.webp"
                        alt="Cyclist racing through the Flint Hills gravel roads of Kansas during Unbound Gravel event, golden hour amber sky, dust trail, adventure cycling photography"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Unbound Gravel is the defining event of the gravel racing calendar.</strong> 200 miles. Over 20,000 feet of climbing. The Flint Hills of Kansas with their relentless rolling terrain, loose limestone gravel, and brutal exposure to sun and wind.</p>
                        
                        <p>Whether you are racing the XL or just trying to finish the MID, your tire and gearing choices will make or break your day.</p>

                        <h2 className="text-white mt-12 mb-6">The Terrain Dictates the Setup</h2>
                        
                        <p>Unbound is unique. It is not alpine climbing, and it is not flat desert gravel. The Flint Hills roll in waves: 3-8% grinds climbing out of drainage crossings, punctuated by brief punchy sections at 12-18% that catch you in the granny gear.</p>
                        
                        <p>That combination means you need:</p>
                        <ul className="space-y-1">
                            <li><strong>Tire width:</strong> Enough volume for hours of chunky gravel (45-50mm)</li>
                            <li><strong>Low gear:</strong> Under 21 gear inches for 15% loose-gravel climbs</li>
                            <li><strong>High gear:</strong> Enough top end for paved sections and fast descents</li>
                            <li><strong>Reliability:</strong> Hookless-approved tires with puncture protection</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">What the Pros Run (2024-2025 Setups)</h2>
                        
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6">
                            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider">Pro-Level Unbound Setups:</p>
                            <div className="space-y-4 text-sm text-gray-300">
                                <div>
                                    <p className="text-white font-semibold">Ted King (2025):</p>
                                    <p>WTB Riddler 45c TCS Light -- SRAM Red AXS 1x -- 42t / 10-44t -- ENVE G23 hookless -- 35 PSI front / 38 PSI rear</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Laurens ten Dam:</p>
                                    <p>Specialized Pathfinder Pro 42mm -- 2x GRX 810 (46/30t) -- 11-40t cassette -- Roval Terra C -- 32 PSI</p>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Top 10% Amateur (2025 XL):</p>
                                    <p>Pirelli Cinturato Gravel M 45mm -- Rival AXS 1x -- 40t / 10-52t -- DT Swiss G1800 -- Dropper post -- 30 PSI w/ Stan&apos;s NoTubes</p>
                                </div>
                            </div>
                        </div>

                        <p>Notice the pattern? <strong>45mm is the dominant tire width</strong>, 40-42t chainrings are standard, and 1x drivetrains have largely replaced 2x even among top finishers.</p>

                        <h2 className="text-white mt-12 mb-6">The Everyday Rider Setup (What You Should Actually Run)</h2>
                        
                        <p>Most people doing Unbound are not chasing podiums -- they want to finish. Here is the recommended setup for first-time XL riders:</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-cyan-500/30 my-6">
                            <p className="text-white text-xs font-semibold mb-4 uppercase tracking-wider text-cyan-400">Recommended First-Time Unbound XL Setup:</p>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p><strong>Tire:</strong> WTB Riddler 45c TCS Light or Schwalbe G-One RS 45mm</p>
                                <p><strong>Drivetrain:</strong> SRAM Rival AXS 1x -- 40t / 10-52t (20.6 gear inches lowest)</p>
                                <p><strong>Wheels:</strong> Hookless-approved, 25-30mm internal width</p>
                                <p><strong>Pressure:</strong> 28-32 PSI (rider weight + 140-160 lbs range)</p>
                                <p><strong>Sealant:</strong> Stan&apos;s NoTubes or Orange Seal (60ml per tire)</p>
                                <p><strong>Extras:</strong> Dropper post (optional), chain checker, master link, CO2 kit</p>
                            </div>
                        </div>

                        <p>The <strong>40t/52t combo</strong> gives you a 20.6 gear-inch lowest gear with 45mm tires. If you are under 140 lbs and struggle on steep climbs, consider a 38t chainring.</p>

                        <h2 className="text-white mt-12 mb-6">Tire Pressure Strategy for Unbound</h2>
                        
                        <p>Key factors: <strong>rider weight</strong>, <strong>tire width</strong>, <strong>hookless vs hooked</strong>, and <strong>course conditions</strong>. For a 160-lb rider on 45mm tires:</p>

                        <ul className="space-y-1">
                            <li><strong>Dry/fast:</strong> 30 PSI front / 32 PSI rear</li>
                            <li><strong>Wet/muddy:</strong> 26 PSI front / 28 PSI rear (more grip)</li>
                            <li><strong>Hookless rims:</strong> Stay under 50 PSI per ETRTO standards</li>
                        </ul>

                        <p>Too high wastes watts on chunky gravel. Too low risks pinch flats on sharp limestone. Sweet spot: 28-32 PSI tubeless with quality sealant.</p>

                        <p>Need your exact PSI? <Link href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">The eBikePSI calculator</Link> works for any bike -- enter rider weight + bike weight + tire width for a data-driven starting point.</p>

                        <h2 className="text-white mt-12 mb-6">Hookless at Unbound: Are You OK?</h2>
                        
                        <p>Yes, as long as your tire is hookless-approved. The popular Unbound choices (WTB Riddler TCS, Pirelli Cinturato, Schwalbe G-One RS) are all hookless-safe.</p>
                        
                        <p>The real risk is <strong>rock strikes causing bead separation</strong> on sharp limestone at speed. Set pressure high enough to avoid bottoming out, use 60ml+ sealant, and carry a spare tube and tire boot as backup.</p>

                        <p>We wrote a detailed breakdown of <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">hookless vs hooked safety standards</Link> for the full ETRTO limits and compatibility details.</p>

                        <h2 className="text-white mt-12 mb-6">Weather Scenarios</h2>
                        
                        <h3 className="text-white mt-8 mb-4">Dry and Hot (90% of Editions)</h3>
                        <p>Hydration is your enemy, not gear. Run 45mm fast-rolling tread. 30 PSI. Fresh sealant.</p>

                        <h3 className="text-white mt-8 mb-4">Wet and Muddy (2019 Edition)</h3>
                        <p>Switch to 50mm tires with aggressive tread (WTB Nano 650b). Lower to 24-26 PSI for grip on slick limestone.</p>

                        <h3 className="text-white mt-8 mb-4">Wind (Always)</h3>
                        <p>The exposed Flint Hills have no tree cover for 100+ miles. Bring more water than you think and use the aero benefit of a well-positioned body on hard-pack.</p>

                        <h2 className="text-white mt-12 mb-6">What NOT to Do</h2>
                        <ul className="space-y-2">
                            <li><strong>Do not</strong> run an untested tire -- if it has not survived 10+ hours with sealant, do not gamble</li>
                            <li><strong>Do not</strong> use road gearing (50/34t) -- the climbs will punish you</li>
                            <li><strong>Do not</strong> skip the tubeless check -- a leaking valve or cracked rim tape will DNF you at mile 30</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Bottom Line</h2>
                        <div className="bg-gray-900/30 p-5 rounded-xl border border-amber-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">45mm tires, 40t chainring, 10-52t cassette, hookless-approved setup, 30 PSI.</strong> This is the proven formula for first-time XL finishers. Adjust based on your local training terrain. Check your exact gearing with our calculator before committing to parts.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Check Your Unbound Gear Setup" sub="Enter your chainring, cassette, and tire size to see if your gearing is enough for the Flint Hills." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
function PostTirePressureByWidth({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What PSI should I run in 45mm gravel tires?",
                acceptedAnswer: { "@type": "Answer", text: "For a 150-lb rider on 45mm tires: 30-32 PSI for hard-pack, 26-28 PSI for loose gravel, 24-26 PSI for mud. Add 2 PSI per 20 lbs of rider weight above 150 lbs." }
            },
            {
                "@type": "Question",
                name: "What is the maximum PSI for hookless gravel wheels?",
                acceptedAnswer: { "@type": "Answer", text: "ETRTO 2024 standards set the maximum at 72.5 PSI (5 bar) for 25mm internal width hookless rims, and 60 PSI for 30mm+ internal width. Most gravel riders run 25-40 PSI, well within limits." }
            },
            {
                "@type": "Question",
                name: "How does tire width affect optimal pressure?",
                acceptedAnswer: { "@type": "Answer", text: "Each 5mm of additional width lets you drop roughly 2-3 PSI for the same casing deflection. A 50mm tire runs about 6-8 PSI lower than a 40mm tire with the same rider." }
            },
            {
                "@type": "Question",
                name: "Does rider weight affect gravel tire pressure?",
                acceptedAnswer: { "@type": "Answer", text: "Yes. Every 20 lbs of rider weight above or below 150 lbs adjusts your optimal pressure by approximately 2 PSI. A 180-lb rider on 45mm tires runs about 4 PSI more than a 140-lb rider." }
            },
            {
                "@type": "Question",
                name: "Should I run the same pressure front and rear?",
                acceptedAnswer: { "@type": "Answer", text: "No. The rear tire carries roughly 60% of total weight. Run the rear 2-4 PSI higher than the front. Example: 26 PSI front, 29 PSI rear for a 160-lb rider on 50mm tires on mixed terrain." }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                        Big Tires
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25 inch)
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 16, 2026 &middot; 10 min read</p>

                    <FeaturedImage
                        src="/images/gravel-tire-pressure-psiby-width-2026.webp"
                        alt="Technical pressure reference chart showing 6 gravel tire widths from 40mm to 57mm with PSI recommendations, ETRTO hookless limits, dark background data visualization"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Run the wrong PSI in your gravel tires and no component upgrade will save you.</strong> Run the right PSI and a budget setup beats an overpriced one every time. Tire pressure is the single most impactful adjustment on any gravel bike — and most riders are running it 5-10 PSI wrong.</p>

                        <p>Here is why that happens: every pressure guide online stops at 45mm. Nobody is talking about 50mm, 55mm, or 2.25-inch tires. But if you are running those widths — and an increasing number of gravel riders are — those 45mm charts actively mislead you.</p>

                        <h2 className="text-white mt-12 mb-6">The PSI Table (All Widths, All Rider Weights)</h2>

                        <p>Here is the data you actually need, based on mixed terrain (loose-to-hard-pack gravel, some pavement, a few technical climbs):</p>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6 overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-2 text-cyan-400 font-semibold">Tire Width</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">140 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">160 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">180 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">200 lbs</th>
                                        <th className="text-center py-2 text-cyan-400 font-semibold">220 lbs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">40mm</td>
                                        <td className="text-center">26 F / 28 R</td>
                                        <td className="text-center">28 F / 30 R</td>
                                        <td className="text-center">30 F / 32 R</td>
                                        <td className="text-center">32 F / 34 R</td>
                                        <td className="text-center">34 F / 36 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">45mm</td>
                                        <td className="text-center">22 F / 24 R</td>
                                        <td className="text-center">24 F / 26 R</td>
                                        <td className="text-center">26 F / 28 R</td>
                                        <td className="text-center">28 F / 30 R</td>
                                        <td className="text-center">30 F / 32 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">50mm</td>
                                        <td className="text-center">18 F / 20 R</td>
                                        <td className="text-center">20 F / 22 R</td>
                                        <td className="text-center">22 F / 24 R</td>
                                        <td className="text-center">24 F / 26 R</td>
                                        <td className="text-center">26 F / 28 R</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5">55mm (2.0&quot;)</td>
                                        <td className="text-center">15 F / 17 R</td>
                                        <td className="text-center">17 F / 19 R</td>
                                        <td className="text-center">19 F / 21 R</td>
                                        <td className="text-center">21 F / 23 R</td>
                                        <td className="text-center">23 F / 25 R</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5">57mm (2.25&quot;)</td>
                                        <td className="text-center">14 F / 16 R</td>
                                        <td className="text-center">16 F / 18 R</td>
                                        <td className="text-center">18 F / 20 R</td>
                                        <td className="text-center">20 F / 22 R</td>
                                        <td className="text-center">22 F / 24 R</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-3">F = Front, R = Rear. Values for standard hooked rims. Hookless: see max PSI section below.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">How to Read This Table</h2>
                        
                        <p><strong>This is your starting point.</strong> If you are a 170-lb rider on 45mm tires: interpolate between 160 and 180, so roughly 25 F / 27 R. If you are a 210-lb rider on 50mm tires: interpolate to about 25 F / 27 R.</p>
                        
                        <p>The F/R split exists because your rear tire carries roughly 60% of total weight (rider + bike), so it needs higher pressure to maintain the same casing deflection as the front. Run the same PSI on both and your rear will blow through the casing faster and be more prone to pinch flats.</p>

                        <p>For a quick starting point, the <Link href="https://ebikepsi.com/calculate" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">eBikePSI tire pressure calculator</Link> is built on the same rider-weight-plus-tire-width formula. Even though it is designed for e-bikes, the core physics is the same — just enter your combined rider weight and tire size.</p>

                        <h2 className="text-white mt-12 mb-6">The Hookless Pressure Ceiling</h2>
                        
                        <p>If you are running hookless rims (and most new gravel wheels are), you cannot run arbitrary pressure. ETRTO 2024 standards set the absolute maximum at:</p>
                        
                        <ul className="space-y-1">
                            <li><strong>72.5 PSI (5 bar)</strong> for 25mm internal width hookless rims</li>
                            <li><strong>Below 60 PSI</strong> for 30mm+ internal width hookless rims</li>
                        </ul>

                        <p>In practice, most riders on 45mm+ tires will never hit these ceilings. The danger zone is with narrow gravel tires (35-40mm) on aggressive hookless rims where riders try to run road-level pressures. At those widths, stick to hooked rims if you want 55+ PSI.</p>

                        <p>For the full breakdown of hookless vs hooked safety, rim brands, and which tires are hookless-approved, read our <Link href="/blog/hookless-vs-hooked-gravel-wheels-safety-guide" className="text-cyan-400 hover:underline">hookless vs hooked safety guide</Link>.</p>

                        <h2 className="text-white mt-12 mb-6">Terrain Adjustments</h2>
                        
                        <p>Once you have your baseline PSI from the table, adjust based on conditions:</p>

                        <ul className="space-y-1">
                            <li><strong>Smooth hard-pack / pavement:</strong> Add 2-3 PSI (faster rolling, more responsive).</li>
                            <li><strong>Loose gravel / washboard:</strong> Subtract 2-3 PSI (more grip, more compliance).</li>
                            <li><strong>Mud / wet:</strong> Subtract 2 PSI (better traction in corners, more contact patch).</li>
                            <li><strong>Rocky technical trails:</strong> Subtract 1-2 PSI but watch minimum pressures to avoid pinch flats on sharp impacts.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">The 2.25 inch Gravel Tire — Yes, Really</h2>
                        
                        <p>As shown in the table, 57mm (2.25 inch) tires at 160 lbs rider weight run ~16 F / 18 R. That is mountain bike territory. And it works brilliantly for gravel riders who want absurd levels of grip and comfort on technical trails.</p>
                        
                        <p>The catch: you need a frame that clears 57mm tires. Not all gravel frames do. Check our <Link href="/blog/every-gravel-frame-that-fits-2-25in-tires" className="text-cyan-400 hover:underline">complete list of 2026 gravel frames that officially fit 2.25 inch tires</Link>.</p>

                        <p>Also note: going from 45mm to 57mm changes your effective gear ratio by about 6% — that is equivalent to going from a 40t to a 42t chainring. <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">Read our tire width gearing guide</Link> to see exactly how it affects your setup.</p>

                        <h2 className="text-white mt-12 mb-6">How to Dial It In</h2>
                        <ol className="space-y-2 list-decimal pl-5">
                            <li>Squirt your tires to the table baseline</li>
                            <li>Ride your typical routes and note: do you feel the bike squirming? Go up 2 PSI. Does it feel harsh or bouncy? Drop 2 PSI.</li>
                            <li>Refine over 3-4 rides. Your sweet spot will be within +/- 2 PSI of the table.</li>
                        </ol>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-sky-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> The table above gets you within 3 PSI of optimal. Ride it in from there. And if your tires feel wrong, pressure is the first thing to check — before new tires, before new wheels, before any component change.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Dial In Your Bike Build" sub="Enter your tire width, weight, and riding style. We will find compatible components and flag any mismatches." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
function Post225Frames({ articleSchema }: { articleSchema: object }) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What gravel bike frames fit 2.25-inch tires?",
                acceptedAnswer: { "@type": "Answer", text: "As of 2026, confirmed frames: Salsa Cutthroat, Lauf Seigla, 3T Exploro Pro, Niner RLT 9 RDO, Open U.P., Salsa Beargrease (hardtail). Always verify clearance with your specific frame size." }
            },
            {
                "@type": "Question",
                name: "Can I put MTB tires on my gravel bike?",
                acceptedAnswer: { "@type": "Answer", text: "Only if your frame officially supports it. Check chainstay clearance, fork crown clearance, and derailleur clearance. Even if a tire fits at the narrowest point, mud can cause rub." }
            },
            {
                "@type": "Question",
                name: "Do 2.25-inch tires work for gravel racing?",
                acceptedAnswer: { "@type": "Answer", text: "On technical courses like Unbound Gravel yes, on fast flat courses they add rolling resistance. The extra grip and comfort offset the speed penalty on rough terrain, but lose on smooth courses." }
            },
            {
                "@type": "Question",
                name: "What is the widest tire that fits on a 700c gravel bike?",
                acceptedAnswer: { "@type": "Answer", text: "Most 700c gravel frames max out at 45-50mm. For 2.25 inch (57mm) you typically need to switch to 650b wheels, which maintain similar outer diameter. A few frames like the Lauf Seigla and Open U.P. officially support 57mm+." }
            },
            {
                "@type": "Question",
                name: "What PSI should I run in 2.25-inch gravel tires?",
                acceptedAnswer: { "@type": "Answer", text: "For a 160-lb rider: approximately 16 PSI front / 18 PSI rear on mixed terrain. See our full tire pressure by width guide for all rider weights and terrain adjustments." }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="max-w-3xl mx-auto">
                    <BackLink />
                    <div className="mt-2 mb-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Big Tires
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Every 2026 Gravel Frame That Fits 2.25-Inch Tires (57mm)
                    </h1>
                    <p className="text-gray-400 text-sm mb-6">April 17, 2026 &middot; 9 min read</p>

                    <FeaturedImage
                        src="/images/every-gravel-frame-2-25-tires-2026.webp"
                        alt="Side-view comparison of 5 gravel bike frames with oversized 2.25-inch mountain bike tires installed, technical diagram with clearance annotations on dark charcoal background"
                    />

                    <div className="mt-8 text-gray-300 leading-relaxed space-y-6">
                        <p><strong>Five years ago, 45mm was the max tire clearance for "adventure" gravel frames.</strong> Today, a growing number of gravel frames officially spec 57mm — that is 2.25 inches, solid mountain bike territory — on 650b wheels with drop bars. This is not a fringe mod. This is production geometry.</p>

                        <p>Here is every frame we could confirm for 2026, organized by how much clearance they actually offer.</p>

                        <h2 className="text-white mt-12 mb-6">The Definitive 2026 List</h2>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 my-6 overflow-x-auto">
                            <table className="w-full text-sm text-gray-300">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-2 text-emerald-400 font-semibold">Frame</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Official Max</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Wheel Size</th>
                                        <th className="text-center py-2 text-emerald-400 font-semibold">Measured Min Clearance*</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Lauf Seigla</strong></td>
                                        <td className="text-center">2.4&quot; (61mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~8mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Open U.P.</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>3T Exploro Pro</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Salsa Cutthroat</strong></td>
                                        <td className="text-center">2.2&quot; (56mm)</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~6mm</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-1.5"><strong>Niner RLT 9 RDO</strong></td>
                                        <td className="text-center">700c x 45mm / 650b x 2.0&quot;</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~5mm on 2.0&quot;</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1.5"><strong>Specialized Diverge STR</strong></td>
                                        <td className="text-center">700c x 47mm / 650b x 2.1&quot;</td>
                                        <td className="text-center">650b</td>
                                        <td className="text-center">~5mm on 2.1&quot;</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-3">* Measured clearance at the tightest point (usually chainstays or fork crown) with the tire inflated. Minimum recommended clearance is 6mm to account for mud buildup.</p>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Why 650b, Not 700c?</h2>

                        <p>A 650b wheel with a 57mm tire has roughly the same <em>outer diameter</em> as a 700c wheel with a 37mm tire. That means your bike's geometry — bottom bracket height, trail, stack — all stay in the intended range. Run a 57mm tire on a 700c wheel and your bottom bracket rises nearly 20mm, the bike handles completely differently, and toe overlap becomes a real risk.</p>

                        <p>If you are building around 2.25-inch tires, buy a 650b wheelset. Period.</p>

                        <h2 className="text-white mt-12 mb-6">Frame-by-Frame Notes</h2>

                        <h3 className="text-white mt-8 mb-4">Lauf Seigla — The King of Big Tires</h3>
                        <p>The Seigla is the only frame on this list that officially spec&apos;s 2.4-inch tires (61mm). That is bigger than almost any gravel bike. The carbon leaf spring fork provides 30mm of compliance without a suspension fork's weight or complexity. It is an unusual design, but it pairs perfectly with massive tires on chunky terrain.</p>
                        <p>If you want the most tire volume with zero suspension maintenance: this is the frame.</p>

                        <h3 className="text-white mt-8 mb-4">Open U.P. / Open U.P.P.E.R. — The Original Big-Tire Gravel Frame</h3>
                        <p>Gerald Vroomen designed the Open U.P. with the explicit goal of fitting big tires. The asymmetric chainstays open up massive clearance, and the frame has been refined over multiple generations. 2.2 inches (56mm) officially supported, 2.3 inches often possible depending on tire brand.</p>

                        <h3 className="text-white mt-8 mb-4">3T Exploro Pro — Italian Engineering, Real Clearance</h3>
                        <p>3T claims 61mm clearance for the Exploro Pro, but measured clearance with a 57mm tire is closer to 6mm at the tightest point. That is enough for clean riding but leaves no margin for mud. If you are running 2.2-inch tires in muddy conditions, the Exploro Pro will rub. For dry, rocky terrain it is perfect.</p>

                        <h3 className="text-white mt-8 mb-4">Salsa Cutthroat — The Bikepacking Choice</h3>
                        <p>The Cutthroat was designed for the Tour Divide and other ultra-endurance events. 2.2-inch clearance on 650b gives you volume and grip for long days on mixed surfaces, plus massive cargo capacity with triple-cage mounts everywhere. If you are bikepacking more than you are racing: this frame.</p>

                        <h3 className="text-white mt-8 mb-4">Niner RLT 9 RDO — The Safe Pick</h3>
                        <p>Niner officially spec&apos;s 700c x 45mm or 650b x 2.0 inches. That is slightly less than 2.25, but still huge by most gravel frame standards. If you want a proven, available frame from a brand with a massive dealer network: the RLT 9 RDO is a safe bet. Drop to 2.0-inch Maxxis Ikon or Rekon and you have a capable gravel-plus ride.</p>

                        <h3 className="text-white mt-8 mb-4">Specialized Diverge STR — The FutureShock Factor</h3>
                        <p>The Diverge STR adds FutureShock 2.0 (suspension in the headset) to the mix, and officially accepts 650b x 2.1-inch tires. That&apos;s 53mm — slightly under the 2.25-inch threshold, but still in the big-tire category. The FutureShock fork gives you an additional 20mm of front-end compliance, which is a different approach to the same goal the Lauf Seigla achieves with a leaf spring fork.</p>

                        <h2 className="text-white mt-12 mb-6">What You Lose (Trade-Offs)</h2>

                        <p>Running 2.25-inch tires is not an upgrade without trade-offs:</p>
                        <ul className="space-y-1">
                            <li><strong>Weight:</strong> A 57mm tire weighs 550-700g each. Two tires plus 650b wheels adds 300-500g versus a 700c x 40mm setup. That is rotational weight — the most performance-reducing kind.</li>
                            <li><strong>Rolling resistance:</strong> On pavement, 2.25-inch tires are significantly slower than 40-45mm gravel tires. The speed penalty is real on long paved sections.</li>
                            <li><strong>Gearing:</strong> A 57mm tire adds ~6% effective diameter versus 50mm. If you are on a 40t chainring, it feels like 42.4t. Check your gear inches <Link href="/blog/how-tire-width-changes-gravel-gear-ratio" className="text-cyan-400 hover:underline">with our gearing guide</Link>.</li>
                            <li><strong>Tire pressure:</strong> You are running 15-22 PSI. That is MTB territory. Your tubeless setup and sealant strategy matters a lot more. See our <Link href="/blog/gravel-tire-psiby-width-guide-2026" className="text-cyan-400 hover:underline">tire pressure by width guide</Link> for exact PSI data.</li>
                        </ul>

                        <h2 className="text-white mt-12 mb-6">Should You Go This Big?</h2>

                        <p>Here is my honest take: 2.25-inch gravel tires are amazing for <em>specific riding</em>. If you ride technical singletrack, bikepack through the desert, or live in a place where gravel roads feel more like MTB trails — go big. The grip and comfort are transformational.</p>

                        <p>If you ride fast group rides on mixed pavement and gravel, 45-50mm is the sweet spot. You get most of the comfort benefit without the weight penalty and rolling-resistance hit of 57mm.</p>

                        <p>Build your ideal setup with CrankSmith — enter your frame, tires, and drivetrain, and we will flag any clearance issues or gearing problems before you buy anything. No surprises, no returns, no &quot;oh that won&apos;t fit&quot; moments.</p>

                        <div className="bg-gray-900/30 p-5 rounded-xl border border-emerald-500/20">
                            <p className="text-gray-300 text-sm"><strong className="text-white">Bottom line:</strong> The Lauf Seigla and Open U.P. lead the pack for maximum tire clearance. The Salsa Cutthroat is the bikepacking choice. The Diverge STR brings FutureShock compliance to the mix. Pick the frame that matches your riding, dial the pressure right, and enjoy the most capable gravel bike you can build.</p>
                        </div>
                    </div>

                    <BlogCTA heading="Check Frame and Tire Compatibility" sub="Enter your frame, tire size, and drivetrain. We flag clearance issues and gearing problems before you buy." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
