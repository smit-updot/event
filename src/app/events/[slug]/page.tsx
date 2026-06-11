import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/events/EventDetail";
import { getAllEventSlugs, getEventBySlug } from "@/lib/queries/events";
import {
  EventSlugPageBreadcrumb,
  EventSlugPageContentSkeleton,
} from "@/components/skeletons";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.eventName} — Events`,
    description: event.shortDescription,
    openGraph: {
      title: event.eventName,
      description: event.shortDescription,
      images: [{ url: event.bannerImage.url, alt: event.bannerImage.fileName }],
    },
  };
}

async function EventDetailContent({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <>
            <EventSlugPageBreadcrumb />
            <EventSlugPageContentSkeleton />
          </>
        }
      >
        <EventDetailContent slug={slug} />
      </Suspense>
    </article>
  );
}
