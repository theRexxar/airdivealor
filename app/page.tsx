import type { Metadata } from "next";
import { HomeView } from "./_home/HomeView";

const title = "Air Dive Alor | Scuba Diving, Courses & Dive Resort in Alor, Indonesia";
const description =
  "Dive Alor with Air Dive Alor in Alor Kecil: Pantar Strait walls, muck and pelagics, SDI and TDI courses, and a village stay with three meals a day. Diving March to November.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "https://airdivealor.com/files/large/206/1200/780", width: 1200, height: 780 }],
  },
};

export default function HomePage() {
  return <HomeView />;
}
