# Gravel-Only Builder Refactor Plan (Bike Compatibility Tool)

_Date: March 30, 2026_

## 1) Goal

Refactor **Workshop / Bike Builder / Parts Compatibility** to support **gravel builds only** while keeping the other tools broad:

- **Keep broad (road + gravel + MTB where already supported):**
  - Tire Pressure Calculator
  - Drivetrain Lab / Gear Comparison
- **Make gravel-only:**
  - Builder UI flows
  - Builder-compatible component catalog and APIs
  - Builder validation logic inputs and compatibility surfaces

This plan is designed to reduce logic complexity in the builder without regressing the pressure and gearing experiences.

---

## 2) Current-State Touchpoints (Repo Map)

Primary areas involved in this refactor:

- Builder route and metadata: `src/app/builder/page.tsx`
- Builder selection/render flow: `src/components/builder/PartSelector.tsx`
- Builder state and selected parts lifecycle: `src/store/buildStore.ts`
- Components API used by builder/admin/tooling: `src/app/api/components/route.ts`
- Compatibility engine and rule checks: `src/lib/validation.ts`
- Runtime component shape used by validation and UI: `src/lib/types/compatibility.ts`
- Source component data / mock inventory: `src/data/mockDb.ts`
- Prisma schema and seed/ingest scripts: `prisma/schema.prisma`, `prisma/seed*.ts`, `prisma/ingest*.ts`
- Tire pressure + gearing tools to protect from regression:
  - `src/components/tools/TirePressureCalculator.tsx`
  - `src/components/tools/DrivetrainLab.tsx`

---

## 3) Scope Definition

## In Scope

1. Builder constrained to gravel frames, forks, wheels, tires, drivetrains, and associated parts.
2. Builder APIs default to gravel-compatible inventory and reject incompatible discipline entries.
3. Compatibility engine path for builder simplified around gravel standards and common gravel edge-cases.
4. Existing user builds migrated/handled safely if non-gravel components exist.
5. Documentation, naming, and UI copy updated to clearly communicate gravel-only builder intent.

## Out of Scope

1. Removing road/MTB logic from Tire Pressure Calculator.
2. Removing road/MTB logic from Drivetrain Lab.
3. Deleting all non-gravel data from database history (hard delete is not required for first pass).

---

## 4) Refactor Principles

1. **Tool boundary clarity:** only builder becomes gravel-only; other tools remain multi-discipline.
2. **Non-destructive migration:** prefer soft deprecation/archival flags over irreversible deletes.
3. **Single discipline source-of-truth:** explicit component discipline taxonomy (e.g., `gravel`, `road`, `mtb`, `multi`).
4. **Deterministic behavior:** builder should not rely on fuzzy name inference for discipline scoping.
5. **Observable rollout:** instrument and verify that builder inventory and compatibility outputs are gravel-only.

---

## 5) Governance, Contracts, and Rollback (Pre-Implementation Gate)

This gate must be completed before development begins in Phase 1.

### 5.1 Canonical discipline taxonomy contract

Define and enforce a canonical enum:

- `gravel`
- `road`
- `mtb`
- `multi`

Required rules:

1. `discipline` is required for every component.
2. `disciplineTags` is optional and additive only (cannot contradict primary discipline for builder eligibility).
3. `builderEligible=true` is valid only when:
   - `discipline=gravel`, or
   - `discipline=multi` **and** tags include `gravel` and pass gravel audit checks.
4. If `discipline=road` or `discipline=mtb`, `builderEligible` must be `false`.

### 5.2 Admin and ingestion data quality contract

Before save/import, enforce:

1. Required discipline fields present.
2. `builderEligible` consistency checks pass.
3. New/updated components with `discipline=multi` enter manual review queue.
4. Import pipeline fails fast on taxonomy violations and outputs actionable error rows.

### 5.3 Rollback strategy

Define two rollback paths:

1. **Soft rollback (default):** disable gravel-only builder feature flag and return to previous builder filtering behavior.
2. **Hard rollback (data incident):** restore pre-migration snapshots and disable writes to discipline metadata until repaired.

Operational requirements:

- Keep migration scripts idempotent and reversible.
- Keep one release worth of pre-migration backups and audit logs.
- Document owner-on-call and recovery SLA for rollout week.

### 5.4 Rollout KPI thresholds and gates

