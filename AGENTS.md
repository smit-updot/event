# Hygraph Events — Agent Guide

## Next.js version notice

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

This project runs **Next.js 16** (App Router) and **React 19**. Always read `node_modules/next/dist/docs/` before using any Next.js API.

---

## What this project is

An **event management** marketing site. Content is authored in **Hygraph** and rendered in Next.js. The frontend is read-only against the Hygraph Content API.

Primary goals: list and detail events, profile speakers, link events ↔ speakers, and present everything in a clean, responsive, editorial UI.

---

## Installed packages — use these

| Package                        | Use for                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `graphql`                      | GraphQL core; required by `graphql-request`                |
| `graphql-request`              | All Hygraph Content API queries — configure in `lib/` only |
| `date-fns`                     | Formatting `startDate` / `endDate` on events               |
| `clsx` + `tailwind-merge`      | Class merging via `cn()` in `lib/utils.ts`                 |
| `class-variance-authority`     | Component variants in `components/ui/`                     |
| `lucide-react`                 | Icons across the UI                                        |
| `radix-ui`                     | Underlying primitives for shadcn components                |
| `react-markdown`               | Event `description` (via Hygraph `markdown`) and Speaker `bio` |
| `next` / `react` / `react-dom` | Framework and rendering                                    |

Do **not** add Apollo Client, URQL, or other GraphQL clients — `graphql-request` is the standard for this project.
Do **not** add a separate Rich Text AST renderer — query `description { markdown }` from Hygraph and render with `react-markdown`.

---

## Directory conventions

| Path                       | Purpose                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| `src/app/`                 | Routes only — thin pages, metadata, static params                   |
| `src/app/events/`          | Events listing                                                      |
| `src/app/events/[slug]/`   | Single event detail                                                 |
| `src/app/speakers/[slug]/` | Single speaker profile                                              |
| `src/components/ui/`       | **All** shadcn/Radix UI primitives — nothing else                   |
| `src/components/events/`   | Event-specific composed components                                  |
| `src/components/speakers/` | Speaker-specific composed components                                |
| `src/components/layout/`   | Header, footer, nav, page shells, pagination                        |
| `src/blocks/`              | CMS layout block components + `RenderBlocks` registry                 |
| `src/components/skeletons/`| Route-level loading UI — colocate by domain (`events.tsx`, etc.)      |
| `src/lib/`                 | **All** Hygraph access, GraphQL queries, types, formatters, helpers |
| `src/lib/hygraph.ts`       | `getHygraphClient()` — `graphql-request` + native `fetch` caching     |
| `src/lib/queries/`         | GraphQL documents and data-access functions per model                 |
| `src/lib/types/`           | TypeScript types mirroring the Hygraph schema                         |
| `src/lib/formatters.ts`    | `date-fns` date display + `Category` labels                           |
| `src/lib/render-markdown.tsx` | `MarkdownContent` — shared `react-markdown` renderer               |

---

## Routes

| Route              | Purpose                               |
| ------------------ | ------------------------------------- |
| `/`                | Home — CMS-driven `Page` layout blocks (`slug: home`) |
| `/events`          | Events index (filterable by category) |
| `/events/[slug]`   | Event detail                          |
| `/speakers/[slug]` | Speaker profile + related events      |

Slug fields in Hygraph map directly to `[slug]` route params.

---

## Hygraph content schema

Source of truth is the Hygraph project. Field API IDs below must match queries and TypeScript types in `lib/`.

Docs: https://hygraph.com/docs

Use the **High-Performance Content API** endpoint from Project Settings → API Access.

### Model: `Event`

| API ID             | Field type                   | Required | Notes                     |
| ------------------ | ---------------------------- | -------- | ------------------------- |
| `eventName`        | Single line text             | ✓        | Title field               |
| `slug`             | Slug                         | ✓        | Unique → `/events/[slug]` |
| `shortDescription` | Multi line text              | ✓        | Cards, SEO excerpt        |
| `description`      | Rich text                    | ✓        | Full event body — query `markdown` on read |
| `bannerImage`      | Asset                        | ✓        | Hero / card image         |
| `startDate`        | Date & time                  | ✓        |                           |
| `endDate`          | Date & time                  | ✓        |                           |
| `category`         | Enumeration                  | ✓        | Filter events by category |
| `venue`            | Reference → `Venue`          |          | One-way reference         |
| `speakers`         | Reference → `Speaker` (many) |          | Two-way reference         |

