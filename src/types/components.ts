
// FILE: src/types/components.ts

import {
    FrameType,
    AxleStandard,
    HeadTubeStandard,
    BBShellStandard,
    BrakeMountStandard,
    FreehubStandard,
    PullRatioID,
    FluidType,
    SteererStandard,
    CrankSpindleStandard
} from '../constants/standards';

export interface BaseComponent {
    id: string;
    brand: string;
    model: string;
    weightGrams: number;
    price: number;
    image: string;
    // Database fields (JSON parsed)
    name?: string;
    attributes?: Record<string, any>;
    interfaces?: Record<string, any>;
}

// --- FRAMES & FORKS ---

export interface Frame extends BaseComponent {
    type: FrameType;
    wheelSize: '700c' | '650b' | '29';
    maxTireWidthMM: number;
    rearAxle: AxleStandard;
    bbShell: BBShellStandard;
    brakeMount: BrakeMountStandard;
    headTube: HeadTubeStandard;
    seatpostDia: number; // e.g., 27.2, 31.6
    designedForkLength: number; // Axle-to-Crown in mm
    udh: boolean;
}

export interface Fork extends BaseComponent {
    wheelSize: '700c' | '650b' | '29';
    axle: AxleStandard;
    steerer: SteererStandard;
    axleToCrown: number; // mm
    brakeMount: BrakeMountStandard;
    maxTireWidthMM: number;
    maxRotorSize: number; // mm
}

// --- WHEELS & TIRES ---

export interface Wheel extends BaseComponent {
    position: 'FRONT' | 'REAR' | 'SET';
    diameter: '700c' | '650b' | '29';
    axle: AxleStandard;
    internalWidth: number; // mm
    brakeInterface: 'DISC_CENTERLOCK' | 'DISC_6BOLT' | 'RIM';
    freehub?: FreehubStandard; // Only for Rear
}

export interface Tire extends BaseComponent {
    diameter: '700c' | '650b' | '29';
    widthMM: number;
    tubeless: boolean;
}

// --- DRIVETRAIN ---

export interface BottomBracket extends BaseComponent {
    shell: BBShellStandard;
    spindleInterface: CrankSpindleStandard;
}

export interface Crankset extends BaseComponent {
    spindle: CrankSpindleStandard;
    speeds: number; // 11, 12
    chainrings: number[]; // [50, 34] or [40]
    chainline: number; // mm
    powerMeter: boolean;
}

export interface Cassette extends BaseComponent {
    speeds: number;
    range: [number, number]; // [11, 34]
    freehubType: FreehubStandard;
}

export interface RearDerailleur extends BaseComponent {
    speeds: number;
    pullRatio: PullRatioID;
    maxCog: number; // Max tooth count (e.g., 34t)
    capacity: number; // Total capacity
    isElectronic: boolean;
    mountType: 'STD' | 'DIRECT' | 'UDH'; // UDH specific (Transmission)
}

export interface Shifter extends BaseComponent {
    speeds: number;
    pullRatio: PullRatioID;
    isElectronic: boolean;
    position: 'LEFT' | 'RIGHT' | 'PAIR';
    brakeFluid?: FluidType; // If hydraulic lever
}

export interface Chain extends BaseComponent {
    speeds: number;
}

// --- BRAKES ---

export interface BrakeCaliper extends BaseComponent {
    position: 'FRONT' | 'REAR' | 'PAIR';
    mount: BrakeMountStandard;
    fluid: FluidType;
}

export interface BrakeRotor extends BaseComponent {
    size: number; // 140, 160, 180
    mount: 'CENTERLOCK' | '6BOLT';
}

// --- COCKPIT ---

export interface Stem extends BaseComponent {
    clampDia: number; // 31.8
    steererClamp: number; // 28.6 (1-1/8)
    length: number;
    angle: number;
}

export interface Handlebar extends BaseComponent {
    width: number;
    clampDia: number; // 31.8
    type: 'DROP' | 'FLAT' | 'RISER';
}

export interface Seatpost extends BaseComponent {
    diameter: number; // 27.2
    setback: number;
}

// --- SADDLE & PEDALS ---

export interface Saddle extends BaseComponent {
    width: number;              // 130, 143, 155mm
    length: number;             // mm
    railMaterial: 'STEEL' | 'CHROMOLY' | 'TITANIUM' | 'CARBON' | 'HOLLOW_CARBON';
    railDiameter: string;       // '7mm' or '7x9mm'
    shape: 'FLAT' | 'CURVED' | 'WAVE';
    padding: 'MINIMAL' | 'MODERATE' | 'PLUSH';
    cutout: boolean;
}

export interface Pedal extends BaseComponent {
    system: 'ROAD' | 'MTB';
    platform: 'SPD' | 'SPD_SL' | 'LOOK_KEO' | 'TIME_ATAC' | 'SPEEDPLAY' | 'CRANKBROTHERS';
    spindle: 'STEEL' | 'CHROMOLY' | 'TITANIUM';
    bearingType: 'SEALED' | 'CARTRIDGE' | 'BUSHING';
    stackHeight: number;        // mm from axle to cleat
    qFactor: number;            // mm lateral stance width
    float: number;              // degrees
    tensionAdjustable: boolean;
}

// --- POWER METER ---

export interface PowerMeter extends BaseComponent {
    location: 'CRANK_ARM' | 'SPIDER' | 'CHAINRING' | 'PEDAL' | 'HUB' | 'BOTTOM_BRACKET';
    measurement: 'LEFT_ONLY' | 'DUAL_SIDED' | 'SINGLE_SIDED_DOUBLED';
    accuracy: number;           // +/- percentage (1.0, 1.5, 2.0)
    battery: 'CR2032' | 'AAA' | 'RECHARGEABLE' | 'COIN_CELL';
    batteryLife: number;        // hours
    connectivity: string[];     // ['ANT_PLUS', 'BLUETOOTH']
    metrics: string[];          // ['POWER', 'CADENCE', 'BALANCE']
    compatibleCranks?: string[];
    waterproofRating: string;   // 'IPX7', etc.
}
