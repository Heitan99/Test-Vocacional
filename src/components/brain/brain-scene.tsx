"use client";

import { Component, Suspense, useEffect, useMemo, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { CategoryId } from "@/lib/riasec";
import { BrainHalo } from "./brain-halo";
import { GlbBrain } from "./glb-brain";
import { ProceduralBrain } from "./procedural-brain";

export interface BrainPulse {
  category: CategoryId;
  nonce: number;
}

export interface BrainSceneProps {
  /** Nivel de cada interés, 0-1. */
  levels: Record<CategoryId, number>;
  pulse?: BrainPulse | null;
  quality?: "low" | "high";
  reducedMotion?: boolean;
  /** Anima el encendido inicial (pantalla de resultados). */
  reveal?: boolean;
  interactive?: boolean;
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    // Encaja el cerebro completo en vertical y en horizontal.
    const distance =
      Math.max(3.1, 2.65 / (Math.max(0.55, aspect) * 0.6114)) * 0.92;
    camera.position.set(0, 0.06, Math.min(5.8, distance));
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

/** Si el GLB falla, el cerebro procedural toma el lugar. */
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Sin WebGL el canvas falla; el halo ocupa su lugar en vez de dejar la página en blanco. */
class CanvasBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Ajusta la carga del cerebro al dispositivo. */
function detectQuality(): "low" | "high" {
  if (typeof window === "undefined") return "high";
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  // El tamaño de pantalla no decide la calidad; la potencia del equipo sí.
  return cores <= 4 || memory <= 4 ? "low" : "high";
}

export function BrainScene(props: BrainSceneProps) {
  const detected = useMemo(detectQuality, []);
  const quality = props.quality ?? detected;
  const fallback = <ProceduralBrain {...props} quality={quality} />;

  return (
    <CanvasBoundary fallback={<BrainHalo />}>
      <Canvas
        flat
        dpr={[1, quality === "low" ? 1.6 : 2]}
        camera={{ position: [0, 0.06, 3.6], fov: 34, near: 0.1, far: 20 }}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        style={{ touchAction: "pan-y" }}
      >
        <CameraRig />

        <ModelBoundary fallback={fallback}>
          <Suspense fallback={null}>
            <GlbBrain {...props} quality={quality} />
          </Suspense>
        </ModelBoundary>

        <EffectComposer
          multisampling={quality === "low" ? 0 : 4}
          enableNormalPass={false}
        >
          <Bloom
            intensity={quality === "low" ? 0.45 : 0.62}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.22}
            mipmapBlur
            radius={0.62}
          />
        </EffectComposer>
      </Canvas>
    </CanvasBoundary>
  );
}
