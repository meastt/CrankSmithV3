
// FILE: src/data/mockDb.ts

import {
    Frame, Fork, Wheel, Tire, BottomBracket, Crankset,
    Cassette, RearDerailleur, Shifter, BrakeCaliper,
    BrakeRotor, Stem, Handlebar, Seatpost
} from '../types/components';

import {
    FrameType, AxleStandard, HeadTubeStandard, BBShellStandard,
    BrakeMountStandard, FreehubStandard, PullRatioID, FluidType,
    SteererStandard, CrankSpindleStandard
} from '../constants/standards';

// --- MOCK FRAMES ---

export const MOCK_FRAMES: Frame[] = [
    {
        id: 'frame_road_1',
        brand: 'Specialized',
        model: 'Tarmac SL8',
        type: FrameType.ROAD,
        wheelSize: '700c',
        maxTireWidthMM: 32,
        rearAxle: AxleStandard.TA_12_142,
        bbShell: BBShellStandard.BSA_68,
        brakeMount: BrakeMountStandard.DISC_FLAT,
        headTube: HeadTubeStandard.IS42_IS52,
        seatpostDia: 27.2,
        designedForkLength: 370,
        udh: false,
        weightGrams: 800,
        price: 3500,
        image: 'tarmac.jpg'
    },
    {
        id: 'frame_gravel_1',
        brand: 'Cervelo',
        model: 'Aspero',
        type: FrameType.GRAVEL,
        wheelSize: '700c',
        maxTireWidthMM: 45,
        rearAxle: AxleStandard.TA_12_142,
        bbShell: BBShellStandard.BB30_68, // Requires adapter usually
        brakeMount: BrakeMountStandard.DISC_FLAT,
        headTube: HeadTubeStandard.IS42_IS52,
        seatpostDia: 27.2,
        designedForkLength: 390,
        udh: true,
        weightGrams: 1100,
        price: 2500,
        image: 'aspero.jpg'
    },
    {
        id: 'frame_mtb_1',
        brand: 'Santa Cruz',
        model: 'Hightower',
        type: FrameType.MTB,
        wheelSize: '29',
        maxTireWidthMM: 64, // 2.5"
        rearAxle: AxleStandard.TA_12_148, // Boost
        bbShell: BBShellStandard.BSA_73,
        brakeMount: BrakeMountStandard.DISC_POST,
        headTube: HeadTubeStandard.ZS44_ZS56,
        seatpostDia: 31.6,
        designedForkLength: 550, // 150mm travel
        udh: true,
        weightGrams: 2800,
        price: 3500,
        image: 'hightower.jpg'
    }
];

// --- MOCK FORKS ---

export const MOCK_FORKS: Fork[] = [
    {
        id: 'fork_road_1',
        brand: 'Specialized',
        model: 'Tarmac Fork',
        wheelSize: '700c',
        axle: AxleStandard.TA_12_100,
        steerer: SteererStandard.TAPERED_1_1_8_1_5,
        axleToCrown: 370,
        brakeMount: BrakeMountStandard.DISC_FLAT,
        maxTireWidthMM: 32,
        maxRotorSize: 160,
        weightGrams: 350,
        price: 500,
        image: 'fork_road.jpg'
    },
    {
        id: 'fork_mtb_1',
        brand: 'Fox',
        model: '36 Factory',
        wheelSize: '29',
        axle: AxleStandard.TA_15_110, // Boost
        steerer: SteererStandard.TAPERED_1_1_8_1_5,
        axleToCrown: 550,
        brakeMount: BrakeMountStandard.DISC_POST,
        maxTireWidthMM: 66,
        maxRotorSize: 203,
        weightGrams: 2000,
        price: 1100,
        image: 'fox36.jpg'
    }
];

// --- MOCK DRIVETRAIN ---

export const MOCK_SHIFTERS: Shifter[] = [
    {
        id: 'shifter_axs_road',
        brand: 'SRAM',
        model: 'Red AXS',
        speeds: 12,
        pullRatio: PullRatioID.SRAM_AXS,
        isElectronic: true,
        position: 'PAIR',
        brakeFluid: FluidType.DOT,
        weightGrams: 300,
        price: 800,
        image: 'red_axs.jpg'
    },
    {
        id: 'shifter_shimano_mech',
        brand: 'Shimano',
        model: 'Ultegra R8000',
        speeds: 11,
        pullRatio: PullRatioID.SHIMANO_ROAD_11,
        isElectronic: false,
        position: 'PAIR',
        brakeFluid: FluidType.MINERAL,
        weightGrams: 400,
        price: 300,
        image: 'ultegra.jpg'
    }
];