Use staged rollout progression only when all thresholds pass:

1. Builder completion rate drop is less than 5% vs 14-day baseline.
2. Builder validation error rate increase is less than 10% vs baseline.
3. Non-gravel selection attempts trend downward after first week.
4. No critical incidents involving legacy build data corruption.

---

## 6) Phased Implementation Plan

## Phase 0 — Discovery and Rule Freeze

### Objectives
- Document where discipline assumptions currently live.
- Freeze current builder compatibility behavior as a baseline.

### Tasks
1. Inventory all component categories used by builder and label current discipline coverage.
2. Capture baseline regression fixtures for existing compatibility checks.
3. Enumerate all API and store entry points that can load non-gravel parts.
4. Define gravel standard matrix (wheel diameters, tire widths, axle standards, freehub expectations, brake mount assumptions, drivetrain families).
5. Publish compatibility truth-table owner list and sign-off workflow (Product + Engineering + Data curation).

### Deliverables
- Discipline map by component category.
- Baseline test fixture set for pre-refactor behavior.
- Approved gravel standard matrix doc.

---

## Phase 1 — Data Model and Catalog Segmentation

### Objectives
- Add reliable discipline classification and gravel eligibility metadata.

### Tasks
1. Extend component schema (or normalized JSON contract) with discipline fields:
   - `discipline` (primary)
   - `disciplineTags` (optional, multi-fit)
   - `builderEligible` boolean (for gravel builder gating)
2. Backfill existing records via scripted migration:
   - Mark true gravel components as eligible.
   - Mark road/MTB-only as ineligible for builder.
   - Preserve ambiguous components as `multi` with explicit review queue.
3. Update seed/ingest scripts to require discipline classification on new entries.
4. Add catalog audit script that fails when builder-eligible parts are non-gravel.

### Deliverables
- Schema/migration scripts.
- Backfill scripts + audit report.
- Updated ingest/seed guardrails.

---

## Phase 2 — Builder API and Query Isolation

### Objectives
- Ensure builder only receives gravel-eligible components.

### Tasks
1. Add builder-specific API filter mode (e.g., `context=builder`) enforcing `builderEligible=true` and gravel discipline.
2. Keep admin/component APIs capable of seeing full catalog, but with explicit filtering controls.
3. Add server-side validation to block builder writes/saves containing non-gravel components.
4. Add API tests for:
   - gravel-only result sets
   - exclusion of road/MTB-only parts
   - mixed-discipline rejection on save

### Deliverables
- Updated component API behavior.
- API tests for builder discipline isolation.

---

## Phase 3 — Builder UI/UX Refactor (Gravel-Only Experience)

### Objectives
- Make builder UX clearly gravel-focused and remove multi-discipline ambiguity.

### Tasks
1. Update builder labels/copy/metadata to reflect gravel-only positioning.
2. Remove or hide discipline switches/options that imply road/MTB builds.
3. Improve empty/error states for missing gravel options in category selectors.
4. Add visual badges/labels indicating gravel-validated components.
5. Ensure load/edit flows for legacy non-gravel builds use default policy:
   - default: read-only legacy warning path
   - optional: guided conversion flow launched by explicit user action.

### Deliverables
- Gravel-only builder UI copy and behavior.
- Legacy build handling UX.

---

## Phase 4 — Compatibility Engine Simplification (Builder Context)

### Objectives
- Reduce convoluted cross-discipline logic in builder validation while protecting correctness.

### Tasks
1. Isolate builder validation context in `validation.ts` (or companion module) so gravel assumptions are explicit.
2. Remove discipline-agnostic fallbacks that were only needed for road/MTB crossover in builder path.
3. Keep drivetrain and tire-pressure tool logic untouched unless shared utility changes are required.
4. Add targeted regression tests for gravel edge-cases:
   - 700c vs 650b gravel fit
   - wide-range cassette/freehub combinations
   - 1x/2x gravel drivetrain protocol compatibility
   - rotor mount and axle standard mismatches common in gravel builds

### Deliverables
- Simplified builder validation pathway.
- Expanded gravel-focused tests.

---

## Phase 5 — Non-Builder Tool Protection (No Regression Track)

### Objectives
- Explicitly preserve broad logic for Tire Pressure and Drivetrain Lab.

