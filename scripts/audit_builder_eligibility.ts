import { prisma } from '../src/lib/prisma';

const VALID_DISCIPLINES = new Set(['gravel', 'road', 'mtb', 'multi']);
const TAG_VALUES = new Set(['gravel', 'road', 'mtb']);

type ComponentRow = {
  id: string;
  name: string;
  discipline: string;
  disciplineTags: string | null;
  builderEligible: boolean;
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

async function main() {
  const components = await prisma.component.findMany({
    select: {
      id: true,
      name: true,
      discipline: true,
      disciplineTags: true,
      builderEligible: true,
    },
  }) as ComponentRow[];

  const issues: string[] = [];

  for (const c of components) {
    const discipline = (c.discipline || '').toLowerCase();
    const tags = parseTags(c.disciplineTags).map(t => t.toLowerCase());

    if (!VALID_DISCIPLINES.has(discipline)) {
      issues.push(`${c.id} (${c.name}): invalid discipline '${c.discipline}'`);
    }

    for (const tag of tags) {
      if (!TAG_VALUES.has(tag)) {
        issues.push(`${c.id} (${c.name}): invalid discipline tag '${tag}'`);
      }
    }

    if ((discipline === 'road' || discipline === 'mtb') && c.builderEligible) {
      issues.push(`${c.id} (${c.name}): builderEligible=true is not allowed for discipline=${discipline}`);
    }

    if (discipline === 'multi' && c.builderEligible && !tags.includes('gravel')) {
      issues.push(`${c.id} (${c.name}): multi + builderEligible requires gravel tag`);
    }
  }

  if (issues.length > 0) {
    console.error(`Found ${issues.length} builder eligibility issue(s):`);
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log(`Builder eligibility audit passed for ${components.length} component(s).`);
}

main()
  .catch((error) => {
    console.error('Audit failed with runtime error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
