import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SpeakerEventsTabs } from "@/components/speakers/SpeakerEventsTabs";
import { MarkdownContent } from "@/lib/render-markdown";
import {
  formatSocialUrl,
  partitionSpeakerEvents,
} from "@/lib/formatters";
import type { SpeakerDetail as SpeakerDetailType } from "@/lib/types";

interface SpeakerDetailProps {
  speaker: SpeakerDetailType;
}

const SOCIAL_LINKS = [
  { key: "instagram" as const, label: "Instagram" },
  { key: "twitter" as const, label: "Twitter" },
  { key: "linkedin" as const, label: "LinkedIn" },
];

export function SpeakerDetail({ speaker }: SpeakerDetailProps) {
  const { upcoming, past } = partitionSpeakerEvents(speaker.events);
  const socials = SOCIAL_LINKS.filter((link) => speaker[link.key]);

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
              <Link href="/speakers">Speakers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-48 truncate sm:max-w-none">
              {speaker.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
        <div className="flex flex-col items-center gap-6 lg:items-start">
          <div className="relative size-56 overflow-hidden bg-muted sm:size-64">
            <Image
              src={speaker.profilePhoto.url}
              alt={speaker.profilePhoto.fileName}
              fill
              priority
              sizes="(max-width: 1024px) 224px, 256px"
              className="object-cover"
            />
          </div>

          {socials.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {socials.map(({ key, label }) => {
                const value = speaker[key]!;
                return (
                  <Button key={key} asChild variant="outline" size="sm">
                    <a
                      href={formatSocialUrl(key, value)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                      <ExternalLinkIcon />
                    </a>
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Speaker
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
              {speaker.name}
            </h1>
          </header>

          <section aria-labelledby="speaker-bio">
            <h2
              id="speaker-bio"
              className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase"
            >
              About
            </h2>
            <MarkdownContent content={speaker.bio} />
          </section>
        </div>
      </div>

      <Separator className="my-12" />

      <section aria-labelledby="speaker-events">
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Events
          </p>
          <h2
            id="speaker-events"
            className="font-heading text-2xl font-semibold tracking-wide uppercase"
          >
            Speaking At
          </h2>
        </div>

        <SpeakerEventsTabs upcoming={upcoming} past={past} />
      </section>
    </>
  );
}
