import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderBlocks } from "@/blocks";
import { getPageBySlug } from "@/lib/queries/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");

  if (!page) {
    return { title: "Events" };
  }

  return {
    title: `${page.name} — Events`,
    description:
      "Discover curated events, exceptional speakers, and unforgettable experiences.",
  };
}

export default async function HomePage() {
  const page = await getPageBySlug("home");

  if (!page) {
    notFound();
  }

  return (
    <main>
      <RenderBlocks blocks={page.layout} />
    </main>
  );
}
