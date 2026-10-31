import { CreateBucketCommand, DeleteObjectsCommand, GetObjectCommand, HeadBucketCommand, HeadObjectCommand, PutBucketPolicyCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

const g = globalThis as unknown as { __adaS3?: S3Client; __adaS3Upload?: S3Client; __adaBucketReady?: Promise<void> };

/** S3 client for MinIO (path-style URLs). */
export const s3 = () =>
  (g.__adaS3 ??= new S3Client({
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    forcePathStyle: true,
    credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
  }));

/** Client used only to sign browser uploads, so the URL points at an address the browser can reach. */
const uploadClient = () =>
  env.S3_UPLOAD_ENDPOINT
    ? (g.__adaS3Upload ??= new S3Client({
        endpoint: env.S3_UPLOAD_ENDPOINT,
        region: env.S3_REGION,
        forcePathStyle: true,
        credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
      }))
    : s3();

/**
 * Bucket layout: `originals/` holds uploads as sent (private), `media/` holds processed files
 * (public read, so the website can link to them directly or through a CDN).
 */
export function ensureBucket(): Promise<void> {
  return (g.__adaBucketReady ??= (async () => {
    const c = s3();
    try {
      await c.send(new HeadBucketCommand({ Bucket: env.S3_BUCKET }));
    } catch {
      await c.send(new CreateBucketCommand({ Bucket: env.S3_BUCKET }));
    }
    await c.send(
      new PutBucketPolicyCommand({
        Bucket: env.S3_BUCKET,
        Policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [{ Effect: "Allow", Principal: { AWS: ["*"] }, Action: ["s3:GetObject"], Resource: [`arn:aws:s3:::${env.S3_BUCKET}/media/*`] }],
        }),
      }),
    );
  })().catch((e) => {
    g.__adaBucketReady = undefined;
    throw e;
  }));
}

/** Presigned URL the browser uses to upload the original file straight to MinIO (15 minutes). */
export async function presignUpload(key: string, contentType: string) {
  await ensureBucket();
  return getSignedUrl(uploadClient(), new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: contentType }), { expiresIn: 900 });
}

export async function headObject(key: string) {
  try {
    return await s3().send(new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  } catch {
    return null;
  }
}

export async function getObjectBytes(key: string): Promise<Uint8Array> {
  const r = await s3().send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  return r.Body!.transformToByteArray();
}

export async function putObject(key: string, body: Uint8Array | Buffer, contentType: string) {
  await s3().send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }));
}

export async function deleteObjects(keys: string[]) {
  if (!keys.length) return;
  await s3().send(new DeleteObjectsCommand({ Bucket: env.S3_BUCKET, Delete: { Objects: keys.map((Key) => ({ Key })) } }));
}

export const publicUrl = (key: string) => `${env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
