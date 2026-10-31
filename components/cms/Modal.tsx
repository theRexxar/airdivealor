"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "@/components/ui";

export function Modal({ title, onClose, children, footer, small }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; small?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="cms-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={small ? "cms-modal__panel cms-modal__panel--sm" : "cms-modal__panel"}>
        <div className="cms-modal__head">
          <span className="cms-modal__title">{title}</span>
          <button type="button" className="cms-iconbtn" aria-label="Close" onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="cms-modal__body">{children}</div>
        {footer && <div className="cms-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
