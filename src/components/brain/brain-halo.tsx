/**
 * Halo de respaldo del cerebro.
 * Se ve mientras carga el chunk de three.js y ocupa el lugar del canvas si el
 * navegador no puede crear un contexto WebGL.
 */
export function BrainHalo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(70,85,220,0.3),rgba(70,85,220,0.06)_45%,transparent_70%)] blur-2xl" />
      <div className="absolute left-[18%] top-[26%] h-[34%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(56,182,255,0.18),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[18%] right-[16%] h-[38%] w-[38%] rounded-full bg-[radial-gradient(circle,rgba(155,123,255,0.18),transparent_70%)] blur-2xl" />
    </div>
  );
}
