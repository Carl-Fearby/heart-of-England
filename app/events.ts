export type VenueEvent = {
  id: string; title: string; dates: string[]; dateLabel: string; price: string;
  description: string; image: string; href: string; bookingUrl?: string; bookingLabel?: string;
};
// Confirm dates and prices with the event owner before changing them.
// Sources: migrated event pages and christmasattheheart.co.uk, reviewed 15 September 2026.
export const venueEvents: VenueEvent[] = [
  {
    id: "retro-and-classic-car-show", title: "Retro & Classic Vehicle Show",
    dates: ["2026-09-17", "2026-10-01"], dateLabel: "17 September & 1 October 2026", price: "Free entry",
    description: "A relaxed visit for vehicle enthusiasts. Weather permitting; the bar and restaurant are open.",
    image: "/migrated/heartofengland.uk/wp-content/uploads/2026/07/New-Poster-724x1024.jpg", href: "/retro-and-classic-car-show/",
  },
  {
    id: "kids-halloween", title: "Kids Halloween Spooktacular",
    dates: ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30"], dateLabel: "26–30 October 2026 · 4–8pm", price: "Children £15 · Adults £5",
    description: "Family Halloween games and a spooky woodland train ride. Pre-booking is essential.",
    image: "/migrated/heartofengland.uk/wp-content/uploads/2026/09/Kids-Halloween-Poster-2026-724x1024.jpg", href: "/quicken-tree/kids-halloween/",
    bookingUrl: "https://heartofengland.angelfishbooking.co.uk/book/kids-halloween", bookingLabel: "Book Halloween tickets",
  },
  {
    id: "christmas-parties", title: "Cowboy Christmas Party Nights",
    dates: ["2026-11-27", "2026-11-28", "2026-12-04", "2026-12-05", "2026-12-11", "2026-12-12", "2026-12-18", "2026-12-19", "2026-12-31"], dateLabel: "Selected nights, 27 November–31 December 2026", price: "From £85 per person",
    description: "Festive dining and live entertainment. See the Christmas website for dates, packages and booking terms.",
    image: "/migrated/heartofengland.uk/wp-content/uploads/2026/01/CoolCowboySantaPOSTER-724x1024.jpg", href: "https://christmasattheheart.co.uk/",
    bookingUrl: "tel:01676540333", bookingLabel: "Call to book Christmas parties",
  },
  {
    id: "santas-grotto", title: "Santa’s Grotto & Magical Train Ride",
    dates: ["2026-12-05", "2026-12-06", "2026-12-12", "2026-12-13", "2026-12-19", "2026-12-20", "2026-12-21", "2026-12-22", "2026-12-23", "2026-12-24"], dateLabel: "Selected dates, 5–24 December 2026", price: "Adults £13 · Children 16 & under £27.50 · Infants up to 2 £5",
    description: "A festive train journey, Santa’s grotto and VR sleigh experience. Booking fees may apply; check the booking page.",
    image: "/migrated/heartofengland.uk/wp-content/uploads/2026/09/HOEGrotto2026af-724x1024.jpg", href: "https://christmasattheheart.co.uk/santas-grotto",
    bookingUrl: "https://heartofengland.angelfishbooking.co.uk/book/santa%27s-grotto-and-vr-sleigh-experience", bookingLabel: "Book Santa’s grotto",
  },
];
export function upcomingEvents(today: string) {
  return venueEvents.filter(event => event.dates.some(date => date >= today)).sort((a, b) =>
    a.dates.find(date => date >= today)!.localeCompare(b.dates.find(date => date >= today)!));
}
