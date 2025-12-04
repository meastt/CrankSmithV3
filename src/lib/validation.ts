export interface Component {
    id: string;
    type: string;
    name: string;
    interfaces: Record<string, any>;
    attributes: Record<string, any>;
}

export interface ValidationResult {
    compatible: boolean;
    reasons: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Normalize axle standards for comparison
 * Handles: "TA_12x142mm" vs "12x142mm", case differences, etc.
 */
function normalizeAxle(axle: string | undefined): string {
    if (!axle) return '';
    // Remove prefixes like "TA_" or "QR_" and normalize
    return axle
        .replace(/^TA_/i, '')
        .replace(/^QR_/i, '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .trim();
}

/**
 * Check if two axle standards are compatible
 */
function axlesCompatible(axle1: string | undefined, axle2: string | undefined): boolean {
    if (!axle1 || !axle2) return true; // If either is missing, don't fail

    const norm1 = normalizeAxle(axle1);
    const norm2 = normalizeAxle(axle2);

    if (norm1 === norm2) return true;

    // Extract core dimensions (e.g., "12x142" from "12x142mm")
    const extractDimensions = (s: string) => {
        const match = s.match(/(\d+)x(\d+)/);
        return match ? `${match[1]}x${match[2]}` : s;
    };

    return extractDimensions(norm1) === extractDimensions(norm2);
}

/**
 * Check if two BB shell standards are compatible
 * Handles variations like "BSA_Threaded" vs "BSA_Threaded_68mm"
 */
function bbShellsCompatible(shell1: string | undefined, shell2: string | undefined): boolean {
    if (!shell1 || !shell2) return true; // If either is missing, don't fail

    // Normalize: lowercase, remove underscores/spaces/hyphens
    const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

    const norm1 = normalize(shell1);
    const norm2 = normalize(shell2);

    if (norm1 === norm2) return true;

    // Check if one contains the other (e.g., "bsathreaded68mm" contains "bsathreaded")
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

    // Extract the base standard (before any size suffix)
    // "BSA_Threaded_68mm" -> "bsathreaded", "PF30" -> "pf30"
    const extractBase = (s: string) => {
        // Remove size suffixes like "68mm", "86.5mm", "73mm"
        return s.replace(/\d+\.?\d*mm$/i, '').trim();
    };

    const base1 = extractBase(norm1);
    const base2 = extractBase(norm2);

    return base1 === base2 || base1.includes(base2) || base2.includes(base1);
}

/**
 * Check if two wheel sizes are equivalent
 * 700c ≈ 29", 650b ≈ 27.5"
 */
function wheelSizesEquivalent(size1: string, size2: string): boolean {
    // Normalize both
    const norm1 = size1.toLowerCase().replace(/[^0-9a-z.]/g, '');
    const norm2 = size2.toLowerCase().replace(/[^0-9a-z.]/g, '');

    if (norm1 === norm2) return true;

    // 700c and 29" are roughly equivalent (both ~622mm BSD)
    const is700c = (s: string) => s === '700c' || s === '700';
    const is29 = (s: string) => s === '29' || s === '29in';

    if ((is700c(norm1) && is29(norm2)) || (is29(norm1) && is700c(norm2))) {
        return true;
    }

    // 650b and 27.5" are equivalent (both ~584mm BSD)
    const is650b = (s: string) => s === '650b' || s === '650';
    const is275 = (s: string) => s === '275' || s === '27.5' || s === '275in' || s === '27.5in';

    if ((is650b(norm1) && is275(norm2)) || (is275(norm1) && is650b(norm2))) {
        return true;
    }

    return false;
}

/**
 * Check if frame uses disc brakes based on brake_mount or brake_type
 */
function isDiscBrake(brakeValue: string | undefined): boolean {
    if (!brakeValue) return false;
    const lower = brakeValue.toLowerCase();
    return lower.includes('disc') ||
        lower.includes('flat_mount') ||
        lower.includes('flat mount') ||
        lower.includes('post_mount') ||
        lower.includes('post mount') ||
        lower.includes('direct_mount') ||
        lower.includes('direct mount') ||
        lower.includes('centerlock') ||
        lower.includes('6-bolt') ||
        lower.includes('160mm') ||    // Rotor size implies disc
        lower.includes('140mm');      // Rotor size implies disc
}

/**
 * Get a field from interfaces, trying multiple possible field names
 */
function getInterface(component: Component, ...fieldNames: string[]): any {
    for (const name of fieldNames) {
        if (component.interfaces?.[name] !== undefined) {
            return component.interfaces[name];
        }
    }
    return undefined;
}

/**
 * Get a field from attributes, trying multiple possible field names
 */
function getAttribute(component: Component, ...fieldNames: string[]): any {
    for (const name of fieldNames) {
        if (component.attributes?.[name] !== undefined) {
            return component.attributes[name];
        }
    }
    return undefined;
}

// ============================================================================
// VALIDATION: FRAME → WHEEL
// ============================================================================

export function validateFrameWheel(frame: Component, wheel: Component, tire?: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // 1. Wheel Size Check
    // Frame may have wheel_size, or we infer from category
    const frameWheelSize = getInterface(frame, 'wheel_size', 'wheel_diameter') ||
        getAttribute(frame, 'wheel_size', 'wheel_diameter');
    const wheelDiameter = getInterface(wheel, 'diameter');
    const category = getAttribute(frame, 'category');

    if (wheelDiameter) {
        const wheelSizeNorm = String(wheelDiameter).toLowerCase().replace(/[^0-9a-z]/g, '');

        if (frameWheelSize) {
            // Frame explicitly specifies wheel size
            const frameSizeNorm = String(frameWheelSize).toLowerCase().replace(/[^0-9a-z]/g, '');
            if (frameSizeNorm !== wheelSizeNorm && !wheelSizesEquivalent(frameSizeNorm, wheelSizeNorm)) {
                compatible = false;
                reasons.push(`Frame wheel size (${frameWheelSize}) doesn't match wheel (${wheelDiameter})`);
            }
        } else {
            // Infer wheel size from frame category
            const frameAxle = getInterface(frame, 'rear_axle');
            const isBoost = frameAxle && String(frameAxle).toLowerCase().includes('boost');

            if (category === 'Road') {
                // Road frames are 700c only
                if (wheelSizeNorm !== '700c') {
                    compatible = false;
                    reasons.push(`Road frame requires 700c wheels, not ${wheelDiameter}`);
                }
            } else if (category === 'Gravel') {
                // Most gravel frames are 700c, some accept 650b
                // Allow both unless frame explicitly restricts it (handled above)
                const is700c = wheelSizesEquivalent(wheelSizeNorm, '700c');
                const is650b = wheelSizesEquivalent(wheelSizeNorm, '650b');

                if (!is700c && !is650b) {
                    compatible = false;
                    reasons.push(`Gravel frame requires 700c or 650b wheels, not ${wheelDiameter}`);
                }
            } else if (category === 'MTB') {
                // MTB frames use 29" or 27.5" (not 700c/650b naming)
                if (!['29', '29in', '275', '275in', '27.5', '27.5in'].includes(wheelSizeNorm)) {
                    compatible = false;
                    reasons.push(`MTB frame requires 29" or 27.5" wheels, not ${wheelDiameter}`);
                }
            }
        }
    }

    // 1b. Wheel Inner Width Check (filter gravel wheels from road builds, etc.)
    // Road wheels: 17-23mm inner width
    // Gravel wheels: 21-32mm inner width
    // MTB wheels: 25-40mm inner width
    const wheelInnerWidth = getAttribute(wheel, 'internal_width', 'inner_width');
    if (wheelInnerWidth && category) {
        const innerW = Number(wheelInnerWidth);

        if (category === 'Road') {
            // Road wheels should be 17-23mm inner width
            // Wheels wider than 23mm are gravel/MTB wheels
            if (innerW > 23) {
                compatible = false;
                reasons.push(`Wheel inner width (${innerW}mm) too wide for road bike - use wheels with 17-23mm inner width`);
            }
        } else if (category === 'Gravel') {
            // Gravel wheels are typically 21-32mm
            // Anything under 19mm is too narrow (pure road), over 35mm is MTB
            if (innerW < 19) {
                compatible = false;
                reasons.push(`Wheel inner width (${innerW}mm) too narrow for gravel bike - use wheels with 21-32mm inner width`);
            } else if (innerW > 35) {
                compatible = false;
                reasons.push(`Wheel inner width (${innerW}mm) too wide for gravel bike - use wheels with 21-32mm inner width`);
            }
        } else if (category === 'MTB') {
            // MTB wheels are typically 25-40mm
            // Anything under 25mm is too narrow
            if (innerW < 25) {
                compatible = false;
                reasons.push(`Wheel inner width (${innerW}mm) too narrow for MTB - use wheels with 25-40mm inner width`);
            }
        }
    }

    // 2. Axle Standard Check
    // Frame uses: rear_axle (e.g., "TA_12x142mm")
    // Wheel uses: rear_axle (e.g., "12x142mm")
    const frameAxle = getInterface(frame, 'rear_axle');
    const wheelAxle = getInterface(wheel, 'rear_axle', 'axle');

    if (frameAxle && wheelAxle && !axlesCompatible(frameAxle, wheelAxle)) {
        compatible = false;
        reasons.push(`Frame rear axle (${frameAxle}) incompatible with wheel (${wheelAxle})`);
    }

    // 3. Brake Type Check
    // Frame uses: brake_mount (e.g., "Flat_Mount") or brake_type
    // Wheel uses: brake_type (e.g., "Disc")
    const frameBrake = getInterface(frame, 'brake_mount', 'brake_type');
    const wheelBrake = getInterface(wheel, 'brake_type', 'brake_mount');

    if (frameBrake && wheelBrake) {
        const frameIsDisc = isDiscBrake(frameBrake);
        const wheelIsDisc = isDiscBrake(wheelBrake);

        if (frameIsDisc !== wheelIsDisc) {
            compatible = false;
            reasons.push(`Frame brake (${frameBrake}) incompatible with wheel brake (${wheelBrake})`);
        }
    }

    // 3. Tire Clearance Check (if tire provided)
    if (tire) {
        const maxTire = getAttribute(frame, 'max_tire', 'max_tire_width_mm', 'max_tire_width');
        const tireWidth = getAttribute(tire, 'width', 'width_mm');

        if (maxTire && tireWidth && Number(tireWidth) > Number(maxTire)) {
            compatible = false;
            reasons.push(`Tire width (${tireWidth}mm) exceeds frame max clearance (${maxTire}mm)`);
        }
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: WHEEL → TIRE (Diameter + Width Compatibility)
// ============================================================================

export function validateWheelTire(wheel: Component, tire: Component, frame?: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // 1. Diameter Check
    // Wheel uses: diameter (e.g., "700c", "29")
    // Tire uses: diameter (e.g., "700c", "29")
    const wheelDiameter = getInterface(wheel, 'diameter');
    const tireDiameter = getInterface(tire, 'diameter');

    if (wheelDiameter && tireDiameter) {
        // Use equivalence check: 700c ≈ 29", 650b ≈ 27.5"
        if (!wheelSizesEquivalent(String(wheelDiameter), String(tireDiameter))) {
            compatible = false;
            reasons.push(`Wheel diameter (${wheelDiameter}) doesn't match tire (${tireDiameter})`);
        }
    }

    // 2. Tire Width vs Wheel Inner Width Check
    // Modern wide rims have changed the old rules. Using practical limits:
    // - Minimum: tire can be slightly narrower than inner width for aero road setups
    // - Maximum: tire should not exceed ~2.5x inner width for stability
    const wheelInnerWidth = getAttribute(wheel, 'internal_width', 'inner_width');
    const tireWidth = getInterface(tire, 'width') || getAttribute(tire, 'width');

    if (wheelInnerWidth && tireWidth) {
        const innerW = Number(wheelInnerWidth);
        const tireW = Number(tireWidth);

        // Practical limits based on modern rim/tire pairings:
        // - 19mm inner width: 23-50mm tires (road)
        // - 21mm inner width: 25-55mm tires (all-road)
        // - 25mm inner width: 28-65mm tires (gravel)
        // - 30mm inner width: 35-75mm tires (MTB)
        const minTireWidth = Math.max(innerW - 4, innerW * 0.9); // Allow slightly narrower
        const maxTireWidth = innerW * 2.6; // Upper bound

        if (tireW < minTireWidth) {
            compatible = false;
            reasons.push(`Tire too narrow (${tireW}mm) for wheel inner width (${innerW}mm)`);
        } else if (tireW > maxTireWidth) {
            compatible = false;
            reasons.push(`Tire too wide (${tireW}mm) for wheel inner width (${innerW}mm)`);
        }
    }

    // 3. Frame Tire Clearance Check (if frame provided)
    if (frame) {
        const maxTire = getAttribute(frame, 'max_tire', 'max_tire_width_mm', 'max_tire_width');
        const tireW = getInterface(tire, 'width') || getAttribute(tire, 'width');

        if (maxTire && tireW) {
            const maxT = Number(maxTire);
            const tW = Number(tireW);

            // Too wide for frame
            if (tW > maxT) {
                compatible = false;
                reasons.push(`Tire width (${tW}mm) exceeds frame clearance (${maxT}mm)`);
            }

            // Too narrow for frame's intended use (don't show 25mm tires for a 57mm clearance frame)
            // Scale the minimum based on frame clearance:
            // - 35-45mm frames (wide road/light gravel): min ~25mm
            // - 45-55mm frames (gravel): min ~32mm
            // - 55mm+ frames (serious gravel/MTB): min ~35mm
            let minPracticalTire = 20; // Default for road frames
            if (maxT >= 55) {
                minPracticalTire = 35; // Serious gravel/MTB - no skinny road tires
            } else if (maxT >= 45) {
                minPracticalTire = 32; // Gravel frames
            } else if (maxT >= 35) {
                minPracticalTire = 25; // All-road frames
            }

            if (tW < minPracticalTire) {
                compatible = false;
                reasons.push(`Tire too narrow (${tW}mm) for this frame type (max ${maxT}mm clearance)`);
            }
        }
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: WHEEL → CASSETTE (Freehub Body)
// ============================================================================

export function validateWheelCassette(wheel: Component, cassette: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Wheel uses: freehub (e.g., "Shimano_HG_L2", "SRAM_XDR") - can be array
    // Cassette uses: freehub_mount or freehub (e.g., "Shimano_HG_L2")
    const wheelFreehub = getInterface(wheel, 'freehub', 'freehub_body');
    const cassetteMount = getInterface(cassette, 'freehub_mount', 'freehub', 'cassette_mount');

    if (wheelFreehub && cassetteMount) {
        // Wheel freehub can be an array of compatible options
        const wheelOptions = Array.isArray(wheelFreehub) ? wheelFreehub : [wheelFreehub];
        const cassetteNorm = String(cassetteMount).toLowerCase().replace(/[\s_-]/g, '');

        const isCompatible = wheelOptions.some(opt => {
            const optNorm = String(opt).toLowerCase().replace(/[\s_-]/g, '');
            return optNorm === cassetteNorm ||
                optNorm.includes(cassetteNorm) ||
                cassetteNorm.includes(optNorm);
        });

        if (!isCompatible) {
            compatible = false;
            reasons.push(`Wheel freehub (${wheelFreehub}) incompatible with cassette (${cassetteMount})`);
        }
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: FRAME → BOTTOM BRACKET → CRANK
// ============================================================================

export function validateFrameBBCrank(frame: Component, bb: Component, crank: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // 1. Frame → BB Shell Check
    // Frame uses: bottom_bracket_shell (e.g., "BSA_Threaded_68mm" or "BSA_Threaded")
    // BB uses: frame_interface OR frame_shell (e.g., "BSA_Threaded_68mm")
    const frameShell = getInterface(frame, 'bottom_bracket_shell', 'bb_shell');
    const bbFrameInterface = getInterface(bb, 'frame_interface', 'frame_shell');

    if (frameShell && bbFrameInterface && !bbShellsCompatible(frameShell, bbFrameInterface)) {
        compatible = false;
        reasons.push(`Frame BB shell (${frameShell}) incompatible with bottom bracket (${bbFrameInterface})`);
    }

    // 2. BB → Crank Spindle Check
    // BB uses: crank_interface OR crank_spindle (e.g., "Hollowtech_II_24mm")
    // Crank uses: spindle OR spindle_type
    const bbCrankInterface = getInterface(bb, 'crank_interface', 'crank_spindle');
    const crankSpindle = getInterface(crank, 'spindle', 'spindle_type');

    if (bbCrankInterface && crankSpindle && bbCrankInterface !== crankSpindle) {
        compatible = false;
        reasons.push(`Bottom bracket spindle (${bbCrankInterface}) incompatible with crank (${crankSpindle})`);
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: DRIVETRAIN (Shifter → Derailleur → Cassette)
// ============================================================================

export function validateDrivetrain(
    shifter: Component,
    derailleur: Component,
    cassette: Component,
    crank?: Component
): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Helper to check if component is electronic
    const isElectronic = (c: Component) => {
        const proto = getInterface(c, 'protocol');
        const attr = getAttribute(c, 'electronic');
        if (attr === true) return true;
        if (proto && String(proto).toLowerCase().includes('electronic')) return true;
        if (proto && String(proto).toLowerCase().includes('di2')) return true;
        if (proto && String(proto).toLowerCase().includes('axs')) return true;
        if (proto && String(proto).toLowerCase().includes('eps')) return true;
        return false;
    };

    // 1. Protocol Check (Shifter ↔ Derailleur)
    // Both use: protocol (e.g., "AXS", "Di2_12s_Wireless", "Shimano_Road_11s")
    // Derailleur might also use: cable_pull
    const shifterProtocol = getInterface(shifter, 'protocol');
    const derailleurProtocol = getInterface(derailleur, 'protocol', 'cable_pull');

    if (shifterProtocol && derailleurProtocol) {
        // Normalize protocols for comparison
        // Handle variations: "SRAM_AXS" vs "AXS", case differences, etc.
        const normalizeProtocol = (p: string): string => {
            let norm = String(p).toLowerCase().replace(/[\s_-]/g, '');
            // "sramaxs" -> "axs", but keep "axs" as "axs"
            if (norm === 'sramaxs') norm = 'axs';
            // Normalize Di2 variations: "shimanodi2", "di212swireless" -> "di2"
            if (norm.includes('di2')) norm = 'di2';
            // Normalize mechanical Shimano road 12s: "shimanoroad12smech" -> "shimanoroad12smech"
            if (norm.includes('shimanoroad12smech')) norm = 'shimanoroad12smech';
            return norm;
        };

        const norm1 = normalizeProtocol(shifterProtocol);
        const norm2 = normalizeProtocol(derailleurProtocol);

        if (norm1 !== norm2) {
            compatible = false;
            reasons.push(`Shifter protocol (${shifterProtocol}) incompatible with derailleur (${derailleurProtocol})`);
        }
    } else {
        // If protocols are missing, fallback to electronic/mechanical check
        const shifterElectronic = isElectronic(shifter);
        const derailleurElectronic = isElectronic(derailleur);

        if (shifterElectronic !== derailleurElectronic) {
            compatible = false;
            reasons.push(`Cannot mix electronic shifter with mechanical derailleur (or vice versa)`);
        }
    }

    // 2. Speed Count Check (all must match)
    const shifterSpeeds = getAttribute(shifter, 'speeds') || getInterface(shifter, 'speeds');
    const derailleurSpeeds = getAttribute(derailleur, 'speeds') || getInterface(derailleur, 'speeds');
    const cassetteSpeeds = getAttribute(cassette, 'speeds') || getInterface(cassette, 'speeds');

    if (shifterSpeeds && derailleurSpeeds && Number(shifterSpeeds) !== Number(derailleurSpeeds)) {
        compatible = false;
        reasons.push(`Shifter (${shifterSpeeds}-speed) doesn't match derailleur (${derailleurSpeeds}-speed)`);
    }

    if (derailleurSpeeds && cassetteSpeeds && Number(derailleurSpeeds) !== Number(cassetteSpeeds)) {
        compatible = false;
        reasons.push(`Derailleur (${derailleurSpeeds}-speed) doesn't match cassette (${cassetteSpeeds}-speed)`);
    }

    // 3. Max Cog Check (Derailleur must handle cassette's largest cog)
    const maxCog = getAttribute(derailleur, 'max_cog', 'max_tooth');
    const largestCog = getAttribute(cassette, 'largest_cog');

    if (maxCog && largestCog && Number(largestCog) > Number(maxCog)) {
        compatible = false;
        reasons.push(`Cassette largest cog (${largestCog}t) exceeds derailleur max (${maxCog}t)`);
    }

    // 4. Capacity Check (if crank provided)
    if (crank) {
        const capacity = getAttribute(derailleur, 'capacity');
        const cassetteDiff = getAttribute(cassette, 'diff');
        const chainringDiff = getAttribute(crank, 'chainring_diff') || 0;

        if (capacity && cassetteDiff !== undefined) {
            const requiredCapacity = Number(cassetteDiff) + Number(chainringDiff);
            if (requiredCapacity > Number(capacity)) {
                compatible = false;
                reasons.push(`Required capacity (${requiredCapacity}t) exceeds derailleur capacity (${capacity}t)`);
            }
        }
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: HANDLEBAR → STEM
// ============================================================================

export function validateHandlebarStem(handlebar: Component, stem: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Both use: clamp_diameter (e.g., "31.8mm")
    const handlebarClamp = getInterface(handlebar, 'clamp_diameter');
    const stemClamp = getInterface(stem, 'clamp_diameter');

    if (handlebarClamp && stemClamp && handlebarClamp !== stemClamp) {
        compatible = false;
        reasons.push(`Handlebar clamp (${handlebarClamp}) doesn't match stem (${stemClamp})`);
    }

    return { compatible, reasons };
}

// ============================================================================
// VALIDATION: FRAME → STEM (Steerer Tube)
// ============================================================================

export function validateFrameStem(frame: Component, stem: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Frame uses: steerer_tube (e.g., "1_1/8")
    // Stem uses: steerer_clamp
    const frameSteerer = getInterface(frame, 'steerer_tube');
    const stemSteerer = getInterface(stem, 'steerer_clamp');

    if (frameSteerer && stemSteerer && frameSteerer !== stemSteerer) {
        compatible = false;
        reasons.push(`Frame steerer (${frameSteerer}) doesn't match stem (${stemSteerer})`);
    }

    return { compatible, reasons };
}

// ============================================================================
// MASTER VALIDATION: Check component against current build
// ============================================================================

export function validateComponent(
    componentType: string,
    component: Component,
    currentBuild: Record<string, Component>
): ValidationResult {
    const allReasons: string[] = [];
    let compatible = true;

    const addResult = (result: ValidationResult) => {
        if (!result.compatible) {
            compatible = false;
            allReasons.push(...result.reasons);
        }
    };

    switch (componentType) {
        case 'Wheel':
            if (currentBuild.Frame) {
                addResult(validateFrameWheel(currentBuild.Frame, component));
            }
            break;

        case 'Tire':
            // Validate tire against wheel (diameter + width compatibility)
            // and frame (max tire clearance)
            if (currentBuild.Wheel) {
                addResult(validateWheelTire(currentBuild.Wheel, component, currentBuild.Frame));
            } else if (currentBuild.Frame) {
                // No wheel yet, just check frame clearance
                const maxTire = getAttribute(currentBuild.Frame, 'max_tire', 'max_tire_width_mm', 'max_tire_width');
                const tireWidth = getInterface(component, 'width') || getAttribute(component, 'width');
                if (maxTire && tireWidth && Number(tireWidth) > Number(maxTire)) {
                    addResult({
                        compatible: false,
                        reasons: [`Tire width (${tireWidth}mm) exceeds frame clearance (${maxTire}mm)`]
                    });
                }
            }
            break;

        case 'Cassette':
            if (currentBuild.Wheel) {
                addResult(validateWheelCassette(currentBuild.Wheel, component));
            }
            if (currentBuild.RearDerailleur || currentBuild.Shifter) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    currentBuild.RearDerailleur || component,
                    component,
                    currentBuild.Crankset
                ));
            }
            break;

        case 'BottomBracket':
            if (currentBuild.Frame) {
                addResult(validateFrameBBCrank(
                    currentBuild.Frame,
                    component,
                    currentBuild.Crankset || component
                ));
            }
            break;

        case 'Crankset':
            if (currentBuild.Frame && currentBuild.BottomBracket) {
                addResult(validateFrameBBCrank(
                    currentBuild.Frame,
                    currentBuild.BottomBracket,
                    component
                ));
            }
            if (currentBuild.RearDerailleur && currentBuild.Cassette) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    currentBuild.RearDerailleur,
                    currentBuild.Cassette,
                    component
                ));
            }
            break;

        case 'RearDerailleur':
            if (currentBuild.Shifter || currentBuild.Cassette) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    component,
                    currentBuild.Cassette || component,
                    currentBuild.Crankset
                ));
            }
            break;

        case 'Shifter':
            if (currentBuild.RearDerailleur) {
                addResult(validateDrivetrain(
                    component,
                    currentBuild.RearDerailleur,
                    currentBuild.Cassette || component,
                    currentBuild.Crankset
                ));
            }
            break;

        case 'Handlebar':
            if (currentBuild.Stem) {
                addResult(validateHandlebarStem(component, currentBuild.Stem));
            }
            break;

        case 'Stem':
            if (currentBuild.Handlebar) {
                addResult(validateHandlebarStem(currentBuild.Handlebar, component));
            }
            if (currentBuild.Frame) {
                addResult(validateFrameStem(currentBuild.Frame, component));
            }
            break;
    }

    return { compatible, reasons: allReasons };
}
