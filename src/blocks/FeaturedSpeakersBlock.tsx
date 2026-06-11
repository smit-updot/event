import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { Button } from "@/components/ui/button";
import type { FeaturedSpeakerBlock } from "@/lib/types";

interface FeaturedSpeakersBlockProps {
  block: FeaturedSpeakerBlock;
}

export function FeaturedSpeakersBlock({ block }: FeaturedSpeakersBlockProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            People
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-wide uppercase sm:text-4xl">
            Featured Speakers
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/speakers">
            View all
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <SpeakerGrid speakers={block.speakers} />
    </section>
  );
}