### Tasks
1. Add/refresh test fixtures in:
   - `tirePressureCalculations` test suite
   - `gearCalculations` / drivetrain tool tests
2. Confirm road and MTB scenarios still compute correctly in those modules.
3. Verify no builder-only filtering leaks into shared tools.

### Deliverables
- Passing regression tests proving broad tool behavior remains intact.

### Completion Status (updated March 30, 2026)
- ✅ Tire pressure regression fixtures cover road, gravel, and MTB behavior comparisons.
- ✅ Gear calculation regression fixtures cover road and wide-range MTB drivetrains.
- ✅ What-if engine regression fixtures cover road/gravel/MTB comparisons plus malformed legacy payload hardening.
- ✅ Component API/filter regression fixtures verify builder-only gating is explicit and does not leak into default/non-builder paths.

---

## Phase 6 — Migration, Rollout, and Monitoring

### Objectives
- Ship safely without breaking existing users.

### Tasks
1. Add one-time migration for stored user builds:
   - classify existing builds as gravel-compatible vs legacy mixed discipline.
2. Release with feature flag (required):
   - staged rollout for internal → beta users → all users.
3. Add telemetry/dashboard checks:
   - non-gravel part selection attempts in builder
   - validation error spikes post-launch
   - build completion rate changes
4. Enforce KPI rollout gates from Section 5.4 between each rollout stage.
5. Publish user-facing changelog note explaining builder scope change.

### Deliverables
- Migration report.
- Rollout checklist and monitoring dashboard links.

### Phase 6 Progress Notes (updated March 30, 2026)
- ✅ Added saved-build migration status classification on `GET /api/builds` (`gravel_compatible`, `legacy_non_gravel`, `invalid_payload`).
- ✅ Added migration audit script `npm run db:audit-build-migration` to summarize legacy build scope and top violations for rollout planning.
- ✅ Added soft-rollback feature flag `CRANKSMITH_GRAVEL_BUILDER_ENABLED` for builder API gating paths (`components` + `builds`).
- ✅ Added executable KPI gate evaluator (`src/lib/rolloutGates.ts`) plus CLI (`npm run rollout:check-gates`) for staged rollout decisions.
- ✅ Added admin rollout health endpoint (`GET /api/admin/rollout-health`) to expose migration-status totals and feature-flag state.

---

## 7) Execution Sequencing and Dependencies

Recommended order:
1. Phase 0 (freeze + mapping)
2. Phase 1 (data model)
3. Phase 2 (API isolation)
4. Phase 3 + 4 in parallel (UI + validation)
5. Phase 5 (non-builder regression proof)
6. Phase 6 (migration + rollout)

Hard dependencies:
- Phase 2 depends on discipline metadata from Phase 1.
- Phase 3 depends on API filtering from Phase 2.
- Phase 6 depends on completion of tests and migration logic from Phases 4–5.

---

## 8) Acceptance Criteria (Definition of Done)

1. Builder can only load/select/save gravel-eligible components.
2. Builder compatibility output remains deterministic and passes gravel regression suite.
3. Tire Pressure and Drivetrain Lab still pass road/gravel/MTB scenario tests.
4. Legacy non-gravel builds are handled with no silent corruption.
5. Documentation and product copy clearly reflect gravel-only builder scope.

---

## 9) Risks and Mitigations

1. **Risk:** Misclassified components block valid gravel builds.
   - **Mitigation:** Manual review queue for `multi` components + audit scripts.
2. **Risk:** Shared validation utilities unintentionally affect non-builder tools.
   - **Mitigation:** Context-separated validation entry points + targeted regression tests.
3. **Risk:** Existing users lose editability of old mixed-discipline builds.
   - **Mitigation:** Legacy read-only mode + guided conversion suggestions.
4. **Risk:** Admin workflows become harder with stricter discipline requirements.
   - **Mitigation:** Admin UI defaults + validation hints on component creation.

---

## 10) Suggested First Implementation Ticket Batch

1. Add discipline metadata contract + migration script.
2. Builder API filter (`context=builder`) and tests.
3. Builder copy/metadata update to gravel-only language.
4. Validation context split for builder-gravel mode.
5. Regression test pack for Tire Pressure + Drivetrain Lab.
6. Legacy build read-only default + optional guided conversion UX.
7. Rollback runbook + KPI gate dashboard configuration.
