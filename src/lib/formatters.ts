import { format, isSameDay } from "date-fns";
import type { Category, EventListItem } from "@/lib/types";

export function formatEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isSameDay(start, end)) {
    return `${format(start, "MMMM d, yyyy")} · ${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
  }

  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function formatEventDateShort(startDate: string): string {
  return format(new Date(startDate), "MMM d, yyyy");
}

export function formatEventMonth(startDate: string): string {
  return format(new Date(startDate), "MMM").toUpperCase();
}

export function formatEventDay(startDate: string): string {
  return format(new Date(startDate), "d");
}

const CATEGORY_LABELS: Record<Category, string> = {
  concerts: "Concerts",
  business: "Business",
  technology: "Technology",
  arts: "Arts",
  gaming: "Gaming",
  wellness: "Wellness",
};

export function formatCategory(category: Category): string {
  return CATEGORY_LABELS[category] ?? category;
}

export const ALL_CATEGORIES: Category[] = [
  "concerts",
  "business",
  "technology",
  "arts",
  "gaming",
  "wellness",
];

export function isValidCategory(value: string | undefined): value is Category {
  return ALL_CATEGORIES.includes(value as Category);
}

export function partitionSpeakerEvents(
  events: EventListItem[],
  now = new Date()
) {
  const nowTime = now.getTime();
  const upcoming: EventListItem[] = [];
  const past: EventListItem[] = [];

  for (const event of events) {
    if (new Date(event.endDate).getTime() >= nowTime) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  }

  upcoming.sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  past.sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return { upcoming, past };
}

export function formatSocialUrl(
  platform: "instagram" | "twitter" | "linkedin",
  value: string
): string {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const handle = value.replace(/^@/, "");

  switch (platform) {
    case "instagram":
      return `https://instagram.com/${handle}`;
    case "twitter":
      return `https://x.com/${handle}`;
    case "linkedin":
      return `https://linkedin.com/in/${handle}`;
  }
}
