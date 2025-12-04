
// FILE: src/engine/Validator.ts

import {
    Frame, Fork, Wheel, Tire, BottomBracket, Crankset,
    Cassette, RearDerailleur, Shifter, BrakeCaliper,
    BrakeRotor, Stem, Handlebar, Seatpost
} from '../types/components';

import {
    SteererStandard, HeadTubeStandard, AxleStandard
} from '../constants/standards';

export type ValidationStatus = 'COMPATIBLE' | 'WARNING' | 'INCOMPATIBLE';

export interface ValidationResult {
    valid: boolean;
    status: ValidationStatus;
    message: string;
    requiredAdapter?: string;
}

export class Validator {

    // --- HELPER: Create Result ---
    private static createResult(
        valid: boolean,
        message: string,
        status: ValidationStatus = valid ? 'COMPATIBLE' : 'INCOMPATIBLE',
        adapter?: string
    ): ValidationResult {
        return { valid, status, message, requiredAdapter: adapter };
    }

    // --- 1.2 FRAME & FORK LOGIC ---

    static validateFrameToFork(frame: Frame, fork: Fork): ValidationResult {
        // Check A: Steerer Tube
        const headTube = frame.headTube;
        const steerer = fork.steerer;

        // Logic: Map HeadTubes to compatible Steerers
        let compatibleSteerer = false;

        // Tapered Forks (1-1/8 to 1.5) fit in Tapered Headtubes
        if (steerer === SteererStandard.TAPERED_1_1_8_1_5) {
            if (
                headTube === HeadTubeStandard.IS42_IS52 ||
                headTube === HeadTubeStandard.IS41_IS52 ||
                headTube === HeadTubeStandard.ZS44_ZS56
            ) {
                compatibleSteerer = true;
            }
        }

        // Straight Forks (1-1/8) fit in Straight Headtubes AND Tapered (with adapter)
        if (steerer === SteererStandard.STRAIGHT_1_1_8) {
            if (headTube === HeadTubeStandard.EC34 || headTube === HeadTubeStandard.ZS44) {
                compatibleSteerer = true;
            } else if (
                headTube === HeadTubeStandard.IS42_IS52 ||
                headTube === HeadTubeStandard.IS41_IS52 ||
                headTube === HeadTubeStandard.ZS44_ZS56
            ) {
                // Fits with adapter crown race
                return this.createResult(true, "Compatible with Crown Race Adapter", 'WARNING', "1-1/8 to 1.5 Crown Race Adapter");
            }
        }

        if (!compatibleSteerer) {
            return this.createResult(false, `Fork Steerer(${steerer}) incompatible with Frame Headtube(${headTube})`);
        }

        // Check B: Geometry (Axle to Crown)
        const diff = Math.abs(frame.designedForkLength - fork.axleToCrown);
        if (diff > 20) {
            return this.createResult(true, `Geometry Warning: Fork length differs by ${diff} mm.Handling may be compromised.`, 'WARNING');
        }

        // Check C: Wheel Size Intent
        // Allow 29" fork on 700c frame (same rim diameter), but warn if types mismatch
        if (frame.wheelSize !== fork.wheelSize) {
            // 700c vs 29 is physically compatible (622mm)
            const is700c_29 = (s: string) => s === '700c' || s === '29';
            if (is700c_29(frame.wheelSize) && is700c_29(fork.wheelSize)) {
                // Pass
            } else {
                return this.createResult(false, `Fork Wheel Size(${fork.wheelSize}) does not match Frame(${frame.wheelSize})`);
            }
        }

        return this.createResult(true, "Fork is compatible");
    }

    // --- 1.3 ROLLING CHASSIS LOGIC ---

    static validateWheelToFrame(frame: Frame, wheel: Wheel): ValidationResult {
        // 1. Position Check
        if (wheel.position === 'FRONT') return this.createResult(false, "Cannot put Front Wheel on Frame (Rear)");

        // 2. Axle Standard
        if (frame.rearAxle !== wheel.axle) {
            return this.createResult(false, `Frame Axle(${frame.rearAxle}) does not match Wheel(${wheel.axle})`);
        }

        // 3. Diameter
        // 700c == 29"
        const isCompatibleDiameter = (f: string, w: string) => {
            if (f === w) return true;
            if ((f === '700c' && w === '29') || (f === '29' && w === '700c')) return true;
            return false;
        };

        if (!isCompatibleDiameter(frame.wheelSize, wheel.diameter)) {
            return this.createResult(false, `Frame designed for ${frame.wheelSize} but wheel is ${wheel.diameter} `);
        }

        return this.createResult(true, "Rear Wheel is compatible");
    }

