"use client";

import Link from "next/link";
import type { CategoryContent, PostCardData } from "@/lib/cms/blog-cms-types";
import type { ContentHelpers } from "@/lib/cms/use-content";
import { dateLabel, postHref } from "@/lib/blog";
import { Dot, Icon } from "./ui";

/** A story card, used on the blog and under each story. */
export function PostCard({ post, h, categories, label }: { post: PostCardData; h: ContentHelpers; categories: CategoryContent[]; label: string }) {
  const { L, img, lang } = h;
  const title = L(post.title);
  const cover = img(post.cover, "(min-width: 1040px) 33vw, (min-width: 700px) 50vw, 100vw");
  const cat = categories.find((c) => c.slug === post.category);
  return (
    <Link href={postHref(post.slug)} className="post-card">
      <span className="post-card__media">{cover && <img src={cover.src} srcSet={cover.srcSet} sizes={cover.sizes} alt={title} loading="lazy" />}</span>
      <span className="post-card__meta">
        {cat && <span className="post-card__cat">{L(cat.name)}</span>}
        {cat && <Dot />}
        <span className="post-card__date">{dateLabel(post.date, lang)}</span>
      </span>
      <span className="post-card__title">{title}</span>
      <span className="post-card__excerpt">{L(post.excerpt)}</span>
      <span className="post-card__more">
        <span>{label}</span>
        <Icon name="arrow-right" size={16} />
      </span>
    </Link>
  );
}
