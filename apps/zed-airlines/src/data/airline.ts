export const HTG_PER_USD = 132;

export const airportCodes = [
  "CAP",
  "PAP",
  "MIA",
  "FLL",
  "JFK",
  "BOS",
  "YUL",
  "SDQ",
  "PUJ",
  "STI",
] as const;

export type AirportCode = (typeof airportCodes)[number];

export const networkRoutes: { from: AirportCode; to: AirportCode; minutes: number }[] =
  [
    { from: "PAP", to: "MIA", minutes: 130 },
    { from: "PAP", to: "FLL", minutes: 135 },
    { from: "PAP", to: "JFK", minutes: 235 },
    { from: "PAP", to: "BOS", minutes: 260 },
    { from: "PAP", to: "YUL", minutes: 280 },
    { from: "PAP", to: "SDQ", minutes: 55 },
    { from: "PAP", to: "PUJ", minutes: 70 },
    { from: "CAP", to: "MIA", minutes: 120 },
    { from: "CAP", to: "STI", minutes: 40 },
  ];

export type Fare = {
  from: AirportCode;
  to: AirportCode;
  price: number;
  date: string;
};

export const sampleFares: Fare[] = [
  { from: "PAP", to: "CAP", price: 222.99, date: "2026-11-09" },
  { from: "CAP", to: "PAP", price: 222.99, date: "2026-11-09" },
  { from: "CAP", to: "MIA", price: 369.38, date: "2026-10-13" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-13" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-16" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-20" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-23" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-27" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-30" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-11-03" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-11-10" },
  { from: "FLL", to: "CAP", price: 369.38, date: "2026-11-10" },
  { from: "FLL", to: "CAP", price: 369.38, date: "2026-11-17" },
  { from: "FLL", to: "CAP", price: 369.38, date: "2026-11-24" },
  { from: "FLL", to: "CAP", price: 369.38, date: "2026-12-01" },
  { from: "JFK", to: "CAP", price: 369.38, date: "2026-11-06" },
  { from: "JFK", to: "CAP", price: 513.46, date: "2026-11-13" },
  { from: "JFK", to: "CAP", price: 513.46, date: "2026-11-20" },
  { from: "JFK", to: "CAP", price: 513.46, date: "2026-11-27" },
  { from: "JFK", to: "CAP", price: 513.46, date: "2026-12-04" },
];

export const highlightedFares: Fare[] = [
  { from: "CAP", to: "PAP", price: 222.99, date: "2026-11-09" },
  { from: "PAP", to: "CAP", price: 222.99, date: "2026-11-09" },
  { from: "CAP", to: "MIA", price: 369.38, date: "2026-10-13" },
  { from: "MIA", to: "CAP", price: 369.38, date: "2026-10-13" },
  { from: "FLL", to: "CAP", price: 369.38, date: "2026-11-10" },
  { from: "JFK", to: "CAP", price: 369.38, date: "2026-11-06" },
];

export const cityStories = [
  {
    slug: "miami",
    from: "MIA" as const,
    to: "CAP" as const,
    minutes: 120,
    km: 1020,
    image:
      "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "fort-lauderdale",
    from: "FLL" as const,
    to: "CAP" as const,
    minutes: 120,
    km: 1060,
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "new-york",
    from: "JFK" as const,
    to: "CAP" as const,
    minutes: 240,
    km: 2400,
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1800&q=80",
  },
] as const;

export type CitySlug = (typeof cityStories)[number]["slug"];

export const haitiPlaces = [
  {
    code: "CAP",
    image: "/places/cap-notre-dame.jpg",
    position: "center",
    credit: {
      name: "Rémi Kaupp",
      href: "https://commons.wikimedia.org/wiki/File:Cathedral_of_Cap-Haitien.jpg",
      license: "CC BY-SA 3.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/3.0",
    },
  },
  {
    code: "PAP",
    image: "/places/pap-mupanah.jpg",
    position: "center",
  },
  {
    code: "CYA",
    image: "/places/cya-jardin.jpg",
    position: "center",
    credit: {
      name: "Rency Inson Michel",
      href: "https://commons.wikimedia.org/wiki/File:Jardin_botanique_Villa_John.jpg",
      license: "CC BY-SA 4.0",
      licenseHref: "https://creativecommons.org/licenses/by-sa/4.0",
    },
  },
] as const;

