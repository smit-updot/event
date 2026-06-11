export type Category =
  | "concerts"
  | "business"
  | "technology"
  | "arts"
  | "gaming"
  | "wellness";

export interface Asset {
  url: string;
  fileName: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface Venue {
  name: string;
  slug: string;
  address: string;
  mapUrl: string;
}

export interface Speaker {
  name: string;
  slug: string;
  profilePhoto: Asset;
  bio: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface SpeakerListItem {
  name: string;
  slug: string;
  bio: string;
  profilePhoto: Asset;
  events: { slug: string }[];
}

export interface SpeakerDetail extends Speaker {
  events: EventListItem[];
}

export interface Event {
  id: string;
  eventName: string;
  slug: string;
  shortDescription: string;
  description: {
    markdown: string;
  };
  startDate: string;
  endDate: string;
  category: Category;
  bannerImage: Asset;
  venue?: Pick<Venue, "name" | "address" | "mapUrl">;
  speakers: Pick<Speaker, "name" | "slug" | "profilePhoto">[];
}

export interface EventListItem {
  id: string;
  eventName: string;
  slug: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  category: Category;
  bannerImage: Asset;
  venue?: Pick<Venue, "name">;
  speakers: Pick<Speaker, "name" | "slug">[];
}

export interface Cta {
  ctaLabel: string;
  redirectUrl: string;
}

export interface HeroBlock {
  __typename: "Hero";
  id: string;
  heroTitle: string;
  heroImage: Asset;
  cta: Cta;
}

export interface FeaturedEventBlock {
  __typename: "FeaturedEvent";
  id: string;
  events: EventListItem[];
}

export interface FeaturedSpeakerBlock {
  __typename: "FeaturedSpeaker";
  id: string;
  speakers: SpeakerListItem[];
}

export type PageLayoutBlock =
  | HeroBlock
  | FeaturedEventBlock
  | FeaturedSpeakerBlock;

export interface Page {
  name: string;
  slug: string;
  layout: PageLayoutBlock[];
}
