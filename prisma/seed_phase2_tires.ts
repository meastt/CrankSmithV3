import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 2 - Tires...');

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

    // Helper for Road Tire
    const createRoadTire = (brand: string, model: string, width: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${width}mm`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Tire',
            name: `${brand} ${model} ${width}mm`,
            interfaces: JSON.stringify({
                diameter: '700c',
                tire_type: 'ROAD'
            }),
            attributes: JSON.stringify({
                width,
                weight,
                price,
                tubeless_ready: true,
                compound: 'RACE'
            })
        };
    };

    // Helper for Gravel Tire
    const createGravelTire = (brand: string, model: string, width: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${width}mm`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Tire',
            name: `${brand} ${model} ${width}mm`,
            interfaces: JSON.stringify({
                diameter: '700c',
                tire_type: 'GRAVEL'
            }),
            attributes: JSON.stringify({
                width,
                weight,
                price,
                tubeless_ready: true,
                tread_pattern: 'KNOB'
            })
        };
    };

    // Helper for MTB Tire
    const createMTBTire = (brand: string, model: string, wheelSize: string, width: string, weight: number, price: number) => {
        const id = `${brand}-${model}-${wheelSize}-${width}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Tire',
            name: `${brand} ${model} ${wheelSize}" ${width}`,
            interfaces: JSON.stringify({
                diameter: wheelSize === '29' ? '29' : '27.5',
                tire_type: 'MTB'
            }),
            attributes: JSON.stringify({
                wheel_size: wheelSize,
                width,
                weight,
                price,
                tubeless_ready: true,
                tread_pattern: 'AGGRESSIVE'
            })
        };
    };

    // ==========================================
    // CONTINENTAL ROAD TIRES
    // ==========================================
    // Source: https://www.continental-tires.com
    // Weights verified from manufacturer and reviews

    // Continental GP5000 S TR - Flagship Road Tire
    // Source: https://www.continental-tires.com/products/b2c/bicycle/tires/grand-prix-5000-s-tr/
    // Weights: https://www.bicyclerollingresistance.com/specials/grand-prix-5000-s-tr-comparison
    components.push(
        createRoadTire('Continental', 'GP5000 S TR', 25, 250, 80),
        createRoadTire('Continental', 'GP5000 S TR', 28, 275, 80),
        createRoadTire('Continental', 'GP5000 S TR', 30, 295, 80),
        createRoadTire('Continental', 'GP5000 S TR', 32, 320, 80)
    );

    // ==========================================
    // PIRELLI ROAD TIRES
    // ==========================================
    // Source: https://www.pirelli.com/tyres/en-ww/bike
    // Weights verified from reviews

    // Pirelli P Zero Race TLR - Race Performance
    // Source: https://www.bicyclerollingresistance.com/road-bike-reviews/pirelli-p-zero-race-tlr-28
    components.push(
        createRoadTire('Pirelli', 'P Zero Race TLR', 26, 275, 75),
        createRoadTire('Pirelli', 'P Zero Race TLR', 28, 295, 75),
        createRoadTire('Pirelli', 'P Zero Race TLR', 30, 315, 75)
    );

    // ==========================================
    // VITTORIA ROAD TIRES
    // ==========================================
    // Source: https://vittoria.com/products/corsa-pro-tubeless-ready
    // Weights verified from manufacturer

    // Vittoria Corsa Pro TLR - Performance Road
    // Source: https://www.bicyclerollingresistance.com/road-bike-reviews/vittoria-corsa-pro-tlr
    components.push(
        createRoadTire('Vittoria', 'Corsa Pro TLR', 26, 260, 85),
        createRoadTire('Vittoria', 'Corsa Pro TLR', 28, 280, 85),
        createRoadTire('Vittoria', 'Corsa Pro TLR', 30, 285, 85)
    );

    // ==========================================
    // MICHELIN ROAD TIRES
    // ==========================================

    // Michelin Power Cup TLR - Race
    components.push(
        createRoadTire('Michelin', 'Power Cup TLR', 25, 255, 70),
        createRoadTire('Michelin', 'Power Cup TLR', 28, 275, 70)
    );

    // Michelin Power Road TLR - Training
    components.push(
        createRoadTire('Michelin', 'Power Road TLR', 25, 265, 60),
        createRoadTire('Michelin', 'Power Road TLR', 28, 285, 60)
    );

    // ==========================================
    // SCHWALBE GRAVEL TIRES
    // ==========================================
    // Source: https://www.schwalbe.com
    // Weights verified from manufacturer

    // Schwalbe G-One Allround - Versatile Gravel
    // Source: https://www.bicyclerollingresistance.com/cx-gravel-reviews/schwalbe-g-one-allround
    components.push(
        createGravelTire('Schwalbe', 'G-One Allround', 35, 420, 65),
        createGravelTire('Schwalbe', 'G-One Allround', 40, 523, 65)
    );

    // Schwalbe G-One Speed - Fast Gravel
    components.push(
        createGravelTire('Schwalbe', 'G-One Speed', 35, 335, 70),
        createGravelTire('Schwalbe', 'G-One Speed', 40, 365, 70)
    );

    // Schwalbe G-One Bite - Aggressive Gravel
    components.push(
        createGravelTire('Schwalbe', 'G-One Bite', 35, 460, 70),
        createGravelTire('Schwalbe', 'G-One Bite', 40, 550, 70)
    );

    // ==========================================
    // PANARACER GRAVEL TIRES
    // ==========================================
    // Source: https://www.panaracerusa.com
    // Weights verified from reviews

    // Panaracer GravelKing SS - Slick Gravel
    // Source: https://www.bicyclerollingresistance.com/cx-gravel-reviews/panaracer-gravel-king-ss
    components.push(
        createGravelTire('Panaracer', 'GravelKing SS', 32, 330, 55),
        createGravelTire('Panaracer', 'GravelKing SS', 35, 380, 55),
        createGravelTire('Panaracer', 'GravelKing SS', 38, 410, 55),
        createGravelTire('Panaracer', 'GravelKing SS', 43, 480, 60)
    );

    // Panaracer GravelKing SK - Knobby Gravel
    components.push(
        createGravelTire('Panaracer', 'GravelKing SK', 35, 395, 60),
        createGravelTire('Panaracer', 'GravelKing SK', 38, 425, 60),
        createGravelTire('Panaracer', 'GravelKing SK', 43, 495, 65)
    );

    // ==========================================
    // WTB GRAVEL TIRES
    // ==========================================

    // WTB Riddler - Fast Gravel
    components.push(
        createGravelTire('WTB', 'Riddler', 37, 395, 60),
        createGravelTire('WTB', 'Riddler', 45, 480, 65)
    );

    // WTB Venture - All-Road
    components.push(
        createGravelTire('WTB', 'Venture', 40, 440, 55),
        createGravelTire('WTB', 'Venture', 50, 550, 60)
    );

    // WTB Byway - Road Plus
    components.push(
        createGravelTire('WTB', 'Byway', 40, 420, 55),
        createGravelTire('WTB', 'Byway', 44, 450, 55)
    );

    // ==========================================
    // RENE HERSE GRAVEL TIRES
    // ==========================================

    // Rene Herse Snoqualmie Pass - All-Road
    components.push(
        createGravelTire('Rene Herse', 'Snoqualmie Pass', 44, 485, 85)
    );

    // Rene Herse Barlow Pass - Light Gravel
    components.push(
        createGravelTire('Rene Herse', 'Barlow Pass', 38, 395, 80)
    );

    // ==========================================
    // MAXXIS MTB TIRES
    // ==========================================
    // Source: https://www.maxxis.com
    // Weights verified from reviews and forums

    // Maxxis Minion DHF - Aggressive Trail/Enduro
    // Source: https://www.mtbr.com/threads/maxxis-dhf-vs-dhr-ii-weight-comparison.1225641/
    components.push(
        createMTBTire('Maxxis', 'Minion DHF', '29', '2.3', 1015, 75),
        createMTBTire('Maxxis', 'Minion DHF', '29', '2.5', 1005, 80),
        createMTBTire('Maxxis', 'Minion DHF', '29', '2.6', 995, 85),
        createMTBTire('Maxxis', 'Minion DHF', '27.5', '2.3', 880, 75),
        createMTBTire('Maxxis', 'Minion DHF', '27.5', '2.5', 925, 80),
        createMTBTire('Maxxis', 'Minion DHF', '27.5', '2.6', 945, 85)
    );

    // Maxxis Minion DHR II - Rear Specific
    components.push(
        createMTBTire('Maxxis', 'Minion DHR II', '29', '2.3', 855, 75),
        createMTBTire('Maxxis', 'Minion DHR II', '29', '2.4', 1021, 80),
        createMTBTire('Maxxis', 'Minion DHR II', '29', '2.6', 1026, 85),
        createMTBTire('Maxxis', 'Minion DHR II', '27.5', '2.4', 825, 80),
        createMTBTire('Maxxis', 'Minion DHR II', '27.5', '2.6', 910, 85)
    );

    // Maxxis Ardent - Trail
    components.push(
        createMTBTire('Maxxis', 'Ardent', '29', '2.25', 740, 65),
        createMTBTire('Maxxis', 'Ardent', '29', '2.4', 850, 70)
    );

    // Maxxis Rekon - XC/Trail
    components.push(
        createMTBTire('Maxxis', 'Rekon', '29', '2.25', 650, 60),
        createMTBTire('Maxxis', 'Rekon', '29', '2.4', 735, 65)
    );

    // ==========================================
    // SCHWALBE MTB TIRES
    // ==========================================
    // Source: https://www.schwalbe.com
    // Weights verified from reviews

    // Schwalbe Magic Mary - Aggressive Enduro/DH
    // Source: https://flowmountainbike.com/tests/schwalbe-magic-mary-review/
    components.push(
        createMTBTire('Schwalbe', 'Magic Mary', '29', '2.35', 920, 80),
        createMTBTire('Schwalbe', 'Magic Mary', '29', '2.4', 1050, 85),
        createMTBTire('Schwalbe', 'Magic Mary', '27.5', '2.35', 880, 80)
    );

    // Schwalbe Nobby Nic - Trail All-Rounder
    // Source: https://bikerumor.com/first-impressions-actual-weights-of-new-schwalbe-nobby-nic/
    components.push(
        createMTBTire('Schwalbe', 'Nobby Nic', '29', '2.35', 834, 70),
        createMTBTire('Schwalbe', 'Nobby Nic', '29', '2.4', 894, 75),
        createMTBTire('Schwalbe', 'Nobby Nic', '27.5', '2.35', 790, 70)
    );

    // Schwalbe Racing Ralph - XC
    components.push(
        createMTBTire('Schwalbe', 'Racing Ralph', '29', '2.25', 575, 65),
        createMTBTire('Schwalbe', 'Racing Ralph', '29', '2.35', 640, 70)
    );

    // Schwalbe Hans Dampf - Enduro
    components.push(
        createMTBTire('Schwalbe', 'Hans Dampf', '29', '2.35', 910, 75),
        createMTBTire('Schwalbe', 'Hans Dampf', '27.5', '2.35', 865, 75)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 2 Tires seeding complete! Added ${components.length} tires.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
