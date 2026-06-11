import { CalendarOffIcon } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import type { EventListItem, Category } from "@/lib/types";
import { formatCategory } from "@/lib/formatters";

interface EventGridProps {
  events: EventListItem[];
  activeCategory?: Category;
}

export function EventGrid({ events, activeCategory }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <CalendarOffIcon className="size-10 text-muted-foreground/40" />
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg font-semibold uppercase tracking-wider">
            No events found
          </p>
          <p className="text-sm text-muted-foreground">
            {activeCategory
              ? `There are no ${formatCategory(activeCategory)} events scheduled right now.`
              : "There are no events scheduled right now. Check back soon."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