    static validateWheelToFork(fork: Fork, wheel: Wheel): ValidationResult {
        // 1. Position Check
        if (wheel.position === 'REAR') return this.createResult(false, "Cannot put Rear Wheel on Fork");

        // 2. Axle Standard
        if (fork.axle !== wheel.axle) {
            return this.createResult(false, `Fork Axle(${fork.axle}) does not match Wheel(${wheel.axle})`);
        }

        return this.createResult(true, "Front Wheel is compatible");
    }

    static validateTireToFrame(frame: Frame, tire: Tire): ValidationResult {
        // 1. Diameter
        const isCompatibleDiameter = (f: string, t: string) => {
            if (f === t) return true;
            if ((f === '700c' && t === '29') || (f === '29' && t === '700c')) return true;
            return false;
        };

        if (!isCompatibleDiameter(frame.wheelSize, tire.diameter)) {
            return this.createResult(false, `Tire diameter(${tire.diameter}) does not match Frame(${frame.wheelSize})`);
        }

        // 2. Clearance (with 4mm buffer)
        if (tire.widthMM + 4 > frame.maxTireWidthMM) {
            return this.createResult(false, `Tire width(${tire.widthMM}mm) exceeds frame clearance(${frame.maxTireWidthMM}mm) with safety buffer`);
        }

        return this.createResult(true, "Tire fits frame");
    }

    // --- 2.1 BOTTOM BRACKET LOGIC ---

    static validateBB(frame: Frame, bb: BottomBracket, crank: Crankset): ValidationResult {
        // 1. Frame Shell -> BB Shell
        // This is a direct match check usually, but some BBs adapt.
        // For strict "Project Velocity", we assume direct fit unless adapter logic is added.
        if (frame.bbShell !== bb.shell) {
            // Check for known adaptations (e.g. PF30 frame taking a PF30-to-24mm BB)
            // For now, strict match:
            return this.createResult(false, `Frame Shell(${frame.bbShell}) does not match BB(${bb.shell})`);
        }

        // 2. BB Interface -> Crank Spindle
        if (bb.spindleInterface !== crank.spindle) {
            return this.createResult(false, `BB Spindle Interface(${bb.spindleInterface}) does not match Crank(${crank.spindle})`);
        }

        return this.createResult(true, "Bottom Bracket & Crank are compatible");
    }

    // --- 2.2 SHIFTING LOGIC (PULL RATIOS) ---

    static validateShifting(shifter: Shifter, rd: RearDerailleur): ValidationResult {
        // CRITICAL: Pull Ratio Match
        if (shifter.pullRatio !== rd.pullRatio) {
            return this.createResult(false, `Shifter Pull Ratio(${shifter.pullRatio}) incompatible with Derailleur(${rd.pullRatio})`);
        }

        // Speed Match
        if (shifter.speeds !== rd.speeds) {
            return this.createResult(false, `Shifter Speeds(${shifter.speeds}) do not match Derailleur(${rd.speeds})`);
        }

        // Electronic Check (Redundant if PullRatio is strict, but good safety)
        if (shifter.isElectronic !== rd.isElectronic) {
            return this.createResult(false, "Cannot mix Electronic and Mechanical shifting components");
        }

        return this.createResult(true, "Shifter and Derailleur are compatible");
    }

    // --- 2.3 CAPACITY & GEARING LOGIC ---