export const MOCK_RDS: RearDerailleur[] = [
    {
        id: 'rd_axs_road',
        brand: 'SRAM',
        model: 'Red AXS',
        speeds: 12,
        pullRatio: PullRatioID.SRAM_AXS,
        maxCog: 33,
        capacity: 37,
        isElectronic: true,
        mountType: 'STD',
        weightGrams: 250,
        price: 700,
        image: 'rd_red.jpg'
    },
    {
        id: 'rd_axs_mtb',
        brand: 'SRAM',
        model: 'XX1 Eagle AXS',
        speeds: 12,
        pullRatio: PullRatioID.SRAM_AXS,
        maxCog: 52,
        capacity: 42, // 1x specific
        isElectronic: true,
        mountType: 'STD',
        weightGrams: 280,
        price: 750,
        image: 'rd_xx1.jpg'
    },
    {
        id: 'rd_shimano_mech',
        brand: 'Shimano',
        model: 'Ultegra R8000 GS',
        speeds: 11,
        pullRatio: PullRatioID.SHIMANO_ROAD_11,
        maxCog: 34,
        capacity: 39,
        isElectronic: false,
        mountType: 'STD',
        weightGrams: 200,
        price: 100,
        image: 'rd_ultegra.jpg'
    }
];

// --- MOCK WHEELS ---

export const MOCK_WHEELS: Wheel[] = [
    {
        id: 'wheel_road_f',
        brand: 'Roval',
        model: 'Rapide CLX II Front',
        position: 'FRONT',
        diameter: '700c',
        axle: AxleStandard.TA_12_100,
        internalWidth: 21,
        brakeInterface: 'DISC_CENTERLOCK',
        weightGrams: 690,
        price: 1200,
        image: 'roval_f.jpg'
    },
    {
        id: 'wheel_road_r',
        brand: 'Roval',
        model: 'Rapide CLX II Rear',
        position: 'REAR',
        diameter: '700c',
        axle: AxleStandard.TA_12_142,
        internalWidth: 21,
        brakeInterface: 'DISC_CENTERLOCK',
        freehub: FreehubStandard.HG_11,
        weightGrams: 830,
        price: 1600,
        image: 'roval_r.jpg'
    },
    {
        id: 'wheel_mtb_f',
        brand: 'Santa Cruz',
        model: 'Reserve 30 Front',
        position: 'FRONT',
        diameter: '29',
        axle: AxleStandard.TA_15_110,
        internalWidth: 30,
        brakeInterface: 'DISC_6BOLT',
        weightGrams: 850,
        price: 800,
        image: 'reserve_f.jpg'
    },
    {
        id: 'wheel_mtb_r',
        brand: 'Santa Cruz',
        model: 'Reserve 30 Rear',
        position: 'REAR',
        diameter: '29',
        axle: AxleStandard.TA_12_148,
        internalWidth: 30,
        brakeInterface: 'DISC_6BOLT',
        freehub: FreehubStandard.XD,
        weightGrams: 950,
        price: 1000,
        image: 'reserve_r.jpg'
    }
];

// --- MOCK TIRES ---

export const MOCK_TIRES: Tire[] = [
    {
        id: 'tire_road_28',
        brand: 'Continental',
        model: 'GP5000 S TR',
        diameter: '700c',
        widthMM: 28,
        tubeless: true,
        weightGrams: 280,
        price: 80,
        image: 'gp5000.jpg'
    },
    {
        id: 'tire_mtb_25',
        brand: 'Maxxis',
        model: 'Minion DHF',
        diameter: '29',
        widthMM: 63, // 2.5"
        tubeless: true,
        weightGrams: 1000,
        price: 90,
        image: 'minion.jpg'
    }
];

// --- MOCK BBs ---

export const MOCK_BBS: BottomBracket[] = [
    {
        id: 'bb_bsa_dub',
        brand: 'SRAM',
        model: 'DUB BSA',
        shell: BBShellStandard.BSA_68, // Also fits 73 with spacers usually, but strict for now
        spindleInterface: CrankSpindleStandard.SRAM_DUB,
        weightGrams: 76,
        price: 40,
        image: 'dub_bsa.jpg'
    },
    {
        id: 'bb_bsa_dub_mtb',
        brand: 'SRAM',
        model: 'DUB BSA MTB',
        shell: BBShellStandard.BSA_73,
        spindleInterface: CrankSpindleStandard.SRAM_DUB,
        weightGrams: 76,
        price: 40,
        image: 'dub_bsa.jpg'
    },
    {
        id: 'bb_bsa_shimano',
        brand: 'Shimano',
        model: 'Dura-Ace BB-R9100',
        shell: BBShellStandard.BSA_68,
        spindleInterface: CrankSpindleStandard.SHIMANO_24,
        weightGrams: 65,
        price: 45,
        image: 'bb_r9100.jpg'
    }
];

// --- MOCK CRANKS ---

