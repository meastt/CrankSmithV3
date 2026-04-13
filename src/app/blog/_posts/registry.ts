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

// Priority 1 — High-Value Gaps
import Post225InchTires, { metadata as meta225InchTires, faqSchema as faq225InchTires } from "./gravel-225-inch-tires-when-your-gravel-bike-becomes-light-mtb";
import PostTireWidthSelectionGuide, { metadata as metaTireWidthSelection, faqSchema as faqTireWidthSelection } from "./gravel-tire-width-selection-guide-40mm-45mm-50mm-real-numbers";
import PostGroupsetComparison2026, { metadata as metaGroupsetComparison, faqSchema as faqGroupsetComparison } from "./shimano-grx-vs-sram-axs-xplr-vs-campagnolo-ekar-2026";
import PostMidSouth2026, { metadata as metaMidSouth2026, faqSchema as faqMidSouth2026 } from "./mid-south-2026-gearing-breakdown-what-pros-actually-ran";

// Priority 2 — Standards & Decision Content
import PostBottomBracketStandards, { metadata as metaBBStandards, faqSchema as faqBBStandards } from "./gravel-bottom-bracket-standards-why-your-creak-is-pf30";
import PostAxleStandards, { metadata as metaAxleStandards, faqSchema as faqAxleStandards } from "./gravel-axle-standards-boost-142x12-thru-axle-explained";
import PostBrakeMountStandards, { metadata as metaBrakeMounts, faqSchema as faqBrakeMounts } from "./flat-mount-vs-post-mount-gravel-brakes-rotor-size-limits";
import PostRimWidthGuide, { metadata as metaRimWidth, faqSchema as faqRimWidth } from "./gravel-rim-width-guide-25mm-28mm-30mm-internal";
import PostAeroGravel, { metadata as metaAeroGravel, faqSchema as faqAeroGravel } from "./aero-gains-on-gravel-deep-section-wheels-vs-narrow-tires";
import PostDropperPostGravel, { metadata as metaDropperPost, faqSchema as faqDropperPost } from "./dropper-posts-on-gravel-frame-compatibility-routing-brands";
import PostFirstUpgrade, { metadata as metaFirstUpgrade, faqSchema as faqFirstUpgrade } from "./first-500-dollar-gravel-bike-upgrade-where-money-goes";
import PostDrivetrainWear, { metadata as metaDrivetrainWear, faqSchema as faqDrivetrainWear } from "./gravel-drivetrain-wear-chain-cassette-chainring-replacement";

// Priority 3 — Bonus Posts
import PostGravelGeometry, { metadata as metaGravelGeometry, faqSchema as faqGravelGeometry } from "./gravel-geometry-explained-stack-reach-trail-affect-ride";
import PostAXSvsDi2, { metadata as metaAXSvsDi2, faqSchema as faqAXSvsDi2 } from "./sram-axs-vs-shimano-di2-gravel-e-shifting-showdown";
import PostTireInserts, { metadata as metaTireInserts, faqSchema as faqTireInserts } from "./gravel-tire-inserts-worth-it-2026";
import Post700cVs650b, { metadata as meta700cVs650b, faqSchema as faq700cVs650b } from "./700c-vs-650b-gravel-wheels-real-debate";
import PostGravelRacingComparison, { metadata as metaGravelRacing, faqSchema as faqGravelRacing } from "./gravel-racing-unbound-vs-mid-south-vs-sbt-grvl-which-suits-you";
import PostBudgetGroupsets, { metadata as metaBudgetGroupsets, faqSchema as faqBudgetGroupsets } from "./budget-gravel-groupsets-that-dont-suck-2026";

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
    // Priority 1 — High-Value Gaps
    "gravel-225-inch-tires-when-your-gravel-bike-becomes-light-mtb": {
        metadata: meta225InchTires,
        faqSchema: faq225InchTires,
        Component: Post225InchTires,
    },
    "gravel-tire-width-selection-guide-40mm-45mm-50mm-real-numbers": {
        metadata: metaTireWidthSelection,
        faqSchema: faqTireWidthSelection,
        Component: PostTireWidthSelectionGuide,
    },
    "shimano-grx-vs-sram-axs-xplr-vs-campagnolo-ekar-2026": {
        metadata: metaGroupsetComparison,
        faqSchema: faqGroupsetComparison,
        Component: PostGroupsetComparison2026,
    },
    "mid-south-2026-gearing-breakdown-what-pros-actually-ran": {
        metadata: metaMidSouth2026,
        faqSchema: faqMidSouth2026,
        Component: PostMidSouth2026,
    },
    // Priority 2 — Standards & Decision Content
    "gravel-bottom-bracket-standards-why-your-creak-is-pf30": {
        metadata: metaBBStandards,
        faqSchema: faqBBStandards,
        Component: PostBottomBracketStandards,
    },
    "gravel-axle-standards-boost-142x12-thru-axle-explained": {
        metadata: metaAxleStandards,
        faqSchema: faqAxleStandards,
        Component: PostAxleStandards,
    },
    "flat-mount-vs-post-mount-gravel-brakes-rotor-size-limits": {
        metadata: metaBrakeMounts,
        faqSchema: faqBrakeMounts,
        Component: PostBrakeMountStandards,
    },
    "gravel-rim-width-guide-25mm-28mm-30mm-internal": {
        metadata: metaRimWidth,
        faqSchema: faqRimWidth,
        Component: PostRimWidthGuide,
    },
    "aero-gains-on-gravel-deep-section-wheels-vs-narrow-tires": {
        metadata: metaAeroGravel,
        faqSchema: faqAeroGravel,
        Component: PostAeroGravel,
    },
    "dropper-posts-on-gravel-frame-compatibility-routing-brands": {
        metadata: metaDropperPost,
        faqSchema: faqDropperPost,
        Component: PostDropperPostGravel,
    },
    "first-500-dollar-gravel-bike-upgrade-where-money-goes": {
        metadata: metaFirstUpgrade,
        faqSchema: faqFirstUpgrade,
        Component: PostFirstUpgrade,
    },
    "gravel-drivetrain-wear-chain-cassette-chainring-replacement": {
        metadata: metaDrivetrainWear,
        faqSchema: faqDrivetrainWear,
        Component: PostDrivetrainWear,
    },
    // Priority 3 — Bonus Posts
    "gravel-geometry-explained-stack-reach-trail-affect-ride": {
        metadata: metaGravelGeometry,
        faqSchema: faqGravelGeometry,
        Component: PostGravelGeometry,
    },
    "sram-axs-vs-shimano-di2-gravel-e-shifting-showdown": {
        metadata: metaAXSvsDi2,
        faqSchema: faqAXSvsDi2,
        Component: PostAXSvsDi2,
    },
    "gravel-tire-inserts-worth-it-2026": {
        metadata: metaTireInserts,
        faqSchema: faqTireInserts,
        Component: PostTireInserts,
    },
    "700c-vs-650b-gravel-wheels-real-debate": {
        metadata: meta700cVs650b,
        faqSchema: faq700cVs650b,
        Component: Post700cVs650b,
    },
    "gravel-racing-unbound-vs-mid-south-vs-sbt-grvl-which-suits-you": {
        metadata: metaGravelRacing,
        faqSchema: faqGravelRacing,
        Component: PostGravelRacingComparison,
    },
    "budget-gravel-groupsets-that-dont-suck-2026": {
        metadata: metaBudgetGroupsets,
        faqSchema: faqBudgetGroupsets,
        Component: PostBudgetGroupsets,
    },
};

export const slugs = Object.keys(posts);

