"use client";

import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Avatar, ButtonLink, Eyebrow, Icon, type IconName } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";
import "./about.css";

const WIX = "https://static.wixstatic.com/media/";
const thumb = (id: string) => `${WIX}${id}/v1/fill/w_600,h_600,al_c,q_85/${id}`;
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

const FACTS: { icon: IconName; value: string; label: string }[] = [
  { icon: "calendar-days", value: "March 2017", label: "Officially launched" },
  { icon: "eye", value: "30 to 40 m", label: "Visibility at its peak" },
  { icon: "clock", value: "Under 1 hour", label: "To most dive sites" },
];

const SAFETY = { icon: "shield-check" as IconName, label: "Safety", value: "Emergency oxygen, first aid kit, life jackets and life ring" };
const BOATS = [
  {
    name: "Kanaloa",
    img: `${WIX}47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg/v1/crop/x_1,y_104,w_1078,h_422/fill/w_1078,h_422,al_c,q_85/47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg`,
    text: "Kanaloa is based on the Nusa Lembongan dive boat and was built by hand, from scratch, in Alor Kecil village. Safety is part of everything on board.",
    specs: [
      { icon: "users" as IconName, label: "Capacity", value: "8 divers and 3 divemasters" },
      { icon: "gauge" as IconName, label: "Engines", value: "2 outboard engines" },
      SAFETY,
    ],
  },
  {
    name: "Inara",
    img: `${WIX}47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg/v1/crop/x_0,y_231,w_1440,h_579/fill/w_1440,h_579,al_c,q_85/47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg`,
    text: "Inara is our second dive boat. It is bigger and faster than Kanaloa, with the same safety equipment, so every group dives with the same standard.",
    specs: [
      { icon: "users" as IconName, label: "Capacity", value: "12 divers and 3 divemasters" },
      { icon: "gauge" as IconName, label: "Engines", value: "2 outboard engines, faster than Kanaloa" },
      SAFETY,
    ],
  },
];

