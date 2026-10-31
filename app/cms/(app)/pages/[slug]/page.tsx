"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCmsUser } from "@/components/cms/CmsUser";
import { PageHead } from "@/components/cms/Shell";
import { useToast } from "@/components/cms/Toast";
import { Button, ButtonLink, Icon } from "@/components/ui";
import { api, ApiError, fmtDate } from "@/lib/cms/client";
import { Forbidden } from "../../Forbidden";

interface Row {
  key: string;
  label: string;
  description: string;
  depth: number | null;
  fixed: boolean;
  enabled: boolean;
  hasChanges: boolean;
  draftUpdatedAt: string | null;
  draftUpdatedBy: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  canEdit: boolean;
}

export default function PageSectionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { can } = useCmsUser();
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [perm, setPerm] = useState({ canPublish: false, canLayout: false });
  const [page, setPage] = useState<{ label: string; href: string } | null>(null);
  const [layoutDirty, setLayoutDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api<{ page: { label: string; href: string }; sections: Row[]; canPublish: boolean; canLayout: boolean }>(`/api/cms/pages/${slug}`);
      setPage(r.page);
      setRows(r.sections);
      setPerm({ canPublish: r.canPublish, canLayout: r.canLayout });
      setLayoutDirty(false);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Could not load the page.", true);
    }
  }, [slug, toast]);
  useEffect(() => void load(), [load]);

  if (!can(`${slug}.view`)) return <Forbidden />;
  if (!rows || !page) return <div className="cms-card"><div className="cms-empty">Loading…</div></div>;

  const fixed = rows.filter((r) => r.fixed);
  const movable = rows.filter((r) => !r.fixed);
  const changed = rows.filter((r) => r.hasChanges);

  const move = (i: number, d: -1 | 1) => {
    const m = [...movable];
    [m[i], m[i + d]] = [m[i + d], m[i]];
    setRows([...fixed, ...m]);
    setLayoutDirty(true);
  };
  const toggle = (key: string) => {
    setRows(rows.map((r) => (r.key === key ? { ...r, enabled: !r.enabled } : r)));
    setLayoutDirty(true);
  };
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
  const saveLayout = () =>
    run(async () => {
      await api(`/api/cms/pages/${slug}/layout`, { method: "PUT", body: { sections: movable.map((r) => ({ key: r.key, enabled: r.enabled })) } });
      toast("Section order and visibility saved. The live page is updated.");
      await load();
    });
  const publishAll = () =>
    run(async () => {
      const r = await api<{ published: string[] }>(`/api/cms/pages/${slug}/publish`, { body: {} });
      toast(`Published ${r.published.length} section${r.published.length === 1 ? "" : "s"}.`);
      await load();
    });

  const renderRow = (r: Row, i?: number) => (
    <div key={r.key} className="cms-section">
      <div className="cms-section__order">
        {i != null && perm.canLayout ? (
          <>
            <button type="button" className="cms-iconbtn" aria-label={`Move ${r.label} up`} disabled={i === 0} onClick={() => move(i, -1)}>
              <Icon name="chevron-up" size={16} />
            </button>
            <button type="button" className="cms-iconbtn" aria-label={`Move ${r.label} down`} disabled={i === movable.length - 1} onClick={() => move(i, 1)}>
              <Icon name="chevron-down" size={16} />
            </button>
          </>
        ) : (
          <span style={{ width: 30, display: "grid", placeItems: "center", color: "var(--text-secondary)" }}>
            <Icon name={r.fixed ? "search" : "grip-vertical"} size={16} />
          </span>
        )}
      </div>
      <div className="cms-section__info">
        <div className="cms-section__name">
          <Link href={`/cms/pages/${slug}/${r.key}`}>{r.label}</Link>
          {r.depth != null && <span className="cms-section__depth">{r.depth} m</span>}
          {!r.enabled && <span className="cms-pill cms-pill--off">Hidden</span>}
          {r.hasChanges ? <span className="cms-pill cms-pill--draft">Unpublished changes</span> : <span className="cms-pill cms-pill--live">Live</span>}
        </div>
        <div className="cms-section__meta">{r.description}</div>
        <div className="cms-section__meta">
          {r.hasChanges && r.draftUpdatedAt ? `Edited ${fmtDate(r.draftUpdatedAt)}${r.draftUpdatedBy ? ` by ${r.draftUpdatedBy}` : ""} · ` : ""}
          Published {fmtDate(r.publishedAt)}
          {r.publishedBy ? ` by ${r.publishedBy}` : ""}
        </div>
      </div>
      <div className="cms-section__right">
        {!r.fixed && perm.canLayout && (
          <label className="cms-switch">
            <input type="checkbox" checked={r.enabled} onChange={() => toggle(r.key)} aria-label={`Show ${r.label}`} />
            Show
          </label>
        )}
        <ButtonLink href={`/cms/pages/${slug}/${r.key}`} variant="secondary" size="small" icon={r.canEdit ? "pencil" : "eye"}>
          {r.canEdit ? "Edit" : "View"}
        </ButtonLink>
      </div>
    </div>
  );

  return (
    <>
      <PageHead
        crumbs={[{ label: "Pages" }, { label: page.label }]}
        title={`${page.label} page`}
        sub="Each section is edited on its own. Saving keeps your changes as a draft; publishing puts them on the live site."
        actions={
          <>
            <ButtonLink href={`/cms/preview/${slug}`} external variant="secondary" icon="eye">
              Preview drafts
            </ButtonLink>
            <ButtonLink href={page.href} external variant="secondary" icon="external-link">
              Live page
            </ButtonLink>
            {perm.canPublish && (
              <Button variant="primary" icon="send" disabled={busy || !changed.length} onClick={publishAll}>
                {changed.length ? `Publish ${changed.length} change${changed.length === 1 ? "" : "s"}` : "Nothing to publish"}
              </Button>
            )}
          </>
        }
      />
      {layoutDirty && (
        <div className="cms-banner" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <span>You changed the order or visibility. These apply to the live page as soon as you save them.</span>
          <span className="cms-actions">
            <Button variant="secondary" size="small" onClick={load} disabled={busy}>
              Cancel
            </Button>
            <Button variant="primary" size="small" onClick={saveLayout} disabled={busy}>
              Save order and visibility
            </Button>
          </span>
        </div>
      )}
      <div className="cms-card">
        <div className="cms-card__head">
          <span className="cms-card__title">Page settings</span>
        </div>
        <div className="cms-sections">{fixed.map((r) => renderRow(r))}</div>
      </div>
      <div className="cms-card">
        <div className="cms-card__head">
          <span className="cms-card__title">Sections, top to bottom</span>
          <span className="cms-muted">{movable.filter((r) => r.enabled).length} of {movable.length} shown</span>
        </div>
        <div className="cms-sections">{movable.map((r, i) => renderRow(r, i))}</div>
      </div>
    </>
  );
}