    static validateGearing(
        crank: Crankset,
        cassette: Cassette,
        rd: RearDerailleur,
        wheel: Wheel
    ): ValidationResult {
        // 1. Freehub Match
        if (wheel.freehub && wheel.freehub !== cassette.freehubType) {
            return this.createResult(false, `Wheel Freehub(${wheel.freehub}) does not match Cassette(${cassette.freehubType})`);
        }

        // 2. Max Cog Limit
        const [smallCog, bigCog] = cassette.range;
        if (bigCog > rd.maxCog) {
            return this.createResult(false, `Cassette largest cog(${bigCog}t) exceeds RD max limit(${rd.maxCog}t)`);
        }

        // 3. Capacity Calculation
        // Capacity = (BigRing - SmallRing) + (BigCog - SmallCog)
        const bigRing = Math.max(...crank.chainrings);
        const smallRing = Math.min(...crank.chainrings);
        const frontDiff = bigRing - smallRing;
        const rearDiff = bigCog - smallCog;

        const totalCapacityNeeded = frontDiff + rearDiff;

        if (totalCapacityNeeded > rd.capacity) {
            return this.createResult(false, `Drivetrain requires ${totalCapacityNeeded}t capacity, but RD only supports ${rd.capacity} t`);
        }

        return this.createResult(true, "Gearing and Capacity are valid");
    }

    // --- 2.4 CHAINLINE LOGIC ---

    static validateChainline(crank: Crankset, frame: Frame): ValidationResult {
        const { rearAxle, type } = frame;
        const chainline = crank.chainline;

        let minCL = 0;
        let maxCL = 0;

        // 1. Determine Target Chainline Range based on Frame
        if (type === 'ROAD' || type === 'GRAVEL') {
            if (rearAxle === AxleStandard.TA_12_142 || rearAxle === AxleStandard.QR_135) {
                // Standard Road: ~43.5mm
                // GRX/Wide Road: ~46-47mm
                minCL = 43;
                maxCL = 47.5;
            } else {
                // Unknown Road Standard?
                return this.createResult(true, "Unknown Road Axle standard for Chainline check", 'WARNING');
            }
        } else if (type === 'MTB') {
            if (rearAxle === AxleStandard.TA_12_142 || rearAxle === AxleStandard.QR_135 || rearAxle === AxleStandard.TA_15_100) { // 15_100 is front, ignore.
                // Non-Boost MTB
                minCL = 48;
                maxCL = 50;
            } else if (rearAxle === AxleStandard.TA_12_148) {
                // Boost
                minCL = 51;
                maxCL = 53;
            } else if (rearAxle === AxleStandard.TA_12_157) {
                // Super Boost
                minCL = 55;
                maxCL = 57;
            }
        }

        // 2. Validate
        if (minCL > 0 && maxCL > 0) {
            if (chainline < minCL) {
                return this.createResult(false, `Crank Chainline (${chainline}mm) is too narrow for Frame (Expected ${minCL}-${maxCL}mm). Chainstay clearance risk.`);
            }
            if (chainline > maxCL) {
                return this.createResult(false, `Crank Chainline (${chainline}mm) is too wide for Frame (Expected ${minCL}-${maxCL}mm). Poor shifting performance.`);
            }
        }

        return this.createResult(true, "Chainline is compatible");
    }

    // --- 3.1 BRAKING LOGIC ---

    static validateBrakes(
        lever: Shifter | BrakeCaliper, // Lever might be a Shifter
        caliper: BrakeCaliper,
        rotor: BrakeRotor,
        frameOrFork: Frame | Fork
    ): ValidationResult {
        // 1. Fluid Compatibility (CRITICAL)
        // If lever has brakeFluid (it's hydraulic), it must match caliper
        if ('brakeFluid' in lever && lever.brakeFluid) {
            if (lever.brakeFluid !== caliper.fluid) {
                return this.createResult(false, `Catastrophic Failure Risk: Lever uses ${lever.brakeFluid} but Caliper uses ${caliper.fluid} `, 'INCOMPATIBLE');
            }
        }

        // 2. Mount Compatibility
        // Frame/Fork mount must match Caliper mount
        if (frameOrFork.brakeMount !== caliper.mount) {
            // Check for adapters? For now, strict fail.
            return this.createResult(false, `Frame / Fork Mount(${frameOrFork.brakeMount}) does not match Caliper(${caliper.mount})`);
        }

        // 3. Rotor Size
        // Rotor size must be <= Max Rotor Size
        // Note: Frame interface has maxRotorSize? Actually Frame interface in components.ts didn't have it explicitly for rear, 
        // but Fork did. Let's check safely.
        if ('maxRotorSize' in frameOrFork && frameOrFork.maxRotorSize) {
            if (rotor.size > frameOrFork.maxRotorSize) {
                return this.createResult(false, `Rotor size(${rotor.size}mm) exceeds max allowed(${frameOrFork.maxRotorSize}mm)`);
            }
        }

        return this.createResult(true, "Braking system is safe and compatible");
    }

