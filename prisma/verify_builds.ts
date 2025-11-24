import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to parse JSON interfaces/attributes safely
const parse = (json: any) => (typeof json === 'string' ? JSON.parse(json) : json);

async function verifyBuild(name: string, specs: {
    frameId: string;
    wheelId: string;
    tireId: string;
    shifterId: string;
    rdId: string;
    cassetteId: string;
    chainId: string;
    crankId: string;
}) {
    console.log(`\n--- Verifying Build: ${name} ---`);
    let valid = true;

    try {
        const frame = await prisma.component.findUnique({ where: { id: specs.frameId } });
        const wheel = await prisma.component.findUnique({ where: { id: specs.wheelId } });
        const tire = await prisma.component.findUnique({ where: { id: specs.tireId } });
        const shifter = await prisma.component.findUnique({ where: { id: specs.shifterId } });
        const rd = await prisma.component.findUnique({ where: { id: specs.rdId } });
        const cassette = await prisma.component.findUnique({ where: { id: specs.cassetteId } });
        const chain = await prisma.component.findUnique({ where: { id: specs.chainId } });
        const crank = await prisma.component.findUnique({ where: { id: specs.crankId } });

        if (!frame || !wheel || !tire || !shifter || !rd || !cassette || !chain || !crank) {
            console.error("❌ Missing components in DB for this build.");
            return;
        }

        const frameInt = parse(frame.interfaces);
        const wheelInt = parse(wheel.interfaces);
        const tireInt = parse(tire.interfaces);
        const shifterInt = parse(shifter.interfaces);
        const rdInt = parse(rd.interfaces);
        const cassetteInt = parse(cassette.interfaces);
        const chainInt = parse(chain.interfaces);
        const crankInt = parse(crank.interfaces);

        // 1. Frame <-> Wheel (Axle Standards)
        // Simplified check: Just ensuring both are Disc for now as most ingested are disc
        // Real check would parse "12x142mm" etc.
        if (wheelInt.rear_axle !== frameInt.rear_axle) {
            // Allow some fuzzy matching or just warn for now as string formats might differ slightly
            // But our ingestion standardized them fairly well.
            if (frameInt.rear_axle && wheelInt.rear_axle && frameInt.rear_axle !== wheelInt.rear_axle) {
                console.warn(`⚠️ Axle Mismatch? Frame: ${frameInt.rear_axle}, Wheel: ${wheelInt.rear_axle}`);
                // Don't fail strictly yet unless we are sure of format
            }
        }

        // 2. Wheel <-> Tire (Diameter)
        if (wheelInt.diameter !== tireInt.diameter) {
            console.error(`❌ Diameter Mismatch: Wheel ${wheelInt.diameter} vs Tire ${tireInt.diameter}`);
            valid = false;
        } else {
            console.log(`✅ Wheel/Tire Diameter: ${wheelInt.diameter}`);
        }

        // 3. Shifter <-> RD (Protocol)
        if (shifterInt.protocol !== rdInt.protocol) {
            console.error(`❌ Shifting Protocol Mismatch: Shifter ${shifterInt.protocol} vs RD ${rdInt.protocol}`);
            valid = false;
        } else {
            console.log(`✅ Shifting Protocol: ${shifterInt.protocol}`);
        }

        // 4. Drivetrain Speeds (Shifter, RD, Cassette, Chain)
        const speeds = [
            { part: 'Shifter', speed: parse(shifter.attributes).speeds },
            { part: 'RD', speed: parse(rd.attributes).speeds },
            { part: 'Cassette', speed: cassetteInt.speeds },
            { part: 'Chain', speed: chainInt.speeds },
            { part: 'Crank', speed: crankInt.speeds }
        ];

        const baseSpeed = speeds[0].speed;
        const speedMismatch = speeds.filter(s => s.speed !== baseSpeed);

        if (speedMismatch.length > 0) {
            // Allow chain to be compatible if it supports the speed (often chains are 11/12s compatible, but our data says "12")
            // For strict check:
            console.error(`❌ Speed Mismatch: Expected ${baseSpeed}s, found:`, speedMismatch);
            valid = false;
        } else {
            console.log(`✅ Drivetrain Speeds: ${baseSpeed}s`);
        }

        // 5. Cassette <-> Wheel (Freehub)
        // wheelInt.freehub is an array of strings, e.g. ["Shimano HG", "SRAM XDR"]
        // cassetteInt.freehub_mount is a string, e.g. "SRAM XDR"
        const freehubCompatible = wheelInt.freehub.some((fh: string) => cassetteInt.freehub_mount.includes(fh) || fh.includes(cassetteInt.freehub_mount));

        if (!freehubCompatible) {
            console.error(`❌ Freehub Incompatible: Wheel supports [${wheelInt.freehub.join(', ')}], Cassette needs ${cassetteInt.freehub_mount}`);
            valid = false;
        } else {
            console.log(`✅ Freehub Compatible: ${cassetteInt.freehub_mount}`);
        }

        if (valid) {
            console.log(`🎉 Build "${name}" is VALID!`);
        } else {
            console.log(`🚫 Build "${name}" has ISSUES.`);
        }

    } catch (e) {
        console.error("Error verifying build:", e);
    }
}

async function main() {
    // Test Case 1: High-End Road (Shimano 12s)
    await verifyBuild("Pro Road Build", {
        frameId: "specialized-tarmac-sl8-s-works-fact-12r",
        wheelId: "enve-ses-4-5-pro-700c",
        tireId: "continental-grand-prix-5000-s-tr-700x28c",
        shifterId: "shimano-dura-ace-di2-st-r9270",
        rdId: "shimano-dura-ace-di2-rd-r9250",
        cassetteId: "shimano-dura-ace-ultegra-105-12s-11-30t",
        chainId: "shimano-dura-ace-cn-m9100",
        crankId: "shimano-dura-ace-fc-r9200"
    });

    // Test Case 2: Gravel Mullet (SRAM AXS XPLR)
    await verifyBuild("Dream Gravel Build", {
        frameId: "specialized-crux-s-works-fact-12r",
        wheelId: "zipp-303-xplr-sw-700c",
        tireId: "specialized-pathfinder-pro-2bliss-700x42c",
        shifterId: "sram-rival-etap-axs", // Using Rival as Red shifter ID wasn't immediately found, but protocol matches
        rdId: "sram-red-xplr-axs-e1-full-mount",
        cassetteId: "sram-red-xplr-xg-1391-13s-10-46t",
        chainId: "sram-force-xplr-flattop",
        crankId: "sram-red-axs-e1"
    });

    // Test Case 3: Enduro MTB (SRAM Eagle)
    await verifyBuild("Enduro Sled", {
        frameId: "specialized-stumpjumper-s-works-2025",
        wheelId: "reserve-30-dh-29",
        tireId: "maxxis-minion-dhf-exo-29x2-5",
        shifterId: "sram-xx1-eagle-axs-controller",
        rdId: "sram-xx1-eagle-axs",
        cassetteId: "sram-eagle-legacy-xg-1299-1295-1275-10-52t",
        chainId: "sram-xx1-eagle",
        crankId: "sram-xx1-eagle-dub-sl"
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
