export interface ComponentSpecs {
    // Frame
    max_tire_width?: string; // "45mm"
    rear_axle?: string; // "12x142"
    bb_shell?: string; // "BSA"
    headset?: string; // "IS42/IS52"
    brake_mount?: string; // "Flat Mount"
    seatpost_diameter?: string; // "27.2mm"
    fd_mount?: string; // "Braze-on"
    rd_hanger?: string; // "UDH"
    cable_routing?: string; // "Internal"
    max_chainring?: string; // "50/34T"

    // Frameset Fork Info (for Road/Gravel framesets that include a fork)
    includes_fork?: boolean; // true if frameset includes factory fork
    factory_fork_weight?: number; // Weight of factory fork in grams
    factory_fork_name?: string; // Name of factory fork for display (e.g., "FACT Carbon Fork")
    category?: string; // "Road", "Gravel", "MTB"

    // Fork
    steerer_tube?: string; // "1 1/8 - 1 1/2"
    front_axle?: string; // "12x100"
    axle_to_crown?: string; // "395mm"
    offset?: string; // "44mm"

    // Wheelset
    diameter?: string; // "700c"
    freehub_body?: string; // "HG"
    internal_rim_width?: string; // "21mm"
    brake_interface?: string; // "Centerlock"
    position?: string; // "Front", "Rear", "Set"

    // Tires
    width?: string; // "28mm" (normalized)
    tubeless_ready?: boolean;
    hookless_compatible?: boolean;

    // Crankset
    spindle_type?: string; // "24mm"
    chainline?: string; // "Standard"
    chainrings?: number[];
    speeds?: number; // 12
    arm_length?: string; // "172.5mm"

    // Cassette
    range?: string; // "10-33T"
    largest_cog?: number; // 33

    // Rear Derailleur
    max_cog_capacity?: number; // 36
    total_capacity?: number;

    // Cassette
    cog_list?: number[]; // Raw cog array if available

    // Legacy/alternate field names
    speed?: number; // Legacy alias for speeds
    freehub_mount?: string; // Alternate name for freehub_body
    freehub_standard?: string; // Another alternate

    // Additional fields for normalization
    spindle_interface?: string; // "DUB" (BB side)
    wheelSize?: string; // UI helper "700c"
    wheel_size?: string; // Legacy UI helper
}

export interface CompatibilityTags {
    // Protocols
    protocol?: string[]; // ["Shimano_Road_Di2", "SRAM_AXS"]
    pull_ratio?: string[]; // ["Shimano_Road_11s"]

    // Mounts
    fd_mount?: string[]; // ["Braze-on"]
    brake_mount?: string[]; // ["Flat Mount"]

    // Interfaces
    shifter_brake_type?: string[]; // ["Hydraulic", "Mechanical"]
    chain_type?: string[]; // ["Flattop"]
}

export interface Component {
    id: string;
    type: string;
    name: string;
    brand?: string;
    model?: string;
    price: number;
    weightGrams: number;
    image: string;

    // The new structures
    specs: ComponentSpecs;
    compatibility_tags: CompatibilityTags;

    // Legacy support (to be phased out or mapped)
    interfaces?: any;
    attributes?: any;

    // Normalized fields for UI convenience
    wheelSize?: string;
    seatpostDia?: number;
    widthMM?: number;
    chainrings?: number[];
    range_array?: number[]; // [10, 33]
}

export interface ValidationIssue {
    componentId: string;
    severity: 'ERROR' | 'WARNING';
    message: string;
    conflictingComponentId?: string;
}

export interface CompatibilityResult {
    compatible: boolean;
    issues: ValidationIssue[];
}
