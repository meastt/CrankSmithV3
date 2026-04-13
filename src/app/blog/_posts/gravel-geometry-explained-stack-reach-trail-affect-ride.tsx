import Link from "next/link";
import { BlogCTA, BackLink, FeaturedImage } from "../_components/shared";

export const metadata = {
    title: "Gravel Geometry Explained: Stack, Reach, Trail and How They Affect Your Ride",
    description: "Stack, reach, trail, and wheelbase explained for gravel bikes — how modern 2026 geometry trends (longer/slacker) affect handling, and what flip-chip adjustments actually change.",
    date: "2026-05-01",
    category: "Standards",
    keywords: ["gravel bike geometry explained", "stack reach gravel bike", "gravel geometry 2026", "what is trail bicycle", "flip chip gravel bike geometry"],
    image: "/images/gravel-geometry-stack-reach-trail-explained.webp",
    excerpt: "Stack and reach tell you if a bike fits. Trail tells you how it handles. Chainstay length tells you how it climbs. Here's what each number means in practice."
};

export const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        { "@type": "Question", "name": "What is stack and reach on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Stack is the vertical distance from the bottom bracket center to the top of the head tube. Reach is the horizontal distance from the bottom bracket center to the top of the head tube. Together, they define the relationship between your seated position and your hand position — unlike top tube length, they don't change with different stem lengths or saddle heights. Longer reach = more stretched position; higher stack = more upright riding." } },
        { "@type": "Question", "name": "What is trail on a bicycle and why does it matter?", "acceptedAnswer": { "@type": "Answer", "text": "Trail is the horizontal distance between where the steering axis (extended through the fork) intersects the ground and where the tire contacts the ground. More trail = more self-centering steering (more stable at speed, slower to turn). Less trail = more responsive steering (quicker handling, less stable at high speeds). Gravel bikes typically have 55-70mm of trail — less than road bikes (where you want stability at 40+ km/h) but more than MTB (where slow-speed tech control matters)." } },
        { "@type": "Question", "name": "How is modern gravel bike geometry different from older designs?", "acceptedAnswer": { "@type": "Answer", "text": "Modern 2026 gravel bikes are significantly longer and slacker than 2018-era gravel bikes. Reach values have grown 10-20mm, head tube angles have slackened from ~73° to 71-71.5°, and chainstay lengths have grown 5-10mm to accommodate wider tires. These changes improve stability at speed on rough terrain, increase tire clearance, and create a more confident handling feel — but require re-learning sizing relative to older bikes." } },
        { "@type": "Question", "name": "What does a flip chip do on a gravel bike?", "acceptedAnswer": { "@type": "Answer", "text": "Flip chips are adjustable dropout inserts or bottom bracket shell inserts that allow switching between two geometry settings. Most commonly, flipping the chip changes the head tube angle by 0.5-1° (slacker for technical terrain, steeper for road-feel) and may also change bottom bracket height and chainstay length. Some frames (Salsa Warbird, Canyon Grail) use flip chips to switch between 700c and 650b wheel compatibility at consistent geometry." } },
        { "@type": "Question", "name": "How do I know if a gravel bike fits using stack and reach?", "acceptedAnswer": { "@type": "Answer", "text": "Compare the frame's stack and reach numbers to your current bike setup. Measure your current bike: stack = vertical distance from BB to bar top (with zero stack spacers); reach = horizontal distance from BB to bar top. Add 5-10mm reach tolerance for stem swaps. If the new frame's stack is within 10mm and reach within 15mm of your current setup, you can likely replicate your fit with standard stem adjustments." } }
    ]
};

