
# CrankSmith Mobile Parity Refactor Plan (iOS + Android)

_Date: March 28, 2026_

## 1) Purpose

This document is the implementation plan for refactoring the mobile app experiences (iOS + Android via Capacitor) so they match the updated CrankSmith web app in:

- **Visual branding and design language**
- **UX/UI behavior and interaction quality**
- **Tooling and logic parity**
- **Feature completeness and reliability**

The objective is **one product system across all platforms**, with platform-specific adaptation only when needed for native ergonomics.

---

## 2) Current-State Snapshot (What we are aligning to)

### 2.1 Product and architecture baseline

- Web app is the primary product surface (Next.js app router) with the complete tool set and latest UX patterns.
- iOS/Android are delivered through Capacitor wrappers and currently point to the production web domain.
- Builder has dedicated mobile navigation/modal behavior in the React app, so mobile web and native webview behavior overlap but are not yet standardized through a formal parity spec.

### 2.2 Web capabilities that define target parity

Mobile must preserve and match these capabilities end-to-end:

1. **Workshop / Builder**
   - Component selection flow, compatibility checks, constraints visibility, save/share/export touchpoints.
2. **Drivetrain Lab / Performance**
   - Setup comparison, charting, climb/speed insights, and import from build context.
3. **Tire Pressure**
   - Front/rear recommendations, context-aware inputs, conditions/preferences.
4. **The Scale / Weight Optimizer**
   - Baseline import/manual entry, upgrade simulation, quick-wins logic.
5. **Garage + account flows**
   - Sign-in/up, save/load/delete build lifecycle.
6. **PWA/offline behaviors**
   - Offline state messaging and sync/retry expectations.

---

## 3) Refactor Principles

1. **Parity-first, platform-second**
   - Feature logic and outputs must be identical across web and mobile unless explicitly documented as platform exception.
2. **Single source of truth for business logic**
   - Compatibility, calculations, validation, and derived metrics stay shared in core TypeScript modules.
3. **Design tokens over ad-hoc styling**
   - Brand colors, spacing, typography, surfaces, and shadows are tokenized and consumed consistently.
4. **No hidden degradations on mobile**
   - If a feature is unavailable in native context, show explicit fallback UX and telemetry.
5. **Measure parity, don’t assume parity**
   - Every feature gets acceptance criteria and an auditable parity checklist.

---

## 4) Scope and Deliverables

### In Scope

- End-to-end parity plan for iOS and Android app experiences.
- UI system alignment (branding, component behavior, motion, touch ergonomics).
- Tool/logic alignment for Builder, Performance, Tire Pressure, and Weight.
- Native wrapper hardening for auth, deep links, offline expectations, and lifecycle handling.
- QA strategy with parity matrices and release gates.

### Out of Scope (for this phase)

- Net-new product modules unrelated to existing web functionality.
- Major backend rearchitecture.
- Non-mobile web redesign.

### Primary Deliverables

- This planning document (root-level reference).
- Parity matrix (feature-by-feature) and ownership model.
- Phased execution backlog (engineering + design + QA + release).

---

## 5) Detailed Work Plan

## Phase 0 — Discovery, Baseline Audit, and Success Metrics (Week 1)

### Goals

- Establish an explicit web→mobile parity baseline.
- Remove ambiguity about what “same features” means.

### Tasks

1. Create a **Feature Inventory Sheet** covering all user-visible flows:
   - Entry points, route, dependencies, expected outputs, error states.
2. Create a **Mobile Context Risk Log**:
   - Webview limitations, auth redirects, keyboard/safe-area handling, chart performance risks.
3. Define **Parity KPIs**:
   - Functional parity score (% complete), visual parity score, crash-free sessions, key-flow completion rate.
4. Capture **current screenshots/videos** for golden baseline on:
   - Dashboard, Builder, Performance, Tire Pressure, Weight, Garage, Settings/Auth.

### Exit Criteria

