import { Suspense } from "react";
import type { Metadata } from "next";
import { getSpeakersPaginated } from "@/lib/queries/speakers";
import { SpeakerGrid } from "@/components/speakers/SpeakerGrid";
import { Pagination } from "@/components/layout/Pagination";
import { SpeakersPageGridSkeleton } from "@/components/skeletons";
import { parsePaginationParams } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Speakers — Events",
  description:
    "Meet the speakers and experts presenting at our curated events.",
};

interface SpeakersPageProps {
  searchParams: Promise<{
    offset?: string;
    limit?: string;
  }>;
}

async function SpeakersContent({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  const { items, total } = await getSpeakersPaginated(limit, offset);

  return (
    <>
      <SpeakerGrid speakers={items} />
      <Pagination
        pathname="/speakers"
        total={total}
        limit={limit}
        offset={offset}
        searchParams={{ limit: String(limit) }}
      />
    </>
  );
}

export default async function SpeakersPage({
  searchParams,
}: SpeakersPageProps) {
  const params = await searchParams;
  const { limit, offset } = parsePaginationParams(params);

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

      <Suspense
        key={`${offset}-${limit}`}
        fallback={<SpeakersPageGridSkeleton />}
      >
        <SpeakersContent limit={limit} offset={offset} />
      </Suspense>
    </main>
  );
}
