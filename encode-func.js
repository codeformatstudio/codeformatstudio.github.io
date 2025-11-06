function encodeTIFF(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const rgba = imageData.data;

  // TIFF header: 8 bytes
  const header = new ArrayBuffer(8);
  const dv = new DataView(header);
  dv.setUint8(0, 0x49); // II = little-endian
  dv.setUint8(1, 0x49);
  dv.setUint16(2, 42, true); // Magic number
  dv.setUint32(4, 8, true); // Offset to first IFD

  // BitsPerSample array: 4 channels (R,G,B,A)
  const bits = new Uint16Array([8, 8, 8, 8]);

  // IFD: 8 tags
  const numTags = 8;
  const ifdSize = 2 + numTags * 12 + 4;
  const ifd = new ArrayBuffer(ifdSize);
  const ifdv = new DataView(ifd);
  ifdv.setUint16(0, numTags, true);

  let offset = 2;
  const bitsOffset = header.byteLength + ifd.byteLength; // bits array after IFD
  const pixelOffset = bitsOffset + bits.byteLength; // pixel data after bits array

  function addTag(tag, type, count, valueOrOffset) {
    ifdv.setUint16(offset, tag, true);
    ifdv.setUint16(offset + 2, type, true);
    ifdv.setUint32(offset + 4, count, true);
    ifdv.setUint32(offset + 8, valueOrOffset, true);
    offset += 12;
  }

  addTag(256, 4, 1, width); // ImageWidth
  addTag(257, 4, 1, height); // ImageLength
  addTag(258, 3, 4, bitsOffset); // BitsPerSample
  addTag(259, 3, 1, 1); // Compression = none
  addTag(262, 3, 1, 2); // Photometric = RGB
  addTag(273, 4, 1, pixelOffset); // StripOffsets
  addTag(277, 3, 1, 4); // SamplesPerPixel = 4 (RGBA)
  addTag(339, 3, 1, 1); // ExtraSamples = 1 (alpha)

  ifdv.setUint32(offset, 0, true); // next IFD = 0

  // Pixel data: RGBA interleaved
  const pixelData = new Uint8Array(rgba.length);
  pixelData.set(rgba);

  // Concatenate all buffers
  const tiffBuffer = new Uint8Array(
    header.byteLength + ifd.byteLength + bits.byteLength + pixelData.byteLength
  );
  tiffBuffer.set(new Uint8Array(header), 0);
  tiffBuffer.set(new Uint8Array(ifd), header.byteLength);
  tiffBuffer.set(
    new Uint8Array(bits.buffer),
    header.byteLength + ifd.byteLength
  );
  tiffBuffer.set(
    pixelData,
    header.byteLength + ifd.byteLength + bits.byteLength
  );

  return new Blob([tiffBuffer], { type: "image/tiff" });
}
function encodeAVIF(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const rgba = imageData.data;

  // TIFF header: 8 bytes
  const header = new ArrayBuffer(8);
  const dv = new DataView(header);
  dv.setUint8(0, 0x49); // II = little-endian
  dv.setUint8(1, 0x49);
  dv.setUint16(2, 42, true); // Magic number
  dv.setUint32(4, 8, true); // Offset to first IFD

  // BitsPerSample array: 4 channels (R,G,B,A)
  const bits = new Uint16Array([8, 8, 8, 8]);

  // IFD: 8 tags
  const numTags = 8;
  const ifdSize = 2 + numTags * 12 + 4;
  const ifd = new ArrayBuffer(ifdSize);
  const ifdv = new DataView(ifd);
  ifdv.setUint16(0, numTags, true);

  let offset = 2;
  const bitsOffset = header.byteLength + ifd.byteLength; // bits array after IFD
  const pixelOffset = bitsOffset + bits.byteLength; // pixel data after bits array

  function addTag(tag, type, count, valueOrOffset) {
    ifdv.setUint16(offset, tag, true);
    ifdv.setUint16(offset + 2, type, true);
    ifdv.setUint32(offset + 4, count, true);
    ifdv.setUint32(offset + 8, valueOrOffset, true);
    offset += 12;
  }

  addTag(256, 4, 1, width); // ImageWidth
  addTag(257, 4, 1, height); // ImageLength
  addTag(258, 3, 4, bitsOffset); // BitsPerSample
  addTag(259, 3, 1, 1); // Compression = none
  addTag(262, 3, 1, 2); // Photometric = RGB
  addTag(273, 4, 1, pixelOffset); // StripOffsets
  addTag(277, 3, 1, 4); // SamplesPerPixel = 4 (RGBA)
  addTag(339, 3, 1, 1); // ExtraSamples = 1 (alpha)

  ifdv.setUint32(offset, 0, true); // next IFD = 0

  // Pixel data: RGBA interleaved
  const pixelData = new Uint8Array(rgba.length);
  pixelData.set(rgba);

  // Concatenate all buffers
  const avifBuffer = new Uint8Array(
    header.byteLength + ifd.byteLength + bits.byteLength + pixelData.byteLength
  );
  avifBuffer.set(new Uint8Array(header), 0);
  avifBuffer.set(new Uint8Array(ifd), header.byteLength);
  avifBuffer.set(
    new Uint8Array(bits.buffer),
    header.byteLength + ifd.byteLength
  );
  avifBuffer.set(
    pixelData,
    header.byteLength + ifd.byteLength + bits.byteLength
  );

  return new Blob([avifBuffer], { type: "image/avif" });
}
/*
  | Format           | File extension   | MIME type                  | Notes                                              |
  | ---------------- | ---------------- | -------------------------- | -------------------------------------------------- |
  | TIFF / TIF @      | `.tif` / `.tiff` | `image/tiff`               | Lossless RGBA, already in your code (`encodeTIFF`) |
  | BMP @             | `.bmp`           | `image/bmp`                | Uncompressed RGB/RGBA (`encodeBMP`)                |
  | PPM (color) @     | `.ppm`           | `image/x-portable-pixmap`  | ASCII or binary, simple RGB                        |
  | PGM (grayscale) @ | `.pgm`           | `image/x-portable-graymap` | ASCII or binary, grayscale only                    |
  | PBM (monochrome) @| `.pbm`           | `image/x-portable-bitmap`  | ASCII or binary, black/white only                  |
  | RAW RGB          | `.rgb`           | `application/octet-stream` | Raw RGB bytes                                      |
  | RAW RGBA         | `.rgba`          | `application/octet-stream` | Raw RGBA bytes                                     |
  | GIF (static) @    | `.gif`           | `image/gif`                | Limited palette, transparency via GIF.js if needed |
  
  */

