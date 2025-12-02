import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding expanded inventory...');

    const upsertComponent = async (id: string, data: any) => {
        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: { ...data, id } });
            console.log(`Created: ${data.name}`);
        } else {
            // Optional: Update if exists to ensure properties are fresh
            // await prisma.component.update({ where: { id }, data });
            console.log(`Skipped (Exists): ${data.name}`);
        }
    };

    const components: any[] = [];

    // ==========================================
    // FRAMES
    // ==========================================
    // Helper for Frames
    const createFrame = (brand: string, model: string, category: 'Road' | 'Gravel' | 'MTB', material: 'Carbon' | 'Alloy', interfaces: any, weight: number) => {
        const id = `${brand}-${model}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'Frame',
            name: `${brand} ${model}`,
            interfaces: JSON.stringify({
                steerer_tube: '1_1/8', // Standardizing for simplicity, though many are tapered
                ...interfaces
            }),
            attributes: JSON.stringify({ category, material, weight })
        };
    };

    // --- GIANT ---
    components.push(
        createFrame('Giant', 'TCR Advanced SL', 'Road', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Integrated' }, 850),
        createFrame('Giant', 'Propel Advanced SL', 'Road', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Integrated' }, 920),
        createFrame('Giant', 'Defy Advanced Pro', 'Road', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'D-Fuse' }, 950),
        createFrame('Giant', 'Revolt Advanced Pro', 'Gravel', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'D-Fuse' }, 1035),
        createFrame('Giant', 'Anthem Advanced Pro', 'MTB', 'Carbon', { bottom_bracket_shell: 'BB92', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '30.9mm', udh: true }, 1650),
        createFrame('Giant', 'Trance X Advanced', 'MTB', 'Carbon', { bottom_bracket_shell: 'BB92', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '30.9mm', udh: true }, 2100)
    );

    // --- SCOTT ---
    components.push(
        createFrame('Scott', 'Addict RC Ultimate', 'Road', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Syncros_Specific' }, 850),
        createFrame('Scott', 'Foil RC', 'Road', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Syncros_Specific' }, 915),
        createFrame('Scott', 'Addict Gravel Tuned', 'Gravel', 'Carbon', { bottom_bracket_shell: 'BB86', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Syncros_Specific' }, 930),
        createFrame('Scott', 'Spark RC World Cup', 'MTB', 'Carbon', { bottom_bracket_shell: 'BB92', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '31.6mm', udh: true }, 1870),
        createFrame('Scott', 'Scale RC World Cup', 'MTB', 'Carbon', { bottom_bracket_shell: 'BB92', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '31.6mm', udh: true }, 847)
    );

    // --- TREK ---
    components.push(
        createFrame('Trek', 'Emonda SLR', 'Road', 'Carbon', { bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Seatmast_Cap' }, 698),
        createFrame('Trek', 'Madone SLR Gen 7', 'Road', 'Carbon', { bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Specific' }, 1000),
        createFrame('Trek', 'Domane SLR', 'Road', 'Carbon', { bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Specific' }, 1100),
        createFrame('Trek', 'Supercaliber SLR', 'MTB', 'Carbon', { bottom_bracket_shell: 'PressFit_92', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '31.6mm', udh: true }, 1950),
        createFrame('Trek', 'Top Fuel', 'MTB', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_73mm', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '34.9mm', udh: true }, 2400)
    );

    // --- CANNONDALE ---
    components.push(
        createFrame('Cannondale', 'SuperSix EVO LAB71', 'Road', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Specific' }, 770),
        createFrame('Cannondale', 'Synapse Carbon', 'Road', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: '27.2mm' }, 1050),
        createFrame('Cannondale', 'Topstone Carbon', 'Gravel', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: '27.2mm' }, 1100),
        createFrame('Cannondale', 'Scalpel Hi-Mod', 'MTB', 'Carbon', { bottom_bracket_shell: 'PF30', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '31.6mm', udh: true }, 1910)
    );

    // --- ORBEA ---
    components.push(
        createFrame('Orbea', 'Orca OMX', 'Road', 'Carbon', { bottom_bracket_shell: 'BB386', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: '27.2mm' }, 750),
        createFrame('Orbea', 'Terra OMR', 'Gravel', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: '27.2mm' }, 1130),
        createFrame('Orbea', 'Oiz OMX', 'MTB', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_73mm', rear_axle: 'TA_12x148mm', brake_mount: 'Post_Mount', seatpost_diameter: '31.6mm', udh: true }, 1740)
    );

    // --- SPECIALIZED (Adding missing ones) ---
    components.push(
        createFrame('Specialized', 'Aethos S-Works', 'Road', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: '27.2mm' }, 585),
        createFrame('Specialized', 'Roubaix SL8', 'Road', 'Carbon', { bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', brake_mount: 'Flat_Mount', seatpost_diameter: 'Specific' }, 950)
    );


    // ==========================================
    // DRIVETRAINS
    // ==========================================

    // --- SHIMANO ROAD ---
    const shimanoRoadFamilies = [
        { name: '105 R7000', series: 'R7000', speed: 11, type: 'Mech' },
        { name: '105 Di2 R7100', series: 'R7100', speed: 12, type: 'Di2' },
        { name: 'Ultegra R8000', series: 'R8000', speed: 11, type: 'Mech' },
        { name: 'Ultegra Di2 R8100', series: 'R8100', speed: 12, type: 'Di2' },
        { name: 'Dura-Ace R9100', series: 'R9100', speed: 11, type: 'Mech' },
        { name: 'Dura-Ace Di2 R9200', series: 'R9200', speed: 12, type: 'Di2' },
    ];

    for (const fam of shimanoRoadFamilies) {
        // Cranksets
        const cranks = ['50/34', '52/36', '53/39'];
        if (fam.speed === 12) cranks.push('54/40');

        cranks.forEach(teeth => {
            components.push({
                id: `shimano-${fam.series.toLowerCase()}-crank-${teeth.replace('/', '-')}`,
                type: 'Crankset',
                name: `Shimano ${fam.name} Crankset ${teeth}`,
                interfaces: JSON.stringify({ spindle: 'Hollowtech_II_24mm', pedal: '9/16' }),
                attributes: JSON.stringify({ speeds: fam.speed, teeth, weight: 700 }) // Approx weight
            });
        });

        // Cassettes
        const cassettes = fam.speed === 11 ? ['11-28', '11-30', '11-32', '11-34'] : ['11-30', '11-34'];
        cassettes.forEach(range => {
            components.push({
                id: `shimano-${fam.series.toLowerCase()}-cassette-${range}`,
                type: 'Cassette',
                name: `Shimano ${fam.name} Cassette ${range}`,
                interfaces: JSON.stringify({ freehub: 'Shimano_HG_L2' }), // Simplified
                attributes: JSON.stringify({ speeds: fam.speed, range, weight: 250 })
            });
        });

        // Rear Derailleurs
        components.push({
            id: `shimano-${fam.series.toLowerCase()}-rd`,
            type: 'RearDerailleur',
            name: `Shimano ${fam.name} Rear Derailleur`,
            interfaces: JSON.stringify({
                attachment: 'Standard_Mount',
                cable_pull: fam.type === 'Di2' ? `Di2_${fam.speed}s` : `Shimano_Road_${fam.speed}s`
            }),
            attributes: JSON.stringify({ speeds: fam.speed, max_cog: 34, weight: 250 })
        });
    }

    // --- SRAM ROAD (AXS) ---
    const sramRoadFamilies = [
        { name: 'Apex AXS', series: 'apex-axs', speed: 12 },
        { name: 'Rival AXS', series: 'rival-axs', speed: 12 },
        { name: 'Force AXS', series: 'force-axs', speed: 12 },
        { name: 'Red AXS', series: 'red-axs', speed: 12 },
    ];

    for (const fam of sramRoadFamilies) {
        // Cranksets (1x and 2x)
        const cranks2x = ['46/33', '48/35', '50/37'];
        const cranks1x = ['40t', '42t', '44t'];

        [...cranks2x, ...cranks1x].forEach(teeth => {
            components.push({
                id: `sram-${fam.series}-crank-${teeth.replace('/', '-').replace('t', '')}`,
                type: 'Crankset',
                name: `SRAM ${fam.name} Crankset ${teeth}`,
                interfaces: JSON.stringify({ spindle: 'DUB_28.99mm', pedal: '9/16' }),
                attributes: JSON.stringify({ speeds: fam.speed, teeth, weight: 700 })
            });
        });

        // Cassettes
        const cassettes = ['10-28', '10-30', '10-33', '10-36', '10-44']; // 10-44 for XPLR
        cassettes.forEach(range => {
            components.push({
                id: `sram-${fam.series}-cassette-${range}`,
                type: 'Cassette',
                name: `SRAM ${fam.name} Cassette ${range}`,
                interfaces: JSON.stringify({ freehub: 'SRAM_XDR' }),
                attributes: JSON.stringify({ speeds: fam.speed, range, weight: 250 })
            });
        });

        // Rear Derailleurs (Standard & XPLR)
        components.push({
            id: `sram-${fam.series}-rd`,
            type: 'RearDerailleur',
            name: `SRAM ${fam.name} Rear Derailleur (36T Max)`,
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: fam.speed, max_cog: 36, weight: 300 })
        });
        components.push({
            id: `sram-${fam.series}-xplr-rd`,
            type: 'RearDerailleur',
            name: `SRAM ${fam.name} XPLR Rear Derailleur (44T Max)`,
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: fam.speed, max_cog: 44, weight: 320 })
        });
    }

    // --- SHIMANO MTB ---
    const shimanoMtbFamilies = [
        { name: 'Deore M6100', series: 'm6100', speed: 12 },
        { name: 'SLX M7100', series: 'm7100', speed: 12 },
        { name: 'XT M8100', series: 'm8100', speed: 12 },
        { name: 'XTR M9100', series: 'm9100', speed: 12 },
    ];

    for (const fam of shimanoMtbFamilies) {
        // Cranksets (1x)
        const cranks = ['30t', '32t', '34t'];
        cranks.forEach(teeth => {
            components.push({
                id: `shimano-${fam.series}-crank-${teeth.replace('t', '')}`,
                type: 'Crankset',
                name: `Shimano ${fam.name} Crankset ${teeth}`,
                interfaces: JSON.stringify({ spindle: 'Hollowtech_II_24mm', pedal: '9/16' }),
                attributes: JSON.stringify({ speeds: fam.speed, teeth, weight: 650 })
            });
        });

        // Cassettes
        const cassettes = ['10-51', '10-45'];
        cassettes.forEach(range => {
            components.push({
                id: `shimano-${fam.series}-cassette-${range}`,
                type: 'Cassette',
                name: `Shimano ${fam.name} Cassette ${range}`,
                interfaces: JSON.stringify({ freehub: 'Shimano_MicroSpline' }),
                attributes: JSON.stringify({ speeds: fam.speed, range, weight: 450 })
            });
        });

        // Rear Derailleurs
        components.push({
            id: `shimano-${fam.series}-rd`,
            type: 'RearDerailleur',
            name: `Shimano ${fam.name} Rear Derailleur`,
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Shimano_MTB_12s' }),
            attributes: JSON.stringify({ speeds: fam.speed, max_cog: 51, weight: 300, clutch: true })
        });
    }

    // --- SRAM MTB (Eagle) ---
    const sramMtbFamilies = [
        { name: 'SX Eagle', series: 'sx-eagle', speed: 12 },
        { name: 'NX Eagle', series: 'nx-eagle', speed: 12 },
        { name: 'GX Eagle', series: 'gx-eagle', speed: 12 },
        { name: 'X01 Eagle', series: 'x01-eagle', speed: 12 },
        { name: 'XX1 Eagle', series: 'xx1-eagle', speed: 12 },
    ];

    for (const fam of sramMtbFamilies) {
        // Cranksets (1x)
        const cranks = ['30t', '32t', '34t'];
        cranks.forEach(teeth => {
            components.push({
                id: `sram-${fam.series}-crank-${teeth.replace('t', '')}`,
                type: 'Crankset',
                name: `SRAM ${fam.name} Crankset ${teeth}`,
                interfaces: JSON.stringify({ spindle: 'DUB_28.99mm', pedal: '9/16' }),
                attributes: JSON.stringify({ speeds: fam.speed, teeth, weight: 650 })
            });
        });

        // Cassettes
        // SX/NX use HG, GX+ use XD
        const freehub = (fam.series.includes('sx') || fam.series.includes('nx')) ? 'Shimano_HG_L2' : 'SRAM_XD';
        const range = (fam.series.includes('sx') || fam.series.includes('nx')) ? '11-50' : '10-52';

        components.push({
            id: `sram-${fam.series}-cassette-${range}`,
            type: 'Cassette',
            name: `SRAM ${fam.name} Cassette ${range}`,
            interfaces: JSON.stringify({ freehub }),
            attributes: JSON.stringify({ speeds: fam.speed, range, weight: 450 })
        });

        // Rear Derailleurs
        components.push({
            id: `sram-${fam.series}-rd`,
            type: 'RearDerailleur',
            name: `SRAM ${fam.name} Rear Derailleur`,
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'SRAM_Eagle_12s' }),
            attributes: JSON.stringify({ speeds: fam.speed, max_cog: 52, weight: 300, clutch: true })
        });
    }

    // --- SRAM T-Type (Transmission) ---
    const sramTransmission = [
        { name: 'GX Eagle Transmission', series: 'gx-transmission' },
        { name: 'X0 Eagle Transmission', series: 'x0-transmission' },
        { name: 'XX Eagle Transmission', series: 'xx-transmission' },
        { name: 'XX SL Eagle Transmission', series: 'xx-sl-transmission' },
    ];

    for (const fam of sramTransmission) {
        components.push({
            id: `sram-${fam.series}-rd`,
            type: 'RearDerailleur',
            name: `SRAM ${fam.name} Derailleur`,
            interfaces: JSON.stringify({ attachment: 'UDH_Direct_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 52, weight: 450, clutch: true, note: 'Requires UDH Frame' })
        });

        components.push({
            id: `sram-${fam.series}-cassette`,
            type: 'Cassette',
            name: `SRAM ${fam.name} Cassette 10-52t`,
            interfaces: JSON.stringify({ freehub: 'SRAM_XD' }), // Technically XS-1275/1295/1299 but fits XD driver
            attributes: JSON.stringify({ speeds: 12, range: '10-52', weight: 380 })
        });
    }


    console.log(`Prepared ${components.length} components for ingestion.`);

    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log('Seeding finished.');
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
