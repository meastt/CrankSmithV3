import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 1 - Forks...');

    const upsertComponent = async (id: string, data: any) => {
        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: { ...data, id } });
            console.log(`Created: ${data.name}`);
        } else {
            console.log(`Skipped (Exists): ${data.name}`);
        }
    };

    const components: any[] = [];

    // Helper for MTB Suspension Fork
    const createMTBFork = (brand: string, model: string, wheelSize: string, travel: number, axle: string, offset: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${wheelSize}-${travel}mm-${offset}mm`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Fork',
            name: `${brand} ${model} ${wheelSize}" ${travel}mm`,
            interfaces: JSON.stringify({
                axle_standard: axle,
                steerer: 'TAPERED',
                brake_mount: 'POST_MOUNT',
                wheel_size: wheelSize
            }),
            attributes: JSON.stringify({
                travel,
                wheel_size: wheelSize,
                offset,
                suspension_type: 'AIR',
                weight,
                price
            })
        };
    };

    // Helper for Rigid Fork
    const createRigidFork = (brand: string, model: string, material: string, axleToC: number, rake: number, maxTire: string, weight: number, price: number) => {
        const id = `${brand}-${model}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Fork',
            name: `${brand} ${model}`,
            interfaces: JSON.stringify({
                axle_standard: 'TA_12_100',
                steerer: 'TAPERED',
                brake_mount: 'FLAT_MOUNT'
            }),
            attributes: JSON.stringify({
                material,
                axle_to_crown: axleToC,
                rake,
                max_tire: maxTire,
                suspension_type: 'RIGID',
                weight,
                price
            })
        };
    };

    // ==========================================
    // FOX SUSPENSION FORKS
    // ==========================================
    // Source: https://ridefox.com & https://www.vitalmtb.com
    // Weights verified from manufacturer specs and reviews

    // Fox 32 SC (Step-Cast) Factory - XC
    // Source: https://ridefox.com/products/fox-32-sc-factory
    // Limited to 100mm travel, 29" only
    components.push(
        createMTBFork('Fox', '32 SC Factory', '29', 100, 'TA_15_110', 44, 1287, 950)
    );

    // Fox 34 Factory - Trail
    // Source: https://ridefox.com/products/fox-34-factory
    // Available: 100-140mm for 29", with 44mm and 51mm offset options
    // Weights: https://www.vitalmtb.com/product/guide/Forks,33/FOX/34-Factory
    components.push(
        createMTBFork('Fox', '34 Factory', '29', 120, 'TA_15_110', 44, 1730, 1050),
        createMTBFork('Fox', '34 Factory', '29', 130, 'TA_15_110', 44, 1795, 1050),
        createMTBFork('Fox', '34 Factory', '29', 140, 'TA_15_110', 44, 1885, 1100),
        createMTBFork('Fox', '34 Factory', '29', 140, 'TA_15_110', 51, 1885, 1100)
    );

    // Fox 34 Step-Cast Factory - Trail (lighter)
    // 2025 model with GRIP SL damper
    components.push(
        createMTBFork('Fox', '34 SC Factory', '29', 120, 'TA_15_110', 44, 1434, 1100),
        createMTBFork('Fox', '34 SC Factory', '29', 130, 'TA_15_110', 44, 1485, 1100)
    );

    // Fox 36 Factory - Enduro
    // Source: https://ridefox.com/products/fox-36-factory
    // Available: 150-160mm for 29" (170-180mm requires Fox 38)
    // Weights: https://www.vitalmtb.com/product/guide/Forks,33/FOX/36-Factory
    components.push(
        createMTBFork('Fox', '36 Factory', '29', 150, 'TA_15_110', 44, 1942, 1200),
        createMTBFork('Fox', '36 Factory', '29', 160, 'TA_15_110', 44, 1965, 1250),
        createMTBFork('Fox', '36 Factory', '27.5', 160, 'TA_15_110', 44, 1935, 1250),
        createMTBFork('Fox', '36 Factory', '27.5', 170, 'TA_15_110', 44, 1975, 1300)
    );

    // Fox 38 Factory - Aggressive Enduro
    // Source: https://ridefox.com/products/fox-38-factory-grip-x2
    // 38mm stanchions, 160-180mm travel
    // Weights: https://www.pinkbike.com/news/review-rockshox-zeb-vs-fox-38-2025.html
    components.push(
        createMTBFork('Fox', '38 Factory', '29', 160, 'TA_15_110', 44, 2194, 1350),
        createMTBFork('Fox', '38 Factory', '29', 170, 'TA_15_110', 44, 2381, 1400),
        createMTBFork('Fox', '38 Factory', '29', 180, 'TA_15_110', 44, 2425, 1450),
        createMTBFork('Fox', '38 Factory', '27.5', 170, 'TA_15_110', 44, 2350, 1400),
        createMTBFork('Fox', '38 Factory', '27.5', 180, 'TA_15_110', 44, 2395, 1450)
    );

    // Fox 40 Factory - Downhill
    // Source: https://ridefox.com/products/fox-40-factory-grip-x2
    // 200-203mm travel, 20mm thru-axle
    // Weights: https://www.vitalmtb.com/product/guide/Forks,33/FOX/40-Factory-GRIP2
    components.push(
        createMTBFork('Fox', '40 Factory', '29', 203, 'TA_20_110', 48, 2745, 1900),
        createMTBFork('Fox', '40 Factory', '27.5', 203, 'TA_20_110', 48, 2715, 1900)
    );

    // ==========================================
    // ROCKSHOX SUSPENSION FORKS
    // ==========================================
    // Source: https://www.sram.com/rockshox
    // Weights verified from manufacturer and reviews

    // RockShox SID Ultimate - XC (35mm stanchions)
    // Source: https://www.sram.com/en/rockshox/series/sid
    // Weights: https://www.pinkbike.com/news/first-ride-2024-rockshox-sid-ultimate-fork.html
    components.push(
        createMTBFork('RockShox', 'SID Ultimate', '29', 120, 'TA_15_110', 42, 1480, 1250),
        createMTBFork('RockShox', 'SID Ultimate', '29', 110, 'TA_15_110', 42, 1455, 1250)
    );

    // RockShox SID SL Ultimate - XC (32mm stanchions - lighter)
    // Source: https://www.sram.com/en/rockshox/series/sid
    // Weights: https://bikerumor.com/2024-rockshox-sid-sl-xc-fork-sidluxe-shock/
    components.push(
        createMTBFork('RockShox', 'SID SL Ultimate', '29', 100, 'TA_15_110', 37, 1326, 1300),
        createMTBFork('RockShox', 'SID SL Ultimate', '29', 110, 'TA_15_110', 37, 1352, 1300)
    );

    // RockShox Pike Ultimate - Trail
    // Source: https://www.sram.com/en/rockshox/models/fs-pike-ult-c2
    // 2025 model with Charger 3.1 damper
    // Weights: https://flowmountainbike.com/tests/2025-rockshox-pike-vs-fox-34-review/
    components.push(
        createMTBFork('RockShox', 'Pike Ultimate', '29', 120, 'TA_15_110', 42, 1836, 1149),
        createMTBFork('RockShox', 'Pike Ultimate', '29', 130, 'TA_15_110', 42, 1858, 1149),
        createMTBFork('RockShox', 'Pike Ultimate', '29', 140, 'TA_15_110', 42, 1870, 1149),
        createMTBFork('RockShox', 'Pike Ultimate', '29', 150, 'TA_15_110', 42, 1890, 1200),
        createMTBFork('RockShox', 'Pike Ultimate', '29', 160, 'TA_15_110', 42, 1910, 1200),
        createMTBFork('RockShox', 'Pike Ultimate', '27.5', 150, 'TA_15_110', 46, 1865, 1200),
        createMTBFork('RockShox', 'Pike Ultimate', '27.5', 160, 'TA_15_110', 46, 1885, 1200)
    );

    // RockShox Lyrik Ultimate - Enduro
    // Source: https://www.sram.com/en/rockshox/models/fs-lyrk-ult-d2
    // 2025 model, 140-160mm travel (170-180mm now handled by ZEB)
    // Weights: https://www.bikeperfect.com/reviews/rockshox-lyrik-ultimate-2025-review
    components.push(
        createMTBFork('RockShox', 'Lyrik Ultimate', '29', 140, 'TA_15_110', 42, 1985, 1250),
        createMTBFork('RockShox', 'Lyrik Ultimate', '29', 150, 'TA_15_110', 42, 2010, 1250),
        createMTBFork('RockShox', 'Lyrik Ultimate', '29', 160, 'TA_15_110', 42, 2023, 1300),
        createMTBFork('RockShox', 'Lyrik Ultimate', '27.5', 160, 'TA_15_110', 46, 2000, 1300),
        createMTBFork('RockShox', 'Lyrik Ultimate', '27.5', 170, 'TA_15_110', 46, 2035, 1350)
    );

    // RockShox ZEB Ultimate - Aggressive Enduro (38mm stanchions)
    // Source: https://www.sram.com/en/rockshox/models/fs-zeb-ult-a3
    // 2025 model with Charger 3.1 damper, 150-190mm travel
    // Weights: https://www.pinkbike.com/news/review-rockshox-zeb-vs-fox-38-2025.html
    components.push(
        createMTBFork('RockShox', 'ZEB Ultimate', '29', 160, 'TA_15_110', 44, 2285, 1159),
        createMTBFork('RockShox', 'ZEB Ultimate', '29', 170, 'TA_15_110', 44, 2324, 1159),
        createMTBFork('RockShox', 'ZEB Ultimate', '29', 180, 'TA_15_110', 44, 2360, 1200),
        createMTBFork('RockShox', 'ZEB Ultimate', '27.5', 170, 'TA_15_110', 44, 2295, 1159),
        createMTBFork('RockShox', 'ZEB Ultimate', '27.5', 180, 'TA_15_110', 44, 2330, 1200),
        createMTBFork('RockShox', 'ZEB Ultimate', '27.5', 190, 'TA_15_110', 44, 2365, 1250)
    );

    // RockShox Boxxer Ultimate - Downhill
    // Source: https://www.sram.com/en/rockshox/models/fs-bxr-ult-d1
    // 2024 model with 38mm stanchions, 180-200mm travel
    // Weights: https://blisterreview.com/gear-reviews/2024-rockshox-boxxer
    components.push(
        createMTBFork('RockShox', 'Boxxer Ultimate', '29', 200, 'TA_20_110', 48, 2840, 1700),
        createMTBFork('RockShox', 'Boxxer Ultimate', '27.5', 200, 'TA_20_110', 48, 2810, 1700)
    );

    // ==========================================
    // ENVE RIGID CARBON FORKS
    // ==========================================
    // Source: https://enve.com
    // Weights verified from manufacturer specs

    // ENVE G Series Gravel Fork
    // Source: https://enve.com/products/gravel-disc-fork
    // Weight: 520g, clearance for 700x50mm or 27.5x2.25"
    components.push(
        createRigidFork('ENVE', 'G Series Gravel', 'CARBON', 395, 50, '700x50mm', 520, 550)
    );

    // ENVE Gravel IN-Route Fork
    // Source: https://enve.com/pages/gravel-in-route-fork-specs
    // Weight: 545g, internal cable routing
    components.push(
        createRigidFork('ENVE', 'IN-Route Gravel', 'CARBON', 395, 53, '700x50mm', 545, 600)
    );

    // ENVE Adventure Fork
    // Source: https://enve.com/pages/tech-specs-adventure-fork
    // Weight: 575g, bikepacking-oriented
    components.push(
        createRigidFork('ENVE', 'Adventure', 'CARBON', 395, 55, '700x50mm', 575, 650)
    );

    // ENVE AR Disc Fork (Road Aero)
    // Source: https://enve.com/products/ar-disc-fork
    // Road-focused aero fork
    components.push(
        createRigidFork('ENVE', 'AR Disc', 'CARBON', 378, 47, '700x30mm', 450, 600)
    );

    // ==========================================
    // COLUMBUS RIGID CARBON FORKS
    // ==========================================
    // Source: https://www.columbus1919.com
    // Weights verified from retailer specs

    // Columbus Futura Gravel
    // Source: https://www.columbus1919.com/en/portfolio/futura-gravel-en/
    // Weight: 450g ±10g
    components.push(
        createRigidFork('Columbus', 'Futura Gravel', 'CARBON', 380, 47, '700x40mm', 450, 375)
    );

    // Columbus Futura Cross+
    // Source: https://www.columbus1919.com/en/portfolio/futura-cross-en/
    // Weight: 535g ±10g, larger tire clearance
    components.push(
        createRigidFork('Columbus', 'Futura Cross+', 'CARBON', 380, 47, '700x45mm', 535, 425)
    );

    // ==========================================
    // 3T RIGID CARBON FORKS
    // ==========================================
    // Source: https://3t.bike
    // Weights verified from manufacturer and retailer specs

    // 3T Fundi Team (Road Disc)
    // Source: https://bikerumor.com/3t-gets-sqaero-new-carbon-fundi-road-disc-brake-fork/
    // Weight: 400g, aero road
    components.push(
        createRigidFork('3T', 'Fundi Team', 'CARBON', 355, 49, '700x30mm', 400, 400)
    );

    // 3T Fundi Integrale (Road Disc Aero)
    // Weight: 410g, integrated aero design
    components.push(
        createRigidFork('3T', 'Fundi Integrale', 'CARBON', 360, 49, '700x30mm', 410, 450)
    );

    // ==========================================
    // RITCHEY RIGID CARBON FORKS
    // ==========================================
    // Source: https://ritcheylogic.com
    // Weights verified from manufacturer specs

    // Ritchey WCS Carbon Road Fork
    // Source: https://ritcheylogic.com/bike/forks
    // Weight: 350g with uncut steerer
    components.push(
        createRigidFork('Ritchey', 'WCS Carbon Road', 'CARBON', 371, 46, '700x30mm', 350, 350)
    );

    // Ritchey WCS Carbon Gravel Cross Fork
    // Source: https://ritcheylogic.com/bike/forks/wcs-carbon-gravel-cross-fork
    // Weight: 415g, up to 40mm tires
    components.push(
        createRigidFork('Ritchey', 'WCS Carbon Cross', 'CARBON', 395, 45, '700x40mm', 415, 400)
    );

    // Ritchey WCS Carbon All Road Fork
    // Source: https://ritcheylogic.com/bike/forks/wcs-carbon-tapered-all-road-cross-fork
    // Weight: 440g, tapered steerer
    components.push(
        createRigidFork('Ritchey', 'WCS Carbon All Road', 'CARBON', 395, 45, '700x45mm', 440, 425)
    );

    // Ritchey WCS Carbon Adventure Gravel Fork
    // Source: https://ritcheylogic.com/bike/forks/wcs-carbon-adventure-gravel-fork
    // Weight: 445g, up to 48mm tires
    components.push(
        createRigidFork('Ritchey', 'WCS Carbon Adventure', 'CARBON', 393, 50, '700x48mm', 445, 475)
    );

    // ==========================================
    // EASTON RIGID CARBON FORKS
    // ==========================================
    // Source: https://eastoncycling.com
    // Note: EC90 SLX is older rim brake model, included for completeness

    // Easton EC90 SLX (Rim Brake - Road)
    // Source: https://weightweenies.starbike.com/forum/viewtopic.php?t=44593
    // Weight: 300g, ultra-lightweight road fork (rim brake)
    // Note: Legacy model, but still relevant for vintage/rim brake builds
    components.push(
        createRigidFork('Easton', 'EC90 SLX', 'CARBON', 370, 43, '700x28mm', 300, 350)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 1 Forks seeding complete! Added ${components.length} forks.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
