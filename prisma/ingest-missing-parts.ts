/**
 * Add missing parts from MISSING_PARTS_TO_ADD list
 * Run with: npx tsx prisma/ingest-missing-parts.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// FRAMES
// ============================================
const FRAMES = [
    // Argon 18
    {
        id: 'argon18-sum-pro',
        name: 'Argon 18 Sum Pro',
        attributes: {
            brand: 'Argon 18',
            material: 'Carbon',
            category: 'Road',
            weight_g: 850,
        },
        interfaces: {
            bb_shell: 'BB386_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'argon18-dark-matter',
        name: 'Argon 18 Dark Matter',
        attributes: {
            brand: 'Argon 18',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1050,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'BB386_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Bianchi
    {
        id: 'bianchi-oltre-rc',
        name: 'Bianchi Oltre RC',
        attributes: {
            brand: 'Bianchi',
            material: 'Carbon',
            category: 'Road',
            weight_g: 890,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: 'Aero Integrated',
        },
    },
    {
        id: 'bianchi-infinito-cv',
        name: 'Bianchi Infinito CV',
        attributes: {
            brand: 'Bianchi',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Endurance',
            weight_g: 980,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'bianchi-arcadex',
        name: 'Bianchi Arcadex',
        attributes: {
            brand: 'Bianchi',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1020,
            max_tire: 45,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Cube
    {
        id: 'cube-agree-c62',
        name: 'Cube Agree C:62',
        attributes: {
            brand: 'Cube',
            material: 'Carbon',
            category: 'Road',
            weight_g: 920,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'cube-nuroad-c62',
        name: 'Cube Nuroad C:62',
        attributes: {
            brand: 'Cube',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1050,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'cube-stereo',
        name: 'Cube Stereo 140 C:62',
        attributes: {
            brand: 'Cube',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'Trail',
            weight_g: 2650,
            rear_travel: 140,
            max_tire: 63,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    // Factor
    {
        id: 'factor-o2-vam',
        name: 'Factor O2 VAM',
        attributes: {
            brand: 'Factor',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Climbing',
            weight_g: 780,
        },
        interfaces: {
            bb_shell: 'BB386_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'factor-ls',
        name: 'Factor LS',
        attributes: {
            brand: 'Factor',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 980,
            max_tire: 47,
        },
        interfaces: {
            bb_shell: 'BB386_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'factor-ostro-vam',
        name: 'Factor Ostro VAM',
        attributes: {
            brand: 'Factor',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Aero',
            weight_g: 890,
        },
        interfaces: {
            bb_shell: 'BB386_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: 'Aero Integrated',
        },
    },
    // Focus
    {
        id: 'focus-izalco-max',
        name: 'Focus Izalco Max',
        attributes: {
            brand: 'Focus',
            material: 'Carbon',
            category: 'Road',
            weight_g: 850,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'focus-atlas',
        name: 'Focus Atlas',
        attributes: {
            brand: 'Focus',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1100,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Kona
    {
        id: 'kona-process-134',
        name: 'Kona Process 134',
        attributes: {
            brand: 'Kona',
            material: 'Aluminum',
            category: 'MTB',
            subcategory: 'Trail',
            weight_g: 3100,
            rear_travel: 134,
            max_tire: 63,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    {
        id: 'kona-process-153',
        name: 'Kona Process 153',
        attributes: {
            brand: 'Kona',
            material: 'Aluminum',
            category: 'MTB',
            subcategory: 'Enduro',
            weight_g: 3300,
            rear_travel: 153,
            max_tire: 66,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    // Niner
    {
        id: 'niner-rlt-9-rdo',
        name: 'Niner RLT 9 RDO',
        attributes: {
            brand: 'Niner',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1050,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'BSA_68mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'niner-rip-9-rdo',
        name: 'Niner RIP 9 RDO',
        attributes: {
            brand: 'Niner',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'Trail',
            weight_g: 2550,
            rear_travel: 140,
            max_tire: 63,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    // Norco
    {
        id: 'norco-range',
        name: 'Norco Range C1',
        attributes: {
            brand: 'Norco',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'Enduro',
            weight_g: 2900,
            rear_travel: 170,
            max_tire: 66,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    {
        id: 'norco-sight',
        name: 'Norco Sight C1',
        attributes: {
            brand: 'Norco',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'Trail',
            weight_g: 2650,
            rear_travel: 140,
            max_tire: 63,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    {
        id: 'norco-search-xr',
        name: 'Norco Search XR Carbon',
        attributes: {
            brand: 'Norco',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1150,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'BSA_68mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Orbea
    {
        id: 'orbea-orca',
        name: 'Orbea Orca OMX',
        attributes: {
            brand: 'Orbea',
            material: 'Carbon',
            category: 'Road',
            weight_g: 820,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'orbea-terra',
        name: 'Orbea Terra OMX',
        attributes: {
            brand: 'Orbea',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1020,
            max_tire: 47,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'orbea-oiz',
        name: 'Orbea Oiz OMX',
        attributes: {
            brand: 'Orbea',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'XC',
            weight_g: 1900,
            rear_travel: 100,
            max_tire: 57,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    // Ridley
    {
        id: 'ridley-noah-fast',
        name: 'Ridley Noah Fast',
        attributes: {
            brand: 'Ridley',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Aero',
            weight_g: 920,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: 'Aero Integrated',
        },
    },
    {
        id: 'ridley-fenix-slic',
        name: 'Ridley Fenix SLiC',
        attributes: {
            brand: 'Ridley',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Endurance',
            weight_g: 980,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'ridley-kanzo-fast',
        name: 'Ridley Kanzo Fast',
        attributes: {
            brand: 'Ridley',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1050,
            max_tire: 45,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Rocky Mountain
    {
        id: 'rocky-altitude',
        name: 'Rocky Mountain Altitude Carbon 50',
        attributes: {
            brand: 'Rocky Mountain',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'Trail',
            weight_g: 2700,
            rear_travel: 150,
            max_tire: 63,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    {
        id: 'rocky-element',
        name: 'Rocky Mountain Element Carbon 50',
        attributes: {
            brand: 'Rocky Mountain',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'XC',
            weight_g: 2100,
            rear_travel: 120,
            max_tire: 61,
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '31.6mm',
        },
    },
    // Salsa
    {
        id: 'salsa-warbird',
        name: 'Salsa Warbird Carbon',
        attributes: {
            brand: 'Salsa',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1100,
            max_tire: 50,
        },
        interfaces: {
            bb_shell: 'BSA_68mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    {
        id: 'salsa-cutthroat',
        name: 'Salsa Cutthroat Carbon',
        attributes: {
            brand: 'Salsa',
            material: 'Carbon',
            category: 'Gravel',
            subcategory: 'Adventure',
            weight_g: 1250,
            max_tire: 55,
        },
        interfaces: {
            bb_shell: 'BSA_68mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
    // Wilier
    {
        id: 'wilier-filante-slr',
        name: 'Wilier Filante SLR',
        attributes: {
            brand: 'Wilier',
            material: 'Carbon',
            category: 'Road',
            subcategory: 'Aero',
            weight_g: 880,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: 'Aero Integrated',
        },
    },
    {
        id: 'wilier-jena',
        name: 'Wilier Jena',
        attributes: {
            brand: 'Wilier',
            material: 'Carbon',
            category: 'Gravel',
            weight_g: 1080,
            max_tire: 45,
        },
        interfaces: {
            bb_shell: 'PF86_86.5mm',
            brake_type: 'Disc',
            axle_standard: '142x12',
            headset: 'IS42/IS52',
            seatpost: '27.2mm',
        },
    },
];

// ============================================
// CRANKSETS
// ============================================
const CRANKSETS = [
    // FSA
    {
        id: 'fsa-kforce-we-abs',
        name: 'FSA K-Force WE ABS Road Crankset',
        attributes: {
            brand: 'FSA',
            teeth: '52/36',
            weight_g: 558,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'BB386_30mm',
            chainring_mount: 'Direct Mount',
        },
    },
    {
        id: 'fsa-powerbox-carbon',
        name: 'FSA Powerbox Carbon Road Crankset',
        attributes: {
            brand: 'FSA',
            teeth: '52/36',
            weight_g: 670,
            arm_length: 172.5,
            power_meter: true,
        },
        interfaces: {
            bb_interface: 'BB386_30mm',
            chainring_mount: 'Direct Mount',
        },
    },
    {
        id: 'fsa-gradient',
        name: 'FSA Gradient Gravel Crankset',
        attributes: {
            brand: 'FSA',
            teeth: '46/30',
            weight_g: 620,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'BB386_30mm',
            chainring_mount: 'Direct Mount',
        },
    },
    // SRAM
    {
        id: 'sram-rival-axs-dub',
        name: 'SRAM Rival AXS DUB Crankset 48/35',
        attributes: {
            brand: 'SRAM',
            teeth: '48/35',
            weight_g: 695,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'DUB_28.99mm',
            chainring_mount: 'Direct Mount',
            speeds: 12,
        },
    },
    {
        id: 'sram-apex-1-dub',
        name: 'SRAM Apex 1 DUB Crankset 40t',
        attributes: {
            brand: 'SRAM',
            teeth: '40',
            weight_g: 610,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'DUB_28.99mm',
            chainring_mount: 'Direct Mount',
            speeds: 12,
        },
    },
    // Shimano GRX
    {
        id: 'shimano-grx-rx820-2x',
        name: 'Shimano GRX FC-RX820-2 (2x Gravel)',
        attributes: {
            brand: 'Shimano',
            teeth: '48/31',
            weight_g: 748,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'Hollowtech_II_24mm',
            chainring_mount: 'Shimano Asymmetric',
            speeds: 12,
        },
    },
    {
        id: 'shimano-grx-rx600-2x',
        name: 'Shimano GRX FC-RX600-2 (2x Gravel)',
        attributes: {
            brand: 'Shimano',
            teeth: '46/30',
            weight_g: 785,
            arm_length: 172.5,
        },
        interfaces: {
            bb_interface: 'Hollowtech_II_24mm',
            chainring_mount: 'Shimano Asymmetric',
            speeds: 11,
        },
    },
];

// ============================================
// BOTTOM BRACKETS
// ============================================
const BOTTOM_BRACKETS = [
    // Enduro
    {
        id: 'enduro-xd15-bb386',
        name: 'Enduro XD-15 Ceramic BB386',
        attributes: {
            brand: 'Enduro',
            weight_g: 75,
            bearing_type: 'Ceramic',
        },
        interfaces: {
            frame_interface: 'BB386_86.5mm',
            frame_shell: 'BB386_86.5mm',
            crank_interface: 'BB386_30mm',
            crank_spindle: 'BB386_30mm',
        },
    },
    {
        id: 'enduro-xd15-pf86',
        name: 'Enduro XD-15 Ceramic PF86',
        attributes: {
            brand: 'Enduro',
            weight_g: 68,
            bearing_type: 'Ceramic',
        },
        interfaces: {
            frame_interface: 'PF86_86.5mm',
            frame_shell: 'PF86_86.5mm',
            crank_interface: 'Hollowtech_II_24mm',
            crank_spindle: 'Hollowtech_II_24mm',
        },
    },
    // Token
    {
        id: 'token-bb386-ceramic',
        name: 'Token Ninja BB386 Ceramic',
        attributes: {
            brand: 'Token',
            weight_g: 72,
            bearing_type: 'Ceramic',
        },
        interfaces: {
            frame_interface: 'BB386_86.5mm',
            frame_shell: 'BB386_86.5mm',
            crank_interface: 'BB386_30mm',
            crank_spindle: 'BB386_30mm',
        },
    },
    {
        id: 'token-pf30-ceramic',
        name: 'Token Ninja PF30 Ceramic',
        attributes: {
            brand: 'Token',
            weight_g: 65,
            bearing_type: 'Ceramic',
        },
        interfaces: {
            frame_interface: 'PF30_68mm',
            frame_shell: 'PF30_68mm',
            crank_interface: 'BB30_30mm',
            crank_spindle: 'BB30_30mm',
        },
    },
];

// ============================================
// REAR DERAILLEURS
// ============================================
const REAR_DERAILLEURS = [
    // L-Twoo
    {
        id: 'ltwoo-egr-gravel',
        name: 'L-Twoo eGR Gravel Wireless',
        attributes: {
            brand: 'L-Twoo',
            electronic: true,
            weight_g: 295,
            max_cog: 46,
        },
        interfaces: {
            speeds: 12,
            mount: 'Direct Mount',
            actuation: 'Wireless Electronic',
        },
    },
    {
        id: 'ltwoo-erx-trail',
        name: 'L-Twoo eRX Trail Wireless',
        attributes: {
            brand: 'L-Twoo',
            electronic: true,
            weight_g: 310,
            max_cog: 52,
        },
        interfaces: {
            speeds: 12,
            mount: 'Direct Mount',
            actuation: 'Wireless Electronic',
        },
    },
    // Shimano
    {
        id: 'shimano-deore-xt-m8120',
        name: 'Shimano Deore XT RD-M8120-SGS (12s)',
        attributes: {
            brand: 'Shimano',
            electronic: false,
            weight_g: 273,
            max_cog: 51,
        },
        interfaces: {
            speeds: 12,
            mount: 'Direct Mount',
            actuation: 'Cable',
            pull_ratio: 'Shimano MTB',
        },
    },
    {
        id: 'shimano-105-r7000',
        name: 'Shimano 105 RD-R7000 (11s)',
        attributes: {
            brand: 'Shimano',
            electronic: false,
            weight_g: 230,
            max_cog: 34,
        },
        interfaces: {
            speeds: 11,
            mount: 'Direct Mount',
            actuation: 'Cable',
            pull_ratio: 'Shimano Road',
        },
    },
];

// ============================================
// SHIFTERS
// ============================================
const SHIFTERS = [
    // L-Twoo
    {
        id: 'ltwoo-egr-shifters',
        name: 'L-Twoo eGR Gravel Shifters',
        attributes: {
            brand: 'L-Twoo',
            electronic: true,
            weight_g: 360,
        },
        interfaces: {
            speeds: 12,
            actuation: 'Wireless Electronic',
            bar_type: 'Drop',
        },
    },
    {
        id: 'ltwoo-ax13-shifters',
        name: 'L-Twoo AX13 Mechanical Road Shifters',
        attributes: {
            brand: 'L-Twoo',
            electronic: false,
            weight_g: 420,
        },
        interfaces: {
            speeds: 13,
            actuation: 'Cable',
            bar_type: 'Drop',
        },
    },
    // Campagnolo
    {
        id: 'campagnolo-record-12-mech',
        name: 'Campagnolo Record 12 Mechanical',
        attributes: {
            brand: 'Campagnolo',
            electronic: false,
            weight_g: 345,
        },
        interfaces: {
            speeds: 12,
            actuation: 'Cable',
            bar_type: 'Drop',
            pull_ratio: 'Campagnolo',
        },
    },
];

// ============================================
// CASSETTES
// ============================================
const CASSETTES = [
    // Shimano
    {
        id: 'shimano-xt-m8100-10-51',
        name: 'Shimano Deore XT CS-M8100 10-51t',
        attributes: {
            brand: 'Shimano',
            range: '10-51',
            smallest_cog: 10,
            largest_cog: 51,
            diff: 41,
            weight_g: 417,
        },
        interfaces: {
            speeds: 12,
            freehub_mount: 'Shimano Micro Spline',
        },
    },
    {
        id: 'shimano-grx-rx810-11-42',
        name: 'Shimano GRX CS-RX810 11-42t (11s)',
        attributes: {
            brand: 'Shimano',
            range: '11-42',
            smallest_cog: 11,
            largest_cog: 42,
            diff: 31,
            weight_g: 375,
        },
        interfaces: {
            speeds: 11,
            freehub_mount: 'Shimano HG',
        },
    },
    // SRAM
    {
        id: 'sram-rival-xg-1270',
        name: 'SRAM Rival AXS XG-1270 10-36t',
        attributes: {
            brand: 'SRAM',
            range: '10-36',
            smallest_cog: 10,
            largest_cog: 36,
            diff: 26,
            weight_g: 290,
        },
        interfaces: {
            speeds: 12,
            freehub_mount: 'SRAM XDR',
        },
    },
];

// ============================================
// CHAINS
// ============================================
const CHAINS = [
    // Wippermann
    {
        id: 'wippermann-connex-11sx',
        name: 'Wippermann Connex 11sX',
        attributes: {
            brand: 'Wippermann',
            weight_g: 247,
        },
        interfaces: {
            speeds: 11,
        },
    },
    {
        id: 'wippermann-connex-12sx',
        name: 'Wippermann Connex 12sX',
        attributes: {
            brand: 'Wippermann',
            weight_g: 252,
        },
        interfaces: {
            speeds: 12,
        },
    },
    // YBN
    {
        id: 'ybn-sla-h12',
        name: 'YBN SLA H12 12-Speed',
        attributes: {
            brand: 'YBN',
            weight_g: 248,
        },
        interfaces: {
            speeds: 12,
        },
    },
    {
        id: 'ybn-sla-11',
        name: 'YBN SLA 11 11-Speed',
        attributes: {
            brand: 'YBN',
            weight_g: 243,
        },
        interfaces: {
            speeds: 11,
        },
    },
];

// ============================================
// WHEELS
// ============================================
const WHEELS = [
    // Boyd
    {
        id: 'boyd-altamont-gravel',
        name: 'Boyd Altamont Disc Gravel 700c',
        attributes: {
            brand: 'Boyd',
            size: '700c',
            internal_width: 25,
            weight_g: 1450,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XDR'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    {
        id: 'boyd-jocassee-road',
        name: 'Boyd Jocassee Carbon Road 700c',
        attributes: {
            brand: 'Boyd',
            size: '700c',
            internal_width: 21,
            depth: 36,
            weight_g: 1380,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XDR'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    // Easton
    {
        id: 'easton-ea90-ax',
        name: 'Easton EA90 AX Disc 700c',
        attributes: {
            brand: 'Easton',
            size: '700c',
            internal_width: 24,
            weight_g: 1580,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XDR'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    {
        id: 'easton-ec90-aero',
        name: 'Easton EC90 Aero 55 Carbon 700c',
        attributes: {
            brand: 'Easton',
            size: '700c',
            internal_width: 19,
            depth: 55,
            weight_g: 1480,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XDR'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    // Shimano
    {
        id: 'shimano-dura-ace-c50',
        name: 'Shimano Dura-Ace C50 700c',
        attributes: {
            brand: 'Shimano',
            size: '700c',
            internal_width: 21,
            depth: 50,
            weight_g: 1461,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    {
        id: 'shimano-ultegra-c36',
        name: 'Shimano Ultegra C36 700c',
        attributes: {
            brand: 'Shimano',
            size: '700c',
            internal_width: 21,
            depth: 36,
            weight_g: 1487,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
    {
        id: 'shimano-xtr-m9100',
        name: 'Shimano XTR M9100 29',
        attributes: {
            brand: 'Shimano',
            size: '29',
            internal_width: 29,
            weight_g: 1440,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano Micro Spline'],
            axle: 'Boost_148x12',
            brake: 'Disc',
        },
    },
    // SRAM
    {
        id: 'sram-roam-60',
        name: 'SRAM Roam 60 29',
        attributes: {
            brand: 'SRAM',
            size: '29',
            internal_width: 30,
            weight_g: 1850,
            tubeless: true,
        },
        interfaces: {
            freehub: ['SRAM XD'],
            axle: 'Boost_148x12',
            brake: 'Disc',
        },
    },
    {
        id: 'sram-rise-60',
        name: 'SRAM Rise 60 29',
        attributes: {
            brand: 'SRAM',
            size: '29',
            internal_width: 30,
            weight_g: 1650,
            tubeless: true,
        },
        interfaces: {
            freehub: ['SRAM XD'],
            axle: 'Boost_148x12',
            brake: 'Disc',
        },
    },
    // Spank
    {
        id: 'spank-oozy-trail-395',
        name: 'Spank Oozy Trail 395+ 29',
        attributes: {
            brand: 'Spank',
            size: '29',
            internal_width: 35,
            weight_g: 2050,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XD'],
            axle: 'Boost_148x12',
            brake: 'Disc',
        },
    },
    // We Are One
    {
        id: 'wao-union',
        name: 'We Are One Union 29',
        attributes: {
            brand: 'We Are One',
            size: '29',
            internal_width: 32,
            weight_g: 1680,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XD', 'Shimano Micro Spline'],
            axle: 'Boost_148x12',
            brake: 'Disc',
        },
    },
    {
        id: 'wao-convergence',
        name: 'We Are One Convergence 700c',
        attributes: {
            brand: 'We Are One',
            size: '700c',
            internal_width: 24,
            weight_g: 1450,
            tubeless: true,
        },
        interfaces: {
            freehub: ['Shimano HG', 'SRAM XDR'],
            axle: '142x12',
            brake: 'Disc',
        },
    },
];

// ============================================
// TIRES
// ============================================
const TIRES = [
    // Donnelly
    {
        id: 'donnelly-xplor-mso-40',
        name: "Donnelly X'Plor MSO 700x40c",
        attributes: {
            brand: 'Donnelly',
            width: 40,
            weight_g: 420,
        },
        interfaces: {
            size: '700c',
            width: 40,
            tubeless: true,
        },
    },
    {
        id: 'donnelly-emp-50',
        name: 'Donnelly EMP 700x50c',
        attributes: {
            brand: 'Donnelly',
            width: 50,
            weight_g: 540,
        },
        interfaces: {
            size: '700c',
            width: 50,
            tubeless: true,
        },
    },
    // Hutchinson
    {
        id: 'hutchinson-overide-38',
        name: 'Hutchinson Overide 700x38c',
        attributes: {
            brand: 'Hutchinson',
            width: 38,
            weight_g: 380,
        },
        interfaces: {
            size: '700c',
            width: 38,
            tubeless: true,
        },
    },
    {
        id: 'hutchinson-touareg-45',
        name: 'Hutchinson Touareg 700x45c',
        attributes: {
            brand: 'Hutchinson',
            width: 45,
            weight_g: 460,
        },
        interfaces: {
            size: '700c',
            width: 45,
            tubeless: true,
        },
    },
    // Kenda
    {
        id: 'kenda-booster-pro-29',
        name: 'Kenda Booster Pro 29x2.4',
        attributes: {
            brand: 'Kenda',
            width: 61,
            weight_g: 890,
        },
        interfaces: {
            size: '29',
            width: 61,
            tubeless: true,
        },
    },
];

// ============================================
// HANDLEBARS
// ============================================
const HANDLEBARS = [
    // Ritchey
    {
        id: 'ritchey-wcs-beacon',
        name: 'Ritchey WCS Beacon Gravel',
        attributes: {
            brand: 'Ritchey',
            width: 44,
            drop: 125,
            reach: 75,
            weight_g: 245,
            material: 'Carbon',
        },
        interfaces: {
            clamp: 31.8,
            bar_type: 'Drop',
        },
    },
    {
        id: 'ritchey-comp-evo-curve',
        name: 'Ritchey Comp Evo Curve Road',
        attributes: {
            brand: 'Ritchey',
            width: 42,
            drop: 130,
            reach: 73,
            weight_g: 285,
            material: 'Aluminum',
        },
        interfaces: {
            clamp: 31.8,
            bar_type: 'Drop',
        },
    },
    // Controltech
    {
        id: 'controltech-gravel-carbon',
        name: 'Controltech Gravel Carbon',
        attributes: {
            brand: 'Controltech',
            width: 44,
            drop: 115,
            reach: 70,
            weight_g: 230,
            material: 'Carbon',
        },
        interfaces: {
            clamp: 31.8,
            bar_type: 'Drop',
        },
    },
    // Deda
    {
        id: 'deda-superzero-road',
        name: 'Deda Elementi Superzero Road',
        attributes: {
            brand: 'Deda',
            width: 42,
            drop: 135,
            reach: 80,
            weight_g: 195,
            material: 'Carbon',
        },
        interfaces: {
            clamp: 31.7,
            bar_type: 'Drop',
        },
    },
    {
        id: 'deda-gravel-carbon',
        name: 'Deda Elementi Gravel Carbon',
        attributes: {
            brand: 'Deda',
            width: 44,
            drop: 120,
            reach: 75,
            weight_g: 235,
            material: 'Carbon',
        },
        interfaces: {
            clamp: 31.7,
            bar_type: 'Drop',
        },
    },
];

// ============================================
// STEMS
// ============================================
const STEMS = [
    // Controltech
    {
        id: 'controltech-one-pro',
        name: 'Controltech One Pro',
        attributes: {
            brand: 'Controltech',
            length: 100,
            angle: -6,
            weight_g: 135,
            material: 'Aluminum',
        },
        interfaces: {
            clamp: 31.8,
            steerer: '1-1/8',
        },
    },
    // Deda
    {
        id: 'deda-zero100-road',
        name: 'Deda Elementi Zero100 Road',
        attributes: {
            brand: 'Deda',
            length: 110,
            angle: -8,
            weight_g: 125,
            material: 'Aluminum',
        },
        interfaces: {
            clamp: 31.7,
            steerer: '1-1/8',
        },
    },
];

// ============================================
// MAIN FUNCTION
// ============================================
async function main() {
    console.log('Adding missing parts to database...\n');

    // Add Frames
    console.log('--- FRAMES ---');
    for (const frame of FRAMES) {
        await upsertComponent('Frame', frame);
    }

    // Add Cranksets
    console.log('\n--- CRANKSETS ---');
    for (const crankset of CRANKSETS) {
        await upsertComponent('Crankset', crankset);
    }

    // Add Bottom Brackets
    console.log('\n--- BOTTOM BRACKETS ---');
    for (const bb of BOTTOM_BRACKETS) {
        await upsertComponent('BottomBracket', bb);
    }

    // Add Rear Derailleurs
    console.log('\n--- REAR DERAILLEURS ---');
    for (const rd of REAR_DERAILLEURS) {
        await upsertComponent('RearDerailleur', rd);
    }

    // Add Shifters
    console.log('\n--- SHIFTERS ---');
    for (const shifter of SHIFTERS) {
        await upsertComponent('Shifter', shifter);
    }

    // Add Cassettes
    console.log('\n--- CASSETTES ---');
    for (const cassette of CASSETTES) {
        await upsertComponent('Cassette', cassette);
    }

    // Add Chains
    console.log('\n--- CHAINS ---');
    for (const chain of CHAINS) {
        await upsertComponent('Chain', chain);
    }

    // Add Wheels
    console.log('\n--- WHEELS ---');
    for (const wheel of WHEELS) {
        await upsertComponent('Wheel', wheel);
    }

    // Add Tires
    console.log('\n--- TIRES ---');
    for (const tire of TIRES) {
        await upsertComponent('Tire', tire);
    }

    // Add Handlebars
    console.log('\n--- HANDLEBARS ---');
    for (const handlebar of HANDLEBARS) {
        await upsertComponent('Handlebar', handlebar);
    }

    // Add Stems
    console.log('\n--- STEMS ---');
    for (const stem of STEMS) {
        await upsertComponent('Stem', stem);
    }

    // Summary
    const counts = {
        Frames: FRAMES.length,
        Cranksets: CRANKSETS.length,
        BottomBrackets: BOTTOM_BRACKETS.length,
        RearDerailleurs: REAR_DERAILLEURS.length,
        Shifters: SHIFTERS.length,
        Cassettes: CASSETTES.length,
        Chains: CHAINS.length,
        Wheels: WHEELS.length,
        Tires: TIRES.length,
        Handlebars: HANDLEBARS.length,
        Stems: STEMS.length,
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    console.log('\n========================================');
    console.log('SUMMARY');
    console.log('========================================');
    for (const [type, count] of Object.entries(counts)) {
        console.log(`${type}: ${count}`);
    }
    console.log(`TOTAL: ${total} components added/updated`);
    console.log('\nNOTE: New categories (Saddle, Pedals, Brake, PowerMeter) require schema updates.');
}

async function upsertComponent(
    type: string,
    component: { id: string; name: string; attributes: object; interfaces: object }
) {
    const data = {
        id: component.id,
        type,
        name: component.name,
        interfaces: JSON.stringify(component.interfaces),
        attributes: JSON.stringify(component.attributes),
    };

    const exists = await prisma.component.findUnique({ where: { id: component.id } });
    if (!exists) {
        await prisma.component.create({ data });
        console.log(`  Created: ${component.name}`);
    } else {
        await prisma.component.update({ where: { id: component.id }, data });
        console.log(`  Updated: ${component.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
