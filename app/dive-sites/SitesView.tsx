"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Alert, Button, ButtonLink, Eyebrow, Icon, type IconName } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";
import { SITES, SITE_FILTERS, siteHref, siteNum, type SiteFilter } from "@/lib/sites";
import "./sites.css";

const PAGE = 9;

const HIGHLIGHTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "flower-2", title: "Healthy reefs", text: "Hard and soft coral cover most sites, from the shallows down the wall." },
  { icon: "mountain", title: "Walls, pinnacles and sand", text: "Steep walls, pinnacles that break the surface, overhangs and dark sandy bays." },
  { icon: "waves", title: "Currents, planned by tide", text: "The Pantar Strait moves a lot of water. We time each dive to the tide so the current works for you." },
  { icon: "fish", title: "Big fish, with luck", text: "Sharks, eagle rays and the odd thresher pass by. They are a bonus, never a promise." },
  { icon: "search", title: "Muck and macro", text: "Rhinopias, frogfish, pygmy seahorses and nudibranchs live in the bays." },
  { icon: "eye", title: "Clear water", text: "Most reef sites see 15 to 30 m. Bay sites are lower but full of small life." },
];

export function SitesView() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<SiteFilter>("all");
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(false);

  const test = SITE_FILTERS.find(([k]) => k === filter)![2];
  const all = SITES.map((s, i) => ({ s, i })).filter(({ s }) => test(s));
  const left = Math.max(0, all.length - shown);
  const id = lang === "ID";

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setShown((n) => n + PAGE);
      setLoading(false);
    }, 450);
  };

  return (
    <div className="page">
      <SiteHeader current="diveSites" />

      <section data-theme="dark" className="sites-hero">
        <img className="sites-hero__img" src="/sites/don-tupa.jpg" alt="Coral wall at Dinding Bama, Pantar" fetchPriority="high" />
        <div aria-hidden="true" className="sites-hero__shade" />
        <div className="sites-hero__body">
          <Eyebrow onDark>{t("Dive sites · Alor and Pantar")}</Eyebrow>
          <h1 className="sites-hero__title">{t("Pick a site. See what lives there.")}</h1>
          <p className="sites-hero__lead">{t("Walls, pinnacles, caverns and muck bays around Alor, Pantar and Pura. Open any site for its full guide.")}</p>
        </div>
      </section>

      <section className="sites-known">
        <div data-theme="light" className="sites-known__grid">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="sites-known__item">
              <Icon name={h.icon} size={26} style={{ color: "var(--icon-primary)" }} />
              <span className="sites-known__title">{t(h.title)}</span>
              <p>{t(h.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sites" className="sites-all">
        <div className="stories__head sites-all__head">
          <div className="sites-all__intro">
            <Eyebrow>{t("01 · All sites")}</Eyebrow>
            <h2 className="h2">{t("Our regular dive sites.")}</h2>
          </div>
          <div className="chips">
            {SITE_FILTERS.map(([k, label]) => (
              <Button
                key={k}
                variant={k === filter ? "primary" : "secondary"}
                size="small"
                onClick={() => {
                  setFilter(k);
                  setShown(PAGE);
                }}
              >
                {t(label)}
              </Button>
            ))}
          </div>
        </div>

        <div className="site-grid">
          {all.slice(0, shown).map(({ s, i }) => (
            <Link key={s.slug} href={siteHref(s.slug)} aria-label={`Open site guide: ${s.name}`} className="site-card">
              <div className="site-card__media">
                {s.photo ? (
                  <img src={s.photo} alt={s.name} loading="lazy" />
                ) : (
                  <div data-theme="dark" className="site-card__nophoto">
                    <Icon name="waves" size={32} style={{ color: "var(--primary-300)" }} />
                    <span>{t("Photo coming soon")}</span>
                  </div>
                )}
                <span className="site-card__num">{siteNum(i)}</span>
              </div>
              <div className="site-card__body">
                <span className="site-card__type">{t(s.type)}</span>
                <span className="site-card__name">{s.name}</span>
                <span className="site-card__area">
                  <Icon name="map-pin" size={15} />
                  {t(s.area || "Alor")}
                </span>
                <p className="site-card__intro">{t(s.intro)}</p>
              </div>
              <div className="site-card__facts">
                <Fact label="Depth" value={s.depth} />
                <Fact label="Level" value={s.level} />
                <Fact label="Current" value={s.current} />
              </div>
              <div className="site-card__more">
                <span>{t("Site guide")}</span>
                <Icon name="arrow-right" size={18} />
              </div>
            </Link>
          ))}
        </div>

        {left > 0 && (
          <div className="sites-more">
            <Button variant="secondary" size="large" icon="chevron-right" iconPosition="suffix" onClick={loadMore}>
              {id ? (loading ? "Memuat…" : `Muat ${Math.min(PAGE, left)} lagi`) : loading ? "Loading…" : `Load ${Math.min(PAGE, left)} more`}
            </Button>
            <span className="sites-more__count">
              {id
                ? `Menampilkan ${Math.min(shown, all.length)} dari ${all.length} titik`
                : `Showing ${Math.min(shown, all.length)} of ${all.length} sites`}
            </span>
          </div>
        )}
        <div data-theme="light" className="sites-note">
          <Alert>{t("We choose sites on the day, based on tide, current and weather. Each guide shows typical conditions, not a promise.")}</Alert>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band__text">
          <h2 className="h2">{t("Not sure which site suits you?")}</h2>
          <p className="lead">{t("Tell us your level and what you hope to see. We plan your dive days around the tide.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={waLink("Hi Air Dive Alor, which dive sites would suit me?")} external variant="primary" size="xlarge" icon="message-circle">
            {t("Ask on WhatsApp")}
          </ButtonLink>
          <ButtonLink href={ROUTES.prices} variant="secondary" size="xlarge" icon="arrow-right" iconPosition="suffix">
            {t("See prices")}
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const { t } = useLang();
  return (
    <div className="site-card__fact">
      <span className="site-card__fact-label">{t(label)}</span>
      <span className="site-card__fact-value">{value ? t(value) : "—"}</span>
    </div>
  );
}
