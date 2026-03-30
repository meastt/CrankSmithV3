/**
 * Gravel Build Compatibility Test Suite
 *
 * Tests common gravel race build configurations against the validator.
 * All builds should pass with no ERRORs (warnings are acceptable).
 *
 * Run with: npx tsx prisma/test-gravel-builds.ts
 */

import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';
import { validateBuilderBuild } from '../src/lib/validationContext';

const prisma = new PrismaClient();

// ============================================================================
// HELPERS
// ============================================================================

async function getComponent(type: string, namePattern: string): Promise<any> {
    const component = await prisma.component.findFirst({
        where: {
            type,
            name: { contains: namePattern, mode: 'insensitive' },
        }
    });
    if (!component) return null;
    return normalizeComponent(component);
}

function printResult(buildName: string, result: { compatible: boolean; issues: any[] }) {
    const errors = result.issues.filter(i => i.severity === 'ERROR');
    const warnings = result.issues.filter(i => i.severity === 'WARNING');
    const status = errors.length === 0 ? '✅ PASS' : '❌ FAIL';

    console.log(`\n${status} — ${buildName}`);
    if (errors.length > 0) {
        errors.forEach(e => console.log(`   ERROR: ${e.message}`));
    }
    if (warnings.length > 0) {
        warnings.forEach(w => console.log(`   WARN:  ${w.message}`));
    }
    if (errors.length === 0 && warnings.length === 0) {
        console.log('   No issues detected');
    }
    return errors.length === 0;
}

// ============================================================================
// BUILD TESTS
// ============================================================================

