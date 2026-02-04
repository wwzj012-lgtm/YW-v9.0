import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const publicDir = path.join(root, 'public');
const src = path.join(publicDir, 'logo.png');
const out192 = path.join(publicDir, 'pwa-192.png');
const out512 = path.join(publicDir, 'pwa-512.png');

if (!fs.existsSync(src)) {
  console.error('Missing source icon:', src);
  console.error('Please put your logo file at public/logo.png');
  process.exit(1);
}

await sharp(src)
  .resize({ width: 192, height: 192, fit: 'cover', position: 'top' })
  .png()
  .toFile(out192);

await sharp(src)
  .resize({ width: 512, height: 512, fit: 'cover', position: 'top' })
  .png()
  .toFile(out512);

console.log('Generated:', out192, out512);
