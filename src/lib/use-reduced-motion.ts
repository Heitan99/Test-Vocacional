"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

/** En el servidor asumimos movimiento normal; el cliente corrige al hidratar. */
function getServerSnapshot() {
  return false;
}

/** Lee `prefers-reduced-motion` con `useSyncExternalStore` para que no quede desincronizado al hidratar. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
