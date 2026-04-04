import { Validator } from './validation';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeComponent(overrides: Record<string, any> = {}): any {
    return {
        id: overrides.id || 'test-component',
        name: overrides.name || 'Test Component',
        specs: {},
        compatibility_tags: {},
        interfaces: {},
        attributes: {},
        ...overrides,
    };
}

function makeBaseBuild(overrides: Record<string, any> = {}): any {
    return {
        frame: null,
        fork: null,
        wheels: [],
        tires: [],
        bottomBracket: null,
        crankset: null,
        shifter: null,
        rearDerailleur: null,
        cassette: null,
        chain: null,
        cockpit: { stem: null, handlebar: null, seatpost: null },
        brakes: { calipers: [], rotors: [] },
        ...overrides,
    };
}

// ---------------------------------------------------------------------------
// Full Build Templates
// ---------------------------------------------------------------------------

function makeShimanoDuraAceBuild() {
    return makeBaseBuild({
        frame: makeComponent({
            id: 'frame-1', name: 'Specialized Tarmac SL8',
            specs: {
                rear_axle: '12x142', bb_shell: 'BSA_Threaded_68mm',
                headset: 'IS42/IS52', max_tire_width: '32mm',
                brake_mount: 'Flat Mount', seatpost_diameter: '27.2',
            },
        }),
        fork: makeComponent({
            id: 'fork-1', name: 'Tarmac SL8 Carbon Fork',
            specs: {
                front_axle: '12x100', steerer_tube: '1 1/8 - 1 1/2',
                brake_mount: 'Flat Mount', max_rotor_size: '160mm',
            },
        }),
        wheels: [
            makeComponent({
                id: 'whl-f', name: 'Roval Rapide CLX',
                specs: {
                    position: 'Front', diameter: '700c', axle: '12x100',
                    brake_interface: 'Centerlock', freehub_body: 'Shimano HG',
                },
            }),
            makeComponent({
                id: 'whl-r', name: 'Roval Rapide CLX',
                specs: {
                    position: 'Rear', diameter: '700c', axle: '12x142',
                    brake_interface: 'Centerlock', freehub_body: 'Shimano HG',
                },
            }),
        ],
        tires: [
            makeComponent({
                id: 'tire-f', name: 'Continental GP5000S TR',
                specs: { diameter: '700c', width: '28' },
            }),
        ],
        bottomBracket: makeComponent({
            id: 'bb-1', name: 'Shimano Dura-Ace SM-BB92-41B',
            specs: { bb_shell: 'BSA_Threaded', spindle_interface: 'Shimano Hollowtech II' },
        }),
        crankset: makeComponent({
            id: 'crank-1', name: 'Shimano Dura-Ace FC-R9200',
            specs: { spindle_type: 'Hollowtech II', speeds: 12 },
        }),
        shifter: makeComponent({
            id: 'shifter-1', name: 'Shimano Dura-Ace Di2 ST-R9270',
            compatibility_tags: { protocol: ['Shimano_Di2'] },
            specs: { speeds: 12, brake_fluid: 'Mineral Oil', actuation: 'Hydraulic' },
        }),
        rearDerailleur: makeComponent({
            id: 'rd-1', name: 'Shimano Dura-Ace Di2 RD-R9250',
            compatibility_tags: { protocol: ['Shimano_Di2'] },
            specs: { speeds: 12, max_cog_capacity: 34 },
        }),
        cassette: makeComponent({
            id: 'cass-1', name: 'Shimano Dura-Ace CS-R9200',
            specs: { speeds: 12, largest_cog: 30, freehub_body: 'HG' },
        }),
        chain: makeComponent({
            id: 'chain-1', name: 'Shimano Dura-Ace CN-M9100',
            specs: { speeds: 12 },
        }),
        cockpit: {
            stem: makeComponent({
                id: 'stem-1', name: 'Zipp SL Sprint',
                specs: { clamp_dia: '31.8', steerer_clamp: '28.6' },
            }),
            handlebar: makeComponent({
                id: 'bar-1', name: 'Zipp SL-70 Ergo',
                specs: { clamp_dia: '31.8', bar_type: 'Drop' },
            }),
            seatpost: makeComponent({
                id: 'sp-1', name: 'Roval Alpinist',
                specs: { diameter: '27.2' },
            }),
        },
        brakes: {
            calipers: [
                makeComponent({
                    id: 'cal-f', name: 'Shimano Dura-Ace BR-R9270 Front',
                    specs: { position: 'Front', mount: 'Flat Mount', brake_fluid: 'Mineral Oil', actuation: 'Hydraulic' },
                }),
                makeComponent({
                    id: 'cal-r', name: 'Shimano Dura-Ace BR-R9270 Rear',
                    specs: { position: 'Rear', mount: 'Flat Mount', brake_fluid: 'Mineral Oil', actuation: 'Hydraulic' },
                }),
            ],
            rotors: [
                makeComponent({
                    id: 'rot-f', name: 'Shimano RT-CL900',
                    specs: { position: 'Front', size: '160mm', mount: 'Centerlock' },
                }),
                makeComponent({
                    id: 'rot-r', name: 'Shimano RT-CL900',
                    specs: { position: 'Rear', size: '140mm', mount: 'Centerlock' },
                }),
            ],
        },
    });
}

