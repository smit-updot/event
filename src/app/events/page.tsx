import { Suspense } from "react";
import type { Metadata } from "next";
import { getEvents } from "@/lib/queries/events";
import { EventGrid } from "@/components/events/EventGrid";
import { EventFilters } from "@/components/events/EventFilters";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events — Events",
  description:
    "Browse upcoming events across concerts, business, technology, arts, gaming, and wellness.",
};

interface EventsPageProps {
  searchParams: Promise<{ category?: string }>;
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

function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

async function EventsContent({ category }: { category?: Category }) {
  const events = await getEvents(category);
  return <EventGrid events={events} activeCategory={category} />;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = isValidCategory(rawCategory) ? rawCategory : undefined;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
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

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-9 w-full max-w-md" />}>
          <EventFilters activeCategory={activeCategory} />
        </Suspense>
      </div>

      {/* Grid */}
      <Suspense fallback={<EventsGridSkeleton />}>
        <EventsContent category={activeCategory} />
      </Suspense>
    </main>
  );
}
