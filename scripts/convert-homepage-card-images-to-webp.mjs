import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.resolve(__dirname, '../public/images');

const homepageCardImages = [
  'workshop',
  'gears',
  'tirepressure',
  'scale',
  'garage',
];

async function convertImage(baseName) {
  const inputPath = path.join(imagesDir, `${baseName}.jpg`);
  const outputPath = path.join(imagesDir, `${baseName}.webp`);

  await sharp(inputPath)
    .rotate()
    .webp({
      quality: 82,
      effort: 5,
    })
    .toFile(outputPath);

  return { inputPath, outputPath };
}

async function main() {
  console.log('Converting homepage card images to WebP...\n');

  for (const baseName of homepageCardImages) {
    try {
      const { inputPath, outputPath } = await convertImage(baseName);
      console.log(`OK  ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`ERR ${baseName}.jpg -> ${baseName}.webp`);
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}

main();
