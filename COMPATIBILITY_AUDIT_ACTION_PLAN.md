# CrankSmith V3 - Compatibility Engine Audit & Action Plan

> **Document Version:** 1.0
> **Audit Date:** December 7, 2025
> **Auditor:** Claude Code
> **Scope:** Bike parts compatibility logic, validation engine, and build user flow

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: Critical Safety & Architecture Issues](#phase-1-critical-safety--architecture-issues)
4. [Phase 2: Logic & Validation Errors](#phase-2-logic--validation-errors)
5. [Phase 3: User Flow & Experience Issues](#phase-3-user-flow--experience-issues)
6. [Phase 4: Data Integrity & Type Safety](#phase-4-data-integrity--type-safety)
7. [Phase 5: Missing Validations](#phase-5-missing-validations)
8. [Implementation Timeline](#implementation-timeline)
9. [Testing Strategy](#testing-strategy)

---

## Executive Summary

This audit identified **15 significant issues** across the CrankSmith V3 compatibility system. Issues range from **safety-critical** (missing brake validation) to **architectural** (dual validator systems) to **user experience** (missing Fork in build sequence).

### Issue Severity Distribution

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 4 | Safety risks, architectural problems |
| **High** | 4 | Logic errors causing incorrect validation |
| **Medium** | 4 | User flow and experience issues |
| **Low** | 3 | Data integrity and type mismatches |

### Key Metrics

- **Validation Coverage:** ~60% of necessary checks implemented
- **Type Safety:** Low (runtime data doesn't match TypeScript interfaces)
- **Test Coverage:** Unknown (no test files found for validation logic)

---

## Architecture Overview

### Current System Structure

```
src/
├── engine/
│   └── Validator.ts          # OLD: Strongly-typed, class-based (UNUSED)
├── lib/
│   ├── validation.ts         # NEW: JSON-based, flexible (ACTIVE)
│   ├── normalization.ts      # Converts DB records to Component objects
│   └── types/
│       └── compatibility.ts  # Component, ValidationIssue interfaces
├── types/
│   └── components.ts         # Strongly-typed interfaces (UNUSED AT RUNTIME)
├── constants/
│   └── standards.ts          # Enums for axles, BBs, freehubs, etc.
├── store/
│   └── buildStore.ts         # Zustand store, calls Validator
└── components/builder/
    ├── PartSelector.tsx      # Main build flow UI
    ├── BuildDashboard.tsx    # Validation status display
    └── PartCard.tsx          # Individual part display
```

### Data Flow

```
Database (Prisma)
    ↓
API Route (/api/components)
    ↓
normalizeComponent() → Component object with specs/interfaces/attributes
    ↓
PartSelector.tsx → User selects part
    ↓
buildStore.setPart() → Updates state, triggers validateBuild()
    ↓
Validator.validateBuild() → Returns CompatibilityResult
    ↓
BuildDashboard.tsx → Displays errors/warnings
```

---

## Phase 1: Critical Safety & Architecture Issues

### Issue 1.1: Dual Validator Systems

**Severity:** Critical
**Impact:** Codebase confusion, maintenance burden, potential for bugs

#### Problem Description

Two completely separate validation systems exist:

| File | Approach | Status |
|------|----------|--------|
| `src/engine/Validator.ts` | Class-based, strongly-typed, uses enums | **UNUSED** |
| `src/lib/validation.ts` | Function-based, JSON/any types, flexible | **ACTIVE** |

The old validator (`engine/Validator.ts`) imports from `types/components.ts` and expects data like:
```typescript
interface Frame {
    rearAxle: AxleStandard;  // Enum: 'AXLE_R_12_142'
    bbShell: BBShellStandard; // Enum: 'BB_BSA_68'
}
```

But actual runtime data looks like:
```typescript
{
    specs: {
        rear_axle: "12x142mm",  // String, not enum
        bb_shell: "BSA 68mm"    // String, not enum
    }
}
```

#### Root Cause

Migration from strongly-typed system to flexible JSON-based system was incomplete. The old code was left in place but never removed.

#### Solution

**Option A: Remove Old Validator (Recommended)**

1. Delete `src/engine/Validator.ts`
2. Update any imports that reference it
3. Ensure all validation goes through `src/lib/validation.ts`

**Option B: Migrate to Strongly-Typed System**

1. Create adapter layer to convert JSON specs to typed interfaces
2. Use the more comprehensive `engine/Validator.ts` logic
3. Requires significant refactoring of data pipeline

#### Implementation Steps (Option A)

```bash
# Step 1: Find all imports of the old validator
grep -r "from.*engine/Validator" src/
grep -r "from '@/engine/Validator'" src/
```

**Files to modify:**

1. **Delete file:**
   - `src/engine/Validator.ts`

2. **Check and update imports in:**
   - Any file importing from `@/engine/Validator`
   - Ensure they use `@/lib/validation` instead

3. **Verify build:**
   ```bash
   npm run build
   ```

---

### Issue 1.2: Empty Brake Validation (SAFETY CRITICAL)

**Severity:** Critical
**Impact:** Users can create dangerous brake configurations

#### Problem Description

**Location:** `src/lib/validation.ts:308-311`

```typescript
function validateBrakes(build: any, issues: ValidationIssue[]) {
    // Shifter (Hydro/Cable) <-> Caliper (Hydro/Cable)
    // Frame Mount <-> Caliper Mount
}
```

The function is a **complete stub** with only comments. No actual validation occurs.

#### Missing Safety Checks

| Check | Risk if Missing |
|-------|-----------------|
| Brake fluid compatibility (DOT vs Mineral) | **Seal failure, brake loss** |
| Frame/fork mount ↔ caliper mount | Caliper won't physically mount |
| Rotor size ↔ frame/fork max | Rotor hits frame/fork |
| Hydraulic lever ↔ hydraulic caliper | System won't function |
| Mechanical lever ↔ mechanical caliper | System won't function |

#### Solution

Implement comprehensive brake validation:

```typescript
// src/lib/validation.ts

function validateBrakes(build: any, issues: ValidationIssue[]) {
    const { frame, fork, shifter } = build;
    const brakeCaliperFront = build.brakes?.calipers?.find(
        (c: any) => normalize(c.specs?.position || c.interfaces?.position) === 'front'
    );
    const brakeCaliperRear = build.brakes?.calipers?.find(
        (c: any) => normalize(c.specs?.position || c.interfaces?.position) === 'rear'
    );
    const rotorFront = build.brakes?.rotors?.find(
        (r: any) => normalize(r.specs?.position || r.interfaces?.position) === 'front'
    );
    const rotorRear = build.brakes?.rotors?.find(
        (r: any) => normalize(r.specs?.position || r.interfaces?.position) === 'rear'
    );

    // 1. BRAKE FLUID COMPATIBILITY (CRITICAL SAFETY CHECK)
    if (shifter && brakeCaliperFront) {
        const leverFluid = getFluidType(shifter);
        const caliperFluid = getFluidType(brakeCaliperFront);

        if (leverFluid && caliperFluid && leverFluid !== caliperFluid) {
            addIssue(
                issues,
                shifter.id,
                `SAFETY CRITICAL: Brake fluid mismatch! Lever uses ${leverFluid} but caliper uses ${caliperFluid}. Mixing fluids destroys seals and causes brake failure.`,
                'ERROR',
                brakeCaliperFront.id
            );
        }
    }

    // 2. ACTUATION TYPE COMPATIBILITY
    if (shifter && brakeCaliperFront) {
        const leverType = getActuationType(shifter); // 'hydraulic' | 'mechanical'
        const caliperType = getActuationType(brakeCaliperFront);

        if (leverType && caliperType && leverType !== caliperType) {
            addIssue(
                issues,
                shifter.id,
                `Brake actuation mismatch: ${leverType} lever cannot operate ${caliperType} caliper`,
                'ERROR',
                brakeCaliperFront.id
            );
        }
    }

    // 3. FRAME BRAKE MOUNT COMPATIBILITY (REAR)
    if (frame && brakeCaliperRear) {
        const frameMount = normalize(frame.specs?.brake_mount);
        const caliperMount = normalize(brakeCaliperRear.specs?.mount || brakeCaliperRear.specs?.mount_type);

        if (frameMount && caliperMount && !mountsCompatible(frameMount, caliperMount)) {
            addIssue(
                issues,
                brakeCaliperRear.id,
                `Rear caliper mount (${caliperMount}) incompatible with frame (${frameMount})`,
                'ERROR',
                frame.id
            );
        }
    }

    // 4. FORK BRAKE MOUNT COMPATIBILITY (FRONT)
    if (fork && brakeCaliperFront) {
        const forkMount = normalize(fork.specs?.brake_mount);
        const caliperMount = normalize(brakeCaliperFront.specs?.mount || brakeCaliperFront.specs?.mount_type);

        if (forkMount && caliperMount && !mountsCompatible(forkMount, caliperMount)) {
            addIssue(
                issues,
                brakeCaliperFront.id,
                `Front caliper mount (${caliperMount}) incompatible with fork (${forkMount})`,
                'ERROR',
                fork.id
            );
        }
    }

    // 5. ROTOR SIZE LIMITS
    if (fork && rotorFront) {
        const maxRotor = parseRotorSize(fork.specs?.max_rotor_size);
        const rotorSize = parseRotorSize(rotorFront.specs?.size || rotorFront.specs?.diameter);

        if (maxRotor && rotorSize && rotorSize > maxRotor) {
            addIssue(
                issues,
                rotorFront.id,
                `Front rotor (${rotorSize}mm) exceeds fork maximum (${maxRotor}mm)`,
                'ERROR',
                fork.id
            );
        }
    }

    if (frame && rotorRear) {
        const maxRotor = parseRotorSize(frame.specs?.max_rotor_size);
        const rotorSize = parseRotorSize(rotorRear.specs?.size || rotorRear.specs?.diameter);

        if (maxRotor && rotorSize && rotorSize > maxRotor) {
            addIssue(
                issues,
                rotorRear.id,
                `Rear rotor (${rotorSize}mm) exceeds frame maximum (${maxRotor}mm)`,
                'ERROR',
                frame.id
            );
        }
    }

    // 6. ROTOR MOUNT COMPATIBILITY
    if (rotorFront && build.wheels) {
        const frontWheel = build.wheels.find((w: any) =>
            normalize(w.specs?.position) === 'front' || normalize(w.specs?.position) === 'set'
        );
        if (frontWheel) {
            const wheelInterface = normalize(frontWheel.specs?.brake_interface);
            const rotorMount = normalize(rotorFront.specs?.mount);

            if (wheelInterface && rotorMount && !rotorMountCompatible(wheelInterface, rotorMount)) {
                addIssue(
                    issues,
                    rotorFront.id,
                    `Rotor mount (${rotorMount}) incompatible with wheel (${wheelInterface})`,
                    'ERROR',
                    frontWheel.id
                );
            }
        }
    }
}

// Helper functions to add:

function getFluidType(component: any): string | null {
    const fluid = component.specs?.brake_fluid ||
                  component.interfaces?.brake_fluid ||
                  component.attributes?.brake_fluid;
    if (!fluid) return null;
    const upper = String(fluid).toUpperCase();
    if (upper.includes('DOT')) return 'DOT';
    if (upper.includes('MINERAL')) return 'MINERAL';
    return upper;
}

function getActuationType(component: any): string | null {
    const type = component.specs?.actuation ||
                 component.interfaces?.actuation ||
                 component.attributes?.type ||
                 component.name;
    if (!type) return null;
    const upper = String(type).toUpperCase();
    if (upper.includes('HYDRAULIC') || upper.includes('HYDRO')) return 'hydraulic';
    if (upper.includes('MECHANICAL') || upper.includes('CABLE')) return 'mechanical';
    return null;
}

function mountsCompatible(frameMount: string, caliperMount: string): boolean {
    // Normalize mount names
    const normalize = (m: string) => m.toLowerCase().replace(/[^a-z]/g, '');
    const fm = normalize(frameMount);
    const cm = normalize(caliperMount);

    // Direct match
    if (fm === cm) return true;

    // Flat mount variations
    if ((fm.includes('flat') || fm.includes('flatmount')) &&
        (cm.includes('flat') || cm.includes('flatmount'))) return true;

    // Post mount variations
    if ((fm.includes('post') || fm.includes('postmount')) &&
        (cm.includes('post') || cm.includes('postmount'))) return true;

    // IS mount variations
    if ((fm.includes('is') || fm.includes('international')) &&
        (cm.includes('is') || cm.includes('international'))) return true;

    return false;
}

function parseRotorSize(value: any): number | null {
    if (!value) return null;
    const num = parseInt(String(value).replace(/[^0-9]/g, ''));
    return isNaN(num) ? null : num;
}

function rotorMountCompatible(wheelInterface: string, rotorMount: string): boolean {
    const wi = wheelInterface.toLowerCase();
    const rm = rotorMount.toLowerCase();

    // Centerlock wheel needs centerlock rotor
    if (wi.includes('centerlock') || wi.includes('centrelock')) {
        return rm.includes('centerlock') || rm.includes('centrelock');
    }

    // 6-bolt wheel needs 6-bolt rotor
    if (wi.includes('6bolt') || wi.includes('6-bolt') || wi.includes('sixbolt')) {
        return rm.includes('6bolt') || rm.includes('6-bolt') || rm.includes('sixbolt');
    }

    return true; // Unknown, allow
}
```

#### Implementation Steps

1. Add helper functions to `src/lib/validation.ts`
2. Implement the `validateBrakes` function body
3. Ensure it's called in `Validator.validateBuild()` (uncomment line 320)
4. Add test cases for each safety check

---

### Issue 1.3: Fork Missing from Build Sequence

**Severity:** Critical
**Impact:** Users cannot select a fork, breaking complete build flow

#### Problem Description

**Location:** `src/components/builder/PartSelector.tsx:24-38`

```typescript
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'Crankset', label: 'Crankset', icon: Settings, description: 'Your power input' },
    // ... Fork is COMPLETELY MISSING
];
```

The store (`buildStore.ts`) has a `Fork: null` slot, validation expects a fork, but users have no way to select one.

#### Solution

Add Fork to the build sequence immediately after Frame:

```typescript
// src/components/builder/PartSelector.tsx

const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Fork', label: 'Fork', icon: GitFork, description: 'Steering and suspension' },  // ADD THIS
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'Crankset', label: 'Crankset', icon: Settings, description: 'Your power input' },
    { type: 'BottomBracket', label: 'BB', icon: Disc, description: 'Matches frame & crank' },
    { type: 'Cassette', label: 'Cassette', icon: Cog, description: 'Gear range selection' },
    { type: 'RearDerailleur', label: 'Derailleur', icon: Layers, description: 'Shifting precision' },
    { type: 'Shifter', label: 'Shifter', icon: Gauge, description: 'Control at your fingertips' },
    { type: 'BrakeCaliper', label: 'Brakes', icon: Disc, description: 'Stopping power' },
    { type: 'BrakeRotor', label: 'Rotors', icon: Disc, description: 'Brake rotors' },
    { type: 'Stem', label: 'Stem', icon: Settings, description: 'Cockpit fit' },
    { type: 'Handlebar', label: 'Bars', icon: Settings, description: 'Control interface' },
    { type: 'Seatpost', label: 'Seatpost', icon: Settings, description: 'Seating' },
];
```

#### Additional Changes Required

1. **Add import for GitFork icon:**
   ```typescript
   import { GitFork } from 'lucide-react';  // Or use appropriate icon
   ```

2. **Add Fork handling in `handleSelectPart`:**
   ```typescript
   // In handleSelectPart function, add case for Fork
   } else if (activeType === 'Fork') {
       setPart('Fork', component);
   } else if (activeType === 'Tire') {
   ```

3. **Add Fork constraints display in `getActiveConstraints`:**
   ```typescript
   if (activeType === 'Fork' && parts.Frame) {
       const headset = parts.Frame.specs?.headset || parts.Frame.attributes?.headset;
       if (headset) constraints.push(`Headset: ${headset}`);

       const wheelSize = parts.Frame.specs?.wheel_size || parts.Frame.wheelSize;
       if (wheelSize) constraints.push(`Wheel Size: ${wheelSize}`);
   }
   ```

4. **Add Fork incompatibility reasons in `getIncompatibilityReason`:**
   ```typescript
   // Fork steerer mismatch
   if (activeType === 'Fork' && parts.Frame) {
       const frameHeadset = (parts.Frame.specs?.headset || '').toUpperCase();
       const forkSteerer = ((component as any).specs?.steerer_tube || '').toUpperCase();

       // Tapered frame needs tapered fork
       if (frameHeadset.includes('IS42') || frameHeadset.includes('IS52') || frameHeadset.includes('ZS44/ZS56')) {
           if (forkSteerer.includes('STRAIGHT') && !forkSteerer.includes('TAPERED')) {
               return `Frame has tapered headset, fork has straight steerer`;
           }
       }
   }
   ```

---

### Issue 1.4: Missing Chain Validation

**Severity:** Critical
**Impact:** Users can select incompatible chains

#### Problem Description

Chain components exist in the type system but have no validation:
- No speed matching (11s chain on 12s drivetrain)
- No chain type compatibility (SRAM Flattop requires Flattop chainring)
- No brand ecosystem checks

#### Solution

Add chain validation to `validateDrivetrain`:

```typescript
// Add to validateDrivetrain function in src/lib/validation.ts

// 5. Chain Speed Match
if (chain) {
    const chainSpeeds = Number(chain.specs?.speeds || chain.attributes?.speeds);
    const cassetteSpeeds = cassette ? Number(cassette.specs?.speeds || cassette.attributes?.speeds) : null;

    if (chainSpeeds && cassetteSpeeds && chainSpeeds !== cassetteSpeeds) {
        addIssue(
            issues,
            chain.id,
            `Chain speed (${chainSpeeds}s) does not match cassette (${cassetteSpeeds}s)`,
            'ERROR',
            cassette?.id
        );
    }
}

// 6. Chain Type Compatibility (SRAM Flattop, etc.)
if (chain && crankset) {
    const chainType = normalize(chain.specs?.chain_type || chain.interfaces?.chain_type);
    const crankChainType = normalize(crankset.specs?.chain_type || crankset.interfaces?.chain_type);

    // SRAM Flattop chains require Flattop-compatible chainrings
    if (chainType.includes('flattop')) {
        if (crankChainType && !crankChainType.includes('flattop')) {
            addIssue(
                issues,
                chain.id,
                `Flattop chain requires Flattop-compatible chainring`,
                'ERROR',
                crankset.id
            );
        }
    }

    // Shimano Hyperglide+ optimization (warning, not error)
    if (chainType.includes('hyperglide') && chainType.includes('plus')) {
        const crankBrand = (crankset.name || '').toUpperCase();
        if (!crankBrand.includes('SHIMANO')) {
            addIssue(
                issues,
                chain.id,
                `Hyperglide+ chain optimized for Shimano chainrings`,
                'WARNING',
                crankset.id
            );
        }
    }
}
```

---

## Phase 2: Logic & Validation Errors

### Issue 2.1: Tire-to-Wheel Matching Uses Wrong Wheel

**Severity:** High
**Impact:** Tires validated against incorrect wheel

#### Problem Description

**Location:** `src/lib/validation.ts:166-170`

```typescript
tires.forEach((tire: any) => {
    const relevantWheel = wheels[0];  // BUG: Always uses first wheel!
    if (relevantWheel) {
        if (!isCompatibleValue(tire.specs?.diameter, relevantWheel.specs?.diameter)) {
```

This always validates tires against `wheels[0]`, regardless of which tire position.

#### Solution

Match tires to their corresponding wheels by position:

```typescript
// src/lib/validation.ts - Replace tire validation block

// 4. Tires - Match to corresponding wheels
tires.forEach((tire: any, index: number) => {
    // Determine tire position
    const tirePosition = normalize(tire.specs?.position || tire.interfaces?.position);

    // Find matching wheel
    let matchingWheel = null;

    if (tirePosition === 'front') {
        matchingWheel = wheels.find((w: any) =>
            normalize(w.specs?.position) === 'front' || normalize(w.specs?.position) === 'set'
        );
    } else if (tirePosition === 'rear') {
        matchingWheel = wheels.find((w: any) =>
            normalize(w.specs?.position) === 'rear' || normalize(w.specs?.position) === 'set'
        );
    } else {
        // No position specified, try to match by index or use first available
        matchingWheel = wheels[index] || wheels[0];
    }

    if (matchingWheel) {
        // Diameter check
        const tireDiameter = normalize(tire.specs?.diameter);
        const wheelDiameter = normalize(matchingWheel.specs?.diameter);

        if (tireDiameter && wheelDiameter && !isDiameterCompatible(tireDiameter, wheelDiameter)) {
            addIssue(
                issues,
                tire.id,
                `Tire diameter (${tire.specs?.diameter}) does not match wheel (${matchingWheel.specs?.diameter})`,
                'ERROR',
                matchingWheel.id
            );
        }

        // Internal rim width check (for tire width compatibility)
        const tireWidth = parseFloat(String(tire.specs?.width || '0').replace(/[^0-9.]/g, ''));
        const rimWidth = parseFloat(String(matchingWheel.specs?.internal_rim_width || '0').replace(/[^0-9.]/g, ''));

        if (tireWidth && rimWidth) {
            // General rule: tire width should be 1.4x to 2.4x rim width
            const minTire = rimWidth * 1.4;
            const maxTire = rimWidth * 2.4;

            if (tireWidth < minTire) {
                addIssue(
                    issues,
                    tire.id,
                    `Tire too narrow (${tireWidth}mm) for rim width (${rimWidth}mm internal). Min recommended: ${Math.round(minTire)}mm`,
                    'WARNING',
                    matchingWheel.id
                );
            } else if (tireWidth > maxTire) {
                addIssue(
                    issues,
                    tire.id,
                    `Tire too wide (${tireWidth}mm) for rim width (${rimWidth}mm internal). Max recommended: ${Math.round(maxTire)}mm`,
                    'WARNING',
                    matchingWheel.id
                );
            }
        }
    }

    // Frame clearance check (applies to all tires)
    if (frame && frame.specs?.max_tire_width) {
        const maxMm = parseFloat(String(frame.specs.max_tire_width).replace(/[^0-9.]/g, ''));
        const tireMm = parseFloat(String(tire.specs?.width || '0').replace(/[^0-9.]/g, ''));
        if (maxMm && tireMm && tireMm > maxMm) {
            addIssue(
                issues,
                tire.id,
                `Tire width (${tireMm}mm) exceeds frame clearance (${maxMm}mm)`,
                'ERROR',
                frame.id
            );
        }
    }
});

// Helper function to add:
function isDiameterCompatible(d1: string, d2: string): boolean {
    // 700c and 29" are the same (622mm BSD)
    const normalize700c29 = (d: string) => {
        const lower = d.toLowerCase();
        if (lower.includes('700') || lower === '29' || lower.includes('29"') || lower.includes('29er')) {
            return '622';
        }
        if (lower.includes('650') || lower === '27.5' || lower.includes('27.5"')) {
            return '584';
        }
        return lower;
    };

    return normalize700c29(d1) === normalize700c29(d2);
}
```

---

### Issue 2.2: Wheel Position Case Sensitivity Mismatch

**Severity:** High
**Impact:** Front/rear wheel detection fails

#### Problem Description

**PartSelector.tsx sets position as UPPERCASE:**
```typescript
interfaces: { ...component.interfaces, position: 'FRONT' }
interfaces: { ...component.interfaces, position: 'REAR' }
```

**validation.ts looks for Title Case:**
```typescript
const frontWheel = wheels.find((w: any) => w.specs?.position === 'Front' || w.specs?.position === 'Set');
const rearWheel = wheels.find((w: any) => w.specs?.position === 'Rear' || w.specs?.position === 'Set');
```

#### Solution

Normalize all position checks to use lowercase comparison:

```typescript
// src/lib/validation.ts - Update all wheel position checks

// BEFORE:
const frontWheel = wheels.find((w: any) => w.specs?.position === 'Front' || w.specs?.position === 'Set');

// AFTER:
const frontWheel = wheels.find((w: any) => {
    const pos = normalize(w.specs?.position || w.interfaces?.position);
    return pos === 'front' || pos === 'set';
});

const rearWheel = wheels.find((w: any) => {
    const pos = normalize(w.specs?.position || w.interfaces?.position);
    return pos === 'rear' || pos === 'set';
});
```

**Apply this pattern to ALL position checks in:**
- `validateRollingChassis` (lines 140, 157)
- `validateDrivetrain` (lines 275-278)
- `validateBrakes` (when implemented)

---

### Issue 2.3: Freehub Compatibility Logic Incomplete

**Severity:** High
**Impact:** May allow incompatible cassette-wheel pairings

#### Problem Description

**Location:** `src/lib/validation.ts:105-113`

Current logic only handles basic HG variations but misses:
- Shimano 12-speed road HG (different spline depth than HG MTB)
- SRAM XD (10-tooth capable) vs XDR (road, not 10T capable)
- Campagnolo N3W backwards compatibility

#### Solution

Implement comprehensive freehub compatibility matrix:

```typescript
// src/lib/validation.ts - Replace freehubsCompatible function

function freehubsCompatible(wheelStd: string, cassetteStd: string): boolean {
    const w = wheelStd.toUpperCase();
    const c = cassetteStd.toUpperCase();

    // Exact match
    if (w === c) return true;

    // Compatibility matrix
    const compatibilityMatrix: Record<string, string[]> = {
        // Wheel freehub : Compatible cassette types
        'HG': ['HG', 'HG11', 'SHIMANOHG', 'HYPERGLIDE'],
        'HG11': ['HG', 'HG11', 'SHIMANOHG', 'HYPERGLIDE'],
        'SHIMANOHG': ['HG', 'HG11', 'SHIMANOHG', 'HYPERGLIDE'],
        'MICROSPLINE': ['MICROSPLINE', 'MS', 'SHIMANO12S'],
        'MS': ['MICROSPLINE', 'MS', 'SHIMANO12S'],
        'XD': ['XD', 'SRAMXD'],
        'XDR': ['XDR', 'SRAMXDR'],
        'N3W': ['N3W', 'CAMPAGNOLON3W', 'CAMPYN3W'],
        // Note: N3W is NOT backwards compatible with older Campy
    };

    // Check if wheel supports cassette type
    const compatible = compatibilityMatrix[w];
    if (compatible) {
        return compatible.some(type => c.includes(type) || type.includes(c));
    }

    // Fallback: check for partial string matches
    // HG variations
    if ((w.includes('HG') || w.includes('HYPERGLIDE')) &&
        (c.includes('HG') || c.includes('HYPERGLIDE'))) {
        // Warning: Shimano 12s road HG has deeper splines
        // This is a simplification - ideally check specific models
        return true;
    }

    return false;
}

// Add separate warning for edge cases
function checkFreehubWarnings(wheelStd: string, cassetteStd: string, cassetteSpeeds: number): string | null {
    const w = wheelStd.toUpperCase();
    const c = cassetteStd.toUpperCase();

    // Shimano 12s road cassette on standard HG freehub
    if (c.includes('HG') && cassetteSpeeds === 12) {
        if (!w.includes('MICROSPLINE') && !w.includes('MS')) {
            return 'Shimano 12-speed road cassettes use deeper HG splines. Verify wheel compatibility.';
        }
    }

    // SRAM XD vs XDR
    if (w.includes('XDR') && c.includes('XD') && !c.includes('XDR')) {
        return 'XD cassettes may have 10T small cog not compatible with XDR freehub';
    }

    return null;
}
```

---

### Issue 2.4: Protocol Matching Too Strict/Inconsistent

**Severity:** High
**Impact:** Valid component combinations may be rejected

#### Problem Description

The `inferProtocolFromName` function creates speed-specific protocols like `'Shimano_12s_Mech'`, but this can cause mismatches when:
- One component infers `'Shimano_Mech'` (generic)
- Another infers `'Shimano_12s_Mech'` (specific)

#### Solution

Implement hierarchical protocol matching:

```typescript
// src/lib/validation.ts - Add protocol compatibility helper

function protocolsCompatible(proto1: string[], proto2: string[]): boolean {
    if (!proto1?.length || !proto2?.length) return true; // Can't verify, allow

    // Define protocol hierarchies (specific -> general)
    const hierarchies: Record<string, string[]> = {
        'Shimano_12s_Mech': ['Shimano_12s_Mech', 'Shimano_Mech'],
        'Shimano_11s_Mech': ['Shimano_11s_Mech', 'Shimano_Mech'],
        'Shimano_10s_Mech': ['Shimano_10s_Mech', 'Shimano_Mech'],
        'Shimano_Mech': ['Shimano_Mech', 'Shimano_12s_Mech', 'Shimano_11s_Mech', 'Shimano_10s_Mech'],
        'Shimano_Di2': ['Shimano_Di2'],
        'SRAM_AXS': ['SRAM_AXS'],
        'SRAM_Eagle_Mech': ['SRAM_Eagle_Mech', 'SRAM_MTB_Mech'],
        'SRAM_Road_Mech': ['SRAM_Road_Mech'],
        'Campagnolo_Mech': ['Campagnolo_Mech'],
        'Campagnolo_Electronic': ['Campagnolo_Electronic'],
        'L-Twoo_Mech': ['L-Twoo_Mech'],
        'L-Twoo_Wireless': ['L-Twoo_Wireless'],
        'Sensah_Mech': ['Sensah_Mech'],
    };

    // Expand each protocol to include its compatible variants
    const expand = (protocols: string[]): Set<string> => {
        const expanded = new Set<string>();
        protocols.forEach(p => {
            expanded.add(normalize(p));
            const variants = hierarchies[p];
            if (variants) {
                variants.forEach(v => expanded.add(normalize(v)));
            }
        });
        return expanded;
    };

    const expanded1 = expand(proto1);
    const expanded2 = expand(proto2);

    // Check for any overlap
    for (const p of expanded1) {
        if (expanded2.has(p)) return true;
    }

    return false;
}

// Update validateDrivetrain to use this:
if (shifterProtocol?.length && rdProtocol?.length) {
    if (!protocolsCompatible(shifterProtocol, rdProtocol)) {
        addIssue(issues, shifter.id,
            `Shifter protocol (${shifterProtocol.join(', ')}) incompatible with RD (${rdProtocol.join(', ')})`,
            'ERROR', rearDerailleur.id);
    }
}
```

---

## Phase 3: User Flow & Experience Issues

### Issue 3.1: Generic Error Messages Without Component Identification

**Severity:** Medium
**Impact:** Users can't identify which specific component caused the error

#### Problem Description

**Location:** `src/lib/validation.ts:244`

```typescript
addIssue(issues, 'drivetrain', `Drivetrain speed mismatch...`);
```

The `componentId` is `'drivetrain'` instead of a specific component ID.

#### Solution

Identify the specific mismatched component:

```typescript
// Find which component has the different speed
const speedCounts: Record<number, string[]> = {};
components.forEach(c => {
    const speed = Number(c.specs?.speeds || c.specs?.speed || c.attributes?.speeds);
    if (speed) {
        if (!speedCounts[speed]) speedCounts[speed] = [];
        speedCounts[speed].push(c.id);
    }
});

// Find the minority (likely the wrong one)
const sortedByCount = Object.entries(speedCounts).sort((a, b) => b[1].length - a[1].length);
if (sortedByCount.length > 1) {
    const [majoritySpeed, majorityIds] = sortedByCount[0];
    const [minoritySpeed, minorityIds] = sortedByCount[1];

    minorityIds.forEach(id => {
        const comp = components.find(c => c.id === id);
        addIssue(
            issues,
            id,
            `${comp?.type || 'Component'} is ${minoritySpeed}-speed but rest of drivetrain is ${majoritySpeed}-speed`,
            'ERROR',
            majorityIds[0]
        );
    });
}
```

---

### Issue 3.2: Tire Filtering Width Comparison Bug

**Severity:** Medium
**Impact:** May show/hide wrong tires

#### Problem Description

**Location:** `src/components/builder/PartSelector.tsx:559-563`

```typescript
if (frameCategory === 'ROAD') {
    filteredComponents = filteredComponents.filter(c => {
        const width = (c as any).widthMM || (c as any).width || 0;
        const type = (c as any).interfaces?.tire_type;
        return type === 'ROAD' || width <= 35;  // width might be "35mm" string!
    });
```

If `width` is `"35mm"` (string), the comparison `width <= 35` will fail.

#### Solution

Parse width properly:

```typescript
// src/components/builder/PartSelector.tsx - Fix tire filtering

if (activeType === 'Tire' && parts.Frame) {
    const frameCategory = ((parts.Frame as any).category ||
                           (parts.Frame as any).attributes?.category || '').toUpperCase();

    // Helper to parse width
    const parseWidth = (w: any): number => {
        if (typeof w === 'number') return w;
        if (typeof w === 'string') {
            const parsed = parseFloat(w.replace(/[^0-9.]/g, ''));
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    if (frameCategory === 'ROAD') {
        filteredComponents = filteredComponents.filter(c => {
            const width = parseWidth(
                (c as any).widthMM ||
                (c as any).specs?.width ||
                (c as any).attributes?.width ||
                0
            );
            const type = (c as any).interfaces?.tire_type || (c as any).specs?.tire_type;
            return type === 'ROAD' || width <= 35;
        });
    } else if (frameCategory === 'GRAVEL') {
        filteredComponents = filteredComponents.filter(c => {
            const width = parseWidth(
                (c as any).widthMM ||
                (c as any).specs?.width ||
                (c as any).attributes?.width ||
                0
            );
            const type = (c as any).interfaces?.tire_type || (c as any).specs?.tire_type;
            // Gravel: 28-50mm typical
            return type === 'GRAVEL' || type === 'ROAD' || (width >= 28 && width <= 55);
        });
    } else if (frameCategory === 'MTB') {
        filteredComponents = filteredComponents.filter(c => {
            const type = (c as any).interfaces?.tire_type || (c as any).specs?.tire_type;
            return type === 'MTB' || type === 'XC' || type === 'TRAIL' || type === 'ENDURO' || type === 'DH';
        });
    }
}
```

---

### Issue 3.3: BB Shell Display Field Priority Mismatch

**Severity:** Medium
**Impact:** BB specs may display inconsistently

#### Problem Description

**PartCard.tsx:**
```typescript
const shell = get('frame_shell', 'frame_interface', 'bb_shell', 'shell');
```

**normalization.ts:**
```typescript
specs.bb_shell = raw.frame_shell || raw.frame_interface;
```

The priority order is different.

#### Solution

Standardize field priority across all files:

```typescript
// Define standard field priority in a shared location
// src/lib/fieldMappings.ts (new file)

export const FIELD_PRIORITIES = {
    bbShell: ['bb_shell', 'frame_shell', 'frame_interface', 'shell', 'type'],
    bbSpindle: ['spindle_interface', 'crank_spindle', 'crank_interface', 'spindle_type'],
    freehub: ['freehub_body', 'freehub', 'freehub_mount', 'freehub_standard'],
    axle: ['rear_axle', 'front_axle', 'axle', 'axle_standard'],
    // ... etc
};

// Use consistently in both PartCard.tsx and normalization.ts
```

---

### Issue 3.4: Completion Modal Shows Before All Parts Selected

**Severity:** Low
**Impact:** Premature completion indication

#### Problem Description

**Location:** `src/components/builder/PartSelector.tsx:379-383`

```typescript
useEffect(() => {
    if (currentStep === BUILD_SEQUENCE.length - 1 && parts.Seatpost) {
        setTimeout(() => setShowComplete(true), 500);
    }
}, [currentStep, parts.Seatpost]);
```

Only checks for Seatpost, not all required parts.

#### Solution

Check for essential parts before showing completion:

```typescript
useEffect(() => {
    const essentialParts = [
        parts.Frame,
        parts.Fork,  // Once Fork is added to sequence
        parts.WheelFront || parts.WheelRear,
        parts.Crankset,
        parts.Cassette,
        parts.RearDerailleur,
        parts.Shifter,
    ];

    const hasEssentials = essentialParts.every(Boolean);
    const isLastStep = currentStep === BUILD_SEQUENCE.length - 1;
    const hasLastPart = parts.Seatpost;

    if (isLastStep && hasLastPart && hasEssentials) {
        setTimeout(() => setShowComplete(true), 500);
    }
}, [currentStep, parts]);
```

---

## Phase 4: Data Integrity & Type Safety

### Issue 4.1: TypeScript Types Don't Match Runtime Data

**Severity:** Medium
**Impact:** Type safety is illusory, bugs hidden at compile time

#### Problem Description

**types/components.ts defines:**
```typescript
interface Frame {
    rearAxle: AxleStandard;  // Expects enum like 'AXLE_R_12_142'
    bbShell: BBShellStandard;
}
```

**Runtime data has:**
```typescript
{
    specs: {
        rear_axle: "12x142mm",  // String
        bb_shell: "BSA 68"      // String
    }
}
```

#### Solution

Create two type systems:

```typescript
// src/lib/types/compatibility.ts - Add strict DB types

// What comes from the database (flexible)
export interface DBComponent {
    id: string;
    type: string;
    name: string;
    interfaces: string | null;  // JSON string
    attributes: string | null;  // JSON string
    createdAt: Date;
    updatedAt: Date;
}

// Normalized component for app use
export interface NormalizedComponent {
    id: string;
    type: ComponentType;
    name: string;
    brand: string;
    model: string;
    price: number;
    weightGrams: number;
    image: string;
    specs: ComponentSpecs;
    compatibility_tags: CompatibilityTags;
    // Legacy JSON blobs for backwards compat
    interfaces?: Record<string, any>;
    attributes?: Record<string, any>;
}

// Discriminated union for type-safe component handling
export type ComponentType =
    | 'Frame' | 'Fork' | 'Wheel' | 'Tire'
    | 'BottomBracket' | 'Crankset' | 'Cassette'
    | 'RearDerailleur' | 'Shifter' | 'Chain'
    | 'BrakeCaliper' | 'BrakeRotor'
    | 'Stem' | 'Handlebar' | 'Seatpost';
```

---

### Issue 4.2: Axle Standard Format Inconsistency

**Severity:** Medium
**Impact:** Validation may fail on format differences

#### Problem Description

Axle standards appear in multiple formats:
- `"12x142mm"` (with mm)
- `"12x142"` (without mm)
- `'AXLE_R_12_142'` (enum)

#### Solution

Create axle normalization function:

```typescript
// src/lib/validation.ts - Add axle normalization

function normalizeAxle(axle: string | undefined): string {
    if (!axle) return '';

    // Convert enum format to standard
    // 'AXLE_R_12_142' -> '12x142'
    // 'AXLE_F_12_100' -> '12x100'
    if (axle.startsWith('AXLE_')) {
        const match = axle.match(/(\d+)_(\d+)$/);
        if (match) {
            return `${match[1]}x${match[2]}`;
        }
    }

    // Remove 'mm' suffix and spaces
    return axle.toLowerCase()
        .replace(/mm/g, '')
        .replace(/\s/g, '')
        .trim();
}

// Update isCompatibleValue or create new function
function axlesCompatible(axle1: string | undefined, axle2: string | undefined): boolean {
    if (!axle1 || !axle2) return false;
    return normalizeAxle(axle1) === normalizeAxle(axle2);
}
```

---

### Issue 4.3: Wheelset Weight Naively Halved

**Severity:** Low
**Impact:** Build weight slightly inaccurate

#### Problem Description

**Location:** `src/components/builder/PartSelector.tsx:299`

```typescript
const halfWeight = component.weightGrams ? Math.round(component.weightGrams / 2) : 0;
```

Front and rear wheels are different weights (rear has freehub, more spokes).

#### Solution

Use weighted split:

```typescript
// Typical wheel weight distribution: Front ~45%, Rear ~55%
const frontWeight = component.weightGrams ? Math.round(component.weightGrams * 0.45) : 0;
const rearWeight = component.weightGrams ? Math.round(component.weightGrams * 0.55) : 0;

const frontWheel = {
    ...component,
    id: `${component.id}-F`,
    name: `${component.name} (Front)`,
    weightGrams: frontWeight,
    // ...
};

const rearWheel = {
    ...component,
    id: `${component.id}-R`,
    name: `${component.name} (Rear)`,
    weightGrams: rearWeight,
    // ...
};
```

---

## Phase 5: Missing Validations

### Issue 5.1: Cockpit Validation Not Implemented

**Severity:** Medium
**Impact:** Incompatible cockpit components allowed

#### Missing Checks

| Check | Description |
|-------|-------------|
| Stem clamp ↔ Handlebar clamp | 31.8mm vs 35mm mismatch |
| Stem steerer ↔ Fork steerer | 1-1/8" vs 1-1/4" |
| Frame seatpost ↔ Seatpost diameter | 27.2mm vs 31.6mm |

#### Solution

Implement cockpit validation:

```typescript
// src/lib/validation.ts - Add cockpit validation

function validateCockpit(build: any, issues: ValidationIssue[]) {
    const { frame, fork, cockpit } = build;
    const stem = cockpit?.stem;
    const handlebar = cockpit?.handlebar;
    const seatpost = cockpit?.seatpost;

    // 1. Stem <-> Handlebar clamp diameter
    if (stem && handlebar) {
        const stemClamp = parseFloat(String(
            stem.specs?.clamp_dia || stem.specs?.bar_clamp || stem.attributes?.clamp || ''
        ).replace(/[^0-9.]/g, ''));

        const barClamp = parseFloat(String(
            handlebar.specs?.clamp_dia || handlebar.specs?.clamp || handlebar.attributes?.clamp || ''
        ).replace(/[^0-9.]/g, ''));

        if (stemClamp && barClamp && Math.abs(stemClamp - barClamp) > 0.5) {
            addIssue(
                issues,
                handlebar.id,
                `Handlebar clamp (${barClamp}mm) does not match stem (${stemClamp}mm)`,
                'ERROR',
                stem.id
            );
        }
    }

    // 2. Frame <-> Seatpost diameter
    if (frame && seatpost) {
        const frameSeatpost = parseFloat(String(
            frame.specs?.seatpost_diameter || frame.attributes?.seatpost_dia || ''
        ).replace(/[^0-9.]/g, ''));

        const postDiameter = parseFloat(String(
            seatpost.specs?.diameter || seatpost.attributes?.diameter || ''
        ).replace(/[^0-9.]/g, ''));

        if (frameSeatpost && postDiameter && Math.abs(frameSeatpost - postDiameter) > 0.2) {
            addIssue(
                issues,
                seatpost.id,
                `Seatpost diameter (${postDiameter}mm) does not match frame (${frameSeatpost}mm)`,
                'ERROR',
                frame.id
            );
        }
    }

    // 3. Stem steerer <-> Fork steerer (if data available)
    if (stem && fork) {
        const stemSteerer = normalize(stem.specs?.steerer_clamp || stem.attributes?.steerer);
        const forkSteerer = normalize(fork.specs?.steerer_tube);

        if (stemSteerer && forkSteerer) {
            // Most stems are 1-1/8" (28.6mm), some are 1-1/4" (31.8mm)
            // Check for obvious mismatches
            const stemIs118 = stemSteerer.includes('28.6') || stemSteerer.includes('118') || stemSteerer.includes('1 1/8');
            const stemIs114 = stemSteerer.includes('31.8') || stemSteerer.includes('114') || stemSteerer.includes('1 1/4');
            const forkIs118 = forkSteerer.includes('118') || forkSteerer.includes('1 1/8');
            const forkIsTapered = forkSteerer.includes('taper') || forkSteerer.includes('1.5');

            // 1-1/4" stem won't fit 1-1/8" fork
            if (stemIs114 && forkIs118 && !forkIsTapered) {
                addIssue(
                    issues,
                    stem.id,
                    `Stem steerer clamp (1-1/4") too large for fork (1-1/8")`,
                    'ERROR',
                    fork.id
                );
            }
        }
    }
}
```

#### Update Main Validator

```typescript
// In Validator.validateBuild(), add call to cockpit validation:

export const Validator = {
    validateBuild(buildData: any): CompatibilityResult {
        const issues: ValidationIssue[] = [];

        validateRollingChassis(buildData, issues);
        validateEngineRoom(buildData, issues);
        validateDrivetrain(buildData, issues);
        validateBrakes(buildData, issues);  // Uncomment/implement
        validateCockpit(buildData, issues);  // Add this

        return {
            compatible: issues.filter(i => i.severity === 'ERROR').length === 0,
            issues
        };
    }
};
```

---

### Issue 5.2: Chainline Validation Missing

**Severity:** Medium
**Impact:** Poor shifting, chain rub possible

#### Solution

Port chainline validation from old Validator:

```typescript
// src/lib/validation.ts - Add chainline validation to validateEngineRoom

function validateChainline(build: any, issues: ValidationIssue[]) {
    const { frame, crankset } = build;

    if (!frame || !crankset) return;

    const frameType = normalize(frame.specs?.category || frame.attributes?.category);
    const rearAxle = normalize(frame.specs?.rear_axle);
    const chainline = parseFloat(String(
        crankset.specs?.chainline || crankset.attributes?.chainline || ''
    ).replace(/[^0-9.]/g, ''));

    if (!chainline) return; // Can't validate without chainline data

    // Define expected chainline ranges
    let minCL = 0;
    let maxCL = 0;
    let axleType = '';

    if (frameType === 'road' || frameType === 'gravel') {
        if (rearAxle.includes('142') || rearAxle.includes('135')) {
            minCL = 43;
            maxCL = 47.5;
            axleType = 'standard road/gravel';
        }
    } else if (frameType === 'mtb') {
        if (rearAxle.includes('142') || rearAxle.includes('135')) {
            minCL = 48;
            maxCL = 50;
            axleType = 'non-Boost MTB';
        } else if (rearAxle.includes('148')) {
            minCL = 51;
            maxCL = 53;
            axleType = 'Boost';
        } else if (rearAxle.includes('157')) {
            minCL = 55;
            maxCL = 57;
            axleType = 'Super Boost';
        }
    }

    if (minCL > 0 && maxCL > 0) {
        if (chainline < minCL) {
            addIssue(
                issues,
                crankset.id,
                `Chainline (${chainline}mm) too narrow for ${axleType} frame (${minCL}-${maxCL}mm expected). Risk of chainstay rub.`,
                'WARNING',
                frame.id
            );
        } else if (chainline > maxCL) {
            addIssue(
                issues,
                crankset.id,
                `Chainline (${chainline}mm) too wide for ${axleType} frame (${minCL}-${maxCL}mm expected). May cause poor shifting.`,
                'WARNING',
                frame.id
            );
        }
    }
}
```

---

## Implementation Timeline

### Recommended Phasing

| Phase | Priority | Issues | Effort |
|-------|----------|--------|--------|
| **Phase 1** | Critical | 1.1, 1.2, 1.3, 1.4 | High |
| **Phase 2** | High | 2.1, 2.2, 2.3, 2.4 | Medium |
| **Phase 3** | Medium | 3.1, 3.2, 3.3, 3.4 | Low-Medium |
| **Phase 4** | Medium | 4.1, 4.2, 4.3 | Medium |
| **Phase 5** | Medium | 5.1, 5.2 | Medium |

### Implementation Order

1. **Week 1: Critical Safety**
   - [ ] Implement brake validation (1.2)
   - [ ] Add Fork to build sequence (1.3)
   - [ ] Add chain validation (1.4)

2. **Week 2: Logic Fixes**
   - [ ] Fix wheel position case sensitivity (2.2)
   - [ ] Fix tire-to-wheel matching (2.1)
   - [ ] Improve freehub compatibility (2.3)
   - [ ] Fix protocol matching (2.4)

3. **Week 3: UX & Data**
   - [ ] Improve error messages (3.1)
   - [ ] Fix tire filtering (3.2)
   - [ ] Standardize field mappings (3.3)
   - [ ] Fix completion detection (3.4)

4. **Week 4: Polish**
   - [ ] Remove old Validator (1.1)
   - [ ] Normalize axle formats (4.2)
   - [ ] Add cockpit validation (5.1)
   - [ ] Add chainline validation (5.2)

---

## Testing Strategy

### Unit Tests Needed

```typescript
// src/lib/validation.test.ts

describe('Brake Validation', () => {
    test('detects DOT vs mineral oil mismatch', () => {
        const build = {
            shifter: { id: 's1', specs: { brake_fluid: 'DOT' }},
            brakes: {
                calipers: [{ id: 'c1', specs: { fluid: 'Mineral', position: 'front' }}]
            }
        };
        const result = Validator.validateBuild(build);
        expect(result.compatible).toBe(false);
        expect(result.issues).toContainEqual(
            expect.objectContaining({ severity: 'ERROR', message: expect.stringContaining('fluid') })
        );
    });
});

describe('Wheel Position Detection', () => {
    test('handles uppercase FRONT/REAR positions', () => {
        const build = {
            frame: { id: 'f1', specs: { rear_axle: '12x142' }},
            wheels: [
                { id: 'w1', specs: { position: 'FRONT', axle: '12x100' }},
                { id: 'w2', specs: { position: 'REAR', axle: '12x142' }}
            ]
        };
        const result = Validator.validateBuild(build);
        expect(result.compatible).toBe(true);
    });
});

describe('Freehub Compatibility', () => {
    test('allows HG cassette on HG11 wheel', () => {
        expect(freehubsCompatible('HG11', 'HG')).toBe(true);
    });

    test('rejects XD cassette on XDR wheel with 10T warning', () => {
        // XD can have 10T, XDR cannot
        const warning = checkFreehubWarnings('XDR', 'XD', 12);
        expect(warning).not.toBeNull();
    });
});
```

### Integration Tests

```typescript
// Test complete build flows
describe('Complete Build Flow', () => {
    test('validates Shimano 12-speed build', () => {
        const build = createShimano12sBuild();
        const result = Validator.validateBuild(build);
        expect(result.compatible).toBe(true);
    });

    test('rejects mixed Shimano/SRAM drivetrain', () => {
        const build = {
            shifter: createShimanoShifter(),
            rearDerailleur: createSramDerailleur(),
            cassette: createShimanoCassette()
        };
        const result = Validator.validateBuild(build);
        expect(result.compatible).toBe(false);
    });
});
```

---

## Appendix: Validation Coverage Matrix

| Component A | Component B | Check | Status | Phase |
|-------------|-------------|-------|--------|-------|
| Frame | Fork | Steerer tube | ⚠️ Weak | 2 |
| Frame | Fork | Wheel size | ⚠️ Weak | 2 |
| Frame | Fork | Geometry (A2C) | ❌ Missing | 5 |
| Fork | Front Wheel | Axle standard | ✅ Works | - |
| Frame | Rear Wheel | Axle standard | ✅ Works | - |
| Wheel | Tire | Diameter | ⚠️ Buggy | 2 |
| Wheel | Tire | Width/rim width | ❌ Missing | 2 |
| Frame | Tire | Clearance | ✅ Works | - |
| Frame | BB | Shell type | ✅ Works | - |
| BB | Crankset | Spindle interface | ✅ Works | - |
| Frame | Crankset | Chainline | ❌ Missing | 5 |
| Shifter | RD | Protocol | ✅ Works | - |
| Shifter | RD | Speeds | ✅ Works | - |
| RD | Cassette | Max cog | ✅ Works | - |
| RD | Cassette | Capacity | ❌ Missing | 5 |
| Wheel | Cassette | Freehub | ⚠️ Partial | 2 |
| Shifter | Caliper | Actuation type | ❌ Missing | 1 |
| Shifter | Caliper | Brake fluid | ❌ Missing | 1 |
| Frame | Caliper | Brake mount | ❌ Missing | 1 |
| Fork | Caliper | Brake mount | ❌ Missing | 1 |
| Frame | Rotor | Max size | ❌ Missing | 1 |
| Fork | Rotor | Max size | ❌ Missing | 1 |
| Wheel | Rotor | Mount type | ❌ Missing | 1 |
| Stem | Handlebar | Clamp diameter | ❌ Missing | 5 |
| Frame | Seatpost | Diameter | ❌ Missing | 5 |
| Stem | Fork | Steerer size | ❌ Missing | 5 |
| Drivetrain | Chain | Speed | ❌ Missing | 1 |
| Crankset | Chain | Chain type | ❌ Missing | 1 |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-07 | Claude Code | Initial audit and action plan |

