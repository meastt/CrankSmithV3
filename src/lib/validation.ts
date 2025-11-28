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
           lower.includes('centerlock') ||
           lower.includes('6-bolt');
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

    // 1. Axle Standard Check
    // Frame uses: rear_axle (e.g., "TA_12x142mm")
    // Wheel uses: rear_axle (e.g., "12x142mm")
    const frameAxle = getInterface(frame, 'rear_axle');
    const wheelAxle = getInterface(wheel, 'rear_axle', 'axle');

    if (frameAxle && wheelAxle && !axlesCompatible(frameAxle, wheelAxle)) {
        compatible = false;
        reasons.push(`Frame rear axle (${frameAxle}) incompatible with wheel (${wheelAxle})`);
    }

    // 2. Brake Type Check
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
// VALIDATION: WHEEL → TIRE (Diameter Match)
// ============================================================================

export function validateWheelTire(wheel: Component, tire: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Wheel uses: diameter (e.g., "700c", "29")
    // Tire uses: diameter (e.g., "700c", "29")
    const wheelDiameter = getInterface(wheel, 'diameter');
    const tireDiameter = getInterface(tire, 'diameter');

    if (wheelDiameter && tireDiameter) {
        // Normalize: "700c" and "700C" should match, "29" and "29in" should match
        const normWheel = String(wheelDiameter).toLowerCase().replace(/[^0-9a-z]/g, '');
        const normTire = String(tireDiameter).toLowerCase().replace(/[^0-9a-z]/g, '');

        if (normWheel !== normTire) {
            compatible = false;
            reasons.push(`Wheel diameter (${wheelDiameter}) doesn't match tire (${tireDiameter})`);
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
    // Frame uses: bottom_bracket_shell (e.g., "BSA_Threaded_68mm")
    // BB uses: frame_interface OR frame_shell
    const frameShell = getInterface(frame, 'bottom_bracket_shell', 'bb_shell');
    const bbFrameInterface = getInterface(bb, 'frame_interface', 'frame_shell');

    if (frameShell && bbFrameInterface && frameShell !== bbFrameInterface) {
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

    // 1. Protocol Check (Shifter ↔ Derailleur)
    // Both use: protocol (e.g., "AXS", "Di2_12s_Wireless", "Shimano_Road_11s")
    // Derailleur might also use: cable_pull
    const shifterProtocol = getInterface(shifter, 'protocol');
    const derailleurProtocol = getInterface(derailleur, 'protocol', 'cable_pull');

    if (shifterProtocol && derailleurProtocol && shifterProtocol !== derailleurProtocol) {
        compatible = false;
        reasons.push(`Shifter protocol (${shifterProtocol}) incompatible with derailleur (${derailleurProtocol})`);
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
            if (currentBuild.Frame) {
                addResult(validateFrameWheel(currentBuild.Frame, currentBuild.Wheel || component, component));
            }
            if (currentBuild.Wheel) {
                addResult(validateWheelTire(currentBuild.Wheel, component));
            }
            break;

        case 'Cassette':
            if (currentBuild.Wheel) {
                addResult(validateWheelCassette(currentBuild.Wheel, component));
            }
            if (currentBuild.Derailleur || currentBuild.Shifter) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    currentBuild.Derailleur || component,
                    component,
                    currentBuild.Crank
                ));
            }
            break;

        case 'BottomBracket':
            if (currentBuild.Frame) {
                addResult(validateFrameBBCrank(
                    currentBuild.Frame,
                    component,
                    currentBuild.Crank || component
                ));
            }
            break;

        case 'Crank':
            if (currentBuild.Frame && currentBuild.BottomBracket) {
                addResult(validateFrameBBCrank(
                    currentBuild.Frame,
                    currentBuild.BottomBracket,
                    component
                ));
            }
            if (currentBuild.Derailleur && currentBuild.Cassette) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    currentBuild.Derailleur,
                    currentBuild.Cassette,
                    component
                ));
            }
            break;

        case 'Derailleur':
            if (currentBuild.Shifter || currentBuild.Cassette) {
                addResult(validateDrivetrain(
                    currentBuild.Shifter || component,
                    component,
                    currentBuild.Cassette || component,
                    currentBuild.Crank
                ));
            }
            break;

        case 'Shifter':
            if (currentBuild.Derailleur) {
                addResult(validateDrivetrain(
                    component,
                    currentBuild.Derailleur,
                    currentBuild.Cassette || component,
                    currentBuild.Crank
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
