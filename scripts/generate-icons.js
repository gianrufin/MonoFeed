import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // Simple valid PNG encoder in pure Node
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // Background: dark zinc/black #09090b
      buffer[idx] = 9;
      buffer[idx + 1] = 9;
      buffer[idx + 2] = 11;
      buffer[idx + 3] = 255;

      // Outer border circle or rounded rect
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Safe zone for maskable vs standard
      const emblemScale = isMaskable ? 0.35 : 0.45;
      const r = width * emblemScale;

      // Draw stylized 'M'
      const normX = (x - cx) / r;
      const normY = (y - cy) / r;

      if (normY >= -0.7 && normY <= 0.7) {
        // Left pillar
        if (Math.abs(normX - -0.6) < 0.12) {
          buffer[idx] = 255; buffer[idx + 1] = 255; buffer[idx + 2] = 255;
        }
        // Right pillar
        if (Math.abs(normX - 0.6) < 0.12) {
          buffer[idx] = 255; buffer[idx + 1] = 255; buffer[idx + 2] = 255;
        }
        // Left diagonal
        if (normY >= -0.7 && normY <= 0.3) {
          const diag1 = normY - (normX + 0.6) * (1.0 / 0.6) + 0.7;
          if (Math.abs(diag1) < 0.15 && normX >= -0.6 && normX <= 0) {
            buffer[idx] = 255; buffer[idx + 1] = 255; buffer[idx + 2] = 255;
          }
          // Right diagonal
          const diag2 = normY - (-normX + 0.6) * (1.0 / 0.6) + 0.7;
          if (Math.abs(diag2) < 0.15 && normX <= 0.6 && normX >= 0) {
            buffer[idx] = 255; buffer[idx + 1] = 255; buffer[idx + 2] = 255;
          }
        }
      }

      // Star dot above center
      if (Math.hypot(normX, normY + 0.15) < 0.08) {
        buffer[idx] = 255; buffer[idx + 1] = 255; buffer[idx + 2] = 255;
      }
    }
  }

  // Build raw scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // Filter: None
    const row = buffer.subarray(y * width * 4, (y + 1) * width * 4);
    row.copy(scanlines, scanOffset);
    scanOffset += width * 4;
  }

  const deflated = zlib.deflateSync(scanlines);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('Successfully generated all PWA icons.');
