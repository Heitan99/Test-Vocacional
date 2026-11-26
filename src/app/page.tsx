"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrainView } from "@/components/brain/brain-view";
import type { BrainPulse } from "@/components/brain/brain-scene";
import { ActionLink } from "@/components/ui/action-button";
import { Backdrop } from "@/components/ui/backdrop";
import { Logo, Wordmark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { SiteHeader } from "@/components/ui/site-header";
import { CATEGORIES, CATEGORY_IDS } from "@/lib/riasec";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/** Niveles de muestra: el cerebro nunca se ve vacío en la portada. */
const DEMO_LEVELS = {
  R: 0.24,
  I: 0.92,
  A: 0.72,
  S: 0.28,
  E: 0.46,
  C: 0.14,
};

const STEPS = [
  {
    number: "01",
    title: "Respondé sin pensarlo de más",
    body: "18 afirmaciones, una por pantalla. Elegí cuánto te identifican: nada, poco, bastante o mucho. No hay respuestas correctas.",
  },
  {
    number: "02",
    title: "Mirá cómo se ilumina",
    body: "Cada interés tiene una zona en el cerebro. Cuando elegís, esa zona pulsa y se queda encendida según el peso que va sumando.",
  },
  {
    number: "03",
    title: "Llevate tu perfil",
    body: "Al terminar vas a ver tu combinación de intereses, un gráfico de afinidad y cinco carreras ordenadas por compatibilidad.",
  },
];

const META = [
  { label: "Duración", value: "3 minutos" },
  { label: "Preguntas", value: "18" },
  { label: "Registro", value: "No hace falta" },
];

export default function Home() {
  const [pulse, setPulse] = useState<BrainPulse | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let index = 0;

    const fire = () => {
      const category = CATEGORY_IDS[index % CATEGORY_IDS.length];
      setPulse({ category, nonce: Date.now() });
      index += 1;
    };

    fire();
    const timer = window.setInterval(fire, 2600);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <>
      <Backdrop />
      <div className="relative min-h-svh">
        <SiteHeader />

        {/* Hero */}
        <section className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-12 pt-2 sm:px-8 lg:min-h-[calc(100svh-104px)] lg:grid-cols-[1.12fr_0.88fr] lg:gap-2 lg:px-10 lg:pb-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9b7bff] shadow-[0_0_10px_2px_rgba(155,123,255,0.55)]" />
                Test vocacional · Modelo RIASEC
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="font-display mt-6 text-[clamp(2.5rem,4.9vw,4.15rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
                Tu mente ya sabe
                <span className="text-gradient block">el camino.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[46ch] text-[16.5px] leading-relaxed text-white/55">
                18 preguntas. Un cerebro que se ilumina según lo que te mueve.
                Al final, tu perfil vocacional y las carreras donde más te vas a
                parecer a vos.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ActionLink href="/test" size="lg" className="pr-6">
                  Comenzar el test
                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </ActionLink>
                <a
                  href="#como-funciona"
                  className="inline-flex h-[54px] items-center gap-2 rounded-full px-5 text-sm text-white/50 transition-colors hover:text-white"
                >
                  Cómo funciona
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <dl className="mt-10 flex flex-wrap gap-x-9 gap-y-4">
                {META.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-[13px] text-white/70">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="relative order-1 h-[38svh] min-h-[250px] w-full sm:h-[46svh] lg:order-2 lg:h-[74vh]">
            <BrainView levels={DEMO_LEVELS} pulse={pulse} interactive />
          </div>
        </section>

        {/* Leyenda de intereses */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="hairline" />
          <div className="no-scrollbar flex gap-7 overflow-x-auto py-5">
            {CATEGORY_IDS.map((id) => (
              <div
                key={id}
                className="flex shrink-0 items-center gap-2 text-[12px]"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: CATEGORIES[id].color,
                    boxShadow: `0 0 12px 1px ${CATEGORIES[id].color}66`,
                  }}
                />
                <span className="text-white/70">{CATEGORIES[id].name}</span>
                <span className="text-white/25">{CATEGORIES[id].verb}</span>
              </div>
            ))}
          </div>
          <div className="hairline" />
        </div>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
        >
          <Reveal>
            <p className="eyebrow">Cómo funciona</p>
            <h2 className="font-display mt-4 max-w-[24ch] text-[clamp(2rem,3.6vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
              Menos cuestionario. Más espejo.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.07}>
                <article className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:border-white/20">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                    {step.number}
                  </span>
                  <h3 className="mt-8 text-[17px] font-medium leading-snug text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-white/45">
                    {step.body}
                  </p>
                  <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.14),transparent_70%)] blur-xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-60" />
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Los seis intereses */}
        <section
          id="intereses"
          className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10"
        >
          <Reveal>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Los 6 intereses</p>
                <h2 className="font-display mt-4 max-w-[26ch] text-[clamp(2rem,3.6vw,3.1rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
                  Seis formas de mirar el mundo.
                </h2>
              </div>
              <p className="max-w-[34ch] text-sm leading-relaxed text-white/40">
                El modelo RIASEC describe tus intereses como una mezcla. Nadie
                es solo una cosa: tu perfil nace de las combinaciones.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_IDS.map((id, index) => {
              const category = CATEGORIES[id];
              return (
                <Reveal key={id} delay={index * 0.04}>
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]">
                    <div
                      className="absolute inset-x-6 top-0 h-px opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
                      }}
                    />
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-[17px] font-medium text-white">
                        {category.name}
                      </h3>
                      <span className="font-mono text-[11px] text-white/20">
                        {category.id}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: category.color }}
                    >
                      {category.verb}
                    </p>
                    <p className="mt-4 line-clamp-3 text-[13.5px] leading-relaxed text-white/40">
                      {category.description}
                    </p>
                    <ul className="mt-5 space-y-1.5">
                      {category.careers.slice(0, 2).map((career) => (
                        <li
                          key={career.name}
                          className="flex items-center gap-2 text-[13px] text-white/60"
                        >
                          <span className="h-px w-3 bg-white/20" />
                          {career.name}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))] px-6 py-16 text-center sm:px-14 sm:py-20">
              <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,109,255,0.35),transparent_65%)] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16),transparent_65%)] blur-3xl" />

              <p className="eyebrow relative">Empezá hoy</p>
              <h2 className="font-display relative mx-auto mt-4 max-w-[20ch] text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-white">
                Tres minutos para entenderte mejor.
              </h2>
              <p className="relative mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed text-white/45">
                Sin registro, sin costo y sin respuestas correctas. Tus
                respuestas quedan en tu dispositivo.
              </p>
              <div className="relative mt-9 flex justify-center">
                <ActionLink href="/test" size="lg" className="pr-6">
                  Descubrir mi perfil
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </ActionLink>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 lg:px-10">
          <div className="hairline mb-6" />
          <div className="flex flex-col items-start justify-between gap-4 text-[12px] text-white/30 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5" />
              <Wordmark className="text-sm text-white/60" />
              <span className="text-white/20">·</span>
              <span>Orientación vocacional, sin vueltas.</span>
            </div>
            <div className="flex items-center gap-5">
              <span>Next.js · Three.js · Tailwind</span>
              <a
                href="#"
                className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
              >
                Volver arriba
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
