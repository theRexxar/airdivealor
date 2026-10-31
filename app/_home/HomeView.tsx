"use client";

import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Alert, AvatarWithText, Button, ButtonLink, Eyebrow, Icon, Input, Rating, Select, Tag, type IconName } from "@/components/ui";
import { HOME } from "@/lib/home-data";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/site";
import { siteHref } from "@/lib/sites";
import { DepthGauge } from "./DepthGauge";
import { Preloader } from "./Preloader";
import "./home.css";

type PkgId = (typeof HOME.packages)[number]["id"];

const GOOGLE_REVIEWS =
  "https://www.google.com.ng/travel/hotels/entity/ChkI1sa0ndHd695tGg0vZy8xMWNzcmx6dzExEAE/reviews?utm_campaign=sharing&utm_medium=link&utm_source=htls&ts=CAEaIAoCGgASGhIUCgcI6g8QChgdEgcI6g8QChgeGAEyAhAAKgQKABoA";
const TRIPADVISOR = "https://www.tripadvisor.com/Attraction_Review-g1600794-d12343022-Reviews-Air_Dive_Alor-Alor_Island_East_Nusa_Tenggara.html";

/** Photos the client placed in the design (assets/latest) replace the prototype's defaults for these slots. */
const LATEST: Record<string, string> = {
  "b-why-3": "/latest/b-why-3.webp",
  "b-stay-shop": "/latest/b-stay-shop.webp",
  "b-stay-meals": "/latest/b-stay-meals.webp",
  "b-stay-airport": "/latest/b-stay-airport.webp",
  "b-boat-drinks": "/latest/b-boat-drinks.webp",
};

interface Facet {
  icon: IconName;
  label: string;
  slot: string;
  photo: string;
  statLabel: string;
  stat: string;
  title: string;
  text: string;
}
const REST_CARDS: { kicker: string; facets: Facet[] }[] = [
  {
    kicker: "Stay · 0 m, on land",
    facets: [
      { icon: "bed", label: "Rooms", slot: "b-stay-rooms", photo: "https://airdivealor.com/files/large/283/1200/780", statLabel: "Room types", stat: "Cottage, guesthouse", title: "Beachside cottages in Alor Kecil", text: "Cottages and garden guesthouses by the beach. Fans or air-con, hot showers, and a hammock for the hours after diving." },
      { icon: "anchor", label: "Dive shop", slot: "b-stay-shop", photo: "https://airdivealor.com/files/large/220/1200/780", statLabel: "Walk to boat", stat: "3 min", title: "Three minutes to the boat", text: "Your gear stays at the shop, rinsed and dried for you. Tanks are filled and checked before you wake up." },
      { icon: "plane", label: "Airport", slot: "b-stay-airport", photo: "https://airdivealor.com/files/large/235/1200/780", statLabel: "From Mali Airport", stat: "45 min", title: "Picked up at Mali Airport", text: "We meet every flight. No diving 24 hours before you fly out, so plan one dry day at the end of your trip." },
      { icon: "utensils", label: "Meals", slot: "b-stay-meals", photo: "https://airdivealor.com/files/large/225/1200/780", statLabel: "Breakfast from", stat: "6:30 am", title: "Early breakfast, big dinners", text: "Breakfast is ready before the first boat. Dinner is local food: grilled fish, rice and fresh fruit from the market." },
    ],
  },
  {
    kicker: "Kanaloa · Surface interval",
    facets: [
      { icon: "clock", label: "Interval", slot: "b-boat-interval", photo: "https://airdivealor.com/files/large/209/1200/780", statLabel: "Surface interval", stat: "60 min+", title: "A full hour between dives", text: "Deeper dives need longer to off-gas. We keep at least an hour on deck between dives, often in a calm bay." },
      { icon: "coffee", label: "Warm drinks", slot: "b-boat-drinks", photo: "https://airdivealor.com/files/large/250/1200/780", statLabel: "Water in August", stat: "22–25°C", title: "Hot ginger tea after cold water", text: "Mid-year upwellings make the water cool. The crew has hot tea and coffee ready as soon as you climb the ladder." },
      { icon: "utensils", label: "Lunch", slot: "b-boat-lunch", photo: "https://airdivealor.com/files/large/210/1200/780", statLabel: "Served", stat: "Between dives 2 and 3", title: "Lunch on deck, music after", text: "Fresh lunch is cooked on board. Someone usually has a guitar while you swap fish IDs and look out at Pantar." },
      { icon: "camera", label: "Camera table", slot: "b-boat-camera", photo: "https://airdivealor.com/files/large/268/500/350", statLabel: "On board", stat: "Rinse tank, charging", title: "A dry, shaded camera table", text: "Fresh-water rinse tank, charging points and space to change lenses between dives without rushing." },
    ],
  },
];

