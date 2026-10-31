import type { Metadata } from "next";
import { AboutView } from "./AboutView";

const description = "Air Dive Alor is an Indonesian-owned dive center in Alor Kecil, East Nusa Tenggara, founded in 2017 by six brothers. Meet our team and our boats.";

export const metadata: Metadata = {
  title: "About us | Air Dive Alor",
  description,
  openGraph: { title: "About us | Air Dive Alor", description, type: "website" },
};

export default function AboutPage() {
  return <AboutView />;
}
