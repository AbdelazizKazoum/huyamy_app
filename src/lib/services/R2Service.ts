import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// Configure the S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Uploads a single file to Cloudflare R2, compressing and converting to WebP.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export async function uploadImageToR2(file: File): Promise<string> {
  // Get the file content as a buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Compress and convert to WebP using sharp
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 80 }) // Adjust quality as needed
    .toBuffer();

  // Generate a unique key for the file with .webp extension
  const key = `${uuidv4()}.webp`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: webpBuffer,
    ContentType: "image/webp",
  });

  await s3Client.send(command);

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Uploads multiple files to Cloudflare R2 in parallel.
 * @param files An array of files to upload.
 * @returns An array of public URLs for the uploaded files.
 */
export async function uploadImagesToR2(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImageToR2(file));
  return Promise.all(uploadPromises);
}

/**
 * Deletes a single image from R2 using its full URL.
 * @param url The public URL of the image to delete.
 */
export async function deleteImageFromR2(url: string): Promise<void> {
  if (!url.startsWith(PUBLIC_URL)) {
    console.warn(
      `URL ${url} is not from the configured R2 bucket. Skipping delete.`
    );
    return;
  }
  const key = url.substring(PUBLIC_URL.length + 1);

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Deletes multiple images from R2 using their full URLs.
 * @param urls An array of public URLs of the images to delete.
 */
export async function deleteImagesFromR2(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  const objectsToDelete = urls
    .filter((url) => url.startsWith(PUBLIC_URL))
    .map((url) => ({ Key: url.substring(PUBLIC_URL.length + 1) }));

  if (objectsToDelete.length === 0) return;

  const command = new DeleteObjectsCommand({
    Bucket: BUCKET_NAME,
    Delete: {
      Objects: objectsToDelete,
    },
  });

  await s3Client.send(command);
}
