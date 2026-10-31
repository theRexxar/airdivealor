"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Alert, Button, ButtonLink, Eyebrow, Icon, Tag, type IconName } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";
import "../about-us/about.css";
import "./facilities.css";

interface Photo {
  src?: string;
  label: string;
  title: string;
}

const STAY_PHOTOS: Photo[] = [
  { label: "Rooms", title: "Four deluxe rooms" },
  { src: "/latest/b-stay-shop.webp", label: "Porch", title: "Our porch in Alor Kecil" },
  { src: "/latest/b-stay-meals.webp", label: "Meals", title: "Three home-cooked meals a day" },
  { src: "/latest/b-stay-airport.webp", label: "Airport", title: "Pick-up at Mali Airport" },
];
const DIVE_PHOTOS: Photo[] = [
  { src: "/latest/b-boat-drinks.webp", label: "Briefing", title: "Dive briefing on the boat" },
  { src: "https://airdivealor.com/files/large/220/1200/780", label: "Dive shop", title: "Gear room at the dive shop" },
  { src: "https://airdivealor.com/files/large/209/1200/780", label: "Kanaloa", title: "Surface interval on Kanaloa" },
  { src: "https://airdivealor.com/files/large/210/1200/780", label: "Lunch", title: "Lunch cooked on board" },
  { src: "https://airdivealor.com/files/large/268/500/350", label: "Camera table", title: "Camera table and rinse tank" },
];

const ROOM: [IconName, string][] = [
  ["bed-double", "Two rooms with a queen bed"],
  ["bed-single", "Two rooms with twin beds"],
  ["shower-head", "Private bathroom with hot shower"],
  ["snowflake", "Air conditioning"],
  ["vault", "Safe deposit box"],
  ["laptop", "Desk and work space"],
  ["coffee", "Kettle, tea, coffee and drinking water"],
  ["tree-palm", "Hammock on the porch"],
  ["utensils", "Breakfast, lunch and dinner"],
];
const DIVE_DAY: [IconName, string][] = [
  ["anchor", "Dive shop 3 minutes from the boat"],
  ["gauge", "Tanks filled and checked every morning"],
  ["droplets", "Gear rinsed and dried for you"],
  ["megaphone", "A briefing before every dive"],
  ["clock", "At least 60 minutes between dives"],
  ["coffee", "Hot tea and coffee on board"],
  ["utensils", "Lunch cooked on board"],
];
const WIX = "https://static.wixstatic.com/media/";
const SAFETY = { icon: "shield-check" as IconName, label: "Safety", value: "Emergency oxygen, first aid kit, life jackets and life ring" };
const BOATS = [
  {
    name: "Kanaloa",
    img: `${WIX}47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg/v1/crop/x_1,y_104,w_1078,h_422/fill/w_1078,h_422,al_c,q_85/47ffe6_097891455d4c48b989c063b7377c8ee0~mv2.jpg`,
    text: "Kanaloa is based on the Nusa Lembongan dive boat and was built by hand, from scratch, in Alor Kecil village. Safety is part of everything on board.",
    specs: [{ icon: "users" as IconName, label: "Capacity", value: "8 divers and 3 divemasters" }, { icon: "gauge" as IconName, label: "Engines", value: "2 outboard engines" }, SAFETY],
  },
  {
    name: "Inara",
    img: `${WIX}47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg/v1/crop/x_0,y_231,w_1440,h_579/fill/w_1440,h_579,al_c,q_85/47ffe6_e6bfd9cf0ef14ad1874ad244df7356bb~mv2.jpg`,
    text: "Inara is our second dive boat. It is bigger and faster than Kanaloa, with the same safety equipment, so every group dives with the same standard.",
    specs: [{ icon: "users" as IconName, label: "Capacity", value: "12 divers and 3 divemasters" }, { icon: "gauge" as IconName, label: "Engines", value: "2 outboard engines, faster than Kanaloa" }, SAFETY],
  },
];
const GEAR: [IconName, string, string][] = [
  ["backpack", "Dive gear", "BCD, regulator, wetsuit, mask and fins in many sizes. Included in every package."],
  ["shield-check", "Safety gear", "Emergency oxygen, first aid kit, life jackets and a life ring on both boats."],
  ["container", "Tanks", "Tanks are filled and checked every morning, before the boat leaves."],
  ["fan", "Compressor", "Our own compressor at the dive shop, so every tank is filled on site."],
  ["droplets", "Rinse and dry", "Fresh-water rinse tanks and a drying area. We rinse and dry your gear for you."],
  ["camera", "Camera care", "A dry camera table, rinse tank and charging points on the boat."],
];

