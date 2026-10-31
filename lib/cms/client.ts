"use client";

/** Fetch helper for the CMS screens: JSON in and out, errors become ApiError with field details. */
export class ApiError extends Error {
  constructor(public status: number, message: string, public details: { path: (string | number)[]; message: string }[] = []) {
    super(message);
  }
  /** Field error for a path like ["content", "title", "en"], matched by prefix. */
  fieldError(path: (string | number)[]): string | undefined {
    const p = path.join(".");
    return this.details.find((d) => d.path.join(".") === p)?.message;
  }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(path, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.startsWith("/api/cms/auth/")) {
    window.location.href = `/cms/login?next=${encodeURIComponent(location.pathname)}`;
  }
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Request failed (${res.status})`, data.details ?? []);
  return data as T;
}

export const fmtDate = (d: string | Date | null | undefined) =>
  d ? new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