- Approved parity inventory with P0/P1/P2 priorities.
- Signed-off KPI definitions and instrumentation plan.

---

## Phase 1 — Design System & Branding Convergence (Weeks 1–2)

### Goals

- Ensure mobile visually matches updated web brand expression and interaction language.

### Tasks

1. Build a **Mobile Design Token Contract** from web tokens:
   - Colors, text styles, spacing scale, radii, border alpha, elevation, blur, motion durations/easing.
2. Define **Component-Level Parity Specs** for:
   - Top app header/nav, tab/bottom nav, cards, chips, tables/lists, forms, modals/sheets, toasts, skeletons, charts.
3. Standardize **Safe Area + Notch behavior**:
   - Top/bottom insets, sticky CTA offsets, keyboard avoidance behavior.
4. Standardize **State visuals**:
   - Loading, empty, offline, validation error, locked/auth-required states.
5. Accessibility pass:
   - Contrast, dynamic type bounds, touch target sizing, reduced motion support.

### Exit Criteria

- Signed parity-ready mobile UI kit.
- Redline specs and acceptance screenshots for each core screen.

---

## Phase 2 — Shared Logic Parity (Weeks 2–4)

### Goals

- Guarantee identical calculations/validation outcomes on web and mobile.

### Tasks

1. Audit core logic modules used by web tools:
   - Compatibility validation, gear calculations, weight math, unit conversion, normalization.
2. Eliminate duplicated or divergent mobile-only logic paths.
3. Introduce a **cross-platform golden test suite**:
   - Shared fixture inputs + expected outputs for builder compatibility, drivetrain metrics, pressure outputs, and weight summaries.
4. Add regression fixtures for edge cases:
   - Mixed drivetrain protocols, freehub mismatches, tire width boundaries, missing metadata.
5. Ensure all tool summaries/cards use non-placeholder computed data only.

### Exit Criteria

- All parity test fixtures pass on CI.
- Output equivalence confirmed for all core calculators.

---

## Phase 3 — Feature-by-Feature Mobile Refactor (Weeks 3–7)

### 3A) Workshop / Builder parity

- Refactor mobile builder interactions (sheets/modals/nav) to match updated web behavior and copy.
- Replace any remaining legacy prompt/alert flows with branded in-app UX.
- Ensure deterministic compatibility reasons are visible in mobile cards.
- Confirm save/share/export flow behavior parity and auth handoff reliability.

### 3B) Drivetrain Lab parity

- Ensure chart rendering, presets, and setup compare interactions match web defaults.
- Optimize chart touch interactions (drag, tooltip anchoring, dense labels).
- Match web assumptions/inputs for top-speed and climb panels.

### 3C) Tire Pressure parity

- Match all web input controls and defaults.
- Ensure warning/guardrail surfaces are identical.
- Add mobile-specific clarity for wet/tubeless/surface modifiers.

### 3D) Scale parity

- Align baseline import/manual entry flows with web copy and state transitions.
- Ensure quick-wins ranking and cost-per-gram calculations match shared logic.
- Match upgrade scenario save/share interactions.

### 3E) Garage/Auth parity

- Standardize auth redirects within native webview context.
- Validate add/edit/delete/save flows with clear toast-based outcomes.
- Confirm session persistence through app background/foreground cycles.

### Exit Criteria

- Each tool has a signed parity checklist (UX + logic + states + errors).
- Product and QA approval for all P0 flows.

---

## Phase 4 — Native Shell Hardening (Weeks 6–8)

### Goals

- Make iOS/Android wrappers production-hardened for parity-quality delivery.

### Tasks

1. Capacitor wrapper review:
   - Navigation allowlist, deep-link behavior, universal/app links strategy.
2. Native lifecycle handling:
   - Foreground/background resume behavior, interrupted session recovery.
3. Network/offline contract:
   - Consistent offline page/indicator behavior and queued retry patterns.
