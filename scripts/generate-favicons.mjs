import fs from "fs";
import path from "path";

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="efGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0052D6" />
      <stop offset="50%" stop-color="#0062FF" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#001850" flood-opacity="0.4" />
    </filter>
  </defs>
  
  <!-- Fond Arrondi (Gradient Bleu Royal / Indigo EasyFacturation PRO) -->
  <rect width="64" height="64" rx="16" fill="url(#efGrad)" />
  <rect x="1.5" y="1.5" width="61" height="61" rx="14.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.5" />
  
  <!-- Logo Bouclier & Checkmark Officiel -->
  <g transform="translate(8, 8) scale(2)" filter="url(#shadow)">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="rgba(255, 255, 255, 0.18)"
      stroke="#FFFFFF"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="m9 12 2.2 2.2 4.3-4.4"
      fill="none"
      stroke="#FFFFFF"
      stroke-width="2.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</svg>`;

// Fonction pour générer un fichier ICO Windows standard 32x32 RGBA non-compressé
function generate32x32Ico() {
  const width = 32;
  const height = 32;
  const numPixels = width * height;
  const xorSize = numPixels * 4; // 32 bpp RGBA
  const andSize = Math.ceil(width / 32) * 4 * height; // 1 bpp mask (32 bits per row = 4 bytes * 32 rows = 128 bytes)
  const dibHeaderSize = 40; // BITMAPINFOHEADER
  const imageSize = dibHeaderSize + xorSize + andSize;

  // ICO header (6 bytes) + 1 Dir Entry (16 bytes) = 22 bytes offset
  const fileHeaderSize = 6;
  const dirEntrySize = 16;
  const offset = fileHeaderSize + dirEntrySize;
  const totalFileSize = offset + imageSize;

  const buf = Buffer.alloc(totalFileSize);

  // --- ICO Header ---
  buf.writeUInt16LE(0, 0); // Reserved (must be 0)
  buf.writeUInt16LE(1, 2); // 1 = ICO icon
  buf.writeUInt16LE(1, 4); // 1 image

  // --- Directory Entry ---
  buf.writeUInt8(width, 6); // Width (32)
  buf.writeUInt8(height, 7); // Height (32)
  buf.writeUInt8(0, 8); // Color count (0 = >=8bpp)
  buf.writeUInt8(0, 9); // Reserved
  buf.writeUInt16LE(1, 10); // Color planes
  buf.writeUInt16LE(32, 12); // Bits per pixel (32 = RGBA)
  buf.writeUInt32LE(imageSize, 14); // Image data size in bytes
  buf.writeUInt32LE(offset, 18); // Offset to image data

  // --- BITMAPINFOHEADER (DIB) ---
  let p = offset;
  buf.writeUInt32LE(dibHeaderSize, p); // Header size (40)
  buf.writeInt32LE(width, p + 4); // Width (32)
  buf.writeInt32LE(height * 2, p + 8); // Height * 2 for ICO (XOR + AND mask height = 64)
  buf.writeUInt16LE(1, p + 12); // Color planes (1)
  buf.writeUInt16LE(32, p + 14); // Bit count (32 bpp)
  buf.writeUInt32LE(0, p + 16); // Compression (0 = BI_RGB)
  buf.writeUInt32LE(xorSize + andSize, p + 20); // Image size
  buf.writeInt32LE(0, p + 24); // X pixels per meter
  buf.writeInt32LE(0, p + 28); // Y pixels per meter
  buf.writeUInt32LE(0, p + 32); // Colors in color table
  buf.writeUInt32LE(0, p + 36); // Important colors

  // --- XOR bitmap (RGBA in BGRA order, bottom-to-top) ---
  const pixelOffset = offset + dibHeaderSize;

  // Créons une version pixelisée nette du bouclier EasyFacturation PRO
  for (let y = 0; y < height; y++) {
    // Dans BMP, la ligne 0 est le bas de l'image
    const rowFromTop = (height - 1) - y;
    for (let x = 0; x < width; x++) {
      const idx = pixelOffset + (y * width + x) * 4;

      // Distance au centre pour coins arrondis
      const isCorner =
        (x <= 3 && rowFromTop <= 3 && Math.hypot(x - 3, rowFromTop - 3) > 3) ||
        (x >= 28 && rowFromTop <= 3 && Math.hypot(x - 28, rowFromTop - 3) > 3) ||
        (x <= 3 && rowFromTop >= 28 && Math.hypot(x - 3, rowFromTop - 28) > 3) ||
        (x >= 28 && rowFromTop >= 28 && Math.hypot(x - 28, rowFromTop - 28) > 3);

      if (isCorner) {
        // Transparent
        buf.writeUInt8(0, idx);
        buf.writeUInt8(0, idx + 1);
        buf.writeUInt8(0, idx + 2);
        buf.writeUInt8(0, idx + 3); // Alpha 0
        continue;
      }

      // Dégradé de fond (#0052D6 vers #4F46E5)
      const t = (x + rowFromTop) / (width + height);
      let r = Math.round(0 * (1 - t) + 79 * t);
      let g = Math.round(82 * (1 - t) + 70 * t);
      let b = Math.round(214 * (1 - t) + 229 * t);
      let a = 255;

      // Dessiner le bouclier blanc au centre
      // Coordonnées normalisées dans [0..31]
      // Bouclier: x entre 8 et 23, y entre 6 et 25
      const shieldX = x - 15.5; // [-7.5 .. 7.5]
      const shieldY = rowFromTop - 6; // [0 .. 19]
      
      const inShieldTop = shieldY >= 2 && shieldY <= 9 && Math.abs(shieldX) <= 6;
      const inShieldBottom = shieldY > 9 && shieldY <= 18 && (Math.abs(shieldX) <= (6 - (shieldY - 9) * 0.6));
      const inShield = inShieldTop || inShieldBottom;

      // Contour du bouclier
      const isShieldEdge =
        inShield &&
        (Math.abs(Math.abs(shieldX) - 6) <= 1.2 ||
         shieldY <= 3 ||
         (shieldY > 9 && Math.abs(Math.abs(shieldX) - (6 - (shieldY - 9) * 0.6)) <= 1.2));

      // Checkmark: du point (11, 15) à (14, 18) à (20, 11)
      const onCheckmark =
        (rowFromTop >= 13 && rowFromTop <= 18 && Math.abs((rowFromTop - 13) - (x - 11)) <= 1 && x <= 15) ||
        (rowFromTop >= 11 && rowFromTop <= 18 && Math.abs((18 - rowFromTop) - (x - 14) * 1.1) <= 1.2 && x >= 14 && x <= 21);

      if (onCheckmark || isShieldEdge) {
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      } else if (inShield) {
        // Remplissage translucide du bouclier
        r = Math.min(255, Math.round(r * 0.65 + 255 * 0.35));
        g = Math.min(255, Math.round(g * 0.65 + 255 * 0.35));
        b = Math.min(255, Math.round(b * 0.65 + 255 * 0.35));
      }

      // BGRA
      buf.writeUInt8(b, idx);
      buf.writeUInt8(g, idx + 1);
      buf.writeUInt8(r, idx + 2);
      buf.writeUInt8(a, idx + 3);
    }
  }

  // AND mask (1 bit per pixel, 0 = opaque, 1 = transparent)
  const andOffset = pixelOffset + xorSize;
  for (let y = 0; y < height; y++) {
    const rowFromTop = (height - 1) - y;
    let rowMask = 0;
    for (let x = 0; x < width; x++) {
      const isCorner =
        (x <= 3 && rowFromTop <= 3 && Math.hypot(x - 3, rowFromTop - 3) > 3) ||
        (x >= 28 && rowFromTop <= 3 && Math.hypot(x - 28, rowFromTop - 3) > 3) ||
        (x <= 3 && rowFromTop >= 28 && Math.hypot(x - 3, rowFromTop - 28) > 3) ||
        (x >= 28 && rowFromTop >= 28 && Math.hypot(x - 28, rowFromTop - 28) > 3);
      if (isCorner) {
        rowMask |= (1 << (7 - (x % 8)));
      }
      if (x % 8 === 7) {
        buf.writeUInt8(rowMask, andOffset + y * 4 + Math.floor(x / 8));
        rowMask = 0;
      }
    }
  }

  return buf;
}

// 1. Assurer l'existence du dossier public et src/app
const publicDir = path.resolve("./public");
const appDir = path.resolve("./src/app");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 2. Écrire le SVG dans public/ et src/app/
fs.writeFileSync(path.join(publicDir, "icon.svg"), svgContent, "utf8");
fs.writeFileSync(path.join(appDir, "icon.svg"), svgContent, "utf8");

// 3. Générer le fichier .ico valide
const icoBuffer = generate32x32Ico();
fs.writeFileSync(path.join(publicDir, "favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(appDir, "favicon.ico"), icoBuffer);

console.log("✓ Favicons générés avec succès :");
console.log("  - public/icon.svg & src/app/icon.svg (SVG vectoriel Retina/HiDPI)");
console.log("  - public/favicon.ico & src/app/favicon.ico (ICO 32x32 RGBA)");
