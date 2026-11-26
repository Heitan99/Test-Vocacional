"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  RotateCcw,
  Share2,
} from "lucide-react";
import { BrainView } from "@/components/brain/brain-view";
import type { BrainPulse } from "@/components/brain/brain-scene";
import { RadarChart } from "@/components/results/radar-chart";
import { ResultCardPreview } from "@/components/results/result-card-preview";
import { ActionButton } from "@/components/ui/action-button";
import { Backdrop } from "@/components/ui/backdrop";
import { Logo, Wordmark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/riasec";
import { resultFromAffinity, type TestResult } from "@/lib/scoring";
import {
  clearProgress,
  clearResult,
  decodeShare,
  loadResult,
  shareUrl,
} from "@/lib/session";
import { downloadShareCard, shareResultCard } from "@/lib/share-card";

function levelsFrom(result: TestResult | null): Record<CategoryId, number> {
  return CATEGORY_IDS.reduce(
    (acc, id) => {
      // Curva perceptual: el dominante llega a 1 y los bajos se apagan.
      const value = result ? result.affinity[id] / 100 : 0;
      acc[id] = Math.min(1, Math.pow(value, 1.7));
      return acc;
    },
    {} as Record<CategoryId, number>,
  );
}

export default function ResultadoPage() {
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">(
    "loading",
  );
  const [isShared, setIsShared] = useState(false);
  const [pulse, setPulse] = useState<BrainPulse | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<null | "download" | "share">(null);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo({ top: 0 });

    const fromHash = decodeShare(window.location.hash);
    if (fromHash) {
      setResult(fromHash);
      setIsShared(true);
      setStatus("ready");
      return;
    }

    const stored = loadResult();
    if (stored) {
      setResult(stored);
      setStatus("ready");
      return;
    }

    const id = new URLSearchParams(window.location.search).get("r");
    if (!id) {
      setStatus("empty");
      return;
    }

    fetch(`/api/results?id=${encodeURIComponent(id)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled) return;
        const affinity = data?.result?.affinity;
        if (!affinity) {
          setStatus("empty");
          return;
        }
        const values = CATEGORY_IDS.map((key) => Number(affinity[key] ?? 0));
        setResult(resultFromAffinity(values));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("empty");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!result) return;
    const timer = window.setTimeout(() => {
      setPulse({ category: result.top[0], nonce: 1 });
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [result]);

  const levels = useMemo(() => levelsFrom(result), [result]);
  const accent = result ? CATEGORIES[result.top[0]].color : "#9b7bff";

  const handleDownload = async () => {
    if (!result || busy) return;
    setBusy("download");
    try {
      await downloadShareCard(result);
    } finally {
      setBusy(null);
    }
  };

  const handleShare = async () => {
    if (!result || busy) return;
    setBusy("share");
    try {
      await shareResultCard(result);
    } finally {
      setBusy(null);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(shareUrl(result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard bloqueado */
    }
  };

  const restart = () => {
    clearProgress();
    if (!isShared) clearResult();
    router.push("/test");
  };

  if (status === "loading") {
    return (
      <div className="relative flex min-h-svh items-center justify-center">
        <Backdrop />
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-10 w-10 animate-pulse" />
          <p className="eyebrow">Preparando tu perfil</p>
        </div>
      </div>
    );
  }

  if (status === "empty" || !result) {
    return (
      <div className="relative flex min-h-svh flex-col">
        <Backdrop />
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <Wordmark />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-5 pb-20">
          <div className="glass max-w-md rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-medium text-white">
              Todavía no hay resultados
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              Respondé las 18 preguntas y en tres minutos vas a tener tu perfil
              vocacional completo.
            </p>
            <div className="mt-7 flex justify-center">
              <Link href="/test">
                <ActionButton size="lg">
                  Hacer el test
                  <ArrowRight size={16} />
                </ActionButton>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const topCategory = CATEGORIES[result.top[0]];
  const secondCategory = CATEGORIES[result.top[1]];

  return (
    <div className="relative min-h-svh overflow-hidden">
      <Backdrop />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Logo />
          <Wordmark />
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 px-3.5 text-[12px] text-white/55 transition-colors hover:border-white/25 hover:text-white"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
          <button
            type="button"
            onClick={restart}
            className="hidden text-[12px] text-white/35 transition-colors hover:text-white sm:block"
          >
            {isShared ? "Hacer mi test" : "Nuevo test"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-5 pt-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:pt-2">
        <div>
          <Reveal y={14}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/45">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: accent,
                  boxShadow: `0 0 10px 2px ${accent}80`,
                }}
              />
              {isShared ? "Perfil compartido" : "Tu perfil vocacional"}
            </div>
          </Reveal>

          <Reveal delay={0.06} y={18}>
            <h1 className="font-display mt-5 text-[clamp(2.5rem,5.6vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-white">
              {result.profile.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 max-w-[40ch] text-[17px] leading-snug text-white/60">
              {result.profile.essence}
            </p>
            <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-white/40">
              {result.profile.description}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {[topCategory, secondCategory].map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px]"
                  style={{
                    borderColor: `${category.color}40`,
                    backgroundColor: `${category.color}14`,
                    color: category.color,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name} · {result.affinity[category.id]}%
                </span>
              ))}
              {result.profile.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/40"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ActionButton onClick={handleShare} disabled={busy !== null}>
                <Share2 size={16} />
                {busy === "share" ? "Generando…" : "Compartir tarjeta"}
              </ActionButton>
              <ActionButton
                variant="glass"
                onClick={handleDownload}
                disabled={busy !== null}
              >
                <Download size={16} />
                {busy === "download" ? "Generando…" : "Descargar PNG"}
              </ActionButton>
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[13px] text-white/40 transition-colors hover:text-white"
              >
                <RotateCcw size={14} />
                Repetir
              </button>
            </div>
          </Reveal>

          {result.balanced && (
            <Reveal delay={0.3}>
              <p className="mt-5 max-w-[46ch] text-[12px] leading-relaxed text-white/30">
                Tu perfil es bastante equilibrado: no hay un interés que se
                imponga con claridad. Eso abre más caminos, no menos.
              </p>
            </Reveal>
          )}
        </div>

        <div className="relative h-[34svh] min-h-[220px] sm:h-[42svh] lg:h-[56vh]">
          <BrainView levels={levels} reveal pulse={pulse} interactive />
        </div>
      </section>

      {/* Datos */}
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 lg:pt-20">
        <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <Reveal>
            <div className="glass h-full rounded-[1.75rem] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Mapa de intereses</p>
                  <h2 className="mt-3 text-xl font-medium text-white">
                    Tu afinidad, en seis ejes
                  </h2>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 sm:block">
                  RIASEC
                </span>
              </div>
              <RadarChart
                ranked={result.ranked}
                className="mx-auto mt-4 w-full max-w-[400px]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass h-full rounded-[1.75rem] p-6 sm:p-8">
              <p className="eyebrow">Detalle</p>
              <h2 className="mt-3 text-xl font-medium text-white">
                Cuánto pesa cada interés
              </h2>

              <div className="mt-7 space-y-5">
                {result.ranked.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5 text-[13px] text-white/70">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 10px 1px ${item.color}66`,
                          }}
                        />
                        {item.name}
                        <span className="text-[11px] text-white/25">
                          {CATEGORIES[item.id].verb}
                        </span>
                      </span>
                      <span className="font-mono text-[12px] tabular-nums text-white/45">
                        {item.value}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + index * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          background: `linear-gradient(90deg, ${item.color}55, ${item.color})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-7 text-[11px] leading-relaxed text-white/25">
                El porcentaje es relativo a tu interés más alto. Cada respuesta
                suma 3 puntos al interés principal y 1 al secundario.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Carreras */}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Carreras sugeridas</p>
              <h2 className="font-display mt-3 max-w-[24ch] text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
                Donde más te vas a parecer a vos.
              </h2>
            </div>
            <p className="max-w-[34ch] text-[12.5px] leading-relaxed text-white/35">
              Ordenadas por compatibilidad con tu combinación de intereses. Son
              puntos de partida, no una sentencia.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-3 sm:grid-cols-2">
          {result.careers.map((career, index) => {
            const color = CATEGORIES[career.category].color;
            return (
              <Reveal key={career.name} delay={index * 0.04}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.045]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 font-mono text-[10px] text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-[0.16em]"
                        style={{ color }}
                      >
                        {CATEGORIES[career.category].name}
                      </span>
                    </div>
                    <span
                      className="font-mono text-[11px] tabular-nums"
                      style={{ color }}
                    >
                      {career.match}%
                    </span>
                  </div>

                  <h3 className="mt-4 text-[17px] font-medium text-white">
                    {career.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                    {career.why}
                  </p>

                  <div className="mt-5 h-px w-full bg-white/[0.06]">
                    <div
                      className="h-px transition-all duration-700"
                      style={{
                        width: `${career.match}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 12px 1px ${color}66`,
                      }}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Tarjeta compartible */}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))] p-6 sm:p-10">
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${accent}33, transparent 70%)`,
              }}
            />
            <div className="relative grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="mx-auto w-full max-w-[330px]">
                <ResultCardPreview result={result} />
              </div>

              <div>
                <p className="eyebrow">Para llevar</p>
                <h2 className="font-display mt-3 max-w-[20ch] text-[clamp(1.8rem,3.4vw,2.8rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
                  Una tarjeta que dice quién sos.
                </h2>
                <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-white/45">
                  Se genera en tu dispositivo en 1080×1350, lista para Instagram
                  o para mandar por WhatsApp. No se sube ninguna imagen a ningún
                  servidor.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <ActionButton
                    onClick={handleDownload}
                    disabled={busy !== null}
                  >
                    <Download size={16} />
                    {busy === "download" ? "Generando…" : "Descargar tarjeta"}
                  </ActionButton>
                  <ActionButton
                    variant="glass"
                    onClick={handleShare}
                    disabled={busy !== null}
                  >
                    <Share2 size={16} />
                    Compartir
                  </ActionButton>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-5 inline-flex items-center gap-2 text-[12px] text-white/35 transition-colors hover:text-white/70"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied
                    ? "Enlace copiado al portapapeles"
                    : "Copiar enlace a este perfil"}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Cierre */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8">
        <div className="hairline" />
        <div className="flex flex-col items-start justify-between gap-5 pt-7 sm:flex-row sm:items-center">
          <p className="max-w-[52ch] text-[11.5px] leading-relaxed text-white/25">
            Basado en el modelo RIASEC de John Holland. Es una herramienta de
            orientación, no un diagnóstico clínico ni una decisión definitiva.
          </p>
          <ActionButton variant="outline" onClick={restart}>
            <RotateCcw size={14} />
            {isShared ? "Hacer mi test" : "Volver a hacerlo"}
          </ActionButton>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
        <div className="flex items-center gap-2 text-[11px] text-white/20">
          <Logo className="h-4 w-4" />
          <span>voca</span>
          <span>·</span>
          <span>Next.js · Three.js · Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
