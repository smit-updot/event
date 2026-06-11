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

| Package | Use for |
|---------|---------|
| `graphql` | GraphQL core; required by `graphql-request` |
| `graphql-request` | All Hygraph Content API queries — configure in `lib/` only |
| `date-fns` | Formatting `startDate` / `endDate` on events |
| `clsx` + `tailwind-merge` | Class merging via `cn()` in `lib/utils.ts` |
| `class-variance-authority` | Component variants in `components/ui/` |
| `lucide-react` | Icons across the UI |
| `radix-ui` | Underlying primitives for shadcn components |
| `next` / `react` / `react-dom` | Framework and rendering |

Do **not** add Apollo Client, URQL, or other GraphQL clients — `graphql-request` is the standard for this project.

**Not yet installed** (add only when needed): a Markdown renderer for Speaker `bio` (e.g. `react-markdown`), a Rich Text renderer for Event `description` (e.g. Hygraph Rich Text AST helper). Prefer lightweight, server-compatible options.

---

## Directory conventions

| Path | Purpose |
|------|---------|
| `src/app/` | Routes only — thin pages, metadata, static params |
| `src/app/events/` | Events listing |
| `src/app/events/[slug]/` | Single event detail |
| `src/app/speakers/[slug]/` | Single speaker profile |
| `src/components/ui/` | **All** shadcn/Radix UI primitives — nothing else |
| `src/components/events/` | Event-specific composed components |
| `src/components/speakers/` | Speaker-specific composed components |
| `src/components/layout/` | Header, footer, nav, page shells |
| `src/lib/` | **All** Hygraph access, GraphQL queries, types, formatters, helpers |

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home — upcoming / highlighted events |
| `/events` | Events index (filterable by category) |
| `/events/[slug]` | Event detail |
| `/speakers/[slug]` | Speaker profile + related events |

Slug fields in Hygraph map directly to `[slug]` route params.

---

## Hygraph content schema

Source of truth is the Hygraph project. Field API IDs below must match queries and TypeScript types in `lib/`.

Docs: https://hygraph.com/docs

Use the **High-Performance Content API** endpoint from Project Settings → API Access.

### Model: `Event`

| API ID | Field type | Required | Notes |
|--------|------------|----------|-------|
| `eventName` | Single line text | ✓ | Title field |
| `slug` | Slug | ✓ | Unique → `/events/[slug]` |
| `shortDescription` | Multi line text | ✓ | Cards, SEO excerpt |
| `description` | Rich text | ✓ | Full event body |
| `bannerImage` | Asset | ✓ | Hero / card image |
| `startDate` | Date & time | ✓ | |
| `endDate` | Date & time | ✓ | |
| `category` | Enumeration | ✓ | Filter events by category |
| `venue` | Reference → `Venue` | | One-way reference |
| `speakers` | Reference → `Speaker` (many) | | Two-way reference |

### Model: `Speaker`

| API ID | Field type | Required | Notes |
|--------|------------|----------|-------|
| `name` | Single line text | ✓ | Title field |
| `slug` | Slug | ✓ | Unique → `/speakers/[slug]` |
| `profilePhoto` | Asset | ✓ | Headshot |
| `bio` | Markdown | ✓ | Render as Markdown on the frontend |
| `instagram` | Single line text | | Optional social link |
| `twitter` | Single line text | | Optional social link |
| `linkedin` | Single line text | | Optional social link |
| `events` | Reference → `Event` (many) | | Two-way reference (reverse of `Event.speakers`) |

### Model: `Venue`

| API ID | Field type | Required | Notes |
|--------|------------|----------|-------|
| `name` | Single line text | ✓ | Title field |
| `slug` | Slug | ✓ | Unique (embedded on event pages, not a top-level route) |
| `address` | Multi line text | ✓ | |
| `mapUrl` | Single line text | ✓ | External map link |
| `location` | Location | ✓ | Lat/long coordinates from Hygraph |

There is no separate `Tag` or `SiteSettings` model in this schema. Event filtering uses the `category` enumeration on `Event`.

---

## Environment variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `HYGRAPH_ENDPOINT` | Server only | High-Performance Content API URL |
| `HYGRAPH_TOKEN` | Server only | Permanent Auth Token — never `NEXT_PUBLIC_` |
| `REVALIDATE_SECRET` | Server only | Secures on-demand revalidation webhook |

