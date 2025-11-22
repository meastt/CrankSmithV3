import { validateFrameWheel, validateFrameBBCrank, validateDrivetrain, Component } from '../src/lib/validation';

describe('Validation Logic', () => {
    describe('Frame-Wheel Validation', () => {
        const frame: Component = {
            id: 'f1', type: 'Frame', name: 'Road Frame',
            interfaces: { rear_axle: '12x142mm' },
            attributes: { max_tire_width_mm: 32 }
        };
        const compatibleWheel: Component = {
            id: 'w1', type: 'Wheel', name: 'Road Wheel',
            interfaces: { axle: '12x142mm' },
            attributes: {}
        };
        const incompatibleWheel: Component = {
            id: 'w2', type: 'Wheel', name: 'MTB Wheel',
            interfaces: { axle: '12x148mm' },
            attributes: {}
        };
        const tire: Component = {
            id: 't1', type: 'Tire', name: 'Wide Tire',
            interfaces: {},
            attributes: { width_mm: 40 }
        };

        test('should validate compatible frame and wheel', () => {
            const result = validateFrameWheel(frame, compatibleWheel);
            expect(result.compatible).toBe(true);
        });

        test('should fail incompatible axle', () => {
            const result = validateFrameWheel(frame, incompatibleWheel);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Frame axle (12x142mm) does not match Wheel axle (12x148mm)');
        });

        test('should fail if tire too wide', () => {
            const result = validateFrameWheel(frame, compatibleWheel, tire);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Tire width (40mm) exceeds Frame max clearance (32mm)');
        });
    });

    describe('Frame-BB-Crank Validation', () => {
        const frame: Component = {
            id: 'f1', type: 'Frame', name: 'BSA Frame',
            interfaces: { bottom_bracket_shell: 'BSA_Threaded_68mm' },
            attributes: {}
        };
        const bb: Component = {
            id: 'bb1', type: 'BottomBracket', name: 'BSA DUB BB',
            interfaces: { frame_interface: 'BSA_Threaded_68mm', crank_interface: 'DUB_Spindle' },
            attributes: {}
        };
        const crank: Component = {
            id: 'c1', type: 'Crank', name: 'DUB Crank',
            interfaces: { spindle_type: 'DUB_Spindle' },
            attributes: {}
        };
        const badBB: Component = {
            id: 'bb2', type: 'BottomBracket', name: 'PF30 BB',
            interfaces: { frame_interface: 'PF30', crank_interface: 'DUB_Spindle' },
            attributes: {}
        };
        const badCrank: Component = {
            id: 'c2', type: 'Crank', name: '24mm Crank',
            interfaces: { spindle_type: '24mm_Spindle' },
            attributes: {}
        };

        test('should validate compatible trio', () => {
            const result = validateFrameBBCrank(frame, bb, crank);
            expect(result.compatible).toBe(true);
        });

        test('should fail mismatched BB-Frame', () => {
            const result = validateFrameBBCrank(frame, badBB, crank);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('BB frame interface (PF30) does not match Frame shell (BSA_Threaded_68mm)');
        });

        test('should fail mismatched BB-Crank', () => {
            const result = validateFrameBBCrank(frame, bb, badCrank);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('BB crank interface (DUB_Spindle) does not match Crank spindle (24mm_Spindle)');
        });
    });

    describe('Drivetrain Validation', () => {
        const shifter: Component = {
            id: 's1', type: 'Shifter', name: 'AXS Shifter',
            interfaces: { protocol: 'SRAM_AXS' },
            attributes: {}
        };
        const rd: Component = {
            id: 'rd1', type: 'Derailleur', name: 'AXS RD',
            interfaces: { protocol: 'SRAM_AXS' },
            attributes: { max_tooth: 33, capacity: 36 }
        };
        const cassette: Component = {
            id: 'cs1', type: 'Cassette', name: '10-33 Cassette',
            interfaces: {},
            attributes: { largest_cog: 33, diff: 23 } // 33-10 = 23
        };
        const crank: Component = {
            id: 'ck1', type: 'Crank', name: 'Road Crank',
            interfaces: {},
            attributes: { chainring_diff: 13 } // 48-35 = 13
        };
        const bigCassette: Component = {
            id: 'cs2', type: 'Cassette', name: '10-36 Cassette',
            interfaces: {},
            attributes: { largest_cog: 36, diff: 26 }
        };

        test('should validate compatible drivetrain', () => {
            const result = validateDrivetrain(shifter, rd, cassette, crank);
            expect(result.compatible).toBe(true);
        });

        test('should fail protocol mismatch', () => {
            const badShifter = { ...shifter, interfaces: { protocol: 'Shimano_Di2' } };
            const result = validateDrivetrain(badShifter, rd, cassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Shifter protocol (Shimano_Di2) does not match Derailleur protocol (SRAM_AXS)');
        });

        test('should fail max tooth exceeded', () => {
            const result = validateDrivetrain(shifter, rd, bigCassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Cassette largest cog (36t) exceeds Derailleur max tooth (33t)');
        });

        test('should fail capacity exceeded', () => {
            // Capacity needed: 26 (cassette) + 13 (crank) = 39. RD Capacity: 35.
            const result = validateDrivetrain(shifter, rd, bigCassette, crank);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Required capacity (39t) exceeds Derailleur capacity (36t)');
        });
    });
});
