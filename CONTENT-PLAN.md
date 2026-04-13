# CrankSmith Content Plan — Gravel Cycling 2026
**Consolidated:** April 12, 2026
**Replaces:** CONTENT-PLAN-OPTION-B.md, CRANKSMITH-CONTENT-PLAN.md, EXPANDED-CONTENT-PLAN.md

---

## A. What's Done

### Blog Posts Live (11)

| # | Slug | Category | Published | Cluster |
|---|------|----------|-----------|---------|
| 1 | `45mm-is-the-new-minimum-gravel-tire` | Big Tires | 2026-04-10 | Big Tire Revolution |
| 2 | `the-gravel-mullet-road-shifter-mtb-derailleur` | Drivetrain | 2026-04-11 | Drivetrain Bible |
| 3 | `1x-vs-2x-gravel-2026-numbers` | Drivetrain | 2026-04-12 | Drivetrain Bible |
| 4 | `how-tire-width-changes-gravel-gear-ratio` | Drivetrain | 2026-04-14 | Drivetrain Bible |
| 5 | `unbound-gravel-2026-tire-gear-setup` | Racing | 2026-04-15 | Drivetrain Bible |
| 6 | `gravel-tire-psiby-width-guide-2026` | Big Tires | 2026-04-16 | Big Tire Revolution |
| 7 | `every-gravel-frame-that-fits-2-25in-tires` | Big Tires | 2026-04-17 | Big Tire Revolution |
| 8 | `hookless-vs-hooked-gravel-wheels-safety-guide` | Standards | 2026-04-21 | Standards Master |
| 9 | `rockshox-rudy-vs-rigid-gravel-suspension` | Suspension | 2026-04-22 | Standards Master |
| 10 | `gravel-tubeless-setup-guide` | Setup | 2026-04-24 | Big Tire Revolution |
| 11 | `2026-gravel-bike-new-releases-april` | News | 2026-04-11 | — |

### Hub Pages (3) — Content Cluster Pillars
- `/hubs/big-tire-revolution` — "40mm to 2.25": The Gravel Tire Width Revolution of 2026"
- `/hubs/gravel-drivetrain-bible` — Comprehensive gravel drivetrain reference
- `/hubs/gravel-standards-master` — Master standards reference for gravel bikes

### Guides (3)
- `/guides/gravel-groupsets-explained` — 1x vs 2x, mullet drivetrains, SRAM AXS vs Shimano GRX
- `/guides/bottom-bracket-standards` — BSA, PF30, T47, DUB standards
- `/guides/brake-mount-standards` — Flat Mount vs Post Mount vs IS

### Standards Reference Pages (4)
- `/standards/bottom-bracket`, `/standards/axles`, `/standards/freehub`, `/standards/brake-mounts`

### Infographics (7)
- `gravel-tire-comparison`, `mullet-drivetrain-compatibility`, `1x-vs-2x-gear-range`
- `hookless-vs-hooked-safety`, `gravel-frame-tire-clearance`
- `rockshox-rudy-vs-rigid-fork`, `gravel-tubeless-setup-flowchart`

### SEO Infrastructure
- JSON-LD Article + FAQPage schemas on all posts and guides
- OpenGraph meta tags on all pages
- Sitemap generation (`src/app/sitemap.ts`)
- Robots.txt configured
- Cross-links to ebikepsi.com active (5 inline links)
- Google Analytics (G-TR57T617HK)

---

## B. Remaining Posts

### Priority 1 — High-Value Gaps (4 posts)
Fill holes in the core content clusters. Strongest keyword potential.

