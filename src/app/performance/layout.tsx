import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Gear Ratio Performance Analyzer | Drivetrain Lab | CrankSmith",
    description: "Compare gear ratios side-by-side, analyze speed and cadence outcomes, and optimize your drivetrain for any terrain.",
    openGraph: {
        title: "Gear Ratio Performance Analyzer | CrankSmith",
        description: "Compare bike setups side-by-side. Analyze speed, cadence, and climbing capability.",
        type: "website"
    }
};

export default function PerformanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
