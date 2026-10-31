# Air Dive Alor website (Next.js)

Built from the Claude Design prototypes `Blog.dc.html` and `BlogPost.dc.html` (Airdivealor website mockups).

```bash
npm install
npm run dev     # http://localhost:3000/blog
npm run build
```

- `/blog`: the list of stories. The newest story is the hero, with category filters and 9 stories per page. Paging is hidden when there are 9 stories or fewer.
- `/blog/[slug]`: one story. A page is prerendered for every post in `lib/blog-data.ts`.
- EN / ID switch: UI strings are in `lib/i18n.tsx`, story text is in the `*Id` fields of `lib/blog-data.ts`. The choice is saved in `localStorage` under `ada-lang`, the same key the prototypes use.
- Design tokens are in `app/tokens.css`. Button and icon styles copy the design system's, including its Lucide icon font (`app/fonts/lucide.woff2`).
- Story photos still load from airdivealor.com.
- The header and footer link to `/`, `/dive-sites`, `/facilities-and-rates`, `/dive-courses` and `/about-us`, which aren't built yet.
