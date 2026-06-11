export const DEFAULT_PAGE_SIZE = 6;

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export function parsePaginationParams(
  searchParams: { offset?: string; limit?: string },
  defaultLimit = DEFAULT_PAGE_SIZE
): PaginationParams {
  const parsedLimit = Number.parseInt(
    searchParams.limit ?? String(defaultLimit),
    10
  );
  const parsedOffset = Number.parseInt(searchParams.offset ?? "0", 10);

  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 50)
      : defaultLimit;
  const offset =
    Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  return { limit, offset };
}

export function getPaginationRange(offset: number, limit: number, total: number) {
  if (total === 0) {
    return { from: 0, to: 0, totalPages: 0, currentPage: 1 };
  }

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const from = offset + 1;
  const to = Math.min(offset + limit, total);

  return { from, to, totalPages, currentPage };
}

export function buildPaginationHref(
  pathname: string,
  params: Record<string, string | undefined>,
  offset: number
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      search.set(key, value);
    }
  }

  if (offset > 0) {
    search.set("offset", String(offset));
  } else {
    search.delete("offset");
  }

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
