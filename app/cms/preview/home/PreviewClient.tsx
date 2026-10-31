"use client";

import { useEffect, useState } from "react";
import type { PublishedHome } from "@/lib/cms/home-types";
import { HomeView } from "../../../_home/HomeView";

/** Loads the draft content from the CMS API and shows it with a preview banner. */
export function PreviewClient() {
  const [data, setData] = useState<PublishedHome | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/cms/pages/home/preview", { credentials: "same-origin" })
      .then(async (r) => (r.ok ? setData(await r.json()) : setError((await r.json()).error ?? "Could not load the preview.")))
      .catch(() => setError("Could not load the preview."));
  }, []);
  useEffect(() => {
    if (!data || !location.hash) return;
    const id = { prices: "b-prices", why: "b-why", sites: "b-sites", stay: "b-stay", reviews: "b-reviews", faq: "b-faq", book: "b-book" }[location.hash.slice(1)];
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 2000);
  }, [data]);
  return (
    <>
      <div style={{ position: "fixed", left: "50%", bottom: 16, transform: "translateX(-50%)", zIndex: 900, background: "#ffbe18", color: "#202020", padding: "10px 16px", borderRadius: 999, font: "600 13px/1 Inter, sans-serif", boxShadow: "0 10px 15px #0003" }}>
        Preview: unpublished drafts · <a href="/cms/pages/home" style={{ color: "#202020" }}>Back to the CMS</a>
      </div>
      {error ? <p style={{ padding: 40 }}>{error}</p> : data ? <HomeView data={data} /> : <p style={{ padding: 40 }}>Loading preview…</p>}
    </>
  );
}
