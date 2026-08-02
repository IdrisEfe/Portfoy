# iesy.me — Project Instructions and Product Brief

## Current phase

This project is in implementation mode. The owner explicitly authorized implementation on 2026-08-02. Build iteratively from this brief, preserve unresolved items as configurable decisions, and do not deploy or connect production external services without explicit authorization.

When implementation is authorized, treat this file as the canonical product direction. Preserve decisions here unless the owner explicitly changes them. Record meaningful new product decisions in this file.

## Product vision

Build `iesy.me` as a bilingual, self-updating personal website for İdris Efe YEŞİLDAĞ. It should document his work while feeling like an evolving digital space: professional, technical, playful, futuristic, and restrained.

The website is intended for recruiters, engineers, founders, clients, collaborators, and other visitors. It must quickly communicate that İdris is a capable, ambitious builder who is approachable—someone visitors could build tomorrow with.

The experience should not resemble a generic portfolio template. It may take structural inspiration from `https://self-updating-me.vercel.app/`, including its clear hero, live GitHub activity, subtle motion, light/dark modes, and strong typography, but it must establish an original identity and interaction language.

## Identity and voice

- Display name: **İdris Efe YEŞİLDAĞ**. Preserve the uppercase surname and Turkish characters.
- Working descriptor: **Self-taught ambitious builder**. This remains editable and may later be informed by LinkedIn or GitHub, but it must not depend on either service to render.
- Hero copy is a two-part dramatic statement, not one continuous sentence:
  - **“I know what you want.”**
  - **“Someone you’ll never forget.”**
  Animate the transition between these two lines. Preserve the contraction and punctuation unless the owner changes the copy.
- Approved Turkish hero copy:
  - **“Neden burada olduğunu biliyorum.”**
  - **“Asla unutamayacağın biriyim.”**
- Treat the English and Turkish versions as separately authored copy rather than literal translations.
- Reveal the owner's name after the opening phrase rather than leading with the name.
- Desired voice: confident but not arrogant; professional, technical, playful, capable, and enjoying life.
- The main call-to-action must sound like the owner, not use generic copy such as “View projects.” Final wording is TBD.
- Approved primary call-to-action copy:
  - English: **“Let's start from here”**
  - Turkish: **“Eee, ne duruyoruz?”**
- The call-to-action begins a guided introduction rather than jumping directly to Work or Project Laboratory. The guided introduction should orient visitors quickly, remain skippable, preserve browser navigation expectations, and adapt its emphasis where practical without hiding core content.
- The guided introduction should take approximately 30 seconds when left in automatic mode. Any deliberate visitor interaction switches it into manual control; do not resume automatic advancement unless the visitor explicitly requests it.
- Use a cinematic/conversational/interactive hybrid rather than a conventional onboarding carousel.
- Imply awareness of possible visitor intent without requiring an up-front questionnaire. Visitors may optionally signal an interest such as business, collaboration, recruitment, or exploration through natural interactions.
- Allow immediate skipping and provide a way to replay the introduction later.
- The final destination should adapt to expressed or inferred interest when confidence is reasonable; otherwise end at a neutral overview. Never make consequential personal inferences or hide navigation based on guessed intent.
- Core emotional message: the visitor should feel that İdris is like a friend with whom they can build tomorrow.

## Primary goals

1. Give visitors a brief, compelling summary of current work and professional development.
2. Combine curated work with current GitHub and LinkedIn-related activity.
3. Make deeper exploration playful through projects, experiments, skills, and career history.
4. Make contacting İdris easy.
5. Let the owner update nearly all content and presentation without editing code.

## Information architecture

Use multiple pages. The current required destinations are:

1. **Home** — opening statement, identity, mixed dynamic showcase, current highlights, and contact paths.
2. **Work** — featured and recent projects plus access to the broader public repository catalog.
3. **Project Laboratory** — real in-browser interactive experiments plus polished demonstrations and project walkthroughs.
4. **Now** — current repositories, current learning/building, recent activity, selected LinkedIn posts, courses, and manually written updates.
5. **Skills Map** — languages, technologies, courses, experience, and relationships between them.
6. **Journey** — a scroll-driven career timeline mixing work, freelance activity, education, courses, certificates, projects, and milestones.
7. **About / Résumé** — an accessible web résumé and downloadable PDF.
8. **Contact** — email and enabled social/contact destinations.
9. **Admin** — private, owner-only content and presentation management.

