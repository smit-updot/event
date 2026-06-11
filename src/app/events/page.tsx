import { Suspense } from "react";
import type { Metadata } from "next";
import { getEventsPaginated } from "@/lib/queries/events";
import { EventGrid } from "@/components/events/EventGrid";
import { EventFilters } from "@/components/events/EventFilters";
import { Pagination } from "@/components/layout/Pagination";
import {
  EventsPageFiltersSkeleton,
  EventsPageGridSkeleton,
} from "@/components/skeletons";
import { parsePaginationParams } from "@/lib/pagination";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events — Events",
  description:
    "Browse upcoming events across concerts, business, technology, arts, gaming, and wellness.",
};

interface EventsPageProps {
  searchParams: Promise<{
    category?: string;
    offset?: string;
    limit?: string;
  }>;
}

function isValidCategory(value: string | undefined): value is Category {
  return [
    "concerts",
    "business",
    "technology",
    "arts",
    "gaming",
    "wellness",
  ].includes(value as Category);
}

async function EventsContent({
  category,
  limit,
  offset,
}: {
  category?: Category;
  limit: number;
  offset: number;
}) {
  const { items, total } = await getEventsPaginated(limit, offset, category);

  return (
    <>
      <EventGrid events={items} activeCategory={category} />
      <Pagination
        pathname="/events"
        total={total}
        limit={limit}
        offset={offset}
        searchParams={{
          category,
          limit: String(limit),
        }}
      />
    </>
  );
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const activeCategory = isValidCategory(params.category)
    ? params.category
    : undefined;
  const { limit, offset } = parsePaginationParams(params);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2 border-b border-border pb-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Discover
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
          Events
        </h1>
        <p className="mt-1 max-w-xl text-base leading-relaxed text-muted-foreground">
          Curated experiences across music, culture, innovation, and more.
        </p>
      </div>

      <div className="mb-8">
        <Suspense fallback={<EventsPageFiltersSkeleton />}>
          <EventFilters activeCategory={activeCategory} />
        </Suspense>
      </div>

      <Suspense
        key={`${activeCategory ?? "all"}-${offset}-${limit}`}
        fallback={<EventsPageGridSkeleton />}
      >
        <EventsContent
          category={activeCategory}
          limit={limit}
          offset={offset}
        />
      </Suspense>
    </main>
  );
}
