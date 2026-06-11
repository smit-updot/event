import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="font-heading text-lg font-semibold tracking-wider uppercase">
              Updot Events
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Discover curated events across music, technology, arts, and more.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-3">
            <span className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
              Navigate
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Updot Events. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
