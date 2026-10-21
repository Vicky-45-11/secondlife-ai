"use client";

import { useId, useRef, useState, type DragEvent, type Ref } from "react";
import { CloudUpload, ImagePlus, RefreshCw, TriangleAlert, X } from "lucide-react";
import { ACCEPTED_LABEL, ACCEPTED_TYPES } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import { PreviewImage } from "./PreviewImage";
import { CornerBrackets, formatBytes } from "./shared";

const FOCUS_RING =
  "has-[input:focus]:outline has-[input:focus]:outline-2 has-[input:focus]:outline-offset-4 has-[input:focus]:outline-lime-500";

const ACCEPT_ATTR = [...ACCEPTED_TYPES, ".heic", ".heif"].join(",");

export function Dropzone({
  file,
  previewUrl,
  error,
  inputRef,
  onFile,
  onRemove,
}: {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  inputRef: Ref<HTMLInputElement>;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  const id = useId();
  const inputId = `${id}-file`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  const onDragEnter = (e: DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    depth.current += 1;
    setDragging(true);
  };
  const onDragOver = (e: DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = () => {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  const dragHandlers = { onDragEnter, onDragOver, onDragLeave, onDrop };

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={ACCEPT_ATTR}
      className="sr-only"
      aria-describedby={error ? `${hintId} ${errorId}` : hintId}
      aria-invalid={error ? true : undefined}
      onChange={(e) => {
        const picked = e.target.files?.[0];
        if (picked) onFile(picked);
        // Allow choosing the same file again after removing it.
        e.target.value = "";
      }}
    />
  );

  return (
    <div>
      {!file ? (
        <div
          {...dragHandlers}
          className={cn(
            "group relative flex aspect-[4/5] min-h-[22rem] w-full flex-col overflow-hidden rounded-2xl border border-dashed transition-colors duration-300 sm:aspect-[5/4] lg:aspect-[4/5]",
            FOCUS_RING,
            dragging
              ? "border-cyan-300 bg-cyan-500/[0.07]"
              : error
                ? "border-red-400/60 bg-forest-900/60"
                : "border-ivory-100/20 bg-forest-900/60 hover:border-ivory-100/40",
          )}
        >
          {input}
          <CornerBrackets className={dragging ? "border-cyan-300" : "border-ivory-100/30"} />
          <label
            htmlFor={inputId}
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-6 px-6 py-10 text-center"
          >
            <span
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full border transition-colors duration-300",
                dragging ? "border-cyan-300 text-cyan-300" : "border-ivory-100/20 text-ivory-100/70 group-hover:text-ivory-100",
              )}
              aria-hidden="true"
            >
              <CloudUpload className="h-7 w-7" />
            </span>
            <span className="block">
              <span className="display block text-[clamp(1.9rem,3.4vw,2.75rem)] text-ivory-50">
                {dragging ? "Drop it here" : "Drop a photo of the device"}
              </span>
              <span className="mt-3 block text-ivory-100/60">or</span>
            </span>
            <span className="inline-flex h-11 items-center gap-2 rounded-full border border-ivory-100/25 px-5 text-[0.95rem] font-medium text-ivory-100 transition-colors group-hover:border-ivory-100/60">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Choose a photo
            </span>
          </label>
          <p id={hintId} className="eyebrow border-t border-ivory-100/10 px-5 py-4 text-center text-ivory-100/45">
            {ACCEPTED_LABEL} · up to 10 MB
          </p>
        </div>
      ) : (
        <div
          {...dragHandlers}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-forest-900/70 transition-colors duration-300",
            FOCUS_RING,
            dragging ? "border-cyan-300" : "border-ivory-100/10",
          )}
        >
          {input}
          <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
            <PreviewImage key={previewUrl ?? "none"} src={previewUrl} name={file.name} />
            <CornerBrackets className="border-ivory-50/80" />
            {dragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-forest-950/80 backdrop-blur-sm">
                <span className="display text-3xl text-cyan-300">Drop to replace</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory-100/10 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ivory-50" title={file.name}>
                {file.name}
              </p>
              <p id={hintId} className="font-mono text-xs text-ivory-100/45">
                {formatBytes(file.size)} · ready to analyse
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor={inputId}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-ivory-100/25 px-3.5 text-sm text-ivory-100 transition-colors hover:border-ivory-100/60"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Replace
              </label>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ivory-100/70 transition-colors hover:bg-ivory-100/5 hover:text-ivory-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-[1.75rem] pt-2">
        {error && (
          <p id={errorId} role="alert" className="flex items-start gap-2 text-sm text-red-300">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