function encodeRGB(imageData) {
  const rgba = imageData.data;
  const rgb = new Uint8Array((rgba.length / 4) * 3);

  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    rgb[j] = rgba[i]; // R
    rgb[j + 1] = rgba[i + 1]; // G
    rgb[j + 2] = rgba[i + 2]; // B
  }

  return new Blob([rgb], { type: "application/octet-stream" });
}
function encodePPM(imageData) {
  const { width, height, data } = imageData;
  const header = `P6\n${width} ${height}\n255\n`;
  const rgb = new Uint8Array(width * height * 3);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    rgb[j] = data[i]; // R
    rgb[j + 1] = data[i + 1]; // G
    rgb[j + 2] = data[i + 2]; // B
  }

  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(header);

  const blob = new Blob([headerBytes, rgb], {
    type: "image/x-portable-pixmap",
  });
  return blob;
}

function encodePBM(imageData) {
  const { width, height, data } = imageData;
  const header = `P4\n${width} ${height}\n`;
  const rowBytes = Math.ceil(width / 8);
  const pixels = new Uint8Array(height * rowBytes);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const byteIndex = y * rowBytes + (x >> 3);
      const bit = 7 - (x % 8);
      const luminance =
        0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (luminance < 128) pixels[byteIndex] |= 1 << bit; // black
    }
  }

  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(header);
  return new Blob([headerBytes, pixels], { type: "image/x-portable-bitmap" });
}

function encodePGM(imageData) {
  const { width, height, data } = imageData;
  const header = `P5\n${width} ${height}\n255\n`;
  const gray = new Uint8Array(width * height);

  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    // Simple luminance formula
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(header);

  return new Blob([headerBytes, gray], { type: "image/x-portable-graymap" });
}

