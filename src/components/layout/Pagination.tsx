import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildPaginationHref,
  getPaginationRange,
} from "@/lib/pagination";

interface PaginationProps {
  pathname: string;
  total: number;
  limit: number;
  offset: number;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  pathname,
  total,
  limit,
  offset,
  searchParams = {},
}: PaginationProps) {
  const { from, to, totalPages, currentPage } = getPaginationRange(
    offset,
    limit,
    total
  );

  if (totalPages <= 1) {
    return null;
  }

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;
  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  const baseParams = {
    ...searchParams,
    limit: String(limit),
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row"
    >
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={!hasPrev ? "pointer-events-none opacity-50" : undefined}
          aria-disabled={!hasPrev}
        >
          <Link
            href={
              hasPrev
                ? buildPaginationHref(pathname, baseParams, prevOffset)
                : "#"
            }
            tabIndex={hasPrev ? undefined : -1}
          >
            <ChevronLeftIcon />
            Previous
          </Link>
        </Button>

        <span className="px-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          asChild
          variant="outline"
          size="sm"
          className={!hasNext ? "pointer-events-none opacity-50" : undefined}
          aria-disabled={!hasNext}
        >
          <Link
            href={
              hasNext
                ? buildPaginationHref(pathname, baseParams, nextOffset)
                : "#"
            }
            tabIndex={hasNext ? undefined : -1}
          >
            Next
            <ChevronRightIcon />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
