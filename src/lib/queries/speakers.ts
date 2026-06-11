import { gql } from "graphql-request";
import { getHygraphClient } from "@/lib/hygraph";
import type { SpeakerDetail, SpeakerListItem } from "@/lib/types";

const SPEAKER_EVENT_FIELDS = gql`
  fragment SpeakerEventFields on Event {
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

const GET_SPEAKER_BY_SLUG = gql`
  ${SPEAKER_EVENT_FIELDS}
  query GetSpeakerBySlug($slug: String!) {
    speaker(where: { slug: $slug }, stage: PUBLISHED) {
      name
      slug
      bio
      instagram
      twitter
      linkedin
      profilePhoto {
        url
        fileName
        width
        height
      }
      events {
        ...SpeakerEventFields
      }
    }
  }
`;

const GET_ALL_SPEAKER_SLUGS = gql`
  query GetAllSpeakerSlugs {
    speakers(stage: PUBLISHED) {
      slug
    }
  }
`;

const GET_SPEAKERS = gql`
  query GetSpeakers {
    speakers(stage: PUBLISHED) {
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
  }
`;

export async function getSpeakers(): Promise<SpeakerListItem[]> {
  const client = getHygraphClient({ tags: ["speakers"] });
  const data = await client.request<{ speakers: SpeakerListItem[] }>(
    GET_SPEAKERS
  );
  return data.speakers;
}

export async function getSpeakerBySlug(
  slug: string
): Promise<SpeakerDetail | null> {
  const client = getHygraphClient({ tags: ["speakers", `speaker-${slug}`] });
  const data = await client.request<{ speaker: SpeakerDetail | null }>(
    GET_SPEAKER_BY_SLUG,
    { slug }
  );
  return data.speaker;
}

export async function getAllSpeakerSlugs(): Promise<{ slug: string }[]> {
  const client = getHygraphClient({ tags: ["speakers"] });
  const data = await client.request<{ speakers: { slug: string }[] }>(
    GET_ALL_SPEAKER_SLUGS
  );
  return data.speakers;
}
