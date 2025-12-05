import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 1 - Brake Calipers...');

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

    // Helper for BrakeCaliper
    const createBrakeCaliper = (brand: string, model: string, position: 'FRONT' | 'REAR' | 'PAIR', mount: string, fluid: string, pistons: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${position}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'BrakeCaliper',
            name: `${brand} ${model} ${position === 'PAIR' ? 'Set' : position}`,
            interfaces: JSON.stringify({
                mount,
                fluid_type: fluid,
                piston_count: pistons
            }),
            attributes: JSON.stringify({
                position,
                mount,
                fluid,
                piston_count: pistons,
                weight,
                price
            })
        };
    };

    // ==========================================
    // SHIMANO ROAD/GRAVEL CALIPERS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from manufacturer specs and retailer listings

    // BR-R9270 - Dura-Ace (12s Di2)
    components.push(
        createBrakeCaliper('Shimano', 'BR-R9270', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 120, 200),
        createBrakeCaliper('Shimano', 'BR-R9270', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 110, 200)
    );

    // BR-R8170 - Ultegra (12s Di2)
    components.push(
        createBrakeCaliper('Shimano', 'BR-R8170', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 146, 150),
        createBrakeCaliper('Shimano', 'BR-R8170', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 136, 150)
    );

    // BR-R7170 - 105 (12s Di2)
    components.push(
        createBrakeCaliper('Shimano', 'BR-R7170', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 139, 110),
        createBrakeCaliper('Shimano', 'BR-R7170', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 123, 110)
    );

    // BR-RX820 - GRX (12s Di2 Gravel)
    components.push(
        createBrakeCaliper('Shimano', 'BR-RX820', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 146, 145),
        createBrakeCaliper('Shimano', 'BR-RX820', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 136, 145)
    );

    // BR-RX810 - GRX (11s Mechanical Gravel)
    components.push(
        createBrakeCaliper('Shimano', 'BR-RX810', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 140, 120),
        createBrakeCaliper('Shimano', 'BR-RX810', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 130, 120)
    );

    // ==========================================
    // SHIMANO MTB CALIPERS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from: https://www.vitalmtb.com

    // BR-M9120 - XTR (4-piston, Enduro/Trail)
    components.push(
        createBrakeCaliper('Shimano', 'BR-M9120', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 262, 220),
        createBrakeCaliper('Shimano', 'BR-M9120', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 262, 220)
    );

    // BR-M8120 - XT (4-piston, Trail)
    components.push(
        createBrakeCaliper('Shimano', 'BR-M8120', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 127, 140),
        createBrakeCaliper('Shimano', 'BR-M8120', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 127, 140)
    );

    // BR-M7120 - SLX (4-piston, Trail)
    components.push(
        createBrakeCaliper('Shimano', 'BR-M7120', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 145, 100),
        createBrakeCaliper('Shimano', 'BR-M7120', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 145, 100)
    );

    // BR-M6120 - Deore (4-piston, Trail/XC)
    components.push(
        createBrakeCaliper('Shimano', 'BR-M6120', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 160, 75),
        createBrakeCaliper('Shimano', 'BR-M6120', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 160, 75)
    );

    // ==========================================
    // SRAM ROAD/GRAVEL CALIPERS
    // ==========================================
    // Source: https://www.sram.com
    // Weights verified from: https://bikerumor.com

    // Red eTap AXS HRD
    components.push(
        createBrakeCaliper('SRAM', 'Red eTap AXS HRD', 'FRONT', 'FLAT_MOUNT', 'DOT', 2, 130, 250),
        createBrakeCaliper('SRAM', 'Red eTap AXS HRD', 'REAR', 'FLAT_MOUNT', 'DOT', 2, 130, 250)
    );

    // Force eTap AXS HRD
    components.push(
        createBrakeCaliper('SRAM', 'Force eTap AXS HRD', 'FRONT', 'FLAT_MOUNT', 'DOT', 2, 140, 180),
        createBrakeCaliper('SRAM', 'Force eTap AXS HRD', 'REAR', 'FLAT_MOUNT', 'DOT', 2, 140, 180)
    );

    // Rival eTap AXS HRD
    components.push(
        createBrakeCaliper('SRAM', 'Rival eTap AXS HRD', 'FRONT', 'FLAT_MOUNT', 'DOT', 2, 144, 130),
        createBrakeCaliper('SRAM', 'Rival eTap AXS HRD', 'REAR', 'FLAT_MOUNT', 'DOT', 2, 144, 130)
    );

    // ==========================================
    // SRAM MTB CALIPERS
    // ==========================================
    // Source: https://www.sram.com
    // Weights verified from: https://www.vitalmtb.com

    // Code RSC (4-piston, Downhill/Enduro)
    components.push(
        createBrakeCaliper('SRAM', 'Code RSC', 'FRONT', 'POST_MOUNT', 'DOT', 4, 200, 200),
        createBrakeCaliper('SRAM', 'Code RSC', 'REAR', 'POST_MOUNT', 'DOT', 4, 200, 200)
    );

    // Code R (4-piston, Downhill/Enduro)
    components.push(
        createBrakeCaliper('SRAM', 'Code R', 'FRONT', 'POST_MOUNT', 'DOT', 4, 210, 150),
        createBrakeCaliper('SRAM', 'Code R', 'REAR', 'POST_MOUNT', 'DOT', 4, 210, 150)
    );

    // Guide RSC (4-piston, Trail)
    components.push(
        createBrakeCaliper('SRAM', 'Guide RSC', 'FRONT', 'POST_MOUNT', 'DOT', 4, 180, 160),
        createBrakeCaliper('SRAM', 'Guide RSC', 'REAR', 'POST_MOUNT', 'DOT', 4, 180, 160)
    );

    // Guide RE (4-piston, Trail)
    components.push(
        createBrakeCaliper('SRAM', 'Guide RE', 'FRONT', 'POST_MOUNT', 'DOT', 4, 190, 120),
        createBrakeCaliper('SRAM', 'Guide RE', 'REAR', 'POST_MOUNT', 'DOT', 4, 190, 120)
    );

    // G2 RSC (4-piston, Trail)
    components.push(
        createBrakeCaliper('SRAM', 'G2 RSC', 'FRONT', 'POST_MOUNT', 'DOT', 4, 150, 180),
        createBrakeCaliper('SRAM', 'G2 RSC', 'REAR', 'POST_MOUNT', 'DOT', 4, 150, 180)
    );

    // G2 Ultimate (4-piston, Trail)
    components.push(
        createBrakeCaliper('SRAM', 'G2 Ultimate', 'FRONT', 'POST_MOUNT', 'DOT', 4, 140, 220),
        createBrakeCaliper('SRAM', 'G2 Ultimate', 'REAR', 'POST_MOUNT', 'DOT', 4, 140, 220)
    );

    // Level Ultimate (2-piston, XC)
    components.push(
        createBrakeCaliper('SRAM', 'Level Ultimate', 'FRONT', 'POST_MOUNT', 'DOT', 2, 110, 140),
        createBrakeCaliper('SRAM', 'Level Ultimate', 'REAR', 'POST_MOUNT', 'DOT', 2, 110, 140)
    );

    // ==========================================
    // CAMPAGNOLO CALIPERS
    // ==========================================
    // Source: https://www.campagnolo.com

    // Super Record Wireless (Road)
    components.push(
        createBrakeCaliper('Campagnolo', 'Super Record Wireless', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 118, 300),
        createBrakeCaliper('Campagnolo', 'Super Record Wireless', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 101, 300)
    );

    // Ekar GT (Gravel)
    components.push(
        createBrakeCaliper('Campagnolo', 'Ekar GT', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 120, 200),
        createBrakeCaliper('Campagnolo', 'Ekar GT', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 110, 200)
    );

    // ==========================================
    // MAGURA MTB CALIPERS
    // ==========================================
    // Source: https://magura.com
    // Weights verified from: https://enduro-mtb.com

    // MT7 (4-piston, Downhill/Enduro)
    components.push(
        createBrakeCaliper('Magura', 'MT7', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 255, 180),
        createBrakeCaliper('Magura', 'MT7', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 255, 180)
    );

    // MT5 (4-piston, Trail)
    components.push(
        createBrakeCaliper('Magura', 'MT5', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 260, 140),
        createBrakeCaliper('Magura', 'MT5', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 260, 140)
    );

    // ==========================================
    // TRP CALIPERS
    // ==========================================
    // Source: https://trpcycling.com

    // HY/RD (Cable-Actuated Hydraulic, Road/Gravel)
    components.push(
        createBrakeCaliper('TRP', 'HY/RD', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 195, 120),
        createBrakeCaliper('TRP', 'HY/RD', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 195, 120),
        createBrakeCaliper('TRP', 'HY/RD', 'FRONT', 'POST_MOUNT', 'MINERAL', 2, 195, 120),
        createBrakeCaliper('TRP', 'HY/RD', 'REAR', 'POST_MOUNT', 'MINERAL', 2, 195, 120)
    );

    // Hylex RS (Full Hydraulic, Road/Gravel)
    components.push(
        createBrakeCaliper('TRP', 'Hylex RS', 'FRONT', 'FLAT_MOUNT', 'MINERAL', 2, 180, 160),
        createBrakeCaliper('TRP', 'Hylex RS', 'REAR', 'FLAT_MOUNT', 'MINERAL', 2, 180, 160),
        createBrakeCaliper('TRP', 'Hylex RS', 'FRONT', 'POST_MOUNT', 'MINERAL', 2, 180, 160),
        createBrakeCaliper('TRP', 'Hylex RS', 'REAR', 'POST_MOUNT', 'MINERAL', 2, 180, 160)
    );

    // DH-R EVO (4-piston, Downhill/Enduro)
    components.push(
        createBrakeCaliper('TRP', 'DH-R EVO', 'FRONT', 'POST_MOUNT', 'MINERAL', 4, 180, 200),
        createBrakeCaliper('TRP', 'DH-R EVO', 'REAR', 'POST_MOUNT', 'MINERAL', 4, 180, 200)
    );

    // ==========================================
    // HOPE MTB CALIPERS
    // ==========================================
    // Source: https://www.hopetech.com
    // Weights verified from: https://theloamwolf.com

    // Tech 4 V4 (4-piston, Enduro/Downhill)
    components.push(
        createBrakeCaliper('Hope', 'Tech 4 V4', 'FRONT', 'POST_MOUNT', 'DOT', 4, 314, 265),
        createBrakeCaliper('Hope', 'Tech 4 V4', 'REAR', 'POST_MOUNT', 'DOT', 4, 314, 265)
    );

    // Tech 4 E4 (4-piston, Trail/Enduro)
    components.push(
        createBrakeCaliper('Hope', 'Tech 4 E4', 'FRONT', 'POST_MOUNT', 'DOT', 4, 301, 240),
        createBrakeCaliper('Hope', 'Tech 4 E4', 'REAR', 'POST_MOUNT', 'DOT', 4, 301, 240)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 1 Brake Calipers seeding complete! Added ${components.length} calipers.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
