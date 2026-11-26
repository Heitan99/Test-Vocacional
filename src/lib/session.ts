import { CATEGORY_IDS } from "./riasec";
import type { Answers, TestResult } from "./scoring";
import { resultFromAffinity } from "./scoring";

const RESULT_KEY = "voca:result:v1";
const PROGRESS_KEY = "voca:progress:v1";

export interface Progress {
  index: number;
  answers: Answers;
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento lleno o bloqueado: el test sigue funcionando */
  }
}

export function saveResult(result: TestResult) {
  write(RESULT_KEY, result);
}

export function loadResult(): TestResult | null {
  const result = read<TestResult>(RESULT_KEY);
  if (!result || !result.profile || !result.affinity) return null;
  return result;
}

export function saveProgress(progress: Progress) {
  write(PROGRESS_KEY, progress);
}

export function loadProgress(): Progress | null {
  const progress = read<Progress>(PROGRESS_KEY);
  if (!progress || typeof progress.index !== "number" || !progress.answers) {
    return null;
  }
  return progress;
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
}

export function clearResult() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESULT_KEY);
}

/* ------------------------------------------------------------------ */
/*  Enlaces compartibles: #p=IA&s=100.82.54.30.21.12                   */
/* ------------------------------------------------------------------ */

export function encodeShare(result: TestResult): string {
  const values = CATEGORY_IDS.map((id) => result.affinity[id]).join(".");
  const params = new URLSearchParams({
    p: result.profile.key,
    s: values,
  });
  return params.toString();
}

export function decodeShare(hash: string): TestResult | null {
  const clean = hash.replace(/^#/, "");
  if (!clean) return null;
  const params = new URLSearchParams(clean);
  const values = params.get("s");
  if (!values) return null;

  const parsed = values
    .split(".")
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));

  if (parsed.length !== CATEGORY_IDS.length) return null;
  if (parsed.every((value) => value <= 0)) return null;

  return resultFromAffinity(parsed);
}

export function shareUrl(result: TestResult): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/resultado#${encodeShare(result)}`;
}
