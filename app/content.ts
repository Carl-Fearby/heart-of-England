import pages from "./data/heart-of-england-pages.json";
import posts from "./data/heart-of-england-posts.json";
import quickenPages from "./data/quicken-tree-pages.json";
import quickenPosts from "./data/quicken-tree-posts.json";
import subsitePages from "./data/subsite-pages.json";
import derivedPages from "./data/derived-pages.json";
import sourceAssetMap from "./data/source-asset-map.json";

type RecordItem={slug:string;title:{rendered:string};content:{rendered:string};excerpt:{rendered:string};date?:string;link?:string};
export const livePages=pages as RecordItem[];export const livePosts=posts as RecordItem[];
export const subsiteLivePages=subsitePages as RecordItem[];
export const derivedLivePages=derivedPages as RecordItem[];
export const quickenTreePages=quickenPages as RecordItem[];export const quickenTreePosts=quickenPosts as RecordItem[];
const decode=(value:string)=>value.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#8217;/g,"’").replace(/&#8211;/g,"–").replace(/&#8212;/g,"—").replace(/&hellip;/g,"…").replace(/\[&hellip;\]/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">");
const skipBlock=/^(window\.|SR7\.|function\(|var |const |let |jQuery|CLICK BELOW|TAKE A VIRTUAL TOUR|SEE ALL THE CONFERENCE|VIRTUAL TOUR|GET IN TOUCH TODAY|SEE FULL ROOM SPEC|OTHER ROOMS|SPEC ON ALL ROOMS|DOWNLOAD THE CONFERENCE BROCHURE|READ MORE|VAT REG)/i;
const garbageBlock=/data-settings|data-element_type|data-e-type|elementor-|data-id=|<\/?section|<\/?div |class="|_ob_bbad|&quot;background|&quot;stretch_section/i;
function cleanInline(value:string){return decode(value.replace(/<br\s*\/?>/gi,"\n").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());}
function isUsefulText(value:string){return value.length>2&&!skipBlock.test(value)&&!garbageBlock.test(value)&&!/^\d{3,}$/.test(value)&&!/^01676/.test(value);}
export function textBlocks(html:string){const plain=decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,"").replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section)>/gi,"\n").replace(/<[^>]+>/g," ").replace(/\r/g,"").replace(/[ \t]+/g," ").replace(/\n[ \t]+/g,"\n"));return plain.split(/\n+/).map(x=>x.trim()).filter(x=>x.length>25&&isUsefulText(x));}
export type ContentBlock={type:"heading";level:number;text:string}|{type:"paragraph";text:string}|{type:"list";items:string[]}|{type:"image";src:string;alt:string};
function headingLevel(tag:string,text:string){const level=Number(tag);if(level>=1&&level<=6)return level;return text.length<60?2:3;}
export function contentBlocks(html:string){const cleaned=html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,"");const matches:{index:number;block:ContentBlock}[]=[];const seenText=new Set<string>();const seenLists=new Set<string>();const add=(index:number,block:ContentBlock)=>{if(block.type==="paragraph"||block.type==="heading"){if(seenText.has(block.text))return;seenText.add(block.text);}if(block.type==="list"){const key=block.items.join("|");if(seenLists.has(key))return;seenLists.add(key);}matches.push({index,block});};for(const match of cleaned.matchAll(/<h([1-6])[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/h\1>/gi)){const text=cleanInline(match[2]);if(isUsefulText(text))add(match.index??0,{type:"heading",level:headingLevel(match[1],text),text});}for(const match of cleaned.matchAll(/elementor-widget-text-editor[\s\S]*?<div class="elementor-widget-container">([\s\S]*?)<\/div>\s*<\/div>/gi)){const inner=match[1];const base=match.index??0;for(const heading of inner.matchAll(/<h([3-6])[^>]*>([\s\S]*?)<\/h\1>/gi)){const text=cleanInline(heading[2]);if(isUsefulText(text))add(base+(heading.index??0),{type:"heading",level:headingLevel(heading[1],text),text});}for(const paragraph of inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)){const text=cleanInline(paragraph[1]);if(text.length>20&&isUsefulText(text))add(base+(paragraph.index??0),{type:"paragraph",text});}}for(const match of cleaned.matchAll(/elementor-widget-icon-list[\s\S]*?<ul class="elementor-icon-list-items">([\s\S]*?)<\/ul>/gi)){const items=[...match[1].matchAll(/elementor-icon-list-text[^>]*>([\s\S]*?)<\//gi)].map(item=>cleanInline(item[1])).filter(isUsefulText);if(items.length)add(match.index??0,{type:"list",items});}for(const [index,image]of contentMedia(cleaned).entries())add(1_000_000+index,{type:"image",src:image.src,alt:image.alt});return matches.sort((a,b)=>a.index-b.index).map(item=>item.block);}
const localAssets=sourceAssetMap as Record<string,string>;
const uploaded=/https?:\/\/(?:www\.)?(?:heartofengland\.uk|quickentree\.uk|weddingsatheart\.uk|teambuildingatheart\.co\.uk|stayatheart\.co\.uk)\/wp-content\/uploads\/[^\"'\s<]+/i;
function normaliseSourceUrl(value: string) {
  const clean = decode(value.replaceAll("\\/", "/").replace(/&#(?:0*39|x27);.*/i, "")).trim();
  if (clean.startsWith("//")) return `https:${clean}`;
  if (clean.startsWith("http://")) return `https://${clean.slice("http://".length)}`;
  return clean;
}
function assetUrl(value: string) {
  const clean = normaliseSourceUrl(value);
  const local = localAssets[value] || localAssets[clean];
  if (local) return local;
  try {
    const url = new URL(clean);
    const host = url.hostname.replace(/^www\./, "");
    if (/^(heartofengland\.uk|quickentree\.uk|weddingsatheart\.uk|teambuildingatheart\.co\.uk|stayatheart\.co\.uk)$/i.test(host)) return `/migrated/${host}${url.pathname}`;
  } catch {}
  return clean;
}
const uploadPattern=/(?:https?:)?\/\/(?:www\.)?(?:heartofengland\.uk|quickentree\.uk|weddingsatheart\.uk|teambuildingatheart\.co\.uk|stayatheart\.co\.uk)\/wp-content\/uploads\/[^"'\\\s<>)]+/gi;
function imageStem(value:string){const file=value.split("/").pop()?.split("?")[0]||"";return file.replace(/-\d+x\d+(?=\.[a-z]+$)/i,"").replace(/-scaled(?=\.[a-z]+$)/i,"");}
function imageScore(value:string){const file=value.split("/").pop()||"";let score=0;if(!/-\d+x\d+\.[a-z]+$/i.test(file))score+=10;if(/scaled/i.test(file))score+=5;return score+file.length/100;}
function addMediaCandidate(store:Map<string,{src:string;alt:string;score:number}>,raw:string,alt=""){const normal=normaliseSourceUrl(raw.startsWith("//")?`https:${raw}`:raw.startsWith("http")?raw:`https://${raw.replace(/^\/+/,"")}`);if(!uploaded.test(normal))return;const local=assetUrl(normal);const stem=imageStem(local);const score=imageScore(local);const current=store.get(stem);if(!current||score>current.score)store.set(stem,{src:local,alt:current?.alt||alt,score});}
export function contentMedia(html:string){const store=new Map<string,{src:string;alt:string;score:number}>();for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const src=tag.match(/\b(?:src|data-src|data-lazyload)=["']([^"']+)/i)?.[1];if(src)addMediaCandidate(store,src,decode(tag.match(/\balt=["']([^"']*)/i)?.[1]||""));const srcset=tag.match(/\bsrcset=["']([^"']+)/i)?.[1];if(srcset)for(const part of srcset.split(",")){const url=part.trim().split(/\s+/)[0];if(url)addMediaCandidate(store,url);}}for(const match of html.matchAll(/background-image:\s*url\((['"]?)([^'")]+)\1\)/gi))addMediaCandidate(store,match[2]);for(const match of html.matchAll(/\bdata-bg=["']([^"']+)/gi))addMediaCandidate(store,match[1]);for(const match of html.matchAll(uploadPattern))addMediaCandidate(store,match[0]);return [...store.values()].sort((a,b)=>b.score-a.score).map(({src,alt})=>({src,alt}));}
export function contentDocuments(html:string){const seen=new Set<string>();const items:{href:string;label:string}[]=[];for(const anchor of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi)||[]){const href=anchor.match(/\bhref=["']([^"']+)/i)?.[1];if(!href||!/\.pdf(?:[?#]|$)/i.test(href))continue;const label=cleanTitle(anchor)||"Download document";const local=assetUrl(href);if(seen.has(local))continue;seen.add(local);items.push({href:local,label});}return items;}
export function cleanTitle(value:string){return decode(value.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());}
