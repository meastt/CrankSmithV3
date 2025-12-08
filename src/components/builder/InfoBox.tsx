'use client';

import React from 'react';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

interface InfoBoxProps {
    type?: 'info' | 'warning' | 'tip';
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
    type = 'info',
    title,
    children,
    className = ''
}) => {
    const config = {
        info: {
            icon: Info,
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            iconColor: 'text-blue-400',
            titleColor: 'text-blue-300'
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-amber-500/5',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-400',
            titleColor: 'text-amber-300'
        },
        tip: {
            icon: Lightbulb,
            bg: 'bg-emerald-500/5',
            border: 'border-emerald-500/20',
            iconColor: 'text-emerald-400',
            titleColor: 'text-emerald-300'
        }
    };

    const { icon: Icon, bg, border, iconColor, titleColor } = config[type];

    return (
        <div className={`${bg} border ${border} rounded-lg p-3 ${className}`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 ${iconColor} shrink-0 mt-0.5`} />
                <div className="text-sm">
                    {title && (
                        <p className={`${titleColor} font-medium mb-1`}>{title}</p>
                    )}
                    <div className="text-stone-400">{children}</div>
                </div>
            </div>
        </div>
    );
};

// Pre-built contextual info boxes for the build flow
export const BUILD_STEP_INFO: Record<string, { type: 'info' | 'warning' | 'tip'; title: string; content: string }> = {
    Frame: {
        type: 'info',
        title: 'About Frameset Weights',
        content: 'Road and gravel frameset weights typically include the factory fork. If you choose a different fork, we\'ll adjust the weight calculation automatically.'
    },
    Fork: {
        type: 'info',
        title: 'Fork Compatibility',
        content: 'Make sure the steerer tube (straight vs tapered), axle standard, and wheel size match your frame. Suspension forks add weight but improve comfort on rough terrain.'
    },
    Wheel: {
        type: 'tip',
        title: 'Wheelset Weight Distribution',
        content: 'Rear wheels are typically heavier than front (~55/45 split) due to the freehub and extra spokes. We account for this in weight calculations.'
    },
    Tire: {
        type: 'info',
        title: 'Tire Sizing',
        content: 'Tire width affects grip, comfort, and rolling resistance. Wider tires run lower pressure for comfort; narrower tires are faster on smooth surfaces. Check your frame\'s max tire clearance.'
    },
    BottomBracket: {
        type: 'warning',
        title: 'Critical Compatibility',
        content: 'The BB must match both your frame\'s shell type (BSA, PF30, T47, etc.) AND your crankset\'s spindle type (24mm, DUB, 30mm). Double-check both!'
    },
    Crankset: {
        type: 'info',
        title: 'Gearing Selection',
        content: 'Chainring size affects your gear range. Smaller rings = easier climbing, larger = higher top speed. 1x setups are simpler; 2x provides wider range.'
    },
    Cassette: {
        type: 'info',
        title: 'Freehub Compatibility',
        content: 'Cassettes require a matching freehub body: Shimano HG, SRAM XD/XDR, Shimano Microspline, or Campagnolo N3W. Check your rear wheel\'s freehub type.'
    },
    RearDerailleur: {
        type: 'warning',
        title: 'Ecosystem Lock-in',
        content: 'Derailleurs must match your shifter brand and protocol. Shimano Di2 needs Di2 shifters; SRAM AXS needs AXS shifters. Mechanical systems are more forgiving but still brand-specific.'
    },
    Shifter: {
        type: 'info',
        title: 'Shifter Protocols',
        content: 'Electronic: Shimano Di2, SRAM AXS, Campagnolo EPS. Mechanical: Each brand has unique cable pull ratios. Mixing brands usually doesn\'t work.'
    },
    BrakeCaliper: {
        type: 'warning',
        title: 'Brake Safety',
        content: 'Never mix brake fluids! Shimano uses mineral oil; SRAM uses DOT fluid. Mixing destroys seals. Also ensure mount type matches frame/fork (flat mount vs post mount).'
    },
    BrakeRotor: {
        type: 'info',
        title: 'Rotor Sizing',
        content: 'Larger rotors = more stopping power and heat dissipation. Common sizes: 140mm (light riders, flat), 160mm (all-around), 180mm+ (heavy loads, steep descents).'
    },
    Stem: {
        type: 'tip',
        title: 'Fit Adjustment',
        content: 'Stem length affects reach and handling. Shorter = more upright, quicker steering. Longer = stretched out, more stable. Most are 31.8mm clamp; some are 35mm.'
    },
    Handlebar: {
        type: 'info',
        title: 'Bar Selection',
        content: 'Width affects control and aerodynamics. Drop bars: measure center-to-center. Flat bars: wider = more control. Match clamp diameter to your stem (31.8mm or 35mm).'
    },
    Seatpost: {
        type: 'warning',
        title: 'Diameter Matters',
        content: 'Seatpost diameter must exactly match your frame. Common sizes: 27.2mm (older/steel), 30.9mm, 31.6mm (modern). Even 0.2mm off won\'t fit properly.'
    }
};
