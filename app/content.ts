import optimisedImages from "./data/optimised-images.json";
import pages from "./data/heart-of-england-pages.json";
import posts from "./data/heart-of-england-posts.json";
import quickenPages from "./data/quicken-tree-pages.json";
import quickenPosts from "./data/quicken-tree-posts.json";
import sourceAssetMap from "./data/source-asset-map.json";

type RecordItem={slug:string;title:{rendered:string};content:{rendered:string};excerpt:{rendered:string};date?:string};
export const livePages=pages as RecordItem[];export const livePosts=posts as RecordItem[];
export const quickenTreePages=quickenPages as RecordItem[];export const quickenTreePosts=quickenPosts as RecordItem[];
const decode=(value:string)=>value.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#8217;/g,"’").replace(/&#8211;/g,"–").replace(/&#8212;/g,"—").replace(/&lt;/g,"<").replace(/&gt;/g,">");
export function textBlocks(html:string){const plain=decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi,"").replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section)>/gi,"\n").replace(/<[^>]+>/g," ").replace(/\r/g,"").replace(/[ \t]+/g," ").replace(/\n[ \t]+/g,"\n"));return plain.split(/\n+/).map(x=>x.trim()).filter(x=>x.length>35&&!/^(window\.|SR7\.|function\(|var |const |let |jQuery)/.test(x));}
const localAssets=sourceAssetMap as Record<string,string>;
const uploaded=/https?:\/\/(?:www\.)?(?:heartofengland\.uk|quickentree\.uk)\/wp-content\/uploads\/[^\"'\s<]+/i;
function assetUrl(value:string){const clean=decode(value.replaceAll("\\/","/").replace(/&#(?:0*39|x27);.*/i,"")).replace(/^\/\//,"https://").replace(/^http:\/\//i,"https://");const local=localAssets[value]||localAssets[clean];if(local)return local;try{const url=new URL(clean);if(/^(heartofengland\.uk|quickentree\.uk)$/i.test(url.hostname))return `/migrated/${url.hostname}${url.pathname}`;}catch{}return clean;}
export function contentMedia(html:string){const seen=new Set<string>();const items:{src:string;alt:string}[]=[];for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const src=tag.match(/\b(?:src|data-src)=["']([^"']+)/i)?.[1],normal=src?.replace(/^\/\//,"https://");if(!normal||!uploaded.test(normal))continue;const local=assetUrl(normal);if(!(local in optimisedImages)||seen.has(local))continue;seen.add(local);items.push({src:local,alt:decode(tag.match(/\balt=["']([^"']*)/i)?.[1]||"")});}return items;}
export function contentDocuments(html:string){const seen=new Set<string>();const items:{href:string;label:string}[]=[];for(const anchor of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi)||[]){const href=anchor.match(/\bhref=["']([^"']+)/i)?.[1];if(!href||!/\.pdf(?:[?#]|$)/i.test(href))continue;const label=cleanTitle(anchor)||"Download document";const local=assetUrl(href);if(seen.has(local))continue;seen.add(local);items.push({href:local,label});}return items;}
export function cleanTitle(value:string){return decode(value.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim());}