Project Laboratory and Skills Map must have their own navigation entries. Final naming and whether About and Résumé are combined remain subject to product review.

The Work gallery must support project search, filtering, and sorting. These discovery controls are distinct from the Project Laboratory's real browser experiments.

The initial Project Laboratory should contain original small experiments created specifically for `iesy.me`, not merely extracts from existing projects. Experiments should demonstrate creativity and technical capability while remaining lightweight, accessible, and optional to load.

Initial experiment concepts:

1. **Abstract shooting/target test** — a non-graphic, clearly digital precision or reaction interaction without realistic weapon depiction.
2. **Cursor-fluid simulation** — a performant fluid-like field that responds to pointer and touch input.
3. **Digital firecracker/firework simulation** — a purely virtual particle-and-light experience. Do not include real-world construction, ignition, or safety-evasion instructions.

Each experiment needs keyboard/touch consideration, reduced-motion behavior, performance limits, a clear reset/exit, and a static fallback where appropriate.

Visitors must explicitly choose which Project Laboratory experiment to load. Do not download or initialize heavy simulations before selection. Show clear performance/motion notes where useful and allow an active experiment to be unloaded.

## Homepage experience

- Create a distinctive opening built around the animated “I know what you want” phrase.
- Reveal the owner's name after the opening statement.
- Include a dynamic mixed-content showcase. It may display projects, current activities, capabilities, and career moments.
- Do not repeat the same rotating-carousel pattern in multiple places. There should be one primary attention-driving rotating showcase unless a later design has a clearly different interaction purpose.
- Showcase content must be configurable in the admin panel. When no manual configuration exists, generate a sensible mixture from featured projects, recent work, current learning, and career highlights.
- Surface GitHub, LinkedIn, email, and any other enabled social links without letting social icons dominate the experience.
- The profile/avatar treatment must be interactive and fast-loading.

## Projects and GitHub

- GitHub profile: `https://github.com/IdrisEfe`
- All public repositories may be discoverable through the website, including forks.
- Archived repositories, empty repositories, course exercises, and configuration repositories should not appear in the website catalog by default; they remain accessible on GitHub. Provide admin overrides where reasonable.
- Project prominence should use this order:
  1. explicit admin selection and ordering;
  2. featured status;
  3. meaningful recent activity;
  4. popularity signals;
  5. other quality/relevance signals.
- Do not treat raw commit count as a proxy for project quality.
- The home/work summary should combine manually featured projects with recent activity.
- Clicking into Work should show an organized gallery. Clicking a project should open an immersive case-study view.
- Project presentations may include screenshots, descriptions, technologies, repository statistics, live demos, development status, and case-study content when available.
- Activity should be translated into concise human-readable entries rather than exposing an unfiltered commit log.
- GitHub data should refresh approximately every 5–15 minutes. Admin changes should appear immediately after publication.
- Design graceful cached and offline states so GitHub availability and rate limits never break the website.

## LinkedIn content

- LinkedIn profile: `https://www.linkedin.com/in/i-efe-ye%C5%9Filda%C4%9F-0a6687313/`
- The owner accepts an admin-assisted, compliant LinkedIn workflow because ordinary applications cannot rely on permission to retrieve a member's posts automatically.
- The workflow should allow the owner to paste a LinkedIn post URL. The system may extract only metadata that can be accessed lawfully and reliably, then present a confirmation/edit form.
- The editable post record should support title, excerpt, media/thumbnail, publication date, tagged people, cited/source links, original post URL, translations, visibility, and display order.
- Tagged people may be revealed through an accessible hover/focus interaction.
- Source links used by a post should be presented clearly.
- Always link to the original LinkedIn post.
- Do not scrape LinkedIn or depend on unofficial endpoints. Do not claim LinkedIn content is real-time when it requires owner submission.
- If official approved API access becomes available later, place it behind the same normalized content model so the presentation layer does not need to be rebuilt.

