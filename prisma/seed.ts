import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // Interfaces
    const interfaces = [
        { id: 'INT_001', name: 'BSA_Threaded_68mm', category: 'Frame Shell' },
        { id: 'INT_002', name: 'PF30', category: 'Frame Shell' },
        { id: 'INT_003', name: '24mm_Spindle', category: 'Crank Input' },
        { id: 'INT_004', name: 'DUB_Spindle', category: 'Crank Input' },
        { id: 'INT_005', name: 'Flat_Mount_Brake', category: 'Frame/Fork Mount' },
        { id: 'INT_006', name: 'Post_Mount_Brake', category: 'Frame/Fork Mount' },
        { id: 'INT_007', name: '12x142mm', category: 'Rear Axle' },
        { id: 'INT_008', name: 'Standard_9/16', category: 'Pedal Thread' },
        { id: 'INT_009', name: 'IS41', category: 'Headset Upper' },
        { id: 'INT_010', name: 'IS52', category: 'Headset Lower' },
        { id: 'INT_011', name: 'Proprietary_Tarmac_SL7', category: 'Seatpost Shape' },
    ]

    for (const i of interfaces) {
        const result = await prisma.interface.upsert({
            where: { id: i.id },
            update: {},
            create: i,
        })
        console.log(`Upserted interface: ${result.name}`)
    }

    // Components
    // Clear existing components to avoid duplicates on re-seed (optional, but good for dev)
    await prisma.component.deleteMany({})

    const components = [
        // Frames - Road
        {
            type: 'Frame',
            name: 'S-Works Tarmac SL7',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Road',
                max_tire_width_mm: 32,
                weight_g: 800,
            },
        },
        {
            type: 'Frame',
            name: 'Canyon Aeroad CFR',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Road',
                max_tire_width_mm: 30,
                weight_g: 850,
            },
        },
        {
            type: 'Frame',
            name: 'Pinarello Dogma F',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Road',
                max_tire_width_mm: 32,
                weight_g: 865,
            },
        },
        {
            type: 'Frame',
            name: 'Trek Emonda SLR',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Road',
                max_tire_width_mm: 32,
                weight_g: 790,
            },
        },

        // Frames - Gravel
        {
            type: 'Frame',
            name: 'Santa Cruz Stigmata',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Gravel',
                max_tire_width_mm: 50,
                weight_g: 1100,
            },
        },
        {
            type: 'Frame',
            name: '3T Exploro RaceMax',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Gravel',
                max_tire_width_mm: 61,
                weight_g: 1050,
            },
        },
        {
            type: 'Frame',
            name: 'Open WI.DE',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x142mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'Gravel',
                max_tire_width_mm: 54,
                weight_g: 1080,
            },
        },

        // Frames - MTB
        {
            type: 'Frame',
            name: 'Evil Chamois Hagar',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x148mm',
                brake_mount_rear: 'Flat_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'MTB',
                max_tire_width_mm: 55,
                weight_g: 1150,
            },
        },
        {
            type: 'Frame',
            name: 'Yeti SB115',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x148mm',
                brake_mount_rear: 'Post_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'MTB',
                max_tire_width_mm: 58,
                weight_g: 1200,
            },
        },
        {
            type: 'Frame',
            name: 'Santa Cruz Tallboy',
            interfaces: {
                bottom_bracket_shell: 'BSA_Threaded_68mm',
                rear_axle: '12x148mm',
                brake_mount_rear: 'Post_Mount_Brake',
                brake_type: 'Disc',
            },
            attributes: {
                category: 'MTB',
                max_tire_width_mm: 60,
                weight_g: 1180,
            },
        },
        // Wheels
        {
            type: 'Wheel',
            name: 'Zipp 303 Firecrest (Shimano HG)',
            interfaces: {
                axle: '12x142mm',
                freehub_body: 'Shimano_HG',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1450,
                tubeless_ready: true,
            },
        },
        {
            type: 'Wheel',
            name: 'Zipp 303 Firecrest (SRAM XDR)',
            interfaces: {
                axle: '12x142mm',
                freehub_body: 'SRAM_XDR',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1455,
                tubeless_ready: true,
            },
        },
        {
            type: 'Wheel',
            name: 'Enve Foundation 45 (SRAM XDR)',
            interfaces: {
                axle: '12x148mm',
                freehub_body: 'SRAM_XDR',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1520,
                tubeless_ready: true,
            },
        },
        {
            type: 'Wheel',
            name: 'Roval Rapide CLX (Shimano HG)',
            interfaces: {
                axle: '12x142mm',
                freehub_body: 'Shimano_HG',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1380,
                tubeless_ready: true,
            },
        },
        {
            type: 'Wheel',
            name: 'Hunt 36 Carbon Gravel (Shimano HG)',
            interfaces: {
                axle: '12x142mm',
                freehub_body: 'Shimano_HG',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1620,
                tubeless_ready: true,
            },
        },
        {
            type: 'Wheel',
            name: 'Hunt 36 Carbon Gravel (Shimano Microspline)',
            interfaces: {
                axle: '12x142mm',
                freehub_body: 'Shimano_Microspline',
                brake_type: 'Disc',
            },
            attributes: {
                weight_g: 1625,
                tubeless_ready: true,
            },
        },

        // Bottom Brackets
        {
            type: 'BottomBracket',
            name: 'SRAM DUB BSA BB',
            interfaces: {
                frame_interface: 'BSA_Threaded_68mm',
                crank_interface: 'DUB_Spindle',
            },
            attributes: {
                weight_g: 58,
            },
        },
        {
            type: 'BottomBracket',
            name: 'Shimano BSA 24mm BB',
            interfaces: {
                frame_interface: 'BSA_Threaded_68mm',
                crank_interface: '24mm_Spindle',
            },
            attributes: {
                weight_g: 70,
            },
        },
        {
            type: 'BottomBracket',
            name: 'CeramicSpeed PF30 for DUB',
            interfaces: {
                frame_interface: 'PF30',
                crank_interface: 'DUB_Spindle',
            },
            attributes: {
                weight_g: 62,
            },
        },

        // Cranks
        {
            type: 'Crank',
            name: 'SRAM Red AXS Power Meter 48/35',
            interfaces: {
                spindle_type: 'DUB_Spindle',
            },
            attributes: {
                chainring_large: 48,
                chainring_small: 35,
                chainring_diff: 13,
                weight_g: 680,
            },
        },
        {
            type: 'Crank',
            name: 'SRAM Force AXS 46/33',
            interfaces: {
                spindle_type: 'DUB_Spindle',
            },
            attributes: {
                chainring_large: 46,
                chainring_small: 33,
                chainring_diff: 13,
                weight_g: 720,
            },
        },
        {
            type: 'Crank',
            name: 'Shimano Dura-Ace R9200 50/34',
            interfaces: {
                spindle_type: '24mm_Spindle',
            },
            attributes: {
                chainring_large: 50,
                chainring_small: 34,
                chainring_diff: 16,
                weight_g: 655,
            },
        },
        {
            type: 'Crank',
            name: 'Shimano Ultegra R8100 52/36',
            interfaces: {
                spindle_type: '24mm_Spindle',
            },
            attributes: {
                chainring_large: 52,
                chainring_small: 36,
                chainring_diff: 16,
                weight_g: 695,
            },
        },
        {
            type: 'Crank',
            name: 'SRAM Force AXS 1x 44t',
            interfaces: {
                spindle_type: 'DUB_Spindle',
            },
            attributes: {
                chainring_large: 44,
                chainring_small: 0,
                chainring_diff: 0,
                weight_g: 590,
            },
        },
        {
            type: 'Crank',
            name: 'SRAM Force AXS 1x 42t',
            interfaces: {
                spindle_type: 'DUB_Spindle',
            },
            attributes: {
                chainring_large: 42,
                chainring_small: 0,
                chainring_diff: 0,
                weight_g: 585,
            },
        },
        {
            type: 'Crank',
            name: 'SRAM GX Eagle 1x 32t',
            interfaces: {
                spindle_type: 'DUB_Spindle',
            },
            attributes: {
                chainring_large: 32,
                chainring_small: 0,
                chainring_diff: 0,
                weight_g: 620,
            },
        },
        // Shifters
        {
            type: 'Shifter',
            name: 'SRAM Red eTap AXS Shifters',
            interfaces: {
                protocol: 'SRAM_AXS',
            },
            attributes: {
                weight_g: 270,
            },
        },
        {
            type: 'Shifter',
            name: 'SRAM Force eTap AXS Shifters',
            interfaces: {
                protocol: 'SRAM_AXS',
            },
            attributes: {
                weight_g: 290,
            },
        },
        {
            type: 'Shifter',
            name: 'Shimano Dura-Ace Di2 Shifters',
            interfaces: {
                protocol: 'Shimano_Di2',
            },
            attributes: {
                weight_g: 280,
            },
        },
        {
            type: 'Shifter',
            name: 'Shimano Ultegra Di2 Shifters',
            interfaces: {
                protocol: 'Shimano_Di2',
            },
            attributes: {
                weight_g: 300,
            },
        },

        // Derailleurs  
        {
            type: 'Derailleur',
            name: 'SRAM Red AXS Rear Derailleur',
            interfaces: {
                protocol: 'SRAM_AXS',
            },
            attributes: {
                max_tooth: 33,
                capacity: 36,
                weight_g: 215,
            },
        },
        {
            type: 'Derailleur',
            name: 'SRAM Force AXS Rear Derailleur',
            interfaces: {
                protocol: 'SRAM_AXS',
            },
            attributes: {
                max_tooth: 36,
                capacity: 39,
                weight_g: 235,
            },
        },
        {
            type: 'Derailleur',
            name: 'SRAM Eagle AXS Derailleur',
            interfaces: {
                protocol: 'SRAM_AXS',
            },
            attributes: {
                max_tooth: 52,
                capacity: 46,
                weight_g: 310,
            },
        },
        {
            type: 'Derailleur',
            name: 'Shimano Dura-Ace Di2 RD-R9250',
            interfaces: {
                protocol: 'Shimano_Di2',
            },
            attributes: {
                max_tooth: 34,
                capacity: 37,
                weight_g: 220,
            },
        },
        {
            type: 'Derailleur',
            name: 'Shimano Ultegra Di2 RD-R8150',
            interfaces: {
                protocol: 'Shimano_Di2',
            },
            attributes: {
                max_tooth: 34,
                capacity: 40,
                weight_g: 245,
            },
        },

        // Cassettes
        {
            type: 'Cassette',
            name: 'SRAM Red XG-1290 10-33',
            interfaces: {
                cassette_mount: 'SRAM_XDR',
            },
            attributes: {
                largest_cog: 33,
                diff: 23,
                weight_g: 210,
            },
        },
        {
            type: 'Cassette',
            name: 'SRAM Force XG-1270 10-36',
            interfaces: {
                cassette_mount: 'SRAM_XDR',
            },
            attributes: {
                largest_cog: 36,
                diff: 26,
                weight_g: 265,
            },
        },
        {
            type: 'Cassette',
            name: 'SRAM Eagle XG-1299 10-52',
            interfaces: {
                cassette_mount: 'SRAM_XDR',
            },
            attributes: {
                largest_cog: 52,
                diff: 42,
                weight_g: 355,
            },
        },
        {
            type: 'Cassette',
            name: 'Shimano Dura-Ace CS-R9200 11-30',
            interfaces: {
                cassette_mount: 'Shimano_HG',
            },
            attributes: {
                largest_cog: 30,
                diff: 19,
                weight_g: 215,
            },
        },
        {
            type: 'Cassette',
            name: 'Shimano Ultegra CS-R8100 11-34',
            interfaces: {
                cassette_mount: 'Shimano_HG',
            },
            attributes: {
                largest_cog: 34,
                diff: 23,
                weight_g: 280,
            },
        },
        {
            type: 'Cassette',
            name: 'SRAM GX Eagle 10-50',
            interfaces: {
                cassette_mount: 'SRAM_XDR',
            },
            attributes: {
                largest_cog: 50,
                diff: 40,
                weight_g: 380,
            },
        },
        {
            type: 'Cassette',
            name: 'Shimano XT M8100 10-51',
            interfaces: {
                cassette_mount: 'Shimano_Microspline',
            },
            attributes: {
                largest_cog: 51,
                diff: 41,
                weight_g: 465,
            },
        },
    ]

    for (const c of components) {
        const result = await prisma.component.create({
            data: {
                type: c.type,
                name: c.name,
                interfaces: JSON.stringify(c.interfaces),
                attributes: JSON.stringify(c.attributes),
            },
        })
        console.log(`Created component: ${result.name}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