const DIVERS = ["1 diver", "2 divers", "3 divers", "4 divers", "5 divers", "6 divers"];
const CERTS = ["Not certified yet", "Open Water", "Advanced", "Rescue or higher", "Dive professional"];

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 64, behavior: "smooth" });
};

export function HomeView() {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);

  const [cur, setCur] = useState<"IDR" | "USD">("IDR");
  const [whyIdx, setWhyIdx] = useState(0);
  const [siteIdx, setSiteIdx] = useState(1);
  const [revIdx, setRevIdx] = useState(0);
  const [restIdx, setRestIdx] = useState([0, 0]);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [pkg, setPkg] = useState<PkgId>("stay");
  const [date, setDate] = useState("");
  const [divers, setDivers] = useState("2 divers");
  const [cert, setCert] = useState("Open Water");
  const [cam, setCam] = useState<"Yes" | "No">("No");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
  const usd = (n: number) => "US$" + Math.round(n / HOME.usdRate).toLocaleString("en-US");
  const main = (n: number) => (cur === "IDR" ? rp(n) : usd(n));
  const alt = (n: number) => (cur === "IDR" ? "≈ " + usd(n) : rp(n));

  const pk = HOME.packages.find((p) => p.id === pkg) ?? HOME.packages[0];
  const nDiv = parseInt(divers) || 1;
  const why = HOME.why[whyIdx];
  const whyPhoto = LATEST[`b-why-${whyIdx}`] ?? why.photo;
  const site = HOME.sites[siteIdx];
  const rev = HOME.reviews[revIdx];
  const nRev = HOME.reviews.length;

  const choose = (id: PkgId) => {
    setPkg(id);
    setStep(2);
    setSent(false);
    scrollToId("b-book");
  };

  return (
    <>
      <Preloader />
      <div ref={rootRef} className="page home">
        <DepthGauge rootRef={rootRef} />
        <SiteHeader current="home" />

        {/* 0 m · Hero */}
        <section data-theme="dark" className="home-hero">
          <div className="home-hero__frame">
            <img className="home-hero__img" src="/latest/b-hero.webp" alt="Diver over a coral wall in Alor" fetchPriority="high" />
            <div aria-hidden="true" className="home-hero__shade" />
            <div className="home-hero__body">
              <Eyebrow onDark>{t("0 m · Surface")}</Eyebrow>
              <h1 className="home-hero__title">
                {t("Dive.")}
                <br />
                {t("Explore.")}
                <br />
                {t("Be Surprised.")}
              </h1>
              <p className="home-hero__lead">{t("Pantar Strait currents. Rhinopias to hammerheads. Diving in Alor, March to November.")}</p>
              <div className="home-hero__ctas">
                <Button variant="primary" size="xlarge" onClick={() => scrollToId("b-book")}>
                  {t("Book your dive")}
                </Button>
                <Button variant="text" size="xlarge" icon="arrow-down" iconPosition="suffix" onClick={() => scrollToId("b-prices")}>
                  {t("See prices")}
                </Button>
              </div>
            </div>
            <div className="home-hero__caption">Dinding Bama · 18 m</div>
          </div>
          <div data-theme="light" className="home-awards">
            <div className="home-awards__item">
              <Icon name="badge-check" size={28} style={{ color: "var(--icon-primary)" }} />
              <span className="home-awards__title">{t("SDI dive center")}</span>
            </div>
            <div className="home-awards__item">
              <Icon name="shield-check" size={28} style={{ color: "var(--icon-primary)" }} />
              <span className="home-awards__title">{t("TDI technical training")}</span>
            </div>
            <div className="home-awards__item">
              <Rating value={4.9} />
              <div className="home-awards__text">
                <span className="home-awards__title">{t("4.9 on Google")}</span>
                <span className="home-awards__sub">{t("From 180+ reviews")}</span>
              </div>
            </div>
            <div className="home-awards__item">
              <Icon name="users" size={28} style={{ color: "var(--icon-primary)" }} />
              <span className="home-awards__title">{t("2,000+ divers")}</span>
            </div>
          </div>
        </section>

        {/* 5 m · Prices */}
        <section id="b-prices" className="home-prices">
          <div className="home-head">
            <div className="home-head__text">
              <Eyebrow>{t("5 m · Prices")}</Eyebrow>
              <h2 className="h2">{t("Every price, side by side.")}</h2>
              <p className="home-head__lead">{t("Compare what each trip includes. Pick one and you're already on step two.")}</p>
            </div>
            <div className="home-cur">
              <div className="home-cur__switch">
                <Button variant={cur === "IDR" ? "primary" : "text"} size="xsmall" onClick={() => setCur("IDR")}>
                  IDR
                </Button>
                <Button variant={cur === "USD" ? "primary" : "text"} size="xsmall" onClick={() => setCur("USD")}>
                  USD
                </Button>
              </div>
              <div className="home-cur__note">{t("USD is indicative. You pay in IDR.")}</div>
            </div>
          </div>
          <div className="price-table">
            <div className="price-table__inner">
              <div className="price-table__row price-table__row--head">
                <div className="price-table__label price-table__label--head">
                  <div className="label-caps">{t("From, per person")}</div>
                  <div className="price-table__deposit">{t("Pay a 30% deposit to hold your dates.")}</div>
                </div>
                {HOME.packages.map((p) => (
                  <div key={p.id} className="price-table__pkg" data-on={p.id === pkg || undefined}>
                    <div className="price-table__top">
                      {p.id === "stay" && <Tag tone="primary">{t(p.tag)}</Tag>}
                      <div className="label-caps price-table__meta">{t(p.meta)}</div>
                    </div>
                    <h3 className="price-table__name">{t(p.name)}</h3>
                    <div className="price-table__price">
                      <div className="price-table__main">{main(p.idr)}</div>
                      <div className="price-table__alt">
                        {alt(p.idr)} · {t(p.unit)}
                      </div>
                    </div>
                    <Button variant={p.id === pkg ? "primary" : "secondary"} size="large" style={{ width: "100%" }} onClick={() => choose(p.id)}>
                      {t("Choose")}
                    </Button>
                  </div>
                ))}
              </div>
              {HOME.matrixRows.map((label, r) => (
                <div key={label} className="price-table__row price-table__row--line">
                  <div className="price-table__label">{t(label)}</div>
                  {HOME.packages.map((p) => {
                    const v = p.matrix[r];
                    return (
                      <div key={p.id} className="price-table__cell" data-on={p.id === pkg || undefined}>
                        {v === true && <Icon name="check" size={20} style={{ color: "var(--icon-primary)" }} />}
                        {v === false && <Icon name="minus" size={20} style={{ color: "var(--icon-tertiary)" }} />}
                        {typeof v === "string" && <span className="price-table__num">{v}</span>}
                        <span className="visually-hidden">{v === true ? t("Included") : v === false ? t("Not included") : ""}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 m · Why Alor */}
        <section id="b-why" className="home-why">
          <img className="home-why__img" src={whyPhoto} alt="" />
          <div aria-hidden="true" className="home-why__shade" />
          <div className="home-why__body">
            <div className="home-why__head">
              <Eyebrow>{t("10 m · Why Alor")}</Eyebrow>
              <h2 className="h2">{t("Four kinds of diving, one island.")}</h2>
            </div>
            <div className="home-why__list">
              {HOME.why.map((w, i) => (
                <button key={w.label} type="button" className="home-why__item" data-on={i === whyIdx || undefined} onClick={() => setWhyIdx(i)} onMouseEnter={() => setWhyIdx(i)}>
                  <span className="home-why__num">0{i + 1}</span>
                  <span className="home-why__text">
                    <span className="home-why__label">{t(w.label)}</span>
                    {i === whyIdx && <span className="home-why__desc">{t(w.text)}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="home-why__tag">{t(why.title)}</div>
        </section>

        {/* 15 m · Dive sites */}
        <section id="b-sites" data-theme="dark" className="section home-sites">
          <div className="section-intro home-sites__intro">
            <Eyebrow onDark>{t("15 m · Dive sites")}</Eyebrow>
            <h2 className="h2">{t("Pick a site. See what lives there.")}</h2>
          </div>
          <div className="home-sites__split">
            <div className="home-sites__list">
              {HOME.sites.map((x, i) => (
                <button key={x.slug} type="button" className="home-sites__item" data-on={i === siteIdx || undefined} onClick={() => setSiteIdx(i)}>
                  <span className="home-sites__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="home-sites__name">{x.name}</span>
                  <span className="home-sites__depth">{x.depth}</span>
                </button>
              ))}
            </div>
            <div className="home-sites__detail">
              <div className="home-sites__photo">
                <img src={site.photo} alt={`${site.name} photo`} />
              </div>
              <div className="home-sites__title">
                <div className="home-sites__titletext">
                  <div className="home-sites__type">{t(site.type)}</div>
                  <h3 className="home-sites__h3">{site.name}</h3>
                </div>
                <ButtonLink href={siteHref(site.slug)} variant="text" size="large" icon="arrow-right" iconPosition="suffix">
                  {t("Site guide")}
                </ButtonLink>
              </div>
              <div className="home-sites__facts">
                <Fact label="Depth" value={site.depth} />
                <Fact label="Level" value={t(site.level)} />
                <Fact label="Current" value={t(site.current)} />
              </div>
              <div className="home-sites__see">
                <span className="home-sites__see-label">{t("You'll see")}</span>
                {site.see.map((c) => (
                  <Tag key={c} icon="fish">
                    {t(c)}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 18 m · Safety stop */}
        <section id="b-stay" className="section">
          <div className="home-head home-head--stay">
            <div className="home-head__text">
              <Eyebrow>{t("18 m · Safety stop")}</Eyebrow>
              <h2 className="h2">{t("Come up slowly. We've got the rest.")}</h2>
            </div>
            <p className="home-stay__lead">{t("Every dive ends with a safety stop and a long surface interval. Tap an icon to see what waits for you on land and on deck.")}</p>
          </div>
          <div className="home-rest">
            {REST_CARDS.map((card, c) => {
              const f = card.facets[restIdx[c]];
              return (
                <article key={card.kicker} className="home-rest__card">
                  <div className="home-rest__photo">
                    <img src={LATEST[f.slot] ?? f.photo} alt={t(f.title)} />
                    <div className="home-rest__stat">
                      <span className="home-rest__stat-label">{t(f.statLabel)}</span>
                      <span className="home-rest__stat-value">{t(f.stat)}</span>
                    </div>
                  </div>
                  <div className="home-rest__body">
                    <div className="home-rest__kicker">{t(card.kicker)}</div>
                    <h3 className="home-rest__title">{t(f.title)}</h3>
                    <p className="home-rest__text">{t(f.text)}</p>
                    <div role="tablist" aria-label={t(card.kicker)} className="home-rest__tabs">
                      {card.facets.map((ft, j) => (
                        <Button
                          key={ft.label}
                          variant={j === restIdx[c] ? "primary" : "secondary"}
                          size="small"
                          icon={ft.icon}
                          aria-pressed={j === restIdx[c]}
                          onClick={() => setRestIdx((r) => r.map((v, k) => (k === c ? j : v)))}
                        >
                          {t(ft.label)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 21 m · Reviews */}
        <section id="b-reviews" className="section home-reviews">
          <div className="home-reviews__split">
            <div className="home-reviews__score">
              <Eyebrow>{t("21 m · Reviews")}</Eyebrow>
              <div className="home-reviews__big">4.9</div>
              <Rating value={4.9} />
              <div className="home-reviews__from">{t("From 180+ reviews on Google and TripAdvisor.")}</div>
              <div className="home-reviews__links">
                <a href={GOOGLE_REVIEWS} target="_blank" rel="noopener noreferrer">
                  {t("Google reviews")}
                </a>
                <a href={TRIPADVISOR} target="_blank" rel="noopener noreferrer">
                  {t("TripAdvisor reviews")}
                </a>
              </div>
            </div>
            <figure className="home-reviews__quote">
              <Icon name="quote" size={40} style={{ color: "var(--icon-primary)" }} />
              <blockquote>{t(rev.quote)}</blockquote>
              <figcaption className="home-reviews__cap">
                <AvatarWithText name={rev.name} meta={`${t(rev.country)} · ${t(rev.date)} · ${rev.source}`} size={48} />
                <div className="home-reviews__nav">
                  <span className="home-reviews__count">
                    {revIdx + 1} / {nRev}
                  </span>
                  <Button variant="secondary" size="large" icon="arrow-left" iconOnly aria-label={t("Previous review")} onClick={() => setRevIdx((revIdx + nRev - 1) % nRev)} />
                  <Button variant="secondary" size="large" icon="arrow-right" iconOnly aria-label={t("Next review")} onClick={() => setRevIdx((revIdx + 1) % nRev)} />
                </div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 27 m · FAQ */}
        <section id="b-faq" className="section">
          <div className="section-intro home-faq__intro">
            <Eyebrow>{t("27 m · FAQ")}</Eyebrow>
            <h2 className="h2">{t("Before you ask.")}</h2>
          </div>
          <div className="home-faq">
            {HOME.faqs.map((f) => (
              <div key={f.q} className="home-faq__item">
                <h3>{t(f.q)}</h3>
                <p>{t(f.a)}</p>
              </div>
            ))}
            <div className="home-faq__help">
              <Icon name="message-circle" size={28} style={{ color: "var(--icon-primary)" }} />
              <h3>{t("Something else?")}</h3>
              <p>{t("Message the dive shop. We usually reply within the hour, 7am to 9pm WITA.")}</p>
              <div>
                <ButtonLink href={waLink()} external variant="primary" size="large" icon="message-circle">
                  {t("Chat on WhatsApp")}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* 30 m · Book */}
        <section id="b-book" data-theme="dark" className="section home-book">
          <div className="home-book__split">
            <div className="home-book__intro">
              <Eyebrow onDark>{t("30 m · Book")}</Eyebrow>
              <h2 className="home-book__title">{t("Book your Alor dive.")}</h2>
              <p className="home-book__lead">{t("Three short steps. We confirm within 24 hours, then you pay a 30% deposit online.")}</p>
              <div className="home-book__quote">
                <Rating value={5} />
                <p>{t("“Safety is their top priority, hospitality is in their heart.”")}</p>
                <span>Dwi L · TripAdvisor · {t("Oct 2022")}</span>
              </div>
            </div>
            <div data-theme="light" className="home-form">
              <div className="home-form__steps">
                {["Choose", "Dates and group", "Confirm"].map((label, i) => {
                  const reached = step >= i + 1 || sent;
                  const done = step > i + 1 || sent;
                  return (
                    <button
                      key={label}
                      type="button"
                      className="home-form__step"
                      data-reached={reached || undefined}
                      onClick={() => !sent && i + 1 < step && setStep(i + 1)}
                    >
                      <span className="home-form__circle">{done ? <Icon name="check" size={16} /> : step === i + 1 ? i + 1 : null}</span>
                      {t(label)}
                    </button>
                  );
                })}
              </div>
              <div className="home-form__body">
                {!sent && step === 1 && (
                  <div className="home-form__stack">
                    {HOME.packages.map((p) => (
                      <button key={p.id} type="button" className="home-form__pick" data-on={p.id === pkg || undefined} onClick={() => setPkg(p.id)}>
                        <Icon name={p.id === pkg ? "circle-check" : "circle"} size={22} style={{ color: p.id === pkg ? "var(--icon-primary)" : "var(--icon-secondary)" }} />
                        <span className="home-form__pick-text">
                          <span className="home-form__pick-name">{t(p.name)}</span>
                          <span className="home-form__pick-meta">{t(p.meta)}</span>
                        </span>
                        <span className="home-form__pick-price">{main(p.idr)}</span>
                      </button>
                    ))}
                    <div className="home-form__end">
                      <Button variant="primary" size="large" icon="arrow-right" iconPosition="suffix" onClick={() => setStep(2)}>
                        {t("Continue")}
                      </Button>
                    </div>
                  </div>
                )}
                {!sent && step === 2 && (
                  <div className="home-form__grid">
                    <Input id="bk-date" label={t("Arrival date")} type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                    <Select id="bk-divers" label={t("Divers")} value={divers} onChange={(e) => setDivers(e.target.value)} options={DIVERS.map((d) => ({ value: d, label: t(d) }))} />
                    <Select id="bk-cert" label={t("Certification level")} value={cert} onChange={(e) => setCert(e.target.value)} options={CERTS.map((c) => ({ value: c, label: t(c) }))} />
                    <div className="home-form__cam">
                      <div className="tw-field__label">{t("Bringing a camera?")}</div>
                      <div className="home-form__cam-btns">
                        <Button variant={cam === "Yes" ? "primary" : "secondary"} size="small" icon="camera" onClick={() => setCam("Yes")}>
                          {t("Yes")}
                        </Button>
                        <Button variant={cam === "No" ? "primary" : "secondary"} size="small" onClick={() => setCam("No")}>
                          {t("No")}
                        </Button>
                      </div>
                    </div>
                    <Input id="bk-name" label={t("Name")} required placeholder={t("Your name")} value={name} onChange={(e) => setName(e.target.value)} />
                    <Input id="bk-contact" label={t("Email or WhatsApp")} required placeholder="you@email.com" value={contact} onChange={(e) => setContact(e.target.value)} />
                    <div className="home-form__nav">
                      <Button variant="secondary" size="large" icon="arrow-left" onClick={() => setStep(1)}>
                        {t("Back")}
                      </Button>
                      <Button variant="primary" size="large" icon="arrow-right" iconPosition="suffix" onClick={() => setStep(3)}>
                        {t("Review")}
                      </Button>
                    </div>
                  </div>
                )}
                {!sent && step === 3 && (
                  <div className="home-form__stack home-form__stack--24">
                    <div className="home-form__summary">
                      <SumRow label={t("Trip")} value={t(pk.name)} />
                      <SumRow label={t("Arrival")} value={date || t("Not set")} />
                      <SumRow label={t("Group")} value={`${t(divers)} · ${t(cert)}`} />
                      <SumRow label={t("Camera")} value={t(cam === "Yes" ? "Yes, bringing a camera" : "No camera")} />
                      <SumRow label={t("Estimate")} value={`${main(pk.idr)} × ${nDiv} = ${main(pk.idr * nDiv)}`} />
                      <div className="home-form__deposit">
                        <span>{t("Deposit (30%)")}</span>
                        <span>{main(Math.round(pk.idr * nDiv * 0.3))}</span>
                      </div>
                    </div>
                    <Alert>{t("You pay the deposit only after we confirm your dates.")}</Alert>
                    <div className="home-form__nav">
                      <Button variant="secondary" size="large" icon="arrow-left" onClick={() => setStep(2)}>
                        {t("Back")}
                      </Button>
                      <Button variant="primary" size="xlarge" onClick={() => setSent(true)}>
                        {t("Send enquiry")}
                      </Button>
                    </div>
                    <p className="home-form__fine">
                      {t("Free cancellation up to 30 days before arrival.")} <a href="#b-book">{t("Safety and cancellation policy")}</a>
                    </p>
                  </div>
                )}
                {sent && (
                  <div className="home-form__stack home-form__stack--24">
                    <Alert type="success" description={t("We reply by email or WhatsApp within 24 hours with your quote and a deposit link.")}>
                      {t("Enquiry sent")}
                    </Alert>
                    <div className="home-form__sent">
                      <ButtonLink href={waLink()} external variant="secondary" size="large" icon="message-circle">
                        {t("Chat on WhatsApp")}
                      </ButtonLink>
                      <Button
                        variant="text"
                        size="large"
                        onClick={() => {
                          setSent(false);
                          setStep(1);
                        }}
                      >
                        {t("Start again")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const { t } = useLang();
  return (
    <div className="home-sites__fact">
      <span className="home-sites__fact-label">{t(label)}</span>
      <span className="home-sites__fact-value">{value}</span>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="home-form__sumrow">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}


