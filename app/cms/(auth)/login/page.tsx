import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/server/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in | Air Dive Alor CMS", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/cms") && !next.startsWith("//") ? next : "/cms";
  if (await currentUser()) redirect(safeNext);
  return <LoginForm next={safeNext} />;
}