type Tab = "a" | "b" | "c";
const PACKAGES: Record<Tab, { name: string; sub: string; rows: [number, number, string][] }> = {
  a: { name: "Package A", sub: "2 dives a day", rows: [[5, 6, "9,800,000"], [6, 8, "12,700,000"], [7, 10, "15,600,000"], [8, 12, "18,500,000"], [9, 14, "21,400,000"], [10, 16, "24,300,000"], [11, 18, "27,200,000"], [12, 20, "30,000,000"]] },
  b: { name: "Package B", sub: "3 dives a day", rows: [[5, 8, "11,825,000"], [6, 11, "15,725,000"], [7, 14, "19,625,000"], [8, 17, "23,525,000"], [9, 20, "27,425,000"], [10, 23, "31,325,000"], [11, 26, "35,225,000"], [12, 29, "39,125,000"]] },
  c: { name: "À la carte", sub: "Pay per dive", rows: [] },
};
const AT_A_GLANCE: { tab: Tab; label: string; title: string; from: string; price: string; note: string }[] = [
  { tab: "a", label: "Package A", title: "2 dives a day", from: "From", price: "IDR 9,800,000", note: "5 days, 6 dives" },
  { tab: "b", label: "Package B", title: "3 dives a day", from: "From", price: "IDR 11,825,000", note: "5 days, 8 dives" },
  { tab: "c", label: "À la carte", title: "Pay per dive", from: "Fun dive", price: "IDR 1,000,000", note: "per dive, 10% off from 10 dives" },
];

