import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Dropper Posts on Gravel: Frame Compatibility, Routing, and Every Brand That Does It Right",
    description: "Which 2026 gravel frames have factory dropper routing, minimum insertion depth requirements, internal vs external cable routing options, and the best dropper posts for gravel.",
    date: "2026-04-28",
    category: "Standards",
    keywords: ["gravel dropper post compatibility", "dropper routing gravel frame", "gravel bike dropper post 2026", "internal dropper routing gravel", "best dropper post gravel"],
    image: "/images/gravel-dropper-post-frame-compatibility-routing.webp",
    excerpt: "Dropper posts are going mainstream on gravel in 2026. Here's everything you need to check before buying one for your frame."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "Does my gravel bike support a dropper post?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your frame. Check three things: (1) seatpost internal diameter — most gravel frames use 27.2mm seatposts, which limits dropper options; some newer frames use 30.9mm or 31.6mm for more dropper choice; (2) internal routing — factory internal routing makes for a cleaner install; (3) minimum insertion depth — the frame tube must allow enough seatpost insertion (typically 65-100mm) for structural safety while leaving room for the dropper mechanism." } },
        { "@type": "Question", "name": "What is the minimum insertion depth for a gravel dropper post?", "acceptedAnswer": { "@type": "Answer", "text": "Most dropper posts require a minimum insertion depth of 65-100mm into the seatpost tube, depending on the travel and mechanism. This is separate from the minimum insertion depth marking on the post itself. For a gravel frame with a 400-420mm seatpost tube, you typically have adequate insertion depth. For smaller frames (under 52cm), the seatpost tube is shorter and minimum insertion may be more constrained." } },
        { "@type": "Question", "name": "Which gravel bike frames have factory dropper routing in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "In 2026, frames with factory internal dropper routing include: Specialized Diverge (all tiers), Trek Checkpoint SL/SLR, Giant Revolt Advanced, Scott Addict Gravel, Salsa Cutthroat, and Cannondale Topstone Carbon. Several other brands offer optional internal routing. Always confirm the specific frameset year — factory routing was often added mid-production-run." } },
        { "@type": "Question", "name": "What dropper post size fits most gravel bikes?", "acceptedAnswer": { "@type": "Answer", "text": "27.2mm outer diameter is the most common seatpost size on gravel bikes. Unfortunately, 27.2mm dropper options are more limited than 30.9mm or 31.6mm. Options include the PNW Coast 27.2, Cane Creek Thudbuster (suspension post, not true dropper), and the TranzX JD-YSP18 in 27.2mm. Some riders use a 27.2mm shim in a 30.9mm frame for more dropper choices." } },
        { "@type": "Question", "name": "Is a dropper post worth it on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "For technical terrain, bikepacking, and adventure riding: yes, significantly. Dropping your seat by 50-100mm for steep descents fundamentally changes your ability to move the bike under you. For primarily smooth gravel racing or flat riding, the weight penalty (300-500g over a carbon post) rarely pays off. Most gravel riders who try a dropper on technical terrain don't go back." } }
    ]
};

