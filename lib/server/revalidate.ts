import { revalidateTag } from "next/cache";
import { collectionTag, pageTag } from "@/lib/cms/tags";

/** Expire cached website content right away, so the next visitor sees the change. */
export function expirePage(slug: string) {
  revalidateTag(pageTag(slug), { expire: 0 });
}
export function expireCollection(key: string) {
  revalidateTag(collectionTag(key), { expire: 0 });
}
