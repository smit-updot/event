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
  location?: {
    latitude: number;
    longitude: number;
  };
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

export interface Event {
  id: string;
  eventName: string;
  slug: string;
  shortDescription: string;
  description: {
    markdown: string;
    html: string;
    text: string;
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
