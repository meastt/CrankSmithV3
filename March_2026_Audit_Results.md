⏺ CrankSmith V3 — Comprehensive Audit Report

  What Is CrankSmith?

  A Next.js 16 + React 19 web/mobile app for bicycle enthusiasts to design custom bike builds with real-time compatibility validation. It covers road, gravel, and MTB
  configurations with tools for drivetrain analysis, tire pressure optimization, and weight tracking. Deployed on Vercel, with Capacitor wrapping for iOS/Android.

  ---
  1. TECH STACK

  ┌───────────┬─────────────────────────────────────────────────┐
  │   Layer   │                   Technology                    │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Framework │ Next.js 16.0.10, React 19.2.0                   │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Styling   │ Tailwind CSS v4, Framer Motion                  │
  ├───────────┼─────────────────────────────────────────────────┤
  │ State     │ Zustand (3 stores: build, settings, weight)     │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Auth      │ Clerk (primary) + NextAuth (legacy/parallel)    │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Database  │ PostgreSQL via Prisma 5.10                      │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Mobile    │ Capacitor 7 (iOS + Android)                     │
  ├───────────┼─────────────────────────────────────────────────┤
  │ Charts    │ Recharts 3                                      │
  ├───────────┼─────────────────────────────────────────────────┤
  │ PWA       │ Custom service worker, offline page, sync queue │
  ├───────────┼─────────────────────────────────────────────────┤
  │ SEO       │ Schema.org JSON-LD, sitemap, robots, OpenGraph  │
  └───────────┴─────────────────────────────────────────────────┘

  ---
  2. FILE STRUCTURE OVERVIEW

  src/
  ├── app/                    # 17 routes
  │   ├── admin/              # Component CRUD (3 pages)
  │   ├── api/                # 10 API endpoints
  │   ├── builder/            # Core bike builder
  │   ├── compatibility/      # SEO-driven "X vs Y" pages
  │   ├── garage/             # Saved builds
  │   ├── guides/             # Technical articles (3)
  │   ├── performance/        # Drivetrain Lab tool
  │   ├── tire-pressure/      # Tire pressure calculator
  │   ├── weight/             # Weight tracker/optimizer
  │   ├── contact/, settings/, privacy/, terms/, offline/
  │   └── page.tsx            # Dashboard homepage
  ├── components/             # ~30 components
  │   ├── builder/            # 14 builder-specific components
  │   ├── tools/              # DrivetrainLab, TirePressureCalculator
  │   ├── weight/             # 6 weight tool components
  │   ├── dashboard/          # DashboardGrid, Garage
  │   └── ui/                 # Toast, Skeleton
  ├── lib/                    # Core logic (~12 files)
  │   └── validation.ts       # 725-line compatibility engine
  ├── store/                  # 3 Zustand stores
  ├── types/                  # 2 type definition files
  ├── constants/              # Standards enums
  └── data/                   # mockDb, templates.json
  prisma/                     # Schema + 30+ seed/migration scripts
  scripts/                    # 18 debug/test/audit scripts

  ---
  3. CORE FEATURES & TOOLS

  3a. Bike Builder (/builder)

  - 18 component slots (Frame, Fork, Wheels, Tires, BB, Crankset, Cassette, RD, Shifter, Chain, Brakes, Rotors, Stem, Bars, Seatpost, Saddle, Pedals, Power Meter)
  - Real-time compatibility validation across 4 zones: Rolling Chassis, Engine Room, Drivetrain, Brakes
  - Freehub standard selection flow (HG, XDR, MicroSpline, N3W)
  - Factory fork weight deduction logic
  - Part cards with intelligent spec extraction per component type
  - Save to Garage, CSV export, share card (PNG export via html2canvas)
  - Desktop: 3-column layout (summary | builder | performance). Mobile: bottom nav with modal panels

  3b. Drivetrain Lab (/performance)

  - Compare 2 drivetrain setups side-by-side
  - 6 presets (compact, semi-compact, pro, 2x gravel, 1x gravel, mullet)
  - Speed vs gear ratio visualization
  - "The Climbing Wall" — max sustainable gradient from FTP/weight
  - Can import from active build

  3c. Tire Pressure Calculator (/tire-pressure)

  - Modified Berto formula
  - Inputs: rider weight, bike weight, tire width, rim width, surface, tubeless, wet conditions
  - Front/rear split (45/55 weight distribution)
  - Grip/Speed preference slider

  3d. Weight Scale (/weight)

  - Multi-view flow: Landing → Baseline → Upgrading → Quick Wins
  - Import from builder or manual entry
  - Upgrade simulator with cost-per-gram analysis
  - Quick Wins finder (best value upgrades, rotating weight 2x multiplier)
  - "Terror Display" for upgrade impact visualization

  3e. Garage (/garage)

  - Saved builds CRUD (persisted to PostgreSQL)
  - 3 pre-built templates (Road, Gravel, MTB)
  - Load builds back into builder

  3f. SEO/Content

  - 3 technical guides (Gravel Groupsets, BB Standards, Brake Mounts)
  - Dynamic compatibility pages (/compatibility/bottom-bracket/t47-vs-bsa)
  - FAQ schema, article schema, software application schema

  ---
  4. DESIGN & UI/UX

  Theme: Professional dark mode with "Pro Team Palette" — racing black (#030712) + electric cyan (#06b6d4). DM Sans body font, Space Mono for data.

  Strengths:
  - Glass morphism effects, smooth Framer Motion animations
  - Responsive mobile-first design with safe area support (iOS notch)
  - Custom scrollbar styling, staggered animations
  - PWA with offline page, network indicator, haptic feedback
  - Good use of Suspense boundaries and dynamic imports for heavy components

  Weaknesses:
  - window.alert() and window.prompt() used in BuildSummary for save/name — feels dated
  - GearChart has white background that breaks the dark theme
  - DevBanner always visible — should be environment-gated for production
  - FreehubSelector image guide has no fallback if image fails to load
  - BuildRadar chart renders with hardcoded mock data — never connected to actual build metrics

  ---
  5. ISSUES FOUND

  Critical / Security

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬─────────────────────────┐
  │  #  │                                                            Issue                                                            │        Location         │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
  │ 1   │ Contact form XSS — user input embedded in HTML email without escaping                                                       │ api/contact/route.ts    │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
  │ 2   │ No rate limiting on contact form — spam vulnerable                                                                          │ api/contact/route.ts    │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
  │ 3   │ Component creation unprotected — any authenticated user can POST (TODO comment acknowledges this)                           │ api/components/route.ts │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
  │ 4   │ Middleware protects no routes — isProtectedRoute array is empty                                                             │ middleware.ts           │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼─────────────────────────┤
  │ 5   │ Dual auth system — NextAuth configured in lib/auth.ts but Clerk used everywhere else; confusing and potentially conflicting │ Multiple files          │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴─────────────────────────┘

  Data & Logic

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────────┐
  │  #  │                                                                Issue                                                                │       Location       │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 6   │ Sitemap/guide slug mismatch — sitemap references mullet-drivetrain-guide, t47-explained, gravel-gearing-1x-vs-2x but actual guides  │ sitemap.ts vs        │
  │     │ are gravel-groupsets-explained, bottom-bracket-standards, brake-mount-standards                                                     │ guides/[slug]        │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 7   │ Parallel type systems — types/components.ts defines strict interfaces, lib/types/compatibility.ts defines a loose Component         │ Both type files      │
  │     │ interface; neither references the other                                                                                             │                      │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 8   │ Protocol inference duplicated — happens in both validation.ts AND normalization.ts independently                                    │ Both files           │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 9   │ BB shell normalization too aggressive — may treat incompatible shells as compatible (e.g., BSA 68 vs 73)                            │ validation.ts        │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 10  │ Incomplete validation — missing front derailleur, handlebar/stem diameter, seatpost diameter, brake lever type checks               │ validation.ts        │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 11  │ Legacy field clutter — components carry interfaces/attributes alongside new specs (migration incomplete)                            │ Throughout           │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────┤
  │ 12  │ as any casts throughout PartCard spec extraction (~480 lines)                                                                       │ PartCard.tsx         │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────┘

  UX & Polish

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┬──────────────────┐
  │  #  │                                                            Issue                                                             │     Location     │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 13  │ DevBanner always shows in production — "In Development & Testing Phase"                                                      │ DevBanner.tsx    │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 14  │ alert()/prompt() for build saving instead of proper modals                                                                   │ BuildSummary.tsx │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 15  │ GearChart white background clashes with dark theme                                                                           │ GearChart.tsx    │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 16  │ Hardcoded SEO rating (4.8★, 127 reviews) — not from real data                                                                │ page.tsx         │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 17  │ Privacy/Terms pages are generic boilerplate templates                                                                        │ privacy/, terms/ │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 18  │ Weight calculation duplicated across BuildDashboard, PerformancePanel, BuilderMobileNav, buildStore                          │ Multiple         │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────┤
  │ 19  │ Garage component field mismatch — references build.parts.Derailleur and build.parts.Wheel which don't match actual part keys │ Garage.tsx       │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────┘

  Performance & Architecture

  ┌─────┬──────────────────────────────────────────────────────────────────────────────────┬─────────────────────────────────┐
  │  #  │                                      Issue                                       │            Location             │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 20  │ Validation on every part change — no debouncing or memoization                   │ buildStore.ts                   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 21  │ No virtualization on long component lists                                        │ PartSelector.tsx                │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 22  │ JSON stored as strings in DB, not JSONB — can't query inside                     │ schema.prisma                   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 23  │ SyncQueue no debounce — online event fires multiple retry processes              │ syncQueue.ts                    │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 24  │ No security headers configured (CSP, HSTS, etc.)                                 │ next.config.ts                  │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 25  │ Partial user deletion — deletes from app DB but not Clerk (orphaned accounts)    │ api/user/delete                 │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────┼─────────────────────────────────┤
  │ 26  │ PrismaClient instantiated directly in some API routes instead of using singleton │ api/builds, api/components/[id] │
  └─────┴──────────────────────────────────────────────────────────────────────────────────┴─────────────────────────────────┘

  ---
  6. WHAT'S WORKING WELL

  - Compatibility engine is genuinely impressive — covers frame/fork/wheel/tire/BB/crank/drivetrain/brake interactions with normalization and protocol inference
  - PWA implementation is thorough — service worker, offline page, sync queue, haptics, manifest
  - SEO strategy is solid — JSON-LD schemas, dynamic sitemap, robots.txt, OpenGraph
  - Responsive design handles mobile/desktop well with the builder's 3-panel → bottom-nav transition
  - Component architecture is clean with good separation (stores, lib, components, API)
  - Dynamic imports for heavy components (Recharts, DrivetrainLab) keep initial bundle lean
  - Capacitor integration allows native iOS/Android distribution
  - Dark theme is cohesive and professional throughout (with the GearChart exception)

  ---
  7. RECOMMENDED PRIORITIES

  Tier 1 — Fix Before It Bites:
  ✅ 1. Sanitize HTML in contact form email
         FIXED 2026-03-25: Added escapeHtml() function in api/contact/route.ts. All user-supplied
         fields (name, email, subject, message) are now escaped before embedding in HTML email body.

  ✅ 2. Gate DevBanner behind NODE_ENV
         FIXED 2026-03-25: Added early return in DevBanner.tsx when process.env.NODE_ENV === 'production'.
         Banner still shows in local dev but is invisible on the live site.

  ✅ 3. Admin-protect component creation endpoint
         FIXED 2026-03-25: api/components/route.ts and api/components/[id]/route.ts now require the
         caller's Clerk userId to be present in the ADMIN_USER_IDS environment variable (comma-separated).
         Any non-admin authenticated user receives a 401. Add your Clerk user ID to ADMIN_USER_IDS in
         Vercel environment variables to regain admin access.

  ✅ 4. Fix sitemap guide slug mismatch (hurting SEO right now)
         FIXED 2026-03-25: sitemap.ts updated to use correct slugs:
         gravel-groupsets-explained, bottom-bracket-standards, brake-mount-standards.
         Previous slugs (mullet-drivetrain-guide, t47-explained, gravel-gearing-1x-vs-2x) were 404ing.

  ✅ 5. Resolve dual auth system (pick Clerk OR NextAuth, remove the other)
         FIXED 2026-03-25: NextAuth fully removed. Deleted src/lib/auth.ts,
         src/app/api/auth/[...nextauth]/route.ts, src/types/next-auth.d.ts.
         Both component API routes now use Clerk's auth() exclusively.
         NOTE: next-auth and @auth/prisma-adapter packages can be removed from package.json
         if you want to fully clean the dependency tree (run: npm uninstall next-auth @auth/prisma-adapter).

  Tier 2 — Polish & UX:
  ✅ 6. Replace alert/prompt with proper modals
         FIXED 2026-03-25: BuildSummary.tsx — replaced window.prompt() with an inline animated
         save input that appears in the actions panel. Replaced all alert() calls with the app's
         Toast system (success/error toasts). Also fixed the 401 redirect from /api/auth/signin
         (old NextAuth URL) to /sign-in (Clerk). Garage.tsx — replaced confirm()/alert() with
         Toast notifications and a disabled "Deleting…" state on the button.

  ✅ 7. Fix GearChart dark theme
         FIXED 2026-03-25: GearChart.tsx — replaced bg-white with bg-white/5 border border-white/10,
         updated all axis ticks, grid lines, tooltip, and legend to match the app's dark stone theme.
         Bar color changed from blue to the app's electric cyan (#06b6d4). Added rounded bar tops.

  ✅ 8. Fix Garage component field references
         FIXED 2026-03-25: Garage.tsx — corrected two wrong part key lookups:
         build.parts.Derailleur → build.parts.RearDerailleur
         build.parts.Wheel → build.parts.WheelFront
         These were showing "None" for every saved build's Groupset and Wheels fields.

  ✅ 9. Consolidate weight calculation logic into a single computed selector
         FIXED 2026-03-25: BuildSummary.tsx was recalculating weight itself using
         attributes.weight_g (wrong field, often 0). Now reads totalWeight directly from
         buildStore, which is the canonical source already used by PerformancePanel and
         BuilderMobileNav.

  ✅ 10. Connect BuildRadar to actual build metrics or remove it
         FIXED 2026-03-25: BuildRadar.tsx deleted. The component was never imported anywhere
         in the app and only rendered hardcoded mock data (Climbing: 80, Speed: 65, etc.).
         No live functionality was lost.

  Tier 3 — Architecture:
  ✅ 11. Unify type systems (pick one Component interface)
          FIXED 2026-03-25: buildStore.ts now imports Component from lib/types/compatibility.ts
          (the single runtime type used everywhere) instead of strict per-type interfaces.
          types/components.ts has been relabelled REFERENCE/DOCUMENTATION ONLY with a clear
          header comment — it still exists as a developer guide for what fields each component
          type should carry, but is no longer used at runtime.

  ✅ 12. Complete the interfaces/attributes → specs migration
          FIXED 2026-03-25 (Phase 1): Added @deprecated JSDoc to interfaces and attributes
          fields on the Component interface so IDEs flag all stale usage. normalization.ts
          already correctly populates specs for all critical component types. The validation
          fallbacks to raw fields remain as safety nets until a full DB migration is done.
          Full phase 2 (removing the fields entirely) can happen once all components in
          production have been re-normalised.

  ✅ 13. Add missing validation rules (FD, stem, seatpost, brake levers)
          FIXED 2026-03-25: Added validateCockpit() zone to validation.ts with 4 new checks:
          1. Stem clamp diameter vs handlebar clamp diameter (ERROR if mismatch)
          2. Stem steerer clamp vs fork steerer tube diameter (WARNING if mismatch)
          3. Seatpost diameter vs frame's seatpost_diameter spec (ERROR if mismatch)
          4. Shifter type vs handlebar type — drop bar levers on flat bar or vice versa (ERROR)
          The new zone is wired into Validator.validateBuild() alongside the existing zones.

  ✅ 14. Add security headers to next.config.ts
          FIXED 2026-03-25: Added headers() block to next.config.ts applying to all routes:
          X-Frame-Options: DENY, X-Content-Type-Options: nosniff,
          X-DNS-Prefetch-Control: on, Referrer-Policy: strict-origin-when-cross-origin,
          Strict-Transport-Security: max-age=31536000 (1 year, with preload),
          Permissions-Policy: camera/microphone/geolocation disabled.

  ⏸️  15. Switch DB JSON strings to proper JSONB columns
          DEFERRED: Migration SQL is written and ready at
          prisma/migrations/20260325000000_jsonb_columns/migration.sql.
          Blocked by database access — the project uses Vercel's built-in Prisma Postgres
          which has no SQL console UI, and direct TCP access to db.prisma.io:5432 is not
          available from localhost or Vercel build machines.
          Schema and API route changes were reverted to keep the app stable.
          TO COMPLETE: When direct DB access is available (e.g. via TablePlus/psql with
          a direct connection string from Vercel support, or if Vercel adds a SQL UI for
          Prisma Postgres), run the 3 ALTER TABLE statements in the migration file.