## Activity and freshness

- Combine curated accomplishments with current activity.
- GitHub-derived updates may refresh every 5–15 minutes.
- LinkedIn-related entries publish immediately after owner review and publication.
- Present activity as a coherent narrative rather than a raw feed.
- Clearly distinguish source, date, status, and whether an entry is manually curated or automatically derived when that distinction matters to users.

## Profile and avatar

- Preferred source is an owner-provided profile image, not a runtime dependency on LinkedIn.
- Admin-selectable modes should eventually include:
  - profile image;
  - lightweight interactive 2D or particle/dot interpretation;
  - anonymous 3D head;
  - abstract digital mask;
  - possible lightweight 3D interpretation of an authorized profile image.
- Fast loading has priority over a photorealistic likeness.
- The initial/default avatar mode should be an original interactive digital mask.
- The digital mask should constantly transform. Its motion must remain restrained enough to preserve readability and must slow down or become static under reduced-motion preferences.
- The mask may react to cursor/pointer movement, scrolling, local time of day, and sound. Sound-reactive behavior must be optional, start muted, require explicit visitor activation, expose a clear mute control, and never request microphone access without a separate explicit explanation and permission action.
- The mask should feel calm and welcoming by default, becoming more energetic through interaction.
- Sound reactivity may use both website audio and, only after explicit opt-in, microphone input. Process microphone-derived audio locally in the browser where feasible; do not record, upload, or retain microphone audio.
- Interaction may react to cursor or pointer movement, but must work without hover and must respect reduced-motion preferences.
- A supplied anime-character avatar currently exists only as a visual reference in the conversation. Do not copy, bundle, publish, or derive a close replica from third-party character artwork unless the owner confirms the necessary usage rights. Prefer an original visual identity or an owner-authored/authorized image.

## Motion and interaction

- Target interaction ambition: **8/10**.
- Desired techniques include animated backgrounds, cursor reactions, project-card movement, changing/live layouts, and scroll storytelling—especially for Journey.
- Use motion to communicate hierarchy, state, or personality. Avoid decorative motion that delays access to content.
- Provide a complete reduced-motion experience.
- Support keyboard, touch, coarse pointers, and devices without hover.
- Keep 3D and canvas effects progressively enhanced and outside critical rendering paths.
- Prioritize fast perceived loading, stable layout, and responsive input.

## Audio direction

- Audio may include ambient music, interface/interaction sounds, and experiment-specific sounds.
- Some pages may have their own audio theme. Transitions between themes must feel natural, using restrained crossfades or compositionally compatible changes rather than abrupt restarts.
- Audio may adapt automatically to page, interaction intensity, time of day, and active experiment, but visitors retain control.
- Start the website muted unless the owner later approves a different behavior that complies with browser autoplay rules and visitor expectations.
- Provide persistent play/pause or mute controls, remember preference where appropriate, and never make audio necessary to understand or operate the site.
- Respect reduced-motion and relevant accessibility preferences; provide captions or visual equivalents for meaningful audio cues.
- Avoid shipping excessive audio payloads. Lazy-load page and experiment themes and use seamless fallback behavior on slow connections.

## Visual direction

- Futuristic but restrained.
- Professional and technical, with playful moments.
- Support both light and dark themes.
- Use a broad but disciplined color system; the owner has no prohibited colors and generally likes color.
- Potential motifs may combine networks, maps, construction/building, code, light, motion, machinery, geometry, and nature. The final identity should unify selected motifs rather than use all of them literally.
- Typography and whitespace should keep complex information readable.
- Avoid copying the reference site's specific line artwork, layout, animations, or visual identity.

## Internationalization

- Languages: English and Turkish.
- English is the default for first-time visitors.
- Provide a visible language switcher.
- English and Turkish content must be written and editable separately; do not present automatic machine translation as final copy.
- Preserve the selected language during navigation and future visits where appropriate.
- Design for different text lengths and correct Turkish characters.

## Social and contact destinations

