"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { BrainHalo } from "./brain-halo";
import type { BrainSceneProps } from "./brain-scene";

const BrainScene = dynamic(
  () => import("./brain-scene").then((module) => module.BrainScene),
  {
    ssr: false,
    loading: () => <BrainLoader />,
  },
);

/** Esqueleto mientras llega el chunk de three.js. */
export function BrainLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[min(64%,300px)]">
        <div className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(91,109,255,0.4),transparent_62%)] blur-2xl" />
        <div className="absolute inset-[16%] rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[30%] rounded-full border border-white/[0.05]" />
        {[0, 60, 120, 180, 240, 300].map((angle, index) => (
          <span
            key={angle}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white/40"
            style={{
              transform: `rotate(${angle}deg) translateY(-46%) translateX(-50%)`,
              opacity: 0.25 + (index % 3) * 0.15,
            }}
          />
        ))}
        <span className="absolute inset-x-0 -bottom-8 text-center text-[10px] uppercase tracking-[0.28em] text-white/30">
          Cargando
        </span>
      </div>
    </div>
  );
}

export function BrainView(props: BrainSceneProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative h-full w-full">
      {/* Halo de respaldo: también cubre equipos sin WebGL. */}
      <div className="absolute inset-0 -z-10">
        <BrainHalo />
      </div>

      <BrainScene {...props} reducedMotion={reducedMotion} />
    </div>
  );
}
