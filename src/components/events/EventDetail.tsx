import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownContent } from "@/lib/render-markdown";
import { formatCategory, formatEventDate } from "@/lib/formatters";
import type { Event } from "@/lib/types";

interface EventDetailProps {
  event: Event;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function EventDetail({ event }: EventDetailProps) {
  return (
    <>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-48 truncate sm:max-w-none">
              {event.eventName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative mb-10 aspect-21/9 w-full overflow-hidden bg-muted">
        <Image
          src={event.bannerImage.url}
          alt={event.bannerImage.fileName}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit text-muted-foreground">
              {formatCategory(event.category)}
            </Badge>
            <h1 className="font-heading text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
              {event.eventName}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {event.shortDescription}
            </p>
          </header>

          <Separator />

          <section aria-labelledby="event-description">
            <h2
              id="event-description"
              className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              About This Event
            </h2>
            <MarkdownContent content={event.description.markdown} />
          </section>

          {event.speakers.length > 0 && (
            <>
              <Separator />
              <section aria-labelledby="event-speakers">
                <div className="mb-6 flex items-center gap-2">
                  <UsersIcon className="size-4 text-muted-foreground" />
                  <h2
                    id="event-speakers"
                    className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                  >
                    Speakers
                  </h2>
                </div>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {event.speakers.map((speaker) => (
                    <li key={speaker.slug}>
                      <Link
                        href={`/speakers/${speaker.slug}`}
                        className="group flex items-center gap-4 border border-border p-4 transition-colors hover:bg-muted/40"
                      >
                        <Avatar size="lg">
                          <AvatarImage
                            src={speaker.profilePhoto.url}
                            alt={speaker.profilePhoto.fileName}
                          />
                          <AvatarFallback>
                            {getInitials(speaker.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-heading text-sm font-semibold tracking-wide uppercase transition-colors group-hover:text-foreground/70">
                          {speaker.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-muted/30 p-6">
            <h2 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Event Details
            </h2>
            <dl className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1.5">
                <dt className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  <CalendarIcon className="size-3.5" />
                  Date &amp; Time
                </dt>
                <dd className="leading-relaxed text-foreground">
                  {formatEventDate(event.startDate, event.endDate)}
                </dd>
              </div>

              {event.venue && (
                <div className="flex flex-col gap-1.5">
                  <dt className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    <MapPinIcon className="size-3.5" />
                    Venue
                  </dt>
                  <dd className="flex flex-col gap-1 leading-relaxed">
                    <span className="font-medium text-foreground">
                      {event.venue.name}
                    </span>
                    <span className="whitespace-pre-line text-muted-foreground">
                      {event.venue.address}
                    </span>
                  </dd>
                </div>
              )}
            </dl>

            {event.venue?.mapUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-6 w-full"
              >
                <a
                  href={event.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Map
                  <ExternalLinkIcon />
                </a>
              </Button>
            )}
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/events">Back to All Events</Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
