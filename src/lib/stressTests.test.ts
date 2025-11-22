import { validateDrivetrain, validateFrameWheel, Component } from './validation';

describe('Stress Tests: Non-Conventional Builds', () => {
    const mockComponent = (type: string, interfaces: any = {}, attributes: any = {}): Component => ({
        id: 'test-id',
        name: 'Test Component',
        type,
        interfaces,
        attributes,
    });

    describe('Scenario: "Mullet" Drivetrain (Drop Bar MTB)', () => {
        it('should ALLOW mixing Road and MTB components if protocols match (e.g., SRAM AXS)', () => {
            // SRAM AXS allows mixing Road Shifters with MTB Derailleurs
            const shifter = mockComponent('Shifter', { protocol: 'SRAM_AXS' }); // Road/Gravel
            const derailleur = mockComponent('Derailleur', { protocol: 'SRAM_AXS' }, { max_tooth: 52, capacity: 40 }); // MTB Eagle
            const cassette = mockComponent('Cassette', {}, { largest_cog: 50, diff: 40 }); // 10-50t
            const crank = mockComponent('Crank', {}, { chainring_diff: 0 }); // 1x

            const result = validateDrivetrain(shifter, derailleur, cassette, crank);
            expect(result.compatible).toBe(true);
        });

        it('should REJECT mixing Mechanical Road and MTB components (Pull Ratio Mismatch)', () => {
            // Shimano Road 11s != Shimano MTB 11s (different pull ratios)
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_Road_11s' });
            const derailleur = mockComponent('Derailleur', { protocol: 'Shimano_MTB_11s' }, { max_tooth: 46 });
            const cassette = mockComponent('Cassette', {}, { largest_cog: 42 });

            const result = validateDrivetrain(shifter, derailleur, cassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/protocol/);
        });
    });

    describe('Scenario: Capacity Overload (Road RD + MTB Cassette)', () => {
        it('should REJECT a cassette that exceeds derailleur max tooth', () => {
            const shifter = mockComponent('Shifter', { protocol: 'Shimano_Road_11s' });
            const derailleur = mockComponent('Derailleur', { protocol: 'Shimano_Road_11s' }, { max_tooth: 30 }); // Short cage
            const cassette = mockComponent('Cassette', {}, { largest_cog: 34 }); // 11-34t

            const result = validateDrivetrain(shifter, derailleur, cassette);
            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/exceeds Derailleur max tooth/);
        });
    });

    describe('Scenario: Brake Standard Mismatch', () => {
        it('should REJECT Disc Frame with Rim Brake Wheels', () => {
            // Assuming we track this via axle or a specific brake interface
            // Currently, our validation checks Axle.
            // Let's assume Rim Brake wheels are QR and Disc are Thru Axle for this test, 
            // OR we need to add a specific 'brake_type' check if not already present.

            // Let's check if we have brake validation in `validateFrameWheel`.
            // Looking at `validation.ts`, we only check Axle and Tire Width.
            // WE NEED TO ADD BRAKE CHECK.

            // For this test, we'll simulate the mismatch via Axle which is the common proxy,
            // BUT we should ideally check 'brake_type'.

            const frame = mockComponent('Frame', { rear_axle: '12x142', brake_type: 'Disc' });
            const wheel = mockComponent('Wheel', { axle: '12x142', brake_type: 'Rim' });

            const result = validateFrameWheel(frame, wheel);

            expect(result.compatible).toBe(false);
            expect(result.reasons[0]).toMatch(/brake type/);
        });
    });
});