export const travelTopics = [
  "baggage",
  "check-in",
  "documents",
  "assistance",
  "onboard",
] as const;

export type TravelTopic = (typeof travelTopics)[number];

export const legalPages = [
  "carriage",
  "privacy",
  "terms",
  "cookies",
  "accessibility",
] as const;

export type LegalPage = (typeof legalPages)[number];

export const fareFamilies = [
  { id: "standard", bags: 1, seat: "fee", change: "fee" },
  { id: "flex", bags: 2, seat: "included", change: "free" },
  { id: "business", bags: 3, seat: "included", change: "free" },
] as const;

export const baggageFacts = {
  carryKg: 7,
  carrySize: "55 × 35 × 25 cm",
  checkedKg: 23,
  extraBagUsd: 65,
  overweightUsd: 75,
  infantKg: 10,
};

export const checkInFacts = {
  opensHours: 24,
  arriveHours: 3,
  closesMinutes: 60,
  gateMinutes: 20,
  assistanceHours: 48,
};

export const contacts = {
  email: "info@zedairlines.com",
  regions: [
    {
      id: "us",
      phones: ["+1 305-607-7143", "+1 646-256-9201", "+1 347-860-5088"],
    },
    {
      id: "ht",
      phones: ["+509 2814-0708", "+509 3432-3717"],
    },
    {
      id: "br",
      phones: ["+55 61 99366-2052"],
    },
  ],
  socials: [
    { id: "Instagram", href: "https://www.instagram.com/zedairlines/" },
    {
      id: "Facebook",
      href: "https://www.facebook.com/profile.php?id=100063580971052",
    },
    { id: "X", href: "https://x.com/zedairlines" },
    { id: "TikTok", href: "https://www.tiktok.com/@zedairlines" },
    {
      id: "LinkedIn",
      href: "https://www.linkedin.com/in/zed-airlines-863970367",
    },
    { id: "YouTube", href: "https://www.youtube.com/@Zedaielines" },
  ],
} as const;

export const marqueeCodes = [
  "CAP",
  "PAP",
  "MIA",
  "FLL",
  "JFK",
  "BOS",
  "YUL",
  "SDQ",
  "PUJ",
  "STI",
] as const;

export function faresBetween(from: string, to: string) {
  return sampleFares
    .filter((fare) => fare.from === from && fare.to === to)
    .sort((a, b) => a.date.localeCompare(b.date) || a.price - b.price);
}

export function lowestFare(from: string, to: string) {
  return faresBetween(from, to).reduce<Fare | undefined>((best, fare) => {
    if (!best || fare.price < best.price) return fare;
    return best;
  }, undefined);
}

export function routeMinutes(from: string, to: string) {
  const direct = networkRoutes.find((route) => route.from === from && route.to === to);
  if (direct) return direct.minutes;
  const story = cityStories.find((item) => item.from === from && item.to === to);
  return story?.minutes;
}

export function isAirportCode(value: string): value is AirportCode {
  return (airportCodes as readonly string[]).includes(value);
}

export function formatDuration(minutes: number, locale: string) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const padded = mins.toString().padStart(2, "0");
  if (locale.startsWith("fr")) {
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} h`;
    return `${hours} h ${padded}`;
  }
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${padded}m`;
}

export function formatLongDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${iso}T12:00:00`));
}

export function storyBySlug(slug: string) {
  return cityStories.find((story) => story.slug === slug);
}

export function isTravelTopic(value: string): value is TravelTopic {
  return (travelTopics as readonly string[]).includes(value);
}

export function isLegalPage(value: string): value is LegalPage {
  return (legalPages as readonly string[]).includes(value);
}
