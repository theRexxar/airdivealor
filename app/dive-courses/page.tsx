import type { Metadata } from "next";
import { getCourses } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { CoursesView } from "./CoursesView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCourses();
  return seoMetadata(data.content.seo, data.media, "/dive-courses");
}

export default async function CoursesPage() {
  return <CoursesView data={await getCourses()} />;
}