function makeSramRedAxsBuild() {
    return makeBaseBuild({
        frame: makeComponent({
            id: 'frame-2', name: 'Cervelo S5',
            specs: {
                rear_axle: '12x142', bb_shell: 'BSA_Threaded_68mm',
                headset: 'IS42/IS52', max_tire_width: '34mm',
                brake_mount: 'Flat Mount', seatpost_diameter: '27.2',
            },
        }),
        fork: makeComponent({
            id: 'fork-2', name: 'Cervelo S5 Carbon Fork',
            specs: {
                front_axle: '12x100', steerer_tube: '1 1/8 - 1 1/2',
                brake_mount: 'Flat Mount', max_rotor_size: '160mm',
            },
        }),
        wheels: [
            makeComponent({
                id: 'whl-f2', name: 'Zipp 404 Firecrest',
                specs: {
                    position: 'Front', diameter: '700c', axle: '12x100',
                    brake_interface: 'Centerlock', freehub_body: 'XDR',
                },
            }),
            makeComponent({
                id: 'whl-r2', name: 'Zipp 404 Firecrest',
                specs: {
                    position: 'Rear', diameter: '700c', axle: '12x142',
                    brake_interface: 'Centerlock', freehub_body: 'XDR',
                },
            }),
        ],
        tires: [
            makeComponent({
                id: 'tire-2', name: 'Continental GP5000S TR',
                specs: { diameter: '700c', width: '28' },
            }),
        ],
        bottomBracket: makeComponent({
            id: 'bb-2', name: 'SRAM DUB BSA',
            specs: { bb_shell: 'BSA_Threaded', spindle_interface: 'DUB' },
        }),
        crankset: makeComponent({
            id: 'crank-2', name: 'SRAM RED AXS Power Meter',
            specs: { spindle_type: 'DUB', speeds: 12, chain_type: 'Flattop' },
        }),
        shifter: makeComponent({
            id: 'shifter-2', name: 'SRAM RED AXS Shift/Brake Lever',
            compatibility_tags: { protocol: ['SRAM_AXS'] },
            specs: { speeds: 12, brake_fluid: 'DOT 5.1', actuation: 'Hydraulic' },
        }),
        rearDerailleur: makeComponent({
            id: 'rd-2', name: 'SRAM RED AXS Rear Derailleur',
            compatibility_tags: { protocol: ['SRAM_AXS'] },
            specs: { speeds: 12, max_cog_capacity: 36 },
        }),
        cassette: makeComponent({
            id: 'cass-2', name: 'SRAM RED AXS XG-1290',
            specs: { speeds: 12, largest_cog: 33, freehub_body: 'XDR' },
        }),
        chain: makeComponent({
            id: 'chain-2', name: 'SRAM RED Flattop Chain',
            specs: { speeds: 12, chain_type: 'Flattop' },
        }),
        cockpit: {
            stem: makeComponent({
                id: 'stem-2', name: 'Zipp SL Sprint',
                specs: { clamp_dia: '31.8', steerer_clamp: '28.6' },
            }),
            handlebar: makeComponent({
                id: 'bar-2', name: 'Zipp SL-70 Aero',
                specs: { clamp_dia: '31.8', bar_type: 'Drop' },
            }),
            seatpost: makeComponent({
                id: 'sp-2', name: 'Cervelo SP21',
                specs: { diameter: '27.2' },
            }),
        },
        brakes: {
            calipers: [
                makeComponent({
                    id: 'cal-f2', name: 'SRAM RED AXS Caliper Front',
                    specs: { position: 'Front', mount: 'Flat Mount', brake_fluid: 'DOT 5.1', actuation: 'Hydraulic' },
                }),
                makeComponent({
                    id: 'cal-r2', name: 'SRAM RED AXS Caliper Rear',
                    specs: { position: 'Rear', mount: 'Flat Mount', brake_fluid: 'DOT 5.1', actuation: 'Hydraulic' },
                }),
            ],
            rotors: [
                makeComponent({
                    id: 'rot-f2', name: 'SRAM Centerline XR',
                    specs: { position: 'Front', size: '160mm', mount: 'Centerlock' },
                }),
                makeComponent({
                    id: 'rot-r2', name: 'SRAM Centerline XR',
                    specs: { position: 'Rear', size: '140mm', mount: 'Centerlock' },
                }),
            ],
        },
    });
}