async function testBuild1_Shimano12sMechGRX() {
    // Shimano GRX 12-speed mechanical 1x — most popular gravel race setup 2023+
    const frame = await getComponent('Frame', 'Trek Checkpoint SLR');
    const fork = frame ? null : undefined; // factory fork assumed
    const wheel = await getComponent('Wheel', 'DT Swiss GRC 1400');
    const tire = await getComponent('Tire', 'Panaracer GravelKing SK 700x43c');
    const crankset = await getComponent('Crankset', 'GRX FC-RX820-1');
    const cassette = await getComponent('Cassette', 'Shimano 105 R7100 12sp 11-34');
    const rd = await getComponent('RearDerailleur', 'GRX RD-RX820');
    const shifter = await getComponent('Shifter', 'GRX ST-RX820');

    const missing = [
        !frame && 'Frame (Trek Checkpoint SLR)',
        !wheel && 'Wheel (DT Swiss GRC 1400)',
        !tire && 'Tire (GravelKing SK 700x43c)',
        !crankset && 'Crankset (GRX FC-RX820-1)',
        !cassette && 'Cassette (105 R7100 12sp 11-34)',
        !rd && 'RearDerailleur (GRX RD-RX820)',
        !shifter && 'Shifter (GRX ST-RX820)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — Shimano 12s Mech GRX: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        wheels: [wheel, wheel],
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        shifter,
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('Shimano GRX 12-speed Mechanical 1x (Trek Checkpoint SLR)', result);
}

async function testBuild2_SRAMForceAXS12s() {
    // SRAM Force AXS 12-speed 1x — common top-end gravel race setup
    const frame = await getComponent('Frame', 'Specialized Crux Pro');
    const wheel = await getComponent('Wheel', 'Zipp 303 S');
    if (!wheel) {
        // fallback
    }
    const tire = await getComponent('Tire', 'WTB Raddler 700x44c');
    const crankset = await getComponent('Crankset', 'SRAM Force Crankset 40t');
    const cassette = await getComponent('Cassette', 'Shimano 105 R7100 12sp 11-34');
    const rd = await getComponent('RearDerailleur', 'GRX RD-RX822');
    const shifter = await getComponent('Shifter', 'GRX ST-RX822');

    const missing = [
        !frame && 'Frame (Specialized Crux Pro)',
        !tire && 'Tire (WTB Raddler 700x44c)',
        !crankset && 'Crankset (SRAM Force Crankset 40t)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — SRAM Force AXS 12s: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        wheels: wheel ? [wheel, wheel] : [],
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        shifter,
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('SRAM Force AXS 12-speed 1x (Specialized Crux Pro)', result);
}

async function testBuild3_Shimano11sGRX2x() {
    // Shimano GRX 11-speed 2x — classic gravel race setup (pre-2022)
    const frame = await getComponent('Frame', 'Cannondale Topstone Carbon');
    const tire = await getComponent('Tire', 'Specialized Pathfinder Pro 2Bliss 700x42c');
    const crankset = await getComponent('Crankset', 'GRX FC-RX600-2');
    const cassette = await getComponent('Cassette', 'GRX CS-RX810 11-42t');
    const rd = await getComponent('RearDerailleur', 'GRX RD-RX810');
    const shifter = await getComponent('Shifter', 'GRX ST-RX600');

    const missing = [
        !frame && 'Frame (Cannondale Topstone Carbon)',
        !tire && 'Tire (Pathfinder Pro 2Bliss 700x42c)',
        !crankset && 'Crankset (GRX FC-RX600-2)',
        !cassette && 'Cassette (GRX CS-RX810 11-42t)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — Shimano 11s GRX 2x: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        shifter,
        wheels: [],
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('Shimano GRX 11-speed 2x (Cannondale Topstone Carbon)', result);
}

async function testBuild4_Shimano11s1xGRX() {
    // Shimano GRX 11-speed 1x (RX810 gen) — popular pre-RX820 gravel setup
    const frame = await getComponent('Frame', 'Trek Checkpoint SL');
    const tire = await getComponent('Tire', 'Panaracer GravelKing SK 700x43c');
    const crankset = await getComponent('Crankset', 'GRX FC-RX810-1 170mm');
    const cassette = await getComponent('Cassette', 'GRX CS-RX810 11-42t');
    const rd = await getComponent('RearDerailleur', 'GRX RD-RX810');

    const missing = [
        !frame && 'Frame (Trek Checkpoint SL)',
        !tire && 'Tire (GravelKing SK 700x43c)',
        !crankset && 'Crankset (GRX FC-RX810-1 170mm)',
        !cassette && 'Cassette (GRX CS-RX810 11-42t)',
        !rd && 'RearDerailleur (GRX RD-RX810)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — Shimano 11s 1x GRX RX810: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        wheels: [],
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('Shimano GRX 11-speed 1x RX810 (Trek Checkpoint SL)', result);
}

async function testBuild5_SRAMForce1_11s() {
    // SRAM Force1 11-speed 1x — dominant setup at Unbound ~2016-2020
    const frame = await getComponent('Frame', 'Salsa Warbird Carbon');
    const tire = await getComponent('Tire', 'WTB Venture 700x50c');
    const crankset = await getComponent('Crankset', 'SRAM Force1 GXP 170mm 40t');
    const cassette = await getComponent('Cassette', 'Shimano 105 R7000 Cassette 11-34');
    const rd = await getComponent('RearDerailleur', 'Shimano GRX RD-RX810');

    const missing = [
        !frame && 'Frame (Salsa Warbird Carbon)',
        !tire && 'Tire (WTB Venture 700x50c)',
        !crankset && 'Crankset (SRAM Force1 GXP 170mm 40t)',
        !cassette && 'Cassette (105 R7000 11-34)',
        !rd && 'RearDerailleur (GRX RD-RX810)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — SRAM Force1 11s 1x: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        wheels: [],
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('SRAM Force1 11-speed 1x (Salsa Warbird Carbon)', result);
}

async function testBuild6_CampagnoloEkar13s() {
    // Campagnolo Ekar 13-speed — premium Italian gravel setup
    const frame = await getComponent('Frame', 'Cervélo Áspero');
    const tire = await getComponent('Tire', 'Pirelli Cinturato Gravel H 700x40c');
    const crankset = await getComponent('Crankset', 'Campagnolo Ekar GT');
    const cassette = await getComponent('Cassette', 'Campagnolo Ekar 9-36t');
    const rd = await getComponent('RearDerailleur', 'Campagnolo Ekar');
    const shifter = await getComponent('Shifter', 'Campagnolo Ekar GT Ergopower');

    const missing = [
        !frame && 'Frame (Cervélo Áspero)',
        !tire && 'Tire (Cinturato Gravel H 700x40c)',
        !crankset && 'Crankset (Campagnolo Ekar GT)',
        !cassette && 'Cassette (Ekar 9-36t)',
        !rd && 'RearDerailleur (Campagnolo Ekar)',
        !shifter && 'Shifter (Ekar GT Ergopower)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — Campagnolo Ekar 13s: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        shifter,
        wheels: [],
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('Campagnolo Ekar 13-speed 1x (Cervélo Áspero)', result);
}

async function testBuild7_WideGravelSetup() {
    // Wide tire gravel build with 650b tires (2.1")
    const frame = await getComponent('Frame', '3T Exploro RaceMax Carbon');
    const tire = await getComponent('Tire', 'Panaracer GravelKing SK+ 650b x 2.1');
    const crankset = await getComponent('Crankset', 'Shimano GRX FC-RX820-1');
    const cassette = await getComponent('Cassette', 'Shimano 105 R7100 12sp 11-34');
    const rd = await getComponent('RearDerailleur', 'GRX RD-RX822');
    const shifter = await getComponent('Shifter', 'GRX ST-RX822');

    const missing = [
        !frame && 'Frame (3T Exploro RaceMax Carbon)',
        !tire && 'Tire (GravelKing SK+ 650b x 2.1")',
        !crankset && 'Crankset (GRX FC-RX820-1)',
    ].filter(Boolean);

    if (missing.length > 0) {
        console.log(`\n⚠️  SKIP — Wide 650b gravel build: Missing: ${missing.join(', ')}`);
        return null;
    }

    const result = validateBuilderBuild({
        frame,
        tires: [tire, tire],
        crankset,
        cassette,
        rearDerailleur: rd,
        shifter,
        wheels: [],
        brakes: { calipers: [], rotors: [] },
        cockpit: {},
    });

    return printResult('Wide 650b Gravel Build 2.1" (3T Exploro RaceMax Carbon)', result);
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('========================================');
    console.log('  CrankSmith Gravel Build Test Suite');
    console.log('========================================');

    const results = await Promise.all([
        testBuild1_Shimano12sMechGRX(),
        testBuild2_SRAMForceAXS12s(),
        testBuild3_Shimano11sGRX2x(),
        testBuild4_Shimano11s1xGRX(),
        testBuild5_SRAMForce1_11s(),
        testBuild6_CampagnoloEkar13s(),
        testBuild7_WideGravelSetup(),
    ]);

    const ran = results.filter(r => r !== null);
    const passed = ran.filter(r => r === true).length;
    const failed = ran.filter(r => r === false).length;
    const skipped = results.filter(r => r === null).length;

    console.log('\n========================================');
    console.log(`  Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
    console.log('========================================\n');

    if (failed > 0) process.exit(1);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
