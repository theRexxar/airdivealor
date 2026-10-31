import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { CmsUserProvider } from "@/components/cms/CmsUser";
import { Shell } from "@/components/cms/Shell";
import { ToastProvider } from "@/components/cms/Toast";
import { currentUser } from "@/lib/server/auth";
import "../cms.css";

export const metadata: Metadata = { title: "Air Dive Alor CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Every CMS screen requires a signed-in, active user. */
export default async function CmsLayout({ children }: { children: ReactNode }) {
  const u = await currentUser();
  if (!u) redirect("/cms/login");
  return (
    <div className="cms">
      <CmsUserProvider user={{ id: u.id, name: u.name, email: u.email, roles: u.roles.map((r) => r.name), permissions: [...u.permissions] }}>
        <ToastProvider>
          <Shell>{children}</Shell>
        </ToastProvider>
      </CmsUserProvider>
    </div>
  );
}
