import { UserXIcon } from "lucide-react";
import { SpeakerCard } from "@/components/speakers/SpeakerCard";
import type { SpeakerListItem } from "@/lib/types";

interface SpeakerGridProps {
  speakers: SpeakerListItem[];
}

export function SpeakerGrid({ speakers }: SpeakerGridProps) {
  if (speakers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <UserXIcon className="size-10 text-muted-foreground/40" />
        <div className="flex flex-col gap-1">
          <p className="font-heading text-lg font-semibold tracking-wider uppercase">
            No speakers found
          </p>
          <p className="text-sm text-muted-foreground">
            There are no speakers listed right now. Check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.slug} speaker={speaker} />
      ))}
    </div>
  );
}
