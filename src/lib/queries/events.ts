import { gql } from "graphql-request";
import { getHygraphClient } from "@/lib/hygraph";
import type { PaginatedResult } from "@/lib/pagination";
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

const EVENTS_CONNECTION_FIELDS = gql`
  aggregate {
    count
  }
  edges {
    node {
      ...EventListFields
    }
  }
`;

const GET_EVENTS_PAGINATED = gql`
  ${EVENT_LIST_FIELDS}
  query GetEventsPaginated($limit: Int!, $offset: Int!) {
    eventsConnection(
      first: $limit
      skip: $offset
      orderBy: startDate_ASC
      stage: PUBLISHED
    ) {
      ${EVENTS_CONNECTION_FIELDS}
    }
  }
`;

const GET_EVENTS_PAGINATED_BY_CATEGORY = gql`
  ${EVENT_LIST_FIELDS}
  query GetEventsPaginatedByCategory(
    $limit: Int!
    $offset: Int!
    $category: Category!
  ) {
    eventsConnection(
      first: $limit
      skip: $offset
      orderBy: startDate_ASC
      where: { category: $category }
      stage: PUBLISHED
    ) {
      ${EVENTS_CONNECTION_FIELDS}
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

type EventsConnectionResponse = {
  eventsConnection: {
    aggregate: { count: number };
    edges: { node: EventListItem }[];
  };
};

export async function getEventsPaginated(
  limit: number,
  offset: number,
  category?: Category
): Promise<PaginatedResult<EventListItem>> {
  const client = getHygraphClient({ tags: ["events"] });

  const data = category
    ? await client.request<EventsConnectionResponse>(
        GET_EVENTS_PAGINATED_BY_CATEGORY,
        { limit, offset, category }
      )
    : await client.request<EventsConnectionResponse>(GET_EVENTS_PAGINATED, {
        limit,
        offset,
      });

  return {
    items: data.eventsConnection.edges.map((edge) => edge.node),
    total: data.eventsConnection.aggregate.count,
    limit,
    offset,
  };
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
