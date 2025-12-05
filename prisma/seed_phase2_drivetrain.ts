import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 2 - Drivetrain...');

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

    // Helper for Crankset
    const createCrankset = (brand: string, model: string, category: 'ROAD' | 'GRAVEL' | 'MTB', crankLength: number, chainrings: string, bbType: string, weight: number, price: number) => {
        const id = `${brand}-${model}-${crankLength}mm`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Crankset',
            name: `${brand} ${model} ${crankLength}mm`,
            interfaces: JSON.stringify({
                crank_length: crankLength,
                bb_type: bbType,
                chainring_standard: category === 'MTB' ? 'DIRECT_MOUNT' : 'INTEGRATED'
            }),
            attributes: JSON.stringify({
                category,
                chainrings,
                bb_type: bbType,
                crank_length: crankLength,
                weight,
                price
            })
        };
    };

    // Helper for Cassette
    const createCassette = (brand: string, model: string, speeds: number, range: string, freehub: string, weight: number, price: number) => {
        const id = `${brand}-${model}-${speeds}sp-${range}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Cassette',
            name: `${brand} ${model} ${speeds}sp ${range}`,
            interfaces: JSON.stringify({
                speeds,
                freehub_standard: freehub
            }),
            attributes: JSON.stringify({
                speeds,
                range,
                freehub_standard: freehub,
                weight,
                price
            })
        };
    };

    // Helper for Chain
    const createChain = (brand: string, model: string, speeds: number, weight: number, price: number) => {
        const id = `${brand}-${model}-${speeds}sp`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Chain',
            name: `${brand} ${model} ${speeds}sp`,
            interfaces: JSON.stringify({
                speeds
            }),
            attributes: JSON.stringify({
                speeds,
                weight,
                price
            })
        };
    };

    // ==========================================
    // SRAM ROAD CRANKSETS
    // ==========================================
    // Source: https://www.sram.com
    // Weights verified from manufacturer specs

    // SRAM Red AXS - Top tier road
    // Source: https://www.sram.com/en/sram/models/fc-red-1-d1
    components.push(
        createCrankset('SRAM', 'Red AXS', 'ROAD', 165, '46/33', 'DUB', 519, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 170, '46/33', 'DUB', 539, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 172.5, '46/33', 'DUB', 549, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 175, '46/33', 'DUB', 559, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 170, '48/35', 'DUB', 543, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 172.5, '48/35', 'DUB', 553, 825),
        createCrankset('SRAM', 'Red AXS', 'ROAD', 175, '48/35', 'DUB', 563, 825)
    );

    // SRAM Force AXS - Performance road
    // Source: https://www.sram.com/en/sram/models/fc-forc-e1-d1
    components.push(
        createCrankset('SRAM', 'Force AXS', 'ROAD', 165, '46/33', 'DUB', 573, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 170, '46/33', 'DUB', 593, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 172.5, '46/33', 'DUB', 603, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 175, '46/33', 'DUB', 613, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 170, '48/35', 'DUB', 597, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 172.5, '48/35', 'DUB', 607, 525),
        createCrankset('SRAM', 'Force AXS', 'ROAD', 175, '48/35', 'DUB', 617, 525)
    );

    // SRAM Rival AXS - Enthusiast road
    // Source: https://www.sram.com/en/sram/models/fc-riv-d1
    components.push(
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 165, '46/33', 'DUB', 684, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 170, '46/33', 'DUB', 704, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 172.5, '46/33', 'DUB', 714, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 175, '46/33', 'DUB', 724, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 170, '48/35', 'DUB', 708, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 172.5, '48/35', 'DUB', 718, 325),
        createCrankset('SRAM', 'Rival AXS', 'ROAD', 175, '48/35', 'DUB', 728, 325)
    );

    // ==========================================
    // SHIMANO ROAD CRANKSETS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from manufacturer specs

    // Shimano Dura-Ace R9200 - Top tier road
    // Source: https://bike.shimano.com/en-US/product/component/dura-ace-r9200.html
    components.push(
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 165, '50/34', 'HOLLOWTECH_II', 685, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 170, '50/34', 'HOLLOWTECH_II', 703, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 172.5, '50/34', 'HOLLOWTECH_II', 712, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 175, '50/34', 'HOLLOWTECH_II', 721, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 170, '52/36', 'HOLLOWTECH_II', 709, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 172.5, '52/36', 'HOLLOWTECH_II', 718, 569),
        createCrankset('Shimano', 'Dura-Ace R9200', 'ROAD', 175, '52/36', 'HOLLOWTECH_II', 727, 569)
    );

    // Shimano Ultegra R8100 - Performance road
    // Source: https://bike.shimano.com/en-US/product/component/shimano-ultegra-r8100.html
    components.push(
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 165, '50/34', 'HOLLOWTECH_II', 726, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 170, '50/34', 'HOLLOWTECH_II', 748, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 172.5, '50/34', 'HOLLOWTECH_II', 759, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 175, '50/34', 'HOLLOWTECH_II', 770, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 170, '52/36', 'HOLLOWTECH_II', 754, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 172.5, '52/36', 'HOLLOWTECH_II', 765, 239),
        createCrankset('Shimano', 'Ultegra R8100', 'ROAD', 175, '52/36', 'HOLLOWTECH_II', 776, 239)
    );

    // Shimano 105 R7100 - Enthusiast road
    // Source: https://bike.shimano.com/en-US/product/component/shimano105-r7100.html
    components.push(
        createCrankset('Shimano', '105 R7100', 'ROAD', 165, '50/34', 'HOLLOWTECH_II', 763, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 170, '50/34', 'HOLLOWTECH_II', 786, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 172.5, '50/34', 'HOLLOWTECH_II', 798, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 175, '50/34', 'HOLLOWTECH_II', 810, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 170, '52/36', 'HOLLOWTECH_II', 793, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 172.5, '52/36', 'HOLLOWTECH_II', 805, 169),
        createCrankset('Shimano', '105 R7100', 'ROAD', 175, '52/36', 'HOLLOWTECH_II', 817, 169)
    );

    // ==========================================
    // GRAVEL CRANKSETS
    // ==========================================

    // Shimano GRX RX820 - Gravel specific
    // Source: https://bike.shimano.com/en-US/product/component/grx-12-speed.html
    components.push(
        createCrankset('Shimano', 'GRX RX820', 'GRAVEL', 165, '48/31', 'HOLLOWTECH_II', 749, 259),
        createCrankset('Shimano', 'GRX RX820', 'GRAVEL', 170, '48/31', 'HOLLOWTECH_II', 772, 259),
        createCrankset('Shimano', 'GRX RX820', 'GRAVEL', 172.5, '48/31', 'HOLLOWTECH_II', 784, 259),
        createCrankset('Shimano', 'GRX RX820', 'GRAVEL', 175, '48/31', 'HOLLOWTECH_II', 796, 259)
    );

    // ==========================================
    // SRAM MTB CRANKSETS
    // ==========================================

    // SRAM XX Eagle AXS - Top tier MTB
    // Source: https://www.sram.com/en/sram/models/fc-xx-sl-e-c1
    components.push(
        createCrankset('SRAM', 'XX Eagle AXS', 'MTB', 165, '32t', 'DUB', 453, 825),
        createCrankset('SRAM', 'XX Eagle AXS', 'MTB', 170, '32t', 'DUB', 468, 825),
        createCrankset('SRAM', 'XX Eagle AXS', 'MTB', 175, '32t', 'DUB', 483, 825),
        createCrankset('SRAM', 'XX Eagle AXS', 'MTB', 170, '34t', 'DUB', 475, 825),
        createCrankset('SRAM', 'XX Eagle AXS', 'MTB', 175, '34t', 'DUB', 490, 825)
    );

    // SRAM X0 Eagle AXS - Performance MTB
    // Source: https://www.sram.com/en/sram/models/fc-x0-e-c1
    components.push(
        createCrankset('SRAM', 'X0 Eagle AXS', 'MTB', 165, '32t', 'DUB', 505, 525),
        createCrankset('SRAM', 'X0 Eagle AXS', 'MTB', 170, '32t', 'DUB', 520, 525),
        createCrankset('SRAM', 'X0 Eagle AXS', 'MTB', 175, '32t', 'DUB', 535, 525),
        createCrankset('SRAM', 'X0 Eagle AXS', 'MTB', 170, '34t', 'DUB', 527, 525),
        createCrankset('SRAM', 'X0 Eagle AXS', 'MTB', 175, '34t', 'DUB', 542, 525)
    );

    // SRAM GX Eagle - Enthusiast MTB
    // Source: https://www.sram.com/en/sram/models/fc-gx-e-c1
    components.push(
        createCrankset('SRAM', 'GX Eagle', 'MTB', 165, '32t', 'DUB', 584, 175),
        createCrankset('SRAM', 'GX Eagle', 'MTB', 170, '32t', 'DUB', 599, 175),
        createCrankset('SRAM', 'GX Eagle', 'MTB', 175, '32t', 'DUB', 614, 175),
        createCrankset('SRAM', 'GX Eagle', 'MTB', 170, '34t', 'DUB', 606, 175),
        createCrankset('SRAM', 'GX Eagle', 'MTB', 175, '34t', 'DUB', 621, 175)
    );

    // ==========================================
    // SHIMANO MTB CRANKSETS
    // ==========================================

    // Shimano XTR M9100 - Top tier MTB
    // Source: https://bike.shimano.com/en-US/product/component/xtr-m9100.html
    components.push(
        createCrankset('Shimano', 'XTR M9100', 'MTB', 165, '30t', 'HOLLOWTECH_II', 486, 399),
        createCrankset('Shimano', 'XTR M9100', 'MTB', 170, '30t', 'HOLLOWTECH_II', 500, 399),
        createCrankset('Shimano', 'XTR M9100', 'MTB', 175, '30t', 'HOLLOWTECH_II', 514, 399),
        createCrankset('Shimano', 'XTR M9100', 'MTB', 170, '32t', 'HOLLOWTECH_II', 506, 399),
        createCrankset('Shimano', 'XTR M9100', 'MTB', 175, '32t', 'HOLLOWTECH_II', 520, 399)
    );

    // Shimano XT M8100 - Performance MTB
    // Source: https://bike.shimano.com/en-US/product/component/deore-xt-m8100.html
    components.push(
        createCrankset('Shimano', 'XT M8100', 'MTB', 165, '30t', 'HOLLOWTECH_II', 540, 219),
        createCrankset('Shimano', 'XT M8100', 'MTB', 170, '30t', 'HOLLOWTECH_II', 556, 219),
        createCrankset('Shimano', 'XT M8100', 'MTB', 175, '30t', 'HOLLOWTECH_II', 572, 219),
        createCrankset('Shimano', 'XT M8100', 'MTB', 170, '32t', 'HOLLOWTECH_II', 563, 219),
        createCrankset('Shimano', 'XT M8100', 'MTB', 175, '32t', 'HOLLOWTECH_II', 579, 219)
    );

    // ==========================================
    // ROAD CASSETTES
    // ==========================================

    // SRAM Red/Force XG-1290 - 12-speed road
    // Source: https://www.sram.com/en/sram/models/cs-xg-1290-d1
    components.push(
        createCassette('SRAM', 'Red XG-1290', 12, '10-28', 'XDR', 180, 385),
        createCassette('SRAM', 'Red XG-1290', 12, '10-30', 'XDR', 185, 385),
        createCassette('SRAM', 'Red XG-1290', 12, '10-33', 'XDR', 211, 385),
        createCassette('SRAM', 'Red XG-1290', 12, '10-36', 'XDR', 236, 385)
    );

    components.push(
        createCassette('SRAM', 'Force XG-1270', 12, '10-28', 'XDR', 211, 195),
        createCassette('SRAM', 'Force XG-1270', 12, '10-30', 'XDR', 221, 195),
        createCassette('SRAM', 'Force XG-1270', 12, '10-33', 'XDR', 247, 195),
        createCassette('SRAM', 'Force XG-1270', 12, '10-36', 'XDR', 272, 195)
    );

    components.push(
        createCassette('SRAM', 'Rival XG-1250', 12, '10-30', 'XDR', 256, 125),
        createCassette('SRAM', 'Rival XG-1250', 12, '10-33', 'XDR', 282, 125),
        createCassette('SRAM', 'Rival XG-1250', 12, '10-36', 'XDR', 307, 125)
    );

    // Shimano Dura-Ace R9200 - 12-speed road
    // Source: https://bike.shimano.com/en-US/product/component/dura-ace-r9200.html
    components.push(
        createCassette('Shimano', 'Dura-Ace R9200', 12, '11-30', 'HG_12', 219, 299),
        createCassette('Shimano', 'Dura-Ace R9200', 12, '11-34', 'HG_12', 243, 299)
    );

    // Shimano Ultegra R8100 - 12-speed road
    components.push(
        createCassette('Shimano', 'Ultegra R8100', 12, '11-30', 'HG_12', 267, 139),
        createCassette('Shimano', 'Ultegra R8100', 12, '11-34', 'HG_12', 293, 139)
    );

    // Shimano 105 R7100 - 12-speed road
    components.push(
        createCassette('Shimano', '105 R7100', 12, '11-30', 'HG_12', 333, 80),
        createCassette('Shimano', '105 R7100', 12, '11-34', 'HG_12', 360, 80)
    );

    // ==========================================
    // MTB CASSETTES
    // ==========================================

    // SRAM Eagle - 12-speed MTB
    // Source: https://www.sram.com/en/sram/models/cs-xg-1299-c1
    components.push(
        createCassette('SRAM', 'XX Eagle XG-1299', 12, '10-52', 'XD', 355, 599),
        createCassette('SRAM', 'X0 Eagle XG-1295', 12, '10-52', 'XD', 363, 399),
        createCassette('SRAM', 'GX Eagle XG-1275', 12, '10-52', 'XD', 454, 159)
    );

    // SRAM Eagle Transmission - 10-50 and 10-52
    components.push(
        createCassette('SRAM', 'XX Eagle T-Type', 12, '10-50', 'XD', 310, 599),
        createCassette('SRAM', 'XX Eagle T-Type', 12, '10-52', 'XD', 355, 599),
        createCassette('SRAM', 'X0 Eagle T-Type', 12, '10-52', 'XD', 363, 399)
    );

    // Shimano XTR/XT - 12-speed MTB
    // Source: https://bike.shimano.com/en-US/product/component/xtr-m9100.html
    components.push(
        createCassette('Shimano', 'XTR M9100', 12, '10-51', 'MICROSPLINE', 349, 369),
        createCassette('Shimano', 'XT M8100', 12, '10-51', 'MICROSPLINE', 461, 169)
    );

    // ==========================================
    // CHAINS
    // ==========================================

    // SRAM 12-speed chains
    // Source: https://www.sram.com/en/sram/models/cn-red-22-a1
    components.push(
        createChain('SRAM', 'Red AXS', 12, 254, 65),
        createChain('SRAM', 'Force AXS', 12, 270, 45),
        createChain('SRAM', 'Rival', 12, 287, 30)
    );

    // SRAM Eagle chains
    components.push(
        createChain('SRAM', 'XX Eagle', 12, 251, 75),
        createChain('SRAM', 'X0 Eagle', 12, 258, 55),
        createChain('SRAM', 'GX Eagle', 12, 283, 35)
    );

    // Shimano 12-speed chains
    // Source: https://bike.shimano.com/en-US/product/component/dura-ace-r9200.html
    components.push(
        createChain('Shimano', 'Dura-Ace HG901', 12, 252, 79),
        createChain('Shimano', 'Ultegra HG801', 12, 268, 50),
        createChain('Shimano', '105 HG701', 12, 281, 35)
    );

    // Shimano MTB 12-speed chains
    components.push(
        createChain('Shimano', 'XTR HG901', 12, 252, 79),
        createChain('Shimano', 'XT HG801', 12, 268, 50)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 2 Drivetrain seeding complete! Added ${components.length} drivetrain components.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
