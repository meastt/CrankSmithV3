import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 2 - Wheels...');

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

    // Helper for Road/Gravel Wheelset
    const createRoadWheel = (brand: string, model: string, category: 'ROAD' | 'GRAVEL', material: string, rimDepth: string, internalWidth: number, axle: string, brakeType: string, weight: number, price: number) => {
        const id = `${brand}-${model}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Wheel',
            name: `${brand} ${model}`,
            interfaces: JSON.stringify({
                position: 'SET',
                diameter: '700c',
                axle_standard: axle,
                brake_interface: brakeType,
                freehub: 'HG_11'
            }),
            attributes: JSON.stringify({
                category,
                material,
                rim_depth: rimDepth,
                internal_width: internalWidth,
                tubeless_ready: true,
                weight,
                price
            })
        };
    };

    // Helper for MTB Wheelset
    const createMTBWheel = (brand: string, model: string, category: 'XC' | 'TRAIL' | 'ENDURO' | 'DH', material: string, wheelSize: string, internalWidth: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${wheelSize}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Wheel',
            name: `${brand} ${model} ${wheelSize}"`,
            interfaces: JSON.stringify({
                position: 'SET',
                diameter: wheelSize === '29' ? '29' : '27.5',
                axle_standard: 'TA_15_110',
                brake_interface: 'DISC_6BOLT',
                freehub: 'MICROSPLINE'
            }),
            attributes: JSON.stringify({
                category,
                material,
                wheel_size: wheelSize,
                internal_width: internalWidth,
                tubeless_ready: true,
                weight,
                price
            })
        };
    };

    // ==========================================
    // ZIPP ROAD CARBON WHEELS
    // ==========================================
    // Source: https://www.sram.com/en/zipp
    // Weights verified from manufacturer and reviews

    // Zipp 303 NSW - All-Around Performance
    // Source: https://www.sram.com/en/zipp/road/series/303
    // Weight: 1500g (675g front, 825g rear)
    components.push(
        createRoadWheel('Zipp', '303 NSW', 'ROAD', 'CARBON', '45mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1500, 3100)
    );

    // Zipp 404 NSW - Aero Performance
    // Source: https://www.sram.com/en/zipp/road/series/404
    // Weight: 1550g
    components.push(
        createRoadWheel('Zipp', '404 NSW', 'ROAD', 'CARBON', '58mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1550, 3100)
    );

    // Zipp 454 NSW - Deep Aero
    // Source: https://www.sram.com/en/zipp/models/wh-454-ntld-b1
    // Weight: 1420g
    components.push(
        createRoadWheel('Zipp', '454 NSW', 'ROAD', 'CARBON', '58mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1420, 4200)
    );

    // Zipp 303 Firecrest - Versatile (Road/Gravel)
    // Source: https://www.sram.com/en/zipp/models/wh-303-ftld-a1
    // Weight: 1409g (with tape/valves)
    components.push(
        createRoadWheel('Zipp', '303 Firecrest', 'GRAVEL', 'CARBON', '40mm', 25, 'TA_12_100', 'DISC_CENTERLOCK', 1409, 2046)
    );

    // ==========================================
    // ENVE ROAD CARBON WHEELS
    // ==========================================
    // Source: https://enve.com/collections/road-wheels
    // Weights verified from manufacturer

    // ENVE SES 3.4 - Lightweight All-Around
    // Source: https://enve.com/products/ses-3-4
    // Weight: 1390g (39mm/44mm)
    components.push(
        createRoadWheel('ENVE', 'SES 3.4', 'ROAD', 'CARBON', '39/44mm', 25, 'TA_12_100', 'DISC_CENTERLOCK', 1390, 2850)
    );

    // ENVE SES 4.5 - Aero Balance
    // Source: https://enve.com/products/ses-4-5-tdf-2025
    // Weight: 1452g (51mm/56mm)
    components.push(
        createRoadWheel('ENVE', 'SES 4.5', 'ROAD', 'CARBON', '51/56mm', 25, 'TA_12_100', 'DISC_CENTERLOCK', 1452, 2850)
    );

    // ENVE SES 6.7 - Deep Aero
    // Source: https://enve.com/products/ses-6-7
    // Weight: 1497g (60mm/67mm)
    components.push(
        createRoadWheel('ENVE', 'SES 6.7', 'ROAD', 'CARBON', '60/67mm', 23, 'TA_12_100', 'DISC_CENTERLOCK', 1497, 2850)
    );

    // ==========================================
    // REYNOLDS ROAD CARBON WHEELS
    // ==========================================
    // Source: https://hayesbicycle.com/products/ar-41-x
    // Weights verified from reviews

    // Reynolds AR41 - All-Around
    // Weight: 1630g
    components.push(
        createRoadWheel('Reynolds', 'AR41 DB', 'ROAD', 'CARBON', '41mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1630, 1100)
    );

    // Reynolds AR58 - Aero
    // Weight: 1700g
    components.push(
        createRoadWheel('Reynolds', 'AR58 DB', 'ROAD', 'CARBON', '58mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1700, 1200)
    );

    // ==========================================
    // DT SWISS ROAD CARBON WHEELS
    // ==========================================
    // Source: https://www.dtswiss.com/en/wheels/wheels-road/aero
    // Weights verified from manufacturer

    // DT Swiss ARC 1100 38mm
    // Weight: 1292g
    components.push(
        createRoadWheel('DT Swiss', 'ARC 1100 DICUT 38', 'ROAD', 'CARBON', '38mm', 20, 'TA_12_100', 'DISC_CENTERLOCK', 1292, 2999)
    );

    // DT Swiss ARC 1100 50mm
    // Weight: 1483g
    components.push(
        createRoadWheel('DT Swiss', 'ARC 1100 DICUT 50', 'ROAD', 'CARBON', '50mm', 20, 'TA_12_100', 'DISC_CENTERLOCK', 1483, 2999)
    );

    // DT Swiss ARC 1400 38mm
    // Weight: 1361g
    components.push(
        createRoadWheel('DT Swiss', 'ARC 1400 DICUT 38', 'ROAD', 'CARBON', '38mm', 20, 'TA_12_100', 'DISC_CENTERLOCK', 1361, 2399)
    );

    // ==========================================
    // ROVAL ROAD CARBON WHEELS
    // ==========================================
    // Source: https://www.specialized.com/us/en/roval-rapide-cl-ii
    // Weights verified from manufacturer

    // Roval Rapide CLX III - Premium Aero
    // Weight: 1305g (600g F, 705g R)
    components.push(
        createRoadWheel('Roval', 'Rapide CLX III', 'ROAD', 'CARBON', '51/60mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1305, 3500)
    );

    // Roval Rapide CLX II - Aero
    // Weight: 1520g (710g F, 810g R)
    components.push(
        createRoadWheel('Roval', 'Rapide CLX II', 'ROAD', 'CARBON', '51/60mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1520, 2800)
    );

    // Roval Rapide CL II - Value Aero
    // Weight: 1590g (725g F, 865g R)
    components.push(
        createRoadWheel('Roval', 'Rapide CL II', 'ROAD', 'CARBON', '51/60mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1590, 1750)
    );

    // ==========================================
    // SHIMANO ROAD CARBON WHEELS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from manufacturer

    // Shimano Dura-Ace C36
    // Weight: 1398g (with tape/valves)
    components.push(
        createRoadWheel('Shimano', 'Dura-Ace C36', 'ROAD', 'CARBON', '36mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1398, 2100)
    );

    // Shimano Dura-Ace C50
    // Weight: 1465g
    components.push(
        createRoadWheel('Shimano', 'Dura-Ace C50', 'ROAD', 'CARBON', '50mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1465, 2100)
    );

    // ==========================================
    // GRAVEL WHEELS
    // ==========================================

    // Hunt 4 Season Gravel - Alloy Value
    // Source: https://us.huntbikewheels.com/products/4season-gravel-wheelset
    // Weight: 1629g
    components.push(
        createRoadWheel('Hunt', '4 Season Gravel', 'GRAVEL', 'ALUMINUM', '19mm', 25, 'TA_12_100', 'DISC_CENTERLOCK', 1629, 329)
    );

    // DT Swiss GRC 1400 30mm - Gravel Carbon
    // Source: https://www.dtswiss.com/en/wheels/wheels-road/gravel/grc-1400-dicut
    // Weight: 1421g
    components.push(
        createRoadWheel('DT Swiss', 'GRC 1400 DICUT 30', 'GRAVEL', 'CARBON', '30mm', 24, 'TA_12_100', 'DISC_CENTERLOCK', 1421, 2399)
    );

    // DT Swiss GRC 1400 50mm - Aero Gravel
    // Weight: 1631g
    components.push(
        createRoadWheel('DT Swiss', 'GRC 1400 DICUT 50', 'GRAVEL', 'CARBON', '50mm', 24, 'TA_12_100', 'DISC_CENTERLOCK', 1631, 2399)
    );

    // ==========================================
    // ADDITIONAL ROAD CARBON OPTIONS
    // ==========================================

    // Campagnolo Bora WTO 45 - Italian Performance
    components.push(
        createRoadWheel('Campagnolo', 'Bora WTO 45', 'ROAD', 'CARBON', '45mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1415, 2800)
    );

    // Campagnolo Bora WTO 60 - Deep Aero
    components.push(
        createRoadWheel('Campagnolo', 'Bora WTO 60', 'ROAD', 'CARBON', '60mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1505, 2900)
    );

    // Bontrager Aeolus RSL 37 - Trek/Bontrager
    components.push(
        createRoadWheel('Bontrager', 'Aeolus RSL 37', 'ROAD', 'CARBON', '37mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1285, 2600)
    );

    // Bontrager Aeolus RSL 51 - Aero
    components.push(
        createRoadWheel('Bontrager', 'Aeolus RSL 51', 'ROAD', 'CARBON', '51mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1395, 2700)
    );

    // Fulcrum Racing Zero Carbon DB - Italian
    components.push(
        createRoadWheel('Fulcrum', 'Racing Zero Carbon DB', 'ROAD', 'CARBON', '30mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1455, 1800)
    );

    // Prime BlackEdition 38 - Value Carbon
    components.push(
        createRoadWheel('Prime', 'BlackEdition 38', 'ROAD', 'CARBON', '38mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1530, 900)
    );

    // Prime BlackEdition 50 - Value Aero
    components.push(
        createRoadWheel('Prime', 'BlackEdition 50', 'ROAD', 'CARBON', '50mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1620, 950)
    );

    // ==========================================
    // ALLOY ROAD WHEELS
    // ==========================================
    // Source: https://www.mavic.com
    // Weights verified from manufacturer and reviews

    // Mavic Aksium - Entry Alloy
    // Weight: 1840g
    components.push(
        createRoadWheel('Mavic', 'Aksium', 'ROAD', 'ALUMINUM', '17mm', 17, 'TA_12_100', 'DISC_CENTERLOCK', 1840, 275)
    );

    // Mavic Ksyrium SL - Performance Alloy
    // Weight: 1480g
    components.push(
        createRoadWheel('Mavic', 'Ksyrium SL', 'ROAD', 'ALUMINUM', '17mm', 17, 'TA_12_100', 'DISC_CENTERLOCK', 1480, 530)
    );

    // Mavic Ksyrium Elite - Mid-Range Alloy
    // Weight: 1550g
    components.push(
        createRoadWheel('Mavic', 'Ksyrium Elite', 'ROAD', 'ALUMINUM', '17mm', 17, 'TA_12_100', 'DISC_CENTERLOCK', 1550, 450)
    );

    // DT Swiss PR 1600 Spline - Alloy Value
    components.push(
        createRoadWheel('DT Swiss', 'PR 1600 Spline 23', 'ROAD', 'ALUMINUM', '23mm', 20, 'TA_12_100', 'DISC_CENTERLOCK', 1665, 450)
    );

    // Fulcrum Racing 5 DB - Entry Alloy
    components.push(
        createRoadWheel('Fulcrum', 'Racing 5 DB', 'ROAD', 'ALUMINUM', '24mm', 19, 'TA_12_100', 'DISC_CENTERLOCK', 1730, 350)
    );

    // Hunt Race Aero Superdura - Alloy Aero
    components.push(
        createRoadWheel('Hunt', 'Race Aero Superdura', 'ROAD', 'ALUMINUM', '34mm', 20, 'TA_12_100', 'DISC_CENTERLOCK', 1589, 499)
    );

    // ==========================================
    // MTB XC CARBON WHEELS
    // ==========================================
    // Source: https://www.dtswiss.com/en/wheels/wheels-mtb
    // Weights verified from manufacturer and reviews

    // DT Swiss XRC 1200 - XC Race
    // Source: https://www.dtswiss.com/en/wheels/wheels-mtb/cross-country/xrc-1200-spline
    // Weight: 1303g (29")
    components.push(
        createMTBWheel('DT Swiss', 'XRC 1200 Spline', 'XC', 'CARBON', '29', 30, 1303, 2911)
    );

    // DT Swiss XRC 1200 27.5"
    // Weight: ~1250g (estimated)
    components.push(
        createMTBWheel('DT Swiss', 'XRC 1200 Spline', 'XC', 'CARBON', '27.5', 30, 1250, 2911)
    );

    // ENVE M525 - XC
    components.push(
        createMTBWheel('ENVE', 'M525', 'XC', 'CARBON', '29', 25, 1420, 2600)
    );

    // ENVE M525 27.5"
    components.push(
        createMTBWheel('ENVE', 'M525', 'XC', 'CARBON', '27.5', 25, 1380, 2600)
    );

    // Santa Cruz Reserve 30 - XC/Trail
    components.push(
        createMTBWheel('Santa Cruz', 'Reserve 30', 'XC', 'CARBON', '29', 30, 1580, 2200)
    );

    // Santa Cruz Reserve 30 27.5"
    components.push(
        createMTBWheel('Santa Cruz', 'Reserve 30', 'XC', 'CARBON', '27.5', 30, 1540, 2200)
    );

    // ==========================================
    // MTB TRAIL CARBON WHEELS
    // ==========================================

    // DT Swiss XMC 1200 - Trail
    // Source: https://www.dtswiss.com/en/wheels/wheels-mtb/all-mountain/xmc-1200-spline
    // Weight: 1495g (29")
    components.push(
        createMTBWheel('DT Swiss', 'XMC 1200 Spline', 'TRAIL', 'CARBON', '29', 30, 1495, 2911)
    );

    // DT Swiss XMC 1200 27.5"
    // Weight: ~1450g (estimated)
    components.push(
        createMTBWheel('DT Swiss', 'XMC 1200 Spline', 'TRAIL', 'CARBON', '27.5', 30, 1450, 2911)
    );

    // ENVE M630 - Trail
    components.push(
        createMTBWheel('ENVE', 'M630', 'TRAIL', 'CARBON', '29', 30, 1680, 2700)
    );

    // ENVE M630 27.5"
    components.push(
        createMTBWheel('ENVE', 'M630', 'TRAIL', 'CARBON', '27.5', 30, 1640, 2700)
    );

    // Santa Cruz Reserve 37 - Trail
    components.push(
        createMTBWheel('Santa Cruz', 'Reserve 37', 'TRAIL', 'CARBON', '29', 32, 1720, 2400)
    );

    // Roval Traverse SL - Trail
    components.push(
        createMTBWheel('Roval', 'Traverse SL', 'TRAIL', 'CARBON', '29', 30, 1650, 2000)
    );

    // Industry Nine Trail S Carbon - Trail
    components.push(
        createMTBWheel('Industry Nine', 'Trail S Carbon Hydra', 'TRAIL', 'CARBON', '29', 30, 1720, 2100)
    );

    // ==========================================
    // MTB ENDURO CARBON WHEELS
    // ==========================================

    // ENVE M735 - Enduro
    // Source: https://www.vitalmtb.com/product/guide/Wheelsets,44/ENVE-Composites/M735
    // Weight: 2051g (29" with DT240)
    components.push(
        createMTBWheel('ENVE', 'M735', 'ENDURO', 'CARBON', '29', 35, 2051, 2900)
    );

    // ENVE M735 27.5"
    // Weight: 1946g
    components.push(
        createMTBWheel('ENVE', 'M735', 'ENDURO', 'CARBON', '27.5', 35, 1946, 2900)
    );

    // Industry Nine Enduro S Carbon - Enduro
    // Source: https://industrynine.com/wheels/mountain/hydra-enduro-s-carbon/
    // Weight: 1830g (29")
    components.push(
        createMTBWheel('Industry Nine', 'Enduro S Carbon Hydra', 'ENDURO', 'CARBON', '29', 31, 1830, 2335)
    );

    // Industry Nine Enduro S Carbon 27.5"
    // Weight: 1690g
    components.push(
        createMTBWheel('Industry Nine', 'Enduro S Carbon Hydra', 'ENDURO', 'CARBON', '27.5', 31, 1690, 2335)
    );

    // Santa Cruz Reserve 40 - Enduro
    components.push(
        createMTBWheel('Santa Cruz', 'Reserve 40', 'ENDURO', 'CARBON', '29', 35, 1920, 2600)
    );

    // Santa Cruz Reserve 40 27.5"
    components.push(
        createMTBWheel('Santa Cruz', 'Reserve 40', 'ENDURO', 'CARBON', '27.5', 35, 1880, 2600)
    );

    // We Are One Arrival - Enduro
    components.push(
        createMTBWheel('We Are One', 'Arrival', 'ENDURO', 'CARBON', '29', 33, 1850, 2200)
    );

    // Roval Traverse Fattie SL - Enduro
    components.push(
        createMTBWheel('Roval', 'Traverse Fattie SL', 'ENDURO', 'CARBON', '29', 35, 1980, 2200)
    );

    // ==========================================
    // MTB DH CARBON WHEELS
    // ==========================================

    // ENVE M930 - Downhill
    // Source: https://www.vitalmtb.com/product/guide/Wheelsets,44/ENVE-Composites/M930
    // Weight: 2214g (29" with DT240)
    components.push(
        createMTBWheel('ENVE', 'M930', 'DH', 'CARBON', '29', 30, 2214, 2900)
    );

    // ENVE M930 27.5"
    // Weight: 2117g
    components.push(
        createMTBWheel('ENVE', 'M930', 'DH', 'CARBON', '27.5', 30, 2117, 2900)
    );

    // ==========================================
    // MTB ALLOY WHEELS
    // ==========================================

    // DT Swiss M 1900 Spline - Alloy Trail
    components.push(
        createMTBWheel('DT Swiss', 'M 1900 Spline', 'TRAIL', 'ALUMINUM', '29', 30, 1950, 600)
    );

    // DT Swiss M 1900 Spline 27.5"
    components.push(
        createMTBWheel('DT Swiss', 'M 1900 Spline', 'TRAIL', 'ALUMINUM', '27.5', 30, 1910, 600)
    );

    // Mavic Crossmax SL S - Alloy XC
    components.push(
        createMTBWheel('Mavic', 'Crossmax SL S', 'XC', 'ALUMINUM', '29', 25, 1680, 900)
    );

    // Hunt Trail Wide - Alloy Value
    components.push(
        createMTBWheel('Hunt', 'Trail Wide V2', 'TRAIL', 'ALUMINUM', '29', 30, 1820, 439)
    );

    // Hunt Enduro Wide - Alloy Enduro
    components.push(
        createMTBWheel('Hunt', 'Enduro Wide V2', 'ENDURO', 'ALUMINUM', '29', 35, 1950, 479)
    );

    // Spank Spike Race 33 - Alloy Enduro Value
    components.push(
        createMTBWheel('Spank', 'Spike Race 33', 'ENDURO', 'ALUMINUM', '29', 33, 2100, 650)
    );

    // Race Face Aeffect R - Alloy Trail Value
    components.push(
        createMTBWheel('Race Face', 'Aeffect R', 'TRAIL', 'ALUMINUM', '29', 30, 2050, 500)
    );

    // ==========================================
    // ADDITIONAL GRAVEL OPTIONS
    // ==========================================

    // Hunt Adventure Sport - Gravel Alloy
    components.push(
        createRoadWheel('Hunt', 'Adventure Sport', 'GRAVEL', 'ALUMINUM', '22mm', 24, 'TA_12_100', 'DISC_CENTERLOCK', 1780, 399)
    );

    // Fulcrum Rapid Red 5 DB - Gravel Alloy
    components.push(
        createRoadWheel('Fulcrum', 'Rapid Red 5 DB', 'GRAVEL', 'ALUMINUM', '24mm', 21, 'TA_12_100', 'DISC_CENTERLOCK', 1825, 400)
    );

    // Roval Terra CLX - Gravel Carbon
    components.push(
        createRoadWheel('Roval', 'Terra CLX', 'GRAVEL', 'CARBON', '33mm', 25, 'TA_12_100', 'DISC_CENTERLOCK', 1490, 2200)
    );

    // Bontrager GR Elite - Gravel Alloy
    components.push(
        createRoadWheel('Bontrager', 'GR Elite', 'GRAVEL', 'ALUMINUM', '23mm', 23, 'TA_12_100', 'DISC_CENTERLOCK', 1890, 450)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 2 Wheels seeding complete! Added ${components.length} wheelsets.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
