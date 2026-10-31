import type { Metadata } from "next";
import { FacilitiesView } from "./FacilitiesView";

const description = "Stay in Alor Kecil village with three home-cooked meals a day, and dive with our two boats. Dive packages from five days, or pay per dive.";

export const metadata: Metadata = {
  title: "Facilities and rates | Air Dive Alor",
  description,
  openGraph: { title: "Facilities and rates | Air Dive Alor", description, type: "website" },
};

export default function FacilitiesPage() {
  return <FacilitiesView />;
}
