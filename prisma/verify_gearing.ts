import { PrismaClient } from '@prisma/client';
import {
    calculateSpeed,
    getAllGearRatios,
    getSpeedRange,
    calculateWheelCircumference
} from '../src/lib/gearCalculations';

const prisma = new PrismaClient();

// Helper to parse JSON
const parse = (json: any) => (typeof json === 'string' ? JSON.parse(json) : json);

async function verifyGearing(scenarioName: string, specs: {
    cassetteId: string;
    crankId: string;
    tireId: string;
    wheelDiameterMm?: number; // Optional override, otherwise derived from tire/wheel standard
}) {
    console.log(`\n--- Verifying Gearing: ${scenarioName} ---`);

    const cassette = await prisma.component.findUnique({ where: { id: specs.cassetteId } });
    const crank = await prisma.component.findUnique({ where: { id: specs.crankId } });
    const tire = await prisma.component.findUnique({ where: { id: specs.tireId } });

    if (!cassette || !crank || !tire) {
        console.error("❌ Missing components.");
        return;
    }

    const cassetteAttrs = parse(cassette.attributes);
    const crankAttrs = parse(crank.attributes);
    const tireAttrs = parse(tire.attributes);

    // Extract Cogs
    const cogs: number[] = cassetteAttrs.cog_list;
    if (!cogs || cogs.length === 0) {
        console.error("❌ Cassette has no cog list.");
        return;
    }

    // Extract Chainrings
    // Our data structure for cranksets has "available_chainrings" as an array of strings like ["50/34", "52/36"]
    // We need to simulate a USER SELECTION here. Let's pick the first one or a specific one.
    // For this script, I'll try to parse the first available option if not specified.
    // Actually, let's just pick the first one for simplicity of the test.
    const chainringOption = crankAttrs.chainrings[0]; // e.g. "50/34" or "40t"
    let chainrings: number[] = [];

    if (chainringOption.includes('/')) {
        chainrings = chainringOption.split('/').map((n: string) => parseInt(n));
    } else {
        chainrings = [parseInt(chainringOption)];
    }

    console.log(`⚙️  Drivetrain: [${chainrings.join('/')}] x [${cogs.join('-')}] (${cogs.length}s)`);

    // Wheel Circumference
    // Simple approximation: 700c = 622mm bead seat + 2 * tire width
    // 29" is same bead seat.
    // 650b is 584mm.
    let beadSeat = 622;
    if (tire.interfaces.includes('650b') || tire.interfaces.includes('27.5')) {
        beadSeat = 584;
    }

    // Tire width from attributes (e.g. "28c" -> 28mm, "2.5" -> 63.5mm)
    // Our data has `width` in interfaces often as string, or we can parse `size_label`
    // Let's rely on `tireAttrs.width` if available, or parse `size_label`
    // Actually, looking at my ingestion, I didn't explicitly store `width_mm` in attributes for all, 
    // but I did for some. Let's check `interfaces`.
    const tireInt = parse(tire.interfaces);
    let tireWidthMm = 28; // Default fallback

    // Try to parse width from various fields
    if (tireInt.width) {
        if (typeof tireInt.width === 'number') tireWidthMm = tireInt.width;
        else if (tireInt.width.includes('c')) tireWidthMm = parseInt(tireInt.width);
        else if (tireInt.width.includes('"')) tireWidthMm = parseFloat(tireInt.width) * 25.4;
    }

    const wheelDiameterMm = beadSeat + (2 * tireWidthMm);
    const circumferenceMm = calculateWheelCircumference(wheelDiameterMm);

    console.log(`🛞  Wheel: ${tire.name} (~${Math.round(wheelDiameterMm)}mm diam, ~${Math.round(circumferenceMm)}mm circ)`);

    // Calculate Stats
    const cadence = 90;
    const speedRange = getSpeedRange(chainrings, cogs, cadence, wheelDiameterMm);
    const allGears = getAllGearRatios(chainrings, cogs);

    const hardest = allGears[allGears.length - 1];
    const easiest = allGears[0];

    // Calculate Gear Range %
    const rangePercent = (hardest.ratio / easiest.ratio) * 100;

    console.log(`📊 Results @ ${cadence} RPM:`);
    console.log(`   • Top Speed: ${speedRange.max.toFixed(1)} km/h (${hardest.chainring}/${hardest.cog})`);
    console.log(`   • Low Speed: ${speedRange.min.toFixed(1)} km/h (${easiest.chainring}/${easiest.cog})`);
    console.log(`   • Gear Range: ${rangePercent.toFixed(0)}%`);

    // Validation Checks
    if (isNaN(speedRange.max) || isNaN(speedRange.min)) {
        console.error("❌ NaN detected in speed calculation.");
    } else {
        console.log("✅ Calculations valid.");
    }
}

async function main() {
    // 1. Road Race
    await verifyGearing("Road Race (Dura-Ace 12s)", {
        cassetteId: "shimano-dura-ace-ultegra-105-12s-11-30t",
        crankId: "shimano-dura-ace-fc-r9200", // 50/34 is first option usually? Or 52/36?
        tireId: "continental-grand-prix-5000-s-tr-700x28c"
    });

    // 2. Gravel Adventure (Red XPLR 13s)
    await verifyGearing("Gravel XPLR (Red 13s)", {
        cassetteId: "sram-red-xplr-xg-1391-13s-10-46t",
        crankId: "sram-red-axs-e1", // 46/33 is first option? Wait, XPLR needs 1x. 
        // Red AXS E1 crank has 2x options listed in my JSON. 
        // I need to be careful. XPLR cassette requires 1x.
        // Let's use the GRX 1x crank for this test if Red 1x isn't explicitly separated or just pick a 1x-like ring if logic allows.
        // Actually, let's use the SRAM XX1 crank (1x) to simulate a mullet or just assume the user picks a 1x ring.
        // My script picks the FIRST option.
        // Red AXS E1 options: ["46/33", "48/35"...] -> This is 2x.
        // Let's use "sram-xx1-eagle-dub-sl" which is 1x ["30t"...] -> 30/10 is slow for gravel.
        // Let's use "shimano-grx-fc-rx820-1-1x" -> ["40t", "42t"] -> 40t is good.
        crankId: "shimano-grx-fc-rx820-1-1x",
        tireId: "specialized-pathfinder-pro-2bliss-700x42c"
    });

    // 3. MTB Enduro (Eagle 10-52)
    await verifyGearing("MTB Enduro (Eagle 12s)", {
        cassetteId: "sram-eagle-transmission-t-type-xs-1299-1295-1275-10-52t",
        crankId: "sram-xx1-eagle-dub-sl", // 30t
        tireId: "maxxis-minion-dhf-exo-29x2-5"
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
