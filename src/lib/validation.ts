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

export function validateFrameWheel(frame: Component, wheel: Component, tire?: Component): ValidationResult {
    const reasons: string[] = [];
    let compatible = true;

    // Axle Check
    if (frame.interfaces.rear_axle !== wheel.interfaces.axle) {
        compatible = false;
        reasons.push(`Frame axle (${frame.interfaces.rear_axle}) does not match Wheel axle (${wheel.interfaces.axle})`);
    }

    // Brake Type Check
    if (frame.interfaces.brake_type && wheel.interfaces.brake_type && frame.interfaces.brake_type !== wheel.interfaces.brake_type) {
        compatible = false;
        reasons.push(`Frame brake type (${frame.interfaces.brake_type}) does not match Wheel brake type (${wheel.interfaces.brake_type})`);
    }

    // Tire Clearance Check
    if (tire) {
        const maxTire = frame.attributes.max_tire_width_mm;
        const tireWidth = tire.attributes.width_mm;
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
