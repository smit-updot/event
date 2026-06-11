import { format, isSameDay } from "date-fns";
import type { Category } from "@/lib/types";

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
