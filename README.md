# Air Dive Alor website (Next.js)

Built from the Claude Design prototypes for the Air Dive Alor site (Airdivealor website mockups).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Pages

| Route | Prototype |
| --- | --- |
| `/` | `HomeDescent.dc.html`: loading screen, depth gauge, prices, why Alor, dive sites, safety stop, reviews, FAQ and the 3-step booking form (`#b-prices`, `#b-faq`, `#b-book`) |
| `/dive-sites`, `/dive-sites/[slug]` | `DiveSites.dc.html`: 33 sites, 9 at a time, and a guide page per site |
| `/facilities-and-rates` | `FacilitiesRates.dc.html` |
| `/dive-courses`, `/dive-courses/[id]` | `DiveCourses.dc.html`: 12 courses and a detail page per course |
| `/about-us` | `AboutUs.dc.html` |
| `/blog`, `/blog/[slug]` | `Blog.dc.html`, `BlogPost.dc.html` |

The prototypes' overlays (site guide, course detail, story picker) are real pages here, so each one has its own link.

## Content and translations

- Content is in `lib/`: `home-data.ts`, `sites-data.ts`, `courses-data.ts`, `blog-data.ts`, all generated from the prototype data files. Edit them there.
- EN / ID switch: `lib/i18n.tsx`. The dictionary comes from the prototypes (`lib/i18n-dict.ts`, `lib/page-dicts.ts`, and the site text in `lib/sites-data.ts`), plus a few strings added in `lib/i18n.tsx`. The choice is saved in `localStorage` under `ada-lang`, the same key the prototypes use. As in the prototypes, course descriptions and some data values stay in English.
- Design tokens are in `app/tokens.css`. Buttons, tags, alerts, form fields, ratings and icons copy the design system, including its Lucide icon font (`app/fonts/lucide.woff2`).

## Photos

- `public/latest`: photos the client placed in the design. `public/sites`: underwater photos. `public/brand`: logos.
- Other photos still load from airdivealor.com and static.wixstatic.com.

## Still placeholder

These come from the prototypes and need confirming: home prices and package details, "4.9 / 180+ reviews", "2,000+ divers", the booking form (it shows "Enquiry sent" but sends nothing), and the dive-site notes marked as drafts.

---

# CMS (Home, Dive sites, Facilities and rates)

The Home, Dive sites and Facilities and rates pages, and every dive site guide, are managed in a CMS that lives in this app at `/cms`. It uses MySQL for content and users, MinIO for photos and videos, Redis with BullMQ for background media processing, and Brevo for emails.

## Run it locally

```bash
cp .env.example .env          # then set SEED_ADMIN_PASSWORD (and BREVO_API_KEY to send real emails)
docker compose up -d          # MySQL, Redis, MinIO
npm install
npm run db:migrate            # create tables
npm run cms:seed              # roles, first admin, page content, the 33 dive sites, import their photos
npm run dev                   # website + CMS on http://localhost:3000, sign in at /cms
npm run worker                # in a second terminal: processes uploads
```

In production, run `npm run build && npm start` for the app and `npm run worker` as a separate long-running process. The worker needs `ffmpeg` and `ffprobe` installed.

## How it fits together

| Piece | Where |
| --- | --- |
| Page and collection registry (drives the API, CMS menus and permissions) | `lib/cms/registry.ts` |
| Section and item definitions: fields, validation, editor form | `lib/cms/home-sections.ts`, `lib/cms/dive-sites-sections.ts`, `lib/cms/facilities-sections.ts`, `lib/cms/site-fields.ts`, `lib/cms/fields.ts` |
| Database schema and migrations (Drizzle ORM) | `lib/server/db/schema.ts`, `drizzle/` |
| Admin API (session cookie, permission-checked) | `app/api/cms/**` |
| Public API the website reads | `GET /api/public/pages/{home,dive-sites,facilities}`, `GET /api/public/sites/{slug}` |
| CMS screens | `app/cms/**`, `components/cms/**` |
| Media worker (sharp, ffmpeg) | `scripts/worker.ts` |

