"use client";

import { useEffect, useState } from "react";
import type { PublishedDiveSites, PublishedSite } from "@/lib/cms/dive-sites-types";
import type { PublishedHome } from "@/lib/cms/home-types";
import { HomeView } from "../../_home/HomeView";
import { SiteGuideView } from "../../dive-sites/[slug]/SiteGuideView";
import { SitesView } from "../../dive-sites/SitesView";

/** Loads draft content from the CMS API and renders it with the website's own components, under a preview banner. */
export function PreviewClient({ kind, slug, anchors, back }: { kind: "page" | "site"; slug: string; anchors: Record<string, string>; back: string }) {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const url = kind === "page" ? `/api/cms/pages/${slug}/preview` : `/api/cms/collections/sites/${slug}/preview`;
    fetch(url, { credentials: "same-origin" })
      .then(async (r) => (r.ok ? setData(await r.json()) : setError((await r.json()).error ?? "Could not load the preview.")))
      .catch(() => setError("Could not load the preview."));
  }, [kind, slug]);
  useEffect(() => {
    if (!data || !location.hash) return;
    const id = anchors[location.hash.slice(1)];
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), slug === "home" ? 2000 : 300);
  }, [data, anchors, slug]);

  let view = null;
  if (data && kind === "site") view = <SiteGuideView data={data as PublishedSite} />;
  else if (data && slug === "home") view = <HomeView data={data as PublishedHome} />;
  else if (data && slug === "dive-sites") view = <SitesView data={data as PublishedDiveSites} />;

  return (
    <>
      <div style={{ position: "fixed", left: "50%", bottom: 16, transform: "translateX(-50%)", zIndex: 900, background: "#ffbe18", color: "#202020", padding: "10px 16px", borderRadius: 999, font: "600 13px/1 Inter, sans-serif", boxShadow: "0 10px 15px #0003", whiteSpace: "nowrap" }}>
        Preview: unpublished drafts · <a href={back} style={{ color: "#202020" }}>Back to the CMS</a>
      </div>
      {error ? <p style={{ padding: 40 }}>{error}</p> : view ?? <p style={{ padding: 40 }}>Loading preview…</p>}
    </>
  );
}
