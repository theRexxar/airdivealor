import type { Metadata } from "next";
import { BlogIndex } from "./BlogIndex";

const description = "Stories from Air Dive Alor: marine life, the best time to dive, our boats and life in Alor Kecil village.";

export const metadata: Metadata = {
  title: "Blog | Air Dive Alor",
  description,
  openGraph: { title: "Blog | Air Dive Alor", description, type: "website" },
};

export default function BlogPage() {
  return <BlogIndex />;
}