### Model: `Speaker`

| API ID         | Field type                 | Required | Notes                                           |
| -------------- | -------------------------- | -------- | ----------------------------------------------- |
| `name`         | Single line text           | ✓        | Title field                                     |
| `slug`         | Slug                       | ✓        | Unique → `/speakers/[slug]`                     |
| `profilePhoto` | Asset                      | ✓        | Headshot                                        |
| `bio`          | Markdown                   | ✓        | Render as Markdown on the frontend              |
| `instagram`    | Single line text           |          | Optional social link                            |
| `twitter`      | Single line text           |          | Optional social link                            |
| `linkedin`     | Single line text           |          | Optional social link                            |
| `events`       | Reference → `Event` (many) |          | Two-way reference (reverse of `Event.speakers`) |

### Model: `Venue`

| API ID     | Field type       | Required | Notes                                                   |
| ---------- | ---------------- | -------- | ------------------------------------------------------- |
| `name`     | Single line text | ✓        | Title field                                             |
| `slug`     | Slug             | ✓        | Unique (embedded on event pages, not a top-level route) |
| `address`  | Multi line text  | ✓        |                                                         |
| `mapUrl`   | Single line text | ✓        | External map link                                       |
| `location` | Location         | ✓        | Lat/long coordinates from Hygraph                       |

### Model: `Page`

| API ID   | Field type | Required | Notes |
| -------- | ---------- | -------- | ----- |
| `name`   | Single line text | ✓ | Title field |
| `slug`   | Slug | ✓ | Unique — home page uses `home` |
| `layout` | Modular content (union) | ✓ | Ordered block list — render via `RenderBlocks` |

**`layout` union members:** `Hero`, `FeaturedEvent`, `FeaturedSpeaker` — query with `__typename` inline fragments.

### Component: `Hero`

| API ID      | Field type | Required | Notes |
| ----------- | ---------- | -------- | ----- |
| `heroTitle` | Single line text | ✓ | Headline |
| `heroImage` | Asset | ✓ | Hero image |
| `cta`       | Component → `Cta` | ✓ | Call to action |

### Component: `Cta`

| API ID        | Field type | Required | Notes |
| ------------- | ---------- | -------- | ----- |
| `ctaLabel`    | Single line text | ✓ | Button label |
| `redirectUrl` | Single line text | ✓ | Internal path or external URL |

### Component: `FeaturedEvent`

| API ID   | Field type | Required | Notes |
| -------- | ---------- | -------- | ----- |
| `events` | Reference → `Event` (many) | ✓ | Curated events for home |

### Component: `FeaturedSpeaker`

| API ID     | Field type | Required | Notes |
| ---------- | ---------- | -------- | ----- |
| `speakers` | Reference → `Speaker` (many) | ✓ | Curated speakers for home |

There is no separate `Tag` or `SiteSettings` model in this schema. Event filtering uses the `category` enumeration on `Event`. Home content is authored on the `Page` model — not a standalone `SiteSettings` singleton.

**`Category` enum values:** `concerts`, `business`, `technology`, `arts`, `gaming`, `wellness` — defined in `src/lib/types/index.ts` and `ALL_CATEGORIES` in `src/lib/formatters.ts`.

**Rich text read shape:** Hygraph returns `description { markdown, html, text }` on read. Always query `markdown` and render via `MarkdownContent` — do not parse the Slate AST on the frontend.

**Assets:** Hygraph `Asset` has `url`, `fileName`, `width`, `height` — no `altText` field.

