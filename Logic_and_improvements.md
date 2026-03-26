# CrankSmith Web App Audit: Logic, Functionality, and Improvement Roadmap

_Date: March 26, 2026_

> **Status update (repo checkpoint): April 2026**
>
> This document now includes a progress snapshot based on implemented web-app code.
> Legend:
> - ✅ Completed in current codebase
> - 🟡 Partially implemented / beta
> - ⏳ Not implemented yet

Scope: **Web app only** (excluding iOS/Android app wrappers). This report audits the four core tools:
1. **Workshop** (`/builder`)
2. **Gearing** (`/performance` / Drivetrain Lab)
3. **Tire Pressure** (`/tire-pressure`)
4. **The Scale** (`/weight`)

Audience alignment used in this review: recreational to serious self-supported cyclists in road, gravel, and MTB performance segments, including DIY wrenchers and “upgrade-curious” racers.

---

## Executive Summary

CrankSmith’s web product concept is strong and differentiated: it already combines compatibility, performance simulation, and value-oriented upgrade analysis in a single workflow. The UI language is clear and enthusiast-friendly, and most modules are directionally correct.

The highest-value opportunities are now about **raising trust and analytical rigor**:

- Workshop: move from “good heuristic filtering” to **position-aware deterministic compatibility** and confidence indicators.
- Gearing: improve realism by fixing hardcoded assumptions and modeling **full drivetrain + wheel/tire + cadence distributions**.
- Tire Pressure: keep the current usability, but calibrate with **validated model outputs and guardrails by discipline**.
- Scale: maintain the engaging upgrade UX, while improving **data completeness, category matching reliability, and scenario economics**.

If these are improved, CrankSmith can become the default “decision cockpit” for non-sponsored performance cyclists making real purchasing and setup decisions.

---

## 1) Workshop (Builder) Audit

### What’s going well

1. **Strong guided workflow for self-builders**
   - The step-by-step build sequence (frame → fork → wheels → drivetrain → cockpit) matches real workshop decision order and reduces choice paralysis.
   - The UI presents contextual constraints (e.g., BB shell, freehub, tire clearance) which helps newer wrenchers understand _why_ options are filtered.

2. **Multi-layer filtering approach is practical**
   - The system uses both explicit compatibility logic and pragmatic heuristics, which is useful for imperfect component datasets.
   - Additional freehub and spindle normalization logic lowers friction caused by inconsistent naming across brands.

3. **Good UX around complex choices**
   - Freehub selector and fork-choice modal are useful pattern interventions where hidden incompatibility frequently appears in real life.
   - “Compatible only” toggle plus incompatibility reasons supports both fast flow and power-user investigation.

4. **Validation architecture exists and is reusable**
   - The central validator supports frame/fork/wheels/tires/drivetrain/brakes/cockpit checks and can power many future “advisor” features.

### What’s not going well

1. **Tire-to-wheel validation is currently fragile**
   - Tire validation uses `wheels[0]` as the relevant wheel during validation in the central validator, which can produce wrong results when front/rear specs differ.
   - This can erode trust for advanced users running mixed setups (common in MTB and some gravel race configurations).

2. **Inconsistent deterministic vs heuristic checks**
   - Some mismatches are checked with robust normalization; others rely on name- or string-contains heuristics.
   - This makes behavior less predictable for users comparing edge-case combinations.

3. **Some “final output” stats still include placeholders**
   - Build complete/share area still includes TODO placeholders for climbing/speed metrics, reducing perceived analytical maturity.

4. **Potential over-filtering or under-filtering for tire/fork categories**
   - Category logic is useful but still broad and heuristic-heavy (e.g., type and width inference can show/hide parts unexpectedly).

### What should be improved (near-term)

1. **Make all wheel/tire checks position-aware and deterministic**
   - Explicitly match front tire ↔ front wheel and rear tire ↔ rear wheel.
   - Track whether a verdict came from direct standards vs heuristic inference.

