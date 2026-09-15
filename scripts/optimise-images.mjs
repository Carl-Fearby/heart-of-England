import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sources = new Set();
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(jpe?g|png|webp)$/i.test(file)) sources.add("/" + file.slice("public/".length));
  }
}
await walk("public/images");
await walk("public/migrated");

const mapping = JSON.parse(await fs.readFile("app/data/source-asset-map.json", "utf8"));
for (const name of ["heart-of-england-pages", "heart-of-england-posts", "quicken-tree-pages", "quicken-tree-posts"]) {
  const records = JSON.parse(await fs.readFile(`app/data/${name}.json`, "utf8"));
  for (const record of records) {
    for (const tag of record.content.rendered.match(/<img\b[^>]*>/gi) || []) {
      const src = tag.match(/\bsrc=["']([^"']+)/i)?.[1];
      if (src && mapping[src]) sources.add(mapping[src]);
    }
  }
}

await fs.mkdir("public/optimised", { recursive: true });
const manifest = {};
let originalBytes = 0, optimisedBytes = 0;
for (const src of [...sources].sort()) {
  const file = "public" + src;
  try {
    const data = await fs.readFile(file);
    const meta = await sharp(data).metadata();
    if (!meta.width || !meta.height) continue;
    const hash = crypto.createHash("sha256").update(data).digest("hex").slice(0, 16);
    const widths = [...new Set([480, 960, 1600].map(w => Math.min(w, meta.width)))];
    const variants = [];
    for (const width of widths) {
      const url = `/optimised/${hash}-${width}.webp`;
      const result = await sharp(data).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile("public" + url);
      variants.push({ src: url, width: result.width });
      if (width === widths.at(-1)) optimisedBytes += result.size;
    }
    originalBytes += data.length;
    manifest[src] = { width: meta.width, height: meta.height, variants };
  } catch (error) {
    console.warn(`Skipped ${src}: ${error.message}`);
  }
}
await fs.writeFile("app/data/optimised-images.json", JSON.stringify(manifest));
console.log(`Optimised ${Object.keys(manifest).length} images: ${(originalBytes / 1e6).toFixed(1)} MB → ${(optimisedBytes / 1e6).toFixed(1)} MB at largest size.`);
