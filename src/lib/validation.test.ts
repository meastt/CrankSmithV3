import { validateFrameWheel, validateFrameBBCrank, validateDrivetrain, Component } from './validation';

describe('Validation Logic', () => {
    const mockComponent = (type: string, interfaces: any = {}, attributes: any = {}): Component => ({
        id: 'test-id',
        name: 'Test Component',
        type,
        interfaces,
        attributes,
    });

    describe('Frame & Wheel Validation', () => {
        it('should pass when axles match', () => {
            const frame = mockComponent('Frame', { rear_axle: '12x142' }, { max_tire_width_mm: 32 });
            const wheel = mockComponent('Wheel', { axle: '12x142' });
            const result = validateFrameWheel(frame, wheel);
            expect(result.compatible).toBe(true);
        });

        it('should fail when axles mismatch', () => {
            const frame = mockComponent('Frame', { rear_axle: '12x142' });
            const wheel = mockComponent('Wheel', { axle: 'QR' });
            const result = validateFrameWheel(frame, wheel);
            expect(result.compatible).toBe(false);
            expect(result.reasons).toContain('Frame axle (12x142) does not match Wheel axle (QR)');
        });

        it('should fail when tire exceeds clearance', () => {
            const frame = mockComponent('Frame', { rear_axle: '12x142' }, { max_tire_width_mm: 28 });
            const wheel = mockComponent('Wheel', { axle: '12x142' });
            const tire = mockComponent('Tire', {}, { width_mm: 32 });
            const result = validateFrameWheel(frame, wheel, tire);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/exceeds Frame max clearance/);
        });
    });

    describe('Frame, BB, Crank Validation', () => {
        it('should pass when all interfaces match', () => {
            const frame = mockComponent('Frame', { bottom_bracket_shell: 'BSA' });
            const bb = mockComponent('BottomBracket', { frame_interface: 'BSA', crank_interface: '24mm' });
            const crank = mockComponent('Crank', { spindle_type: '24mm' });
            const result = validateFrameBBCrank(frame, bb, crank);
            expect(result.compatible).toBe(true);
        });

        it('should fail when BB does not fit Frame', () => {
            const frame = mockComponent('Frame', { bottom_bracket_shell: 'PF30' });
            const bb = mockComponent('BottomBracket', { frame_interface: 'BSA', crank_interface: '24mm' });
            const crank = mockComponent('Crank', { spindle_type: '24mm' });
            const result = validateFrameBBCrank(frame, bb, crank);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/BB frame interface/);
        });

        it('should fail when Crank does not fit BB', () => {
            const frame = mockComponent('Frame', { bottom_bracket_shell: 'BSA' });
            const bb = mockComponent('BottomBracket', { frame_interface: 'BSA', crank_interface: '24mm' });
            const crank = mockComponent('Crank', { spindle_type: '30mm' });
            const result = validateFrameBBCrank(frame, bb, crank);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/BB crank interface/);
        });
    });

    describe('Drivetrain Validation', () => {
        it('should pass when protocols match and capacity is sufficient', () => {
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_11s_Mech' });
            const derailleur = mockComponent('Derailleur', { protocol: 'Shimano_11s_Mech' }, { max_tooth: 34, capacity: 40 });
            const cassette = mockComponent('Cassette', {}, { largest_cog: 32, diff: 21 });
            const crank = mockComponent('Crank', {}, { chainring_diff: 16 });

            const result = validateDrivetrain(shifter, derailleur, cassette, crank);
            expect(result.compatible).toBe(true);
        });

        it('should fail when protocols mismatch', () => {
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_11s_Mech' });
            const derailleur = mockComponent('Derailleur', { protocol: 'SRAM_AXS' }, { max_tooth: 34 });
            const cassette = mockComponent('Cassette', {}, { largest_cog: 32 });

            const result = validateDrivetrain(shifter, derailleur, cassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/protocol/);
        });

        it('should fail when cassette exceeds max tooth', () => {
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_11s_Mech' });
            const derailleur = mockComponent('Derailleur', { protocol: 'Shimano_11s_Mech' }, { max_tooth: 30 });
            const cassette = mockComponent('Cassette', {}, { largest_cog: 34 });

            const result = validateDrivetrain(shifter, derailleur, cassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/exceeds Derailleur max tooth/);
        });

        it('should fail when capacity is exceeded', () => {
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_11s_Mech' });
            const derailleur = mockComponent('Derailleur', { protocol: 'Shimano_11s_Mech' }, { max_tooth: 34, capacity: 30 });
            const cassette = mockComponent('Cassette', {}, { largest_cog: 32, diff: 21 }); // 11-32
            const crank = mockComponent('Crank', {}, { chainring_diff: 16 }); // 50/34

            // Required: 21 + 16 = 37 > 30
            const result = validateDrivetrain(shifter, derailleur, cassette, crank);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/Required capacity/);
        });
    });
});
