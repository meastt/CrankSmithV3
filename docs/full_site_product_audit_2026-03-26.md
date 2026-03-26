# CrankSmith.com Full Website + Product Audit

**Date:** March 26, 2026  
**Scope:** Repository-based audit of website UX/UI, information architecture, SEO/GEO, technical architecture, and product logic for core tools (Builder, Drivetrain Lab, Tire Pressure, Weight, Garage).  
**Method:** Static code review of Next.js app routes, shared components, API routes, store logic, validation engine, service worker/PWA setup, and basic automated checks.

---

## 1) Executive Summary

CrankSmith is already strong in **technical depth and product differentiation** (compatibility logic + cyclist-specific tools), but it currently has several execution gaps that reduce growth and trust:

- **Strong product core:** Validation engine covers frame/fork/wheel/tire, drivetrain, brakes, and cockpit checks with meaningful safety checks (e.g., brake fluid mismatch).  
- **Weak SEO coverage:** Only a subset of pages define page-level metadata; sitemap and robots are present but manually constrained and not fully reflective of available pages.  
- **Discoverability/IA gaps:** Core navigation emphasizes tools but omits key informational pages (Contact, Guides from header, legal links in header), reducing crawl paths and user trust flows.  
- **Content quality risk:** Some guide metadata uses future-dated publications and static “aggregateRating” values on home schema without visible evidence source, creating credibility and compliance risk.  
- **Code quality debt:** Lint baseline is extremely high (hundreds of issues/errors), indicating maintainability risk and likely production fragility for future releases.

**Bottom line:** The app has a credible technical foundation and unique value proposition, but growth and reliability are constrained by SEO/IA/quality-control debt. Prioritize technical hygiene + search surface expansion + product-level trust signals.

---

## 2) What’s Working Well

### 2.1 Product Positioning & Value
- Homepage and dashboard communicate a clear “serious cyclist / mechanic-grade” value proposition with dedicated tools (Builder, Gear Metrics, Tire Pressure, Weight, Garage).  
- The software application schema is implemented on the homepage and includes feature intent, social links, and free offer metadata.

### 2.2 Compatibility Logic Depth
- Validation is meaningfully modularized into rolling chassis, engine room, drivetrain, brakes, and cockpit checks.  
- Includes real-world compatibility nuance: BB shell normalization, protocol inference, freehub normalization, rotor mount checks, and drivetrain capacity checks.  
- Includes safety-critical brake checks (fluid and actuation mismatch).

### 2.3 Technical Security Baseline
- Global security response headers include frame protection, nosniff, HSTS, referrer policy, and permissions policy restrictions.

### 2.4 Multi-Platform/Offline Intent
- PWA manifest exists and service worker is registered outside localhost with offline and cache strategies.

---

## 3) Critical Findings (High Priority)

## A. SEO / GEO / Discoverability

1. **Metadata coverage is incomplete across important routes.**  
   Several high-intent pages (e.g., performance, tire-pressure, weight, garage, contact, compatibility pages) either rely only on layout defaults or mixed dynamic metadata patterns.

2. **Sitemap is static and under-represents site surface.**  
   Current sitemap hardcodes only a few guide/compatibility paths and omits many routes that exist in the app (e.g., performance, tire-pressure, weight, settings, offline, etc.).

3. **Potential structured data trust risk.**  
   Homepage schema includes `aggregateRating` but codebase does not show supporting review source exposure on page. This can be flagged as unsubstantiated structured data.

4. **Guide dates include future timestamps relative to audit date.**  
   Guide index and guide data use 2025-11/12 dates, which are in the future from a historical perspective when content appears editorial. This can undermine authenticity if not intentionally pre-dated release content.

## B. UX / IA / Conversion

1. **Header navigation omits key intent routes.**  
   Desktop/mobile top nav excludes Guides and Contact while Footer includes some of them; this fragments user pathways and crawl internal linking.

2. **Footer trust signals include placeholder-looking phone number.**  
   Phone `435-555-0101` appears non-production and can reduce trust/lead quality.

3. **Brand/account inconsistency risk.**  
   Social handles differ between schema and footer (`@cranksmith` vs `@cranksmithapp`) which can confuse users and crawlers.

## C. Engineering Quality / Reliability

1. **Very high lint error volume (270 errors / 60 warnings).**  
   This includes type-safety issues (`any`), hook rules violations, escaped entity issues, and other maintainability concerns.

2. **Known hook logic issue in DrivetrainLab.**  
   Lint reports `setSetupA` usage before declaration in `DrivetrainLab.tsx`, signaling structural hook-order bug risk.

3. **API/store implementation risk patterns.**  
   Inconsistent typing and heavy `any` usage in compatibility pipeline and stores can hide runtime defects as data grows.

---

## 4) Tool-by-Tool Product Audit

## 4.1 Builder (Core Product)

**Strengths**
- Dedicated page metadata exists for builder route.  
- Centralized Zustand build store with validation trigger on state mutation.  
- Compatibility checks cover multiple bike systems and include warnings/errors.

**Gaps / Risks**
- Type safety debt in store and validator can cause silent failures with new component schemas.  
- Validation outputs are strong technically but likely overwhelming without progressive explanation layers for less-technical users.

**Recommendations**
- Add “explain this issue” UX with plain-language + advanced tabs.  
- Add confidence levels when inferred protocol/shell values are used.

