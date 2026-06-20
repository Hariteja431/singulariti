const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Static SVG of Singulariti Prism without animations for high quality rendering
const staticSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
  <polygon points="50,10 15,85 50,60" fill="#6B6B80" opacity="0.1" />
  <polygon points="50,10 85,85 50,60" fill="#6B6B80" opacity="0.2" />
  <polygon points="15,85 85,85 50,60" fill="#00C4B4" opacity="0.2" />
  <polygon points="50,10 15,85 85,85" stroke="#6B6B80" stroke-width="6" stroke-linejoin="round" fill="none" />
  <line x1="50" y1="10" x2="50" y2="60" stroke="#6B6B80" stroke-width="4" stroke-linecap="round" />
  <line x1="15" y1="85" x2="50" y2="60" stroke="#6B6B80" stroke-width="4" stroke-linecap="round" />
  <line x1="85" y1="85" x2="50" y2="60" stroke="#6B6B80" stroke-width="4" stroke-linecap="round" />
  <circle cx="50" cy="60" r="10" fill="#00C4B4" />
</svg>
`;

async function main() {
  const publicDir = path.join(__dirname, '../public');
  const appDir = path.join(__dirname, '../src/app');

  console.log('Generating PNG files...');
  
  // Render PNGs using sharp
  const png16 = await sharp(Buffer.from(staticSvg)).resize(16, 16).png().toBuffer();
  const png32 = await sharp(Buffer.from(staticSvg)).resize(32, 32).png().toBuffer();
  const png48 = await sharp(Buffer.from(staticSvg)).resize(48, 48).png().toBuffer();
  const png180 = await sharp(Buffer.from(staticSvg)).resize(180, 180).png().toBuffer();

  // Write PNG files
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
  console.log('Generated favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png in public/');

  // Generate ICO file containing 16x16, 32x32, 48x48
  const icoBuffer = createIco([
    { buffer: png16, width: 16, height: 16 },
    { buffer: png32, width: 32, height: 32 },
    { buffer: png48, width: 48, height: 48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico in public/ and src/app/');
}

function createIco(images) {
  // ICO header is 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Image type (1 = ICO)
  header.writeUInt16LE(images.length, 4); // Number of images

  const directories = [];
  let currentOffset = 6 + images.length * 16; // Offset to start of image data

  for (const img of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(img.width, 0); // Width
    dir.writeUInt8(img.height, 1); // Height
    dir.writeUInt8(0, 2); // Colors (0 = no palette)
    dir.writeUInt8(0, 3); // Reserved (0)
    dir.writeUInt16LE(1, 4); // Color planes (1)
    dir.writeUInt16LE(32, 6); // Bits per pixel (32)
    dir.writeUInt32LE(img.buffer.length, 8); // Size of image data
    dir.writeUInt32LE(currentOffset, 12); // Offset to image data

    directories.push(dir);
    currentOffset += img.buffer.length;
  }

  // Concatenate header, directories, and image buffers
  return Buffer.concat([
    header,
    ...directories,
    ...images.map(img => img.buffer)
  ]);
}

main().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
