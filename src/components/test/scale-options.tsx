"use client";

import { cn } from "@/lib/utils";
import { SCALE } from "@/lib/questions";

interface ScaleOptionsProps {
  selected?: number;
  color: string;
  disabled?: boolean;
  onSelect: (value: number) => void;
}

export function ScaleOptions({
  selected,
  color,
  disabled,
  onSelect,
}: ScaleOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      {SCALE.map((option, index) => {
        const active = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            aria-pressed={active}
            className={cn(
              "group relative flex flex-col items-start justify-between gap-6 rounded-2xl border p-4 text-left transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              active
                ? "border-white/25 bg-white/[0.09]"
                : "border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.055]",
              "active:scale-[0.985] disabled:opacity-60",
            )}
            style={
              active
                ? {
                    borderColor: `${color}99`,
                    boxShadow: `0 18px 60px -32px ${color}`,
                  }
                : undefined
            }
          >
            <span className="flex w-full items-center justify-between">
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.18em] transition-colors",
                  active ? "text-white/70" : "text-white/25",
                )}
              >
                0{index + 1}
              </span>
              <span className="flex items-end gap-[3px]" aria-hidden="true">
                {[0, 1, 2, 3].map((bar) => {
                  const filled = bar <= option.value;
                  return (
                    <span
                      key={bar}
                      className="w-[3px] rounded-full transition-all duration-300"
                      style={{
                        height: 5 + bar * 3,
                        backgroundColor: filled
                          ? active
                            ? color
                            : "rgba(255,255,255,0.32)"
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  );
                })}
              </span>
            </span>

            <span className="flex flex-col gap-1">
              <span
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  active ? "text-white" : "text-white/80",
                )}
              >
                {option.label}
              </span>
              <span className="text-[11px] text-white/30">{option.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
