import { cn } from "@/lib/utils";

/** Fondo común: degradados profundos, rejilla tenue y grano. */
export function Backdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060b]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0d1130_0%,#05060b_55%,#04040a_100%)]" />
      <div className="absolute -left-[15%] top-[8%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(88,101,242,0.16),transparent_62%)] blur-3xl" />
      <div className="absolute -right-[12%] top-[26%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1),transparent_64%)] blur-3xl" />
      <div className="absolute bottom-[-18%] left-[24%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.12),transparent_66%)] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,black,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(3,4,9,0.75)_100%)]" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
