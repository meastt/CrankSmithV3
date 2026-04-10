# Blog Architecture & SEO Implementation

## Overview
The CrankSmith blog is a Next.js 15 app router implementation designed for maximum SEO impact and topical authority in the gravel cycling niche.

## Route Structure
- `src/app/blog/page.tsx` – Blog index listing all posts
- `src/app/blog/[slug]/page.tsx` – Dynamic route serving individual posts
- `public/images/` – WebP featured images (1280×720, quality 80)

## Metadata & SEO
- Each post has its own `generateMetadata()` function returning title, description, keywords, and Open Graph tags
- Schema.org markup includes both `Article` and `FAQPage` JSON‑LD
- All 10 blog posts are implemented as React components in the dynamic route

## Image Pipeline
1. **Generation**: Google Gemini 3.1 Flash (`google/gemini‑3.1‑flash‑image‑review`)
2. **Conversion**: JPG → WebP via sharp (max 1280px wide, quality 80)
3. **Naming**: `gravel‑{topic}‑{detail}‑2026.webp`
4. **Delivery**: Next.js `<Image>` component with priority loading for above‑fold images

## Internal Linking Strategy
- **Cluster‑based linking**: Each post links to ≥2 other posts in the same topical cluster
- **Cross‑cluster links**: 1 link to a different cluster where relevant
- **External authority links**: 2–3 links per post to ETRTO, BikeRadar, SRAM/Shimano docs, UCI Gravel rules
- **eBikePSI cross‑links**: Natural 1–2 links to `https://ebikepsi.com/calculate` for tire‑pressure topics

## Content Clusters
### 1. Big Tire Revolution
- 45mm Minimum Gravel Tire
- 2.25‑Inch Gravel Tires
- Gravel Tire Pressure by Width (GEO: Utah desert PSI)

### 2. Gravel Drivetrain Bible
- Gravel Mullet Drivetrains
- 1× vs 2× Gravel 2026
- How Tire Width Changes Gearing
- Colorado High‑Altitude Gearing (GEO post)

### 3. Gravel Standards Master
- Hookless vs Hooked Safety Guide
- RockShox Rudy vs Rigid Fork
- Gravel Tubeless Setup

## Next Steps
- Generate 5+ infographic backlink assets
- Connect custom domain `cranksmith.com` on Vercel
- Monitor Google Search Console for ranking improvements

---

*Last updated: 2026‑04‑10*