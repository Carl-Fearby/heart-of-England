export type NavLink = { label: string; href: string };
export type NavNode = { label: string; href?: string; children?: NavNode[] };

export const whatWeDoMenu: NavNode[] = [
  { label: "What we do", href: "/what-we-do/" },
  {
    label: "Corporate",
    children: [
      { label: "Conferences", href: "/conferences/" },
      { label: "Product launches", href: "/product-launches/" },
      { label: "Exhibitions", href: "/exhibitions/" },
      {
        label: "Team building",
        children: [
          { label: "Fun days", href: "https://teambuildingatheart.co.uk/" },
          { label: "Festivals", href: "/#teambuilding" },
          { label: "Offsite hire", href: "/#teambuilding" },
        ],
      },
      { label: "Wellbeing workshops", href: "/wellbeing-workshops/" },
      { label: "DDR packages", href: "/ddr-packages/" },
      { label: "AV and technical support", href: "/av-and-technical-support/" },
      { label: "Open air wellness", href: "/about-us/#open-air-wellness" },
      { label: "Catering", href: "/catering/" },
    ],
  },
  { label: "Conferences", href: "/conferences/" },
  { label: "Product launches", href: "/product-launches/" },
  { label: "Exhibitions", href: "/exhibitions/" },
  { label: "Team building", href: "/team-building/" },
  { label: "Weddings", href: "/weddings/" },
  {
    label: "Celebrations",
    children: [
      { label: "Parties", href: "https://www.partyattheheart.com/" },
      { label: "Proms", href: "https://www.partyattheheart.com/proms" },
      { label: "Kids parties", href: "https://www.heartkidsparties.co.uk/" },
    ],
  },
  { label: "Wakes and memorial gatherings", href: "https://quickentree.uk/wakes/" },
  { label: "Christmas parties", href: "https://christmasattheheart.co.uk/" },
  { label: "Activity experiences", href: "https://www.activitiesattheheart.co.uk/" },
  { label: "Stage truck hire", href: "/stage-truck-hire/" },
  { label: "Restaurant", href: "/quicken-tree/home/" },
  { label: "Hotel & accommodation", href: "/accommodation/" },
  { label: "The Showground", href: "/the-showground/" },
  { label: "Skybar", href: "/skybar/" },
  { label: "Drone shows", href: "/drone-shows/" },
];

export const eatStayMenu: NavLink[] = [
  { label: "The Quicken Tree", href: "/quicken-tree/home/" },
  { label: "Restaurant menus", href: "/quicken-tree/menus/" },
  { label: "Accommodation", href: "/accommodation/" },
];

export const aboutMenu: NavLink[] = [
  { label: "About us", href: "/about-us/" },
  { label: "News & ideas", href: "/blog/" },
  { label: "Join our team", href: "/join-our-team/" },
  { label: "Contact & directions", href: "/contact-us/" },
  { label: "Accessibility", href: "/accessibility/" },
];
