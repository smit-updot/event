import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-heading text-[clamp(8rem,28vw,16rem)] font-semibold leading-none tracking-wider text-foreground/[0.04] uppercase"
      >
        404
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Error 404
          </p>

          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-wide uppercase sm:text-5xl lg:text-6xl">
            Page Not Found
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist, may have been
            moved, or the link is no longer valid.
          </p>

          <Separator className="my-10 w-24" />

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeftIcon />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events">
                <CalendarIcon />
                Browse Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/speakers">
                <UsersIcon />
                View Speakers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
