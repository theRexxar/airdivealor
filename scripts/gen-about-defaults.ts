/**
 * One-off: turns the About us page text into CMS content (English + Indonesian),
 * written to lib/cms/about-defaults.ts. Used by the seed and as fallback.
 */
import { writeFileSync } from "node:fs";
import type { AboutContent } from "../lib/cms/about-types";
import { toId } from "../lib/i18n";

const L = (en: string) => ({ en, id: en ? toId(en) : "" });
const M = (url: string) => ({ mediaId: null, url });
const WIX = "https://static.wixstatic.com/media/";
/** Full-size photo; the page shows a 600 px square thumbnail of Wix photos (see AboutView). */
const large = (id: string) => `${WIX}${id}/v1/fit/w_1600,h_1600,al_c,q_90/${id}`;
const PHOTO_IDS = [
  "47ffe6_8d34060091ec44b5b7b30928e0565414~mv2.jpg",
  "47ffe6_24fb996f0e1d45ba82ce684ab5f22b75~mv2.jpg",
  "47ffe6_ec92651dae514bcca1fdb21e90b52214~mv2.jpg",
  "47ffe6_45b1702800ff457285d2094cc539de20~mv2.jpg",
  "47ffe6_5e0a06717fd741ce9f1c0d311c082890~mv2.jpg",
  "47ffe6_71da4bb77f074c9198450ba166f68d63~mv2.jpg",
  "47ffe6_fd45e7ac39014f9186e27b8b66857ad4~mv2.jpeg",
  "47ffe6_cd2691213b5c461d9466b829d5c33e2a~mv2.jpg",
  "47ffe6_3b0d375f2101401da43b0d0ea2956d0d~mv2.jpg",
  "47ffe6_fadcd8f4fb5e4d29ba166060396cd9a3~mv2.jpg",
  "47ffe6_c08c983220244505969fe2958bec7f09~mv2.jpg",
  "47ffe6_594effeb95cb4a078b692740c9e9a798~mv2.jpg",
];
/** Display order chosen by the client: photos 2, 3, 5 and 7 first, then a fixed shuffle. */
const ORDER = [2, 3, 5, 7, 10, 1, 8, 12, 4, 11, 6, 9];
const SAFETY = { icon: "shield-check", label: L("Safety"), value: L("Emergency oxygen, first aid kit, life jackets and life ring") };

const content: AboutContent = {
  seo: {
    title: { en: "About us | Air Dive Alor", id: "Tentang kami | Air Dive Alor" },
    description: {
      en: "Air Dive Alor is an Indonesian-owned dive center in Alor Kecil, East Nusa Tenggara, founded in 2017 by six brothers. Meet our team and our boats.",
      id: "Air Dive Alor adalah dive center milik orang Indonesia di Alor Kecil, Nusa Tenggara Timur, didirikan pada 2017 oleh enam bersaudara. Kenali tim dan perahu kami.",
    },
    ogImage: M(""),
  },
  hero: {
    eyebrow: L("About us · Since 2017"),
    title: L("About Air Dive Alor."),
    lead: L(
      "An Indonesian-owned dive center in Alor Kecil, a small coastal village in Alor, East Nusa Tenggara. Alor sits in the heart of the Coral Triangle and has some of the healthiest reefs in Indonesia.",
    ),
    image: M(`${WIX}47ffe6_d892a553702747199788ec8f12c97ee5~mv2.jpg/v1/fill/w_1600,h_900,al_c,q_85/47ffe6_d892a553702747199788ec8f12c97ee5~mv2.jpg`),
    facts: [
      ["calendar-days", "March 2017", "Officially launched"],
      ["eye", "30 to 40 m", "Visibility at its peak"],
      ["clock", "Under 1 hour", "To most dive sites"],
    ].map(([icon, value, label]) => ({ icon, value: L(value), label: L(label) })),
  },
  story: {
    eyebrow: L("01 · Our story"),
    title: L("Six brothers, one passion."),
    paragraphs: [
      "Air Dive Alor was founded by six brothers who share a love of diving, travel and culture. We launched in March 2017 with brand-new dive equipment, a boat built for diving and a dive team that works to make your time in Alor memorable.",
      "We work with the local community to share real Alor hospitality and keep your dive holiday safe and fun. It is part of how we grow community-based tourism here.",
    ].map((t) => ({ text: L(t) })),
    hostsLabel: L("Your hosts"),
    hosts: [{ name: "Acionk" }, { name: "Maul" }],
    hostsText: L("Two of the six brothers run the dive center today. They will greet you and host you during your stay."),
    gallery: ORDER.map((n) => ({ photo: M(large(PHOTO_IDS[n - 1])) })),
  },
  name: {
    eyebrow: L("02 · Our name"),
    title: L("Why “Air”?"),
    text: L("Air stands for balance and the essential elements of life. It has two meanings, and every dive needs both."),
    cards: [
      { icon: "wind", label: L("In English"), word: L("Air"), text: L("The invisible mix of oxygen and nitrogen around the earth. The gas you breathe on every dive.") },
      { icon: "waves", label: L("In Bahasa Indonesia"), word: L("Air = water"), text: L("One of the most important elements in our lives, and the place where every dive happens.") },
    ],
  },
  boats: {
    eyebrow: L("03 · Our boats"),
    title: L("Two boats, built for Alor."),
    items: [
      {
        name: "Kanaloa",
        photo: M(`${WIX}47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg/v1/crop/x_1,y_104,w_1078,h_422/fill/w_1078,h_422,al_c,q_85/47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg`),
        text: L("Kanaloa is based on the Nusa Lembongan dive boat and was built by hand, from scratch, in Alor Kecil village. Safety is part of everything on board."),
        specs: [{ icon: "users", label: L("Capacity"), value: L("8 divers and 3 divemasters") }, { icon: "gauge", label: L("Engines"), value: L("2 outboard engines") }, SAFETY],
      },
      {
        name: "Inara",
        photo: M(`${WIX}47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg/v1/crop/x_0,y_231,w_1440,h_579/fill/w_1440,h_579,al_c,q_85/47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg`),
        text: L("Inara is our second dive boat. It is bigger and faster than Kanaloa, with the same safety equipment, so every group dives with the same standard."),
        specs: [{ icon: "users", label: L("Capacity"), value: L("12 divers and 3 divemasters") }, { icon: "gauge", label: L("Engines"), value: L("2 outboard engines, faster than Kanaloa") }, SAFETY],
      },
    ],
  },
  cta: {
    title: L("Book your trip now."),
    text: L("Have questions first? Our FAQ covers flights, season, currents and payment."),
    primaryLabel: L("Dive with us"),
    primaryMessage: "Hi Air Dive Alor, I would like to plan a dive trip.",
    secondaryLabel: L("Read the FAQ"),
    secondaryUrl: "/#b-faq",
  },
};

const out = `/* Generated by scripts/gen-about-defaults.ts. Built-in About us content: seed data and fallback. */
import type { AboutContent } from "./about-types";

export const ABOUT_DEFAULTS: AboutContent = ${JSON.stringify(content, null, 1)};
`;
writeFileSync("lib/cms/about-defaults.ts", out);
console.info("wrote lib/cms/about-defaults.ts");
