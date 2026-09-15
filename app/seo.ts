export const canonicalAliases: Record<string, string> = {
  "/home": "/", "/contact": "/contact-us/", "/spaces": "/rooms-and-spaces/", "/about": "/about-us/",
};
export function canonicalPath(path: string) {
  const clean = path.replace(/\/$/, "") || "/";
  return canonicalAliases[clean] || (clean === "/" ? "/" : `${clean}/`);
}