2. **Introduce compatibility confidence scoring**
   - Show users: “High confidence (direct spec match)” vs “Medium confidence (inferred from naming).”
   - This preserves transparency and keeps power users engaged instead of skeptical.

3. **Replace placeholder post-build performance data with real calculations**
   - Use selected cassette, chainring, wheel circumference, and rider inputs to calculate actual speed/climb summary in share/build complete cards.

4. **Add explicit ambiguity handling**
   - If a part is missing key metadata (e.g., unknown axle, unknown mount), surface “needs manual verification” instead of silently passing.

### Future implementations (high value-add)

1. **Decision impact simulator before purchase**
   - “If I switch from 10-44 to 10-52 + 40T ring, what changes in cadence windows on my target climbs?”
   - Connect compatibility with performance and cost in one action.

2. **Build intent presets by discipline**
   - Example modes: Road race, all-road, gravel race, gravel bikepacking, XC, trail/enduro.
   - These can adjust default constraints and rank options by discipline priorities.

3. **Confidence-aware recommendations**
   - “Top 5 compatible options sorted by confidence + value + performance impact.”

4. **Race prep mode**
   - Generate checklist: gearing viability by gradient bands, spare parts needs, torque and service notes by selected components.

---

## 2) Gearing Tool (Drivetrain Lab) Audit

### What’s going well

1. **Core comparative intent is excellent**
   - Side-by-side setup comparison is exactly what competitive weekend racers need when deciding chainring/cassette trade-offs.

2. **Useful discipline presets and quick-edit model**
   - Presets for road/gravel scenarios lower activation friction.
   - Editable chainring/cassette/tire inputs support both novice and advanced users.

3. **Build integration exists**
   - Pulling active builder drivetrain data into the tool is the right product strategy.

4. **Readable visualization layer**
   - Speed-vs-ratio chart and climb-focused panel communicate differences quickly.

### What’s not going well

1. **Top speed calculations use hardcoded assumptions**
   - Several “Top Speed” cards assume a fixed `11T` smallest cog and `2100mm` wheel circumference, which can misstate reality (especially gravel/MTB).

2. **Cassette parsing fallback may be unrealistic**
   - Unknown ranges are converted via linear interpolation with assumed 12-speed spacing, which can generate cogs that do not represent any real cassette progression.

3. **Climbing model is intentionally simplified**
   - Grade model focuses on low-gear cadence/power relationship and omits rolling resistance/aero/traction losses. This is okay for quick comparison but can be over-trusted if not clearly framed.

4. **No cadence distribution / event-specific context**
   - Serious users care about cadence windows at race speed and grade bands, not just top-end and a single “max grade” number.

### What should be improved (near-term)

1. **Remove hardcoded 11T + 2100mm in quick stats**
   - Use actual smallest cog and calculated circumference from selected wheel/tire.

2. **Improve cassette modeling strategy**
   - Add known cassette libraries by brand/drivetrain family.
   - If unknown, mark as “synthetic progression” with warning.

3. **Add confidence/context labels to climbing estimates**
   - e.g., “The Climbing Wall is a simplified theoretical model; results are best for comparative decisions, not absolute race prediction.”

4. **Introduce cadence-band and speed-at-grade outputs**
   - “At 6%, 8%, 10%, what cadence do I hold at my target power for each setup?”

### Future implementations (high value-add)

1. **Course-aware gearing advisor**
   - Input event profile (or upload GPX): output recommended gear pairs and cadence stress points.

2. **Power profile personalization**
   - Include FTP + 5-min power + sprint power to optimize both climbing and race-speed survivability.

3. **Drivetrain wear efficiency layer**
   - Penalize extreme chainline or tiny-tiny/big-big usage and show expected efficiency trade-offs.

4. **Multi-objective optimization**
   - Recommend setups based on weighted priorities: climb ease, top speed, cadence smoothness, and parts compatibility.

---

## 3) Tire Pressure Tool Audit

### What’s going well

