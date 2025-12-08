import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string }>;
};

const guideData: Record<string, { title: string; description: string; date: string; category: string; keywords: string[]; image: string }> = {
    "gravel-groupsets-explained": {
        title: "Gravel Drivetrain & Groupset Configurations",
        description: "1x vs 2x, Mullet drivetrains, and compatibility logic. A technical breakdown of modern gravel gearing ecosystems (SRAM AXS, Shimano GRX).",
        date: "2025-12-04",
        category: "Drivetrain",
        keywords: ["gravel bike gearing", "mullet drivetrain", "sram axs mullet", "shimano grx vs sram axs", "1x vs 2x gravel", "bikepacking gear ratio", "bike ranging", "gravel groupset comparison"],
        image: "/images/guide-gravel-mullet-main.jpg"
    },
    "bottom-bracket-standards": {
        title: "Bottom Bracket Shells & Bearing Standards",
        description: "Engineering breakdown of BSA, PF30, T47 and DUB standards. Solving compatibility issues, preventing creaks, and choosing the right bearings.",
        date: "2025-12-02",
        category: "Standards",
        keywords: ["bottom bracket standards", "T47 vs PF30", "BSA threaded bb", "bike creaking fix", "dub crankset compatibility", "bottom bracket replacement guide", "ceramic vs steel bearings"],
        image: "/images/guide-bb-t47-main.jpg"
    },
    "brake-mount-standards": {
        title: "Disc Brake Mounting Systems & Compatibility",
        description: "Flat Mount vs Post Mount vs IS. Rotor size compatibility, adapter logic explainer, and how to fit disc brake calipers to any frame.",
        date: "2025-11-28",
        category: "Braking",
        keywords: ["flat mount vs post mount", "disc brake adapters", "bicycle brake mounts", "160mm rotor adapter", "IS mount to post mount", "gravel bike brake compatibility", "shimano flat mount"],
        image: "/images/guide-brake-mount-main.jpg"
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = guideData[slug] || { title: "Technical Guide", description: "Technical guide for bicycle mechanics.", keywords: [] as string[], category: "General", date: "", image: "" };

    return {
        title: `${guide.title} | CrankSmith`,
        description: guide.description,
        keywords: [...guide.keywords, "bicycle mechanics", "bike building", "cycling tech", guide.category.toLowerCase()],
        openGraph: {
            title: guide.title,
            description: guide.description,
            type: "article",
            publishedTime: guide.date,
            images: guide.image ? [{ url: `https://cranksmith.com${guide.image}` }] : [],
        }
    };
}

export default async function GuidePage({ params }: Props) {
    const { slug } = await params;
    const guide = guideData[slug];

    // Generate schema for the article
    const articleSchema = guide ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": guide.title,
        "description": guide.description,
        "datePublished": guide.date,
        "dateModified": guide.date,
        "author": {
            "@type": "Organization",
            "name": "CrankSmith Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CrankSmith",
            "logo": {
                "@type": "ImageObject",
                "url": "https://cranksmith.com/icon-512.png"
            }
        },
        "image": guide.image ? `https://cranksmith.com${guide.image}` : undefined,
        "articleSection": guide.category,
        "keywords": [...guide.keywords, "bicycle", "bike build", guide.category]
    } : null;

    // --- GUIDE 1: GRAVEL GROUPSETS ---
    if (slug === "gravel-groupsets-explained") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                        <div className="mb-12 text-center">
                            <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">Drivetrain • 2025-12-04</div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Gravel Drivetrain & Groupset Configurations</h1>
                            <p className="text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">1x simplicity vs 2x cadence. The rise of the Mullet. Here is the engineering logic behind your choices.</p>
                        </div>

                        <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src="/images/guide-gravel-mullet-main.jpg"
                                alt="SRAM AXS Mullet Drivetrain Schematic showing shifter and derailleur pairing"
                                width={1200}
                                height={675}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                            <p className="lead text-xl text-stone-200">
                                Gravel cycling has evolved from "road bikes with big tires" into a discipline with its own distinct mechanical requirements. The drivetrain market is dominated by Shimano GRX, SRAM AXS XPLR, and the hybrid "Mullet" ecosystem.
                            </p>

                            <h2 className="text-white mt-12 mb-6">1. The 1x vs 2x Calculus</h2>
                            <p>The choice between single and double chainrings comes down to two variables: <strong>Range</strong> and <strong>Steps</strong>.</p>

                            <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                                <Image
                                    src="/images/guide-gearing-range.jpg"
                                    alt="Visual comparison of 10-52t cassette range vs tight road gear steps"
                                    width={1000}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 my-8">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="text-white font-bold text-lg mb-2">1x (One-By)</h3>
                                    <ul className="list-disc pl-4 space-y-2 text-sm">
                                        <li><strong>Pros:</strong> Chain retention (Narrow-Wide profile), simplicity, weight savings (no FD), tire clearance.</li>
                                        <li><strong>Range:</strong> massive (10-52t = 520%).</li>
                                        <li><strong>Cons:</strong> Large jumps between gears (often 15-20% cadence changes).</li>
                                    </ul>
                                </div>
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="text-white font-bold text-lg mb-2">2x (Two-By)</h3>
                                    <ul className="list-disc pl-4 space-y-2 text-sm">
                                        <li><strong>Pros:</strong> Tight gear steps (11-34t cassette), maintains optimal cadence on flats.</li>
                                        <li><strong>Range:</strong> Moderate (470-500% typically).</li>
                                        <li><strong>Cons:</strong> Chain drops more likely, limits rear tire width (FD cage interference).</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-white mt-12 mb-6">2. The "Mullet" Drivetrain</h2>
                            <p>A "Mullet" build combines <strong>Road/Gravel Shifters</strong> with a <strong>Mountain Bike Rear Derailleur</strong> and Cassette. This unlocks MTB range (10-52t) with drop-bar ergonomics.</p>

                            <h3 className="text-white mt-6 mb-3">SRAM AXS (The Gold Standard)</h3>
                            <p>SRAM's wireless ecosystem is natively compatible. Any AXS Road shifter pairs with any AXS MTB derailleur (Eagle XX1, X01, GX).</p>

                            <div className="my-6 rounded-xl overflow-hidden border border-white/10 float-right md:w-1/2 md:ml-6 mb-6">
                                <Image
                                    src="/images/guide-freehub-standards.jpg"
                                    alt="Exploded view of Freehub body standards: HG vs XD vs MicroSpline"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                                <p className="text-xs text-center text-stone-500 p-2 bg-black/40">Freehub standards dictate cassette compatibility</p>
                            </div>

                            <ul className="list-disc pl-5">
                                <li><strong>Chain Requirement:</strong> Must use 12-speed Eagle chain (Flattop road chains are NOT compatible with Eagle pulleys/cassettes).</li>
                                <li><strong>Crankset:</strong> Can use 1x Road or MTB crankset.</li>
                            </ul>

                            <h3 className="text-white mt-6 mb-3">Shimano GRX / Di2</h3>
                            <p>Shimano is stricter. Mechanical road shifters pull different cable ratios than MTB derailleurs.</p>
                            <ul className="list-disc pl-5">
                                <li><strong>Electronic (Di2):</strong> You can mix XT Di2 rear derailleurs with GRX Di2 shifters <em>if</em> you solve the E-Tube project compatibility checks (often requires specific display/junction units).</li>
                                <li><strong>Mechanical:</strong> Requires a cable pull converter like the <strong>Wolf Tooth Tanpan</strong> to make a road lever actuate an MTB derailleur.</li>
                            </ul>
                        </div>

                        <div className="mt-16 border-t border-white/10 pt-12 clear-both">
                            <Link href="/builder" className="block p-8 rounded-2xl bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                                <h3 className="text-2xl font-bold text-white mb-2">Build Your Groupset</h3>
                                <p className="text-cyan-200 mb-4">Validate your 1x, 2x, or Mullet drivetrain ideas in our compatibility engine.</p>
                                <span className="inline-flex items-center text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">Run Compatibility Check <ArrowRight className="ml-2 w-5 h-5" /></span>
                            </Link>
                        </div>
                    </article>
                </div>
            </>
        );
    }

    // --- GUIDE 2: BOTTOM BRACKETS ---
    if (slug === "bottom-bracket-standards") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                        <div className="mb-12 text-center">
                            <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • 2025-12-02</div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Bottom Bracket Shells & Bearing Standards</h1>
                            <p className="text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">BSA, PF30, T47. Why they exist, why they creak, and how to identify what you need.</p>
                        </div>

                        <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src="/images/guide-bb-t47-main.jpg"
                                alt="Close up schematic of a T47 threaded bottom bracket with ceramic bearings"
                                width={1200}
                                height={675}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                            <p className="lead text-xl text-stone-200">
                                The Bottom Bracket (BB) is the most notorious component in cycling. What was once simple (BSA) became complex with the Press-Fit revolution. Now, T47 puts us back on the right track.
                            </p>

                            <h2 className="text-white mt-12 mb-6">1. The Shell Standards</h2>
                            <p>The "Shell" is the hole in your frame. You cannot change this. You must adapt to it.</p>

                            <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                                <Image
                                    src="/images/guide-bb-shell-comparison.jpg"
                                    alt="Comparison of BSA, PF30, and T47 bottom bracket shell dimensions"
                                    width={1000}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            <table className="w-full text-left text-sm border-collapse my-8 bg-white/5 rounded-lg overflow-hidden">
                                <thead className="bg-white/10 text-white">
                                    <tr>
                                        <th className="p-4">Standard</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Diameter</th>
                                        <th className="p-4">Width (Road)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 text-stone-300">
                                    <tr><td className="p-4 font-bold text-white">BSA (English)</td><td className="p-4">Threaded</td><td className="p-4">34.8mm</td><td className="p-4">68mm</td></tr>
                                    <tr><td className="p-4 font-bold text-white">T47</td><td className="p-4">Threaded</td><td className="p-4">47mm</td><td className="p-4">68mm or 86mm</td></tr>
                                    <tr><td className="p-4 font-bold text-white">PF30</td><td className="p-4">Press Fit</td><td className="p-4">46mm</td><td className="p-4">68mm</td></tr>
                                    <tr><td className="p-4 font-bold text-white">BB86</td><td className="p-4">Press Fit</td><td className="p-4">41mm</td><td className="p-4">86.5mm</td></tr>
                                </tbody>
                            </table>

                            <h2 className="text-white mt-12 mb-6">2. T47: The Savior Standard</h2>
                            <p>T47 is essentially <strong>PF30 but threaded</strong>. It uses the large 46mm diameter of PF30 (allowing 30mm spindles) but adds threads to eliminate creaking and ensure parallel alignment.</p>
                            <ul className="list-disc pl-5">
                                <li><strong>T47 Internal (85.5-86.5mm width):</strong> Bearings sit <em>inside</em> the shell. Used on Trek and other BB86 successors.</li>
                                <li><strong>T47 External (68mm width):</strong> Bearings sit <em>outside</em> the shell. Used on custom steel/Ti bikes and BSA successors.</li>
                            </ul>

                            <h2 className="text-white mt-12 mb-6">3. Spindle Diameters</h2>
                            <p>Once you know your shell, you must match the BB bearing ID to your crank spindle.</p>

                            <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                                <Image
                                    src="/images/guide-bb-spindle-comparison.jpg"
                                    alt="Crankset Spindle Standard Comparison: 24mm vs 28.99mm vs 30mm"
                                    width={1000}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            <ul className="list-disc pl-5">
                                <li><strong>24mm (Shimano HTII):</strong> The gold standard for durability. Fits in almost any shell.</li>
                                <li><strong>30mm:</strong> Stiff and light, but leaves very little room for bearings in a BB86/BSA shell (tiny bearings = fast wear). Ideally used with PF30/T47.</li>
                                <li><strong>28.99mm (SRAM DUB):</strong> A compromise. Fits slightly better in BSA shells than 30mm while being stiffer than 24mm.</li>
                            </ul>
                        </div>
                    </article>
                </div>
            </>
        );
    }

    // --- GUIDE 3: BRAKE MOUNTS ---
    if (slug === "brake-mount-standards") {
        return (
            <>
                {articleSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                    />
                )}
                <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                    <article className="container mx-auto max-w-3xl">
                        <div className="mb-12 text-center">
                            <div className="text-blue-400 text-sm font-mono mb-4 uppercase tracking-wider">Braking • 2025-11-28</div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Disc Brake Mounting Systems & Compatibility</h1>
                            <p className="text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">IS, Post Mount, Flat Mount. How to identify them and the logic of adapters.</p>
                        </div>

                        <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image
                                src="/images/guide-brake-mount-main.jpg"
                                alt="Proprietary schematic showing Flat Mount vs Post Mount caliper locations on a fork"
                                width={1200}
                                height={675}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                            <p className="lead text-xl text-stone-200">
                                Disc brakes have taken over, but mounting them is not universal. We have moved from the crude tabs of IS standard to the integrated flush look of Flat Mount.
                            </p>

                            <h2 className="text-white mt-12 mb-6">1. The Three Standards</h2>

                            <h3 className="text-white mt-6 mb-2">Flat Mount (The Modern Road/Gravel Standard)</h3>
                            <p>Designed by Shimano to be aerodynamic and compact. The caliper sits flush against the frame/fork.</p>
                            <ul className="list-disc pl-5">
                                <li><strong>Rear:</strong> Bolts come <em>through</em> the frame chainstay from the bottom into the caliper.</li>
                                <li><strong>Front:</strong> Uses a mandatory thin adapter plate always. Flip the plate to switch between 140mm and 160mm rotors.</li>
                            </ul>

                            <h3 className="text-white mt-6 mb-2">Post Mount (The Mountain Bike Standard)</h3>
                            <p>Two threaded posts sticking out of the frame/fork perpendicular to the wheel axle. 74mm spacing center-to-center.</p>
                            <p>Most common on MTB and older gravel bikes. Calipers bolt directly onto these posts.</p>

                            <h3 className="text-white mt-6 mb-2">IS (International Standard - Legacy)</h3>
                            <p>Unthreaded tabs sticking off the side. You <strong>cannot</strong> bolt a caliper directly to IS tabs. You MUST use an adapter (IS-to-Post or IS-to-Flat).</p>

                            <h2 className="text-white mt-12 mb-6">2. Adapter Logic & Rotor Sizes</h2>
                            <p>Adapters push the caliper "out" (away from the axle) to accommodate larger rotors. You generally cannot go smaller than the native mount size (e.g., if a fork is native 160mm, you cannot fit a 140mm rotor).</p>

                            <div className="my-8 rounded-xl overflow-hidden border border-white/10">
                                <Image
                                    src="/images/guide-brake-adapters.jpg"
                                    alt="Technical breakdown of disc brake mount adapter plates and spacing logic"
                                    width={1000}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-6 my-6">
                                <h4 className="text-emerald-400 font-bold mb-2">Common Adaptation Rule</h4>
                                <p className="text-sm">
                                    <strong>+20mm Adapter:</strong> Most common adapter. Moves a native 140mm mount to 160mm, or a 160mm mount to 180mm.
                                </p>
                            </div>

                            <p><strong>Can I put Flat Mount calipers on a Post Mount frame?</strong><br />No. There is no room for the caliper body. (Exception: Some rare expensive niche adapters exists, but generally no).</p>
                            <p><strong>Can I put Post Mount calipers on a Flat Mount frame?</strong><br />Yes, adapters exist, but it looks bulky.</p>
                        </div>
                    </article>
                </div>
            </>
        );
    }

    // Fallback
    return (
        <div className="min-h-screen bg-gray-950 pt-24 px-4 text-center">
            <h1 className="text-2xl text-white">Guide not found</h1>
            <Link href="/guides" className="text-blue-400 mt-4 block">Back to Guides</Link>
        </div>
    );
}
