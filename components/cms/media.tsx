"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Select } from "@/components/ui";
import { api, ApiError, fmtDate } from "@/lib/cms/client";
import { humanSize, IMAGE_TYPES, kindFor, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_TYPES } from "@/lib/cms/media-rules";
import type { MediaItem } from "@/lib/server/media-service";
import { useCmsUser } from "./CmsUser";
import { Modal } from "./Modal";
import { useToast } from "./Toast";

export type { MediaItem };

type Upload = { key: string; name: string; progress: number; state: "uploading" | "processing" | "ready" | "failed"; error?: string; id?: number };

/** PUT the file to the presigned MinIO URL with progress (fetch has no upload progress). */
function putWithProgress(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("PUT", url);
    x.setRequestHeader("Content-Type", file.type);
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error(`Storage answered ${x.status}`)));
    x.onerror = () => reject(new Error("Network error while uploading. Check the storage CORS settings."));
    x.send(file);
  });
}

/**
 * Upload flow: register → PUT to storage → complete (queues processing) → poll until ready or failed.
 * onReady is called with each finished media item.
 */
export function useUploader(onReady: (m: MediaItem) => void) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const patch = (key: string, p: Partial<Upload>) => setUploads((u) => u.map((x) => (x.key === key ? { ...x, ...p } : x)));

  const poll = useCallback(
    async (key: string, id: number) => {
      for (let i = 0; i < 600; i++) {
        await new Promise((r) => setTimeout(r, i < 10 ? 1000 : 2500));
        try {
          const m = await api<MediaItem>(`/api/cms/media/${id}`);
          if (m.status === "ready") {
            patch(key, { state: "ready", progress: 1 });
            onReady(m);
            setTimeout(() => setUploads((u) => u.filter((x) => x.key !== key)), 2500);
            return;
          }
          if (m.status === "failed") return patch(key, { state: "failed", error: m.error ?? "Processing failed." });
        } catch {
          /* keep polling */
        }
      }
    },
    [onReady],
  );

  const start = useCallback(
    async (files: FileList | File[]) => {
      for (const file of Array.from(files)) {
        const key = `${file.name}-${Date.now()}-${Math.random()}`;
        setUploads((u) => [...u, { key, name: file.name, progress: 0, state: "uploading" }]);
        try {
          const kind = kindFor(file.type);
          if (!kind) throw new Error("Unsupported file type.");
          if (file.size > (kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES)) throw new Error(`Too large (limit ${humanSize(kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES)}).`);
          const r = await api<{ id: number; uploadUrl: string }>("/api/cms/media", { body: { name: file.name, mime: file.type, size: file.size } });
          await putWithProgress(r.uploadUrl, file, (p) => patch(key, { progress: p }));
          await api(`/api/cms/media/${r.id}/complete`, { method: "POST" });
          patch(key, { state: "processing", id: r.id, progress: 1 });
          void poll(key, r.id);
        } catch (e) {
          patch(key, { state: "failed", error: e instanceof Error ? e.message : "Upload failed." });
        }
      }
    },
    [poll],
  );

  return { uploads, start, dismiss: (key: string) => setUploads((u) => u.filter((x) => x.key !== key)) };
}

export function StatusPill({ status }: { status: MediaItem["status"] | Upload["state"] }) {
  const map = { ready: ["cms-pill--live", "Ready"], processing: ["cms-pill--busy", "Processing"], uploading: ["cms-pill--busy", "Uploading"], failed: ["cms-pill--error", "Failed"] } as const;
  const [cls, label] = map[status];
  return <span className={`cms-pill ${cls}`}>{label}</span>;
}