---

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` (or `.env`) and fill in values. **Never commit real secrets.**

| Variable            | Required | Scope       | Purpose |
| ------------------- | -------- | ----------- | ------- |
| `HYGRAPH_ENDPOINT`  | Yes      | Server only | High-Performance Content API URL from Hygraph → **Project Settings → API Access** |
| `HYGRAPH_TOKEN`     | No       | Server only | Permanent Auth Token — only when the Content API is **not** public. Leave unset or empty for open APIs. Never `NEXT_PUBLIC_` |
| `REVALIDATE_SECRET` | No       | Server only | Secures on-demand revalidation webhook (needed when the webhook route is added) |

### Setup notes

- **Public/open Content API** — set only `HYGRAPH_ENDPOINT`. Do **not** set `HYGRAPH_TOKEN`; sending a missing, wrong, or malformed token causes **401/403** responses even when the API is otherwise open.
- **Protected Content API** — set `HYGRAPH_TOKEN` to a valid **Permanent Auth Token** from the same API Access screen (full JWT, three dot-separated segments).
- One variable per line in `.env` / `.env.local` (do not concatenate multiple vars on one line).
- `src/lib/hygraph.ts` reads `HYGRAPH_ENDPOINT` at module load. For protected APIs, attach `Authorization: Bearer …` in `getHygraphClient()` when `HYGRAPH_TOKEN` is set.

---

## Layout

Root layout ([`src/app/layout.tsx`](src/app/layout.tsx)) wraps every page:

- [`Header`](src/components/layout/Header.tsx) — sticky nav, desktop links, mobile `Sheet` menu (`"use client"`)
- `{children}` in a `flex-1` column
- [`Footer`](src/components/layout/Footer.tsx) — brand + nav links

Keep the site shell in `components/layout/`; do not duplicate header/footer inside route pages.

---

## UI & design standards

- Style: shadcn **`radix-sera`**, **`taupe`** base (`components.json`)
- Typography: `font-heading` (Playfair Display), `font-sans` (Noto Sans)
- Editorial, minimal look — sharp corners, uppercase tracked labels on buttons/badges
- Mobile-first and fully responsive across all breakpoints
- Compose all UI from `src/components/ui/` — add new primitives via `pnpm dlx shadcn@latest add <component>`
- Use `Card`, `Badge`, `Button`, `Avatar`, `Breadcrumb`, `Tabs`, `Separator`, `Skeleton` where appropriate
- Images: always `next/image` with `fileName` as alt text (Hygraph `Asset` has no `altText` field) and proper `sizes`

---

## Data fetching — do

- Fetch **all CMS content on the server** (Server Components by default)
- Put every Hygraph query and client setup in `src/lib/` — pages call `lib/` functions, never Hygraph directly
- Colocate GraphQL documents in `src/lib/queries/`
- Map responses to TypeScript types in `src/lib/types/` — keep in sync with the schema above
- Pass native `fetch` into `graphql-request` — **default is `cache: 'no-store'`** (no Hygraph caching). Opt in via `getHygraphClient({ revalidate: N })` or `HYGRAPH_REVALIDATE` env for TTL + `revalidateTag` webhooks
- Use granular cache tags per model and slug (`events`, `event-{slug}`, `speakers`, etc.)
- Use `generateStaticParams` on `[slug]` routes
- Use `generateMetadata` on every page for SEO
- Run independent queries in parallel, not sequentially
- Use `date-fns` in `lib/` for all date display logic
- Request only the fields each page needs — avoid over-fetching
- Query published content stage only
- Handle on-demand revalidation via a secured webhook route when Hygraph content changes
- **Next.js 16:** `params` and `searchParams` on pages are **Promises** — always `await` them before use

### Query functions (events)

| Function | Purpose | Cache tags |
| -------- | ------- | ---------- |
| `getEvents(category?)` | Listing + filter | `events` |
| `getPageBySlug(slug)` | Home (`slug: home`) — `layout` blocks | `pages`, `page-{slug}` |
| `getUpcomingEvents()` | Optional — next 3 events by `startDate` | `events` |
| `getEventBySlug(slug)` | Detail page | `events`, `event-{slug}` |
| `getAllEventSlugs()` | `generateStaticParams` | `events` |

---

## Data fetching — don't

- Don't fetch CMS content on the client (`useEffect`, client-side GraphQL, SWR/React Query for Hygraph)
- Don't put GraphQL strings or `graphql-request` calls inside `app/` route files
- Don't expose `HYGRAPH_TOKEN` or the endpoint token to the client
- Don't use a GraphQL client other than `graphql-request` without explicit approval
- Don't skip alt text on images (use Hygraph `Asset.fileName` when no dedicated alt field exists)
- Don't invent fields that aren't in the Hygraph schema
- Don't add `status`, `isFeatured`, `registrationUrl`, or `Tag` fields — they are not in the schema

---

## Component architecture — do

- Keep `components/ui/` free of business logic and Hygraph types
- Build page UI from composed components in `components/events/`, `components/speakers/`, `components/layout/`; CMS blocks live in `blocks/`
- Keep `app/` route files thin: fetch → pass props → render
- Use `"use client"` only for interactive UI (mobile nav, tabs, filters) — parent Server Component owns data
- Use `notFound()` when a slug does not resolve

### Events listing (`/events`)

- **Filter via URL:** `?category=technology` — server-rendered, SEO-friendly; no client-side filter state
- **`EventFilters`** (`"use client"`) — reads `useSearchParams()`, writes via `router.push`
- **Page shell is static** — title and intro render immediately; only filters + grid are async
- **`EventCard`** links to `/events/[slug]`; listing uses `EventGrid` for layout + empty state

### Event detail (`/events/[slug]`)

- Thin [`page.tsx`](src/app/events/[slug]/page.tsx): `generateStaticParams`, `generateMetadata`, shell `<article>`, Suspense boundary
- Async child (`EventDetailContent`) fetches with `getEventBySlug` → renders [`EventDetail`](src/components/events/EventDetail.tsx)
- `EventDetail` is presentational — receives a typed `Event` prop, no fetching

### Speakers (not yet built)

- Follow the same thin-page + composed component pattern as events
- Reuse `MarkdownContent` for `bio`

---

## Loading & Suspense

**Do not use route-level `loading.tsx`** for events routes. Use **inline `<Suspense>`** in `page.tsx` so static shells stream while data resolves.

| Route | Static shell (immediate) | Suspense fallback |
| ----- | ------------------------ | ----------------- |
| `/events` | Page header (title, intro) | Filters skeleton + grid skeleton |
| `/events/[slug]` | `<article>` wrapper | Breadcrumb (Home → Events) + content skeleton |

All skeleton components live in **[`src/components/skeletons/`](src/components/skeletons/)** — one file per domain, barrel-exported from `index.ts`:

- `events.tsx` — `EventsPageFiltersSkeleton`, `EventsPageGridSkeleton`, `EventSlugPageBreadcrumb`, `EventSlugPageContentSkeleton`

Add new route skeletons to the matching domain file (e.g. `speakers.tsx`), not inline in `app/` pages.

---

## Component architecture — don't

- Don't put event/speaker-specific markup directly in `app/` pages when it can be a component
- Don't add shadcn components outside `components/ui/`
- Don't put Hygraph queries or types inside `components/`
- Don't create client components just to avoid async Server Components
- Don't define skeleton markup inline in `app/` pages — use `src/components/skeletons/`
- Don't add `loading.tsx` when the page already uses granular inline `<Suspense>` boundaries

---

## Content rendering notes

- **Event `description`** — Query `description { markdown }`; render with [`MarkdownContent`](src/lib/render-markdown.tsx) (Server Component, `react-markdown`, editorial typography)
- **Speaker `bio`** — Markdown string; reuse `MarkdownContent` from `lib/`
- **Event `category`** — Enumeration; `formatCategory()` for labels, `ALL_CATEGORIES` for filter chips
- **Venue `location`** — Hygraph Location field (latitude/longitude); pair with `mapUrl` for display
- **Images** — `next/image` remote host `ap-south-1.graphassets.com` (see [`next.config.ts`](next.config.ts)); alt = `Asset.fileName`

---

## Agent checklist

- [ ] Read relevant `node_modules/next/dist/docs/` before using Next.js APIs
- [ ] `await params` / `await searchParams` on Next.js 16 pages
- [ ] Hygraph field API IDs match the schema tables above
- [ ] All data access goes through `src/lib/`
- [ ] UI primitives from `@/components/ui/*` only
- [ ] Skeletons in `src/components/skeletons/`, not inline in routes
- [ ] Inline `<Suspense>` with static shell — no `loading.tsx` for events routes
- [ ] Responsive on mobile through desktop
- [ ] `generateMetadata` and `generateStaticParams` on dynamic routes
- [ ] No secrets in client bundles
- [ ] Minimal, focused diff matching existing conventions