export function FacilitiesView() {
  const { t, lang } = useLang();
  const id = lang === "ID";
  const [tab, setTab] = useState<Tab>("a");
  const [viewer, setViewer] = useState<{ photos: Photo[]; i: number } | null>(null);
  const P = PACKAGES[tab];
  const isPkg = tab !== "c";

  const pick = (k: Tab) => {
    setTab(k);
    const el = document.getElementById("rates");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };

  return (
    <div className="page">
      <SiteHeader current="facilities" />

      <section data-theme="dark" className="fr-hero">
        <img className="about-hero__img" src="/latest/b-stay-shop.webp" alt="The Air Dive Alor shop porch in Alor Kecil" fetchPriority="high" />
        <div aria-hidden="true" className="fr-hero__shade" />
        <div className="fr-hero__body">
          <Eyebrow onDark>{t("Pricing · Facilities and rates")}</Eyebrow>
          <h1 className="about-hero__title">{t("Dive and stay in Alor Kecil.")}</h1>
          <p className="about-hero__lead fr-hero__lead">{t("Four rooms in the village, three home-cooked meals a day, and dive packages from five days.")}</p>
        </div>
      </section>

      <section className="fr-glance">
        <div data-theme="light" className="fr-glance__grid">
          {AT_A_GLANCE.map((g) => (
            <button key={g.tab} type="button" className="fr-glance__item" onClick={() => pick(g.tab)}>
              <span className="fr-caps-primary">{t(g.label)}</span>
              <span className="fr-glance__title">{t(g.title)}</span>
              <span className="fr-glance__price">
                <span className="fr-glance__from">{t(g.from)}</span>
                <span className="fr-glance__amount">{g.price}</span>
              </span>
              <span className="fr-glance__note">{t(g.note)}</span>
              <span className="fr-glance__more">
                <span>{t("See rates")}</span>
                <Icon name="arrow-right" size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="stay" className="section">
        <div className="fr-intro">
          <div className="fr-intro__head">
            <Eyebrow>{t("01 · Air Dive Stay")}</Eyebrow>
            <h2 className="h2">{t("Village life, four good rooms.")}</h2>
          </div>
          <div className="fr-intro__text">
            <p className="fr-p">{t("We are in the heart of Alor Kecil village. Forget the alarm. Wake up to roosters and birds, and enjoy the quiet of the countryside.")}</p>
            <p className="fr-p">{t("Every stay includes three meals a day: breakfast, lunch and dinner. Our cook makes them fresh, with local recipes and food from the market.")}</p>
          </div>
        </div>
        <div className="fr-split">
          <Gallery photos={STAY_PHOTOS} onOpen={(i) => setViewer({ photos: STAY_PHOTOS, i })} />
          <div className="fr-side">
            <div className="fr-side__head">
              <span className="fr-side__title">{t("In every room")}</span>
              <Tag tone="primary" icon="house">
                {t("4 deluxe rooms")}
              </Tag>
            </div>
            <IconList items={ROOM} />
            <div data-theme="light">
              <Alert>{t("There is no wifi yet. To stay in touch, you can use our office mobile internet at dinner time.")}</Alert>
            </div>
          </div>
        </div>
      </section>

      <section id="diving" className="section fr-diving">
        <div className="fr-intro">
          <div className="fr-intro__head">
            <Eyebrow>{t("02 · Air Dive Diving")}</Eyebrow>
            <h2 className="h2">{t("Everything ready before you dive.")}</h2>
          </div>
          <div className="fr-intro__text">
            <p className="fr-p">{t("Our dive shop and boat are three minutes apart. Gear, tanks and the boat are ready each morning, so you only need to come to the briefing.")}</p>
          </div>
        </div>
        <div className="fr-split">
          <div className="fr-side">
            <div className="fr-side__head">
              <span className="fr-side__title">{t("Every dive day")}</span>
            </div>
            <IconList items={DIVE_DAY} />
            <div className="fr-row">
              <Button variant="secondary" size="large" icon="arrow-right" iconPosition="suffix" onClick={() => pick("a")}>
                {t("See diving rates")}
              </Button>
            </div>
          </div>
          <Gallery photos={DIVE_PHOTOS} onOpen={(i) => setViewer({ photos: DIVE_PHOTOS, i })} />
        </div>

        <div className="fr-sub">
          <div className="fr-sub__head">
            <h3 className="fr-sub__title">{t("Two boats, built for Alor.")}</h3>
            <p className="lead">{t("Both boats carry the same safety equipment, so every group dives with the same standard.")}</p>
          </div>
          <div className="boats">
            {BOATS.map((b) => (
              <article key={b.name} className="boat fr-boat">
                <div className="boat__media">
                  <img src={b.img} alt={t(`${b.name} dive boat`)} loading="lazy" />
                </div>
                <div className="boat__body">
                  <h4 className="boat__name">{b.name}</h4>
                  <p className="boat__text fr-boat__text">{t(b.text)}</p>
                  <div className="boat__specs">
                    {b.specs.map((sp) => (
                      <div key={sp.label} className="boat__spec">
                        <Icon name={sp.icon} size={18} style={{ color: "var(--icon-primary)" }} />
                        <span className="boat__spec-label fr-boat__label">{t(sp.label)}</span>
                        <span className="boat__spec-value">{t(sp.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="fr-sub">
          <div className="fr-sub__head">
            <h3 className="fr-sub__title">{t("Gear and equipment.")}</h3>
            <p className="lead">{t("Everything you need to dive is here. You only need to bring yourself.")}</p>
          </div>
          <div className="fr-gear">
            {GEAR.map(([icon, title, text]) => (
              <div key={title} className="fr-gear__item">
                <Icon name={icon} size={26} style={{ color: "var(--icon-primary)" }} />
                <span className="fr-gear__title">{t(title)}</span>
                <p>{t(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rates" className="section fr-rates">
        <div className="stories__head fr-rates__head">
          <div className="fr-rates__intro">
            <Eyebrow>{t("03 · Diving rates")}</Eyebrow>
            <h2 className="h2">{t("Choose your package.")}</h2>
            <p className="lead">{t("Pick a package by how long you stay. Tap a row to ask us on WhatsApp.")}</p>
          </div>
          <div role="tablist" aria-label="Rate type" className="chips">
            {(["a", "b", "c"] as Tab[]).map((k) => (
              <Button key={k} role="tab" aria-selected={k === tab} variant={k === tab ? "primary" : "secondary"} size="small" onClick={() => setTab(k)}>
                {t(PACKAGES[k].name)}
              </Button>
            ))}
          </div>
        </div>
        <div className="fr-split fr-split--top">
          <div className="fr-rates__main">
            <div className="fr-rates__title">
              <span className="fr-rates__name">{t(P.name)}</span>
              <span className="fr-rates__sub">{t(P.sub)}</span>
            </div>
            {isPkg ? (
              <div className="fr-table">
                <div className="fr-table__head">
                  <span>{t("Trip length")}</span>
                  <span>{t("Price")}</span>
                  <span />
                </div>
                {P.rows.map(([d, v, pr]) => (
                  <a
                    key={d}
                    className="fr-table__row"
                    href={waLink(`Hi Air Dive Alor, I am interested in ${P.name}: ${v} dives, ${d} days / ${d - 1} nights (IDR ${pr}).`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ask about ${P.name}, ${v} dives, ${d} days`}
                  >
                    <span className="fr-table__len">
                      <span className="fr-table__days">{id ? `${d} hari, ${d - 1} malam` : `${d} days, ${d - 1} nights`}</span>
                      <span className="fr-table__dives">{id ? `${v} kali selam` : `${v} dives`}</span>
                    </span>
                    <span className="fr-table__price">IDR {pr}</span>
                    <Icon name="arrow-right" size={18} style={{ color: "var(--icon-primary)" }} />
                  </a>
                ))}
              </div>
            ) : (
              <>
                <div className="fr-ala">
                  <AlaCard icon="waves" label="Fun dive" price="IDR 1,000,000" per="per dive" href={waLink("Hi Air Dive Alor, I would like to book fun dives.")} />
                  <AlaCard icon="bed-double" label="Stay" price="IDR 800,000" per="per night" href={waLink("Hi Air Dive Alor, I would like to book a room.")} />
                </div>
                <div className="fr-row">
                  <Tag tone="primary" icon="percent">
                    {t("10% off from 10 dives")}
                  </Tag>
                </div>
              </>
            )}
          </div>
          <div className="fr-incl">
            <span className="label-caps">{t("Included")}</span>
            {(isPkg
              ? ["Regular room and 3 meals a day", "Diving equipment", "Airport transfer", "Government tax", "Snacks on the boat"]
              : ["Diving equipment", "Airport transfer", "Snacks on the boat"]
            ).map((it) => (
              <div key={it} className="fr-incl__row">
                <Icon name="circle-check" size={20} style={{ color: "var(--icon-primary)", flex: "none" }} />
                <span>{t(it)}</span>
              </div>
            ))}
            <span className="label-caps fr-incl__sep">{t("Not included")}</span>
            {(isPkg ? ["Marine park fee"] : ["Lunch", "Local government tax", "Marine park fee"]).map((it) => (
              <div key={it} className="fr-incl__row">
                <Icon name="circle-x" size={20} style={{ color: "var(--neutral-500)", flex: "none" }} />
                <span>{t(it)}</span>
              </div>
            ))}
            <p className="fr-incl__note">
              {t(isPkg ? "Minimum booking is 2 people. If you travel alone, a single-room surcharge applies." : "Book 10 dives or more and get 10% off.")}
            </p>
          </div>
        </div>
        <div data-theme="light" className="fr-note">
          <Alert>{t("These prices are estimates. Your final cost depends on the dives and nights you actually take. Group rates are available on request.")}</Alert>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band__text">
          <h2 className="h2">{t("Coming as a group?")}</h2>
          <p className="lead">{t("Tell us your dates and group size. We will send you a group rate.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={waLink("Hi Air Dive Alor, I would like a group rate. Dates: , group size: ")} external variant="primary" size="xlarge" icon="message-circle">
            {t("Ask for a group rate")}
          </ButtonLink>
          <ButtonLink href={ROUTES.courses} variant="secondary" size="xlarge" icon="arrow-right" iconPosition="suffix">
            {t("See dive courses")}
          </ButtonLink>
        </div>
      </section>

      {viewer && <PhotoViewer photos={viewer.photos} start={viewer.i} onClose={() => setViewer(null)} />}

      <SiteFooter />
    </div>
  );
}

function IconList({ items }: { items: [IconName, string][] }) {
  const { t } = useLang();
  return (
    <div className="fr-list">
      {items.map(([icon, text]) => (
        <div key={text} className="fr-list__row">
          <Icon name={icon} size={22} style={{ color: "var(--icon-primary)", flex: "none" }} />
          <span>{t(text)}</span>
        </div>
      ))}
    </div>
  );
}

function AlaCard({ icon, label, price, per, href }: { icon: IconName; label: string; price: string; per: string; href: string }) {
  const { t } = useLang();
  return (
    <a className="fr-ala__card" href={href} target="_blank" rel="noopener noreferrer">
      <Icon name={icon} size={26} style={{ color: "var(--icon-primary)" }} />
      <span className="label-caps">{t(label)}</span>
      <span className="fr-ala__price">{price}</span>
      <span className="fr-ala__per">{t(per)}</span>
    </a>
  );
}

/** Large photo with caption and arrows, plus a row of thumbnails. Photos without a source show a placeholder. */
function Gallery({ photos, onOpen }: { photos: Photo[]; onOpen: (i: number) => void }) {
  const { t } = useLang();
  const [i, setI] = useState(0);
  const n = photos.length;
  const x = photos[i];
  return (
    <div className="fr-gallery">
      <div className="fr-gallery__main">
        {x.src ? (
          <button type="button" className="fr-gallery__open" aria-label={t("View photo larger")} onClick={() => onOpen(i)}>
            <img src={x.src} alt={t(x.title)} />
          </button>
        ) : (
          <div className="fr-gallery__empty">
            <Icon name="image-plus" size={32} />
            <span>{t("Photo coming soon")}</span>
          </div>
        )}
        <div data-theme="dark" className="fr-gallery__caption">
          <div className="fr-gallery__text">
            <span className="fr-gallery__label">{t(x.label)}</span>
            <span className="fr-gallery__title">{t(x.title)}</span>
          </div>
          <div className="fr-gallery__controls">
            <span className="fr-gallery__count">
              {i + 1} / {n}
            </span>
            <Button variant="secondary" icon="chevron-left" iconOnly aria-label={t("Previous photo")} onClick={() => setI((i + n - 1) % n)} />
            <Button variant="secondary" icon="chevron-right" iconOnly aria-label={t("Next photo")} onClick={() => setI((i + 1) % n)} />
            {x.src && <Button variant="secondary" icon="maximize-2" iconOnly aria-label={t("View photo larger")} onClick={() => onOpen(i)} />}
          </div>
        </div>
      </div>
      <div className="fr-thumbs" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {photos.map((p, j) => (
          <button key={p.label} type="button" className="fr-thumb" aria-label={`Show photo: ${t(p.title)}`} aria-pressed={j === i} onClick={() => setI(j)}>
            <span className="fr-thumb__img">
              {p.src ? (
                <img src={p.src} alt="" loading="lazy" />
              ) : (
                <span className="fr-thumb__empty">
                  <Icon name="image-plus" size={22} />
                </span>
              )}
            </span>
            <span className="fr-thumb__label">{t(p.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Full-screen viewer for a gallery; skips photos that have no source yet. */
function PhotoViewer({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: () => void }) {
  const { t } = useLang();
  const withSrc = photos.filter((p) => p.src);
  const [i, setI] = useState(Math.max(0, withSrc.indexOf(photos[start])));
  const n = withSrc.length;
  const x = withSrc[i];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((k) => (k + 1) % n);
      if (e.key === "ArrowLeft") setI((k) => (k + n - 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [n, onClose]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div data-theme="dark" role="dialog" aria-modal="true" aria-label={t("Photo viewer")} className="fr-viewer">
      <div className="fr-viewer__bar">
        <span className="fr-gallery__label">{t(x.label)}</span>
        <span className="fr-viewer__count">
          {i + 1} / {n}
        </span>
        <Button variant="secondary" icon="x" iconOnly aria-label={t("Close")} onClick={onClose} />
      </div>
      <div className="fr-viewer__stage" onClick={onClose}>
        <span onClick={stop}>
          <Button variant="secondary" size="large" icon="chevron-left" iconOnly aria-label={t("Previous photo")} onClick={() => setI((i + n - 1) % n)} />
        </span>
        <img className="fr-viewer__img" src={x.src} alt={t(x.title)} onClick={stop} />
        <span onClick={stop}>
          <Button variant="secondary" size="large" icon="chevron-right" iconOnly aria-label={t("Next photo")} onClick={() => setI((i + 1) % n)} />
        </span>
      </div>
      <div className="fr-viewer__title">{t(x.title)}</div>
    </div>
  );
}
