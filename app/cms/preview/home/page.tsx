import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { can, currentUser } from "@/lib/server/auth";
import { PreviewClient } from "./PreviewClient";

export const metadata: Metadata = { title: "Preview: Home | Air Dive Alor CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** The Home page with unpublished drafts, for CMS users. */
export default async function PreviewPage() {
  const u = await currentUser();
  if (!u) redirect("/cms/login?next=/cms/preview/home");
  if (!can(u, "home.view")) redirect("/cms");
  return <PreviewClient />;
}
