import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "pets");

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Local-disk storage: fine for local dev, but files won't survive a redeploy
// on most serverless hosts. Swap for real object storage (S3, Cloudinary, etc.)
// before shipping to production.
export async function savePetImage(file: File): Promise<string> {
  const extension = EXTENSION_BY_MIME[file.type] ?? "jpg";
  const filename = `${randomUUID()}.${extension}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/pets/${filename}`;
}