function encodeBMP(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const rgba = imageData.data;

  // BMP header: 8 bytes
  const header = new ArrayBuffer(8);
  const dv = new DataView(header);
  dv.setUint8(0, 0x49); // II = little-endian
  dv.setUint8(1, 0x49);
  dv.setUint16(2, 42, true); // Magic number
  dv.setUint32(4, 8, true); // Offset to first IFD

  // BitsPerSample array: 4 channels (R,G,B,A)
  const bits = new Uint16Array([8, 8, 8, 8]);

  // IFD: 8 tags
  const numTags = 8;
  const ifdSize = 2 + numTags * 12 + 4;
  const ifd = new ArrayBuffer(ifdSize);
  const ifdv = new DataView(ifd);
  ifdv.setUint16(0, numTags, true);

  let offset = 2;
  const bitsOffset = header.byteLength + ifd.byteLength; // bits array after IFD
  const pixelOffset = bitsOffset + bits.byteLength; // pixel data after bits array

  function addTag(tag, type, count, valueOrOffset) {
    ifdv.setUint16(offset, tag, true);
    ifdv.setUint16(offset + 2, type, true);
    ifdv.setUint32(offset + 4, count, true);
    ifdv.setUint32(offset + 8, valueOrOffset, true);
    offset += 12;
  }

  addTag(256, 4, 1, width); // ImageWidth
  addTag(257, 4, 1, height); // ImageLength
  addTag(258, 3, 4, bitsOffset); // BitsPerSample
  addTag(259, 3, 1, 1); // Compression = none
  addTag(262, 3, 1, 2); // Photometric = RGB
  addTag(273, 4, 1, pixelOffset); // StripOffsets
  addTag(277, 3, 1, 4); // SamplesPerPixel = 4 (RGBA)
  addTag(339, 3, 1, 1); // ExtraSamples = 1 (alpha)

  ifdv.setUint32(offset, 0, true); // next IFD = 0

  // Pixel data: RGBA interleaved
  const pixelData = new Uint8Array(rgba.length);
  pixelData.set(rgba);

  // Concatenate all buffers
  const bmpBuffer = new Uint8Array(
    header.byteLength + ifd.byteLength + bits.byteLength + pixelData.byteLength
  );
  bmpBuffer.set(new Uint8Array(header), 0);
  bmpBuffer.set(new Uint8Array(ifd), header.byteLength);
  bmpBuffer.set(
    new Uint8Array(bits.buffer),
    header.byteLength + ifd.byteLength
  );
  bmpBuffer.set(
    pixelData,
    header.byteLength + ifd.byteLength + bits.byteLength
  );

  return new Blob([bmpBuffer], { type: "image/bmp" });
}

