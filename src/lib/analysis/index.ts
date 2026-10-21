import { demoProvider } from "./demo-provider";
import type { AnalysisProvider } from "./types";

export * from "./types";

/**
 * The provider the app uses. Only the demo provider exists today. To connect a
 * real vision model, implement `AnalysisProvider` (for example by calling an
 * API route that holds the model credentials server-side) and return it here.
 */
export function getAnalysisProvider(): AnalysisProvider {
  return demoProvider;
}

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;
export const ACCEPTED_LABEL = "JPG, PNG, WebP or HEIC";
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

export function validateImage(file: File): string | null {
  const typeOk = (ACCEPTED_TYPES as readonly string[]).includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
  if (!typeOk) return `That file type isn't supported. Use ${ACCEPTED_LABEL}.`;
  if (file.size > MAX_FILE_BYTES) return "That image is larger than 10 MB. Try a smaller photo.";
  if (file.size === 0) return "That file is empty.";
  return null;
}