4. Telemetry and diagnostics:
   - Unified event naming across web/mobile for parity monitoring.
5. Store-readiness checks:
   - Permission disclosures, metadata, build/release automation sanity.

### Exit Criteria

- iOS and Android release candidate builds pass smoke + regression suites.

---

## Phase 5 — QA, Rollout, and Governance (Weeks 8–9)

### QA Model

1. **Parity Matrix Testing**
   - Route-by-route and feature-by-feature comparison to web baseline.
2. **Device Matrix**
   - iPhone small/large, modern Android mid/high density, low-memory profile.
3. **Network Matrix**
   - Strong Wi-Fi, weak cellular, offline, reconnect.
4. **Regression Packs**
   - Builder compatibility cases, performance calculations, pressure edge cases, weight scenario edits.

### Rollout

1. Internal beta (team)
2. External beta (limited users)
3. Staged production rollout (10% → 50% → 100%)
4. Post-release monitoring (7-day + 30-day parity KPI review)

### Governance

- Establish a **Parity Definition of Done** in PR template:
  - Logic tests updated
  - Mobile screenshots/video attached
  - Error/empty/loading states verified
  - Accessibility checks complete

---

## 6) Backlog Structure and Ownership

## Workstreams

1. **Design System & UX** (Design + Frontend)
2. **Shared Logic & Validation** (Frontend + Platform)
3. **Mobile Runtime/Shell** (Mobile/Platform)
4. **QA Automation & Release** (QA + DevOps)
5. **Analytics & Monitoring** (Data + Platform)

## Suggested Ownership Model

- **Product Owner:** parity scope + prioritization
- **Tech Lead:** architecture and logic parity enforcement
- **Design Lead:** visual/interaction parity sign-off
- **QA Lead:** parity matrix governance
- **Release Owner:** TestFlight/Internal App Sharing rollouts

---

## 7) High-Risk Areas and Mitigations

1. **Webview auth redirect drift**
   - Mitigation: explicit native-safe auth callback contracts and test cases.
2. **Inconsistent calculator outputs**
   - Mitigation: golden shared fixtures in CI + snapshot alerts.
3. **Chart interaction performance on lower-end devices**
   - Mitigation: lightweight rendering modes and progressive detail.
4. **Safe-area/keyboard overlap**
   - Mitigation: standardized layout primitives and per-screen QA scripts.
5. **Silent fallback behavior**
   - Mitigation: explicit UX notices + instrumentation on fallback paths.

---

## 8) Definition of Done (Mobile Parity Release)

A mobile parity release is complete when:

1. All P0/P1 web features are present on iOS and Android.
2. Shared logic test suite confirms equivalent outputs.
3. Visual parity score meets agreed threshold (e.g., >= 95%).
4. Critical flows pass QA matrix on target devices.
5. Analytics confirms no severe regressions in engagement or errors.
6. Documentation and ongoing parity governance process are in place.

---

## 9) Practical Task Checklist (Execution Ready)

- [ ] Build parity inventory and prioritize P0/P1/P2.
- [ ] Freeze mobile design token mapping from web theme.
- [ ] Replace residual legacy mobile prompts/alerts.
- [ ] Ship shared golden logic fixtures and CI checks.
- [ ] Complete builder parity pass (logic + UI + states).
- [ ] Complete drivetrain lab parity pass.
- [ ] Complete tire pressure parity pass.
- [ ] Complete weight tool parity pass.
- [ ] Harden auth/offline/lifecycle in iOS + Android wrappers.
- [ ] Run parity QA matrix and staged rollout.

---

## 10) Recommended Immediate Next 5 Actions (This Week)

1. Approve this document as the parity source of truth.
2. Create implementation tickets from Section 9 checklist.
3. Run a 2-hour parity inventory workshop (Product + Design + Eng + QA).
4. Add shared logic parity test harness skeleton in CI.
5. Start Builder mobile parity refactor first (highest user impact).

