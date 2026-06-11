"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCategory, ALL_CATEGORIES } from "@/lib/formatters";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventFiltersProps {
  activeCategory?: Category;
}

export function EventFilters({ activeCategory }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(category: Category | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/events?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilter(null)}
        className={cn(
          "transition-colors",
          !activeCategory && "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent"
        )}
      >
        All
      </Button>

      {ALL_CATEGORIES.map((category) => (
        <Button
          key={category}
          variant="outline"
          size="sm"
          onClick={() => handleFilter(category)}
          className={cn(
            "transition-colors",
            activeCategory === category &&
              "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent"
          )}
        >
          {formatCategory(category)}
        </Button>
      ))}
    </div>
  );
}
