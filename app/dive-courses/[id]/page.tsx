import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/cms/fetch";
import { CourseDetailView } from "./CourseDetailView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getCourse(id);
  if (!data) return {};
  const c = data.course;
  const image = c.photo.mediaId ? data.media[c.photo.mediaId]?.url : c.photo.url;
  const title = `${c.name.en} | Air Dive Alor`;
  return { title, description: c.text.en, openGraph: { title, description: c.text.en, images: image ? [image] : undefined } };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCourse(id);
  if (!data) notFound();
  return <CourseDetailView data={data} />;
}
