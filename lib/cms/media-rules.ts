/** Accepted upload types and size limits, shared by the upload form and the API. */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
/** Responsive WebP widths made from each image (never larger than the original). */
export const IMAGE_WIDTHS = [480, 960, 1600, 2400];
/** Web video: H.264 MP4, at most this wide. */
export const VIDEO_MAX_WIDTH = 1920;

export function kindFor(mime: string): "image" | "video" | null {
  if (IMAGE_TYPES.includes(mime)) return "image";
  if (VIDEO_TYPES.includes(mime)) return "video";
  return null;
}

export const humanSize = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