function makeMtbEagleBuild() {
    return makeBaseBuild({
        frame: makeComponent({
            id: 'frame-3', name: 'Santa Cruz Hightower',
            specs: {
                rear_axle: '12x148', bb_shell: 'BSA_Threaded_73mm',
                headset: 'ZS44/ZS56', max_tire_width: '63mm',
                brake_mount: 'Post Mount', seatpost_diameter: '31.6',
            },
        }),
        fork: makeComponent({
            id: 'fork-3', name: 'Fox 36 Factory',
            specs: {
                front_axle: '15x110', steerer_tube: '1 1/8 - 1 1/2',
                brake_mount: 'Post Mount', max_rotor_size: '203mm',
            },
        }),
        wheels: [
            makeComponent({
                id: 'whl-f3', name: 'DT Swiss XM 1700',
                specs: {
                    position: 'Front', diameter: '29"', axle: '15x110',
                    brake_interface: 'Centerlock', freehub_body: 'XD',
                },
            }),
            makeComponent({
                id: 'whl-r3', name: 'DT Swiss XM 1700',
                specs: {
                    position: 'Rear', diameter: '29"', axle: '12x148',
                    brake_interface: 'Centerlock', freehub_body: 'XD',
                },
            }),
        ],
        tires: [
            makeComponent({
                id: 'tire-3', name: 'Maxxis Minion DHF 29x2.5',
                specs: { diameter: '29"', width: '63' },
            }),
        ],
        bottomBracket: makeComponent({
            id: 'bb-3', name: 'SRAM DUB BSA 73mm',
            specs: { bb_shell: 'BSA_Threaded_73mm', spindle_interface: 'DUB' },
        }),
        crankset: makeComponent({
            id: 'crank-3', name: 'SRAM XX Eagle AXS Crankset',
            specs: { spindle_type: 'DUB', speeds: 12 },
        }),
        shifter: makeComponent({
            id: 'shifter-3', name: 'SRAM XX Eagle AXS Controller',
            compatibility_tags: { protocol: ['SRAM_AXS'] },
            specs: { speeds: 12 },
        }),
        rearDerailleur: makeComponent({
            id: 'rd-3', name: 'SRAM XX Eagle AXS T-Type Rear Derailleur',
            compatibility_tags: { protocol: ['SRAM_AXS'] },
            specs: { speeds: 12, max_cog_capacity: 52 },
        }),
        cassette: makeComponent({
            id: 'cass-3', name: 'SRAM XX Eagle AXS XS-1297',
            specs: { speeds: 12, largest_cog: 52, freehub_body: 'XD' },
        }),
        chain: makeComponent({
            id: 'chain-3', name: 'SRAM XX Eagle T-Type Chain',
            specs: { speeds: 12 },
        }),
        cockpit: {
            stem: makeComponent({
                id: 'stem-3', name: 'Race Face Turbine R 35',
                specs: { clamp_dia: '35', steerer_clamp: '28.6' },
            }),
            handlebar: makeComponent({
                id: 'bar-3', name: 'Race Face Next 35',
                specs: { clamp_dia: '35', bar_type: 'Flat' },
            }),
            seatpost: makeComponent({
                id: 'sp-3', name: 'Fox Transfer',
                specs: { diameter: '31.6' },
            }),
        },
        brakes: {
            calipers: [
                makeComponent({
                    id: 'cal-f3', name: 'SRAM Code RSC Front',
                    specs: { position: 'Front', mount: 'Post Mount', brake_fluid: 'DOT 5.1', actuation: 'Hydraulic' },
                }),
                makeComponent({
                    id: 'cal-r3', name: 'SRAM Code RSC Rear',
                    specs: { position: 'Rear', mount: 'Post Mount', brake_fluid: 'DOT 5.1', actuation: 'Hydraulic' },
                }),
            ],
            rotors: [
                makeComponent({
                    id: 'rot-f3', name: 'SRAM Centerline',
                    specs: { position: 'Front', size: '200mm', mount: 'Centerlock' },
                }),
                makeComponent({
                    id: 'rot-r3', name: 'SRAM Centerline',
                    specs: { position: 'Rear', size: '180mm', mount: 'Centerlock' },
                }),
            ],
        },
    });
}

// ===========================================================================
// TESTS
// ===========================================================================

