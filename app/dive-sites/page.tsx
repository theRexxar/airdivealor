import type { Metadata } from "next";
import { SitesView } from "./SitesView";

const description = "33 dive sites around Alor, Pantar and Pura: walls, pinnacles, caverns and muck bays, each with a full site guide.";

export const metadata: Metadata = {
  title: "Dive sites | Air Dive Alor",
  description,
  openGraph: { title: "Dive sites | Air Dive Alor", description, type: "website" },
};

export default function SitesPage() {
  return <SitesView />;
}
