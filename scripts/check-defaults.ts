/** Check that the built-in default content passes the CMS validation (npm run cms:check). */
import { DIVE_SITES_DEFAULTS, SITES_DEFAULTS } from "../lib/cms/dive-sites-defaults";
import { DIVE_SITES_SCHEMAS } from "../lib/cms/dive-sites-sections";
import { FACILITIES_DEFAULTS } from "../lib/cms/facilities-defaults";
import { FACILITIES_SCHEMAS } from "../lib/cms/facilities-sections";
import { HOME_DEFAULTS } from "../lib/cms/home-defaults";
import { HOME_SCHEMAS } from "../lib/cms/home-sections";
import { SITE_SCHEMA } from "../lib/cms/site-fields";

let ok = true;
const check = (label: string, schema: { safeParse: (v: unknown) => { success: boolean; error?: { issues: unknown[] } } }, value: unknown) => {
  const r = schema.safeParse(value);
  if (!r.success) {
    ok = false;
    console.log(label, JSON.stringify(r.error!.issues.slice(0, 3)));
  }
};
for (const [k, s] of Object.entries(HOME_SCHEMAS)) check(`home.${k}`, s, (HOME_DEFAULTS as unknown as Record<string, unknown>)[k]);
for (const [k, s] of Object.entries(DIVE_SITES_SCHEMAS)) check(`dive-sites.${k}`, s, (DIVE_SITES_DEFAULTS as unknown as Record<string, unknown>)[k]);
for (const [k, s] of Object.entries(FACILITIES_SCHEMAS)) check(`facilities.${k}`, s, (FACILITIES_DEFAULTS as unknown as Record<string, unknown>)[k]);
SITES_DEFAULTS.forEach((x) => check(`site ${x.slug}`, SITE_SCHEMA, x));
console.log(ok ? "all defaults valid" : "invalid defaults");
process.exit(ok ? 0 : 1);
