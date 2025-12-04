
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Compatibility Data Audit...');

    const components = await prisma.component.findMany();
    console.log(`Found ${components.length} components.`);

    let issues = 0;

    for (const component of components) {
        const interfaces = JSON.parse(component.interfaces as string || '{}');
        const attributes = JSON.parse(component.attributes as string || '{}');
        const type = component.type;

        // Check 1: Electronic parts must have a protocol
        const isElectronic = attributes.electronic === true ||
            (interfaces.protocol && String(interfaces.protocol).toLowerCase().includes('electronic')) ||
            (interfaces.protocol && String(interfaces.protocol).toLowerCase().includes('di2')) ||
            (interfaces.protocol && String(interfaces.protocol).toLowerCase().includes('axs'));

        if (isElectronic && !interfaces.protocol) {
            console.warn(`[MISSING PROTOCOL] ${type} "${component.name}" (ID: ${component.id}) is marked electronic but has no protocol.`);
            issues++;
        }

        // Check 2: Shifters and Derailleurs should have a protocol or be explicitly mechanical
        if (['Shifter', 'RearDerailleur', 'FrontDerailleur'].includes(type)) {
            if (!interfaces.protocol && !attributes.cable_pull) {
                // It might be okay if it's a very old part, but generally we want one or the other
                console.warn(`[AMBIGUOUS ACTUATION] ${type} "${component.name}" (ID: ${component.id}) has no protocol AND no cable_pull.`);
                issues++;
            }
        }

        // Check 3: Check for loose "AXS" or "Di2" labeling without specific generation info if possible
        // (This is harder to enforce strictly without a defined list of valid protocols, but we can log what we find)
        if (interfaces.protocol) {
            // console.log(`[INFO] ${component.name} Protocol: ${interfaces.protocol}`);
        }
    }

    console.log(`Audit complete. Found ${issues} potential issues.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
