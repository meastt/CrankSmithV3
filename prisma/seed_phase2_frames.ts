import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 2 - Frames...');

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

    // Helper for Road/Gravel Frame
    const createRoadFrame = (brand: string, model: string, category: 'ROAD' | 'GRAVEL', material: string, size: string, wheelSize: string, bbShell: string, rearAxle: string, seatpost: string, brakeMount: string, maxTire: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${size}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Frame',
            name: `${brand} ${model} (${size})`,
            interfaces: JSON.stringify({
                frame_type: category,
                wheel_size: wheelSize,
                bb_shell: bbShell,
                rear_axle: rearAxle,
                seatpost_diameter: seatpost,
                brake_mount: brakeMount,
                steerer_tube: 'TAPERED'
            }),
            attributes: JSON.stringify({
                category,
                material,
                size,
                max_tire: maxTire,
                weight,
                price,
                udh: category === 'GRAVEL'
            })
        };
    };

    // Helper for MTB Frame
    const createMTBFrame = (brand: string, model: string, carbon: string, size: string, wheelSize: string, travel: number, bbShell: string, rearAxle: string, seatpost: string, maxTire: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${carbon}-${size}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Frame',
            name: `${brand} ${model} ${carbon} (${size})`,
            interfaces: JSON.stringify({
                frame_type: 'MTB',
                wheel_size: wheelSize,
                bb_shell: bbShell,
                rear_axle: rearAxle,
                seatpost_diameter: seatpost,
                brake_mount: 'POST_MOUNT',
                steerer_tube: 'TAPERED'
            }),
            attributes: JSON.stringify({
                category: 'MTB',
                material: 'CARBON',
                carbon_grade: carbon,
                size,
                travel,
                max_tire: maxTire,
                weight,
                price,
                udh: true
            })
        };
    };

    // ==========================================
    // ROAD RACE FRAMES
    // ==========================================
    // Source: https://www.specialized.com & https://www.cervelo.com
    // Weights verified from manufacturer specs and reviews

    // Specialized Tarmac SL8 - Aero Race
    // Source: https://www.specialized.com/us/en/s-works-tarmac-sl8-frameset/p/216956
    // S-Works (FACT 12r) frame: 685g, fork: 350g (size 56)
    components.push(
        createRoadFrame('Specialized', 'Tarmac SL8 S-Works', 'ROAD', 'CARBON', '56cm', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 32, 685, 5500),
        createRoadFrame('Specialized', 'Tarmac SL8', 'ROAD', 'CARBON', '56cm', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 32, 780, 3500)
    );

    // Cervelo S5 - Aero Race
    // Source: https://www.cervelo.com/en-US/bikes/s5
    // Weight includes frame with integrated cockpit hardware
    components.push(
        createRoadFrame('Cervelo', 'S5', 'ROAD', 'CARBON', '56cm', '700c', 'BB86', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 30, 950, 6500)
    );

    // Cervelo R5 - Lightweight Race
    // Source: https://www.cervelo.com/en-US/bikes/r5
    // Frame: 651g, Fork: 298g (size 56)
    components.push(
        createRoadFrame('Cervelo', 'R5', 'ROAD', 'CARBON', '56cm', '700c', 'BB86', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 30, 651, 5400)
    );

    // Canyon Aeroad CFR - Aero Race
    // Source: https://www.canyon.com/en-us/road-bikes/race/aeroad/
    // Frame: 960g (painted, size M)
    components.push(
        createRoadFrame('Canyon', 'Aeroad CFR', 'ROAD', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 31, 960, 4499)
    );

    // Trek Madone Gen 8 SLR - Aero/Lightweight
    // Source: https://www.trekbikes.com/us/en_US/bikes/road-bikes/
    // Frame: 796g (painted, size M/L)
    components.push(
        createRoadFrame('Trek', 'Madone SLR Gen 8', 'ROAD', 'CARBON', 'ML', '700c', 'T47_INT_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 32, 796, 5800),
        createRoadFrame('Trek', 'Madone SL Gen 8', 'ROAD', 'CARBON', 'ML', '700c', 'T47_INT_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 32, 1054, 3800)
    );

    // Pinarello Dogma F - Race
    // Source: https://www.pinarello.com/us/en/bikes/road/dogma-f
    // Frame: 941g (size 54)
    components.push(
        createRoadFrame('Pinarello', 'Dogma F', 'ROAD', 'CARBON', '54cm', '700c', 'BB86', 'TA_12_142', '31.6mm', 'FLAT_MOUNT', 30, 941, 6950)
    );

    // ==========================================
    // ENDURANCE ROAD FRAMES
    // ==========================================

    // Specialized Roubaix SL8 - Endurance
    // Source: https://www.specialized.com/us/en/s-works-roubaix-sl8/p/216941
    // S-Works frame: 825g (size 56)
    components.push(
        createRoadFrame('Specialized', 'Roubaix SL8 S-Works', 'ROAD', 'CARBON', '56cm', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 38, 825, 4800),
        createRoadFrame('Specialized', 'Roubaix SL8 Expert', 'ROAD', 'CARBON', '56cm', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 38, 950, 3200)
    );

    // Trek Domane SLR - Endurance
    // Source: https://www.trekbikes.com/us/en_US/bikes/road-bikes/performance-road-bikes/domane/
    // SLR frameset: 1700g (includes IsoSpeed, size 56)
    components.push(
        createRoadFrame('Trek', 'Domane SLR Gen 4', 'ROAD', 'CARBON', '56cm', '700c', 'T47_INT_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 38, 1120, 4200)
    );

    // ==========================================
    // GRAVEL FRAMES
    // ==========================================

    // 3T Exploro RaceMax - Aero Gravel
    // Source: https://3t.bike/collections/racemax-wpnt
    // Frame: 1050-1150g (size M)
    components.push(
        createRoadFrame('3T', 'Exploro RaceMax', 'GRAVEL', 'CARBON', 'M', '700c', 'BB386', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 42, 1100, 3200)
    );

    // Open WIDE - Extreme Gravel
    // Source: https://opencycle.com/wide-frameset/
    // Frame: 1040g (size M)
    components.push(
        createRoadFrame('Open', 'WIDE', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 57, 1040, 3200)
    );

    // Allied Able Gen 2 - Gravel Race
    // Source: https://alliedcycleworks.com/products/able-frameset-custom
    // Frame: 950g (size M)
    components.push(
        createRoadFrame('Allied', 'Able Gen 2', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 57, 950, 4500)
    );

    // Cervelo Aspero - Gravel Race
    // Source: https://www.cervelo.com/en-US/bikes/aspero
    // Frameset weight ~900g (size 54)
    components.push(
        createRoadFrame('Cervelo', 'Aspero', 'GRAVEL', 'CARBON', '54cm', '700c', 'T47_INT_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 45, 900, 2500)
    );

    // Canyon Grail CF SLX - Gravel Race
    // Source: https://www.canyon.com/en-us/gravel-bikes/race/grail/
    // CF SLX frame: 933g, CFR: 855g (size M)
    components.push(
        createRoadFrame('Canyon', 'Grail CFR', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 42, 855, 3800),
        createRoadFrame('Canyon', 'Grail CF SLX', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', 'Integrated', 'FLAT_MOUNT', 42, 933, 2800)
    );

    // ==========================================
    // MTB XC FRAMES
    // ==========================================
    // Source: https://www.santacruzbicycles.com & https://yeticycles.com
    // Weights verified from manufacturer specs and reviews

    // Santa Cruz Blur - XC 29"
    // Source: https://www.santacruzbicycles.com/en-US/bikes/blur
    // Carbon CC: 1860g, Carbon C: ~2100g (size M, with shock)
    // 107-115mm rear travel
    components.push(
        createMTBFrame('Santa Cruz', 'Blur', 'CC', 'M', '29', 115, 'BSA_73', 'TA_12_148', '30.9mm', 60, 1860, 4000),
        createMTBFrame('Santa Cruz', 'Blur', 'C', 'M', '29', 115, 'BSA_73', 'TA_12_148', '30.9mm', 60, 2100, 3000)
    );

    // Yeti SB120 - XC/Down-Country
    // Source: https://yeticycles.com/en-us/bikes/sb120
    // Turq: 3021g, C-Series: 3246g (size M, with shock)
    // 120mm rear travel
    components.push(
        createMTBFrame('Yeti', 'SB120', 'Turq', 'M', '29', 120, 'BSA_73', 'TA_12_148', '30.9mm', 60, 3021, 5400),
        createMTBFrame('Yeti', 'SB120', 'C-Series', 'M', '29', 120, 'BSA_73', 'TA_12_148', '30.9mm', 60, 3246, 3900)
    );

    // Pivot Mach 4 SL - XC
    // Source: https://global.pivotcycles.com/bikes/mach-4-sl
    // Frame: 1975g (size M, with shock)
    // 106-115mm rear travel
    components.push(
        createMTBFrame('Pivot', 'Mach 4 SL', 'Pro', 'M', '29', 115, 'BSA_73', 'TA_12_148', '30.9mm', 60, 1975, 5500)
    );

    // Specialized Epic EVO - XC/Trail
    // Source: https://www.specialized.com/us/en/epic-8-evo/
    // S-Works: 1795g, Standard: 1965g (size M, with shock)
    // 120mm rear travel
    components.push(
        createMTBFrame('Specialized', 'Epic 8 EVO', 'S-Works', 'M', '29', 120, 'BSA_73', 'TA_12_148', '34.9mm', 60, 1795, 4200),
        createMTBFrame('Specialized', 'Epic 8 EVO', 'Standard', 'M', '29', 120, 'BSA_73', 'TA_12_148', '34.9mm', 60, 1965, 3000)
    );

    // Trek Supercaliber - XC Race
    // Source: https://www.trekbikes.com/us/en_US/supercaliber/
    // SLR: 1950g, SL: 2100g (size M, with shock)
    // 80mm rear travel
    components.push(
        createMTBFrame('Trek', 'Supercaliber', 'SLR', 'M', '29', 80, 'T47_INT_73', 'TA_12_148', '27.2mm', 60, 1950, 5000),
        createMTBFrame('Trek', 'Supercaliber', 'SL', 'M', '29', 80, 'T47_INT_73', 'TA_12_148', '27.2mm', 60, 2100, 3500)
    );

    // ==========================================
    // MTB TRAIL FRAMES
    // ==========================================

    // Yeti SB140 - Trail 29"
    // Source: https://yeticycles.com/en-us/bikes/sb140
    // Turq: 3375g, C-Series: 3549g (size M, with shock)
    // 140mm rear travel
    components.push(
        createMTBFrame('Yeti', 'SB140', 'Turq', 'M', '29', 140, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3375, 5700),
        createMTBFrame('Yeti', 'SB140', 'C-Series', 'M', '29', 140, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3549, 4200)
    );

    // Yeti SB160 - Enduro/Trail 29"
    // Source: https://yeticycles.com/en-us/bikes/sb160
    // Turq: 3806g (size M, with shock)
    // 160mm rear travel
    components.push(
        createMTBFrame('Yeti', 'SB160', 'Turq', 'M', '29', 160, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3806, 4800)
    );

    // ==========================================
    // MTB ENDURO FRAMES
    // ==========================================

    // Santa Cruz Megatower - Enduro 29"
    // Source: https://www.santacruzbicycles.com/en-US/bikes/megatower
    // Carbon CC: 3250g (size M, with shock)
    // 165mm rear travel
    components.push(
        createMTBFrame('Santa Cruz', 'Megatower', 'CC', 'M', '29', 165, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3250, 4500)
    );

    // Yeti SB165 - Enduro Mixed Wheels
    // Source: https://yeticycles.com/en-us/bikes/sb165
    // Turq: ~3700g (size M, with shock, estimated from complete bike)
    // 165mm rear travel, Mixed wheels (29" front / 27.5" rear)
    components.push(
        createMTBFrame('Yeti', 'SB165', 'Turq', 'M', '29', 165, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3700, 4800)
    );

    // Pivot Firebird - Enduro 29"
    // Source: https://global.pivotcycles.com/products/firebird
    // Frame: ~2800g (size M, with shock, estimated)
    // 165mm rear travel
    components.push(
        createMTBFrame('Pivot', 'Firebird', 'Pro', 'M', '29', 165, 'BSA_73', 'TA_12_148', '30.9mm', 65, 2800, 5000)
    );

    // ==========================================
    // ADDITIONAL ROAD/GRAVEL OPTIONS
    // ==========================================

    // Giant TCR Advanced SL - Road Race
    // Popular race frame, competitive pricing
    components.push(
        createRoadFrame('Giant', 'TCR Advanced SL', 'ROAD', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 30, 800, 2800)
    );

    // Cannondale SuperSix EVO - Road Race
    // Well-known lightweight race frame
    components.push(
        createRoadFrame('Cannondale', 'SuperSix EVO Hi-Mod', 'ROAD', 'CARBON', '56cm', '700c', 'BB30_68', 'TA_12_142', '25.4mm', 'FLAT_MOUNT', 30, 770, 4200)
    );

    // BMC Teammachine SLR - Road Race
    // Swiss engineering, race-proven
    components.push(
        createRoadFrame('BMC', 'Teammachine SLR01', 'ROAD', 'CARBON', '56cm', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 30, 880, 5200)
    );

    // Colnago V4Rs - Road Race
    // Italian icon, race heritage
    components.push(
        createRoadFrame('Colnago', 'V4Rs', 'ROAD', 'CARBON', '54cm', '700c', 'BB86', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 30, 890, 6800)
    );

    // Bianchi Oltre RC - Road Race
    // Celeste heritage, aero race
    components.push(
        createRoadFrame('Bianchi', 'Oltre RC', 'ROAD', 'CARBON', '55cm', '700c', 'BB86', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 30, 920, 5000)
    );

    // Lauf Seigla - Gravel
    // Icelandic innovation, integrated suspension
    components.push(
        createRoadFrame('Lauf', 'Seigla', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 45, 980, 3600)
    );

    // Rondo Ruut CF2 - Gravel
    // Polish versatility, twin-tip design
    components.push(
        createRoadFrame('Rondo', 'Ruut CF2', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 50, 1050, 2800)
    );

    // Orbea Terra - Gravel
    // Spanish quality, endurance-focused
    components.push(
        createRoadFrame('Orbea', 'Terra M-LTD', 'GRAVEL', 'CARBON', 'M', '700c', 'BSA_68', 'TA_12_142', '27.2mm', 'FLAT_MOUNT', 40, 960, 3200)
    );

    // ==========================================
    // ADDITIONAL MTB OPTIONS
    // ==========================================

    // Ibis Ripmo AF - Trail Alloy
    // Affordable trail option, aluminum
    components.push(
        createMTBFrame('Ibis', 'Ripmo AF', 'Alloy', 'M', '29', 147, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3100, 2200)
    );

    // Evil Offering - Enduro
    // PNW brand, aggressive geometry
    components.push(
        createMTBFrame('Evil', 'Offering', 'V3', 'M', '29', 160, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3200, 4200)
    );

    // Transition Sentinel - Trail/Enduro
    // Washington-based, versatile platform
    components.push(
        createMTBFrame('Transition', 'Sentinel', 'Carbon', 'M', '29', 150, 'BSA_73', 'TA_12_148', '30.9mm', 65, 3100, 4000)
    );

    // Norco Range - Enduro
    // Canadian engineering, adjustable geometry
    components.push(
        createMTBFrame('Norco', 'Range C1', 'Carbon', 'M', '29', 170, 'BSA_73', 'TA_12_148', '31.6mm', 65, 3400, 4800)
    );

    // Rocky Mountain Altitude - Trail
    // BC roots, versatile trail bike
    components.push(
        createMTBFrame('Rocky Mountain', 'Altitude C90', 'Carbon', 'M', '29', 145, 'BSA_73', 'TA_12_148', '30.9mm', 65, 2950, 4200)
    );

    // Intense Tracer - Trail
    // California made, precision engineering
    components.push(
        createMTBFrame('Intense', 'Tracer 279', 'Pro', 'M', '29', 140, 'BSA_73', 'TA_12_148', '30.9mm', 65, 2850, 4600)
    );

    // Guerrilla Gravity Trail Pistol - Trail
    // Made in USA, modular design
    components.push(
        createMTBFrame('Guerrilla Gravity', 'Trail Pistol', 'Carbon', 'M', '29', 140, 'BSA_73', 'TA_12_148', '30.9mm', 65, 2900, 3800)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 2 Frames seeding complete! Added ${components.length} frames.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
