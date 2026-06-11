"use client";

import { EventCard } from "@/components/events/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EventListItem } from "@/lib/types";

interface SpeakerEventsTabsProps {
  upcoming: EventListItem[];
  past: EventListItem[];
}

function EventsList({
  events,
  emptyMessage,
}: {
  events: EventListItem[];
  emptyMessage: string;
}) {
  if (events.length === 0) {
    return (
      <p className="py-8 text-sm text-muted-foreground">{emptyMessage}</p>
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

export function SpeakerEventsTabs({ upcoming, past }: SpeakerEventsTabsProps) {
  const defaultTab = upcoming.length > 0 ? "upcoming" : "past";

  return (
    <Tabs defaultValue={defaultTab} className="gap-6">
      <TabsList variant="line">
        <TabsTrigger value="upcoming">
          Upcoming
          {upcoming.length > 0 && (
            <span className="text-muted-foreground">({upcoming.length})</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="past">
          Past
          {past.length > 0 && (
            <span className="text-muted-foreground">({past.length})</span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <EventsList
          events={upcoming}
          emptyMessage="No upcoming events for this speaker."
        />
      </TabsContent>

      <TabsContent value="past">
        <EventsList
          events={past}
          emptyMessage="No past events for this speaker."
        />
      </TabsContent>
    </Tabs>
  );
}