**Content workflow:** each page section has its own editor.
- **Home:** SEO, Hero, Awards, Prices, Why Alor, Dive sites (picks guides from the collection), Safety stop, Reviews, FAQ, Book.
- **Dive sites:** SEO, Site guide texts (shared labels and notes on every guide page), Hero, Highlights, Site list (title, page size, filter buttons, note), Call to action.
- **Facilities and rates:** SEO, Hero, Rates at a glance, Stay, Diving, Boats, Gear and equipment, Diving rates, Call to action. In Diving rates, each package has a price table (days, nights, dives, price) or, when the table is empty, price cards (for pay per dive), plus its included and not-included lists. Tapping a table row opens WhatsApp with a message built from the row.
- **Saving** stores a draft.
- **Publishing** copies the draft to the live version and clears the page cache straight away.
- **Preview drafts** (`/cms/preview/home`, `/cms/preview/dive-sites`, `/cms/preview/facilities`) shows unpublished changes.
- **Order and visibility:** sections can be reordered and hidden. These changes apply to the live page as soon as they're saved.
- **Languages:** every text field has English and Indonesian. When the Indonesian is empty, visitors see the English.

**Dive site guides (a collection):** the 33 sites live under *Content › Dive site guides* (`/cms/collections/sites`). Each guide is one item with its own draft and live version.
- **New / edit:** name, web address (`/dive-sites/<web-address>`), conditions, photos and gallery, dive types, marine life, access and safety, tips, photo credit.
- **Publish / unpublish:** a new or unpublished guide isn't on the website. Preview it at `/cms/preview/sites/<id>`.
- **Hide / show:** a hidden guide disappears from the list and its page returns 404, without losing the published version.
- **Order:** move guides up or down and save; this is the order on the Dive sites page and the guide's previous/next links.
- **Delete** is refused while a page still uses the guide (for example the Home "Dive sites" section).
- **Filters** on the Dive sites page match words against each guide's English dive types (e.g. `wall` or `muck, macro`).

**Website connection:** `app/page.tsx`, `app/dive-sites/page.tsx`, `app/dive-sites/[slug]/page.tsx` and `app/facilities-and-rates/page.tsx` fetch the public API. Responses are cached for 5 minutes and refreshed the moment someone publishes. If the CMS can't be reached, the pages fall back to the built-in content in `lib/cms/home-defaults.ts`, `lib/cms/dive-sites-defaults.ts` and `lib/cms/facilities-defaults.ts`. Set `CMS_API_URL` if the API runs somewhere else.

**Uploads (asynchronous):**
1. The browser registers the file and gets a presigned URL.
2. It uploads straight to MinIO (`originals/`, private).
3. It calls `/complete`, which queues a BullMQ job.
4. The worker writes WebP images at 480 / 960 / 1600 / 2400 px, or for videos an H.264 MP4 plus a poster, to `media/` (public).
5. Jobs retry 3 times with backoff. Failed files can be retried from the library.

Limits are 25 MB per image and 300 MB per video. Browsers upload directly, so the MinIO address must be reachable from the browser (set `S3_UPLOAD_ENDPOINT` if the server uses an internal hostname), and MinIO must allow your site's origin for CORS (`MINIO_API_CORS_ALLOW_ORIGIN`).

## Users and permissions (RBAC)

- **Users** are invited by email and set their own password from the invitation link (valid 7 days).
- **Forgot password** emails a one-time link valid for 1 hour, sent through Brevo. Without `BREVO_API_KEY`, emails are printed to the server log instead.
- **Roles** are sets of permissions, and a user gets every permission from all their roles. Permissions:
  - per page (Home, Dive sites, Facilities and rates): view, one edit permission per section, publish, change layout
  - per collection (Dive site guides): view, add/edit drafts, publish/hide/unpublish/reorder, delete
  - Media: view, upload, delete
  - Users: view, manage
  - Roles: manage
  - Activity log: view
- **Built-in roles:**
  - **Super admin**: every permission. It can't be changed, and the last Super admin can't be removed.
  - **Editor**: edit and publish all pages and dive site guides, upload media.
  - **Contributor**: edit drafts and upload media; can't publish.
  - **Viewer**: read only.
- **Security:**
  - Passwords are hashed with bcrypt.
  - Sessions are random tokens stored hashed, in an httpOnly cookie that lasts 7 days.
  - Sign-in and reset are rate-limited in Redis.
  - Every write checks the request's Origin.
  - All changes are recorded in the activity log.
