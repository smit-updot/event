import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpeakerDetail } from "@/components/speakers/SpeakerDetail";
import { getAllSpeakerSlugs, getSpeakerBySlug } from "@/lib/queries/speakers";
import {
  SpeakerSlugPageBreadcrumb,
  SpeakerSlugPageContentSkeleton,
} from "@/components/skeletons";

interface SpeakerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSpeakerSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SpeakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);

  if (!speaker) {
    return {
      title: "Speaker Not Found",
    };
  }

  return {
    title: `${speaker.name} — Speaker`,
    description: speaker.bio.slice(0, 160),
    openGraph: {
      title: speaker.name,
      description: speaker.bio.slice(0, 160),
      type: "profile",
      images: [
        {
          url: speaker.profilePhoto.url,
          alt: speaker.profilePhoto.fileName,
        },
      ],
    },
  };
}

async function SpeakerDetailContent({ slug }: { slug: string }) {
  const speaker = await getSpeakerBySlug(slug);

  if (!speaker) {
    notFound();
  }

  return <SpeakerDetail speaker={speaker} />;
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { slug } = await params;

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <>
            <SpeakerSlugPageBreadcrumb />
            <SpeakerSlugPageContentSkeleton />
          </>
        }
      >
        <SpeakerDetailContent slug={slug} />
      </Suspense>
    </article>
  );
}
