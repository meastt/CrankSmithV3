import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bike Garage | Saved Builds & Templates | CrankSmith",
    description: "View and manage your saved bike builds, load templates, and access your bike builds library in CrankSmith.",
    openGraph: {
        title: "Bike Garage | CrankSmith",
        description: "View and manage your saved bike builds and templates.",
        type: "website"
    }
};

export default function GarageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
