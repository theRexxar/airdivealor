"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, ButtonLink, Eyebrow, Icon, Tag, asIcon, type IconName } from "@/components/ui";
import { COURSES, DETAILS, bookCourseMsg, courseHref } from "@/lib/courses";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";
import "../courses.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function CourseDetailView({ id }: { id: string }) {
  const { t } = useLang();
  const i = COURSES.findIndex((c) => c.id === id);
  const c = COURSES[i];
  const x = DETAILS.courses[c.id];
  const N = COURSES.length;
  const prev = COURSES[(i + N - 1) % N];
  const next = COURSES[(i + 1) % N];
  const book = waLink(bookCourseMsg(c));

  const router = useRouter();
  // Escape goes back to the course list, like closing the prototype's detail view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.push(ROUTES.courses);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  useEffect(() => {
    document.title = `${t(c.name)} | Air Dive Alor`;
  }, [c.name, t]);

  const stats: { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar-days", label: "Duration", value: x.days },
    { icon: "waves", label: "Dives", value: x.dives },
    { icon: "arrow-down-to-line", label: "Max depth", value: x.depth },
    { icon: "user", label: "Minimum age", value: x.age },
  ];
  const incl = c.incl.map((item) => {
    const m = DETAILS.included[item];
    if (m) return { item, icon: asIcon(m[0]), d: m[1] };
    if (/certificate/i.test(item)) return { item, icon: "award" as IconName, d: DETAILS.certDetail };
    return { item, icon: "check" as IconName, d: "" };
  });
  const reqs: { icon: IconName; label: string; value: string }[] = [
    { icon: "badge-check", label: "Prerequisite", value: x.prereq },
    { icon: "user", label: "Minimum age", value: x.age },
    { icon: "stethoscope", label: "Medical", value: "Fill in the diver medical form. Some answers need a doctor's sign-off before you dive." },
    { icon: "shield-check", label: "Insurance", value: "Dive insurance is required for every course." },
    { icon: "plane", label: "Flying after", value: "No diving 24 hours before your flight out." },
  ];

  return (
    <div data-theme="dark" className="page course-detail">
      <div className="course-bar">
        <ButtonLink href={ROUTES.courses} variant="text" icon="arrow-left">
          {t("Back to courses")}
        </ButtonLink>
        <span className="course-bar__count">
          {pad(i + 1)} / {pad(N)}
        </span>
        <ButtonLink href={courseHref(prev.id)} variant="secondary" icon="arrow-left" iconOnly aria-label={t("Previous course")} />
        <ButtonLink href={courseHref(next.id)} variant="secondary" icon="arrow-right" iconOnly aria-label={t("Next course")} />
        <span className="wide-only">
          <ButtonLink href={book} external variant="primary" icon="message-circle">
            {t("Book course")}
          </ButtonLink>
        </span>
      </div>

      <section className="cd-hero">
        <img className="cd-hero__img" src={c.img} alt={t(c.name)} fetchPriority="high" />
        <div aria-hidden="true" className="cd-hero__shade" />
        <div className="cd-hero__body">
          <Eyebrow onDark>{`${t("Course")} · ${pad(i + 1)} · ${t(c.level)}`}</Eyebrow>
          <h1 className="cd-hero__title">{t(c.name)}</h1>
          <p className="cd-hero__lead">{t(c.text)}</p>
          <div className="cd-hero__price">
            <span className="cd-hero__amount">{c.price}</span>
            <span className="cd-hero__stay">{t(`${c.stay} · per person`)}</span>
          </div>
        </div>
      </section>

      <section className="cd-section">
        <SectionHead eyebrow="01 · At a glance" title="The course in four numbers." />
        <div className="cd-stats">
          {stats.map((st) => (
            <div key={st.label} className="cd-card">
              <Icon name={st.icon} size={24} style={{ color: "var(--primary-300)" }} />
              <span className="cd-caps">{t(st.label)}</span>
              <span className="cd-stats__value">{t(st.value)}</span>
            </div>
          ))}
        </div>
        <div className="cd-cert">
          <div className="cd-cert__agency">
            <span>{t("Certification")}</span>
            <Tag tone="primary" icon="badge-check">
              {c.id === "tdi" ? "TDI" : "SDI"}
            </Tag>
          </div>
          <span className="cd-cert__group">{t(x.group)}</span>
        </div>
      </section>

      <section className="cd-section cd-section--alt">
        <div className="cd-split">
          <div className="cd-split__narrow">
            <SectionHead eyebrow="02 · What's included" title="One price. Everything you need." inline />
            <p className="cd-lead">{t("The package price covers your training, stay, food and transfers. You only need to get to Alor.")}</p>
            <div className="cd-list">
              <span className="cd-caps cd-list__head">{t("Not included")}</span>
              {DETAILS.notIncluded.map((ni) => (
                <div key={ni} className="cd-list__row">
                  <Icon name="circle-x" size={18} style={{ color: "var(--text-secondary)", flex: "none" }} />
                  <span>{t(ni)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cd-split__wide cd-incl">
            {incl.map((it) => (
              <div key={it.item} className="cd-card cd-card--plain">
                <Icon name={it.icon} size={24} style={{ color: "var(--primary-300)" }} />
                <span className="cd-incl__title">{t(it.item)}</span>
                <span className="cd-incl__text">{t(it.d)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cd-section">
        <div className="cd-split">
          <div className="cd-split__narrow">
            <SectionHead eyebrow="03 · What you'll learn" title="Skills you take home." inline />
            <div className="cd-learn">
              {x.learn.map((ln, k) => (
                <div key={ln} className="cd-learn__row">
                  <span className="cd-learn__n">{pad(k + 1)}</span>
                  <span className="cd-learn__t">{t(ln)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="cd-split__wide cd-plan">
            <span className="cd-caps">{t("Course plan")}</span>
            {x.plan.map(([day, title, desc]) => (
              <div key={day + title} className="cd-plan__row">
                <span className="cd-plan__day">{t(day)}</span>
                <div className="cd-plan__text">
                  <span className="cd-plan__title">{t(title)}</span>
                  <span className="cd-plan__desc">{t(desc)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cd-section">
        <SectionHead eyebrow="04 · Requirements and safety" title="Before you sign up." />
        <div className="cd-split cd-split--reqs">
          <div className="cd-split__wide cd-reqs">
            {reqs.map((rq) => (
              <div key={rq.label} className="cd-reqs__row">
                <Icon name={rq.icon} size={20} style={{ color: "var(--primary-300)" }} />
                <span className="cd-reqs__label">{t(rq.label)}</span>
                <span className="cd-reqs__value">{t(rq.value)}</span>
              </div>
            ))}
          </div>
          <div className="cd-split__narrow cd-side">
            <div className="cd-card cd-tips">
              <span className="cd-caps">{t("Instructor tips")}</span>
              {x.tips.map((tp) => (
                <div key={tp} className="cd-tips__row">
                  <Icon name="circle-check" size={20} style={{ color: "var(--primary-300)", flex: "none" }} />
                  <span>{t(tp)}</span>
                </div>
              ))}
            </div>
            <div data-theme="light">
              <Alert>{t("Requirements follow SDI and TDI standards. Your instructor confirms your plan before the course starts.")}</Alert>
            </div>
          </div>
        </div>
      </section>

      <section className="cd-section cd-section--alt cd-cta">
        <div className="cd-cta__text">
          <h3 className="cd-cta__title">{t("Ready to start?")}</h3>
          <p className="cd-lead">{t("Send us your dates on WhatsApp. We reply within the hour, 7am to 9pm WITA.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={book} external variant="primary" size="xlarge" icon="message-circle">
            {t("Book this course")}
          </ButtonLink>
          <ButtonLink href={courseHref(next.id)} variant="secondary" size="xlarge" icon="arrow-right" iconPosition="suffix">
            {t(next.name)}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ eyebrow, title, inline }: { eyebrow: string; title: string; inline?: boolean }) {
  const { t } = useLang();
  return (
    <div className={inline ? "cd-head cd-head--inline" : "cd-head"}>
      <Eyebrow onDark>{t(eyebrow)}</Eyebrow>
      <h2 className="cd-head__title">{t(title)}</h2>
    </div>
  );
}
