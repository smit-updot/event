import Image from "next/image";
import Link from "next/link";
import { MicIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SpeakerListItem } from "@/lib/types";

interface SpeakerCardProps {
  speaker: SpeakerListItem;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const eventCount = speaker.events.length;

  return (
    <Link
      href={`/speakers/${speaker.slug}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full transition-shadow duration-200 group-hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
            <Image
              src={speaker.profilePhoto.url}
              alt={speaker.profilePhoto.fileName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 text-base normal-case tracking-normal">
              {speaker.name}
            </CardTitle>
            {eventCount > 0 && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MicIcon className="size-3 shrink-0" />
                {eventCount} {eventCount === 1 ? "event" : "events"}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{speaker.bio}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
