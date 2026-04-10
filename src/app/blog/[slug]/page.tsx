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
        image: "/images/blog-45mm-minimum.jpg"
    },
    "the-gravel-mullet-road-shifter-mtb-derailleur": {
        title: "The Gravel Mullet: Road Shifter + MTB Derailleur — Every Combo That Actually Works",
        description: "Complete compatibility matrix for mullet gravel drivetrains: SRAM AXS, Shimano GRX × XT/XTR, Wolf Tooth Tanpan, RoadLink.",
        date: "2026-04-11",
        category: "Drivetrain",
        keywords: ["gravel mullet drivetrain", "road shifter mtb derailleur", "sram axs mullet", "shimano grx xt", "wolf tooth tanpan"],
        image: "/images/blog-gravel-mullet.jpg"
    },
    "1x-vs-2x-gravel-2026-numbers": {
        title: "1x vs 2x on Gravel in 2026: The Actual Numbers",
        description: "Gear range comparisons, cadence gap analysis, and chain retention data for 1x and 2x gravel drivetrain setups.",
        date: "2026-04-12",
        category: "Drivetrain",
        keywords: ["1x vs 2x gravel", "gravel drivetrain range", "gravel gear ratio", "single ring gravel"],
        image: "/images/blog-1x-vs-2x.jpg"
    },
    "how-tire-width-changes-gravel-gear-ratio": {
        title: "How Your Bigger Gravel Tire Changes Your Actual Gear Ratio",
        description: "Wider tires increase effective gear inches. 45mm vs 35mm is a ~6% difference. See how it works.",
        date: "2026-04-14",
        category: "Drivetrain",
        keywords: ["tire circumference gearing", "gravel tire gear inches", "wider tire gear ratio"],
        image: "/images/blog-tire-gearing.jpg"
    },
    "unbound-gravel-2026-tire-gear-setup": {
        title: "Unbound Gravel 2026: The Ultimate Tire & Gear Setup Guide",
        description: "Tire and gearing strategies for Unbound Gravel 2026 in Emporia, Kansas. What pros run vs what works.",
        date: "2026-04-15",
        category: "Racing",
        keywords: ["unbound gravel 2026", "unbound tire setup", "unbound gearing", "emporia gravel"],
        image: "/images/blog-unbound-2026.jpg"
    },
    "gravel-tire-psiby-width-guide-2026": {
        title: "Gravel Tire Pressure by Width: The Definitive Guide (40mm to 2.25\")",
        description: "Optimal PSI for 40mm, 45mm, 50mm, 55mm, 2.1, and 2.25 inch gravel tires. Rider weight and terrain charts. Hookless rim limits.",
        date: "2026-04-16",
        category: "Big Tires",
        keywords: ["gravel tire pressure guide", "gravel tire psi", "hookless max pressure", "gravel tire pressure by width"],
        image: "/images/blog-tire-pressure-guide.jpg"
    },
    "every-gravel-frame-that-fits-2-25in-tires": {
        title: "Every 2026 Gravel Frame That Fits 2.25-Inch Tires",
        description: "Definitive list of gravel frames that officially clear 57mm (2.25\") MTB tires: Allied Able, Lauf Seigla, 3T Extrema, and more.",
        date: "2026-04-17",
        category: "Big Tires",
        keywords: ["gravel frame 2.25 tire clearance", "57mm tire gravel", "mtb tire on gravel bike"],
        image: "/images/blog-2-25-frames.jpg"
    },
    "hookless-vs-hooked-gravel-wheels-safety-guide": {
        title: "Hookless vs Hooked Gravel Wheels: The Safety Guide That Actually Matters",
        description: "ETRTO updated standards for hookless gravel wheels. Max pressure limits. Which tires are hookless-approved.",
        date: "2026-04-21",
        category: "Standards",
        keywords: ["hookless gravel wheels", "hookless safety", "etrto hookless standards", "hooked vs hookless gravel"],
        image: "/images/blog-hookless-safety.jpg"
    },
    "rockshox-rudy-vs-rigid-gravel-suspension": {
        title: "RockShox Rudy vs Rigid Fork: Is Gravel Suspension Worth It in 2026?",
        description: "800g weight penalty. Elite racers using it instead of wide tires. The pros, cons, and real speed data.",
        date: "2026-04-22",
        category: "Suspension",
        keywords: ["rockshox rudy gravel", "gravel suspension fork", "gravel fork weight"],
        image: "/images/blog-suspension-vs-rigid.jpg"
    },
    "gravel-tubeless-setup-guide": {
        title: "Gravel Tubeless Setup: What Seals, What Tapes, What Goes Wrong",
        description: "Tape layers by rim width. Sealant amounts by tire volume. Burping fix on hookless. Common mistakes.",
        date: "2026-04-24",
        category: "Setup",
        keywords: ["gravel tubeless setup", "gravel tubeless tape", "gravel tire burping", "gravel sealant amount"],
        image: "/images/blog-tubeless-setup.jpg"
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

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            If you&apos;re still running 35mm or 40mm tires on your gravel bike, you&apos;re riding on last decade&apos;s setup. <strong>45mm has become the accepted minimum for general gravel riding</strong>, and for good reason. The combination of rolling efficiency, puncture protection, and the ability to run lower pressures for grip makes wider tires objectively faster on most real-world gravel surfaces.
                        </p>

                        <h2 className="text-white mt-12 mb-6">What Changed?</h2>
                        <p>The 2026 gravel frame market has shifted. Where 40mm clearance was once considered generous, <strong>50mm is now the baseline expectation</strong> for new gravel bikes. The Specialized Diverge clears 55mm. The Allied Able handles 57mm. Even mid-range carbon frames are opening up their chainstays and fork crowns to accommodate 50mm+ rubber.</p>
                        <p>This isn&apos;t just manufacturer marketing — it reflects real rider behavior. On Reddit and gravel forums, riders who switch from 35mm or 40mm to 45mm consistently report faster times on rough gravel, fewer flats, and a more comfortable ride without a measurable speed penalty on pavement. The physics: at lower pressures (20-30 PSI range for wider tires), the tire deforms around obstacles instead of bouncing off them, maintaining momentum.</p>

                        <h2 className="text-white mt-12 mb-6">The Rolling Resistance Reality</h2>
                        <p>Independent testing has confirmed what gravel racers already knew: <strong>wider tires often roll faster than narrow tires on rough surfaces</strong>. A 45mm tire at 30 PSI will outperform a 35mm tire at 50 PSI on anything but perfectly smooth tarmac. The energy lost to suspension (your body vibrating) far exceeds the marginal increase in tire deformation.</p>

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

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
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

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
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
                        <p>For everyone else — bikepackers, technical trail riders, gravel race starters — <strong>range matters more than steps</strong>. Having a sub-20 gear inch ratio for steep climbs is more valuable than fine cadence control on the flat bits.</p>

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
