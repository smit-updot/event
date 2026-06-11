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
  const eventHref = `/events/${event.slug}`;
  const visibleSpeakers = event.speakers.slice(0, 3);
  const hiddenSpeakerCount = event.speakers.length - visibleSpeakers.length;

  return (
    <Card className="group/card h-full pt-0! transition-shadow duration-200 hover:shadow-md">
      <Link
        href={eventHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={event.bannerImage.url}
            alt={event.bannerImage.fileName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
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
          <div className="flex items-center gap-2 mt-4">
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
      </Link>

      {event.speakers.length > 0 && (
        <>
          <Separator />
          <CardFooter className="pt-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold tracking-wider uppercase">
                With
              </span>{" "}
              {visibleSpeakers.map((speaker, index) => (
                <span key={speaker.slug}>
                  {index > 0 && ", "}
                  <Link
                    href={`/speakers/${speaker.slug}`}
                    className="font-medium text-foreground underline-offset-4 transition-colors hover:text-foreground/70 hover:underline"
                  >
                    {speaker.name}
                  </Link>
                </span>
              ))}
              {hiddenSpeakerCount > 0 && ` +${hiddenSpeakerCount} more`}
            </p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
