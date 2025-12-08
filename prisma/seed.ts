import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Helper to create component if it doesn't exist
    const upsertComponent = async (id: string, data: any) => {
        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: { ...data, id } });
            console.log(`Created: ${data.name}`);
        } else {
            console.log(`Skipped (Exists): ${data.name}`);
        }
    };

    const components = [
        // --- FRAMES ---
        // Specialized
        {
            id: 'specialized-tarmac-sl8',
            type: 'Frame',
            name: 'Specialized Tarmac SL8 (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: 'Specialized_Specific', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Road', material: 'Carbon', weight: 685, max_tire: 32 }),
        },
        {
            id: 'specialized-crux-dsw',
            type: 'Frame',
            name: 'Specialized Crux DSW (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Alloy', weight: 1399, max_tire: 47 }),
        },
        {
            id: 'specialized-crux-pro',
            type: 'Frame',
            name: 'Specialized Crux Pro (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Carbon', weight: 825, max_tire: 47 }),
        },
        {
            id: 'specialized-diverge-e5',
            type: 'Frame',
            name: 'Specialized Diverge E5 (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Alloy', weight: 1600, max_tire: 47 }),
        },
        {
            id: 'specialized-diverge-str',
            type: 'Frame',
            name: 'Specialized Diverge STR (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Carbon', weight: 1100, max_tire: 47, note: 'Rear Future Shock' }),
        },
        {
            id: 'specialized-chisel',
            type: 'Frame',
            name: 'Specialized Chisel (Large)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_73mm', rear_axle: 'TA_12x148mm', seatpost_diameter: '30.9mm', brake_mount: 'Post_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'MTB', material: 'Alloy', weight: 1350, max_tire: 60 }),
        },
        {
            id: 'specialized-epic-8',
            type: 'Frame',
            name: 'Specialized Epic 8 (Large)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_73mm', rear_axle: 'TA_12x148mm', seatpost_diameter: '30.9mm', brake_mount: 'Post_Mount', steerer_tube: '1_1/8', udh: true }),
            attributes: JSON.stringify({ category: 'MTB', material: 'Carbon', weight: 1700, max_tire: 60 }),
        },

        // Trek
        {
            id: 'trek-checkpoint-alr',
            type: 'Frame',
            name: 'Trek Checkpoint ALR (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Alloy', weight: 1450, max_tire: 45 }),
        },
        {
            id: 'trek-checkpoint-sl',
            type: 'Frame',
            name: 'Trek Checkpoint SL (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Carbon', weight: 1100, max_tire: 45 }),
        },
        {
            id: 'trek-madone-sl',
            type: 'Frame',
            name: 'Trek Madone SL (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'T47_Internal_86mm', rear_axle: 'TA_12x142mm', seatpost_diameter: 'Trek_Specific', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Road', material: 'Carbon', weight: 1050, max_tire: 32 }),
        },

        // Cervelo
        {
            id: 'cervelo-aspero-5',
            type: 'Frame',
            name: 'Cervelo Aspero-5 (56cm)',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BBright_79mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Carbon', weight: 990, max_tire: 45 }),
        },

        // Santa Cruz
        {
            id: 'santa-cruz-stigmata',
            type: 'Frame',
            name: 'Santa Cruz Stigmata CC',
            interfaces: JSON.stringify({ bottom_bracket_shell: 'BSA_Threaded_68mm', rear_axle: 'TA_12x142mm', seatpost_diameter: '27.2mm', brake_mount: 'Flat_Mount', udh: true, steerer_tube: '1_1/8' }),
            attributes: JSON.stringify({ category: 'Gravel', material: 'Carbon', weight: 1050, max_tire: 50 }),
        },

        // --- HANDLEBARS ---
        {
            id: 'zipp-service-course-70-ergo',
            type: 'Handlebar',
            name: 'Zipp Service Course 70 Ergo',
            interfaces: JSON.stringify({ clamp_diameter: '31.8mm' }),
            attributes: JSON.stringify({ material: 'Alloy', width: '42cm', weight: 305 }),
        },
        {
            id: 'zipp-sl-70-ergo',
            type: 'Handlebar',
            name: 'Zipp SL-70 Ergo Carbon',
            interfaces: JSON.stringify({ clamp_diameter: '31.8mm' }),
            attributes: JSON.stringify({ material: 'Carbon', width: '42cm', weight: 205 }),
        },
        {
            id: 'enve-ses-ar',
            type: 'Handlebar',
            name: 'ENVE SES AR Road Handlebar',
            interfaces: JSON.stringify({ clamp_diameter: '31.8mm' }),
            attributes: JSON.stringify({ material: 'Carbon', width: '42cm', weight: 245 }),
        },

        // --- STEMS ---
        {
            id: 'zipp-service-course-stem',
            type: 'Stem',
            name: 'Zipp Service Course Stem',
            interfaces: JSON.stringify({ clamp_diameter: '31.8mm', steerer_clamp: '1_1/8' }),
            attributes: JSON.stringify({ material: 'Alloy', length: '100mm', angle: '-6', weight: 150 }),
        },
        {
            id: 'enve-road-stem',
            type: 'Stem',
            name: 'ENVE Road Stem Carbon',
            interfaces: JSON.stringify({ clamp_diameter: '31.8mm', steerer_clamp: '1_1/8' }),
            attributes: JSON.stringify({ material: 'Carbon', length: '100mm', angle: '-6', weight: 125 }),
        },

        // --- SHIMANO ROAD (12s Di2) ---
        {
            id: 'shimano-da-r9200-rd',
            type: 'RearDerailleur',
            name: 'Shimano Dura-Ace RD-R9250 (12s)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Di2_12s_Wireless' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 34, weight: 215 }),
        },
        {
            id: 'shimano-ultegra-r8100-rd',
            type: 'RearDerailleur',
            name: 'Shimano Ultegra RD-R8150 (12s)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Di2_12s_Wireless' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 34, weight: 262 }),
        },
        {
            id: 'shimano-105-r7100-rd',
            type: 'RearDerailleur',
            name: 'Shimano 105 RD-R7150 (12s)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Di2_12s_Wireless' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 36, weight: 302 }),
        },

        // --- SHIMANO GRX (11s & 12s) ---
        {
            id: 'shimano-grx-rx810-rd',
            type: 'RearDerailleur',
            name: 'Shimano GRX RD-RX810 (11s)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Shimano_Road_11s' }),
            attributes: JSON.stringify({ speeds: 11, max_cog: 34, weight: 251, clutch: true }),
        },
        {
            id: 'shimano-grx-rx822-sgs',
            type: 'RearDerailleur',
            name: 'Shimano GRX RD-RX822-SGS (12s)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', cable_pull: 'Shimano_Road_12s_Mech' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 51, weight: 296, clutch: true }),
        },

        // --- SRAM AXS (Road) ---
        {
            id: 'sram-red-axs-rd',
            type: 'RearDerailleur',
            name: 'SRAM Red eTap AXS Rear Derailleur (36T)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 36, weight: 280 }),
        },
        {
            id: 'sram-force-axs-rd',
            type: 'RearDerailleur',
            name: 'SRAM Force eTap AXS Rear Derailleur (36T)',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 36, weight: 300 }),
        },
        {
            id: 'sram-rival-axs-rd',
            type: 'RearDerailleur',
            name: 'SRAM Rival eTap AXS XPLR Rear Derailleur',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 44, weight: 327 }),
        },

        // --- SRAM EAGLE (MTB / Mullet) ---
        {
            id: 'sram-xx1-eagle-axs-rd',
            type: 'RearDerailleur',
            name: 'SRAM XX1 Eagle AXS Rear Derailleur',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 52, weight: 350, clutch: true }),
        },
        {
            id: 'sram-gx-eagle-axs-rd',
            type: 'RearDerailleur',
            name: 'SRAM GX Eagle AXS Rear Derailleur',
            interfaces: JSON.stringify({ attachment: 'Standard_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 52, weight: 468, clutch: true }),
        },
        {
            id: 'sram-xx-sl-transmission',
            type: 'RearDerailleur',
            name: 'SRAM XX SL Eagle Transmission Derailleur',
            interfaces: JSON.stringify({ attachment: 'UDH_Direct_Mount', protocol: 'AXS' }),
            attributes: JSON.stringify({ speeds: 12, max_cog: 52, weight: 440, clutch: true, note: 'Requires UDH Frame' }),
        },

        // --- CASSETTES ---
        {
            id: 'shimano-cs-r9200-11-30',
            type: 'Cassette',
            name: 'Shimano Dura-Ace CS-R9200 11-30t',
            interfaces: JSON.stringify({ freehub: 'Shimano_HG_L2' }),
            attributes: JSON.stringify({ speeds: 12, range: '11-30', weight: 223 }),
        },
        {
            id: 'sram-xg-1299-10-52',
            type: 'Cassette',
            name: 'SRAM XX1 Eagle XG-1299 10-52t (Copper)',
            interfaces: JSON.stringify({ freehub: 'SRAM_XD' }),
            attributes: JSON.stringify({ speeds: 12, range: '10-52', weight: 372 }),
        },
        {
            id: 'sram-xg-1275-10-52',
            type: 'Cassette',
            name: 'SRAM GX Eagle XG-1275 10-52t',
            interfaces: JSON.stringify({ freehub: 'SRAM_XD' }),
            attributes: JSON.stringify({ speeds: 12, range: '10-52', weight: 452 }),
        },

        // --- CRANKSETS ---
        {
            id: 'shimano-fc-r9200',
            type: 'Crankset',
            name: 'Shimano Dura-Ace FC-R9200 52/36',
            interfaces: JSON.stringify({ spindle: 'Hollowtech_II_24mm', pedal: '9/16' }),
            attributes: JSON.stringify({ speeds: 12, teeth: '52/36', weight: 690 }),
        },
        {
            id: 'sram-red-axs-crank',
            type: 'Crankset',
            name: 'SRAM Red AXS Power Meter Crankset 48/35',
            interfaces: JSON.stringify({ spindle: 'DUB_28.99mm', pedal: '9/16' }),
            attributes: JSON.stringify({ speeds: 12, teeth: '48/35', weight: 580 }),
        },
        {
            id: 'sram-xx1-eagle-crank',
            type: 'Crankset',
            name: 'SRAM XX1 Eagle DUB Crankset 34t',
            interfaces: JSON.stringify({ spindle: 'DUB_28.99mm', pedal: '9/16' }),
            attributes: JSON.stringify({ speeds: 12, teeth: '34', weight: 420 }),
        },

        // --- BOTTOM BRACKETS ---
        {
            id: 'shimano-bb-r9100',
            type: 'BottomBracket',
            name: 'Shimano Dura-Ace BB-R9100 (BSA)',
            interfaces: JSON.stringify({ frame_shell: 'BSA_Threaded_68mm', crank_spindle: 'Hollowtech_II_24mm' }),
            attributes: JSON.stringify({ weight: 65 }),
        },
        {
            id: 'sram-dub-bsa',
            type: 'BottomBracket',
            name: 'SRAM DUB BSA Bottom Bracket',
            interfaces: JSON.stringify({ frame_shell: 'BSA_Threaded_68mm', crank_spindle: 'DUB_28.99mm' }),
            attributes: JSON.stringify({ weight: 76 }),
        },
        {
            id: 'chris-king-t47-30i',
            type: 'BottomBracket',
            name: 'Chris King T47 30i (Internal)',
            interfaces: JSON.stringify({ frame_shell: 'T47_Internal_86mm', crank_spindle: 'DUB_28.99mm' }), // Requires fit kit for DUB
            attributes: JSON.stringify({ weight: 110, note: 'Requires Fit Kit #2 for DUB' }),
        },
        {
            id: 'chris-king-t47-24i',
            type: 'BottomBracket',
            name: 'Chris King T47 24i (Internal)',
            interfaces: JSON.stringify({ frame_shell: 'T47_Internal_86mm', crank_spindle: 'Hollowtech_II_24mm' }),
            attributes: JSON.stringify({ weight: 110, note: 'Ceramic Bearings' }),
        },
        {
            id: 'wheels-mfg-t47-internal-30mm',
            type: 'BottomBracket',
            name: 'Wheels Mfg T47 Internal 30mm',
            interfaces: JSON.stringify({ frame_shell: 'T47_Internal_86mm', crank_spindle: '30mm' }),
            attributes: JSON.stringify({ weight: 98 }),
        },

        // --- WHEELS ---
        {
            id: 'roval-rapide-clx-ii',
            type: 'Wheelset',
            name: 'Roval Rapide CLX II',
            interfaces: JSON.stringify({ front_axle: 'TA_12x100mm', rear_axle: 'TA_12x142mm', brake: 'Centerlock', freehub: 'Shimano_HG_L2' }),
            attributes: JSON.stringify({ weight: 1520, depth: '51/60mm', internal_width: 21 }),
        },
        {
            id: 'zipp-303-firecrest',
            type: 'Wheelset',
            name: 'Zipp 303 Firecrest Tubeless',
            interfaces: JSON.stringify({ front_axle: 'TA_12x100mm', rear_axle: 'TA_12x142mm', brake: 'Centerlock', freehub: 'SRAM_XDR' }),
            attributes: JSON.stringify({ weight: 1352, depth: '40mm', internal_width: 25 }),
        },
        {
            id: 'enve-g23',
            type: 'Wheelset',
            name: 'ENVE G23 Gravel Wheelset',
            interfaces: JSON.stringify({ front_axle: 'TA_12x100mm', rear_axle: 'TA_12x142mm', brake: 'Centerlock', freehub: 'SRAM_XDR' }),
            attributes: JSON.stringify({ weight: 1305, depth: '25mm', internal_width: 23 }),
        },
    ];

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
