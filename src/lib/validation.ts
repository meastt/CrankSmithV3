import { Component, ValidationIssue, CompatibilityResult } from './types/compatibility';

// Helper to add issues
function addIssue(issues: ValidationIssue[], componentId: string, message: string, severity: 'ERROR' | 'WARNING' = 'ERROR', conflictingId?: string) {
    issues.push({
        componentId,
        severity,
        message,
        conflictingComponentId: conflictingId
    });
}

// Helper to normalize strings strictly (lowercase, alphanumeric only)
function normalize(s: string | undefined): string {
    if (!s) return '';
    return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Helper: Check if arrays overlap
function haveOverlap(arr1: string[] | undefined, arr2: string[] | undefined): boolean {
    if (!arr1 || !arr2) return false;
    const n1 = arr1.map(normalize);
    const n2 = arr2.map(normalize);
    return n1.some(item => n2.includes(item));
}

// Helper: Check if value matches target (exact or included)
function isCompatibleValue(val1: string | undefined, val2: string | undefined): boolean {
    if (!val1 || !val2) return false;
    const n1 = normalize(val1);
    const n2 = normalize(val2);
    return n1 === n2 || n1.includes(n2) || n2.includes(n1);
}

// Helper: Normalize BB shell names to handle variations like BSA_Threaded vs BSA_Threaded_68mm
function normalizeBBShell(shell: string | undefined): string {
    if (!shell) return '';
    const upper = shell.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // BSA/English threaded - all variations are compatible with each other
    if (upper.includes('BSA') || upper.includes('THREADED') || upper.includes('ENGLISH')) {
        // Check for specific widths
        if (upper.includes('73')) return 'BSA73';
        return 'BSA68'; // Default to 68mm (most common)
    }

    // PF30 variants
    if (upper.includes('PF30') || (upper.includes('PRESSFIT') && upper.includes('30'))) {
        if (upper.includes('73')) return 'PF3073';
        return 'PF3068';
    }

    // BB30 (press fit 30mm shell)
    if (upper.includes('BB30')) {
        if (upper.includes('73')) return 'BB3073';
        return 'BB3068';
    }

    // BB86/BB92 (Shimano press fit)
    if (upper.includes('BB86')) return 'BB86';
    if (upper.includes('BB92')) return 'BB92';

    // T47 (threaded 47mm)
    if (upper.includes('T47')) {
        if (upper.includes('INTERNAL') || upper.includes('86')) return 'T47INTERNAL';
        return 'T47EXTERNAL';
    }

    // BB386 EVO
    if (upper.includes('386') || upper.includes('BB386')) return 'BB386EVO';

    return upper;
}

// Helper: Check if two BB shells are compatible
function bbShellsCompatible(frameShell: string | undefined, bbShell: string | undefined): boolean {
    if (!frameShell || !bbShell) return false;

    const frameNorm = normalizeBBShell(frameShell);
    const bbNorm = normalizeBBShell(bbShell);

    // Exact match
    if (frameNorm === bbNorm) return true;

    // BSA 68 and 73 are different widths but sometimes labeled generically
    // A BB labeled just "BSA" can fit either
    if ((frameNorm === 'BSA68' || frameNorm === 'BSA73') && bbNorm.startsWith('BSA')) return true;
    if ((bbNorm === 'BSA68' || bbNorm === 'BSA73') && frameNorm.startsWith('BSA')) return true;

    return false;
}

// Helper: Infer protocol from component name when not explicitly set
function inferProtocolFromName(name: string): string[] | null {
    if (!name) return null;
    const upper = name.toUpperCase();
    const isElectronic = upper.includes('DI2') || upper.includes('AXS') || upper.includes('ETAP') ||
                         upper.includes('WIRELESS') || upper.includes('EPS');

    // Shimano
    if (upper.includes('SHIMANO') || upper.includes('ULTEGRA') || upper.includes('DURA-ACE') ||
        upper.includes('105') || upper.includes('GRX') || upper.includes('DEORE') ||
        upper.includes('XT') || upper.includes('XTR') || upper.includes('SLX') ||
        upper.includes('TIAGRA') || upper.includes('SORA') || upper.includes('CUES')) {
        if (isElectronic) return ['Shimano_Di2'];
        // Speed-based protocol when possible
        const speedMatch = upper.match(/(\d{1,2})[\s-]?(?:SP|SPEED|S)/);
        if (speedMatch) {
            const speeds = parseInt(speedMatch[1]);
            if (speeds === 12) return ['Shimano_12s_Mech'];
            if (speeds === 11) return ['Shimano_11s_Mech'];
        }
        return ['Shimano_Mech'];
    }
    // SRAM
    if (upper.includes('SRAM') || upper.includes('RED') || upper.includes('FORCE') ||
        upper.includes('RIVAL') || upper.includes('APEX') || upper.includes('EAGLE') ||
        upper.includes('XX') || upper.includes('X0') || upper.includes('GX') ||
        upper.includes('NX') || upper.includes('SX')) {
        if (isElectronic || upper.includes('TRANSMISSION') || upper.includes('T-TYPE')) {
            return ['SRAM_AXS'];
        }
        if (upper.includes('EAGLE') || upper.includes('XX') || upper.includes('X0') ||
            upper.includes('GX') || upper.includes('NX') || upper.includes('SX')) {
            return ['SRAM_Eagle_Mech'];
        }
        return ['SRAM_Road_Mech'];
    }
    // Campagnolo
    if (upper.includes('CAMPAGNOLO') || upper.includes('CAMPY') || upper.includes('RECORD') ||
        upper.includes('CHORUS') || upper.includes('EKAR') || upper.includes('CENTAUR') ||
        upper.includes('POTENZA')) {
        return isElectronic ? ['Campagnolo_Electronic'] : ['Campagnolo_Mech'];
    }
    // L-Twoo
    if (upper.includes('L-TWOO') || upper.includes('LTWOO')) {
        return isElectronic ? ['L-Twoo_Wireless'] : ['L-Twoo_Mech'];
    }
    return null;
}

// Helper: Normalize freehub standard names
function normalizeFreehub(s: string): string {
    if (!s) return '';
    const upper = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (upper.includes('MICROSPLINE') || upper === 'MS') return 'MICROSPLINE';
    if (upper.includes('XDR')) return 'XDR';
    if (upper.includes('XD') && !upper.includes('XDR')) return 'XD';
    if (upper.includes('N3W')) return 'N3W';
    if (upper.includes('HG') || upper.includes('SHIMANOHG') || upper.includes('HYPERGLIDE')) return 'HG';
    if (upper.includes('SHIMANO') && !upper.includes('MICRO')) return 'HG';
    return upper;
}

// Helper: Parse freehub list (handles arrays and comma-separated strings)
function normalizeFreehubList(freehub: string | string[]): string[] {
    if (!freehub) return [];
    if (Array.isArray(freehub)) return freehub.map(normalizeFreehub);
    return freehub.split(',').map(f => normalizeFreehub(f.trim()));
}

// Helper: Check if wheel freehub supports cassette freehub
function freehubsCompatible(wheelStd: string, cassetteStd: string): boolean {
    if (wheelStd === cassetteStd) return true;
    // HG variants are generally interchangeable
    if (wheelStd === 'HG' && cassetteStd.startsWith('HG')) return true;
    if (wheelStd.startsWith('HG') && cassetteStd === 'HG') return true;
    // HG11 and HG are same
    if ((wheelStd === 'HG' || wheelStd === 'HG11') && (cassetteStd === 'HG' || cassetteStd === 'HG11')) return true;
    return false;
}

// ============================================================================
// BRAKE VALIDATION HELPERS
// ============================================================================

// Helper: Get brake fluid type from component
function getFluidType(component: any): string | null {
    const fluid = component.specs?.brake_fluid ||
                  component.interfaces?.brake_fluid ||
                  component.attributes?.brake_fluid ||
                  component.specs?.fluid ||
                  component.interfaces?.fluid;
    if (!fluid) return null;
    const upper = String(fluid).toUpperCase();
    if (upper.includes('DOT')) return 'DOT';
    if (upper.includes('MINERAL')) return 'MINERAL';
    return upper;
}

// Helper: Get brake actuation type (hydraulic or mechanical)
function getActuationType(component: any): string | null {
    const type = component.specs?.actuation ||
                 component.interfaces?.actuation ||
                 component.attributes?.type ||
                 component.specs?.brake_type ||
                 component.interfaces?.brake_type ||
                 component.name;
    if (!type) return null;
    const upper = String(type).toUpperCase();
    if (upper.includes('HYDRAULIC') || upper.includes('HYDRO')) return 'hydraulic';
    if (upper.includes('MECHANICAL') || upper.includes('CABLE')) return 'mechanical';
    return null;
}

// Helper: Check if brake mounts are compatible
function mountsCompatible(frameMount: string, caliperMount: string): boolean {
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

    // Disc variations (generic)
    if (fm.includes('disc') && cm.includes('disc')) {
        // Both are disc but different mount types
        if ((fm.includes('flat') && !cm.includes('flat')) ||
            (fm.includes('post') && !cm.includes('post'))) {
            return false;
        }
    }

    return false;
}

// Helper: Parse rotor size from various formats
function parseRotorSize(value: any): number | null {
    if (!value) return null;
    const num = parseInt(String(value).replace(/[^0-9]/g, ''));
    return isNaN(num) ? null : num;
}

// Helper: Check if rotor mount is compatible with wheel interface
function rotorMountCompatible(wheelInterface: string, rotorMount: string): boolean {
    const wi = normalize(wheelInterface);
    const rm = normalize(rotorMount);

    // Centerlock wheel needs centerlock rotor
    if (wi.includes('centerlock') || wi.includes('centrelock') || wi.includes('cl')) {
        return rm.includes('centerlock') || rm.includes('centrelock') || rm.includes('cl');
    }

    // 6-bolt wheel needs 6-bolt rotor
    if (wi.includes('6bolt') || wi.includes('6-bolt') || wi.includes('sixbolt')) {
        return rm.includes('6bolt') || rm.includes('6-bolt') || rm.includes('sixbolt');
    }

    return true; // Unknown, allow
}

// ============================================================================
// ZONE 1: ROLLING CHASSIS (Frame, Fork, Wheels, Tires)
// ============================================================================

// ============================================================================
// ZONE 1: ROLLING CHASSIS (Frame, Fork, Wheels, Tires)
// ============================================================================

function validateRollingChassis(build: any, issues: ValidationIssue[]) {
    const { frame, fork, wheels, tires, cockpit } = build;

    // 1. Frame <-> Fork
    if (frame && fork) {
        // Steerer Tube
        if (frame.specs?.headset && fork.specs?.steerer_tube) {
            const frameHeadset = normalize(frame.specs.headset);
            const forkSteerer = normalize(fork.specs.steerer_tube);

            if (frameHeadset.includes('1.5') && forkSteerer.includes('straight')) {
                addIssue(issues, fork.id, `Fork steerer (${fork.specs.steerer_tube}) may not fit frame headset (${frame.specs.headset})`, 'WARNING', frame.id);
            }
        }
    }

    // 2. Fork <-> Front Wheel
    const frontWheel = wheels.find((w: any) => w.specs?.position === 'Front' || w.specs?.position === 'Set');
    if (fork && frontWheel) {
        // Axle Standard
        if (!isCompatibleValue(fork.specs?.front_axle, frontWheel.specs?.axle || frontWheel.specs?.front_axle)) {
            addIssue(issues, frontWheel.id, `Front wheel axle (${frontWheel.specs?.axle}) does not match fork (${fork.specs?.front_axle})`, 'ERROR', fork.id);
        }
        // Wheel Size
        if (fork.specs?.max_tire_width) {
            const val = normalize(fork.specs.max_tire_width);
            const wheelSize = normalize(frontWheel.specs?.diameter);
            if (val.includes('700') && wheelSize.includes('650')) {
                addIssue(issues, frontWheel.id, `Fork explicitly designed for 700c, but selected wheel is 650b`, 'WARNING', fork.id);
            }
        }
    }

    // 3. Frame <-> Rear Wheel
    const rearWheel = wheels.find((w: any) => w.specs?.position === 'Rear' || w.specs?.position === 'Set');
    if (frame && rearWheel) {
        // Axle Standard
        if (!isCompatibleValue(frame.specs?.rear_axle, rearWheel.specs?.axle || rearWheel.specs?.rear_axle)) {
            addIssue(issues, rearWheel.id, `Rear wheel axle (${rearWheel.specs?.axle}) does not match frame (${frame.specs?.rear_axle})`, 'ERROR', frame.id);
        }
    }

    // 4. Tires
    tires.forEach((tire: any) => {
        const relevantWheel = wheels[0];
        if (relevantWheel) {
            if (!isCompatibleValue(tire.specs?.diameter, relevantWheel.specs?.diameter)) {
                addIssue(issues, tire.id, `Tire diameter (${tire.specs?.diameter}) does not match wheel (${relevantWheel.specs?.diameter})`, 'ERROR', relevantWheel.id);
            }
        }

        // Width Check
        if (frame && frame.specs?.max_tire_width) {
            const maxMm = parseFloat(String(frame.specs.max_tire_width).replace(/[^0-9.]/g, ''));
            const tireMm = parseFloat(String(tire.specs?.width || '0').replace(/[^0-9.]/g, ''));
            if (maxMm && tireMm && tireMm > maxMm) {
                addIssue(issues, tire.id, `Tire width (${tireMm}mm) exceeds frame clearance (${maxMm}mm)`, 'ERROR', frame.id);
            }
        }
    });
}

// ============================================================================
// ZONE 2: ENGINE ROOM (BB, Crank, Frame)
// ============================================================================

function validateEngineRoom(build: any, issues: ValidationIssue[]) {
    const { frame, bottomBracket, crankset } = build;

    // 1. Frame <-> BB shell compatibility
    if (frame && bottomBracket) {
        const frameShell = frame.specs?.bb_shell || frame.attributes?.bottom_bracket_shell;
        const bbShell = bottomBracket.specs?.bb_shell || bottomBracket.specs?.type ||
                        bottomBracket.attributes?.frame_shell;

        if (!bbShellsCompatible(frameShell, bbShell)) {
            addIssue(issues, bottomBracket.id,
                `Bottom Bracket shell (${bbShell || 'unknown'}) does not fit frame (${frameShell || 'unknown'})`,
                'ERROR', frame.id);
        }
    }

    // 2. BB <-> Crank spindle compatibility
    if (bottomBracket && crankset) {
        const bbSpindle = bottomBracket.specs?.spindle_interface || bottomBracket.specs?.spindle_type ||
                          bottomBracket.attributes?.spindle_interface;
        const crankSpindle = crankset.specs?.spindle_type || crankset.interfaces?.spindle_type ||
                             crankset.attributes?.spindle_type;

        if (bbSpindle && crankSpindle && !isCompatibleValue(bbSpindle, crankSpindle)) {
            addIssue(issues, crankset.id,
                `Crank spindle (${crankSpindle}) incompatible with BB (${bbSpindle})`,
                'ERROR', bottomBracket.id);
        }
    }
}

// ============================================================================
// ZONE 3: DRIVETRAIN (Shifters, Derailleurs, Cassette, Chain)
// ============================================================================

function validateDrivetrain(build: any, issues: ValidationIssue[]) {
    const { shifter, rearDerailleur, cassette, chain, crankset } = build;

    // 1. Protocol Match - with fallbacks to interfaces/attributes and name inference
    if (shifter && rearDerailleur) {
        // Try multiple locations for protocol
        const shifterProtocol = shifter.compatibility_tags?.protocol ||
                                (shifter.interfaces?.protocol ? [shifter.interfaces.protocol].flat() : null) ||
                                inferProtocolFromName(shifter.name);
        const rdProtocol = rearDerailleur.compatibility_tags?.protocol ||
                          (rearDerailleur.interfaces?.protocol ? [rearDerailleur.interfaces.protocol].flat() : null) ||
                          inferProtocolFromName(rearDerailleur.name);

        if (shifterProtocol?.length && rdProtocol?.length) {
            if (!haveOverlap(shifterProtocol, rdProtocol)) {
                addIssue(issues, shifter.id,
                    `Shifter protocol (${shifterProtocol.join(', ')}) incompatible with RD (${rdProtocol.join(', ')})`,
                    'ERROR', rearDerailleur.id);
            }
        }
    }

    // 2. Speeds Match - check multiple locations
    const components = [shifter, rearDerailleur, cassette, chain].filter(Boolean);
    const speeds = components.map(c => {
        return c.specs?.speeds || c.specs?.speed || c.attributes?.speeds || c.interfaces?.speeds;
    }).filter(Boolean);

    const uniqueSpeeds = new Set(speeds.map(s => Number(s)));
    if (uniqueSpeeds.size > 1) {
        addIssue(issues, 'drivetrain', `Drivetrain speed mismatch: [${Array.from(uniqueSpeeds).join(', ')}] speed components detected`, 'ERROR');
    }

    // 3. Capacity Check - with fallbacks
    if (rearDerailleur && cassette) {
        const maxCog = rearDerailleur.specs?.max_cog_capacity ||
                       rearDerailleur.attributes?.max_cog ||
                       rearDerailleur.interfaces?.max_cog;

        let cassetteLargest = cassette.specs?.largest_cog;
        if (!cassetteLargest) {
            // Parse from range string
            const range = cassette.specs?.range || cassette.attributes?.range || cassette.interfaces?.range;
            if (typeof range === 'string') {
                const match = range.match(/(\d+)[-](\d+)/);
                if (match) cassetteLargest = parseInt(match[2]);
            }
            // Or from cog_list array
            if (!cassetteLargest && cassette.attributes?.cog_list) {
                cassetteLargest = Math.max(...cassette.attributes.cog_list);
            }
        }

        if (maxCog && cassetteLargest && Number(cassetteLargest) > Number(maxCog)) {
            addIssue(issues, rearDerailleur.id,
                `Cassette largest cog (${cassetteLargest}T) exceeds RD capacity (${maxCog}T)`,
                'ERROR', cassette.id);
        }
    }

    // 4. Freehub Match - with improved normalization
    const rearWheel = build.wheels?.find((w: any) =>
        normalize(w.specs?.position) === 'rear' ||
        normalize(w.specs?.position) === 'set'
    );

    if (rearWheel && cassette) {
        // Get wheel freehub (may be array or comma-separated string)
        const wheelFreehub = rearWheel.specs?.freehub_body ||
                             rearWheel.interfaces?.freehub;
        const cassetteFreehub = cassette.specs?.freehub_body ||
                                cassette.interfaces?.freehub_mount ||
                                cassette.interfaces?.freehub_standard ||
                                cassette.attributes?.freehub_mount ||
                                cassette.attributes?.freehub_standard;

        if (wheelFreehub && cassetteFreehub) {
            const wheelList = normalizeFreehubList(wheelFreehub);
            const cassetteStd = normalizeFreehub(String(cassetteFreehub));

            // Check if any wheel freehub option matches the cassette
            if (wheelList.length > 0 && cassetteStd && !wheelList.some(w => freehubsCompatible(w, cassetteStd))) {
                addIssue(issues, cassette.id,
                    `Cassette freehub (${cassetteFreehub}) not compatible with wheel (${wheelFreehub})`,
                    'ERROR', rearWheel.id);
            }
        }
    }

    // 5. Chain Speed Match
    if (chain && cassette) {
        const chainSpeeds = Number(chain.specs?.speeds || chain.specs?.speed ||
                                   chain.attributes?.speeds || chain.interfaces?.speeds);
        const cassetteSpeeds = Number(cassette.specs?.speeds || cassette.specs?.speed ||
                                      cassette.attributes?.speeds || cassette.interfaces?.speeds);

        if (chainSpeeds && cassetteSpeeds && chainSpeeds !== cassetteSpeeds) {
            addIssue(
                issues,
                chain.id,
                `Chain speed (${chainSpeeds}s) does not match cassette (${cassetteSpeeds}s)`,
                'ERROR',
                cassette.id
            );
        }
    }

    // 6. Chain Type Compatibility (SRAM Flattop, Shimano Hyperglide+, etc.)
    if (chain && crankset) {
        const chainName = (chain.name || '').toUpperCase();
        const chainType = normalize(chain.specs?.chain_type || chain.interfaces?.chain_type || '');
        const crankName = (crankset.name || '').toUpperCase();
        const crankChainType = normalize(crankset.specs?.chain_type || crankset.interfaces?.chain_type || '');

        // SRAM Flattop chains require Flattop-compatible chainrings
        if (chainType.includes('flattop') || chainName.includes('FLATTOP')) {
            // Check if crankset is SRAM 12-speed compatible
            if (!crankName.includes('SRAM') && !crankName.includes('RED') &&
                !crankName.includes('FORCE') && !crankName.includes('RIVAL') &&
                !crankName.includes('APEX') && !crankChainType.includes('flattop')) {
                addIssue(
                    issues,
                    chain.id,
                    `SRAM Flattop chain requires Flattop-compatible chainring (SRAM 12-speed)`,
                    'ERROR',
                    crankset.id
                );
            }
        }

        // Shimano Hyperglide+ optimization warning (not error)
        if (chainName.includes('HYPERGLIDE') && chainName.includes('PLUS') ||
            chainName.includes('HG+') || chainName.includes('CN-M') && chainName.includes('12')) {
            if (!crankName.includes('SHIMANO') && !crankName.includes('DEORE') &&
                !crankName.includes('XT') && !crankName.includes('XTR') &&
                !crankName.includes('SLX')) {
                addIssue(
                    issues,
                    chain.id,
                    `Shimano Hyperglide+ chain optimized for Shimano chainrings`,
                    'WARNING',
                    crankset.id
                );
            }
        }

        // Campagnolo chain compatibility
        if (chainName.includes('CAMPAGNOLO') || chainName.includes('CAMPY')) {
            if (!crankName.includes('CAMPAGNOLO') && !crankName.includes('CAMPY') &&
                !crankName.includes('RECORD') && !crankName.includes('CHORUS') &&
                !crankName.includes('EKAR')) {
                addIssue(
                    issues,
                    chain.id,
                    `Campagnolo chain designed for Campagnolo drivetrains`,
                    'WARNING',
                    crankset.id
                );
            }
        }
    }
}

// ============================================================================
// GLOBAL VALIDATORS
// ============================================================================

function validateBrakes(build: any, issues: ValidationIssue[]) {
    const { frame, fork, shifter, wheels } = build;
    const brakes = build.brakes || {};
    const calipers = brakes.calipers || [];
    const rotors = brakes.rotors || [];

    // Find front and rear calipers
    const brakeCaliperFront = calipers.find((c: any) => {
        const pos = normalize(c.specs?.position || c.interfaces?.position || '');
        return pos === 'front' || pos === 'pair' || pos === 'set';
    });
    const brakeCaliperRear = calipers.find((c: any) => {
        const pos = normalize(c.specs?.position || c.interfaces?.position || '');
        return pos === 'rear' || pos === 'pair' || pos === 'set';
    });

    // Find front and rear rotors
    const rotorFront = rotors.find((r: any) => {
        const pos = normalize(r.specs?.position || r.interfaces?.position || '');
        return pos === 'front' || pos === 'pair' || pos === 'set';
    });
    const rotorRear = rotors.find((r: any) => {
        const pos = normalize(r.specs?.position || r.interfaces?.position || '');
        return pos === 'rear' || pos === 'pair' || pos === 'set';
    });

    // Find wheels
    const frontWheel = wheels?.find((w: any) => {
        const pos = normalize(w.specs?.position || w.interfaces?.position || '');
        return pos === 'front' || pos === 'set';
    });
    const rearWheel = wheels?.find((w: any) => {
        const pos = normalize(w.specs?.position || w.interfaces?.position || '');
        return pos === 'rear' || pos === 'set';
    });

    // 1. BRAKE FLUID COMPATIBILITY (CRITICAL SAFETY CHECK)
    // Check shifter/lever fluid vs caliper fluid
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

    // 2. ACTUATION TYPE COMPATIBILITY (Hydraulic vs Mechanical)
    if (shifter && brakeCaliperFront) {
        const leverType = getActuationType(shifter);
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

    // 3. FRAME BRAKE MOUNT COMPATIBILITY (REAR CALIPER)
    if (frame && brakeCaliperRear) {
        const frameMount = frame.specs?.brake_mount || frame.interfaces?.brake_mount;
        const caliperMount = brakeCaliperRear.specs?.mount || brakeCaliperRear.specs?.mount_type ||
                            brakeCaliperRear.interfaces?.mount || brakeCaliperRear.attributes?.mount;

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

    // 4. FORK BRAKE MOUNT COMPATIBILITY (FRONT CALIPER)
    if (fork && brakeCaliperFront) {
        const forkMount = fork.specs?.brake_mount || fork.interfaces?.brake_mount;
        const caliperMount = brakeCaliperFront.specs?.mount || brakeCaliperFront.specs?.mount_type ||
                            brakeCaliperFront.interfaces?.mount || brakeCaliperFront.attributes?.mount;

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

    // 5. ROTOR SIZE LIMITS (FORK - FRONT)
    if (fork && rotorFront) {
        const maxRotor = parseRotorSize(fork.specs?.max_rotor_size || fork.interfaces?.max_rotor);
        const rotorSize = parseRotorSize(rotorFront.specs?.size || rotorFront.specs?.diameter ||
                                         rotorFront.attributes?.size);

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

    // 6. ROTOR SIZE LIMITS (FRAME - REAR)
    if (frame && rotorRear) {
        const maxRotor = parseRotorSize(frame.specs?.max_rotor_size || frame.interfaces?.max_rotor);
        const rotorSize = parseRotorSize(rotorRear.specs?.size || rotorRear.specs?.diameter ||
                                         rotorRear.attributes?.size);

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

    // 7. ROTOR MOUNT COMPATIBILITY (WHEEL INTERFACE)
    if (frontWheel && rotorFront) {
        const wheelInterface = frontWheel.specs?.brake_interface || frontWheel.interfaces?.brake_type;
        const rotorMount = rotorFront.specs?.mount || rotorFront.interfaces?.mount ||
                          rotorFront.attributes?.mount;

        if (wheelInterface && rotorMount && !rotorMountCompatible(wheelInterface, rotorMount)) {
            addIssue(
                issues,
                rotorFront.id,
                `Front rotor mount (${rotorMount}) incompatible with wheel (${wheelInterface})`,
                'ERROR',
                frontWheel.id
            );
        }
    }

    if (rearWheel && rotorRear) {
        const wheelInterface = rearWheel.specs?.brake_interface || rearWheel.interfaces?.brake_type;
        const rotorMount = rotorRear.specs?.mount || rotorRear.interfaces?.mount ||
                          rotorRear.attributes?.mount;

        if (wheelInterface && rotorMount && !rotorMountCompatible(wheelInterface, rotorMount)) {
            addIssue(
                issues,
                rotorRear.id,
                `Rear rotor mount (${rotorMount}) incompatible with wheel (${wheelInterface})`,
                'ERROR',
                rearWheel.id
            );
        }
    }
}

export const Validator = {
    validateBuild(buildData: any): CompatibilityResult { // Using any for now to ease transition
        const issues: ValidationIssue[] = [];

        validateRollingChassis(buildData, issues);
        validateEngineRoom(buildData, issues);
        validateDrivetrain(buildData, issues);
        validateBrakes(buildData, issues);

        return {
            compatible: issues.filter(i => i.severity === 'ERROR').length === 0,
            issues
        };
    }
};
