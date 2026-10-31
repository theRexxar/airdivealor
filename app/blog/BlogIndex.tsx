"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button, ButtonLink, Dot, Eyebrow } from "@/components/ui";
import { CATS, POSTS, dateLabel, postHref, readTime } from "@/lib/blog";
import type { CategoryKey } from "@/lib/blog-types";
import { useLang } from "@/lib/i18n";
import { SOCIAL, waLink } from "@/lib/site";

const PER_PAGE = 9;
type Filter = "all" | CategoryKey;

export function BlogIndex() {
  const { t, pick, lang } = useLang();
  const [cat, setCat] = useState<Filter>("all");
  const [page, setPage] = useState(0);

  // Posts are newest first. The newest fills the hero, so "All" lists the rest.
  const feat = POSTS[0];
  const list = cat === "all" ? POSTS.slice(1) : POSTS.filter((p) => p.cat === cat);
  const total = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const pg = Math.min(page, total - 1);
  const shown = list.slice(pg * PER_PAGE, pg * PER_PAGE + PER_PAGE);
  const filters: Filter[] = ["all", ...(Object.keys(CATS) as CategoryKey[]).filter((k) => POSTS.some((p) => p.cat === k))];

  const goPage = (n: number) => {
    setPage(n);
    const el = document.getElementById("stories");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };

  const featTitle = pick(feat.title, feat.titleId);

  return (
    <div className="page">
      <SiteHeader current="blog" />

      <section data-theme="dark" className="blog-hero">
        <img className="blog-hero__img" src={feat.cover} alt={featTitle} fetchPriority="high" />
        <div aria-hidden="true" className="blog-hero__shade" />
        <div className="blog-hero__body">
          <Eyebrow onDark>{t("Blog · Latest story")}</Eyebrow>
          <h1 className="blog-hero__title">{featTitle}</h1>
          <p className="blog-hero__excerpt">{pick(feat.excerpt, feat.excerptId)}</p>
          <div className="blog-hero__meta">
            <span className="blog-hero__cat">{pick(...CATS[feat.cat])}</span>
            <Dot light />
            <span>{dateLabel(feat.date, lang)}</span>
            <Dot light />
            <span>{readTime(feat, lang)}</span>
          </div>
          <div className="blog-hero__cta">
            <ButtonLink href={postHref(feat.slug)} variant="primary" size="xlarge" icon="arrow-right" iconPosition="suffix">
              {t("Read the story")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="stories" className="section stories">
        <div className="stories__head">
          <div className="stories__intro">
            <Eyebrow>{t("Stories")}</Eyebrow>
            <h2 className="h2">{t("Stories from Alor Kecil.")}</h2>
            <p className="lead">{t("News from the dive center, the reef and the village, written by our team.")}</p>
          </div>
          <div role="tablist" aria-label="Category" className="chips">
            {filters.map((k) => (
              <Button
                key={k}
                role="tab"
                aria-selected={k === cat}
                variant={k === cat ? "primary" : "secondary"}
                size="small"
                onClick={() => {
                  setCat(k);
                  setPage(0);
                }}
              >
                {k === "all" ? t("All") : pick(...CATS[k])}
              </Button>
            ))}
          </div>
        </div>

        <div className="card-grid">
          {shown.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>

        {list.length > PER_PAGE && (
          <nav aria-label={t("Pagination")} className="pager">
            <Button variant="secondary" icon="arrow-left" disabled={pg === 0} onClick={() => pg > 0 && goPage(pg - 1)}>
              {t("Previous")}
            </Button>
            <div className="pager__pages">
              {Array.from({ length: total }, (_, j) => (
                <Button
                  key={j}
                  variant={j === pg ? "primary" : "secondary"}
                  aria-label={`Page ${j + 1}`}
                  aria-current={j === pg ? "page" : undefined}
                  onClick={() => goPage(j)}
                >
                  {j + 1}
                </Button>
              ))}
            </div>
            <Button variant="secondary" icon="arrow-right" iconPosition="suffix" disabled={pg === total - 1} onClick={() => pg < total - 1 && goPage(pg + 1)}>
              {t("Next")}
            </Button>
          </nav>
        )}
      </section>

      <section className="section cta-band">
        <div className="cta-band__text">
          <h2 className="h2">{t("Follow our dives.")}</h2>
          <p className="lead">{t("More photos and videos from Alor, from our team and our guests.")}</p>
        </div>
        <div className="cta-band__actions">
          <ButtonLink href={SOCIAL.instagram} external variant="primary" size="xlarge" icon="instagram">
            {t("Follow on Instagram")}
          </ButtonLink>
          <ButtonLink href={waLink("Hi Air Dive Alor, I would like to plan a dive trip.")} external variant="secondary" size="xlarge" icon="message-circle">
            {t("Plan your dive")}
          </ButtonLink>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
