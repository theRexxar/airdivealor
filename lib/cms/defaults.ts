/** Built-in content per page: what the seed starts with and what the website shows if the CMS is unreachable. */
import { DIVE_SITES_DEFAULTS, SITES_DEFAULTS } from "./dive-sites-defaults";
import { FACILITIES_DEFAULTS } from "./facilities-defaults";
import { HOME_DEFAULTS } from "./home-defaults";

export const PAGE_DEFAULTS: Record<string, Record<string, unknown>> = {
  home: HOME_DEFAULTS as unknown as Record<string, unknown>,
  "dive-sites": DIVE_SITES_DEFAULTS as unknown as Record<string, unknown>,
  facilities: FACILITIES_DEFAULTS as unknown as Record<string, unknown>,
};

export const COLLECTION_DEFAULTS: Record<string, { slug: string }[]> = { sites: SITES_DEFAULTS };