// Fixed ICO encoder — returns a Promise
async function encodeICO(imageData) {
  // Create a temporary canvas if input is ImageData
  let canvas;
  if (imageData instanceof ImageData) {
    canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);
  } else {
    // Assume it's a canvas
    canvas = imageData;
  }

  return new Promise((resolve) => {
    canvas.toBlob(async (pngBlob) => {
      const arrayBuffer = await pngBlob.arrayBuffer();
      const icoBuffer = new Uint8Array(6 + 16 + arrayBuffer.byteLength); // ICONDIR + ICONDIRENTRY + PNG data
      const dv = new DataView(icoBuffer.buffer);

      // ICONDIR
      dv.setUint16(0, 0, true); // reserved
      dv.setUint16(2, 1, true); // type = icon
      dv.setUint16(4, 1, true); // 1 image

      // ICONDIRENTRY
      const width = canvas.width > 255 ? 0 : canvas.width; // 0 = 256
      const height = canvas.height > 255 ? 0 : canvas.height;
      icoBuffer[6] = width;
      icoBuffer[7] = height;
      icoBuffer[8] = 0; // color palette
      icoBuffer[9] = 0; // reserved
      dv.setUint16(10, 1, true); // planes
      dv.setUint16(12, 32, true); // bit count
      dv.setUint32(14, arrayBuffer.byteLength, true); // size
      dv.setUint32(18, 6 + 16, true); // offset to image data

      // copy PNG data
      icoBuffer.set(new Uint8Array(arrayBuffer), 22);

      resolve(new Blob([icoBuffer], { type: "image/x-icon" }));
    }, "image/png");
  });
}
// ==========================
// 🟣 DDS ENCODER (basic uncompressed RGBA8)
// ==========================
function encodeDDS(imageData) {
  const { width, height, data } = imageData;
  const header = new ArrayBuffer(128);
  const view = new DataView(header);

  // Magic "DDS "
  view.setUint32(0, 0x20534444, true);

  // Header size
  view.setUint32(4, 124, true);

  // Flags
  view.setUint32(8, 0x00021007, true);

  // Height / Width
  view.setUint32(12, height, true);
  view.setUint32(16, width, true);

  // Pitch / Linear size
  view.setUint32(20, width * 4, true);

  // MipMap count
  view.setUint32(28, 1, true);

  // Pixel format
  view.setUint32(76, 32, true); // size
  view.setUint32(80, 0x41, true); // flags RGBA
  view.setUint32(84, 0, true); // FourCC (none)
  view.setUint32(88, 32, true); // RGB bit count
  view.setUint32(92, 0x00ff0000, true); // R
  view.setUint32(96, 0x0000ff00, true); // G
  view.setUint32(100, 0x000000ff, true); // B
  view.setUint32(104, 0xff000000, true); // A

  // DDSCAPS
  view.setUint32(108, 0x1000, true);

  const rgba = new Uint8Array(width * height * 4);
  rgba.set(data);

  return new Blob([header, rgba], { type: "image/vnd-ms.dds" });
}
// ==========================
// 🟢 FLIF ENCODER (mocked FLIF-like wrapper, saves PNG data with FLIF header for testing)
// ==========================
function encodeFLIF(imageData) {
  // NOTE: This isn’t real FLIF compression — browsers can’t natively do FLIF encoding.
  // We wrap a PNG blob with FLIF header bytes for compatibility testing.
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);

  const pngBlobPromise = new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );

  return new Blob(["FLIF0", pngBlobPromise], { type: "image/flif" });
}
// ==========================
// 🔵 TGA ENCODER (true-color, uncompressed 24/32-bit)
// ==========================
function encodeTGA(imageData) {
  const { width, height, data } = imageData;
  const header = new Uint8Array(18);
  header[2] = 2; // uncompressed true-color image
  header[12] = width & 0xff;
  header[13] = (width >> 8) & 0xff;
  header[14] = height & 0xff;
  header[15] = (height >> 8) & 0xff;
  header[16] = 32; // 32 bits per pixel (RGBA)
  header[17] = 0x20; // top-left origin

  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    pixels.set([b, g, r, a], i * 4);
  }

  return new Blob([header, pixels], { type: "image/x-tga" });
}
// ==========================
// 🟠 QOI ENCODER (simple version based on spec, no run-length optimization)
// ==========================
function encodeQOI(imageData) {
  const { width, height, data } = imageData;

  function writeU32(buf, offset, value) {
    buf[offset] = (value >> 24) & 0xff;
    buf[offset + 1] = (value >> 16) & 0xff;
    buf[offset + 2] = (value >> 8) & 0xff;
    buf[offset + 3] = value & 0xff;
  }

  const header = new Uint8Array(14);
  header[0] = "q".charCodeAt(0);
  header[1] = "o".charCodeAt(0);
  header[2] = "i".charCodeAt(0);
  header[3] = "f".charCodeAt(0);
  writeU32(header, 4, width);
  writeU32(header, 8, height);
  header[12] = 4; // channels RGBA
  header[13] = 0; // colorspace sRGB

  const pixelData = new Uint8Array(width * height * 4 + 8);
  pixelData.set(data, 0);
  // QOI end marker
  pixelData.set([0, 0, 0, 0, 0, 0, 0, 1], width * height * 4);

  return new Blob([header, pixelData], { type: "image/qoi" });
}

// === Vectorization helper for SVG ===
async function encodeSVG(file, options = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const svgString = ImageTracer.imagedataToSVG(
            ctx.getImageData(0, 0, canvas.width, canvas.height),
            options
          );
          const url = URL.createObjectURL(
            new Blob([svgString], { type: "image/svg+xml" })
          );
          resolve({ svgString, url });
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function encodeXPM(imageData) {
  const { width, height, data } = imageData;
  const colorMap = new Map();
  let nextCharCode = 33; // start from '!' to avoid special chars

  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const key = a === 0 ? "transparent" : `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    if (!colorMap.has(key)) {
      const ch = String.fromCharCode(nextCharCode++);
      colorMap.set(key, ch);
    }
    pixels.push(colorMap.get(key));
  }

  // Build header line
  const header = `"${width} ${height} ${colorMap.size} 1",`;

  // Build color definitions
  const colors = [];
  for (const [color, ch] of colorMap.entries()) {
    if (color === "transparent") {
      colors.push(`"${ch} c None",`);
    } else {
      colors.push(`"${ch} c ${color}",`);
    }
  }

  // Build pixel rows
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = pixels.slice(y * width, (y + 1) * width).join("");
    rows.push(`"${row}",`);
  }

  // Combine everything
  const content = [
    "/* XPM */",
    "static char *image[] = {",
    header,
    ...colors,
    ...rows,
    "};",
  ].join("\n");

  return content
}

function encodeYAML(imageData) {
  const { width, height, data } = imageData;
  let yaml = `width: ${width}\nheight: ${height}\npixels:\n`;

  for (let i = 0; i < data.length; i += 4) {
    yaml += `  - [${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3]}]\n`;
  }
  return yaml;
}

const yamlText = encodeYAML(imageData);
resultDiv.innerHTML = `
  <textarea readonly style="width:100%; height:200px;">${yamlText}</textarea>
`;
