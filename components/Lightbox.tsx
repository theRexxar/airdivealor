"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { Button } from "./ui";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

/** Full-screen photo viewer: close with X, Escape or a click on the backdrop; arrow keys move between photos. */
export function Lightbox({ photos, index, onChange }: { photos: LightboxPhoto[]; index: number | null; onChange: (i: number | null) => void }) {
  const { t } = useLang();
  const n = photos.length;

  useEffect(() => {
    if (index == null) return;
    const html = document.documentElement;
    html.style.overflow = document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % n);
      if (e.key === "ArrowLeft") onChange((index + n - 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, n, onChange]);

  if (index == null) return null;
  const p = photos[index];
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div role="dialog" aria-modal="true" aria-label={p.alt} data-theme="dark" className="lightbox" onClick={() => onChange(null)}>
      <div className="lightbox__top">
        <span className="lightbox__count">{index + 1} / {n}</span>
        <Button variant="secondary" icon="x" iconOnly aria-label={t("Close")} onClick={() => onChange(null)} />
      </div>
      <img className="lightbox__img" src={p.src} alt={p.alt} onClick={stop} />
      <div className="lightbox__nav" onClick={stop}>
        <Button variant="secondary" icon="chevron-left" iconOnly aria-label={t("Previous photo")} onClick={() => onChange((index + n - 1) % n)} />
        <Button variant="secondary" icon="chevron-right" iconOnly aria-label={t("Next photo")} onClick={() => onChange((index + 1) % n)} />
      </div>
    </div>
  );
}
