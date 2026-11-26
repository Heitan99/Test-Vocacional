"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { RankedCategory } from "@/lib/scoring";

const VIEW = 320;
const CENTER = VIEW / 2;
const RADIUS = 104;
const LABEL_RADIUS = 134;

function polar(index: number, total: number, value: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * value,
    y: CENTER + Math.sin(angle) * RADIUS * value,
    angle,
  };
}

function pathFor(values: number[]) {
  return (
    values
      .map((value, index) => {
        const { x, y } = polar(index, values.length, value);
        return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );
}

export function RadarChart({
  ranked,
  showLabels = true,
  className,
}: {
  ranked: RankedCategory[];
  showLabels?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const total = ranked.length;

  const values = ranked.map((item) => Math.max(0.04, item.value / 100));
  const dataPath = pathFor(values);

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      className={className}
      role="img"
      aria-label="Gráfico de afinidad por interés"
    >
      <defs>
        <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0%"
            stopColor={ranked[0]?.color ?? "#9b7bff"}
            stopOpacity="0.42"
          />
          <stop
            offset="100%"
            stopColor={ranked[1]?.color ?? "#38b6ff"}
            stopOpacity="0.12"
          />
        </linearGradient>
        <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={ranked[0]?.color ?? "#9b7bff"} />
          <stop offset="100%" stopColor={ranked[1]?.color ?? "#38b6ff"} />
        </linearGradient>
        <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rejilla */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={ranked
            .map((_, index) => {
              const { x, y } = polar(index, total, ring);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={ring === 1 ? 1 : 0.75}
        />
      ))}

      {ranked.map((item, index) => {
        const { x, y } = polar(index, total, 1);
        return (
          <line
            key={item.id}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.75"
          />
        );
      })}

      {/* Área de datos */}
      <motion.path
        d={dataPath}
        initial={reduced ? false : { opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        fill={`url(#fill-${uid})`}
        stroke={`url(#stroke-${uid})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
        filter={`url(#glow-${uid})`}
      />

      {/* Vértices */}
      {ranked.map((item, index) => {
        const { x, y } = polar(index, total, Math.max(0.04, item.value / 100));
        return (
          <motion.circle
            key={item.id}
            cx={x}
            cy={y}
            r="2.6"
            fill={item.color}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.06 }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
        );
      })}

      {showLabels &&
        ranked.map((item, index) => {
          const { x, y } = polar(index, total, LABEL_RADIUS / RADIUS);
          const anchor = "middle";
          const dy = y < CENTER - 6 ? -2 : y > CENTER + 6 ? 9 : 3;

          return (
            <g key={item.id}>
              <text
                x={x}
                y={y + dy}
                textAnchor={anchor}
                fill={item.color}
                fillOpacity="0.85"
                fontSize="9"
                letterSpacing="0.04em"
              >
                {item.name}
              </text>
              <text
                x={x}
                y={y + dy + 11}
                textAnchor={anchor}
                fill="rgba(255,255,255,0.35)"
                fontSize="8"
                letterSpacing="0.08em"
              >
                {item.value}%
              </text>
            </g>
          );
        })}
    </svg>
  );
}
