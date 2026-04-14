'use client';

import { useSafeUser } from "@/components/ClerkProviderWrapper";
import { HeroSection } from './HeroSection';
import { ValuePropStrip } from './ValuePropStrip';
import { ToolsGrid } from './ToolsGrid';
import { GarageCard } from './GarageCard';
import { GravelMouthNewsletter } from './GravelMouthNewsletter';
import { SignInCTA } from './SignInCTA';

export const DashboardGrid = () => {
    const { isLoaded, isSignedIn } = useSafeUser();

    return (
        <div className="min-h-screen bg-stone-950 relative overflow-hidden">
            <HeroSection />
            <ValuePropStrip />
            <ToolsGrid />
            <GarageCard />
            <GravelMouthNewsletter />
            <SignInCTA isLoaded={isLoaded} isSignedIn={isSignedIn} />
        </div>
    );
};
