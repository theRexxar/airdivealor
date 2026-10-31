"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/PostCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Button, ButtonLink, Dot, Icon } from "@/components/ui";
import { CATS, POSTS, bodyOf, dateLabel, postHref, readTime, type Block, type Post } from "@/lib/blog";
import { useLang } from "@/lib/i18n";
import { ROUTES, waLink } from "@/lib/site";

export function PostView({ slug }: { slug: string }) {
  const { t, pick, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const i = POSTS.findIndex((p) => p.slug === slug);
  const p = POSTS[i];
  const newer = POSTS[i - 1];
  const older = POSTS[i + 1];
  const others = POSTS.filter((x) => x !== p);
  const more = others.filter((x) => x.cat === p.cat).concat(others.filter((x) => x.cat !== p.cat)).slice(0, 3);
  const title = pick(p.title, p.titleId);

  useEffect(() => {
    document.title = `${title} | Air Dive Alor`;
  }, [title]);

  const shareWA = () => window.open("https://api.whatsapp.com/send/?text=" + encodeURIComponent(p.title + " " + window.location.href), "_blank", "noopener");
  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  const copyLabel = t(copied ? "Link copied" : "Copy link");

  return (
    <div className="page">
      <SiteHeader current="blog" />

      <article>
        <section className="post-head">
          <div className="post-head__inner">
            <nav aria-label={t("Breadcrumb")} className="breadcrumb">
              <Link href={ROUTES.blog}>Blog</Link>
              <Icon name="chevron-right" size={14} style={{ color: "var(--neutral-500)" }} />
              <span>{pick(...CATS[p.cat])}</span>
            </nav>
            <h1 className="post-head__title">{title}</h1>
            <p className="post-head__excerpt">{pick(p.excerpt, p.excerptId)}</p>
            <div className="post-head__byline">
              <div className="byline">
                <span aria-hidden="true" className="byline__avatar">{p.author[2]}</span>
                <span className="byline__text">
                  <span className="byline__name">{pick(p.author[0], p.author[1])}</span>
                  <span className="byline__meta">
                    <span>{dateLabel(p.date, lang)}</span>
                    <Dot />
                    <span>{readTime(p, lang)}</span>
                  </span>
                </span>
              </div>
              <div className="share">
                <Button variant="secondary" icon="message-circle" iconOnly aria-label={t("Share on WhatsApp")} onClick={shareWA} />
                <Button variant="secondary" icon="link" onClick={copyLink}>{copyLabel}</Button>
              </div>
            </div>
          </div>
        </section>

        <div className="post-cover">
          <div className="post-cover__frame">
            <img src={p.cover} alt={title} fetchPriority="high" />
          </div>
        </div>

        <section className="post-body">
          <div className="post-body__inner">
            {bodyOf(p).map((b, k) => (
              <BodyBlock key={k} block={b} post={p} />
            ))}

            <div className="share-row">
              <span className="share-row__title">{t("Share this story")}</span>
              <div className="share">
                <Button variant="secondary" icon="message-circle" onClick={shareWA}>WhatsApp</Button>
                <Button variant="secondary" icon="link" onClick={copyLink}>{copyLabel}</Button>
              </div>
            </div>

            <div className="adjacent">
              {newer && <AdjacentLink post={newer} dir="newer" />}
              {older && <AdjacentLink post={older} dir="older" />}
            </div>

            <div data-theme="dark" className="post-cta">
              <span className="post-cta__title">{t("Want to see it for yourself?")}</span>
              <p>{t("Tell us your dates. We will plan the dives and the stay.")}</p>
              <ButtonLink href={waLink(`Hi Air Dive Alor, I read "${p.title}" and would like to plan a dive trip.`)} external variant="primary" size="large" icon="message-circle">
                {t("Plan your dive")}
              </ButtonLink>
            </div>
          </div>
        </section>
      </article>

      <section className="section more-stories">
        <div className="more-stories__head">
          <h2 className="h2">{t("More stories")}</h2>
          <ButtonLink href={ROUTES.blog} variant="secondary" size="large" icon="arrow-right" iconPosition="suffix">
            {t("See all stories")}
          </ButtonLink>
        </div>
        <div className="card-grid">
          {more.map((x) => (
            <PostCard key={x.slug} post={x} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function AdjacentLink({ post, dir }: { post: Post; dir: "newer" | "older" }) {
  const { t, pick } = useLang();
  return (
    <Link href={postHref(post.slug)} className="adjacent__link">
      <span className="adjacent__thumb">
        <img src={post.cover} alt="" loading="lazy" />
      </span>
      <span className="adjacent__text">
        <span className="adjacent__label">
          {dir === "newer" && <Icon name="arrow-left" size={14} />}
          <span>{t(dir === "newer" ? "Newer story" : "Older story")}</span>
          {dir === "older" && <Icon name="arrow-right" size={14} />}
        </span>
        <span className="adjacent__title">{pick(post.title, post.titleId)}</span>
      </span>
    </Link>
  );
}

function BodyBlock({ block: b, post }: { block: Block; post: Post }) {
  const { t, pick } = useLang();
  const fallbackAlt = pick(post.title, post.titleId);
  switch (b.t) {
    case "p":
      return <p className="prose-p">{pick(b.en, b.id)}</p>;
    case "h":
      return <h2 className="prose-h">{pick(b.en, b.id)}</h2>;
    case "img": {
      const cap = b.en ? pick(b.en, b.id) : "";
      return (
        <figure className="prose-figure">
          <span className="prose-figure__frame">
            <img src={b.src} alt={cap || fallbackAlt} loading="lazy" />
          </span>
          {cap && <figcaption>{cap}</figcaption>}
        </figure>
      );
    }
    case "gallery":
      return (
        <div className="prose-gallery">
          {b.items.map((g) => {
            const cap = g.en ? pick(g.en, g.id) : "";
            return (
              <figure key={g.src}>
                <span className="prose-gallery__frame">
                  <img src={g.src} alt={cap || fallbackAlt} loading="lazy" />
                </span>
                {cap && <figcaption>{cap}</figcaption>}
              </figure>
            );
          })}
        </div>
      );
    case "list":
      return (
        <ul className="prose-list">
          {b.items.map(([en, id]) => (
            <li key={en}>
              <Icon name="circle-check" size={20} style={{ color: "var(--icon-primary)", flex: "none", marginTop: 2 }} />
              <span>{pick(en, id)}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="prose-quote">
          <Icon name="quote" size={28} style={{ color: "var(--icon-primary)" }} />
          <p>{pick(b.en, b.id)}</p>
          <span className="prose-quote__cite">{b.cite}</span>
        </blockquote>
      );
    case "facts":
      return (
        <dl className="prose-facts">
          {b.items.map(([le, li, ve, vi]) => (
            <div key={le}>
              <dt>{pick(le, li)}</dt>
              <dd>{pick(ve, vi)}</dd>
            </div>
          ))}
        </dl>
      );
    case "link":
      return (
        <div className="prose-link">
          <ButtonLink href={b.href} variant="secondary" size="large" icon="arrow-right" iconPosition="suffix">
            {pick(b.en, b.id)}
          </ButtonLink>
        </div>
      );
    case "source":
      return (
        <div className="prose-source">
          <span>{t("We are still moving this story from our old blog.")}</span>
          <a href={b.href} target="_blank" rel="noopener noreferrer">
            <span>{t("Read the full story on airdivealor.com")}</span>
            <Icon name="external-link" size={16} />
          </a>
        </div>
      );
  }
}
