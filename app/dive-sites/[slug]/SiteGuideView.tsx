"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, ButtonLink, Eyebrow, Icon, Tag, type IconName } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";
import { SITES, siteHref, siteNum } from "@/lib/sites";
import "../sites.css";
import "../../dive-courses/courses.css";

export function SiteGuideView({ slug }: { slug: string }) {
  const { t } = useLang();
  const router = useRouter();
  const i = SITES.findIndex((s) => s.slug === slug);
  const x = SITES[i];
  const N = SITES.length;
  const prev = SITES[(i + N - 1) % N];
  const next = SITES[(i + 1) % N];
  const book = waLink(`Hi Air Dive Alor, I would like to dive ${x.name}.`);

  // Escape goes back to the list, like closing the prototype's guide overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.push(ROUTES.diveSites);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  useEffect(() => {
    document.title = `${x.name} | Air Dive Alor`;
  }, [x.name]);

  const stats = ([
    { icon: "arrow-down-to-line", label: "Depth", value: x.depth },
    { icon: "wind", label: "Current", value: x.current },
    { icon: "eye", label: "Visibility", value: x.vis },
    { icon: "thermometer", label: "Water temp", value: x.temp },
  ] as { icon: IconName; label: string; value: string }[]).filter((s) => s.value);
  const access = ([
    { icon: "ship", label: "Boat time", value: x.access },
    { icon: "anchor", label: "Entry", value: x.entry },
    { icon: "badge-check", label: "Minimum level", value: x.minLevel },
    { icon: "triangle-alert", label: "Watch for", value: x.hazards },
    { icon: "clock", label: "Best time", value: x.best },
  ] as { icon: IconName; label: string; value: string }[]).filter((s) => s.value);
  const [about0, about1] = x.about ?? [];
  const hasStats = stats.length > 0 || !!x.level;
  const hasTopo = !!(x.topo || about0);
  const hasLife = !!(x.see.length || about1 || x.gallery.length);
  const hasAccess = access.length > 0 || x.tips.length > 0;

  return (
    <div data-theme="dark" className="page course-detail">
      <div className="course-bar">
        <ButtonLink href={ROUTES.diveSites} variant="text" icon="arrow-left">
          {t("All dive sites")}
        </ButtonLink>
        <span className="course-bar__count">
          {i + 1} / {N}
        </span>
        <ButtonLink href={siteHref(prev.slug)} variant="secondary" icon="arrow-left" iconOnly aria-label={t("Previous site")} />
        <ButtonLink href={siteHref(next.slug)} variant="secondary" icon="arrow-right" iconOnly aria-label={t("Next site")} />
        <span className="guide-wide-only">
          <ButtonLink href={book} external variant="primary">
            {t("Book this dive")}
          </ButtonLink>
        </span>
      </div>

      <section className="cd-hero">
        {x.photo && <img className="cd-hero__img" src={x.photo} alt={`${x.name} photo`} fetchPriority="high" style={{ background: "var(--neutral-800)" }} />}
        <div aria-hidden="true" className="cd-hero__shade" />
        <div className="cd-hero__body">
          <Eyebrow onDark>{`${t("Site guide")} · ${siteNum(i)} · ${t(x.type)}`}</Eyebrow>
          <h1 className="cd-hero__title">{x.name}</h1>
          {x.aka && (
            <div className="guide-aka">
              <span>{t("Also known as")}</span>: {x.aka}
            </div>
          )}
          <p className="cd-hero__lead">{t(x.intro)}</p>
          <div className="guide-loc">
            <Icon name="map-pin" size={18} style={{ color: "var(--primary-300)" }} />
            <span>{t("Location")}</span> · {t(x.area || "Alor")}
          </div>
          {x.draft && (
            <div className="guide-draft">
              <Icon name="info" size={16} style={{ color: "var(--primary-300)" }} />
              <span>{t("Notes compiled from public dive guides. Our team is still checking the details.")}</span>
            </div>
          )}
        </div>
      </section>

      {hasStats && (
        <section className="cd-section">
          <Head eyebrow="01 · Site conditions" title="Conditions on a normal day." />
          <div className="cd-stats">
            {stats.map((st) => (
              <div key={st.label} className="cd-card">
                <Icon name={st.icon} size={24} style={{ color: "var(--primary-300)" }} />
                <span className="cd-caps">{t(st.label)}</span>
                <span className="guide-stat">{t(st.value)}</span>
              </div>
            ))}
          </div>
          <div className="cd-cert">
            <div className="cd-cert__agency">
              <span>{t("Recommended level")}</span>
              <Tag tone="primary" icon="badge-check">
                {t(x.level || "Ask us")}
              </Tag>
            </div>
            <span className="cd-cert__group">{t("Times, visibility and temperature are typical ranges, not a promise.")}</span>
          </div>
        </section>
      )}

      {hasTopo && (
        <section className="cd-section">
          <div className="cd-split">
            <div className="cd-split__narrow guide-gap16">
              <Head eyebrow="02 · Topography and dive type" title="What the reef looks like." inline />
            </div>
            <div className="cd-split__wide guide-topo">
              <p className="guide-topo__lead">{t(x.topo)}</p>
              <div className="guide-types">
                <span className="cd-caps">{t("Dive type")}</span>
                {x.diveTypes.map((dt) => (
                  <Tag key={dt} icon="waves">
                    {t(dt)}
                  </Tag>
                ))}
              </div>
              {about0 && <p className="cd-lead">{t(about0)}</p>}
            </div>
          </div>
        </section>
      )}

      {hasLife && (
        <section className="cd-section cd-section--alt">
          <div className="cd-split">
            <div className="cd-split__narrow">
              <Head eyebrow="03 · Marine life" title="What lives here." inline />
              {about1 && <p className="cd-lead">{t(about1)}</p>}
              <div className="cd-list">
                <span className="cd-caps cd-list__head">{t("Look out for")}</span>
                {x.see.map((sp, k) => (
                  <div key={sp} className="cd-list__row">
                    <span className="cd-learn__n">{siteNum(k)}</span>
                    <span className="guide-see">{t(sp)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cd-split__wide guide-gallery">
              {x.gallery.map((src, k) => (
                <div key={src} className="guide-gallery__item">
                  <img src={src} alt={`${x.name} photo ${k + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasAccess && (
        <section className="cd-section">
          <Head eyebrow="04 · Access and safety" title="Getting there and staying safe." />
          <div className="cd-split cd-split--reqs">
            <div className="cd-split__wide cd-reqs">
              {access.map((ac) => (
                <div key={ac.label} className="cd-reqs__row">
                  <Icon name={ac.icon} size={20} style={{ color: "var(--primary-300)" }} />
                  <span className="cd-reqs__label">{t(ac.label)}</span>
                  <span className="cd-reqs__value">{t(ac.value)}</span>
                </div>
              ))}
            </div>
            <div className="cd-split__narrow cd-side">
              {x.tips.length > 0 && (
                <div className="cd-card cd-tips">
                  <span className="cd-caps">{t("Guide tips")}</span>
                  {x.tips.map((tp) => (
                    <div key={tp} className="cd-tips__row">
                      <Icon name="circle-check" size={20} style={{ color: "var(--primary-300)", flex: "none" }} />
                      <span>{t(tp)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div data-theme="light">
                <Alert>{t("Conditions change with the tide. Your guide checks the current on the day and may switch sites to keep the dive safe.")}</Alert>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="cd-section cd-section--alt cd-cta">
        <div className="cd-cta__text">
          <h3 className="cd-cta__title">{t("Dive this site with us")}</h3>
          <p className="cd-lead">{t("Add it to your trip and we plan the day around the tide.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={book} external variant="primary" size="xlarge">
            {t("Book this dive")}
          </ButtonLink>
          <ButtonLink href={siteHref(next.slug)} variant="secondary" size="xlarge" icon="arrow-right" iconPosition="suffix">
            {next.name}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}

function Head({ eyebrow, title, inline }: { eyebrow: string; title: string; inline?: boolean }) {
  const { t } = useLang();
  return (
    <div className={inline ? "cd-head cd-head--inline" : "cd-head"}>
      <Eyebrow onDark>{t(eyebrow)}</Eyebrow>
      <h2 className="cd-head__title">{t(title)}</h2>
    </div>
  );
}
