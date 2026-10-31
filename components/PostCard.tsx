"use client";

import Link from "next/link";
import { CATS, dateLabel, postHref, type Post } from "@/lib/blog";
import { useLang } from "@/lib/i18n";
import { Dot, Icon } from "./ui";

export function PostCard({ post }: { post: Post }) {
  const { t, pick, lang } = useLang();
  const title = pick(post.title, post.titleId);
  return (
    <Link href={postHref(post.slug)} className="post-card">
      <span className="post-card__media">
        <img src={post.cover} alt={title} loading="lazy" />
      </span>
      <span className="post-card__meta">
        <span className="post-card__cat">{pick(...CATS[post.cat])}</span>
        <Dot />
        <span className="post-card__date">{dateLabel(post.date, lang)}</span>
      </span>
      <span className="post-card__title">{title}</span>
      <span className="post-card__excerpt">{pick(post.excerpt, post.excerptId)}</span>
      <span className="post-card__more">
        <span>{t("Read story")}</span>
        <Icon name="arrow-right" size={16} />
      </span>
    </Link>
  );
}