    // --- 3.2 COCKPIT LOGIC ---

    static validateCockpit(
        stem: Stem,
        handlebar: Handlebar,
        frame: Frame,
        seatpost: Seatpost
    ): ValidationResult {
        // 1. Stem -> Handlebar Clamp
        if (stem.clampDia !== handlebar.clampDia) {
            return this.createResult(false, `Stem Clamp(${stem.clampDia}mm) does not match Handlebar(${handlebar.clampDia}mm)`);
        }

        // 2. Frame -> Seatpost
        if (frame.seatpostDia !== seatpost.diameter) {
            return this.createResult(false, `Frame Seat Tube(${frame.seatpostDia}mm) does not match Seatpost(${seatpost.diameter}mm)`);
        }

        // 3. Frame -> Stem (Steerer) - Already covered in FrameToFork? 
        // Actually Stem clamps to Fork Steerer.
        // We need a validateStemToFork method or include it here if we had the fork.
        // For now, just the bar/post checks.

        return this.createResult(true, "Cockpit components are compatible");
    }
    // --- 4.0 AGGREGATOR ---

    static validateBuild(build: {
        frame?: Frame;
        fork?: Fork;
        wheels?: Wheel[]; // Assuming array for set or individual
        tires?: Tire[];
        bottomBracket?: BottomBracket;
        crankset?: Crankset;
        cassette?: Cassette;
        rearDerailleur?: RearDerailleur;
        shifter?: Shifter;
        brakes?: { levers?: Shifter | BrakeCaliper; calipers?: BrakeCaliper[]; rotors?: BrakeRotor[] };
        cockpit?: { stem?: Stem; handlebar?: Handlebar; seatpost?: Seatpost };
    }): ValidationResult[] {
        const results: ValidationResult[] = [];

        // 1. Frame & Fork
        if (build.frame && build.fork) {
            results.push(this.validateFrameToFork(build.frame, build.fork));
        }

        // 2. Wheels
        if (build.frame && build.wheels) {
            build.wheels.forEach(wheel => {
                if (wheel.position === 'REAR') {
                    results.push(this.validateWheelToFrame(build.frame!, wheel));
                }
            });
        }
        if (build.fork && build.wheels) {
            build.wheels.forEach(wheel => {
                if (wheel.position === 'FRONT') {
                    results.push(this.validateWheelToFork(build.fork!, wheel));
                }
            });
        }

        // 3. Tires
        if (build.frame && build.tires) {
            build.tires.forEach(tire => {
                results.push(this.validateTireToFrame(build.frame!, tire));
            });
        }

        // 4. Drivetrain
        if (build.frame && build.bottomBracket && build.crankset) {
            results.push(this.validateBB(build.frame, build.bottomBracket, build.crankset));
        }
        if (build.shifter && build.rearDerailleur) {
            results.push(this.validateShifting(build.shifter, build.rearDerailleur));
        }
        if (build.crankset && build.frame) {
            results.push(this.validateChainline(build.crankset, build.frame));
        }
        if (build.crankset && build.cassette && build.rearDerailleur && build.wheels) {
            // Find rear wheel
            const rearWheel = build.wheels.find(w => w.position === 'REAR');
            if (rearWheel) {
                results.push(this.validateGearing(build.crankset, build.cassette, build.rearDerailleur, rearWheel));
            }
        }

        // 5. Brakes
        if (build.brakes && build.brakes.calipers && build.brakes.rotors && (build.frame || build.fork)) {
            // Complex mapping needed here. For now, simple check if we have pairs.
            // This is a simplified aggregator.
        }

        // 6. Cockpit
        if (build.cockpit && build.cockpit.stem && build.cockpit.handlebar && build.frame && build.cockpit.seatpost) {
            results.push(this.validateCockpit(build.cockpit.stem, build.cockpit.handlebar, build.frame, build.cockpit.seatpost));
        }

        return results;
    }
}
