import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroBlock as HeroBlockType } from "@/lib/types";

interface HeroBlockProps {
  block: HeroBlockType;
}

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function HeroBlock({ block }: HeroBlockProps) {
  const { heroTitle, heroImage, cta } = block;

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-24 lg:px-8">
        <div className="flex flex-col gap-6">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Welcome
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-wide uppercase sm:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          {isExternalUrl(cta.redirectUrl) ? (
            <Button asChild className="w-fit">
              <a
                href={cta.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cta.ctaLabel}
              </a>
            </Button>
          ) : (
            <Button asChild className="w-fit">
              <Link href={cta.redirectUrl}>{cta.ctaLabel}</Link>
            </Button>
          )}
        </div>

        <div className="relative aspect-square w-full overflow-hidden bg-transparent lg:aspect-[4/3]">
          <Image
            src={heroImage.url}
            alt={heroImage.fileName}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