export const MOCK_CRANKS: Crankset[] = [
    {
        id: 'crank_red_axs',
        brand: 'SRAM',
        model: 'Red AXS Power Meter',
        spindle: CrankSpindleStandard.SRAM_DUB,
        speeds: 12,
        chainrings: [48, 35],
        chainline: 45,
        powerMeter: true,
        weightGrams: 580,
        price: 1200,
        image: 'crank_red.jpg'
    },
    {
        id: 'crank_xx1',
        brand: 'SRAM',
        model: 'XX1 Eagle',
        spindle: CrankSpindleStandard.SRAM_DUB,
        speeds: 12,
        chainrings: [32],
        chainline: 52, // Boost
        powerMeter: false,
        weightGrams: 450,
        price: 500,
        image: 'crank_xx1.jpg'
    },
    {
        id: 'crank_ultegra',
        brand: 'Shimano',
        model: 'Ultegra R8000',
        spindle: CrankSpindleStandard.SHIMANO_24,
        speeds: 11,
        chainrings: [50, 34],
        chainline: 43.5,
        powerMeter: false,
        weightGrams: 674,
        price: 300,
        image: 'crank_ultegra.jpg'
    }
];

// --- MOCK CASSETTES ---

export const MOCK_CASSETTES: Cassette[] = [
    {
        id: 'cassette_red_10_33',
        brand: 'SRAM',
        model: 'Red XG-1290',
        speeds: 12,
        range: [10, 33],
        freehubType: FreehubStandard.XDR,
        weightGrams: 210,
        price: 350,
        image: 'cassette_red.jpg'
    },
    {
        id: 'cassette_eagle_10_52',
        brand: 'SRAM',
        model: 'XX1 Eagle XG-1299',
        speeds: 12,
        range: [10, 52],
        freehubType: FreehubStandard.XD,
        weightGrams: 360,
        price: 450,
        image: 'cassette_xx1.jpg'
    },
    {
        id: 'cassette_ultegra_11_30',
        brand: 'Shimano',
        model: 'Ultegra R8000',
        speeds: 11,
        range: [11, 30],
        freehubType: FreehubStandard.HG_11,
        weightGrams: 269,
        price: 90,
        image: 'cassette_ultegra.jpg'
    }
];

// --- MOCK BRAKES ---

export const MOCK_CALIPERS: BrakeCaliper[] = [
    {
        id: 'caliper_red',
        brand: 'SRAM',
        model: 'Red AXS',
        position: 'PAIR',
        mount: BrakeMountStandard.DISC_FLAT,
        fluid: FluidType.DOT,
        weightGrams: 200,
        price: 300,
        image: 'caliper_red.jpg'
    },
    {
        id: 'caliper_xt',
        brand: 'Shimano',
        model: 'XT M8100',
        position: 'PAIR',
        mount: BrakeMountStandard.DISC_POST,
        fluid: FluidType.MINERAL,
        weightGrams: 250,
        price: 150,
        image: 'caliper_xt.jpg'
    }
];

export const MOCK_ROTORS: BrakeRotor[] = [
    {
        id: 'rotor_cl_160',
        brand: 'SRAM',
        model: 'Centerline XR',
        size: 160,
        mount: 'CENTERLOCK',
        weightGrams: 120,
        price: 80,
        image: 'rotor_cl.jpg'
    },
    {
        id: 'rotor_6b_180',
        brand: 'SRAM',
        model: 'Centerline',
        size: 180,
        mount: '6BOLT',
        weightGrams: 140,
        price: 50,
        image: 'rotor_6b.jpg'
    }
];

// --- MOCK COCKPIT ---

export const MOCK_STEMS: Stem[] = [
    {
        id: 'stem_road',
        brand: 'Specialized',
        model: 'S-Works Tarmac Stem',
        clampDia: 31.8,
        steererClamp: 28.6,
        length: 100,
        angle: 6,
        weightGrams: 130,
        price: 150,
        image: 'stem.jpg'
    },
    {
        id: 'stem_mtb',
        brand: 'RaceFace',
        model: 'Turbine R',
        clampDia: 35,
        steererClamp: 28.6,
        length: 50,
        angle: 0,
        weightGrams: 150,
        price: 100,
        image: 'stem_mtb.jpg'
    }
];

export const MOCK_BARS: Handlebar[] = [
    {
        id: 'bar_road',
        brand: 'Specialized',
        model: 'S-Works Carbon Hover',
        width: 420,
        clampDia: 31.8,
        type: 'DROP',
        weightGrams: 200,
        price: 300,
        image: 'bar_road.jpg'
    },
    {
        id: 'bar_mtb',
        brand: 'Santa Cruz',
        model: 'Carbon Riser',
        width: 800,
        clampDia: 35,
        type: 'RISER',
        weightGrams: 235,
        price: 170,
        image: 'bar_mtb.jpg'
    }
];

export const MOCK_SEATPOSTS: Seatpost[] = [
    {
        id: 'post_272',
        brand: 'Specialized',
        model: 'Alpinist',
        diameter: 27.2,
        setback: 20,
        weightGrams: 136,
        price: 250,
        image: 'post.jpg'
    },
    {
        id: 'post_316',
        brand: 'Fox',
        model: 'Transfer Dropper',
        diameter: 31.6,
        setback: 0,
        weightGrams: 600,
        price: 350,
        image: 'dropper.jpg'
    }
];
