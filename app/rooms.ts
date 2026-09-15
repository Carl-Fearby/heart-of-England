import data from "./data/rooms.json";
export type Layout = "Theatre" | "Cabaret" | "Dinner" | "Boardroom" | "U-shape" | "Classroom";
export type Room = { slug: string; name: string; image: string; uses: string[]; access: string; features: string[]; layouts: Record<Layout, number | null>; spec: string };
export const rooms = data as Room[];
export const layouts: Layout[] = ["Theatre", "Cabaret", "Dinner", "Boardroom", "U-shape", "Classroom"];
export function capacity(room: Room, layout: string) {
  return layout ? room.layouts[layout as Layout] : Math.max(...Object.values(room.layouts).filter((value): value is number => value !== null));
}
export function filterRooms(guests: string, use: string, layout: string) {
  const count = Number(guests);
  return rooms.filter(room => (!use || room.uses.includes(use)) && (!layout || capacity(room, layout) !== null) && (!guests || (Number.isFinite(count) && count > 0 && (capacity(room, layout) ?? 0) >= count)));
}
