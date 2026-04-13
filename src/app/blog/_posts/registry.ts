import { ComponentType } from "react";

import Post45mm, { metadata as meta45mm, faqSchema as faq45mm } from "./45mm-is-the-new-minimum-gravel-tire";
import PostMullet, { metadata as metaMullet, faqSchema as faqMullet } from "./the-gravel-mullet-road-shifter-mtb-derailleur";
import Post1xVs2x, { metadata as meta1xVs2x, faqSchema as faq1xVs2x } from "./1x-vs-2x-gravel-2026-numbers";
import PostTireWidthGearing, { metadata as metaTireWidthGearing, faqSchema as faqTireWidthGearing } from "./how-tire-width-changes-gravel-gear-ratio";
import PostUnbound2026, { metadata as metaUnbound2026, faqSchema as faqUnbound2026 } from "./unbound-gravel-2026-tire-gear-setup";
import PostTirePressureByWidth, { metadata as metaTirePressure, faqSchema as faqTirePressure } from "./gravel-tire-psiby-width-guide-2026";
import Post225Frames, { metadata as meta225Frames, faqSchema as faq225Frames } from "./every-gravel-frame-that-fits-2-25in-tires";
import PostHooklessVsHooked, { metadata as metaHookless, faqSchema as faqHookless } from "./hookless-vs-hooked-gravel-wheels-safety-guide";
import PostRockShoxRudy, { metadata as metaRudy, faqSchema as faqRudy } from "./rockshox-rudy-vs-rigid-gravel-suspension";
import PostTubelessSetup, { metadata as metaTubeless, faqSchema as faqTubeless } from "./gravel-tubeless-setup-guide";
import PostNewReleases2026, { metadata as metaNewReleases, faqSchema as faqNewReleases } from "./2026-gravel-bike-new-releases-april";

export type PostMetadata = {
    title: string;
    description: string;
    date: string;
    category: string;
    keywords: string[];
    image: string;
    excerpt: string;
};

export type PostEntry = {
    metadata: PostMetadata;
    faqSchema: object;
    Component: ComponentType<{ articleSchema: object }>;
};

export const posts: Record<string, PostEntry> = {
    "45mm-is-the-new-minimum-gravel-tire": {
        metadata: meta45mm,
        faqSchema: faq45mm,
        Component: Post45mm,
    },
    "the-gravel-mullet-road-shifter-mtb-derailleur": {
        metadata: metaMullet,
        faqSchema: faqMullet,
        Component: PostMullet,
    },
    "1x-vs-2x-gravel-2026-numbers": {
        metadata: meta1xVs2x,
        faqSchema: faq1xVs2x,
        Component: Post1xVs2x,
    },
    "how-tire-width-changes-gravel-gear-ratio": {
        metadata: metaTireWidthGearing,
        faqSchema: faqTireWidthGearing,
        Component: PostTireWidthGearing,
    },
    "unbound-gravel-2026-tire-gear-setup": {
        metadata: metaUnbound2026,
        faqSchema: faqUnbound2026,
        Component: PostUnbound2026,
    },
    "gravel-tire-psiby-width-guide-2026": {
        metadata: metaTirePressure,
        faqSchema: faqTirePressure,
        Component: PostTirePressureByWidth,
    },
    "every-gravel-frame-that-fits-2-25in-tires": {
        metadata: meta225Frames,
        faqSchema: faq225Frames,
        Component: Post225Frames,
    },
    "hookless-vs-hooked-gravel-wheels-safety-guide": {
        metadata: metaHookless,
        faqSchema: faqHookless,
        Component: PostHooklessVsHooked,
    },
    "rockshox-rudy-vs-rigid-gravel-suspension": {
        metadata: metaRudy,
        faqSchema: faqRudy,
        Component: PostRockShoxRudy,
    },
    "gravel-tubeless-setup-guide": {
        metadata: metaTubeless,
        faqSchema: faqTubeless,
        Component: PostTubelessSetup,
    },
    "2026-gravel-bike-new-releases-april": {
        metadata: metaNewReleases,
        faqSchema: faqNewReleases,
        Component: PostNewReleases2026,
    },
};

export const slugs = Object.keys(posts);