export default function PostGravelGeometry({ articleSchema }: { articleSchema: object }) {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4">
                <article className="container mx-auto max-w-3xl">
                    <div className="mb-12 text-center">
                        <div className="text-cyan-400 text-sm font-mono mb-4 uppercase tracking-wider">Standards • May 1, 2026</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Gravel Geometry Explained: Stack, Reach, Trail and How They Affect Your Ride</h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">Stack and reach tell you if it fits. Trail tells you how it handles. Chainstay tells you how it climbs. Here&apos;s what each number actually means.</p>
                    </div>

                    <FeaturedImage
                        src="/images/gravel-geometry-stack-reach-trail-explained.webp"
                        alt="Gravel bike geometry diagram with labeled stack, reach, wheelbase, head tube angle, seat tube angle, and chainstay measurements — CrankSmith geometry guide 2026"
                    />

                    <div className="prose prose-invert prose-lg max-w-none text-stone-300">
                        <p className="lead text-xl text-stone-200">
                            Geometry numbers are hidden in plain sight on every frame spec sheet, yet most riders only look at frame size. Understanding what stack, reach, trail, and chainstay length actually mean — and how 2026&apos;s longer, slacker trend changes the picture — is the difference between buying a bike that fits and buying one that fighting you on every ride.
                        </p>

                        <h2 className="text-white mt-12 mb-6">The Four Numbers That Actually Matter</h2>

                        <div className="my-6 space-y-4">
                            {[
                                {
                                    number: "Stack",
                                    def: "Vertical distance: bottom bracket center → top of head tube",
                                    meaning: "How high your handlebar position will be, before stem angle. Higher stack = more upright. Lower stack = more aggressive. Gravel bikes typically run 580-640mm stack on a size 56cm. More stack than road bikes because upright position is more comfortable on long gravel hours.",
                                },
                                {
                                    number: "Reach",
                                    def: "Horizontal distance: bottom bracket center → top of head tube",
                                    meaning: "How stretched out you'll be. Modern gravel reach has grown dramatically — where a size 56cm road bike had 380-385mm reach, modern gravel bikes of the same nominal size run 390-400mm. You compensate with stem length, but there are limits. This is why new 2026 bikes often need sizing down.",
                                },
                                {
                                    number: "Trail",
                                    def: "Horizontal distance: steering axis ground contact → tire contact point",
                                    meaning: "Steering stability and self-centering. 55-70mm for most gravel bikes. Less trial (55mm) = quicker, more alert steering. More trail (70mm) = more planted, stable at speed. Head tube angle + fork rake together determine trail. Slacker HTA with proportional rake keeps trail in the sweet spot.",
                                },
                                {
                                    number: "Chainstay Length",
                                    def: "Center of bottom bracket → center of rear axle",
                                    meaning: "Wheelbase, tire clearance, and climbing feel. Shorter (420-430mm) = more snappy, easier to lift front wheel on climbs. Longer (440-450mm) = more stable at speed, more tire clearance, better loaded carrying. Most 2026 gravel bikes run 430-445mm.",
                                },
                            ].map(({ number, def, meaning }) => (
                                <div key={number} className="bg-white/5 p-5 rounded-xl border border-white/10">
                                    <h3 className="text-cyan-400 font-bold text-lg mb-1">{number}</h3>
                                    <p className="text-gray-400 text-xs font-mono mb-2">{def}</p>
                                    <p className="text-gray-300 text-sm">{meaning}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-white mt-12 mb-6">The 2026 Trend: Longer and Slacker</h2>
                        <p>Compare a 2018 size L gravel bike to its 2026 equivalent:</p>

                        <div className="my-6 overflow-x-auto">
                            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
                                <thead className="bg-white/5">
                                    <tr className="text-gray-400">
                                        <th className="text-left p-3">Measurement</th>
                                        <th className="text-left p-3">2018 Era</th>
                                        <th className="text-left p-3 text-cyan-400">2026 Era</th>
                                        <th className="text-left p-3">Effect</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ["Reach", "375-385mm", "390-405mm", "More reach, need shorter stem"],
                                        ["Head Tube Angle", "72.5-73°", "71-71.5°", "Slacker = more stable, less twitchy"],
                                        ["Chainstay", "420-430mm", "430-445mm", "Longer = more tire clearance"],
                                        ["Wheelbase", "1,010-1,025mm", "1,030-1,055mm", "Longer = more stable at speed"],
                                        ["BB Drop", "70-75mm", "70-80mm", "Lower = more stable, more clearance"],
                                    ].map(([m, old, new_, effect]) => (
                                        <tr key={m} className="hover:bg-white/5">
                                            <td className="p-3 font-medium">{m}</td>
                                            <td className="p-3 text-gray-400">{old}</td>
                                            <td className="p-3 text-cyan-300">{new_}</td>
                                            <td className="p-3 text-gray-400 text-sm">{effect}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-white mt-12 mb-6">Flip Chips: What They Actually Change</h2>
                        <p>Flip chips are reversible adjustable dropouts or inserts that offer two geometry modes. What most actually change:</p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Head tube angle: ±0.5-1°</strong> — slacker for technical terrain, steeper for road feel</li>
                            <li><strong>Bottom bracket height: ±3-5mm</strong> — lower is more stable, higher is more clearance-friendly</li>
                            <li><strong>Chainstay length: ±5-10mm</strong> — affects wheelbase and how the bike climbs</li>
                            <li><strong>Wheel size: 700c ↔ 650b</strong> on some frames, with geometry compensated to maintain similar ride height</li>
                        </ul>
                        <p className="mt-4">Most riders set their flip chip once and leave it. The practical difference between modes is real but subtle — more noticeable on technical, mixed-terrain riding than on straightforward gravel roads.</p>

                        <p className="mt-4">To compare geometry numbers across specific frames — enter two frames in CrankSmith and see how reach, stack, trail, and chainstay compare side by side.</p>
                    </div>

                    <BlogCTA heading="Compare Geometry Across Frames" sub="Enter your current frame and a frame you're considering to see how stack, reach, and trail compare." />
                    <BackLink />
                </article>
            </div>
        </>
    );
}
