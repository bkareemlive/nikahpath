# Project notes

## What this is

A marketing website for **NikahPath**, a marriage introduction service for
practicing Muslims. Operated by **Al-Fur'qan International Missionary**.

Marketing pages only — no authentication and no application. All "Log in" and
"Create profile" links point at a placeholder `app.nikahpath.com` subdomain
configured in `src/data/site.ts`.

## Scope

A concept for a marriage introduction service was used to decide which pages a
site like this needs. The page set, feature list, plan structure and all copy on
this site are original to this project. Sample profiles, testimonials and
success stories are invented and must be replaced before any real use.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Positioning, three-step summary, ground rules, member preview, one story, guardians strip, closing CTA with the numbers |
| `/approach` | Single page merging process (step-by-step), ground rules, why it exists, and who operates it |
| `/members` | A larger sample of member profiles, split sisters / brothers |
| `/independent-wali` | For sisters with no family guardian: a vetted register of appointed walis, the request/accept flow, and the guided rules from the Shariah and Sunnah |
| `/widows-and-widowers` | A category chosen at sign-up for those who have been widowed — why it is separate, how it works, member sample, FAQ (iddah, children, pace) |
| `/for-guardians` | How a wali takes part — visibility, contact, raising a concern |
| `/membership` | Free / Full Access / Lifetime plans, comparison table, FAQ, matchmaking offer |
| `/stories` | Story submission with a thank-you payment for approved stories |
| `/journal` + `/journal/[slug]` | Articles grouped by stage of the process; eight pieces |
| `/terms`, `/privacy` | Placeholder legal pages — replace with reviewed copy |

The page set and section order are deliberately arranged differently from any
one reference: process and story pages are merged, members and guardians get
their own routes, and the home page leads with the process rather than a live
sign-up feed.

## Core ideas the product is built around

- The intention is marriage from the first message, not casual dating.
- The guardian (wali) is involved throughout.
- Profiles are text only — no photos.
- Real name and contact details stay private until the member shares them.
- The design pushes members towards meeting in person rather than messaging for months.

## Design

- Deep-emerald palette (`#0b5d42`) with a restrained gold accent.
- Fraunces for display type, Inter for body, both via `next/font`.
- Custom SVG logo and a hand-built geometric hero pattern.

## Editing

- Name, tagline, URLs, stats and the copyright holder: `src/data/site.ts`.
- Palette and prose styles: the `@theme` block in `src/app/globals.css`.
- Plans, feature matrix and pricing FAQ: `src/data/pricing.ts`.
- Sample members and the "new this week" list: `src/data/profiles.ts`.
- Articles: `src/data/posts.ts`.
