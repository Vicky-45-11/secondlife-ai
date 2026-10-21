"use client";

import { useSyncExternalStore } from "react";
import type { AnalysisResult } from "@/lib/analysis/types";

/**
 * Analysis history kept in this browser only (localStorage). Nothing is sent
 * to a server. useSyncExternalStore keeps server and first client render in
 * agreement (empty), so there is no hydration mismatch.
 */

const KEY = "secondlife:history:v1";
const MAX = 50;
const EMPTY: AnalysisResult[] = [];

let cache: AnalysisResult[] | null = null;
const listeners = new Set<() => void>();

function read(): AnalysisResult[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as AnalysisResult[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: AnalysisResult[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: history still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useHistory(): AnalysisResult[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToHistory(result: AnalysisResult) {
  write([result, ...read().filter((r) => r.id !== result.id)].slice(0, MAX));
}

export function removeFromHistory(id: string) {
  write(read().filter((r) => r.id !== id));
}

export function clearHistory() {
  write([]);
}
