import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bike Weight Calculator | Bike Build Weight Estimator | CrankSmith",
    description: "Estimate your bike build weight with CrankSmith's weight calculator. Simulate upgrades, compare components, and target your ideal weight.",
    openGraph: {
        title: "Bike Weight Calculator | CrankSmith",
        description: "Estimate build weight, simulate upgrades, and compare component weights for your dream bike.",
        type: "website"
    }
};

export default function WeightLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
