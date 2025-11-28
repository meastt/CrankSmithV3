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

// Normalize axle standards for comparison
function normalizeAxle(axle: string | undefined): string {
    if (!axle) return '';
    // Remove prefixes like "TA_" and normalize
    return axle.replace(/^TA_/, '').replace(/^QR_/, '').toLowerCase().trim();
}

// Check if two axle standards are compatible
function axlesCompatible(frameAxle: string | undefined, wheelAxle: string | undefined): boolean {
    if (!frameAxle || !wheelAxle) return true; // If either is missing, don't fail on this check

    const normalizedFrame = normalizeAxle(frameAxle);
    const normalizedWheel = normalizeAxle(wheelAxle);

    // Direct match after normalization
    if (normalizedFrame === normalizedWheel) return true;

    // Check if the core dimensions match (e.g., "12x142mm" matches "12x142")
    const extractDimensions = (s: string) => {
        const match = s.match(/(\d+)x(\d+)/);
        return match ? `${match[1]}x${match[2]}` : s;
    };

    return extractDimensions(normalizedFrame) === extractDimensions(normalizedWheel);
}

export function validateFrameWheel(frame: Component, wheel: Component, tire?: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Axle Check - use the normalized comparison
    const frameAxle = frame.interfaces.rear_axle;
    const wheelAxle = wheel.interfaces.rear_axle || wheel.interfaces.axle;

    if (!axlesCompatible(frameAxle, wheelAxle)) {
        compatible = false;
        reasons.push(`Frame axle (${frameAxle}) does not match Wheel axle (${wheelAxle})`);
    }

    // Brake Type Check
    const frameBrake = frame.interfaces.brake_type || frame.interfaces.brake_mount;
    const wheelBrake = wheel.interfaces.brake_type;

    if (frameBrake && wheelBrake) {
        // Normalize brake types
        const frameIsDisc = frameBrake.toLowerCase().includes('disc') || frameBrake.toLowerCase().includes('flat_mount') || frameBrake.toLowerCase().includes('post_mount');
        const wheelIsDisc = wheelBrake.toLowerCase().includes('disc');

        if (frameIsDisc !== wheelIsDisc) {
            compatible = false;
            reasons.push(`Frame brake type (${frameBrake}) does not match Wheel brake type (${wheelBrake})`);
        }
    }

    // Tire Clearance Check
    if (tire) {
        const maxTire = frame.attributes.max_tire_width_mm || frame.attributes.max_tire;
        const tireWidth = tire.attributes.width_mm || tire.attributes.width;
        if (maxTire && tireWidth && tireWidth > maxTire) {
            compatible = false;
            reasons.push(`Tire width (${tireWidth}mm) exceeds Frame max clearance (${maxTire}mm)`);
        }
    }

    return { compatible, reasons };
}

export function validateFrameBBCrank(frame: Component, bb: Component, crank: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Frame -> BB Check
    if (bb.interfaces.frame_interface !== frame.interfaces.bottom_bracket_shell) {
        compatible = false;
        reasons.push(`BB frame interface (${bb.interfaces.frame_interface}) does not match Frame shell (${frame.interfaces.bottom_bracket_shell})`);
    }

    // BB -> Crank Check
    if (bb.interfaces.crank_interface !== crank.interfaces.spindle_type) {
        compatible = false;
        reasons.push(`BB crank interface (${bb.interfaces.crank_interface}) does not match Crank spindle (${crank.interfaces.spindle_type})`);
    }

    return { compatible, reasons };
}

export function validateDrivetrain(shifter: Component, derailleur: Component, cassette: Component, crank?: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Protocol Check
    if (shifter.interfaces.protocol !== derailleur.interfaces.protocol) {
        compatible = false;
        reasons.push(`Shifter protocol (${shifter.interfaces.protocol}) does not match Derailleur protocol (${derailleur.interfaces.protocol})`);
    }

    // Max Tooth Check
    const maxTooth = derailleur.attributes.max_tooth;
    const largestCog = cassette.attributes.largest_cog;
    if (maxTooth && largestCog && largestCog > maxTooth) {
        compatible = false;
        reasons.push(`Cassette largest cog (${largestCog}t) exceeds Derailleur max tooth (${maxTooth}t)`);
    }

    // Capacity Check
    if (crank) {
        const capacity = derailleur.attributes.capacity;
        const cassetteDiff = cassette.attributes.diff;
        const chainringDiff = crank.attributes.chainring_diff || 0;

        if (capacity && cassetteDiff !== undefined) {
            const requiredCapacity = cassetteDiff + chainringDiff;
            if (requiredCapacity > capacity) {
                compatible = false;
                reasons.push(`Required capacity (${requiredCapacity}t) exceeds Derailleur capacity (${capacity}t)`);
            }
        }
    }

    return { compatible, reasons };
}