export function AboutView() {
  const { t } = useLang();
  const [zoom, setZoom] = useState<number | null>(null);
  const photos = ORDER.map((n, i) => ({ id: PHOTO_IDS[n - 1], alt: t(`Air Dive Alor photo ${i + 1}`) }));

  return (
    <div className="page">
      <SiteHeader current="about" />

      <section data-theme="dark" className="about-hero">
        <img
          className="about-hero__img"
          src={`${WIX}47ffe6_d892a553702747199788ec8f12c97ee5~mv2.jpg/v1/fill/w_1600,h_900,al_c,q_85/47ffe6_d892a553702747199788ec8f12c97ee5~mv2.jpg`}
          alt={t("Air Dive Alor resort in Alor Kecil")}
          fetchPriority="high"
        />
        <div aria-hidden="true" className="about-hero__shade" />
        <div className="about-hero__body">
          <div className="about-hero__text">
            <Eyebrow onDark>{t("About us · Since 2017")}</Eyebrow>
            <h1 className="about-hero__title">{t("About Air Dive Alor.")}</h1>
            <p className="about-hero__lead">
              {t("An Indonesian-owned dive center in Alor Kecil, a small coastal village in Alor, East Nusa Tenggara. Alor sits in the heart of the Coral Triangle and has some of the healthiest reefs in Indonesia.")}
            </p>
          </div>
          <div className="about-facts">
            {FACTS.map((f) => (
              <div key={f.value} className="about-facts__item">
                <Icon name={f.icon} size={24} style={{ color: "var(--primary-300)" }} />
                <span className="about-facts__value">{t(f.value)}</span>
                <span className="about-facts__label">{t(f.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="about-split">
          <div className="about-split__text about-split__text--story">
            <Eyebrow>{t("01 · Our story")}</Eyebrow>
            <h2 className="h2-tight">{t("Six brothers, one passion.")}</h2>
            <p className="body-lg">
              {t("Air Dive Alor was founded by six brothers who share a love of diving, travel and culture. We launched in March 2017 with brand-new dive equipment, a boat built for diving and a dive team that works to make your time in Alor memorable.")}
            </p>
            <p className="body-lg">
              {t("We work with the local community to share real Alor hospitality and keep your dive holiday safe and fun. It is part of how we grow community-based tourism here.")}
            </p>
            <div className="hosts">
              <span className="label-caps">{t("Your hosts")}</span>
              <div className="hosts__list">
                {["Acionk", "Maul"].map((n) => (
                  <div key={n} className="hosts__person">
                    <Avatar name={n} size={40} />
                    <span className="hosts__name">{n}</span>
                  </div>
                ))}
              </div>
              <p>{t("Two of the six brothers run the dive center today. They will greet you and host you during your stay.")}</p>
            </div>
          </div>
          <div className="about-gallery">
            {photos.map((p, i) => (
              <button key={p.id} type="button" className="about-gallery__item" aria-label={t(`Enlarge ${p.alt}`)} onClick={() => setZoom(i)}>
                <img src={thumb(p.id)} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-name">
        <div className="about-split about-split--top">
          <div className="about-split__text about-split__text--name">
            <Eyebrow>{t("02 · Our name")}</Eyebrow>
            <h2 className="h2-tight">{t("Why “Air”?")}</h2>
            <p className="body-lg">{t("Air stands for balance and the essential elements of life. It has two meanings, and every dive needs both.")}</p>
          </div>
          <div className="name-cards">
            <NameCard icon="wind" lang="In English" word="Air" text="The invisible mix of oxygen and nitrogen around the earth. The gas you breathe on every dive." />
            <NameCard icon="waves" lang="In Bahasa Indonesia" word="Air = water" text="One of the most important elements in our lives, and the place where every dive happens." />
          </div>
        </div>
      </section>

      <section data-theme="dark" className="section about-boats">
        <div className="section-intro">
          <Eyebrow onDark>{t("03 · Our boats")}</Eyebrow>
          <h2 className="h2-tight">{t("Two boats, built for Alor.")}</h2>
        </div>
        <div className="boats">
          {BOATS.map((b) => (
            <article key={b.name} className="boat">
              <div className="boat__media">
                <img src={b.img} alt={t(`${b.name} dive boat`)} loading="lazy" />
              </div>
              <div className="boat__body">
                <h3 className="boat__name">{b.name}</h3>
                <p className="boat__text">{t(b.text)}</p>
                <div className="boat__specs">
                  {b.specs.map((sp) => (
                    <div key={sp.label} className="boat__spec">
                      <Icon name={sp.icon} size={18} style={{ color: "var(--primary-300)" }} />
                      <span className="boat__spec-label">{t(sp.label)}</span>
                      <span className="boat__spec-value">{t(sp.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band cta-band--plain">
        <div className="cta-band__text">
          <h2 className="h2">{t("Book your trip now.")}</h2>
          <p className="lead">{t("Have questions first? Our FAQ covers flights, season, currents and payment.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={waLink("Hi Air Dive Alor, I would like to plan a dive trip.")} external variant="primary" size="xlarge" icon="message-circle">
            {t("Dive with us")}
          </ButtonLink>
          <ButtonLink href={ROUTES.faq} variant="secondary" size="xlarge" icon="arrow-right" iconPosition="suffix">
            {t("Read the FAQ")}
          </ButtonLink>
        </div>
      </section>

      <Lightbox photos={photos.map((p) => ({ src: large(p.id), alt: p.alt }))} index={zoom} onChange={setZoom} />

      <SiteFooter />
    </div>
  );
}

function NameCard({ icon, lang, word, text }: { icon: IconName; lang: string; word: string; text: string }) {
  const { t } = useLang();
  return (
    <div className="name-card">
      <Icon name={icon} size={28} style={{ color: "var(--icon-primary)" }} />
      <span className="label-caps">{t(lang)}</span>
      <span className="name-card__word">{t(word)}</span>
      <p>{t(text)}</p>
    </div>
  );
}
