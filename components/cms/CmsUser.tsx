"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface CmsUserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

const Ctx = createContext<CmsUserInfo | null>(null);

export function CmsUserProvider({ user, children }: { user: CmsUserInfo; children: ReactNode }) {
  return <Ctx.Provider value={user}>{children}</Ctx.Provider>;
}

/** The signed-in user and a permission check for showing or hiding controls (the API enforces them too). */
export function useCmsUser() {
  const u = useContext(Ctx)!;
  return { user: u, can: (p: string) => u.permissions.includes(p) };
}
