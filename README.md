# iesy.me

The evolving digital portfolio of **İdris Efe YEŞİLDAĞ**.

## Included in the current implementation

- Responsive futuristic light/dark design
- English/Turkish preference and bilingual homepage/navigation
- Transforming interactive digital mask
- 30-second guided introduction with manual takeover and intent-aware destinations
- Live GitHub repository catalog with ten-minute revalidation, search, and sorting
- On-demand target, fluid, and digital-firework browser experiments
- Now, Skills Map, Journey, About/Résumé, and Contact foundations
- Original opt-in synthesized ambient audio
- Contact-to-scheduling interface prepared for Fillout
- Reduced-motion, keyboard, touch, metadata, robots, and sitemap foundations

## Local development

Use Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Production verification:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Copy `.env.example` to `.env.local` when connecting integrations. The public site works without a GitHub token, but a server-side token raises API limits. Never expose tokens with a `NEXT_PUBLIC_` prefix.

## Integration status

- GitHub public repositories: connected without credentials; optional token supported.
- LinkedIn posts: admin-assisted model specified, not yet connected to persistent storage.
- Fillout scheduling: UI prepared; requires a Fillout form ID and owner calendar connection.
- Analytics: privacy rules specified; provider not yet selected.
- Admin: data model and requirements are specified in `AGENTS.md`; authentication and persistence require infrastructure decisions.

## Ownership and reuse

Copyright © İdris Efe YEŞİLDAĞ. A final reuse license with source attribution and visible deployed credit is still being selected. Until a license file is added, normal copyright rules apply.
