import type { Metadata } from "next";
import { CoursesView } from "./CoursesView";

const description = "SDI and TDI dive courses in Alor, from Open Water to Divemaster and technical diving. Every package includes your stay, three meals a day, gear and airport transfers.";

export const metadata: Metadata = {
  title: "Dive courses | Air Dive Alor",
  description,
  openGraph: { title: "Dive courses | Air Dive Alor", description, type: "website" },
};

export default function CoursesPage() {
  return <CoursesView />;
}
