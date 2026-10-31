/** Cache tags shared by the website (fetch) and the CMS (revalidateTag on publish). */
export const pageTag = (slug: string) => `cms:page:${slug}`;
export const collectionTag = (key: string) => `cms:collection:${key}`;
