# NikahPath — marketing site

A marketing site for **NikahPath**, a marriage introduction service for
practicing Muslims. Operated by **Al-Fur'qan International Missionary**.
Deep-emerald palette, Fraunces + Inter typography.

Marketing pages only — there is no auth or app. All "Log in" / "Create Profile"
links point at a placeholder `app.nikahpath.com` subdomain (see `src/data/site.ts`).

All page structure, features, plans and copy are original to this project.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS v4 (config lives in `src/app/globals.css` via `@theme`)
- `next/font` for Fraunces (display) and Inter (body)
- All content is static; blog posts are generated with `generateStaticParams`

## Develop

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint
```

Requires Node >= 18.17 (developed on Node 20).

## Structure

```
src/
├── app/
│   ├── layout.tsx            # fonts, metadata, Header + Footer
│   ├── page.tsx              # Home
│   ├── approach/             # process + rules + who runs it (merged page)
│   ├── members/              # sample member profiles
│   ├── independent-wali/     # appointed-wali register + request flow + rules
│   ├── widows-and-widowers/  # category page: why, how, members, FAQ
│   ├── for-guardians/        # the wali's role
│   ├── membership/           # plans, comparison table, FAQ, matchmaking
│   ├── stories/              # success-story submission
│   ├── journal/              # index + [slug] articles, grouped by theme
│   ├── terms/ · privacy/     # placeholder legal pages
│   ├── not-found.tsx
│   └── globals.css           # design tokens + prose styles
├── components/               # Header, Footer, Button, ProfileCard, Faq, PricingPlans, ...
└── data/
    ├── site.ts               # name, nav, footerNav, URLs, stats, copyright holder
    ├── profiles.ts           # sample sisters / brothers, lifeStage, widowedMembers
    ├── walis.ts              # independent-wali register + guided rules
    ├── posts.ts              # journal articles + theme groups
    └── pricing.ts            # plan prices, feature matrix, membership FAQ
```

## Rebranding

Change the name, tagline, URLs, headline stats and copyright holder in
`src/data/site.ts`. Change the palette (currently deep emerald `#0b5d42`) in the
`@theme` block at the top of `src/app/globals.css`.

## Notes

- `PROJECT-NOTES.md` — project scope and structure.
- Sample profiles, testimonials and success stories are invented for layout
  purposes. Replace before any real use.
- Legal pages are placeholders and must be replaced with reviewed copy.
