"use client";

import { useCallback, useEffect, useId, useReducer, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw, TriangleAlert } from "lucide-react";
import {
  getAnalysisProvider,
  validateImage,
  type AnalysisProgress,
  type AnalysisResult,
  type DeviceCategory,
  type DeviceCondition,
} from "@/lib/analysis";
import { addToHistory } from "@/lib/history";
import { Button } from "@/components/ui/Button";
import { AnalysisResults } from "./AnalysisResults";
import { Dropzone } from "./Dropzone";
import { CategoryPicker, ConditionPicker } from "./OptionPickers";
import { ScanningView } from "./ScanningView";
import { EASE } from "./shared";

const MAX_NOTES = 200;

type State =
  | { phase: "idle"; fileError: string | null }
  | { phase: "ready"; file: File }
  | { phase: "analyzing"; file: File; progress: AnalysisProgress | null }
  | { phase: "done"; file: File; result: AnalysisResult }
  | { phase: "error"; file: File; message: string };

type Action =
  | { type: "file-accepted"; file: File }
  | { type: "file-rejected"; message: string }
  | { type: "remove" }
  | { type: "start" }
  | { type: "progress"; progress: AnalysisProgress }
  | { type: "success"; result: AnalysisResult }
  | { type: "failure"; message: string }
  | { type: "cancel" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "file-accepted":
      return { phase: "ready", file: action.file };
    case "file-rejected":
      // Keep a previously accepted file; show the error only when there is none.
      return state.phase === "ready" ? state : { phase: "idle", fileError: action.message };
    case "remove":
    case "reset":
      return { phase: "idle", fileError: null };
    case "start":
      return state.phase === "ready" || state.phase === "error"
        ? { phase: "analyzing", file: state.file, progress: null }
        : state;
    case "progress":
      return state.phase === "analyzing" ? { ...state, progress: action.progress } : state;
    case "success":
      return state.phase === "analyzing" ? { phase: "done", file: state.file, result: action.result } : state;
    case "failure":
      return state.phase === "analyzing" ? { phase: "error", file: state.file, message: action.message } : state;
    case "cancel":
      return state.phase === "analyzing" ? { phase: "ready", file: state.file } : state;
  }
}

function isAbort(err: unknown) {
  return err instanceof DOMException && err.name === "AbortError";
}