- Email: `i.efeyesildag@gmail.com`
- GitHub: `https://github.com/IdrisEfe`
- LinkedIn: `https://www.linkedin.com/in/i-efe-ye%C5%9Filda%C4%9F-0a6687313/`
- Spotify: `https://open.spotify.com/user/315dpafnk4ltjujjxqc2gjzllor4?si=e6d06874ffa349bc`
- Every social/contact destination must be an admin-managed record with label, URL/value, icon, order, visibility, placement, and optional localized description.
- The owner must be able to add, edit, reorder, temporarily hide, or remove Spotify and other social links without code changes.
- Do not expose the private admin email or other secrets through public configuration.

## Admin panel

- Single administrator.
- Authenticate through GitHub and allow only the owner's explicitly configured GitHub account. Do not infer authorization from profile name alone; verify immutable account identity.
- Required editable content includes:
  - biography and professional descriptor;
  - hero phrases and primary calls-to-action;
  - skills and technology map;
  - timeline and career entries;
  - résumé content and downloadable file;
  - separate English and Turkish copy;
  - homepage showcase items and ordering;
  - projects, case studies, visibility, and GitHub overrides;
  - LinkedIn post records;
  - Now updates, courses, certificates, and milestones;
  - contact information and social accounts;
  - profile/avatar mode;
  - uploaded imagery and external/repository media.
- Support draft, preview, and published states.
- Support both direct image uploads and references to repository/external assets.
- Validate URLs, uploads, translations, and required fields.
- Keep secrets server-side and enforce authorization for every mutation, not only for viewing the admin interface.
- Maintain enough revision history to recover accidental edits; exact versioning scope is TBD.

## Résumé

- Résumé content is currently TBD.
- Provide both an accessible web presentation and a downloadable PDF.
- The admin panel must allow replacement of the PDF and editing of the web content.
- Do not allow the PDF and web version to silently contradict each other; show update status or establish a canonical source during technical planning.

## Accessibility, privacy, and quality

- Target WCAG 2.2 AA for core content and interaction.
- All hover interactions require keyboard/focus and touch equivalents.
- Respect `prefers-reduced-motion`, contrast preferences where practical, and semantic navigation.
- Decorative canvas/3D content must have accessible fallbacks and must not trap input.
- Do not expose access tokens or fetch protected third-party APIs directly from the browser.
- Use privacy-friendly visitor analytics and collect only the minimum useful data. Prefer an approach that avoids cross-site tracking and unnecessary cookies. Analytics are private by default and visible to the owner in the admin panel. The admin may explicitly publish aggregate **total visits**, **countries**, **referrers**, **popular pages**, and **project clicks**, individually enabling or disabling each metric. Never publish individual visitor identities or overly granular combinations that could identify a person. The exact provider, retention period, consent requirements, thresholds, and presentation remain TBD.
- Provide a contact form as well as direct contact links. Initial fields are **name**, **email**, **reason for contact**, and **message**. Primary reasons are **collaboration**, **business**, and **feedback**; include a safe fallback such as **other** if needed. Protect it against spam and abuse, validate input on the server, avoid exposing secrets, collect minimal personal data, and show clear success/failure states. Delivery provider, retained fields, deletion policy, and optional reply-copy behavior remain TBD.
- After a valid **collaboration** or **business** inquiry, offer scheduling as an optional next step. Do not force scheduling or expose private calendar details. Provider and availability rules remain TBD.
- Current scheduling recommendation: prefer **Fillout Scheduling** for the initial release, subject to implementation-time verification. It can combine a conditional contact flow and scheduling page, prefill previously entered name/email data, connect to Google or Outlook calendars, and embed the experience. This is a closer fit than a standalone scheduler because scheduling should appear only after qualifying collaboration or business inquiries.
- Initial scheduling configuration: connect **Google Calendar**, create meetings through **Google Meet**, and offer a **30-minute** meeting duration.
- Default availability, interpreted in **Europe/Istanbul** time:
  - weekdays: **16:00–20:00**;
  - weekends: **10:00–15:00**.
