import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 1 - Seatposts...');

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

    // Helper for Seatpost
    const createSeatpost = (brand: string, model: string, diameter: number, setback: number, material: string, dropper: boolean, travel: number | null, weight: number, price: number) => {
        const travelStr = dropper && travel ? `-${travel}mm` : '';
        const setbackStr = setback > 0 ? `-${setback}mm` : '-0mm';
        const id = `${brand}-${model}-${diameter}${setbackStr}${travelStr}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Seatpost',
            name: `${brand} ${model} ${diameter}mm${setback > 0 ? ` ${setback}mm` : ' 0mm'}${travelStr}`,
            interfaces: JSON.stringify({
                diameter,
                dropper,
                travel: dropper ? travel : null
            }),
            attributes: JSON.stringify({
                diameter,
                setback,
                material,
                dropper,
                travel: dropper ? travel : null,
                weight,
                price
            })
        };
    };

    // ==========================================
    // RIGID CARBON SEATPOSTS
    // ==========================================
    // Source: Manufacturer websites and verified retailer specs

    // ENVE Carbon Seatpost
    // Source: https://enve.com/products/seatpost
    // Weights verified from manufacturer
    components.push(
        createSeatpost('ENVE', 'Carbon', 27.2, 0, 'CARBON', false, null, 168, 325),
        createSeatpost('ENVE', 'Carbon', 27.2, 25, 'CARBON', false, null, 182, 325),
        createSeatpost('ENVE', 'Carbon', 31.6, 0, 'CARBON', false, null, 204, 325),
        createSeatpost('ENVE', 'Carbon', 31.6, 25, 'CARBON', false, null, 214, 325)
    );

    // Zipp Service Course SL
    // Source: https://www.sram.com/en/zipp/models/sp-sc-sl-c2
    // Weights verified from: https://www.cyclingweekly.com
    components.push(
        createSeatpost('Zipp', 'Service Course SL', 27.2, 0, 'CARBON', false, null, 233, 180),
        createSeatpost('Zipp', 'Service Course SL', 27.2, 20, 'CARBON', false, null, 250, 180),
        createSeatpost('Zipp', 'Service Course SL', 31.6, 0, 'CARBON', false, null, 240, 180),
        createSeatpost('Zipp', 'Service Course SL', 31.6, 20, 'CARBON', false, null, 255, 180)
    );

    // PRO Discover Carbon
    // Source: https://www.pro-bikegear.com
    components.push(
        createSeatpost('PRO', 'Discover Carbon', 27.2, 20, 'CARBON', false, null, 190, 150),
        createSeatpost('PRO', 'Discover Carbon', 30.9, 20, 'CARBON', false, null, 200, 150),
        createSeatpost('PRO', 'Discover Carbon', 31.6, 20, 'CARBON', false, null, 205, 150)
    );

    // Ritchey WCS Carbon Link FlexLogic
    // Source: https://ritcheylogic.com
    // Weights verified from: https://www.bike-components.de
    components.push(
        createSeatpost('Ritchey', 'WCS Carbon Link', 27.2, 0, 'CARBON', false, null, 181, 160),
        createSeatpost('Ritchey', 'WCS Carbon Link', 27.2, 15, 'CARBON', false, null, 191, 160),
        createSeatpost('Ritchey', 'WCS Carbon Link', 30.9, 0, 'CARBON', false, null, 195, 160),
        createSeatpost('Ritchey', 'WCS Carbon Link', 31.6, 0, 'CARBON', false, null, 200, 160)
    );

    // Easton EC90 SL
    // Source: https://eastoncycling.com
    components.push(
        createSeatpost('Easton', 'EC90 SL', 27.2, 0, 'CARBON', false, null, 189, 180),
        createSeatpost('Easton', 'EC90 SL', 27.2, 20, 'CARBON', false, null, 200, 180)
    );

    // FSA K-Force
    // Source: https://www.fsaproshop.com
    components.push(
        createSeatpost('FSA', 'K-Force SB0', 27.2, 0, 'CARBON', false, null, 185, 175),
        createSeatpost('FSA', 'K-Force SB0', 31.6, 0, 'CARBON', false, null, 205, 175),
        createSeatpost('FSA', 'K-Force SB25', 27.2, 25, 'CARBON', false, null, 188, 175),
        createSeatpost('FSA', 'K-Force SB25', 31.6, 25, 'CARBON', false, null, 204, 175)
    );

    // ==========================================
    // RIGID ALLOY SEATPOSTS
    // ==========================================

    // Thomson Elite (Aluminum 7000 series)
    // Source: https://bikethomson.com
    // Weights verified from: https://www.mtbr.com
    components.push(
        createSeatpost('Thomson', 'Elite', 27.2, 0, 'ALUMINUM', false, null, 228, 89),
        createSeatpost('Thomson', 'Elite', 27.2, 16, 'ALUMINUM', false, null, 241, 89),
        createSeatpost('Thomson', 'Elite', 30.9, 0, 'ALUMINUM', false, null, 250, 89),
        createSeatpost('Thomson', 'Elite', 30.9, 16, 'ALUMINUM', false, null, 263, 89),
        createSeatpost('Thomson', 'Elite', 31.6, 0, 'ALUMINUM', false, null, 255, 89),
        createSeatpost('Thomson', 'Elite', 31.6, 16, 'ALUMINUM', false, null, 268, 89)
    );

    // Ritchey WCS Link (Aluminum)
    // Source: https://ritcheylogic.com
    components.push(
        createSeatpost('Ritchey', 'WCS Link', 27.2, 20, 'ALUMINUM', false, null, 236, 90),
        createSeatpost('Ritchey', 'WCS Link', 30.9, 20, 'ALUMINUM', false, null, 250, 90),
        createSeatpost('Ritchey', 'WCS Link', 31.6, 20, 'ALUMINUM', false, null, 255, 90)
    );

    // PRO LT (Aluminum)
    // Source: https://www.pro-bikegear.com
    components.push(
        createSeatpost('PRO', 'LT', 27.2, 20, 'ALUMINUM', false, null, 285, 65),
        createSeatpost('PRO', 'LT', 30.9, 20, 'ALUMINUM', false, null, 295, 65),
        createSeatpost('PRO', 'LT', 31.6, 20, 'ALUMINUM', false, null, 300, 65)
    );

    // ==========================================
    // DROPPER SEATPOSTS - FOX
    // ==========================================
    // Source: https://ridefox.com
    // Weights verified from: https://worldwidecyclery.com

    // Fox Transfer Performance Elite (Cable-Actuated)
    components.push(
        createSeatpost('Fox', 'Transfer Performance', 30.9, 0, 'ALUMINUM', true, 100, 475, 280),
        createSeatpost('Fox', 'Transfer Performance', 30.9, 0, 'ALUMINUM', true, 125, 511, 280),
        createSeatpost('Fox', 'Transfer Performance', 30.9, 0, 'ALUMINUM', true, 150, 545, 300),
        createSeatpost('Fox', 'Transfer Performance', 30.9, 0, 'ALUMINUM', true, 175, 580, 300),
        createSeatpost('Fox', 'Transfer Performance', 31.6, 0, 'ALUMINUM', true, 100, 485, 280),
        createSeatpost('Fox', 'Transfer Performance', 31.6, 0, 'ALUMINUM', true, 125, 521, 280),
        createSeatpost('Fox', 'Transfer Performance', 31.6, 0, 'ALUMINUM', true, 150, 555, 300),
        createSeatpost('Fox', 'Transfer Performance', 31.6, 0, 'ALUMINUM', true, 175, 590, 300)
    );

    // Fox Transfer Factory (Kashima, Cable-Actuated)
    components.push(
        createSeatpost('Fox', 'Transfer Factory', 30.9, 0, 'ALUMINUM', true, 100, 465, 380),
        createSeatpost('Fox', 'Transfer Factory', 30.9, 0, 'ALUMINUM', true, 125, 501, 380),
        createSeatpost('Fox', 'Transfer Factory', 30.9, 0, 'ALUMINUM', true, 150, 535, 400),
        createSeatpost('Fox', 'Transfer Factory', 30.9, 0, 'ALUMINUM', true, 175, 570, 400),
        createSeatpost('Fox', 'Transfer Factory', 31.6, 0, 'ALUMINUM', true, 100, 475, 380),
        createSeatpost('Fox', 'Transfer Factory', 31.6, 0, 'ALUMINUM', true, 125, 511, 380),
        createSeatpost('Fox', 'Transfer Factory', 31.6, 0, 'ALUMINUM', true, 150, 545, 400),
        createSeatpost('Fox', 'Transfer Factory', 31.6, 0, 'ALUMINUM', true, 175, 580, 400),
        createSeatpost('Fox', 'Transfer Factory', 31.6, 0, 'ALUMINUM', true, 200, 615, 420)
    );

    // ==========================================
    // DROPPER SEATPOSTS - ROCKSHOX
    // ==========================================
    // Source: https://www.sram.com/rockshox
    // Weights verified from: https://www.bikeradar.com

    // RockShox Reverb AXS (Wireless Electronic)
    components.push(
        createSeatpost('RockShox', 'Reverb AXS', 30.9, 0, 'ALUMINUM', true, 100, 650, 650),
        createSeatpost('RockShox', 'Reverb AXS', 30.9, 0, 'ALUMINUM', true, 125, 680, 650),
        createSeatpost('RockShox', 'Reverb AXS', 30.9, 0, 'ALUMINUM', true, 150, 708, 650),
        createSeatpost('RockShox', 'Reverb AXS', 30.9, 0, 'ALUMINUM', true, 175, 740, 670),
        createSeatpost('RockShox', 'Reverb AXS', 31.6, 0, 'ALUMINUM', true, 100, 660, 650),
        createSeatpost('RockShox', 'Reverb AXS', 31.6, 0, 'ALUMINUM', true, 125, 690, 650),
        createSeatpost('RockShox', 'Reverb AXS', 31.6, 0, 'ALUMINUM', true, 150, 718, 650),
        createSeatpost('RockShox', 'Reverb AXS', 31.6, 0, 'ALUMINUM', true, 175, 750, 670),
        createSeatpost('RockShox', 'Reverb AXS', 31.6, 0, 'ALUMINUM', true, 200, 780, 690),
        createSeatpost('RockShox', 'Reverb AXS', 34.9, 0, 'ALUMINUM', true, 150, 750, 650),
        createSeatpost('RockShox', 'Reverb AXS', 34.9, 0, 'ALUMINUM', true, 175, 785, 670),
        createSeatpost('RockShox', 'Reverb AXS', 34.9, 0, 'ALUMINUM', true, 200, 815, 690)
    );

    // ==========================================
    // DROPPER SEATPOSTS - ONEUP
    // ==========================================
    // Source: https://www.oneupcomponents.com
    // Weights verified from manufacturer

    // OneUp V3 Dropper (Cable-Actuated)
    // 30.9mm
    components.push(
        createSeatpost('OneUp', 'V3', 30.9, 0, 'ALUMINUM', true, 120, 370, 250),
        createSeatpost('OneUp', 'V3', 30.9, 0, 'ALUMINUM', true, 150, 415, 250),
        createSeatpost('OneUp', 'V3', 30.9, 0, 'ALUMINUM', true, 180, 515, 280),
        createSeatpost('OneUp', 'V3', 30.9, 0, 'ALUMINUM', true, 210, 585, 300)
    );

    // 31.6mm
    components.push(
        createSeatpost('OneUp', 'V3', 31.6, 0, 'ALUMINUM', true, 120, 385, 250),
        createSeatpost('OneUp', 'V3', 31.6, 0, 'ALUMINUM', true, 150, 433, 250),
        createSeatpost('OneUp', 'V3', 31.6, 0, 'ALUMINUM', true, 180, 480, 280),
        createSeatpost('OneUp', 'V3', 31.6, 0, 'ALUMINUM', true, 210, 538, 300)
    );

    // 34.9mm
    components.push(
        createSeatpost('OneUp', 'V3', 34.9, 0, 'ALUMINUM', true, 120, 472, 250),
        createSeatpost('OneUp', 'V3', 34.9, 0, 'ALUMINUM', true, 150, 535, 250),
        createSeatpost('OneUp', 'V3', 34.9, 0, 'ALUMINUM', true, 180, 600, 280),
        createSeatpost('OneUp', 'V3', 34.9, 0, 'ALUMINUM', true, 210, 675, 300)
    );

    // ==========================================
    // DROPPER SEATPOSTS - PNW
    // ==========================================
    // Source: https://pnwbikes.com
    // Weights verified from: https://www.vitalmtb.com

    // PNW Loam (Cable-Actuated)
    // 30.9mm
    components.push(
        createSeatpost('PNW', 'Loam', 30.9, 0, 'ALUMINUM', true, 125, 456, 199),
        createSeatpost('PNW', 'Loam', 30.9, 0, 'ALUMINUM', true, 150, 504, 199),
        createSeatpost('PNW', 'Loam', 30.9, 0, 'ALUMINUM', true, 170, 532, 219),
        createSeatpost('PNW', 'Loam', 30.9, 0, 'ALUMINUM', true, 200, 576, 229)
    );

    // 31.6mm
    components.push(
        createSeatpost('PNW', 'Loam', 31.6, 0, 'ALUMINUM', true, 125, 474, 199),
        createSeatpost('PNW', 'Loam', 31.6, 0, 'ALUMINUM', true, 150, 524, 199),
        createSeatpost('PNW', 'Loam', 31.6, 0, 'ALUMINUM', true, 170, 554, 219),
        createSeatpost('PNW', 'Loam', 31.6, 0, 'ALUMINUM', true, 200, 598, 229)
    );

    // 34.9mm
    components.push(
        createSeatpost('PNW', 'Loam', 34.9, 0, 'ALUMINUM', true, 125, 576, 199),
        createSeatpost('PNW', 'Loam', 34.9, 0, 'ALUMINUM', true, 150, 638, 199),
        createSeatpost('PNW', 'Loam', 34.9, 0, 'ALUMINUM', true, 170, 674, 219),
        createSeatpost('PNW', 'Loam', 34.9, 0, 'ALUMINUM', true, 200, 734, 229)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 1 Seatposts seeding complete! Added ${components.length} seatposts.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
