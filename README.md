# iesy.me

The evolving digital portfolio of **İdris Efe YEŞİLDAĞ**.

**Live site:** [iesy-me-portfolio.iesy.chatgpt.site](https://iesy-me-portfolio.iesy.chatgpt.site)

## Included in the current implementation

- Responsive futuristic light/dark design
- English/Turkish preference and bilingual homepage/navigation
- Interactive 3D point-cloud face with an admin-selectable transforming-mask fallback
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

On Windows, if `pnpm` is not installed globally, use the included launcher instead:

```powershell
.\dev.cmd
```

It automatically uses pnpm when available and otherwise finds the bundled Codex runtime. The development URL is fixed at `http://localhost:3000` for GitHub OAuth consistency.

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

The GitHub OAuth **Homepage URL** can be `http://localhost:3000`, but the separate **Authorization callback URL** must include the full `/api/auth/github/callback` path. Local development is pinned to port `3000`; if that port is occupied, stop the other process instead of accepting Next.js's fallback port.

Copy `.env.example` to `.env.local`, keep `SITE_URL=http://localhost:3000`, configure the OAuth credentials, set `ADMIN_GITHUB_USER_ID` to your immutable GitHub numeric ID, and generate a long random `ADMIN_SESSION_SECRET`. Set `GITHUB_CONTENT_REPO=Portfoy` and `GITHUB_CONTENT_BRANCH=content`.

Admin-managed content and uploads live on the separate `content` branch. The publisher creates that branch from the repository's default branch on its first publication. Code remains on `main`, so an admin edit does not move the local development branch ahead or behind and does not require VS Code synchronization. Uploaded assets use their public GitHub raw URL.

For local development only, `ADMIN_DEV_BYPASS=true` unlocks the editor without OAuth. The bypass is ignored in production.

Publishing writes only visible content into the public repository. Public pages read the latest published GitHub content on refresh and fall back to the checked-in JSON when GitHub is unavailable. Hidden records remain in the browser-local draft and are not published.

## Integration status

- GitHub public repositories: connected without credentials; optional token supported.
- LinkedIn posts: compliant URL-plus-confirmation editor is implemented; automatic personal-post retrieval remains unavailable without LinkedIn approval.
- Fillout scheduling: embed is implemented; add the Fillout form ID and connect Google Calendar/Meet in Fillout.
- Analytics: Umami tracking, custom project-click events, private credentials, and selective public aggregates are implemented; account credentials remain to be supplied.
- Admin: GitHub OAuth, encrypted sessions, drafts, preview, GitHub content publishing, and asset uploads are implemented.

## Deployment

The portfolio is publicly hosted at [iesy-me-portfolio.iesy.chatgpt.site](https://iesy-me-portfolio.iesy.chatgpt.site) using the Cloudflare-compatible OpenNext build.

The custom `iesy.me` domain and production GitHub OAuth app are the remaining owner-controlled setup steps. Until the custom domain is connected, configure the production OAuth app with:

```text
Homepage URL: https://iesy-me-portfolio.iesy.chatgpt.site
Callback URL: https://iesy-me-portfolio.iesy.chatgpt.site/api/auth/github/callback
```

After `iesy.me` becomes active, change both the OAuth URLs and the production `SITE_URL` to the custom domain.

## Ownership and reuse

Copyright © İdris Efe YEŞİLDAĞ. A final reuse license with source attribution and visible deployed credit is still being selected. Until a license file is added, normal copyright rules apply.
