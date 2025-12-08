import { Component } from "@/lib/types/compatibility";

// Helper to create a standard component
const createStandard = (type: string, name: string, interfaces: Record<string, any>, attributes: Record<string, any> = {}): Component => ({
    id: `std-${type.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    type,
    name,
    interfaces,
    attributes,
    // Add defaults for required fields
    price: 0,
    weightGrams: 0,
    image: '',
    specs: {},
    compatibility_tags: {}
});

export const STANDARDS: Record<string, Component> = {
    // Frames (Bottom Bracket Shells)
    "frame-bsa": createStandard("Frame", "BSA Threaded Frame", { bottom_bracket_shell: "BSA_Threaded_68mm" }),
    "frame-t47": createStandard("Frame", "T47 Frame", { bottom_bracket_shell: "T47_Internal_86mm" }),
    "frame-pf30": createStandard("Frame", "PF30 Frame", { bottom_bracket_shell: "PF30_68mm" }),
    "frame-bb86": createStandard("Frame", "BB86 Frame", { bottom_bracket_shell: "BB86_PressFit" }),

    // Bottom Brackets
    "bb-bsa": createStandard("BottomBracket", "BSA Threaded BB", { frame_interface: "BSA_Threaded_68mm", crank_interface: "Shimano_Hollowtech_II" }),
    "bb-t47": createStandard("BottomBracket", "T47 BB", { frame_interface: "T47_Internal_86mm", crank_interface: "SRAM_DUB" }),
    "bb-pf30": createStandard("BottomBracket", "PF30 BB", { frame_interface: "PF30_68mm", crank_interface: "BB30_Spindle" }),

    // Frames (Rear Axles)
    "frame-qr": createStandard("Frame", "Quick Release Frame", { rear_axle: "QR_135mm" }),
    "frame-thru-142": createStandard("Frame", "Thru-Axle Frame (142)", { rear_axle: "TA_12x142mm" }),
    "frame-boost": createStandard("Frame", "Boost Frame (148)", { rear_axle: "TA_12x148mm" }),

    // Wheels
    "wheel-qr": createStandard("Wheel", "QR Wheel", { axle: "QR_135mm" }),
    "wheel-thru-142": createStandard("Wheel", "Thru-Axle Wheel (142)", { axle: "TA_12x142mm" }),
    "wheel-boost": createStandard("Wheel", "Boost Wheel (148)", { axle: "TA_12x148mm" }),
};

// Helper to map URL slugs to standard keys
// e.g. "bsa" -> "frame-bsa" or "bb-bsa" depending on context
export const resolveStandard = (slugPart: string, type: "Frame" | "BottomBracket" | "Wheel"): Component | null => {
    const key = `${type.toLowerCase()}-${slugPart}`;
    return STANDARDS[key] || null;
};
