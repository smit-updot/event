import { gql } from "graphql-request";
import { getHygraphClient } from "@/lib/hygraph";
import type { Page } from "@/lib/types";

const EVENT_LIST_FIELDS = gql`
  fragment EventListFields on Event {
    id
    eventName
    slug
    shortDescription
    startDate
    endDate
    category
    bannerImage {
      url
      fileName
      width
      height
    }
    venue {
      name
    }
    speakers {
      name
      slug
    }
  }
`;

const SPEAKER_LIST_FIELDS = gql`
  fragment SpeakerListFields on Speaker {
    name
    slug
    bio
    profilePhoto {
      url
      fileName
      width
      height
    }
    events {
      slug
    }
  }
`;

const GET_PAGE_BY_SLUG = gql`
  ${EVENT_LIST_FIELDS}
  ${SPEAKER_LIST_FIELDS}
  query GetPageBySlug($slug: String!) {
    page(where: { slug: $slug }, stage: PUBLISHED) {
      name
      slug
      layout {
        __typename
        ... on Hero {
          id
          heroTitle
          heroImage {
            url
            fileName
            width
            height
          }
          cta {
            ctaLabel
            redirectUrl
          }
        }
        ... on FeaturedEvent {
          id
          events {
            ...EventListFields
          }
        }
        ... on FeaturedSpeaker {
          id
          speakers {
            ...SpeakerListFields
          }
        }
      }
    }
  }
`;

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const client = getHygraphClient({ tags: ["pages", `page-${slug}`] });
  const data = await client.request<{ page: Page | null }>(GET_PAGE_BY_SLUG, {
    slug,
  });
  return data.page;
}
