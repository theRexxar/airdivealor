import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSES } from "@/lib/courses";
import { CourseDetailView } from "./CourseDetailView";

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = COURSES.find((x) => x.id === id);
  if (!c) return {};
  const title = `${c.name} | Air Dive Alor`;
  return { title, description: c.text, openGraph: { title, description: c.text, images: [c.img] } };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!COURSES.some((c) => c.id === id)) notFound();
  return <CourseDetailView id={id} />;
}
