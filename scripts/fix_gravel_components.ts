import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // We want to make sure the builder has actual options for all part types!
    // We'll mark components of types: Tire, Wheel, Cassette, Crankset, BottomBracket, RearDerailleur, Shifter, Chain, BrakeCaliper, BrakeRotor, Handlebar, Stem, Seatpost, Saddle, Fork
    // as builderEligible=true and disciplineTags='gravel' UNLESS their existing category explicitly says 'MTB' or 'Road' (to be slightly careful).
    
    // Actually, to ensure the builder works perfectly, we will just mark ALL non-Frame components 
    // to be gravel-eligible, relying on the Builder's strict `isCompatible` filtering to hide incompatible parts!
    
    const typesToEnable = [
        'Tire', 'Wheel', 'Cassette', 'Crankset', 'BottomBracket', 
        'RearDerailleur', 'Shifter', 'Chain', 'BrakeCaliper', 'BrakeRotor', 
        'Handlebar', 'Stem', 'Seatpost', 'Saddle', 'Fork'
    ];
    
    let totalUpdated = 0;
    
    for (const type of typesToEnable) {
        const res = await prisma.component.updateMany({
            where: {
                type: type,
                // Optional: don't override if already gravel
                // builderEligible: false
            },
            data: {
                builderEligible: true,
                disciplineTags: 'gravel'  // Adds gravel tag, since discipline is 'multi'
            }
        });
        console.log(`Updated ${res.count} ${type} components.`);
        totalUpdated += res.count;
    }
    
    console.log(`Total components made gravel-eligible: ${totalUpdated}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