1. **Great usability and immediate clarity**
   - Inputs are intuitive (weight, tire width, rim width, surface, wet/tubeless, preference slider).
   - Front/rear split with min/max ranges is user-friendly and actionable.

2. **Modern framing for broad use cases**
   - Includes road through MTB surface options and exposes key variables users actually control.

3. **Useful educational snippets**
   - Rim-width effect and temperature impact notes are practical and increase confidence.

### What’s not going well

1. **Model is heuristic and not externally calibrated in-product**
   - The formula appears as an approximation and may be directionally right but not sufficiently validated for all tire constructions and disciplines.

2. **Safety clamps are broad and generic**
   - Pressure clamping to global min/max helps prevent outliers but does not enforce discipline-specific safe envelopes (hookless limits, casing/rim combinations, etc.).

3. **No guardrails for key real-world constraints**
   - Missing explicit warnings for out-of-distribution setups (e.g., very narrow tire with very wide rim, high pressure on tubeless/hookless road combinations).

4. **No confidence or sensitivity analysis shown**
   - Users can’t see how much uncertainty is in their recommendation.

### What should be improved (near-term)

1. **Add discipline-specific guardrails and warnings**
   - Road/gravel/MTB ranges with hard warnings where setups likely exceed practical/safe norms.

2. **Add confidence bands**
   - Show recommendation as “best estimate ± expected variance” based on surface and setup.

3. **Make assumptions explicit in UI**
   - Surface modifier assumptions, load split assumptions, tubeless offsets should be visible and editable in advanced mode.

4. **Integrate compatibility-derived constraints**
   - Pull frame/fork max tire and wheel/rim data from Workshop build to auto-configure realistic input defaults.

### Future implementations (high value-add)

1. **Ride-condition adaptation layer**
   - Inputs for temperature, elevation, wetness severity, and race duration.

2. **Tire casing library**
   - Sidewall/casing/compound models by tire family so pressure targets reflect real casing support differences.

3. **On-bike feedback loop**
   - Let users log ride feedback (“burped,” “too harsh,” “front washout”) and tune future recommendations.

4. **Event mode**
   - Output pressure sets for qualifying/day-before/race-day conditions.

---

## 4) The Scale (Weight Weenies) Audit

### What’s going well

1. **Excellent product-market language for performance enthusiasts**
   - Cost-per-gram framing directly matches how amateur racers and DIY upgraders think.

2. **Solid baseline → target workflow**
   - Baseline import from builder + manual entry supports both existing users and new entrants.

3. **Quick Wins concept is high utility**
   - Prioritizing value and rotating weight creates immediately actionable upgrade paths.

4. **State model is straightforward and transparent**
   - Upgrade add/remove and aggregate metrics are easy to follow and likely easy to maintain.

### What’s not going well

1. **Potential mismatch risk in quick-win component typing**
   - Quick-win type inference relies on finding the baseline component ID in fetched type buckets; if IDs are transformed or imported manually, upgrade opportunities may be skipped.

2. **Inconsistent coverage for category-level economics**
   - Current flow is strong for single-part swaps but less expressive for “bundle upgrades” and staged budget optimization.

3. **Import reality gap vs complete bike estimate**
   - Different paths use different weight assumptions; users may be confused when builder total vs scale total differs without clear reconciliation.

4. **Save/export maturity not complete**
   - Some actions still indicate “Coming Soon,” which interrupts trust when users are ready to commit upgrade plans.

### What should be improved (near-term)

1. **Strengthen component identity + category matching**
   - Use canonical category mapping from the source build, not inference by search.

2. **Introduce budget-constrained optimization**
   - “I have $500 / $1,000 / $2,000 — give me best total grams saved and rotating-weight priority options.”

3. **Reconciliation panel for totals**
   - Show: baseline measured weight, estimated missing components, and confidence level to explain differences.

4. **Complete save/share lifecycle**
   - Allow users to save upgrade plans, compare multiple target scenarios, and export purchase shortlists.

### Future implementations (high value-add)

