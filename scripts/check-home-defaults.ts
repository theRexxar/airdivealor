import { HOME_DEFAULTS } from "../lib/cms/home-defaults";
import { HOME_SCHEMAS } from "../lib/cms/home-sections";

let ok = true;
for (const [key, schema] of Object.entries(HOME_SCHEMAS)) {
  const r = schema.safeParse((HOME_DEFAULTS as unknown as Record<string, unknown>)[key]);
  if (!r.success) { ok = false; console.log(key, JSON.stringify(r.error.issues.slice(0, 3))); }
}
console.log(ok ? "all sections valid" : "invalid");
process.exit(ok ? 0 : 1);