**1. "2.25-Inch Gravel Tires: When Your Gravel Bike Becomes a Light MTB"**
- **Keywords:** MTB tires on gravel bikes, 2.25" gravel clearance, wide tire gravel setup
- **Angle:** What happens at MTB widths on a gravel frame — geometry trade-offs, rim width compatibility, gear inch changes from larger effective circumference
- **Note:** Different from the frame list post (#7 above). This is the "why and how" post. Cross-link both.
- **CTA:** "Validate your frame + tire combo in CrankSmith"
- **Cluster:** Big Tire Revolution

**2. "Tire Width Selection Guide: 40mm vs 45mm vs 50mm vs 2.25" — Real Numbers"**
- **Keywords:** gravel tire size comparison, what width gravel tires should I run
- **Angle:** Rolling resistance data, grip surfaces, weight penalty per mm, gear inch tables per width
- **Infographic support:** `gravel-tire-comparison` already built
- **CTA:** "Simulate your actual effective gearing with your chosen tire width"
- **Cross-link:** ebikepsi.com PSI calculator
- **Cluster:** Big Tire Revolution

**3. "Shimano GRX vs SRAM AXS XPLR vs Campagnolo Ekar — 2026"**
- **Keywords:** best gravel groupset 2026, gravel drivetrain comparison
- **Angle:** Shorter blog post — spec table (weight, price, gear range, shifting type), key differences, budget options (SRAM Apex XPLR AXS, Shimano CUES). Links to `/guides/gravel-groupsets-explained` for full depth.
- **Strategy:** Two pages targeting two intents — blog catches "best groupset" searches, guide catches "how groupsets work" research.
- **CTA:** "Build around any groupset in CrankSmith"
- **Cluster:** Drivetrain Bible

**4. "Mid South 2026 Gearing Breakdown: What Pros Actually Ran"**
- **Keywords:** Mid South gravel gearing, red dirt gravel setup
- **Angle:** March 14, 2026, Stillwater OK. New pro/am split format. Real setups: 34x11-42, 42x10-46, 42x9-45, 46x10-46. Why these work for that terrain.
- **CTA:** "Calculate your own gear inches for your next gravel race"
- **Cross-link:** ebikepsi.com for red dirt tire pressure
- **Cluster:** Drivetrain Bible

---

### Priority 2 — Standards & Decision Content (8 posts)
Posts 5-7 use shorter blog format linking to existing deeper guides/standards pages (two pages = two keyword intents, stronger cluster authority).

**5. "Bottom Bracket Standards on Gravel Bikes: Why Your Creak Is Probably PF30"**
- **Keywords:** gravel bottom bracket standards, T47 vs PF30 gravel
- **Format:** Shorter SEO blog post targeting "creak" search intent
- **Links to:** `/guides/bottom-bracket-standards` + `/standards/bottom-bracket`
- **Angle:** T47 becoming universal, PF30 creak issues, UDH becoming standard for SRAM Transmission
- **CTA:** "Check your BB standard + crankset in the builder"
- **Cluster:** Standards Master

**6. "Gravel Axle Standards: Boost, 142x12, and Why Thru-Axle Size Matters"**
- **Keywords:** gravel axle spacing, gravel thru-axle standards, Boost gravel
- **Links to:** `/standards/axles`
- **Angle:** QR to 142x12 to Boost (148x12) shift on 2026 frames. Hub compat, fork offset, tire clearance trade-offs
- **CTA:** "Validate your frame x hub compatibility"
- **Cluster:** Standards Master

**7. "Flat Mount vs Post Mount Brakes on Gravel: Rotor Size Limits"**
- **Keywords:** gravel brake mount standards, flat mount max rotor size
- **Format:** Shorter blog, links to `/guides/brake-mount-standards` + `/standards/brake-mounts`
- **Angle:** Front flat mount capped at 160mm (some 180mm w/ adapters). Which calipers work. Adapter logic.
- **CTA:** "Check your brake x rotor x frame compatibility"
- **Cluster:** Standards Master

**8. "Gravel Rim Width Guide: 25mm vs 28mm vs 30mm Internal"**
- **Keywords:** gravel internal rim width, best rim width 45mm tire
- **Angle:** ETRTO compat chart, actual inflated widths per rim width, tire insert considerations. Supports hookless safety post.
- **CTA:** "Check optimal rim width for your tire in CrankSmith"
- **Cluster:** Standards Master

**9. "Aero Gains on Gravel: Deep Section Wheels vs Narrow Tires"**
- **Keywords:** gravel bike aerodynamics, aero wheels gravel
- **Angle:** Real watts saved on gravel, terrain-dependent benefits. Position matters more than components. 200-mile vs 100-mile math.
- **CTA:** "See wheel weight vs aero trade-off in CrankSmith"
- **Cluster:** Standards Master

**10. "Dropper Posts on Gravel: Frame Compatibility, Routing, and Every Brand That Does It Right"**
- **Keywords:** gravel dropper post compatibility, dropper routing gravel frame
- **Angle:** Internal vs external routing, minimum insertion depth, which 2026 frames have factory dropper routing
- **CTA:** "Check if your frame supports a dropper"
- **Cluster:** Standards Master

**11. "The First $500 Upgrade on a Gravel Bike: Where the Money Actually Goes"**
- **Keywords:** best gravel bike upgrades, gravel bike upgrade priority
- **Angle:** ROI-ranked: tires (highest impact per $) > wheels > cockpit > drivetrain > suspension fork. Specific product recs.
- **CTA:** "Build your upgrade path in CrankSmith" (weight tool + builder)
- **Cluster:** Drivetrain Bible

**12. "Gravel Drivetrain Wear: When Your Chain, Cassette & Chainring Actually Need Replacing"**
- **Keywords:** gravel drivetrain wear, when to replace gravel bike chain
- **Angle:** Chain stretch numbers (0.5% vs 0.75%), 1x vs 2x wear patterns, gravel-specific wear factors (dust, mud, cross-chaining)
- **CTA:** "Track your build components in the builder"
- **Cluster:** Drivetrain Bible

---

### Priority 3 — Bonus Posts (6 posts)
Publish as capacity allows.

**13. "Gravel Geometry Explained: Stack, Reach, Trail and How They Affect Your Ride"**
- Stack/reach/trail for gravel vs road. Modern trends (longer, slacker). Flip-chip adjustments.
- **CTA:** "Compare geometry across frames in CrankSmith"

**14. "SRAM AXS vs Shimano Di2 for Gravel: E-Shifting Showdown"**
- Battery life, weight, customization, cross-compat, crash recovery, price.
- **CTA:** "Build with either system and compare in CrankSmith"

**15. "Gravel Tire Inserts: Are They Actually Worth $50?"**
- Becoming standard equipment in 2026. Weight vs protection, pinch flat prevention, run-flat, burping prevention.
- **CTA:** "Check if your wheel & tire combo supports inserts"

**16. "700c vs 650b Gravel Wheels: The Real Debate"**
- 700c rolls faster, 650b fits wider at same clearance. Flip-chip frames. When to choose which.
- **CTA:** "Validate your wheel size choice in the builder"

**17. "Gravel Racing: Unbound vs Mid South vs SBT GRVL — Which Suits You?"**
- Race comparison: terrain, distance, difficulty, vibe, when to enter. Life Time Grand Prix series.
- **CTA:** "Build your race bike in CrankSmith"

**18. "Budget Gravel Groupsets That Don't Suck in 2026"**
- SRAM Apex XPLR AXS, Microshift, Shimano CUES. Rankings under $700.
- **CTA:** "See what fits your budget in the builder"

---

### Unlisted Bonus
**"Smart Tire Pressure Sensors for Gravel 2026"**
- Content already written as MDX at `src/content/blog/smart-tire-pressure-sensors-gravel-2026.mdx`
- Covers Quarq, Garmin, Silca, Pirelli sensors
- Needs MDX integration or manual conversion to TSX to publish

---

## C. Content Standards (Every Post)

- **Featured image:** 16:9 WebP (1280x720, quality 80)
- **FAQ schema:** 5-8 Q&As per post (JSON-LD FAQPage)
- **Article schema:** JSON-LD Article with headline, description, datePublished, author, publisher, image, keywords
- **Internal links:** To CrankSmith tools (builder, drivetrain lab, weight tool, tire pressure calculator)
- **Cross-links:** To ebikepsi.com (max 2 per post, contextual only)
- **CTA:** Relevant CrankSmith tool at end of every post
- **Lead paragraph:** Direct-answer in first 100 words
- **Tone:** Human-first, cyclist who builds bikes for fun

---

## D. Cross-Link Strategy (CrankSmith <> eBikePSI)

| CrankSmith Topic | Links To |
|-----------------|----------|
| Tire width posts | ebikepsi.com/tire-pressure for PSI guidance |
| Tubeless setup posts | ebikepsi.com burping prevention guide |
| E-gravel build posts | ebikepsi.com for model-specific e-gravel PSI |
| Tire pressure posts | ebikepsi.com/calculate for e-bike PSI |

**Rule:** Max 2 cross-links per post. Contextual, not promotional.

---

## E. Infrastructure Status

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | **Blog posts in sitemap** | FIXED | All blog slugs auto-included via registry import in `src/app/sitemap.ts` |
| 2 | **MDX files** | FIXED | Removed `src/content/` directory. All content lives in TSX post files. |
| 3 | **RSS feed** | FIXED | Live at `/feed.xml`. Auto-populated from post registry. |
| 4 | **Blog architecture** | FIXED | Split from 1,798-line monolith to 11 individual post files + shared components + registry. Router is 72 lines. Adding a post = create one file + add to registry. |
| 5 | **Image formats** | FIXED | All blog images standardized to WebP. Obsolete JPG source files removed. |
| 6 | **Programmatic pages** | DEFERRED | `/groupsets/*`, `/wheel-compatibility/*`, `/builds/gravel-2026` not built. Evaluate search volume and ROI before committing. |

---

## Scorecard

| Metric | Status |
|--------|--------|
| Blog posts written | **29 of 29 — COMPLETE** |
| Blog posts remaining | 0 |
| Hub pages | 3 of 3 — done |
| Guides | 3 of 3 — done |
| Standards pages | 4 of 4 — done |
| Infographics | 7 of 7 — done |
| Infrastructure | 5 of 6 fixed (programmatic pages deferred) |
| RSS feed | live at /feed.xml |
| Sitemap | all blog posts indexed |
| Blog architecture | modular (per-post files + registry) |

**All 18 remaining posts written April 13, 2026.**

> [!NOTE]
> 3 bonus post images (700c vs 650b, gravel racing comparison, budget groupsets) reused
> existing images due to image generation quota exhaustion. Queue refreshes in ~4.7h.
> Unique images can be generated and swapped in at that time.
