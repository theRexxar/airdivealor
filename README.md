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

# CMS (Home page)

The Home page is managed in a CMS that lives in this app at `/cms`. It uses MySQL for content and users, MinIO for photos and videos, Redis with BullMQ for background media processing, and Brevo for emails.

## Run it locally

```bash
cp .env.example .env          # then set SEED_ADMIN_PASSWORD (and BREVO_API_KEY to send real emails)
docker compose up -d          # MySQL, Redis, MinIO
npm install
npm run db:migrate            # create tables
npm run cms:seed              # roles, first admin, Home content, import the Home photos
npm run dev                   # website + CMS on http://localhost:3000, sign in at /cms
npm run worker                # in a second terminal: processes uploads
```

In production, run `npm run build && npm start` for the app and `npm run worker` as a separate long-running process. The worker needs `ffmpeg` and `ffprobe` installed.

## How it fits together

| Piece | Where |
| --- | --- |
| Section definitions: fields, validation, editor form, permissions | `lib/cms/home-sections.ts`, `lib/cms/fields.ts` |
| Database schema and migrations (Drizzle ORM) | `lib/server/db/schema.ts`, `drizzle/` |
| Admin API (session cookie, permission-checked) | `app/api/cms/**` |
| Public API the website reads | `GET /api/public/pages/home` |
| CMS screens | `app/cms/**`, `components/cms/**` |
| Media worker (sharp, ffmpeg) | `scripts/worker.ts` |

**Content workflow:** each Home section (SEO, Hero, Awards, Prices, Why Alor, Dive sites, Safety stop, Reviews, FAQ, Book) has its own editor.
- **Saving** stores a draft.
- **Publishing** copies the draft to the live version and clears the page cache straight away.
- **Preview drafts** (`/cms/preview/home`) shows unpublished changes.
- **Order and visibility:** sections can be reordered and hidden. These changes apply to the live page as soon as they're saved.
- **Languages:** every text field has English and Indonesian. When the Indonesian is empty, visitors see the English.

**Home page connection:** `app/page.tsx` fetches `/api/public/pages/home`. The response is cached for 5 minutes and refreshed the moment someone publishes. If the CMS can't be reached, the page falls back to the built-in content in `lib/cms/home-defaults.ts`. Set `CMS_API_URL` if the API runs somewhere else.

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
  - one edit permission per Home section
  - Home: publish, change layout
  - Media: view, upload, delete
  - Users: view, manage
  - Roles: manage
  - Activity log: view
- **Built-in roles:**
  - **Super admin**: every permission. It can't be changed, and the last Super admin can't be removed.
  - **Editor**: edit and publish the Home page, upload media.
  - **Contributor**: edit drafts and upload media; can't publish.
  - **Viewer**: read only.
- **Security:**
  - Passwords are hashed with bcrypt.
  - Sessions are random tokens stored hashed, in an httpOnly cookie that lasts 7 days.
  - Sign-in and reset are rate-limited in Redis.
  - Every write checks the request's Origin.
  - All changes are recorded in the activity log.
