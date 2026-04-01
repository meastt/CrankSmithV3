
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
        id: 'frame_gravel_1',
        brand: 'Cervelo',
        model: 'Aspero',
        type: FrameType.GRAVEL,
        wheelSize: '700c',
        maxTireWidthMM: 45,
        rearAxle: AxleStandard.TA_12_142,
        bbShell: BBShellStandard.BB30_68,
        brakeMount: BrakeMountStandard.DISC_FLAT,
        headTube: HeadTubeStandard.IS42_IS52,
        seatpostDia: 27.2,
        designedForkLength: 390,
        udh: true,
        weightGrams: 1100,
        price: 2500,
        image: 'aspero.jpg'
    }
];

// --- MOCK FORKS ---

export const MOCK_FORKS: Fork[] = [];

// --- MOCK DRIVETRAIN ---

export const MOCK_SHIFTERS: Shifter[] = [
    {
        id: 'shifter_axs',
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
    }
];

export const MOCK_RDS: RearDerailleur[] = [
    {
        id: 'rd_axs',
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
    }
];

// --- MOCK WHEELS ---

export const MOCK_WHEELS: Wheel[] = [
    {
        id: 'wheel_gravel_f',
        brand: 'Roval',
        model: 'Terra CLX EVO Front',
        position: 'FRONT',
        diameter: '700c',
        axle: AxleStandard.TA_12_100,
        internalWidth: 25,
        brakeInterface: 'DISC_CENTERLOCK',
        weightGrams: 720,
        price: 1200,
        image: 'terra_f.jpg'
    },
    {
        id: 'wheel_gravel_r',
        brand: 'Roval',
        model: 'Terra CLX EVO Rear',
        position: 'REAR',
        diameter: '700c',
        axle: AxleStandard.TA_12_142,
        internalWidth: 25,
        brakeInterface: 'DISC_CENTERLOCK',
        freehub: FreehubStandard.XDR,
        weightGrams: 860,
        price: 1600,
        image: 'terra_r.jpg'
    }
];

// --- MOCK TIRES ---

export const MOCK_TIRES: Tire[] = [];

// --- MOCK BBs ---

export const MOCK_BBS: BottomBracket[] = [
    {
        id: 'bb_bsa_dub',
        brand: 'SRAM',
        model: 'DUB BSA',
        shell: BBShellStandard.BSA_68,
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
        id: 'cassette_hg_11_30',
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
        id: 'caliper_dura_ace',
        brand: 'Shimano',
        model: 'Dura-Ace BR-R9170',
        position: 'PAIR',
        mount: BrakeMountStandard.DISC_FLAT,
        fluid: FluidType.MINERAL,
        weightGrams: 256,
        price: 300,
        image: 'caliper_da.jpg'
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
        id: 'stem_gravel',
        brand: 'Enve',
        model: 'Enve Road Stem',
        clampDia: 31.8,
        steererClamp: 28.6,
        length: 100,
        angle: 6,
        weightGrams: 130,
        price: 150,
        image: 'stem.jpg'
    }
];

export const MOCK_BARS: Handlebar[] = [
    {
        id: 'bar_gravel',
        brand: 'Enve',
        model: 'Enve G Series Gravel Bar',
        width: 420,
        clampDia: 31.8,
        type: 'DROP',
        weightGrams: 200,
        price: 300,
        image: 'bar_gravel.jpg'
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
    }
];
