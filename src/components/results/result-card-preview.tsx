import { RadarChart } from "./radar-chart";
import { Logo, Wordmark } from "@/components/ui/logo";
import { CATEGORIES } from "@/lib/riasec";
import type { TestResult } from "@/lib/scoring";

/** Versión DOM de la tarjeta que también se exporta como PNG. */
export function ResultCardPreview({ result }: { result: TestResult }) {
  const accent = CATEGORIES[result.top[0]].color;
  const secondary = CATEGORIES[result.top[1]].color;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#070912] p-6 shadow-[0_50px_120px_-60px_rgba(0,0,0,1)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 55% at 12% 0%, ${accent}2e, transparent 62%), radial-gradient(100% 55% at 100% 35%, ${secondary}22, transparent 60%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black, transparent 78%)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <Wordmark className="text-[13px]" />
          </div>
          <span className="text-[8px] uppercase tracking-[0.22em] text-white/30">
            Test vocacional
          </span>
        </div>

        <div className="mt-7">
          <p
            className="text-[8px] uppercase tracking-[0.26em]"
            style={{ color: accent }}
          >
            Mi perfil vocacional
          </p>
          <h3 className="mt-2 text-[clamp(1.35rem,4.4vw,1.7rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
            {result.profile.title}
          </h3>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-white/45">
            {result.profile.essence}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-1">
          <RadarChart
            ranked={result.ranked}
            showLabels={false}
            className="w-[92%]"
          />
        </div>

        <div className="space-y-1.5">
          {result.careers.slice(0, 3).map((career) => (
            <div
              key={career.name}
              className="flex items-center justify-between gap-2 text-[10.5px]"
            >
              <span className="flex min-w-0 items-center gap-1.5 text-white/65">
                <span
                  className="h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORIES[career.category].color }}
                />
                <span className="truncate">{career.name}</span>
              </span>
              <span
                className="shrink-0 font-mono text-[9.5px]"
                style={{ color: CATEGORIES[career.category].color }}
              >
                {career.match}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[8px] uppercase tracking-[0.16em] text-white/25">
          <span>18 preguntas · 3 min</span>
          <span>voca</span>
        </div>
      </div>
    </div>
  );
}