---

## UI & design standards

- Style: shadcn **`radix-sera`**, **`taupe`** base (`components.json`)
- Typography: `font-heading` (Playfair Display), `font-sans` (Noto Sans)
- Editorial, minimal look — sharp corners, uppercase tracked labels on buttons/badges
- Mobile-first and fully responsive across all breakpoints
- Compose all UI from `src/components/ui/` — add new primitives via `pnpm dlx shadcn@latest add <component>`
- Use `Card`, `Badge`, `Button`, `Avatar`, `Breadcrumb`, `Tabs`, `Separator`, `Skeleton` where appropriate
- Images: always `next/image` with `altText` from Hygraph assets and proper `sizes`

---

## Data fetching — do

- Fetch **all CMS content on the server** (Server Components by default)
- Put every Hygraph query and client setup in `src/lib/` — pages call `lib/` functions, never Hygraph directly
- Colocate GraphQL documents in `src/lib/queries/`
- Map responses to TypeScript types in `src/lib/types/` — keep in sync with the schema above
- Pass native `fetch` into `graphql-request` so Next.js caching and `revalidateTag` work
- Use granular cache tags per model and slug (`events`, `event-{slug}`, `speakers`, etc.)
- Use `generateStaticParams` on `[slug]` routes
- Use `generateMetadata` on every page for SEO
- Run independent queries in parallel, not sequentially
- Use `date-fns` in `lib/` for all date display logic
- Request only the fields each page needs — avoid over-fetching
- Query published content stage only
- Handle on-demand revalidation via a secured webhook route when Hygraph content changes

---

## Data fetching — don't

- Don't fetch CMS content on the client (`useEffect`, client-side GraphQL, SWR/React Query for Hygraph)
- Don't put GraphQL strings or `graphql-request` calls inside `app/` route files
- Don't expose `HYGRAPH_TOKEN` or the endpoint token to the client
- Don't use a GraphQL client other than `graphql-request` without explicit approval
- Don't skip `altText` on images
- Don't invent fields that aren't in the Hygraph schema
- Don't add `status`, `isFeatured`, `registrationUrl`, or `Tag` fields — they are not in the schema

---

## Component architecture — do

- Keep `components/ui/` free of business logic and Hygraph types
- Build page UI from composed components in `components/events/`, `components/speakers/`, `components/layout/`
- Keep `app/` route files thin: fetch → pass props → render
- Use `"use client"` only for interactive UI (mobile nav, tabs, filters) — parent Server Component owns data
- Use `notFound()` when a slug does not resolve

---

## Component architecture — don't

- Don't put event/speaker-specific markup directly in `app/` pages when it can be a component
- Don't add shadcn components outside `components/ui/`
- Don't put Hygraph queries or types inside `components/`
- Don't create client components just to avoid async Server Components

---

## Content rendering notes

- **Event `description`** — Rich text from Hygraph; render via a dedicated helper in `lib/`
- **Speaker `bio`** — Markdown string; render via a Markdown helper in `lib/` (add a renderer package when implementing)
- **Event `category`** — Enumeration; use for filters and badges on the events listing
- **Venue `location`** — Hygraph Location field (latitude/longitude); pair with `mapUrl` for display

---

## SEO — do

- Export `metadata` or `generateMetadata` on every route
- Use `eventName`, `shortDescription`, and `bannerImage` for event OG metadata
- Use `name`, `bio`, and `profilePhoto` for speaker OG metadata
- Generate `sitemap.ts` and `robots.ts` from Hygraph slugs
- Use semantic HTML (`article`, `time`, `address`)

---

## Agent checklist

- [ ] Read relevant `node_modules/next/dist/docs/` before using Next.js APIs
- [ ] Hygraph field API IDs match the schema tables above
- [ ] All data access goes through `src/lib/`
- [ ] UI primitives from `@/components/ui/*` only
- [ ] Responsive on mobile through desktop
- [ ] `generateMetadata` and `generateStaticParams` on dynamic routes
- [ ] No secrets in client bundles
- [ ] Minimal, focused diff matching existing conventions
