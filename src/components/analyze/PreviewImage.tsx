"use client";

import { useState } from "react";
import { FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shows a local object-URL preview. Some browsers cannot decode HEIC/HEIF,
 * so on a decode error we fall back to a file-name placeholder.
 * Give it a `key` of the src so the error state resets when the file changes.
 */
export function PreviewImage({
  src,
  name,
  className,
  alt,
}: {
  src: string | null;
  name: string;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 bg-forest-800/60 p-6 text-center",
          className,
        )}
        role="img"
        aria-label={`Preview unavailable for ${name}`}
      >
        <FileImage className="h-8 w-8 text-ivory-100/45" aria-hidden="true" />
        <span className="max-w-full break-all font-mono text-xs text-ivory-100/60">{name}</span>
        <span className="text-xs text-ivory-100/45">This browser can&apos;t preview this format, but the file is ready.</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimisable remote image
    <img
      src={src}
      alt={alt ?? `Photo of your device (${name})`}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
      draggable={false}
    />
  );
}
