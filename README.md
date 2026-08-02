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
- Fillout contact/scheduling embed with a safe email fallback
- Owner-only GitHub OAuth admin with local drafts, preview, and validated publishing
- Editable identity, showcase, skills, journey, socials, LinkedIn records, résumé, and public analytics controls
- GitHub-backed publishing and authenticated PDF/image uploads
- Optional no-cookie Umami tracking and privacy-thresholded public metrics
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

## Admin setup

Create a GitHub OAuth app and set its callback to:

```text
http://localhost:3000/api/auth/github/callback
```

Copy `.env.example` to `.env.local`, configure the OAuth credentials, set `ADMIN_GITHUB_USER_ID` to your immutable GitHub numeric ID, and generate a long random `ADMIN_SESSION_SECRET`. Set `GITHUB_CONTENT_REPO` after creating the public remote repository.

For local development only, `ADMIN_DEV_BYPASS=true` unlocks the editor without OAuth. The bypass is ignored in production.

Publishing writes only visible content into the public repository. Hidden records remain in the browser-local draft and are not published.

## Integration status

- GitHub public repositories: connected without credentials; optional token supported.
- LinkedIn posts: compliant URL-plus-confirmation editor is implemented; automatic personal-post retrieval remains unavailable without LinkedIn approval.
- Fillout scheduling: embed is implemented; add the Fillout form ID and connect Google Calendar/Meet in Fillout.
- Analytics: Umami tracking, custom project-click events, private credentials, and selective public aggregates are implemented; account credentials remain to be supplied.
- Admin: GitHub OAuth, encrypted sessions, drafts, preview, GitHub content publishing, and asset uploads are implemented.

## Ownership and reuse

Copyright © İdris Efe YEŞİLDAĞ. A final reuse license with source attribution and visible deployed credit is still being selected. Until a license file is added, normal copyright rules apply.