describe('Validator.validateBuild', () => {

    // -----------------------------------------------------------------------
    // ZONE 1: Rolling Chassis
    // -----------------------------------------------------------------------

    describe('ZONE 1: Rolling Chassis', () => {
        it('should warn when 1.5" headset frame paired with straight steerer fork', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { headset: '1.5 only' },
                }),
                fork: makeComponent({
                    id: 'fk', specs: { steerer_tube: 'Straight 1 1/8' },
                }),
            });
            const result = Validator.validateBuild(build);
            const steerIssue = result.issues.find(i =>
                i.message.toLowerCase().includes('steerer') || i.message.toLowerCase().includes('headset')
            );
            expect(steerIssue).toBeDefined();
            expect(steerIssue!.severity).toBe('WARNING');
        });

        it('should error when fork front axle does not match wheel axle', () => {
            const build = makeBaseBuild({
                fork: makeComponent({
                    id: 'fk', specs: { front_axle: '12x100' },
                }),
                wheels: [
                    makeComponent({
                        id: 'wf', specs: { position: 'Front', axle: '15x110' },
                    }),
                ],
            });
            const result = Validator.validateBuild(build);
            const axleIssue = result.issues.find(i =>
                i.componentId === 'wf' && i.severity === 'ERROR' && i.message.toLowerCase().includes('axle')
            );
            expect(axleIssue).toBeDefined();
        });

        it('should error when frame rear axle does not match wheel axle', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { rear_axle: '12x142' },
                }),
                wheels: [
                    makeComponent({
                        id: 'wr', specs: { position: 'Rear', axle: '12x148' },
                    }),
                ],
            });
            const result = Validator.validateBuild(build);
            const axleIssue = result.issues.find(i =>
                i.componentId === 'wr' && i.severity === 'ERROR' && i.message.toLowerCase().includes('axle')
            );
            expect(axleIssue).toBeDefined();
        });

        it('should error when tire diameter does not match wheel diameter', () => {
            const build = makeBaseBuild({
                wheels: [
                    makeComponent({
                        id: 'w', specs: { position: 'Front', diameter: '700c' },
                    }),
                ],
                tires: [
                    makeComponent({
                        id: 't', specs: { diameter: '650b', width: '47' },
                    }),
                ],
            });
            const result = Validator.validateBuild(build);
            const diamIssue = result.issues.find(i =>
                i.componentId === 't' && i.severity === 'ERROR' && i.message.toLowerCase().includes('diameter')
            );
            expect(diamIssue).toBeDefined();
        });

        it('should error when tire width exceeds frame clearance', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { max_tire_width: '32mm' },
                }),
                wheels: [
                    makeComponent({ id: 'w', specs: { position: 'Front', diameter: '700c' } }),
                ],
                tires: [
                    makeComponent({
                        id: 't', specs: { diameter: '700c', width: '40' },
                    }),
                ],
            });
            const result = Validator.validateBuild(build);
            const widthIssue = result.issues.find(i =>
                i.componentId === 't' && i.severity === 'ERROR' && i.message.toLowerCase().includes('exceeds')
            );
            expect(widthIssue).toBeDefined();
        });

        it('should pass when tire fits within frame clearance', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { max_tire_width: '32mm' },
                }),
                wheels: [
                    makeComponent({ id: 'w', specs: { position: 'Front', diameter: '700c' } }),
                ],
                tires: [
                    makeComponent({
                        id: 't', specs: { diameter: '700c', width: '28' },
                    }),
                ],
            });
            const result = Validator.validateBuild(build);
            const widthIssue = result.issues.find(i =>
                i.componentId === 't' && i.message.toLowerCase().includes('exceeds')
            );
            expect(widthIssue).toBeUndefined();
        });
    });

    // -----------------------------------------------------------------------
    // ZONE 2: Engine Room
    // -----------------------------------------------------------------------

    describe('ZONE 2: Engine Room', () => {
        it('should pass when BSA frame matches BSA BB', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: { bb_shell: 'BSA_Threaded_68mm' } }),
                bottomBracket: makeComponent({ id: 'bb', specs: { bb_shell: 'BSA_Threaded' } }),
            });
            const result = Validator.validateBuild(build);
            const bbIssue = result.issues.find(i =>
                i.componentId === 'bb' && i.severity === 'ERROR' && i.message.toLowerCase().includes('bottom bracket')
            );
            expect(bbIssue).toBeUndefined();
        });

        it('should error when BSA frame paired with T47 BB', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: { bb_shell: 'BSA_Threaded_68mm' } }),
                bottomBracket: makeComponent({ id: 'bb', specs: { bb_shell: 'T47_External' } }),
            });
            const result = Validator.validateBuild(build);
            const bbIssue = result.issues.find(i =>
                i.componentId === 'bb' && i.severity === 'ERROR' && i.message.toLowerCase().includes('bottom bracket')
            );
            expect(bbIssue).toBeDefined();
        });

        it('should pass when T47_INT_68 frame pairs with T47 68mm internal BB and matching spindles', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: { bb_shell: 'T47_INT_68' } }),
                bottomBracket: makeComponent({
                    id: 'bb',
                    specs: { bb_shell: 'T47_Internal_68mm', spindle_interface: 'DUB_28.99mm' },
                }),
                crankset: makeComponent({ id: 'c', specs: { spindle_type: 'DUB' } }),
            });
            const result = Validator.validateBuild(build);
            const bbShellIssue = result.issues.find(
                i =>
                    i.componentId === 'bb' &&
                    i.severity === 'ERROR' &&
                    i.message.toLowerCase().includes('bottom bracket shell')
            );
            const spindleIssue = result.issues.find(
                i =>
                    i.componentId === 'c' &&
                    i.severity === 'ERROR' &&
                    i.message.toLowerCase().includes('spindle')
            );
            expect(bbShellIssue).toBeUndefined();
            expect(spindleIssue).toBeUndefined();
        });

        it('should error when T47_INT_68 frame pairs with T47 86mm internal BB', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: { bb_shell: 'T47_INT_68' } }),
                bottomBracket: makeComponent({
                    id: 'bb',
                    specs: { bb_shell: 'T47_Internal_86mm', spindle_interface: 'DUB_28.99mm' },
                }),
                crankset: makeComponent({ id: 'c', specs: { spindle_type: 'DUB' } }),
            });
            const result = Validator.validateBuild(build);
            const bbIssue = result.issues.find(
                i =>
                    i.componentId === 'bb' &&
                    i.severity === 'ERROR' &&
                    i.message.toLowerCase().includes('bottom bracket shell')
            );
            expect(bbIssue).toBeDefined();
        });

        it('should pass when BSA68 frame paired with generic BSA BB', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: { bb_shell: 'BSA_Threaded_68mm' } }),
                bottomBracket: makeComponent({ id: 'bb', specs: { bb_shell: 'BSA' } }),
            });
            const result = Validator.validateBuild(build);
            const bbIssue = result.issues.find(i =>
                i.componentId === 'bb' && i.severity === 'ERROR' && i.message.toLowerCase().includes('bottom bracket')
            );
            expect(bbIssue).toBeUndefined();
        });

        it('should error when BB spindle mismatches crank spindle', () => {
            const build = makeBaseBuild({
                bottomBracket: makeComponent({
                    id: 'bb', specs: { spindle_interface: 'DUB' },
                }),
                crankset: makeComponent({
                    id: 'c', specs: { spindle_type: 'Shimano Hollowtech II' },
                }),
            });
            const result = Validator.validateBuild(build);
            const spindleIssue = result.issues.find(i =>
                i.componentId === 'c' && i.severity === 'ERROR' && i.message.toLowerCase().includes('spindle')
            );
            expect(spindleIssue).toBeDefined();
        });

        it('should pass when BB and crank spindle match', () => {
            const build = makeBaseBuild({
                bottomBracket: makeComponent({
                    id: 'bb', specs: { spindle_interface: 'DUB' },
                }),
                crankset: makeComponent({
                    id: 'c', specs: { spindle_type: 'DUB' },
                }),
            });
            const result = Validator.validateBuild(build);
            const spindleIssue = result.issues.find(i =>
                i.componentId === 'c' && i.severity === 'ERROR' && i.message.toLowerCase().includes('spindle')
            );
            expect(spindleIssue).toBeUndefined();
        });
    });

    // -----------------------------------------------------------------------
    // ZONE 3: Drivetrain
    // -----------------------------------------------------------------------

    describe('ZONE 3: Drivetrain', () => {
        it('should error on Shimano Di2 shifter + SRAM AXS RD (protocol mismatch)', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Shimano Dura-Ace Di2 ST-R9270',
                    compatibility_tags: { protocol: ['Shimano_Di2'] },
                    specs: { speeds: 12 },
                }),
                rearDerailleur: makeComponent({
                    id: 'rd', name: 'SRAM RED AXS RD',
                    compatibility_tags: { protocol: ['SRAM_AXS'] },
                    specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const protocolIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('protocol')
            );
            expect(protocolIssue).toBeDefined();
            expect(result.compatible).toBe(false);
        });

        it('should error on 11-speed cassette + 12-speed chain (speed mismatch)', () => {
            const build = makeBaseBuild({
                cassette: makeComponent({
                    id: 'cass', specs: { speeds: 11 },
                }),
                chain: makeComponent({
                    id: 'ch', specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const speedIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('speed')
            );
            expect(speedIssue).toBeDefined();
        });

        it('should error on drivetrain speed mismatch across multiple components', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Shimano Ultegra Di2 ST-R8170',
                    compatibility_tags: { protocol: ['Shimano_Di2'] },
                    specs: { speeds: 12 },
                }),
                rearDerailleur: makeComponent({
                    id: 'rd', name: 'Shimano Ultegra Di2 RD-R8150',
                    compatibility_tags: { protocol: ['Shimano_Di2'] },
                    specs: { speeds: 11 },
                }),
                cassette: makeComponent({
                    id: 'cass', specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const speedIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('speed mismatch')
            );
            expect(speedIssue).toBeDefined();
        });

        it('should error when RD cog capacity is exceeded', () => {
            const build = makeBaseBuild({
                rearDerailleur: makeComponent({
                    id: 'rd', specs: { max_cog_capacity: 34 },
                }),
                cassette: makeComponent({
                    id: 'cass', specs: { largest_cog: 36 },
                }),
            });
            const result = Validator.validateBuild(build);
            const cogIssue = result.issues.find(i =>
                i.componentId === 'rd' && i.severity === 'ERROR' && i.message.toLowerCase().includes('cog')
            );
            expect(cogIssue).toBeDefined();
        });

        it('should pass when RD cog capacity is sufficient', () => {
            const build = makeBaseBuild({
                rearDerailleur: makeComponent({
                    id: 'rd', specs: { max_cog_capacity: 36 },
                }),
                cassette: makeComponent({
                    id: 'cass', specs: { largest_cog: 34 },
                }),
            });
            const result = Validator.validateBuild(build);
            const cogIssue = result.issues.find(i =>
                i.componentId === 'rd' && i.severity === 'ERROR' && i.message.toLowerCase().includes('cog')
            );
            expect(cogIssue).toBeUndefined();
        });

        it('should error when XDR cassette on HG-only wheel (freehub mismatch)', () => {
            const build = makeBaseBuild({
                wheels: [
                    makeComponent({
                        id: 'wr', specs: { position: 'Rear', freehub_body: 'Shimano HG' },
                    }),
                ],
                cassette: makeComponent({
                    id: 'cass', specs: { freehub_body: 'XDR' },
                }),
            });
            const result = Validator.validateBuild(build);
            const fhIssue = result.issues.find(i =>
                i.componentId === 'cass' && i.severity === 'ERROR' && i.message.toLowerCase().includes('freehub')
            );
            expect(fhIssue).toBeDefined();
        });

        it('should pass when Shimano HG cassette on HG wheel', () => {
            const build = makeBaseBuild({
                wheels: [
                    makeComponent({
                        id: 'wr', specs: { position: 'Rear', freehub_body: 'Shimano HG' },
                    }),
                ],
                cassette: makeComponent({
                    id: 'cass', specs: { freehub_body: 'HG' },
                }),
            });
            const result = Validator.validateBuild(build);
            const fhIssue = result.issues.find(i =>
                i.componentId === 'cass' && i.severity === 'ERROR' && i.message.toLowerCase().includes('freehub')
            );
            expect(fhIssue).toBeUndefined();
        });

        it('should error when SRAM Flattop chain paired with Shimano crankset', () => {
            const build = makeBaseBuild({
                chain: makeComponent({
                    id: 'ch', name: 'SRAM RED Flattop Chain',
                    specs: { speeds: 12, chain_type: 'Flattop' },
                }),
                crankset: makeComponent({
                    id: 'c', name: 'Shimano Dura-Ace FC-R9200',
                    specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const flatIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('flattop')
            );
            expect(flatIssue).toBeDefined();
        });

        it('should pass SRAM Flattop chain with SRAM crankset', () => {
            const build = makeBaseBuild({
                chain: makeComponent({
                    id: 'ch', name: 'SRAM RED Flattop Chain',
                    specs: { speeds: 12, chain_type: 'Flattop' },
                }),
                crankset: makeComponent({
                    id: 'c', name: 'SRAM RED AXS Crankset',
                    specs: { speeds: 12, chain_type: 'Flattop' },
                }),
            });
            const result = Validator.validateBuild(build);
            const flatIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('flattop')
            );
            expect(flatIssue).toBeUndefined();
        });

        it('should infer protocol from component name when tags missing', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Shimano 105 ST-R7120',
                    specs: { speeds: 12 },
                }),
                rearDerailleur: makeComponent({
                    id: 'rd', name: 'SRAM Rival AXS RD',
                    specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const protocolIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('protocol')
            );
            expect(protocolIssue).toBeDefined();
        });
    });

    // -----------------------------------------------------------------------
    // ZONE 4: Cockpit
    // -----------------------------------------------------------------------

    describe('ZONE 4: Cockpit', () => {
        it('should error when stem clamp does not match handlebar clamp', () => {
            const build = makeBaseBuild({
                cockpit: {
                    stem: makeComponent({
                        id: 'st', specs: { clamp_dia: '31.8' },
                    }),
                    handlebar: makeComponent({
                        id: 'hb', specs: { clamp_dia: '25.4' },
                    }),
                    seatpost: null,
                },
            });
            const result = Validator.validateBuild(build);
            const clampIssue = result.issues.find(i =>
                i.componentId === 'st' && i.severity === 'ERROR' && i.message.toLowerCase().includes('clamp')
            );
            expect(clampIssue).toBeDefined();
        });

        it('should pass when stem and handlebar clamp diameters match', () => {
            const build = makeBaseBuild({
                cockpit: {
                    stem: makeComponent({
                        id: 'st', specs: { clamp_dia: '31.8' },
                    }),
                    handlebar: makeComponent({
                        id: 'hb', specs: { clamp_dia: '31.8' },
                    }),
                    seatpost: null,
                },
            });
            const result = Validator.validateBuild(build);
            const clampIssue = result.issues.find(i =>
                i.componentId === 'st' && i.severity === 'ERROR' && i.message.toLowerCase().includes('clamp')
            );
            expect(clampIssue).toBeUndefined();
        });

        it('should error when drop bar shifter is used with flat handlebar', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Test Shifter',
                    compatibility_tags: { shifter_brake_type: ['Drop'] },
                }),
                cockpit: {
                    stem: null,
                    handlebar: makeComponent({
                        id: 'hb', specs: { bar_type: 'Flat' },
                    }),
                    seatpost: null,
                },
            });
            const result = Validator.validateBuild(build);
            const typeIssue = result.issues.find(i =>
                i.componentId === 'sh' && i.severity === 'ERROR' && i.message.toLowerCase().includes('compatible')
            );
            expect(typeIssue).toBeDefined();
        });

        it('should error when seatpost diameter does not match frame', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { seatpost_diameter: '27.2' },
                }),
                cockpit: {
                    stem: null,
                    handlebar: null,
                    seatpost: makeComponent({
                        id: 'sp', specs: { diameter: '30.9' },
                    }),
                },
            });
            const result = Validator.validateBuild(build);
            const spIssue = result.issues.find(i =>
                i.componentId === 'sp' && i.severity === 'ERROR' && i.message.toLowerCase().includes('seatpost')
            );
            expect(spIssue).toBeDefined();
        });
    });

    // -----------------------------------------------------------------------
    // ZONE 5: Brakes
    // -----------------------------------------------------------------------

    describe('ZONE 5: Brakes', () => {
        it('should error on DOT lever + Mineral caliper (SAFETY CRITICAL)', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'SRAM RED AXS Lever',
                    specs: { brake_fluid: 'DOT 5.1' },
                }),
                brakes: {
                    calipers: [
                        makeComponent({
                            id: 'cal-f', specs: { position: 'Front', brake_fluid: 'Mineral Oil' },
                        }),
                    ],
                    rotors: [],
                },
            });
            const result = Validator.validateBuild(build);
            const fluidIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toUpperCase().includes('SAFETY')
            );
            expect(fluidIssue).toBeDefined();
            expect(result.compatible).toBe(false);
        });

        it('should pass when lever and caliper use same brake fluid', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', specs: { brake_fluid: 'Mineral Oil' },
                }),
                brakes: {
                    calipers: [
                        makeComponent({
                            id: 'cal-f', specs: { position: 'Front', brake_fluid: 'Mineral Oil' },
                        }),
                    ],
                    rotors: [],
                },
            });
            const result = Validator.validateBuild(build);
            const fluidIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toUpperCase().includes('SAFETY')
            );
            expect(fluidIssue).toBeUndefined();
        });

        it('should error on hydraulic lever + mechanical caliper', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', specs: { actuation: 'Hydraulic' },
                }),
                brakes: {
                    calipers: [
                        makeComponent({
                            id: 'cal-f', specs: { position: 'Front', actuation: 'Mechanical' },
                        }),
                    ],
                    rotors: [],
                },
            });
            const result = Validator.validateBuild(build);
            const actuationIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('actuation')
            );
            expect(actuationIssue).toBeDefined();
        });

        it('should error on flat mount frame + post mount caliper', () => {
            const build = makeBaseBuild({
                frame: makeComponent({
                    id: 'f', specs: { brake_mount: 'Flat Mount' },
                }),
                brakes: {
                    calipers: [
                        makeComponent({
                            id: 'cal-r', specs: { position: 'Rear', mount: 'Post Mount' },
                        }),
                    ],
                    rotors: [],
                },
            });
            const result = Validator.validateBuild(build);
            const mountIssue = result.issues.find(i =>
                i.componentId === 'cal-r' && i.severity === 'ERROR' && i.message.toLowerCase().includes('mount')
            );
            expect(mountIssue).toBeDefined();
        });

        it('should error when front rotor exceeds fork max size', () => {
            const build = makeBaseBuild({
                fork: makeComponent({
                    id: 'fk', specs: { max_rotor_size: '160mm' },
                }),
                brakes: {
                    calipers: [],
                    rotors: [
                        makeComponent({
                            id: 'rot-f', specs: { position: 'Front', size: '180mm' },
                        }),
                    ],
                },
            });
            const result = Validator.validateBuild(build);
            const rotorIssue = result.issues.find(i =>
                i.componentId === 'rot-f' && i.severity === 'ERROR' && i.message.toLowerCase().includes('rotor')
            );
            expect(rotorIssue).toBeDefined();
        });

        it('should pass when rotor is within fork max size', () => {
            const build = makeBaseBuild({
                fork: makeComponent({
                    id: 'fk', specs: { max_rotor_size: '160mm' },
                }),
                brakes: {
                    calipers: [],
                    rotors: [
                        makeComponent({
                            id: 'rot-f', specs: { position: 'Front', size: '140mm' },
                        }),
                    ],
                },
            });
            const result = Validator.validateBuild(build);
            const rotorIssue = result.issues.find(i =>
                i.componentId === 'rot-f' && i.severity === 'ERROR' && i.message.toLowerCase().includes('exceeds')
            );
            expect(rotorIssue).toBeUndefined();
        });

        it('should error on centerlock wheel + 6-bolt rotor', () => {
            const build = makeBaseBuild({
                wheels: [
                    makeComponent({
                        id: 'wf', specs: { position: 'Front', brake_interface: 'Centerlock' },
                    }),
                ],
                brakes: {
                    calipers: [],
                    rotors: [
                        makeComponent({
                            id: 'rot-f', specs: { position: 'Front', mount: '6-bolt' },
                        }),
                    ],
                },
            });
            const result = Validator.validateBuild(build);
            const mountIssue = result.issues.find(i =>
                i.componentId === 'rot-f' && i.severity === 'ERROR' && i.message.toLowerCase().includes('rotor mount')
            );
            expect(mountIssue).toBeDefined();
        });
    });

    // -----------------------------------------------------------------------
    // Full Integration Builds
    // -----------------------------------------------------------------------

    describe('Full Integration Builds', () => {
        it('Shimano Dura-Ace Di2 road build should have zero errors', () => {
            const build = makeShimanoDuraAceBuild();
            const result = Validator.validateBuild(build);
            const errors = result.issues.filter(i => i.severity === 'ERROR');
            if (errors.length > 0) {
                console.log('Unexpected errors in Shimano build:', JSON.stringify(errors, null, 2));
            }
            expect(errors).toHaveLength(0);
            expect(result.compatible).toBe(true);
        });

        it('SRAM Red AXS road build should have zero errors', () => {
            const build = makeSramRedAxsBuild();
            const result = Validator.validateBuild(build);
            const errors = result.issues.filter(i => i.severity === 'ERROR');
            if (errors.length > 0) {
                console.log('Unexpected errors in SRAM build:', JSON.stringify(errors, null, 2));
            }
            expect(errors).toHaveLength(0);
            expect(result.compatible).toBe(true);
        });

        it('MTB Eagle build should have zero errors', () => {
            const build = makeMtbEagleBuild();
            const result = Validator.validateBuild(build);
            const errors = result.issues.filter(i => i.severity === 'ERROR');
            if (errors.length > 0) {
                console.log('Unexpected errors in MTB build:', JSON.stringify(errors, null, 2));
            }
            expect(errors).toHaveLength(0);
            expect(result.compatible).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // Edge Cases
    // -----------------------------------------------------------------------

    describe('Edge Cases', () => {
        it('empty build (all nulls) should not crash and should be compatible', () => {
            const build = makeBaseBuild();
            const result = Validator.validateBuild(build);
            expect(result.compatible).toBe(true);
            expect(result.issues).toHaveLength(0);
        });

        it('build with empty arrays should not crash', () => {
            const build = makeBaseBuild({
                wheels: [],
                tires: [],
                brakes: { calipers: [], rotors: [] },
            });
            expect(() => Validator.validateBuild(build)).not.toThrow();
        });

        it('components with undefined specs should not crash', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: undefined }),
                fork: makeComponent({ id: 'fk', specs: undefined }),
            });
            expect(() => Validator.validateBuild(build)).not.toThrow();
        });

        it('components with missing name should not crash protocol inference', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({ id: 'sh', name: '', specs: { speeds: 12 } }),
                rearDerailleur: makeComponent({ id: 'rd', name: '', specs: { speeds: 12 } }),
            });
            expect(() => Validator.validateBuild(build)).not.toThrow();
        });

        it('components with empty specs object should not crash', () => {
            const build = makeBaseBuild({
                frame: makeComponent({ id: 'f', specs: {} }),
                fork: makeComponent({ id: 'fk', specs: {} }),
                bottomBracket: makeComponent({ id: 'bb', specs: {} }),
                crankset: makeComponent({ id: 'c', specs: {} }),
                shifter: makeComponent({ id: 'sh', specs: {} }),
                rearDerailleur: makeComponent({ id: 'rd', specs: {} }),
                cassette: makeComponent({ id: 'cass', specs: {} }),
            });
            expect(() => Validator.validateBuild(build)).not.toThrow();
        });
    });

    // -----------------------------------------------------------------------
    // Cross-Platform Parity: Golden Fixture Tests
    // -----------------------------------------------------------------------

    describe('Golden Fixtures — Cross-protocol mismatches', () => {
        it('should error on Campagnolo N3W cassette on SRAM XDR wheel', () => {
            const build = makeBaseBuild({
                wheels: [
                    makeComponent({
                        id: 'wr', specs: { position: 'Rear', freehub_body: 'XDR' },
                    }),
                ],
                cassette: makeComponent({
                    id: 'cass', specs: { freehub_body: 'N3W' },
                }),
            });
            const result = Validator.validateBuild(build);
            const fhIssue = result.issues.find(i =>
                i.componentId === 'cass' && i.severity === 'ERROR' && i.message.toLowerCase().includes('freehub')
            );
            expect(fhIssue).toBeDefined();
        });

        it('should error on 11-speed shifter + 12-speed cassette (speed mismatch)', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Shimano 105 ST-R7000',
                    compatibility_tags: { protocol: ['Shimano_Mechanical'] },
                    specs: { speeds: 11 },
                }),
                rearDerailleur: makeComponent({
                    id: 'rd', name: 'Shimano 105 RD-R7000',
                    compatibility_tags: { protocol: ['Shimano_Mechanical'] },
                    specs: { speeds: 11 },
                }),
                cassette: makeComponent({
                    id: 'cass', specs: { speeds: 12, largest_cog: 34, freehub_body: 'HG' },
                }),
            });
            const result = Validator.validateBuild(build);
            const speedIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('speed')
            );
            expect(speedIssue).toBeDefined();
        });

        it('should error on Post Mount fork + Flat Mount front caliper', () => {
            const build = makeBaseBuild({
                fork: makeComponent({
                    id: 'fk', specs: { brake_mount: 'Post Mount' },
                }),
                brakes: {
                    calipers: [
                        makeComponent({
                            id: 'cal-f', specs: { position: 'Front', mount: 'Flat Mount' },
                        }),
                    ],
                    rotors: [],
                },
            });
            const result = Validator.validateBuild(build);
            const mountIssue = result.issues.find(i =>
                i.componentId === 'cal-f' && i.severity === 'ERROR' && i.message.toLowerCase().includes('mount')
            );
            expect(mountIssue).toBeDefined();
        });

        it('should error on Campagnolo shifter + Shimano derailleur (name-inferred protocol)', () => {
            const build = makeBaseBuild({
                shifter: makeComponent({
                    id: 'sh', name: 'Campagnolo Super Record EPS',
                    specs: { speeds: 12 },
                }),
                rearDerailleur: makeComponent({
                    id: 'rd', name: 'Shimano Dura-Ace Di2 RD-R9250',
                    specs: { speeds: 12 },
                }),
            });
            const result = Validator.validateBuild(build);
            const protocolIssue = result.issues.find(i =>
                i.severity === 'ERROR' && i.message.toLowerCase().includes('protocol')
            );
            expect(protocolIssue).toBeDefined();
        });
    });
});
