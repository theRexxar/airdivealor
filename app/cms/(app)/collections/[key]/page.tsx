"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCmsUser } from "@/components/cms/CmsUser";
import { PageHead } from "@/components/cms/Shell";
import { useToast } from "@/components/cms/Toast";
import { Button, ButtonLink, Icon, Input, Select } from "@/components/ui";
import { api, ApiError, fmtDate } from "@/lib/cms/client";
import { collectionDef } from "@/lib/cms/registry";
import { Forbidden } from "../../Forbidden";

interface Item {
  id: number;
  slug: string;
  title: string;
  thumb: string | null;
  status: "draft" | "live" | "changed" | "hidden";
  enabled: boolean;
  draftUpdatedAt: string | null;
  draftUpdatedBy: string | null;
  publishedAt: string | null;
}

const STATUS_PILL: Record<Item["status"], [string, string]> = {
  live: ["cms-pill--live", "Live"],
  changed: ["cms-pill--draft", "Unpublished changes"],
  draft: ["cms-pill--off", "Not published"],
  hidden: ["cms-pill--off", "Hidden"],
};

export default function CollectionPage() {
  const { key } = useParams<{ key: string }>();
  const def = collectionDef(key);
  const { can } = useCmsUser();
  const toast = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [perm, setPerm] = useState({ edit: false, publish: false, delete: false });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [orderDirty, setOrderDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api<{ items: Item[]; can: typeof perm }>(`/api/cms/collections/${key}`);
      setItems(r.items);
      setPerm(r.can);
      setOrderDirty(false);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Could not load the list.", true);
    }
  }, [key, toast]);
  useEffect(() => void load(), [load]);

  if (!def) return <div className="cms-card"><div className="cms-empty">Unknown collection.</div></div>;
  if (!can(`${key}.view`)) return <Forbidden />;
  if (!items) return <div className="cms-card"><div className="cms-empty">Loading…</div></div>;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Something went wrong.", true);
    } finally {
      setBusy(false);
    }
  };
  const filtering = !!q || !!status;
  const shown = items.filter((it) => (!status || it.status === status) && (!q || `${it.title} ${it.slug}`.toLowerCase().includes(q.toLowerCase())));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setItems(next);
    setOrderDirty(true);
  };
  const counts = { live: items.filter((i) => i.status === "live" || i.status === "changed").length, total: items.length };

  return (
    <>
      <PageHead
        crumbs={[{ label: "Content" }, { label: def.label }]}
        title={def.label}
        sub={def.description}
        actions={
          <>
            <ButtonLink href={def.listHref} external variant="secondary" icon="external-link">
              Live page
            </ButtonLink>
            {perm.edit && (
              <ButtonLink href={`/cms/collections/${key}/new`} variant="primary" icon="plus">
                New {def.itemLabel}
              </ButtonLink>
            )}
          </>
        }
      />
      {orderDirty && (
        <div className="cms-banner" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <span>You changed the order. It applies to the website as soon as you save it.</span>
          <span className="cms-actions">
            <Button variant="secondary" size="small" onClick={load} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/api/cms/collections/${key}/reorder`, { method: "PUT", body: { ids: items.map((i) => i.id) } });
                  toast("Order saved.");
                  await load();
                })
              }
            >
              Save order
            </Button>
          </span>
        </div>
      )}
      <div className="cms-card">
        <div className="cms-card__head">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end", flex: 1 }}>
            <div style={{ flex: "1 1 240px", maxWidth: 360 }}>
              <Input id="q" label="Search" placeholder="Name or web address" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div style={{ flex: "0 1 220px" }}>
              <Select
                id="status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={[{ value: "", label: "All" }, ...Object.entries(STATUS_PILL).map(([value, [, label]]) => ({ value, label }))]}
              />
            </div>
          </div>
          <span className="cms-muted">
            {counts.live} of {counts.total} on the website
          </span>
        </div>
        {filtering && perm.publish && !def.sortField && <div className="cms-muted" style={{ padding: "10px 20px 0" }}>Clear the search and status filter to reorder.</div>}
        <div className="cms-sections">
          {shown.map((it) => {
            const i = items.indexOf(it);
            const [cls, label] = STATUS_PILL[it.status];
            return (
              <div key={it.id} className="cms-section" style={{ gridTemplateColumns: "auto 72px minmax(0,1fr) auto" }}>
                <div className="cms-section__order">
                  {perm.publish && !filtering && !def.sortField ? (
                    <>
                      <button type="button" className="cms-iconbtn" aria-label={`Move ${it.title} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                        <Icon name="chevron-up" size={16} />
                      </button>
                      <button type="button" className="cms-iconbtn" aria-label={`Move ${it.title} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)}>
                        <Icon name="chevron-down" size={16} />
                      </button>
                    </>
                  ) : (
                    <span className="cms-section__depth" style={{ width: 30, textAlign: "center" }}>{i + 1}</span>
                  )}
                </div>
                <div className="cms-media-thumb" style={{ width: 72, aspectRatio: "4 / 3" }}>
                  {it.thumb ? <img src={it.thumb} alt="" loading="lazy" /> : <Icon name="image" size={20} />}
                </div>
                <div className="cms-section__info">
                  <div className="cms-section__name">
                    <Link href={`/cms/collections/${key}/${it.id}`}>{it.title}</Link>
                    <span className={`cms-pill ${cls}`}>{label}</span>
                  </div>
                  <div className="cms-section__meta">
                    {def.itemHref(it.slug)} · {it.publishedAt ? `Published ${fmtDate(it.publishedAt)}` : "Never published"}
                    {it.status === "changed" && it.draftUpdatedAt ? ` · Edited ${fmtDate(it.draftUpdatedAt)}${it.draftUpdatedBy ? ` by ${it.draftUpdatedBy}` : ""}` : ""}
                  </div>
                </div>
                <div className="cms-section__right">
                  {perm.publish && it.status !== "draft" && (
                    <label className="cms-switch">
                      <input
                        type="checkbox"
                        checked={it.enabled}
                        aria-label={`Show ${it.title} on the website`}
                        disabled={busy}
                        onChange={(e) =>
                          run(async () => {
                            await api(`/api/cms/collections/${key}/${it.id}/visibility`, { method: "PUT", body: { enabled: e.target.checked } });
                            toast(e.target.checked ? `${it.title} is shown again.` : `${it.title} is hidden from the website.`);
                            await load();
                          })
                        }
                      />
                      Show
                    </label>
                  )}
                  <ButtonLink href={`/cms/collections/${key}/${it.id}`} variant="secondary" size="small" icon={perm.edit ? "pencil" : "eye"}>
                    {perm.edit ? "Edit" : "View"}
                  </ButtonLink>
                </div>
              </div>
            );
          })}
          {!shown.length && <div className="cms-empty">Nothing matches.</div>}
        </div>
      </div>
    </>
  );
}
