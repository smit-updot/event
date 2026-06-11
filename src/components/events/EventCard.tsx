import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatEventDate,
  formatCategory,
  formatEventMonth,
  formatEventDay,
} from "@/lib/formatters";
import type { EventListItem } from "@/lib/types";

interface EventCardProps {
  event: EventListItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full transition-shadow duration-200 group-hover:shadow-md pt-0!">
        {/* Banner image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={event.bannerImage.url}
            alt={event.bannerImage.fileName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Date badge overlay */}
          <div className="absolute top-3 left-3 flex flex-col items-center justify-center bg-background px-2.5 py-1.5 text-center shadow-sm">
            <span className="text-[0.5rem] font-semibold tracking-widest text-muted-foreground uppercase">
              {formatEventMonth(event.startDate)}
            </span>
            <span className="font-heading text-xl font-bold leading-none text-foreground">
              {formatEventDay(event.startDate)}
            </span>
          </div>
        </div>

        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-muted-foreground">
              {formatCategory(event.category)}
            </Badge>
          </div>
          <CardTitle className="mt-1 line-clamp-2 text-base normal-case tracking-normal">
            {event.eventName}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <CardDescription className="line-clamp-2">
            {event.shortDescription}
          </CardDescription>

          <div className="mt-1 flex flex-col gap-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3 shrink-0" />
              {formatEventDate(event.startDate, event.endDate)}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <MapPinIcon className="size-3 shrink-0" />
                {event.venue.name}
              </span>
            )}
          </div>
        </CardContent>

        {event.speakers.length > 0 && (
          <>
            <Separator />
            <CardFooter className="pt-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold tracking-wider uppercase">
                  With
                </span>{" "}
                {event.speakers
                  .slice(0, 3)
                  .map((s) => s.name)
                  .join(", ")}
                {event.speakers.length > 3 &&
                  ` +${event.speakers.length - 3} more`}
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </Link>
  );
}
