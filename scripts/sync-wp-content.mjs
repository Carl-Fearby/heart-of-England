import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "app/data");

const conferenceTopics = [
  { sectionId: "conferences", slug: "conferences", title: "Conferences" },
  { sectionId: "productlaunches", slug: "product-launches", title: "Product launches" },
  { sectionId: "exhibitions", slug: "exhibitions", title: "Exhibitions" },
  { sectionId: "DDR", slug: "ddr-packages", title: "DDR packages" },
  { sectionId: "AV", slug: "av-and-technical-support", title: "AV and technical support" },
];

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed ${url}: ${response.status}`);
  return response.json();
}

function pickPage(record) {
  return {
    slug: record.slug,
    link: record.link,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
  };
}

function extractSectionHtml(html, sectionId) {
  const openTag = new RegExp(`<section\\b[^>]*\\bid=["']${sectionId}["'][^>]*>`, "i");
  const match = html.match(openTag);
  if (!match || match.index === undefined) return null;
  const start = match.index;
  const tagPattern = /<\/?section\b[^>]*>/gi;
  tagPattern.lastIndex = start;
  let depth = 0;
  let tag;
  while ((tag = tagPattern.exec(html))) {
    if (tag[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) return html.slice(start, tag.index + tag[0].length);
    } else {
      depth += 1;
    }
  }
  return null;
}

function firstParagraph(html) {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return "";
  return decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function splitConferencePages(pages) {
  const conferences = pages.find(page => page.slug === "conferences");
  if (!conferences) return { pages, derived: [] };

  const derived = [];
  const sectionHtml = {};
  for (const topic of conferenceTopics) {
    const chunk = extractSectionHtml(conferences.content.rendered, topic.sectionId);
    if (!chunk) continue;
    sectionHtml[topic.slug] = chunk;
    const intro = firstParagraph(chunk);
    derived.push({
      slug: topic.slug,
      link: `https://heartofengland.uk/${topic.slug}/`,
      title: { rendered: topic.title },
      excerpt: { rendered: intro ? `<p>${intro}</p>` : conferences.excerpt.rendered },
      content: { rendered: chunk },
    });
  }

  const nextPages = pages.map(page => {
    if (page.slug !== "conferences") return page;
    const conferencesOnly = sectionHtml.conferences;
    if (!conferencesOnly) return page;
    const intro = firstParagraph(conferencesOnly);
    return {
      ...page,
      excerpt: intro ? { rendered: `<p>${intro}</p>` } : page.excerpt,
      content: { rendered: conferencesOnly },
    };
  });

  return { pages: nextPages, derived: derived.filter(page => page.slug !== "conferences") };
}

async function syncMainPages() {
  const pages = await fetchJson("https://heartofengland.uk/wp-json/wp/v2/pages?per_page=100&status=publish");
  const picked = pages.map(pickPage);
  const { pages: splitPages, derived } = splitConferencePages(picked);
  writeFileSync(path.join(dataDir, "heart-of-england-pages.json"), `${JSON.stringify(splitPages)}\n`);
  writeFileSync(path.join(dataDir, "derived-pages.json"), `${JSON.stringify(derived)}\n`);
  console.log(`Synced ${splitPages.length} Heart of England pages and ${derived.length} derived conference topic pages`);
}

function extractMainHtml(html, selectors) {
  for (const selector of selectors) {
    const pattern = selector === "elementor"
      ? /<div data-elementor-type="wp-page"[\s\S]*<\/div>\s*<\/div>\s*<\/div>\s*<\/article>/i
      : new RegExp(`<${selector}[^>]*>([\\s\\S]*?)<\\/${selector}>`, "i");
    const match = html.match(pattern);
    if (match) return match[0].length > 500 ? match[0] : match[1] || match[0];
  }
  return html;
}

function htmlIntro(html) {
  const paragraph = extractParagraphs(html).find(text => text.length > 80 && !/cookie|copyright|vat reg|read more/i.test(text));
  return paragraph || "Discover more at Heart of England.";
}

async function syncSubsitePages() {
  const [weddings] = await fetchJson("https://weddingsatheart.uk/wp-json/wp/v2/pages?slug=weddings-at-the-heart-of-england");
  const teamHtml = await (await fetch("https://teambuildingatheart.co.uk/")).text();
  const stayHtml = await (await fetch("https://stayatheart.co.uk/")).text();
  const teamContent = extractMainHtml(teamHtml, ["elementor", "main", "article"]);
  const stayContent = extractMainHtml(stayHtml, ["main", "article", "body"]);

  const subsitePages = [
    {
      slug: "weddings",
      link: "https://weddingsatheart.uk/",
      title: { rendered: "Weddings" },
      excerpt: weddings.excerpt,
      content: weddings.content,
    },
    {
      slug: "team-building",
      link: "https://teambuildingatheart.co.uk/",
      title: { rendered: "Team building" },
      excerpt: { rendered: `<p>${htmlIntro(teamContent)}</p>` },
      content: { rendered: teamContent },
    },
    {
      slug: "accommodation",
      link: "https://stayatheart.co.uk/",
      title: { rendered: "Accommodation" },
      excerpt: { rendered: `<p>${htmlIntro(stayContent)}</p>` },
      content: { rendered: stayContent },
    },
  ];

  writeFileSync(path.join(dataDir, "subsite-pages.json"), `${JSON.stringify(subsitePages)}\n`);
  console.log(`Synced ${subsitePages.length} subsite pages`);
}

function extractParagraphs(html) {
  const paragraphs = [];
  for (const match of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = decodeHtml(match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    if (text) paragraphs.push(text);
  }
  return paragraphs;
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

await syncMainPages();
await syncSubsitePages();
