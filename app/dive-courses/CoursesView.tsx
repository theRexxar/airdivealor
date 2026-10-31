"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button, ButtonLink, Eyebrow, Tag } from "@/components/ui";
import { COURSES, LEVELS, bookCourseMsg, courseHref } from "@/lib/courses";
import { useLang } from "@/lib/i18n";
import { waLink } from "@/lib/site";
import "./courses.css";

export function CoursesView() {
  const { t } = useLang();
  const [filter, setFilter] = useState<(typeof LEVELS)[number]>("All");
  const shown = filter === "All" ? COURSES : COURSES.filter((c) => c.level === filter);

  return (
    <div className="page">
      <SiteHeader current="courses" />

      <section data-theme="dark" className="courses-hero">
        <div className="courses-hero__text">
          <Eyebrow onDark>{t("Dive courses · SDI and TDI")}</Eyebrow>
          <h1 className="courses-hero__title">{t("Learn to dive in Alor.")}</h1>
          <p className="courses-hero__lead">
            {t("From your first breath underwater to Divemaster. Every package includes your stay, three meals a day, gear and airport transfers. Ask us about group rates with a private boat.")}
          </p>
        </div>
        <div className="courses-hero__logos">
          <img src="https://airdivealor.com/public/img/sdi-logo-new.png" alt="SDI certified" />
          <img src="https://airdivealor.com/public/img/TDI-Logo.png" alt="TDI certified" />
        </div>
      </section>

      <section className="courses-list">
        <div role="tablist" aria-label={t("Course level")} className="chips courses-list__filters">
          {LEVELS.map((l) => (
            <Button key={l} variant={l === filter ? "primary" : "secondary"} size="small" aria-pressed={l === filter} onClick={() => setFilter(l)}>
              {t(l)}
            </Button>
          ))}
        </div>
        <div className="courses-grid">
          {shown.map((c) => (
            <article key={c.id} className="course-card">
              <Link href={courseHref(c.id)} className="course-card__media" tabIndex={-1}>
                <img src={c.img} alt={t(c.name)} loading="lazy" />
                <span className="course-card__tag">
                  <Tag tone="primary">{t(c.level)}</Tag>
                </span>
              </Link>
              <div className="course-card__body">
                <h2 className="course-card__name">{t(c.name)}</h2>
                <div className="course-card__price">
                  <span className="course-card__amount">{c.price}</span>
                  <span className="course-card__meta">{t(`${c.stay} · ${c.dives}`)}</span>
                </div>
                <p className="course-card__text">{t(c.text)}</p>
                <div className="course-card__actions">
                  <ButtonLink href={courseHref(c.id)} variant="text" icon="arrow-right" iconPosition="suffix">
                    {t("What's included")}
                  </ButtonLink>
                  <ButtonLink href={waLink(bookCourseMsg(c))} external variant="primary" icon="message-circle">
                    {t("Book now")}
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section data-theme="dark" className="cta-band cta-band--dark">
        <div className="cta-band__text">
          <h2 className="h2">{t("Coming as a group?")}</h2>
          <p className="lead">{t("Contact us for a special group rate and dive with your own private boat. We reply within the hour, 7am to 9pm WITA.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={waLink("Hi Air Dive Alor, we are a group and would like a special rate for a dive course.")} external variant="primary" size="xlarge" icon="message-circle">
            {t("Chat on WhatsApp")}
          </ButtonLink>
          <ButtonLink href={waLink()} external variant="secondary" size="xlarge" icon="phone">
            +62 813-9550-5313
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
