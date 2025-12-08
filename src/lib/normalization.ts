
import { Component, ComponentSpecs, CompatibilityTags } from './types/compatibility';

export function normalizeComponent(c: any): Component {
    const interfaces = c.interfaces ? JSON.parse(c.interfaces as string) : {};
    const attributes = c.attributes ? JSON.parse(c.attributes as string) : {};

    // Unify source for easier access
    const raw = { ...attributes, ...interfaces };

    // Compatibility Tags (Protocols, Mounts)
    let protocol = raw.protocol ? (Array.isArray(raw.protocol) ? raw.protocol : [raw.protocol]) : [];

    // Protocol Normalization
    protocol = protocol.map((p: string) => {
        if (p === 'AXS') return 'SRAM_AXS';
        if (p === 'SRAM_AXS_(13s)') return 'SRAM_AXS_13s';
        return p;
    });

    // Protocol Inference (if missing)
    if (protocol.length === 0 && (c.type === 'RearDerailleur' || c.type === 'Shifter')) {
        const nameUpper = c.name.toUpperCase();
        const isElectronic = raw.electronic || nameUpper.includes('DI2') || nameUpper.includes('AXS') ||
                             nameUpper.includes('ETAP') || nameUpper.includes('WIRELESS') || nameUpper.includes('EPS');

        // Shimano
        if (nameUpper.includes('SHIMANO') || nameUpper.includes('ULTEGRA') ||
            nameUpper.includes('DURA-ACE') || nameUpper.includes('DURA ACE') ||
            nameUpper.includes('105') || nameUpper.includes('GRX') ||
            nameUpper.includes('TIAGRA') || nameUpper.includes('SORA') || nameUpper.includes('CLARIS') ||
            nameUpper.includes('DEORE') || nameUpper.includes('XT') || nameUpper.includes('XTR') ||
            nameUpper.includes('SLX') || nameUpper.includes('CUES')) {
            if (isElectronic) {
                protocol.push('Shimano_Di2');
            } else {
                const speeds = Number(raw.speeds);
                if (speeds === 12) protocol.push('Shimano_12s_Mech');
                else if (speeds === 11) protocol.push('Shimano_11s_Mech');
                else if (speeds === 10) protocol.push('Shimano_10s_Mech');
                else protocol.push('Shimano_Mech');
            }
        }
        // SRAM Road/Gravel
        else if (nameUpper.includes('RED') || nameUpper.includes('FORCE') ||
                 nameUpper.includes('RIVAL') || nameUpper.includes('APEX')) {
            if (isElectronic || nameUpper.includes('AXS')) {
                protocol.push('SRAM_AXS');
            } else {
                protocol.push('SRAM_Road_Mech');
            }
        }
        // SRAM MTB Eagle
        else if (nameUpper.includes('EAGLE') || nameUpper.includes('XX') ||
                 nameUpper.includes('X0') || nameUpper.includes('GX') ||
                 nameUpper.includes('NX') || nameUpper.includes('SX')) {
            if (isElectronic || nameUpper.includes('AXS') || nameUpper.includes('TRANSMISSION') || nameUpper.includes('T-TYPE')) {
                protocol.push('SRAM_AXS');
            } else {
                protocol.push('SRAM_Eagle_Mech');
            }
        }
        // Campagnolo
        else if (nameUpper.includes('CAMPAGNOLO') || nameUpper.includes('CAMPY') ||
                 nameUpper.includes('SUPER RECORD') || nameUpper.includes('RECORD') ||
                 nameUpper.includes('CHORUS') || nameUpper.includes('CENTAUR') ||
                 nameUpper.includes('POTENZA') || nameUpper.includes('EKAR')) {
            if (isElectronic || nameUpper.includes('WIRELESS') || nameUpper.includes('EPS')) {
                protocol.push('Campagnolo_Electronic');
            } else {
                protocol.push('Campagnolo_Mech');
            }
        }
        // L-Twoo
        else if (nameUpper.includes('L-TWOO') || nameUpper.includes('LTWOO')) {
            if (isElectronic || nameUpper.includes('WIRELESS')) {
                protocol.push('L-Twoo_Wireless');
            } else {
                protocol.push('L-Twoo_Mech');
            }
        }
        // Sensah
        else if (nameUpper.includes('SENSAH')) {
            protocol.push('Sensah_Mech');
        }
    }

    const compatibility_tags: CompatibilityTags = {
        protocol: protocol.length > 0 ? protocol : undefined,
        shifter_brake_type: raw.type ? [raw.type] : undefined, // "Drop Bar", "Flat Bar"
        brake_mount: raw.brake_mount ? [raw.brake_mount] : undefined,
        fd_mount: raw.fd_mount ? [raw.fd_mount] : undefined,
    };

    // STRICT SPEC NORMALIZATION
    const specs: ComponentSpecs = {};

    // Helpers
    const toStr = (v: any) => v ? String(v) : undefined;
    const toMM = (v: any) => v ? String(v).replace(/[^0-9.]/g, '') + 'mm' : undefined;
    const toWheelSize = (v: any) => {
        const s = String(v).toLowerCase();
        if (s.includes('700') || s.includes('29')) return '700c';
        if (s.includes('650') || s.includes('27.5')) return '650b';
        return s;
    };

    switch (c.type) {
        case 'Frame':
            specs.max_tire_width = toMM(raw.max_tire || raw.max_tire_width);
            specs.rear_axle = raw.rear_axle || raw.axle_standard; // e.g. "12x142mm"
            specs.bb_shell = raw.bottom_bracket_shell || raw.bb_shell;
            specs.headset = raw.headset || raw.steerer_tube; // Often stored in interfaces.steerer_tube for frames?
            specs.brake_mount = raw.brake_mount;
            specs.seatpost_diameter = raw.seatpost_diameter;
            specs.category = raw.category; // "Road", "Gravel", "MTB"

            // Frameset fork info (for Road/Gravel framesets that typically include a fork)
            // Default to true for Road/Gravel if not explicitly set
            const cat = (raw.category || '').toUpperCase();
            if (raw.includes_fork !== undefined) {
                specs.includes_fork = raw.includes_fork;
            } else {
                // Default: Road/Gravel framesets typically include fork, MTB typically doesn't
                specs.includes_fork = cat === 'ROAD' || cat === 'GRAVEL';
            }
            specs.factory_fork_weight = raw.factory_fork_weight ? Number(raw.factory_fork_weight) : undefined;
            specs.factory_fork_name = raw.factory_fork_name;
            break;

        case 'Fork':
            specs.steerer_tube = raw.steerer || raw.steerer_tube;
            specs.front_axle = raw.axle_standard || raw.axle;
            specs.max_tire_width = toMM(raw.max_tire);
            specs.brake_mount = raw.brake_mount;
            break;

        case 'Wheel':
            specs.position = raw.position || 'Set'; // Default to Set if unknown
            specs.diameter = toWheelSize(raw.diameter || raw.size || raw.wheel_size);
            // Join array to string to allow Validator (which checks .includes()) to match ANY of them.
            specs.freehub_body = Array.isArray(raw.freehub) ? raw.freehub.join(', ') : raw.freehub;
            specs.brake_interface = raw.brake_type || raw.brake_interface || raw.brake;
            specs.front_axle = raw.front_axle;
            specs.rear_axle = raw.rear_axle;
            if (specs.position === 'Set' && !specs.front_axle) {
                // Infer standard road disc if missing
                const brakeType = (raw.brake_type || raw.brake_interface || raw.brake || '').toLowerCase();
                if (brakeType.includes('disc')) {
                    specs.front_axle = '12x100mm';
                    specs.rear_axle = '12x142mm';
                }
            }
            break;

        case 'Tire':
            specs.diameter = toWheelSize(raw.diameter || raw.size_label || '700c'); // Fallback often needed for parsing "700x28c"
            specs.width = toMM(raw.width || raw.width_mm);
            specs.tubeless_ready = raw.tubeless || raw.tubeless_ready;

            // Parse "700x28c" if individual fields missing
            if (!specs.width && raw.size_label) {
                const match = raw.size_label.match(/(\d+)x(\d+)c?/);
                if (match) {
                    specs.diameter = toWheelSize(match[1]);
                    specs.width = toMM(match[2]);
                }
            }
            break;

        case 'BottomBracket':
            specs.bb_shell = raw.frame_shell || raw.frame_interface; // "BB386EVO"
            specs.spindle_interface = raw.crank_spindle || raw.crank_interface; // "DUB"
            break;

        case 'Crankset':
            specs.spindle_type = raw.spindle || raw.spindle_type; // "DUB"
            specs.speeds = Number(raw.speeds);
            // Parse chainrings
            const teeth = raw.teeth || raw.chainrings;
            if (teeth) {
                specs.chainrings = String(teeth).split(/[,/]/).map(t => parseInt(t.trim())).filter(n => !isNaN(n));
            }
            break;

        case 'Cassette':
            specs.range = raw.range; // "10-33t"
            if (!specs.range && raw.cog_list) {
                const min = Math.min(...raw.cog_list);
                const max = Math.max(...raw.cog_list);
                specs.range = `${min}-${max}t`;
            }
            specs.largest_cog = raw.cog_list ? Math.max(...raw.cog_list) : undefined;
            // Freehub body is tricky, typically "freehub_mount" for Campy, or implied by brand/model
            specs.freehub_body = raw.freehub_mount || raw.freehub_standard;
            specs.speeds = Number(raw.speeds);

            // Parse range if missing largest
            if (!specs.largest_cog && typeof specs.range === 'string') {
                const parts = specs.range.split('-');
                if (parts.length > 1) specs.largest_cog = parseInt(parts[1]);
            }
            break;

        case 'RearDerailleur':
            specs.max_cog_capacity = Number(raw.max_cog);
            specs.speeds = Number(raw.speeds);
            break;

        case 'Shifter':
            specs.speeds = Number(raw.speeds);
            break;
    }


    // 1. Brand & Model Normalization
    let brand = attributes.brand;
    let model = attributes.model;
    if (!brand || !model) {
        const nameParts = c.name.split(' ');
        if (!brand) brand = nameParts[0];
        if (!model) model = nameParts.slice(1).join(' ');
    }

    // 2. Weight Normalization
    let weightGrams = attributes.weightGrams || attributes.weight || attributes.weight_g || 0;
    if (typeof weightGrams === 'string') {
        weightGrams = parseFloat(weightGrams.replace(/[^0-9.]/g, ''));
    }

    // 3. Price Normalization
    let price = attributes.price || 0;
    if (typeof price === 'string') {
        price = parseFloat(price.replace(/[^0-9.]/g, ''));
    }

    // 6. UI Helpers
    let wheelSize = specs.diameter || specs.wheel_size || specs.wheelSize;
    if (!wheelSize && c.type === 'Frame') {
        // Infer from category if needed
        const cat = (attributes.category || '').toUpperCase();
        if (cat === 'ROAD' || cat === 'GRAVEL') wheelSize = '700c';
        else if (cat === 'MTB') wheelSize = '29';
    }

    const image = attributes.image || attributes.imageUrl || '/placeholder.png';

    return {
        id: c.id,
        type: c.type,
        name: c.name,
        brand,
        model,
        price,
        weightGrams,
        image,
        specs,
        compatibility_tags,
        interfaces, // Legacy support
        attributes, // Legacy support
        wheelSize
    };
}