## 4.2 Drivetrain Lab

**Strengths**
- Presets + dual setup comparison + cadence + climbing/quick stats provide meaningful analysis utility.

**Gaps / Risks**
- Hook-order issue (`setSetupA` before declaration) needs immediate correction.  
- Hard-coded assumptions in top-speed calculations (e.g., dividing by 11 and using fixed circumference in some cards) can desync from selected cassette/wheel context.

**Recommendations**
- Normalize all displayed metrics to the exact active setup data model.  
- Add data validation feedback for malformed chainring/cassette inputs.

## 4.3 Tire Pressure Tool

**Strengths**
- Good UX with contextual toggles (surface, wet, tubeless, preference).  
- Converts units from global settings and shows min/max bands.

**Gaps / Risks**
- Formula appears custom/heuristic without transparent source labeling.  
- Safety range clamping is broad and may overstate precision for edge cases.

**Recommendations**
- Add “methodology & assumptions” disclosure panel.  
- Add uncertainty messaging and confidence bands by tire class (road/gravel/MTB).

## 4.4 Weight Tool

**Strengths**
- Multiple flows: import from builder, manual entry, upgrade simulation, quick wins.  
- Strong engagement potential for enthusiast users.

**Gaps / Risks**
- “Coming soon” save path in active UI may frustrate users in an otherwise mature flow.

**Recommendations**
- Complete save/share loop and add explicit versioning of baseline builds.

## 4.5 Garage

**Strengths**
- Guest mode + template pathways lower onboarding friction.

**Gaps / Risks**
- Effect/state anti-patterns flagged by lint in loading flow.  
- Repeated template card blocks across branches increase maintenance cost.

**Recommendations**
- Refactor into shared list component + stable query layer (SWR/React Query).

---

## 5) Technical SEO + GEO Audit

## 5.1 On-Page SEO
- Root metadata is robust at app layout level (title, description, keywords, OG/Twitter, robots).  
- But route-level metadata is inconsistent; many conversion pages should override with intent-specific titles/descriptions.

## 5.2 Structured Data
- `SoftwareApplication` schema exists on homepage and `Article` / `FAQPage` schema appears in guides/compatibility pages.  
- Improve by adding verifiable organization identity, support/contact schema, and removing any unsubstantiated rating fields.

## 5.3 Crawl & Indexation
- `robots.ts` exists and references sitemap.  
- Sitemap should be generated from actual route/content sources (guides + compatibility combinations) rather than static arrays.

## 5.4 GEO (Generative Engine Optimization)
- Strength: domain-specific language and structured content already exists.  
- Gap: lack of canonical technical reference pages for major standards matrixes reduces LLM retrievability.  
- Recommendation: publish canonical “spec hub” pages with stable identifiers and tables (BB, axle, freehub, brake mounts), each with structured data and changelogs.

---

## 6) Security, Privacy, and Trust

- Global security headers are a strong baseline.  
- Contact API sanitizes HTML output before email rendering.  
- Missing/weak areas to improve:
  - Add rate limiting/abuse protection on contact and public APIs.  
  - Add explicit privacy disclosures around analytics and form handling.  
  - Replace placeholder/ambiguous business contact details with production-verified trust data.

---

## 7) Performance & Operability

- Dynamic import is used for heavy Drivetrain component (good bundle strategy).  
- Service worker has broad caching behavior, including API responses; ensure cache invalidation/versioning aligns with freshness expectations for dynamic bike data.
- Large lint debt indicates CI quality gates are not currently enforcing release hygiene.

---

## 8) Prioritized Action Plan (Agency-Style)

## Next 14 Days (Stabilize)
1. Fix hook-order and high-risk runtime issues in DrivetrainLab and online status/store effects.  
2. Establish CI gates: lint max-error threshold + typecheck + test required on PR.  
3. Normalize route metadata across all major pages.

## Next 30 Days (Grow)
1. Build dynamic sitemap generator from route/content data.  
2. Add canonical feature landing pages for each tool with conversion CTAs.  
3. Build trust consistency pass (social handles, business/contact data, legal discoverability).

## Next 60–90 Days (Scale)
1. Publish structured “standards knowledge graph” pages for GEO/SEO dominance.  
2. Add shareable build URLs and indexable build showcase pages.  
3. Instrument analytics funnel by tool (entry → completion → share/save).

---

## 9) Audit Scorecard (Current Snapshot)

- **Product Value:** 8.5 / 10  
- **UX Clarity:** 6.5 / 10  
- **Information Architecture:** 6 / 10  
- **SEO Foundation:** 6 / 10  
- **GEO Readiness:** 6 / 10  
- **Code Health / Maintainability:** 4.5 / 10  
- **Trust & Conversion Readiness:** 6 / 10  

**Overall:** **6.2 / 10** — high potential, mid-stage execution maturity.

---

## 10) Evidence Sources Reviewed

Primary evidence came from:
- `src/app` route files (layout, page routes, sitemap, robots, manifest, dynamic content pages).
- Shared UI/navigation (`Header`, `Footer`, dashboard/tool components).
- Core logic (`validation`, `normalization`, stores, gear/weight tools).
- API routes (`/api/builds`, `/api/components`, `/api/contact`) and middleware.
- PWA assets (`public/sw.js`) and service worker registration.
- Automated checks (`npm run lint`, `npm test -- --runInBand`).