1. **Scenario planner**
   - “Race build,” “training build,” “all-weather build” with quick switching and delta comparisons.

2. **Real weight verification pipeline**
   - User-submitted scale photos and community-verified weights to improve database quality over time.

3. **Marginal gain scoring**
   - Combine grams saved, rotating penalty, reliability impact, and cost into one “smart value score.”

4. **Upgrade sequence planner**
   - Suggest order of upgrades by budget windows and expected performance return.

---

## Cross-Tool Opportunities (Biggest Overall Value-Add)

These are the highest leverage improvements because they connect all four tools into one decision loop:

1. **Unified Build Intelligence Layer**
   - Single source of truth for wheel/tire/drivetrain geometry and standards.
   - Every tool consumes the same validated model to reduce contradictory outputs.

2. **Confidence + Explainability System**
   - Every recommendation should show:
     - Confidence score
     - Inputs used
     - Assumptions
     - What data is missing

3. **Discipline-Aware Profiles (Road / Gravel / MTB)**
   - Tune defaults, warnings, and recommendation ranking by discipline and rider intent.

4. **What-If “Upgrade Consequence” Engine**
   - One change (e.g., cassette or tire width) should update compatibility risk, speed/cadence outcomes, pressure targets, and weight/cost impacts together.

5. **Trust UX for serious users**
   - Add tooltips and “show calculation” links so advanced cyclists can inspect formulas and assumptions before buying parts.

---

## Prioritized Implementation Roadmap

### Phase 1 (2–4 weeks): Trust and correctness
- ✅ Fix position-aware tire/wheel validation logic in Workshop.
- ✅ Remove hardcoded top-speed assumptions in Gearing quick stats.
- ✅ Add clear model caveats + confidence labels in Gearing and Tire Pressure.
- ✅ Replace TODO placeholder outputs in build complete/share summaries.

### Phase 2 (4–8 weeks): Better decision quality
- 🟡 Add cassette libraries and discipline-specific pressure guardrails.
  - Status: synthetic fallback warning + known cassette set implemented; library depth can still expand.
  - Status: discipline pressure bounds/warnings implemented; event-pressure presets added.
- ✅ Add budget optimizer in The Scale.
- ✅ Introduce cross-tool data propagation from current build to pressure/gearing defaults.

### Phase 3 (8–16 weeks): Product moat
- 🟡 Unified what-if engine across all 4 tools.
  - Status: shared what-if hooks exist in Builder, Drivetrain Lab, Tire Pressure, and Quick Wins.
  - Remaining: fully unified single-source model and deeper consequence propagation.
- 🟡 Course-aware/event-aware recommendations.
  - Status: course-aware advisor exists (beta) in Gearing; event pressure sets added in Tire Pressure.
  - Remaining: GPX/course depth, recommendation confidence, and production hardening.
- 🟡 Verified weight and setup feedback loops to improve prediction accuracy over time.
  - Status: ride-feedback capture + verification flow exists in Tire Pressure.
  - Remaining: broader cross-tool verification and persistence pipeline.

### Additional completed items beyond original phase bullets
- ✅ The Scale scenario lifecycle foundation:
  - Save/load/delete/export scenarios
  - Scenario compare panel
  - Scenario mode tagging/filtering (race/training/all-weather/custom)
- ✅ Baseline reconciliation panel in The Scale (missing categories, estimated missing weight, confidence).
- ✅ Manual-verification warnings surfaced in Builder UI and validator.
- ✅ Quick Wins smart value scoring + budget-tier sequence planner.

---

## Closing Assessment

CrankSmith already has the right **product direction** and **user tone** for the non-sponsored performance cyclist market. The next step is not a redesign—it is a **credibility upgrade**: deterministic compatibility where possible, transparent assumptions where not, and cross-tool coherence so users can trust high-impact decisions.

If executed well, these improvements can elevate CrankSmith from a useful toolbox to a true performance decision platform for road, gravel, and MTB enthusiasts.
