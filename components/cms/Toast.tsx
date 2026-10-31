"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Toast = { id: number; text: string; error?: boolean };
const Ctx = createContext<(text: string, error?: boolean) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, error?: boolean) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, error }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), error ? 7000 : 3500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="cms-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={t.error ? "cms-toast cms-toast--error" : "cms-toast"}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

/** toast("Saved") or toast("Failed", true) */
export const useToast = () => useContext(Ctx);
