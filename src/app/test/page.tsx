"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { BrainView } from "@/components/brain/brain-view";
import type { BrainPulse } from "@/components/brain/brain-scene";
import { ScaleOptions } from "@/components/test/scale-options";
import { Backdrop } from "@/components/ui/backdrop";
import { Logo, Wordmark } from "@/components/ui/logo";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/riasec";
import {
  answeredCount,
  maxScores,
  scoreAnswers,
  type Answers,
} from "@/lib/scoring";
import {
  clearProgress,
  loadProgress,
  saveProgress,
  saveResult,
} from "@/lib/session";

function emptyLevels(): Record<CategoryId, number> {
  return CATEGORY_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as Record<CategoryId, number>,
  );
}

export default function TestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pulse, setPulse] = useState<BrainPulse | null>(null);
  const [finishing, setFinishing] = useState(false);

  const locked = useRef(false);
  const timer = useRef<number | null>(null);

  // Recuperar progreso guardado.
  useEffect(() => {
    const progress = loadProgress();
    if (progress) {
      setAnswers(progress.answers);
      setIndex(Math.min(progress.index, TOTAL_QUESTIONS - 1));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const question = QUESTIONS[index];
  const selected = answers[question?.id ?? ""];
  const answered = answeredCount(answers);
  const progress = finishing ? 1 : answered / TOTAL_QUESTIONS;

  /** Niveles del cerebro proporcionales al puntaje acumulado. */
  const levels = useMemo(() => {
    const preview = scoreAnswers(answers);
    const max = maxScores();
    return CATEGORY_IDS.reduce((acc, id) => {
      acc[id] = Math.min(1, preview.scores[id] / Math.max(1, max[id] * 0.65));
      return acc;
    }, emptyLevels());
  }, [answers]);

  const finish = useCallback(
    (finalAnswers: Answers) => {
      const result = scoreAnswers(finalAnswers);
      saveResult(result);
      clearProgress();
      setFinishing(true);

      // Persistencia opcional: si el backend no está disponible, no bloquea.
      void fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: result.profile.key,
          affinity: result.affinity,
          top: result.top,
        }),
        keepalive: true,
      }).catch(() => undefined);

      timer.current = window.setTimeout(() => {
        router.push("/resultado");
      }, 1500);
    },
    [router],
  );

  const select = useCallback(
    (value: number) => {
      if (!question || locked.current || finishing) return;

      const next = { ...answers, [question.id]: value };
      setAnswers(next);
      setPulse({ category: question.primary, nonce: performance.now() });
      saveProgress({ index, answers: next });

      locked.current = true;

      if (index >= TOTAL_QUESTIONS - 1) {
        timer.current = window.setTimeout(() => finish(next), 420);
        return;
      }

      timer.current = window.setTimeout(() => {
        setDirection(1);
        setIndex((current) => Math.min(TOTAL_QUESTIONS - 1, current + 1));
        locked.current = false;
      }, 280);
    },
    [answers, finish, finishing, index, question],
  );

  const goBack = useCallback(() => {
    if (locked.current || index === 0 || finishing) return;
    setDirection(-1);
    setIndex((current) => Math.max(0, current - 1));
  }, [finishing, index]);

  // Atajos de teclado 1-4 y flecha izquierda.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const value = Number.parseInt(event.key, 10);
      if (value >= 1 && value <= 4) {
        event.preventDefault();
        select(value - 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goBack, select]);

  const accent = CATEGORIES[question?.primary ?? "I"].color;

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <Backdrop />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="voca, inicio"
        >
          <Logo />
          <Wordmark />
        </Link>
        <div className="flex items-center gap-5">
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/25 sm:block">
            Test vocacional
          </span>
          <Link
            href="/"
            className="text-[13px] text-white/40 transition-colors hover:text-white"
          >
            Salir
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="relative h-px flex-1 bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#38b6ff,#9b7bff,#ff4fa3)] transition-[width] duration-500 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_3px_rgba(167,139,250,0.75)] transition-[left] duration-500 ease-out"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/40">
            {String(index + 1).padStart(2, "0")}
            <span className="text-white/20"> / {TOTAL_QUESTIONS}</span>
          </span>
        </div>
      </div>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-5 pb-10 pt-6 sm:px-8 lg:grid-cols-[1fr_1.12fr] lg:items-center lg:gap-8 lg:pt-2">
        <div className="relative h-[24svh] min-h-[170px] sm:h-[30svh] lg:h-[62vh]">
          {!finishing && (
            <BrainView levels={levels} pulse={pulse} interactive />
          )}
        </div>

        <div className="relative">
          {!ready ? (
            <div className="glass h-[320px] animate-pulse rounded-[1.75rem]" />
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={question.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 26 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -22 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="glass relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8 lg:p-10">
                  <div
                    className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full blur-3xl transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle, ${accent}33, transparent 68%)`,
                      opacity: selected !== undefined ? 1 : 0.35,
                    }}
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <span className="eyebrow">
                      Pregunta {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-white/20 sm:block">
                      Sin respuestas correctas
                    </span>
                  </div>

                  <h1 className="relative mt-6 text-[clamp(1.45rem,2.7vw,2.15rem)] font-medium leading-[1.22] tracking-[-0.03em] text-white">
                    {question.text}
                  </h1>

                  <p className="relative mt-3 text-[13px] text-white/35">
                    ¿Cuánto te identifica?
                  </p>

                  <div className="relative mt-8">
                    <ScaleOptions
                      selected={selected}
                      color={accent}
                      disabled={locked.current || finishing}
                      onSelect={select}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1.5 rounded-full py-2 pr-3 text-[13px] text-white/35 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-25"
                  >
                    <ArrowLeft size={14} />
                    Anterior
                  </button>

                  <span className="hidden items-center gap-2 text-[11px] text-white/25 sm:flex">
                    Respondé con
                    {[1, 2, 3, 4].map((key) => (
                      <kbd
                        key={key}
                        className="inline-flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-white/[0.04] font-mono text-[10px] text-white/40"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <footer className="safe-bottom mx-auto w-full max-w-7xl px-5 pb-5 sm:px-8">
        <p className="text-[11px] text-white/20">
          Tus respuestas se guardan solo en este dispositivo.
        </p>
      </footer>

      <AnimatePresence>
        {finishing && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05060b]/90 px-6 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Logo className="h-14 w-14" />
            </motion.div>
            <p className="eyebrow mt-8">Analizando tus respuestas</p>
            <h2 className="mt-3 text-center text-2xl font-medium tracking-tight text-white">
              Leyendo tu perfil…
            </h2>
            <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full w-1/3 bg-[linear-gradient(90deg,transparent,#9b7bff,transparent)]"
                animate={{ x: ["-120%", "320%"] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
