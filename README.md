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
