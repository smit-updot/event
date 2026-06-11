import { GraphQLClient } from "graphql-request";

const endpoint = process.env.HYGRAPH_ENDPOINT?.trim();

if (!endpoint) {
  throw new Error("HYGRAPH_ENDPOINT environment variable is not set.");
}

const hygraphEndpoint: string = endpoint;

export function getHygraphClient(options?: {
  tags?: string[];
  revalidate?: number;
}) {
  return new GraphQLClient(hygraphEndpoint, {
    fetch: (url, init) =>
      fetch(url, {
        ...init,
        next: {
          tags: options?.tags,
          revalidate: options?.revalidate ?? 3600,
        },
      }),
  });
}