- Display available slots in the visitor's local timezone while clearly identifying the timezone.
- Add a **10-minute buffer** between meetings.
- Allow bookings no more than **two weeks** into the future.
- Allow invitees to cancel or reschedule through their confirmation email.
- Require at least **24 hours of advance notice** for bookings.
- Keep **Cal.com** as the fallback when deeper control over the booking interface, a modular/custom booking flow, or eventual self-hosting becomes more important than a unified no-code form-and-scheduling workflow.
- Load any third-party scheduling embed only on demand. Clearly disclose the provider before loading it where privacy or cookie behavior requires this.
- Ensure useful metadata, social previews, sitemap, structured data, and bilingual SEO.
- Handle empty data, API failures, rate limits, missing images, and unpublished content gracefully.

## GitHub-based project workflow

- The source of truth for code must be a GitHub repository.
- The repository is intended to be public.
- Other people may reuse the project, but attribution to İdris Efe YEŞİLDAĞ is required in both forms: preserved copyright/license attribution in source distributions and visible credit in deployed derivatives. Select or draft appropriate license terms before public release; do not label the license as a standard open-source license if additional visible-credit conditions make that description inaccurate.
- Use branches and pull requests for meaningful changes once implementation starts.
- Never commit credentials, OAuth secrets, API tokens, private keys, or production environment values.
- Add CI for formatting, linting, type checking, tests, and production builds once the stack is selected.
- Keep content schema migrations and deployment configuration reviewable in version control.
- The repository and deployment topology are still TBD. Do not create a remote repository, push, open a pull request, or configure external services without explicit authorization.

## Possible reusable template

A reusable personal-portfolio template may be created later, but it is not part of the approved initial scope yet.

If approved later:

- Separate owner-specific content, credentials, IDs, and branding from reusable components.
- Provide safe defaults and setup documentation.
- Do not let template abstraction compromise the quality or distinctiveness of `iesy.me`.
- Decide explicitly whether the template is private, public, or open source before publishing it.

## Known constraints and non-goals

- Do not scrape LinkedIn.
- Do not make the site depend on fetching a LinkedIn profile photo at runtime.
- Do not show every GitHub repository indiscriminately in primary portfolio views.
- Do not create two visually redundant rotating showcases.
- Do not sacrifice performance or accessibility for 3D effects.
- Do not copy the reference website or third-party avatar artwork.
- Do not begin implementation while the project remains in product-definition mode.

## Decisions still required before implementation

1. Final navigation names and hierarchy.
2. Exact animation and timing for the approved English and Turkish hero statements.
3. Exact scenes, copy, interest signals, manual controls, and destination mapping for the 30-second guided introduction.
4. Homepage showcase behavior, item count, timing, and manual/default selection rules.
5. Initial project selection and what constitutes a course/configuration repository.
6. Career, education, course, certificate, and milestone source content.
7. Skills-map structure and proficiency representation.
8. Original/authorized avatar asset and default avatar mode.
9. Résumé content and canonical update workflow.
10. Final Fillout-versus-custom contact implementation, spam protection, data retention, and embed behavior. Initial bookings use Google Calendar, Google Meet, a 30-minute duration, the approved Istanbul-time availability windows, 24-hour minimum notice, a 10-minute buffer, a two-week horizon, and email-based cancellation/rescheduling.
11. Analytics provider, privacy thresholds for published aggregates, retention, privacy disclosure, and cookie/consent requirements.
12. Admin revision-history depth and media-storage requirements.
13. Technical stack, content store/database, hosting, authentication provider, caching, and deployment architecture.
14. GitHub repository name, branching conventions, exact attribution/license terms, contribution policy, and deployment ownership. Repository visibility is public and reuse with attribution is intended.
15. Whether and when to create the reusable personal-portfolio template.
16. Final brand system: typography, palette, motifs, logo/mark, favicon, and motion language.

## Acceptance principles

Any eventual implementation should be rejected or revised if it:

- feels like a generic developer portfolio;
- obscures the owner's current work;
- requires code edits for routine content management;
- claims unsupported real-time LinkedIn integration;
- becomes slow or unusable because of animation or 3D;
- loses functionality under reduced-motion, touch, or keyboard use;
- treats raw popularity metrics as the definition of quality;
- exposes unpublished admin content or secrets;
- renders Turkish copy or characters incorrectly;
- duplicates the reference site's identity instead of creating an original one.
