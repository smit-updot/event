import { Suspense } from "react";
import type { Metadata } from "next";
import { getSpeakers } from "@/lib/queries/speakers";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { SpeakersPageGridSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Speakers — Events",
  description:
    "Meet the speakers and experts presenting at our curated events.",
};

async function SpeakersContent() {
  const speakers = await getSpeakers();
  return <SpeakerGrid speakers={speakers} />;
}

export default function SpeakersPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2 border-b border-border pb-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          People
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
          Speakers
        </h1>
        <p className="mt-1 max-w-xl text-base leading-relaxed text-muted-foreground">
          Industry leaders, creators, and experts behind our events.
        </p>
      </div>

      <Suspense fallback={<SpeakersPageGridSkeleton />}>
        <SpeakersContent />
      </Suspense>
    </main>
  );
}
