// Reads the width and height of every image in src/images at build time,
// so the gallery wall can show each photo at its natural shape (no cropping).
// Result looks like: { "photography/harbor.jpg": { width: 2400, height: 1600, ratio: 1.5 } }
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "src/images";
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
  );
  return files.flat();
}

export default async function () {
  const sizes = {};
  for (const file of (await walk(ROOT)).filter((f) => IMAGE_EXT.test(f))) {
    const meta = await sharp(file).metadata();
    // Phone photos are often stored sideways with a "rotate me" flag (EXIF 5–8).
    const sideways = (meta.orientation || 1) >= 5;
    const width = sideways ? meta.height : meta.width;
    const height = sideways ? meta.width : meta.height;
    const key = path.relative(ROOT, file).split(path.sep).join("/");
    sizes[key] = { width, height, ratio: Math.round((width / height) * 1000) / 1000 };
  }
  return sizes;
}