export default function PostDropperPostGravel({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • April 28, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Dropper Posts on Gravel: Frame Compatibility, Routing, and Every Brand That Does It Right</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Dropper posts are going mainstream on gravel in 2026. Here&apos;s everything you need to check before buying one for your frame.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-dropper-post-frame-compatibility-routing.webp"
                        alt="Gravel bike frame with dropper post extended and dropped showing internal cable routing entry port and insert depth callout — CrankSmith dropper guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            Dropper posts were an MTB-only thing for years. In 2026, they&apos;re becoming a mainstream gravel upgrade for anyone who rides mixed terrain, does bikepacking, or wants more confidence on descents. But gravel frames weren&apos;t originally designed for them — which means the compatibility questions are more complex than on MTB frames.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Three Things to Check</h2>

                        <div className="my-6 space-y-4">
                            {[
                                {
                                    step: "1",
                                    title: "Seatpost Internal Diameter",
                                    desc: "Most gravel frames use 27.2mm seatposts (intentional — it's a flex-diameter for road comfort). This is the most common blocker for dropper posts. 27.2mm dropper options exist (PNW Coast, TranzX) but are more expensive and limited in travel compared to 30.9mm or 31.6mm options. Some newer adventure gravel frames are moving to 30.9mm specifically to enable better dropper options."
                                },
                                {
                                    step: "2",
                                    title: "Internal vs External Routing",
                                    desc: "Internal dropper routing requires a dedicated cable port in the frame — typically near the bottom bracket or seatpost entry. Factory internal routing gives the cleanest install. External routing is always possible with a good cable guide, but adds clutter. If you have external routing, a wireless dropper (OneUp V3 wireless, SRAM AXS dropper) eliminates this problem entirely."
                                },
                                {
                                    step: "3",
                                    title: "Minimum Insertion Depth",
                                    desc: "The dropper post needs enough seatpost tube length to meet the minimum insertion depth line AND have adequate tube-within-tube overlap for the mechanism. Most droppers need 65-100mm of tube inside the frame. On smaller frames with short seatpost tubes, this can be limiting — measure your effective seatpost tube length from the collar to the bottom bracket shell."
                                },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4 bg-white/5 p-5 rounded-xl border border-white/10">
                                    <span className="text-cyan-400 font-bold text-2xl w-8 shrink-0">{step}</span>
                                    <div>
                                        <h3 className="text-white font-bold mb-1">{title}</h3>
                                        <p className="text-gray-300 text-sm">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">2026 Gravel Frames with Factory Dropper Routing</h2>
                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Frame</th>
                                        <th className="text-left p-3">Seatpost OD</th>
                                        <th className="text-left p-3">Dropper Routing</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Specialized Diverge", "27.2mm", "Factory internal (all tiers)"],
                                        ["Trek Checkpoint SL/SLR", "27.2mm", "Factory internal"],
                                        ["Giant Revolt Advanced", "27.2mm", "Factory internal (2026)"],
                                        ["Scott Addict Gravel", "27.2mm", "Factory internal"],
                                        ["Salsa Cutthroat", "30.9mm", "Factory internal — wider OD for better dropper choice"],
                                        ["Cannondale Topstone Carbon", "27.2mm", "Factory internal"],
                                        ["BMC URS", "27.2mm", "Factory internal"],
                                        ["Cervélo Aspero", "27.2mm", "External routing only"],
                                    ].map(([frame, od, routing]) => (
                                        <tr key={frame} className="hover:bg-white/5 transition-colors">
                                            <td className="p-3 font-medium text-white">{frame}</td>
                                            <td className="p-3 text-gray-300">{od}</td>
                                            <td className="p-3 text-gray-300">{routing}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Best Dropper Posts for Gravel in 2026</h2>
                        <div className="my-6 space-y-3">
                            {[
                                { name: "PNW Coast Dropper (27.2mm)", desc: "Best 27.2mm option. 60/80mm travel, wireless option available. Excellent gravel-specific travel lengths." },
                                { name: "OneUp Dropper V3 (30.9/31.6mm)", desc: "Cleanest cable routing of any dropper. Remote lever is excellent. Wireless V3 version is premium." },
                                { name: "SRAM Reverb AXS (30.9/31.6mm)", desc: "Wireless integration with AXS ecosystem. Works with existing AXS bar remote if you run SRAM AXS groupset." },
                                { name: "Specialized Command Post (27.2mm)", desc: "Factory-matched for Diverge. Cleaner integration than third-party on that frame." },
                            ].map(({ name, desc }) => (
                                <div key={name} className="flex gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                    <div>
                                        <p className="font-bold text-white text-sm">{name}</p>
                                        <p className="text-gray-400 text-sm mt-1">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <BlogCTA heading="Check If Your Frame Supports a Dropper" sub="Enter your frame and seatpost diameter to verify dropper post compatibility and routing options." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
