/**
 * Add new component categories: Saddle, Pedal, Brake, PowerMeter
 * Run with: npx tsx prisma/add-new-categories.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Saddle definitions
const saddles = [
    // Fizik
    { name: 'Fizik Antares R1 Adaptive', weight: 195, width: 145, railMaterial: 'Carbon' },
    { name: 'Fizik Antares R3 Adaptive', weight: 225, width: 145, railMaterial: 'Kium' },
    { name: 'Fizik Aliante R1 Adaptive', weight: 186, width: 145, railMaterial: 'Carbon' },
    { name: 'Fizik Tempo Argo R1', weight: 175, width: 150, railMaterial: 'Carbon' },
    { name: 'Fizik Tempo Argo R3', weight: 215, width: 150, railMaterial: 'Kium' },
    { name: 'Fizik Tempo Argo R5', weight: 245, width: 150, railMaterial: 'Alloy' },
    // Prologo
    { name: 'Prologo Dimension NDR', weight: 185, width: 143, railMaterial: 'Carbon' },
    { name: 'Prologo Scratch M5 CPC', weight: 220, width: 140, railMaterial: 'Alloy' },
    // Selle Italia
    { name: 'Selle Italia SLR Boost Kit Carbonio Superflow', weight: 165, width: 145, railMaterial: 'Carbon' },
    { name: 'Selle Italia Flite Boost Kit Carbonio Superflow', weight: 155, width: 145, railMaterial: 'Carbon' },
    // SMP
    { name: 'SMP Composit', weight: 185, width: 132, railMaterial: 'Carbon' },
    { name: 'SMP Dynamic', weight: 265, width: 138, railMaterial: 'Steel' },
    // Specialized
    { name: 'Specialized Power Expert', weight: 218, width: 143, railMaterial: 'Ti' },
    { name: 'Specialized Power Pro', weight: 195, width: 143, railMaterial: 'Carbon' },
    { name: 'Specialized Power S-Works', weight: 165, width: 143, railMaterial: 'Carbon' },
    { name: 'Specialized Phenom Expert', weight: 238, width: 143, railMaterial: 'Ti' },
    { name: 'Specialized Romin Evo Expert', weight: 212, width: 143, railMaterial: 'Ti' },
    // WTB
    { name: 'WTB Silverado', weight: 265, width: 142, railMaterial: 'CroMo' },
    { name: 'WTB Volt', weight: 285, width: 142, railMaterial: 'CroMo' },
    { name: 'WTB Koda', weight: 315, width: 150, railMaterial: 'CroMo' },
];

// Pedal definitions
const pedals = [
    // Crankbrothers
    { name: 'Crankbrothers Candy 3', weight: 325, type: 'Clipless', category: 'MTB', platform: 'Minimal' },
    { name: 'Crankbrothers Candy 7', weight: 295, type: 'Clipless', category: 'MTB', platform: 'Minimal' },
    { name: 'Crankbrothers Candy 11', weight: 278, type: 'Clipless', category: 'MTB', platform: 'Minimal' },
    { name: 'Crankbrothers Eggbeater 3', weight: 280, type: 'Clipless', category: 'MTB', platform: 'Minimal' },
    // HT
    { name: 'HT X2', weight: 218, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'HT T1', weight: 325, type: 'Clipless', category: 'MTB', platform: 'Standard' },
    // Look
    { name: 'Look Keo Blade Carbon', weight: 195, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'Look Keo 2 Max', weight: 260, type: 'Clipless', category: 'Road', platform: 'None' },
    // Shimano
    { name: 'Shimano PD-R8000 Ultegra', weight: 248, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'Shimano PD-R9100 Dura-Ace', weight: 228, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'Shimano PD-M8100 XT', weight: 340, type: 'Clipless', category: 'MTB', platform: 'Standard' },
    { name: 'Shimano PD-M9100 XTR', weight: 310, type: 'Clipless', category: 'MTB', platform: 'Standard' },
    { name: 'Shimano PD-M540', weight: 352, type: 'Clipless', category: 'MTB', platform: 'Standard' },
    // Speedplay
    { name: 'Speedplay Comp', weight: 212, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'Speedplay Zero Chromoly', weight: 206, type: 'Clipless', category: 'Road', platform: 'None' },
    // Time
    { name: 'Time Xpresso 15', weight: 178, type: 'Clipless', category: 'Road', platform: 'None' },
    { name: 'Time ATAC XC 8', weight: 292, type: 'Clipless', category: 'MTB', platform: 'Minimal' },
];

// Brake definitions (disc brakes only for modern bikes)
const brakes = [
    // Campagnolo
    { name: 'Campagnolo Super Record Wireless Disc', weight: 288, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'Campagnolo Ekar GT Disc', weight: 310, type: 'Hydraulic Disc', pistons: 2 },
    // Magura
    { name: 'Magura MT7', weight: 374, type: 'Hydraulic Disc', pistons: 4 },
    { name: 'Magura MT5', weight: 356, type: 'Hydraulic Disc', pistons: 4 },
    // SRAM Road
    { name: 'SRAM Red eTap AXS HRD', weight: 275, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'SRAM Force eTap AXS HRD', weight: 295, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'SRAM Rival eTap AXS HRD', weight: 315, type: 'Hydraulic Disc', pistons: 2 },
    // SRAM MTB
    { name: 'SRAM Level Ultimate', weight: 310, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'SRAM Code RSC', weight: 385, type: 'Hydraulic Disc', pistons: 4 },
    { name: 'SRAM Guide RE', weight: 345, type: 'Hydraulic Disc', pistons: 2 },
    // Shimano Road
    { name: 'Shimano Dura-Ace BR-R9270', weight: 246, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'Shimano Ultegra BR-R8170', weight: 264, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'Shimano 105 BR-R7170', weight: 278, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'Shimano GRX BR-RX820', weight: 282, type: 'Hydraulic Disc', pistons: 2 },
    // Shimano MTB
    { name: 'Shimano XTR BR-M9120', weight: 265, type: 'Hydraulic Disc', pistons: 4 },
    { name: 'Shimano XT BR-M8120', weight: 285, type: 'Hydraulic Disc', pistons: 4 },
    { name: 'Shimano SLX BR-M7120', weight: 302, type: 'Hydraulic Disc', pistons: 4 },
    // TRP
    { name: 'TRP DH-R EVO', weight: 275, type: 'Hydraulic Disc', pistons: 2 },
    { name: 'TRP Hylex RS', weight: 295, type: 'Hydraulic Disc', pistons: 2 },
];

// Power Meter definitions
const powerMeters = [
    // Quarq
    { name: 'Quarq DZero DUB Power Meter Spider', weight: 75, type: 'Spider', measurement: 'Dual' },
    { name: 'Quarq RED AXS DUB Power Meter', weight: 70, type: 'Spider', measurement: 'Dual' },
    // SRM
    { name: 'SRM Origin DUB Road Power Meter', weight: 68, type: 'Spider', measurement: 'Dual' },
    // Stages
    { name: 'Stages Power L GRX RX810', weight: 20, type: 'Crank Arm', measurement: 'Left' },
    { name: 'Stages Power LR Ultegra R8100', weight: 40, type: 'Crank Arm', measurement: 'Dual' },
    { name: 'Stages Power LR Dura-Ace R9200', weight: 38, type: 'Crank Arm', measurement: 'Dual' },
    // 4iiii
    { name: '4iiii Precision Pro Ultegra R8100', weight: 9, type: 'Crank Arm', measurement: 'Left' },
    { name: '4iiii Precision Pro GRX RX810', weight: 9, type: 'Crank Arm', measurement: 'Left' },
    // Favero
    { name: 'Favero Assioma Duo', weight: 150, type: 'Pedal', measurement: 'Dual' },
    { name: 'Favero Assioma PRO MX-2', weight: 316, type: 'Pedal', measurement: 'Dual' },
];

async function main() {
    console.log('Adding new category parts to database...\n');

    // Add Saddles
    console.log('--- SADDLES ---');
    for (const saddle of saddles) {
        const existing = await prisma.component.findFirst({ where: { name: saddle.name } });
        if (existing) {
            console.log(`  Exists: ${saddle.name}`);
            continue;
        }
        await prisma.component.create({
            data: {
                type: 'Saddle',
                name: saddle.name,
                interfaces: JSON.stringify({
                    railType: '7x7mm',
                    railMaterial: saddle.railMaterial,
                }),
                attributes: JSON.stringify({
                    weight: saddle.weight,
                    width: saddle.width,
                }),
            },
        });
        console.log(`  Created: ${saddle.name}`);
    }

    // Add Pedals
    console.log('\n--- PEDALS ---');
    for (const pedal of pedals) {
        const existing = await prisma.component.findFirst({ where: { name: pedal.name } });
        if (existing) {
            console.log(`  Exists: ${pedal.name}`);
            continue;
        }
        await prisma.component.create({
            data: {
                type: 'Pedal',
                name: pedal.name,
                interfaces: JSON.stringify({
                    threadType: '9/16"',
                    pedalType: pedal.type,
                }),
                attributes: JSON.stringify({
                    weight: pedal.weight, // pair weight
                    category: pedal.category,
                    platform: pedal.platform,
                }),
            },
        });
        console.log(`  Created: ${pedal.name}`);
    }

    // Add Brakes
    console.log('\n--- BRAKES ---');
    for (const brake of brakes) {
        const existing = await prisma.component.findFirst({ where: { name: brake.name } });
        if (existing) {
            console.log(`  Exists: ${brake.name}`);
            continue;
        }
        await prisma.component.create({
            data: {
                type: 'Brake',
                name: brake.name,
                interfaces: JSON.stringify({
                    mountType: 'Flat Mount',
                    brakeType: brake.type,
                }),
                attributes: JSON.stringify({
                    weight: brake.weight, // single caliper weight
                    pistons: brake.pistons,
                }),
            },
        });
        console.log(`  Created: ${brake.name}`);
    }

    // Add Power Meters
    console.log('\n--- POWER METERS ---');
    for (const pm of powerMeters) {
        const existing = await prisma.component.findFirst({ where: { name: pm.name } });
        if (existing) {
            console.log(`  Exists: ${pm.name}`);
            continue;
        }
        await prisma.component.create({
            data: {
                type: 'PowerMeter',
                name: pm.name,
                interfaces: JSON.stringify({
                    powerMeterType: pm.type,
                }),
                attributes: JSON.stringify({
                    weight: pm.weight,
                    measurement: pm.measurement,
                }),
            },
        });
        console.log(`  Created: ${pm.name}`);
    }

    // Summary
    console.log('\n========================================');
    console.log('SUMMARY');
    console.log('========================================');
    console.log(`Saddles: ${saddles.length}`);
    console.log(`Pedals: ${pedals.length}`);
    console.log(`Brakes: ${brakes.length}`);
    console.log(`Power Meters: ${powerMeters.length}`);
    console.log(`TOTAL: ${saddles.length + pedals.length + brakes.length + powerMeters.length} components added/updated`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
