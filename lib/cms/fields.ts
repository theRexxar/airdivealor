/**
 * Field definitions for CMS sections. One definition drives three things:
 * validation (zod, on the server), the editor form (in /cms), and default values.
 * Shared by server and client, so keep it free of server-only imports.
 */
import { z } from "zod";

/** Text in both site languages. */
export interface I18n {
  en: string;
  id: string;
}

/** A picture or video: a file from the media library, or an external URL. */
export interface MediaRef {
  mediaId: number | null;
  url: string;
}

interface Base {
  key: string;
  label: string;
  help?: string;
}

export type Field =
  | (Base & { type: "text" | "url"; required?: boolean; max?: number; placeholder?: string })
  | (Base & { type: "textarea"; required?: boolean; max?: number })
  | (Base & { type: "i18n"; required?: boolean; multiline?: boolean; max?: number })
  | (Base & { type: "number"; min?: number; max?: number; step?: number; required?: boolean })
  | (Base & { type: "boolean" })
  | (Base & { type: "select"; options: { value: string; label: string }[]; required?: boolean })
  | (Base & { type: "media"; accept: "image" | "video" })
  /** Pick an item from a CMS collection (stores its slug), e.g. a dive site. */
  | (Base & { type: "ref"; collection: string; required?: boolean })
  | (Base & { type: "group"; fields: Field[] })
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; min?: number; max?: number; titleKey?: string });

const i18nSchema = (f: { required?: boolean; max?: number }) => {
  const s = z.string().trim().max(f.max ?? 2000);
  const en = f.required ? s.min(1, "English text is required") : s;
  return z.object({ en, id: s });
};

/** Build the zod schema for a list of fields. */
export function schemaFor(fields: Field[]): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) shape[f.key] = fieldSchema(f);
  return z.object(shape).strict();
}

function fieldSchema(f: Field): z.ZodTypeAny {
  switch (f.type) {
    case "text":
    case "textarea": {
      const s = z.string().trim().max(f.max ?? 2000);
      return f.required ? s.min(1, `${f.label} is required`) : s;
    }
    case "url":
      return z.union([z.literal(""), z.string().trim().max(500).refine((v) => /^(https?:\/\/|\/|#|mailto:)/.test(v), "Use a full URL, a path starting with /, or #anchor")]);
    case "i18n":
      return i18nSchema(f);
    case "number": {
      let s = z.number({ message: `${f.label} must be a number` });
      if (f.min != null) s = s.min(f.min);
      if (f.max != null) s = s.max(f.max);
      return s;
    }
    case "boolean":
      return z.boolean();
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]]);
    case "media":
      return z.object({
        mediaId: z.number().int().positive().nullable(),
        url: z.union([z.literal(""), z.string().trim().max(1000).refine((v) => /^(https?:\/\/|\/)/.test(v), "Use a full URL or a path starting with /")]),
      });
    case "ref": {
      const s = z.string().trim().max(120);
      return f.required ? s.min(1, `Choose a ${f.label.toLowerCase()}`) : s;
    }
    case "group":
      return schemaFor(f.fields);
    case "list": {
      let s = z.array(schemaFor(f.fields));
      if (f.min != null) s = s.min(f.min, `Add at least ${f.min} ${f.itemLabel.toLowerCase()}`);
      if (f.max != null) s = s.max(f.max, `Add at most ${f.max} ${f.itemLabel.toLowerCase()}`);
      return s;
    }
  }
}

/** An empty value for a field (used when adding list items). */
export function emptyValue(f: Field): unknown {
  switch (f.type) {
    case "text":
    case "textarea":
    case "url":
    case "ref":
      return "";
    case "i18n":
      return { en: "", id: "" };
    case "number":
      return f.min ?? 0;
    case "boolean":
      return false;
    case "select":
      return f.options[0]?.value ?? "";
    case "media":
      return { mediaId: null, url: "" };
    case "group":
      return emptyObject(f.fields);
    case "list":
      return [];
  }
}

export function emptyObject(fields: Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((f) => [f.key, emptyValue(f)]));
}

/** Collect every media id referenced by a value, so the public API can resolve them in one query. */
export function collectMediaIds(fields: Field[], value: unknown, out = new Set<number>()): Set<number> {
  const v = (value ?? {}) as Record<string, unknown>;
  for (const f of fields) {
    const x = v[f.key];
    if (f.type === "media") {
      const id = (x as MediaRef | undefined)?.mediaId;
      if (id) out.add(id);
    } else if (f.type === "group") collectMediaIds(f.fields, x, out);
    else if (f.type === "list" && Array.isArray(x)) x.forEach((item) => collectMediaIds(f.fields, item, out));
  }
  return out;
}

/** Shorthand builders used by the section definitions. */
export const F = {
  text: (key: string, label: string, o: { required?: boolean; max?: number; placeholder?: string; help?: string } = {}): Field => ({ type: "text", key, label, ...o }),
  url: (key: string, label: string, help?: string): Field => ({ type: "url", key, label, help }),
  i18n: (key: string, label: string, o: { required?: boolean; multiline?: boolean; help?: string; max?: number } = {}): Field => ({ type: "i18n", key, label, ...o }),
  number: (key: string, label: string, o: { min?: number; max?: number; step?: number; help?: string } = {}): Field => ({ type: "number", key, label, ...o }),
  bool: (key: string, label: string, help?: string): Field => ({ type: "boolean", key, label, help }),
  select: (key: string, label: string, options: { value: string; label: string }[], help?: string): Field => ({ type: "select", key, label, options, help }),
  image: (key: string, label: string, help?: string): Field => ({ type: "media", key, label, accept: "image", help }),
  video: (key: string, label: string, help?: string): Field => ({ type: "media", key, label, accept: "video", help }),
  ref: (key: string, label: string, collection: string, o: { required?: boolean; help?: string } = {}): Field => ({ type: "ref", key, label, collection, ...o }),
  group: (key: string, label: string, fields: Field[], help?: string): Field => ({ type: "group", key, label, fields, help }),
  list: (key: string, label: string, itemLabel: string, fields: Field[], o: { min?: number; max?: number; titleKey?: string; help?: string } = {}): Field => ({
    type: "list",
    key,
    label,
    itemLabel,
    fields,
    ...o,
  }),
};
