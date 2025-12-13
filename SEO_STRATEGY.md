# HYBRID SEO PROTOCOL: 2026 STANDARDS
**Version:** 2.0 (The "Tech Ridge" Standard)
**Objective:** Construct web infrastructure that dominates Traditional Search (Google Mobile First Index) AND maximizes visibility in Generative Search (ChatGPT, Gemini, Perplexity).

---

## PHASE 1: TECHNICAL INFRASTRUCTURE (THE SKELETON)
*The site must be lightweight, semantic, and instantly parsed by bots.*

- [ ] **Semantic HTML5:**
    - Use `<header>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>`.
    - DO NOT use generic `<div>` soup. LLMs rely on semantic tags to understand page hierarchy.
- [ ] **Core Web Vitals (Strict Mode):**
    - LCP (Largest Contentful Paint) < 2.5s.
    - CLS (Cumulative Layout Shift) = 0.
    - INP (Interaction to Next Paint) < 200ms.
- [ ] **Mobile-First Architecture:**
    - CSS breakpoints must prioritize mobile (320px - 428px).
    - Touch targets (buttons/links) must be minimum 44x44px.
- [ ] **Image Optimization:**
    - All images must use `.webp` or `.avif` formats.
    - All images must have explicit `width` and `height` attributes to prevent layout shift.
    - `alt` tags must be descriptive and context-rich.

## PHASE 2: THE "DIGITAL TWIN" (SCHEMA & DATA)
*This is the most critical layer for AI Search. We are defining the Entity.*

- [ ] **JSON-LD Schema (Global Header):**
    - Must be present on **every** page.
    - **SoftwareApplication** (Primary for CrankSmith):
        - `applicationCategory`: "DesignApplication" / "SportsApplication"
        - `operatingSystem`: "Web"
        - `offers`: Pricing details.
    - **Organization/Brand**:
        - Exact Name matching other profiles.
        - `sameAs` network.
- [ ] **Identity Resolution (`@id`):**
    - Use a stable URI for the business ID (e.g., `https://cranksmith.com/#identity`).
    - Link all other schemas back to this main `@id`.
- [ ] **`sameAs` Network:**
    - List ALL social profiles (Facebook, Instagram, LinkedIn, YouTube) in the `sameAs` array. This builds the Knowledge Graph.
- [ ] **Service/Product Schema:**
    - Link specific tools/features to the main Entity.

## PHASE 3: CONTENT STRUCTURE (LLM READABILITY)
*Content must be formatted for extraction by Vector Databases and Answer Engines.*

- [ ] **The "Direct Answer" Pattern:**
    - The first 200 words of any page must directly answer user intent.
    - No "fluff".
- [ ] **Q&A Formatting:**
    - Use `<h2>` or `<h3>` tags as questions.
    - Immediately follow with a `<p>` tag containing the direct answer.
    - Wrap in `FAQPage` Schema were applicable.
- [ ] **Data Tables:**
    - Use HTML `<table>` for specs, pricing, comparisons.
- [ ] **Contextual Linking:**
    - Anchor text must be descriptive.

## PHASE 4: TRADITIONAL SEO (GOOGLE SIGNALS)
*Optimization for the standard SERP and Keyword rankings.*

- [ ] **Title Tags (Pattern):**
    - `[Primary Keyword] | [Brand Name]`
    - *Example:* "Bicycle Compatibility Checker | CrankSmith"
    - Max 60 characters.
- [ ] **Meta Descriptions (CTR Focused):**
    - Must include a Call to Action (CTA).
- [ ] **H-Tag Hierarchy:**
    - Only ONE `<h1>` per page.
    - `<h2>` for main sections.
    - Keywords appear naturally.

## PHASE 5: LOCAL SPECIFICS (IF APPLICABLE)
- [ ] **Location/Contact Info:**
    - Ensure Organization address is consistent if public.

## PHASE 6: VALIDATION (THE TEST)
*Before deploying, run these checks.*

- [ ] **Rich Results Test:** Pass with ZERO errors.
- [ ] **Lighthouse:** Score 95+ on Mobile Performance, Accessibility, and SEO.
- [ ] **Headless Check:** Content visible without JS.
