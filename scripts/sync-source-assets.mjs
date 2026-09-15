import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sources = [
  "app/data/heart-of-england-pages.json",
  "app/data/heart-of-england-posts.json",
  "app/data/quicken-tree-pages.json",
  "app/data/quicken-tree-posts.json",
  "app/data/subsite-pages.json",
  "app/data/derived-pages.json",
];
const uploads = /(?:https?:)?\/\/(?:www\.)?(?:heartofengland\.uk|quickentree\.uk|weddingsatheart\.uk|teambuildingatheart\.co\.uk|stayatheart\.co\.uk)\/wp-content\/uploads\/[^\"'\s<)]+/gi;
const urls = new Set();
function collectUrls(html) {
  for (const match of html.matchAll(uploads)) {
    const raw = match[0].replaceAll("\\/", "/").replaceAll("&amp;", "&").replace(/&#(?:0*39|x27);.*/i, "");
    urls.add(raw.startsWith("//") ? `https:${raw}` : raw.replace(/^http:\/\//i, "https://"));
  }
}

for (const source of sources) {
  const records = JSON.parse(await (await import("node:fs/promises")).readFile(source, "utf8"));
  for (const record of records) for (const field of ["content", "excerpt"]) {
    collectUrls(record[field]?.rendered ?? "");
  }
}

const mapping = {};
const failures = [];
async function download(originalUrl) {
  const sourceUrl = originalUrl.replace(/^http:\/\//i, "https://");
  const source = new URL(sourceUrl);
  const relative = path.posix.join(source.hostname.replace(/^www\./, ""), source.pathname.replace(/^\/+/, ""));
  const destination = path.join("public", "migrated", relative);
  try {
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(12000), headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, Buffer.from(await response.arrayBuffer()));
    mapping[originalUrl] = `/${path.posix.join("migrated", relative)}`;
    mapping[sourceUrl] = mapping[originalUrl];
  } catch (error) {
    failures.push({ url: originalUrl, error: String(error) });
  }
}
const queue = [...urls];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) await download(queue.shift());
}));
await writeFile("app/data/source-asset-map.json", `${JSON.stringify(mapping, null, 2)}\n`);
await writeFile("app/data/source-asset-failures.json", `${JSON.stringify(failures, null, 2)}\n`);
console.log(`Downloaded ${Object.keys(mapping).length} mapped entries from ${urls.size} referenced source assets.`);
