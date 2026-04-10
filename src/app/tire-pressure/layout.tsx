import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bike Tire Pressure Calculator | Optimal PSI Guide | CrankSmith",
    description: "Calculate the optimal tire pressure for your specific rim width, tire type, rider weight, and terrain. No more guessing.",
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
