import { PrismaClient } from '@prisma/client';
import { validateBuilderBuild } from './src/lib/validationContext';
import { normalizeComponent } from './src/lib/normalization';

const prisma = new PrismaClient();

async function main() {
    const rawTires = await prisma.component.findMany({ where: { type: 'Tire', builderEligible: true } });
    const tires = rawTires.map(c => normalizeComponent(c));

    // Pick a frame that has Max Tire 40mm
    const frames = (await prisma.component.findMany({ where: { type: 'Frame', builderEligible: true } })).map(normalizeComponent);
    const frame40 = frames.find(f => {
        const c = parseFloat(String(f.specs?.max_tire_width || f.attributes?.max_tire || '0').replace(/[^0-9.]/g, ''));
        return c === 40;
    });
    console.log('Frame 40:', frame40?.name);

    const wheels = (await prisma.component.findMany({ where: { type: 'Wheel', builderEligible: true } })).map(normalizeComponent);
    const wheel = wheels.find(w => w.name.includes('700'));
    console.log('Wheel:', wheel?.name);

    let filtered = tires.filter(c => {
        const width = parseFloat(String((c as any).widthMM || c.specs?.width || c.interfaces?.width || c.attributes?.width || 0).replace(/[^0-9.]/g, '')) || 0;
        if (width >= 38 && width <= 60) return true;
        if (40 > 0 && width >= 38 && width <= 40) return true;
        return false;
    });
    console.log('After width filter:', filtered.length);

    // isCompatible filter
    const buildData = { frame: frame40, wheels: [wheel, wheel], tires: [] as any[] };

    filtered = filtered.filter(c => {
        buildData.tires = [c, c];
        const res = validateBuilderBuild(buildData);
        if (!res.compatible) {
            console.log('Rejected ' + c.name, res.issues.filter(x => x.severity === 'ERROR').map(i => i.message));
        }
        return res.compatible;
    });
    console.log('After isCompatible filter:', filtered.length);
}
main().finally(() => process.exit(0));
