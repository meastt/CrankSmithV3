/**
 * Add Mechanical Shimano 12-speed components
 *
 * In reality:
 * - Dura-Ace R9200 and Ultegra R8100 are Di2-only (no mechanical option)
 * - Shimano 105 R7100 is the only mechanical 12-speed road groupset
 * - GRX RX820 has mechanical 12-speed for gravel
 *
 * Run with: npx tsx prisma/add-mechanical-shimano-12s.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MECHANICAL_SHIMANO_12S = {
    shifters: [
        // Shimano 105 R7100 - Mechanical 12s Road
        {
            id: 'shimano-105-r7100-shifters',
            name: 'Shimano 105 ST-R7120 Shifters (12s)',
            interfaces: {
                protocol: 'Shimano_Road_12s_Mech',
                type: 'Drop Bar'
            },
            attributes: {
                speeds: 12,
                electronic: false,
                weight: 490,
                groupset: '105 R7100'
            }
        },
        // GRX RX820 - Mechanical 12s Gravel (drop bar)
        {
            id: 'shimano-grx-rx820-shifters',
            name: 'Shimano GRX ST-RX820 Shifters (12s)',
            interfaces: {
                protocol: 'Shimano_Road_12s_Mech',
                type: 'Drop Bar'
            },
            attributes: {
                speeds: 12,
                electronic: false,
                weight: 510,
                groupset: 'GRX RX820'
            }
        },
        // GRX RX822 - Mechanical 12s Gravel (sub-brake lever compatible)
        {
            id: 'shimano-grx-rx822-shifters',
            name: 'Shimano GRX ST-RX822 Shifters (12s)',
            interfaces: {
                protocol: 'Shimano_Road_12s_Mech',
                type: 'Drop Bar'
            },
            attributes: {
                speeds: 12,
                electronic: false,
                weight: 510,
                groupset: 'GRX RX820'
            }
        }
    ],
    derailleurs: [
        // Shimano 105 R7100 - Mechanical 12s Road RD
        {
            id: 'shimano-105-r7100-rd-mech',
            name: 'Shimano 105 RD-R7100 (12s Mechanical)',
            interfaces: {
                attachment: 'Standard_Mount',
                cable_pull: 'Shimano_Road_12s_Mech'
            },
            attributes: {
                speeds: 12,
                electronic: false,
                max_cog: 36,
                weight: 262,
                clutch: false
            }
        },
        // GRX RX820 - Mechanical 12s Gravel RD
        {
            id: 'shimano-grx-rx820-rd',
            name: 'Shimano GRX RD-RX820 (12s)',
            interfaces: {
                attachment: 'Standard_Mount',
                cable_pull: 'Shimano_Road_12s_Mech'
            },
            attributes: {
                speeds: 12,
                electronic: false,
                max_cog: 36,
                weight: 270,
                clutch: true
            }
        }
    ]
};

async function main() {
    console.log('Adding Mechanical Shimano 12-speed components...\n');

    // Add shifters
    for (const shifter of MECHANICAL_SHIMANO_12S.shifters) {
        const componentData = {
            id: shifter.id,
            type: 'Shifter',
            name: shifter.name,
            interfaces: JSON.stringify(shifter.interfaces),
            attributes: JSON.stringify(shifter.attributes)
        };

        const exists = await prisma.component.findUnique({ where: { id: shifter.id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created: ${shifter.name}`);
        } else {
            // Update if exists
            await prisma.component.update({
                where: { id: shifter.id },
                data: componentData
            });
            console.log(`Updated: ${shifter.name}`);
        }
    }

    // Add derailleurs
    for (const rd of MECHANICAL_SHIMANO_12S.derailleurs) {
        const componentData = {
            id: rd.id,
            type: 'RearDerailleur',
            name: rd.name,
            interfaces: JSON.stringify(rd.interfaces),
            attributes: JSON.stringify(rd.attributes)
        };

        const exists = await prisma.component.findUnique({ where: { id: rd.id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created: ${rd.name}`);
        } else {
            await prisma.component.update({
                where: { id: rd.id },
                data: componentData
            });
            console.log(`Updated: ${rd.name}`);
        }
    }

    console.log('\nMechanical Shimano 12-speed components added!');
    console.log('\nNote: Dura-Ace R9200 and Ultegra R8100 are Di2-only.');
    console.log('For mechanical 12s, use Shimano 105 R7100 or GRX RX820.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
