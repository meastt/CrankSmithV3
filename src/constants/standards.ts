
// FILE: src/constants/standards.ts

export enum FrameType {
    ROAD = 'ROAD',
    GRAVEL = 'GRAVEL',
    MTB = 'MTB',
}

export enum AxleStandard {
    // Front
    QR_100 = 'AXLE_F_QR_100',
    TA_12_100 = 'AXLE_F_12_100',
    TA_15_100 = 'AXLE_F_15_100',
    TA_15_110 = 'AXLE_F_15_110', // Boost
    TA_20_110 = 'AXLE_F_20_110', // DH

    // Rear
    QR_135 = 'AXLE_R_QR_135',
    TA_12_142 = 'AXLE_R_12_142',
    TA_12_148 = 'AXLE_R_12_148', // Boost
    TA_12_157 = 'AXLE_R_12_157', // Super Boost
}

export enum HeadTubeStandard {
    EC34 = 'HT_EC34',        // 1-1/8" External
    ZS44 = 'HT_ZS44',        // 44mm Zero Stack
    IS42_IS52 = 'HT_IS42_IS52', // Integrated Tapered
    IS41_IS52 = 'HT_IS41_IS52', // Integrated Tapered (some Cannondale/Specialized)
    ZS44_ZS56 = 'HT_ZS44_ZS56', // Tapered Zero Stack
}

export enum BBShellStandard {
    BSA_68 = 'BB_BSA_68',          // English Threaded Road
    BSA_73 = 'BB_BSA_73',          // English Threaded MTB
    PF30_68 = 'BB_PF30_68',        // PressFit 30 Road
    PF30_73 = 'BB_PF30_73',        // PressFit 30 MTB
    BB86 = 'BB_BB86',              // PressFit 86.5mm (Shimano Road)
    BB92 = 'BB_BB92',              // PressFit 92mm (Shimano MTB)
    T47_INT_68 = 'BB_T47_INT_68',  // T47 Internal Road
    T47_INT_73 = 'BB_T47_INT_73',  // T47 Internal MTB
    T47_EXT_68 = 'BB_T47_EXT_68',  // T47 External Road
    BB30_68 = 'BB_BB30_68',        // BB30 Road
}

export enum BrakeMountStandard {
    RIM_CALIPER = 'MNT_BRK_RIM',
    DISC_IS = 'MNT_BRK_IS',        // IS 51mm
    DISC_POST = 'MNT_BRK_POST',    // Post Mount
    DISC_FLAT = 'MNT_BRK_FLAT',    // Flat Mount
}

export enum FreehubStandard {
    HG_11 = 'FH_HG_11',            // Shimano HG 11s Road
    HG_MTB = 'FH_HG_MTB',          // Shimano HG 8/9/10/11 MTB
    XD = 'FH_XD',                  // SRAM XD (MTB)
    XDR = 'FH_XDR',                // SRAM XDR (Road)
    MICROSPLINE = 'FH_MS',         // Shimano MicroSpline
    N3W = 'FH_N3W',                // Campagnolo N3W
}

export enum PullRatioID {
    // Mechanical
    SHIMANO_ROAD_11 = 'PR_SHI_R11',
    SHIMANO_MTB_11 = 'PR_SHI_M11', // DynaSys
    SHIMANO_ROAD_12 = 'PR_SHI_R12', // 12s Mech (rare/new)
    SRAM_EXACT = 'PR_SRAM_EXACT',  // 11s Road
    SRAM_X_ACTUATION = 'PR_SRAM_X', // 11/12s MTB
    CAMPY_12 = 'PR_CAMPY_12',

    // Electronic (Protocols)
    SRAM_AXS = 'PR_SRAM_AXS',
    SHIMANO_DI2_11 = 'PR_SHI_DI2_11',
    SHIMANO_DI2_12 = 'PR_SHI_DI2_12',
}

export enum FluidType {
    MINERAL = 'FLD_MINERAL',
    DOT = 'FLD_DOT',
    CABLE = 'FLD_CABLE', // For mechanical brakes
}

export enum SteererStandard {
    STRAIGHT_1_1_8 = 'ST_1_1_8',
    TAPERED_1_1_8_1_5 = 'ST_TAPERED',
    OVERDRIVE_2 = 'ST_OD2', // Giant 1-1/4 to 1-1/2
}

export enum CrankSpindleStandard {
    SHIMANO_24 = 'SP_24MM',
    SRAM_DUB = 'SP_DUB',    // 28.99mm
    BB30 = 'SP_30MM',       // 30mm
    GXP = 'SP_GXP',         // 24/22mm
}

export enum SaddleRailStandard {
    STEEL_7MM = 'RAIL_7MM',
    CARBON_7X9 = 'RAIL_7X9_OVAL'
}

export enum PedalSystem {
    SPD = 'PED_SPD',
    SPD_SL = 'PED_SPD_SL',
    LOOK_KEO = 'PED_KEO',
    SPEEDPLAY = 'PED_SPEEDPLAY',
    TIME_ATAC = 'PED_TIME',
    CRANKBROTHERS = 'PED_CB'
}

export enum PowerMeterLocation {
    CRANK_ARM = 'PM_CRANK_ARM',
    SPIDER = 'PM_SPIDER',
    PEDAL = 'PM_PEDAL',
    HUB = 'PM_HUB'
}