export function AnalyzeExperience() {
  const reduce = useReducedMotion();
  const notesId = useId();
  const [state, dispatch] = useReducer(reducer, { phase: "idle", fileError: null });
  const [category, setCategory] = useState<DeviceCategory | "auto">("auto");
  const [condition, setCondition] = useState<DeviceCondition>("working");
  const [notes, setNotes] = useState("");
  // Replacement errors when a file is already loaded (the file itself stays).
  const [replaceError, setReplaceError] = useState<string | null>(null);

  const file = "file" in state ? state.file : null;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const focusDropzoneNext = useRef(false);

  // Object URL for the preview, revoked whenever the file changes or on unmount.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Abort any in-flight analysis on unmount.
  useEffect(() => () => controllerRef.current?.abort(), []);

  // Focus management. Views mount after the exit animation of the previous
  // one, so focus from callback refs when the element actually attaches.
  const setInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (el && focusDropzoneNext.current) {
        focusDropzoneNext.current = false;
        topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        el.focus({ preventScroll: true });
      }
    },
    [reduce],
  );

  const setResultHeadingRef = useCallback(
    (el: HTMLHeadingElement | null) => {
      if (!el) return;
      topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      el.focus({ preventScroll: true });
    },
    [reduce],
  );

  const handleFile = useCallback(
    (f: File) => {
      const error = validateImage(f);
      if (error) {
        if (state.phase === "ready") setReplaceError(error);
        dispatch({ type: "file-rejected", message: error });
        return;
      }
      setReplaceError(null);
      dispatch({ type: "file-accepted", file: f });
    },
    [state.phase],
  );

  const run = useCallback(
    async (f: File) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      dispatch({ type: "start" });
      try {
        const result = await getAnalysisProvider().analyze(
          { file: f, category, condition, description: notes.trim() },
          (p) => {
            if (!controller.signal.aborted) dispatch({ type: "progress", progress: p });
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        addToHistory(result);
        dispatch({ type: "success", result });
      } catch (err) {
        if (isAbort(err) || controller.signal.aborted) return;
        dispatch({
          type: "failure",
          message: err instanceof Error && err.message ? err.message : "Something went wrong while analysing.",
        });
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [category, condition, notes],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (state.phase === "ready") void run(state.file);
  };

  const cancel = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    dispatch({ type: "cancel" });
  };

  const reset = () => {
    controllerRef.current?.abort();
    focusDropzoneNext.current = true;
    setReplaceError(null);
    dispatch({ type: "reset" });
  };

  const view =
    state.phase === "analyzing" ? "analyzing" : state.phase === "done" ? "done" : state.phase === "error" ? "error" : "form";

  const fade = {
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    exit: reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.25 } },
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      <AnimatePresence mode="wait" initial={false}>
        {view === "form" && (
          <motion.form key="form" {...fade} onSubmit={onSubmit} noValidate aria-label="Analyse a device">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6 xl:col-span-7">
                <div className="lg:sticky lg:top-28">
                  <p className="mb-4 flex items-baseline gap-3">
                    <span className="eyebrow text-ivory-100/45">01</span>
                    <span className="text-lg text-ivory-50">Add a photo</span>
                  </p>
                  <Dropzone
                    file={file}
                    previewUrl={previewUrl}
                    error={state.phase === "idle" ? state.fileError : replaceError}
                    inputRef={setInputRef}
                    onFile={handleFile}
                    onRemove={() => {
                      setReplaceError(null);
                      dispatch({ type: "remove" });
                      requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                  />
                </div>
              </div>

              <div className="space-y-10 lg:col-span-6 xl:col-span-5">
                <CategoryPicker value={category} onChange={setCategory} />
                <ConditionPicker value={condition} onChange={setCondition} />

                <div>
                  <label htmlFor={notesId} className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="eyebrow text-ivory-100/45">04</span>
                    <span className="text-lg text-ivory-50">Anything else?</span>
                    <span className="text-sm text-ivory-100/45">Optional</span>
                  </label>
                  <textarea
                    id={notesId}
                    value={notes}
                    maxLength={MAX_NOTES}
                    rows={3}
                    onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES))}
                    placeholder="e.g. 2019 laptop, screen flickers, battery swollen"
                    aria-describedby={`${notesId}-count`}
                    className="block w-full resize-none rounded-xl border border-ivory-100/10 bg-forest-900/50 px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-100/30 focus:border-lime-500/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
                  />
                  <p
                    id={`${notesId}-count`}
                    className="mt-2 text-right font-mono text-xs tabular-nums text-ivory-100/45"
                    aria-live={notes.length >= MAX_NOTES - 20 ? "polite" : "off"}
                  >
                    {notes.length}/{MAX_NOTES}
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-ivory-100/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-ivory-100/50" id={`${notesId}-submit-hint`}>
                    {state.phase === "ready" ? "Ready when you are." : "Add a photo to continue."}
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={state.phase !== "ready"}
                    aria-describedby={`${notesId}-submit-hint`}
                    magnetic
                  >
                    Analyze device
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.form>
        )}

        {view === "analyzing" && state.phase === "analyzing" && (
          <motion.div key="analyzing" {...fade}>
            <ScanningView file={state.file} previewUrl={previewUrl} progress={state.progress} onCancel={cancel} />
          </motion.div>
        )}

        {view === "done" && state.phase === "done" && (
          <motion.div key="done" {...fade}>
            <AnalysisResults ref={setResultHeadingRef} result={state.result} previewUrl={previewUrl} onReset={reset} />
          </motion.div>
        )}

        {view === "error" && state.phase === "error" && (
          <motion.div key="error" {...fade} className="panel mx-auto max-w-2xl p-8 sm:p-10" role="alert">
            <TriangleAlert className="h-7 w-7 text-clay" aria-hidden="true" />
            <h2 className="display mt-5 text-[clamp(2rem,4vw,3rem)] text-ivory-50">The analysis didn&apos;t finish.</h2>
            <p className="mt-3 text-ivory-100/60">{state.message}</p>
            <p className="mt-1 text-sm text-ivory-100/45">Your photo and choices are still here.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => void run(state.file)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
              <Button variant="secondary" onClick={() => dispatch({ type: "file-accepted", file: state.file })}>
                Back to the form
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
