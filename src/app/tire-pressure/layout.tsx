import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Gravel Tire Pressure Calculator for Bike Builds | CrankSmith",
    description: "Calculate optimal gravel front/rear PSI from tire + rim width and terrain—then build the compatible wheels/standards/drivetrain in CrankSmith.",
    openGraph: {
        title: "Bike Tire Pressure Calculator | CrankSmith",
        description: "Don't guess. Calculate optimal pressure for your rims, casing, and terrain.",
        type: "website"
    }
};

export default function TirePressureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
