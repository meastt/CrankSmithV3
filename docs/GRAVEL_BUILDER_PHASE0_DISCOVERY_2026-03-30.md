# Gravel Builder Refactor — Phase 0 Discovery & Rule Freeze

_Date: March 30, 2026_

This document executes **Phase 0** from `GRAVEL_BUILDER_REFACTOR_PLAN_2026-03-30.md` by establishing current-state inventory, initial rule boundaries, ownership, and baseline regression scope before schema/API changes begin.

---

## 1) Phase 0 Deliverables Status

- [x] Component category inventory with discipline coverage notes
- [x] Builder load/save entry-point map (API + store)
- [x] Gravel standards matrix v0.1 for implementation baseline
- [x] Compatibility truth-table ownership and sign-off path
- [x] Baseline regression fixture list to freeze current behavior

---

## 2) Current Catalog Inventory (Observed)

Based on current repo docs and models:

- Data model currently stores `type`, `name`, plus JSON strings (`interfaces`, `attributes`) without first-class discipline fields.
- Runtime compatibility shape includes an optional `specs.category` hint but no enforced `discipline` contract.
- Existing inventory includes mixed road/gravel/MTB entries across major categories.

### 2.1 Category-level discipline snapshot (v0.1)

| Category | Current mix likely present | Gravel-only builder target |
|---|---|---|
| Frame | Road + Gravel + MTB | Gravel + approved `multi` only |
| Fork | Road + Gravel + MTB | Gravel + approved `multi` only |
| Wheel / Wheelset | Road + Gravel + MTB | Gravel + approved `multi` only |
| Tire | Road + Gravel + MTB | Gravel + approved `multi` only |
| Crankset | Road + Gravel + MTB | Gravel + approved `multi` only |
| Cassette | Road + Gravel + MTB | Gravel + approved `multi` only |
| RearDerailleur | Road + Gravel + MTB | Gravel + approved `multi` only |
| Shifter | Road + Gravel + MTB | Gravel + approved `multi` only |
| BottomBracket | Cross-discipline | Gravel + approved `multi` only |
| Chain | Cross-discipline | Gravel + approved `multi` only |
| Cockpit parts | Cross-discipline | Gravel + approved `multi` only |

> Notes:
> - `docs/PARTS_INVENTORY.md` shows mixed-discipline product examples today (e.g., road race and MTB lines alongside gravel). 
> - Phase 1 will replace this qualitative map with query-driven counts once taxonomy fields exist.

---

## 3) Builder Entry-Point Map (Where non-gravel can flow today)

## 3.1 Read path

1. Builder route mounts selector UI:
   - `src/app/builder/page.tsx`
2. Builder selector fetches components through API route:
   - `src/app/api/components/route.ts`
3. API currently filters only by `type` and returns all matching rows.

## 3.2 Write/save path

1. Builder state is assembled in client store/components.
2. Save flows serialize selected parts into `SavedBuild.parts` JSON.
3. No discipline guard exists yet for saving non-gravel mixes.

## 3.3 Shared logic risk paths

- `src/lib/validation.ts` contains generalized compatibility helpers currently supporting broad discipline inference.
- Shared utility behavior must be isolated so builder filtering does not change Tire Pressure or Drivetrain behavior.

---

## 4) Gravel Standards Matrix v0.1 (Rule Freeze Baseline)

This matrix is the implementation baseline for Phase 1/2 gating and test fixture design.

### 4.1 Frame/fork/wheel baseline

- Primary wheel standards: `700c`, `650b`
- Tire clearance baseline for gravel-eligible frames/forks:
  - 700c: support up to at least 40 mm
  - 650b: support up to at least 45 mm
- Brake baseline: disc systems only for builder gravel mode
- Axle baseline: thru-axle gravel norms (front/rear standards as declared in component specs)

### 4.2 Drivetrain baseline

- Supported gravel patterns:
  - 1x gravel groups
  - 2x gravel groups
  - approved mullet combinations when compatibility checks pass
- Freehub compatibility remains explicit (HG / XDR / XD / MicroSpline) with no silent substitution

### 4.3 Guardrail principles

- No discipline inference from marketing names during runtime filtering.
- `multi` components are excluded by default unless explicitly gravel-approved by audit.
- Missing critical specs => component is ineligible for builder until reviewed.

---

## 5) Compatibility Truth-Table Governance

## Owners

- **Product Owner:** defines intended gravel UX scope and acceptable edge-cases.
- **Engineering Owner:** defines enforceable API/validation constraints.
- **Data Curation Owner:** approves catalog discipline labels and `multi` exceptions.

## Sign-off workflow

1. Data curation proposes truth-table changes.
2. Engineering validates implementability and test coverage impact.
3. Product signs off on user-facing behavior changes.
4. Changes are versioned in docs and linked in implementation PRs.

---

## 6) Baseline Regression Freeze (Pre-Phase-1 test list)

Before Phase 1 implementation, capture current behavior fixtures for later before/after comparison:

1. Builder compatibility fixtures:
   - frame/fork/wheel diameter mismatch
   - freehub/cassette mismatch
   - brake mount mismatch
2. Drivetrain Lab fixtures (must remain broad):
   - road 2x setup
   - gravel 1x setup
   - MTB wide-range setup
3. Tire Pressure fixtures (must remain broad):
   - road narrow tire scenario
   - gravel mid-width scenario
   - MTB high-volume scenario

Deliverables for Phase 0 completion:

- fixture IDs documented in test plan file/issue tracker
- expected outputs captured from current mainline behavior
- owner assigned per fixture group

---

## 7) Exit Criteria to Start Phase 1

Phase 1 may begin only when:

1. This discovery document is approved by Product + Engineering + Data curation.
2. Discipline taxonomy contract in the master plan is accepted without open blockers.
3. Baseline regression fixture backlog is created and assigned.