export function DropZone({ accept, onFiles, disabled }: { accept?: "image" | "video"; onFiles: (f: FileList) => void; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const types = accept === "image" ? IMAGE_TYPES : accept === "video" ? VIDEO_TYPES : [...IMAGE_TYPES, ...VIDEO_TYPES];
  return (
    <div
      className="cms-drop"
      data-over={over || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (!disabled && e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
    >
      <Icon name="cloud-upload" size={22} />
      <span>
        Drop {accept ?? "photos or videos"} here, or{" "}
        <Button variant="secondary" size="small" disabled={disabled} onClick={() => ref.current?.click()}>
          choose files
        </Button>
      </span>
      <span className="cms-muted" style={{ width: "100%" }}>
        Images up to {humanSize(MAX_IMAGE_BYTES)} (JPG, PNG, WebP, AVIF, GIF) · Videos up to {humanSize(MAX_VIDEO_BYTES)} (MP4, MOV, WebM). Files are processed in the background.
      </span>
      <input
        ref={ref}
        type="file"
        multiple
        hidden
        accept={types.join(",")}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function UploadList({ uploads, onDismiss }: { uploads: Upload[]; onDismiss: (key: string) => void }) {
  if (!uploads.length) return null;
  return (
    <div className="cms-uploads">
      {uploads.map((u) => (
        <div key={u.key} className="cms-upload">
          <span className="cms-strong" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {u.name}
            {u.error && <span className="cms-field__error"> · {u.error}</span>}
          </span>
          <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <StatusPill status={u.state} />
            {u.state === "failed" && (
              <button type="button" className="cms-iconbtn" aria-label="Dismiss" onClick={() => onDismiss(u.key)}>
                <Icon name="x" size={16} />
              </button>
            )}
          </span>
          {u.state === "uploading" && (
            <div className="cms-progress" aria-label={`${Math.round(u.progress * 100)}% uploaded`}>
              <span style={{ width: `${Math.round(u.progress * 100)}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Thumbnail tile for the library grid. */
export function MediaTile({ m, selected, onClick }: { m: MediaItem; selected?: boolean; onClick: () => void }) {
  return (
    <button type="button" className="cms-tile" data-selected={selected || undefined} onClick={onClick} aria-label={`${m.name}, ${m.kind}, ${m.status}`}>
      <span className="cms-tile__img">
        {m.thumbUrl ? <img src={m.thumbUrl} alt="" loading="lazy" /> : <Icon name={m.kind === "video" ? "video" : "image"} size={28} />}
        {m.kind === "video" && m.thumbUrl && (
          <span style={{ position: "absolute", right: 6, bottom: 6, color: "#fff", filter: "drop-shadow(0 1px 2px #0008)" }}>
            <Icon name="circle-play" size={22} />
          </span>
        )}
        {m.status !== "ready" && (
          <span className="cms-tile__badge">
            <StatusPill status={m.status} />
          </span>
        )}
      </span>
      <span className="cms-tile__name">{m.name}</span>
      <span className="cms-tile__meta">
        {m.width ? `${m.width}×${m.height} · ` : ""}
        {humanSize(m.size)}
        {m.durationSec ? ` · ${m.durationSec}s` : ""}
      </span>
    </button>
  );
}

/** Library grid with search, type filter, uploads and paging. */
export function MediaLibrary({ accept, selectedId, onPick }: { accept?: "image" | "video"; selectedId?: number | null; onPick: (m: MediaItem) => void }) {
  const { can } = useCmsUser();
  const toast = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [next, setNext] = useState<number | null>(null);
  const [kind, setKind] = useState<string>(accept ?? "");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (before?: number) => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (kind) p.set("kind", kind);
        if (q) p.set("q", q);
        if (before) p.set("before", String(before));
        const r = await api<{ items: MediaItem[]; next: number | null }>(`/api/cms/media?${p}`);
        setItems((cur) => (before ? [...cur, ...r.items] : r.items));
        setNext(r.next);
      } catch (e) {
        toast(e instanceof ApiError ? e.message : "Could not load media.", true);
      } finally {
        setLoading(false);
      }
    },
    [kind, q, toast],
  );

  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  const onReady = useCallback((m: MediaItem) => setItems((cur) => [m, ...cur.filter((x) => x.id !== m.id)]), []);
  const { uploads, start, dismiss } = useUploader(onReady);

  return (
    <div className="cms-fields">
      {can("media.upload") && <DropZone accept={accept} onFiles={start} />}
      <UploadList uploads={uploads} onDismiss={dismiss} />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: "1 1 240px" }}>
          <Input id="media-q" label="Search" placeholder="File name or alt text" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {!accept && (
          <div style={{ flex: "0 1 180px" }}>
            <Select id="media-kind" label="Type" value={kind} onChange={(e) => setKind(e.target.value)} options={[{ value: "", label: "All" }, { value: "image", label: "Images" }, { value: "video", label: "Videos" }]} />
          </div>
        )}
      </div>
      {items.length === 0 && !loading ? (
        <div className="cms-empty">No files yet.</div>
      ) : (
        <div className="cms-library">
          {items.map((m) => (
            <MediaTile key={m.id} m={m} selected={m.id === selectedId} onClick={() => onPick(m)} />
          ))}
        </div>
      )}
      {next && (
        <div>
          <Button variant="secondary" onClick={() => load(next)} disabled={loading}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

/** Modal to choose a file for a field (only ready files can be picked). */
export function MediaPicker({ accept, selectedId, onClose, onChoose }: { accept: "image" | "video"; selectedId: number | null; onClose: () => void; onChoose: (m: MediaItem) => void }) {
  const toast = useToast();
  return (
    <Modal title={accept === "image" ? "Choose an image" : "Choose a video"} onClose={onClose}>
      <MediaLibrary
        accept={accept}
        selectedId={selectedId}
        onPick={(m) => {
          if (m.status !== "ready") return toast(m.status === "failed" ? "This file failed to process." : "This file is still processing.", true);
          onChoose(m);
        }}
      />
    </Modal>
  );
}

/** Details modal in the library: preview, alt text, sizes, retry and delete. */
export function MediaDetails({ m, onClose, onChanged, onDeleted }: { m: MediaItem; onClose: () => void; onChanged: (m: MediaItem) => void; onDeleted: (id: number) => void }) {
  const { can } = useCmsUser();
  const toast = useToast();
  const [alt, setAlt] = useState(m.alt);
  const [busy, setBusy] = useState(false);
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
  return (
    <Modal
      title={m.name}
      onClose={onClose}
      footer={
        <>
          {can("media.delete") && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() =>
                confirm("Delete this file? This can't be undone.") &&
                run(async () => {
                  await api(`/api/cms/media/${m.id}`, { method: "DELETE" });
                  toast("File deleted.");
                  onDeleted(m.id);
                })
              }
            >
              Delete
            </Button>
          )}
          {m.status === "failed" && can("media.upload") && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/api/cms/media/${m.id}/retry`, { method: "POST" });
                  toast("Queued for processing again.");
                  onChanged({ ...m, status: "processing", error: null });
                })
              }
            >
              Retry processing
            </Button>
          )}
          {can("media.upload") && (
            <Button
              variant="primary"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/api/cms/media/${m.id}`, { method: "PATCH", body: { alt } });
                  toast("Alt text saved.");
                  onChanged({ ...m, alt });
                })
              }
            >
              Save
            </Button>
          )}
        </>
      }
    >
      <div style={{ borderRadius: 8, overflow: "hidden", background: "var(--neutral-900)", display: "grid", placeItems: "center", maxHeight: 420 }}>
        {m.kind === "video" && m.url ? (
          <video src={m.url} poster={m.posterUrl ?? undefined} controls style={{ maxWidth: "100%", maxHeight: 420 }} />
        ) : m.url ? (
          <img src={m.url} alt={m.alt.en} style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain" }} />
        ) : (
          <div className="cms-empty" style={{ color: "#fff" }}>
            <StatusPill status={m.status} />
          </div>
        )}
      </div>
      {m.error && <div className="cms-banner">{m.error}</div>}
      <div className="cms-i18n">
        <Input id="alt-en" label="Alt text (English)" value={alt.en} onChange={(e) => setAlt({ ...alt, en: e.target.value })} disabled={!can("media.upload")} />
        <Input id="alt-id" label="Alt text (Indonesian)" value={alt.id} onChange={(e) => setAlt({ ...alt, id: e.target.value })} disabled={!can("media.upload")} />
      </div>
      <table className="cms-table">
        <tbody>
          <tr><td className="cms-muted">Type</td><td>{m.kind} · {m.mime}</td></tr>
          <tr><td className="cms-muted">Original</td><td>{m.width ? `${m.width} × ${m.height} px · ` : ""}{humanSize(m.size)}{m.durationSec ? ` · ${m.durationSec} s` : ""}</td></tr>
          <tr><td className="cms-muted">Processed files</td><td>{m.variants.length ? m.variants.map((v) => <div key={v.key}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.width}px {v.format}</a> <span className="cms-muted">{humanSize(v.size)}</span></div>) : "—"}</td></tr>
          <tr><td className="cms-muted">Uploaded</td><td>{fmtDate(m.createdAt)}</td></tr>
        </tbody>
      </table>
    </Modal>
  );
}
