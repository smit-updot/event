import { gql } from "graphql-request";
import { getHygraphClient } from "@/lib/hygraph";
import type { Category, Event, EventListItem } from "@/lib/types";

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

const GET_EVENTS = gql`
  ${EVENT_LIST_FIELDS}
  query GetEvents($category: Category) {
    events(
      orderBy: startDate_ASC
      where: { category: $category }
      stage: PUBLISHED
    ) {
      ...EventListFields
    }
  }
`;

const GET_EVENTS_ALL = gql`
  ${EVENT_LIST_FIELDS}
  query GetEventsAll {
    events(orderBy: startDate_ASC, stage: PUBLISHED) {
      ...EventListFields
    }
  }
`;

const GET_UPCOMING_EVENTS = gql`
  ${EVENT_LIST_FIELDS}
  query GetUpcomingEvents($now: DateTime!) {
    events(
      first: 3
      orderBy: startDate_ASC
      where: { startDate_gte: $now }
      stage: PUBLISHED
    ) {
      ...EventListFields
    }
  }
`;

const GET_EVENT_BY_SLUG = gql`
  query GetEventBySlug($slug: String!) {
    event(where: { slug: $slug }, stage: PUBLISHED) {
      id
      eventName
      slug
      shortDescription
      description {
        markdown
        html
        text
      }
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
        address
        mapUrl
        location {
          latitude
          longitude
        }
      }
      speakers {
        name
        slug
        profilePhoto {
          url
          fileName
          width
          height
        }
      }
    }
  }
`;

const GET_ALL_EVENT_SLUGS = gql`
  query GetAllEventSlugs {
    events(stage: PUBLISHED) {
      slug
    }
  }
`;

export async function getEvents(category?: Category): Promise<EventListItem[]> {
  const client = getHygraphClient({ tags: ["events"] });

  if (category) {
    const data = await client.request<{ events: EventListItem[] }>(GET_EVENTS, {
      category,
    });
    return data.events;
  }

  const data = await client.request<{ events: EventListItem[] }>(
    GET_EVENTS_ALL
  );
  return data.events;
}

export async function getUpcomingEvents(): Promise<EventListItem[]> {
  const client = getHygraphClient({ tags: ["events"] });
  const data = await client.request<{ events: EventListItem[] }>(
    GET_UPCOMING_EVENTS,
    { now: new Date().toISOString() }
  );
  return data.events;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const client = getHygraphClient({ tags: ["events", `event-${slug}`] });
  const data = await client.request<{ event: Event | null }>(
    GET_EVENT_BY_SLUG,
    { slug }
  );
  return data.event;
}

export async function getAllEventSlugs(): Promise<{ slug: string }[]> {
  const client = getHygraphClient({ tags: ["events"] });
  const data = await client.request<{ events: { slug: string }[] }>(
    GET_ALL_EVENT_SLUGS
  );
  return data.events;
}
