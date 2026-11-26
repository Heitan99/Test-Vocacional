"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CATEGORIES } from "@/lib/riasec";
import type { BrainSceneProps } from "./brain-scene";
import { ZONE_ORDER } from "./brain-geometry";
import { ProceduralBrain } from "./procedural-brain";
import { glbFragmentShader, glbVertexShader } from "./brain-glb-shaders";

const MODEL_URL = "/cerebro.glb";

interface ModelInfo {
  meshes: THREE.Mesh[];
  /** Desplazamiento para centrar el modelo en el origen. */
  offset: [number, number, number];
  /** Escala que lleva la dimensión mayor a 2 (radio 1, igual que el procedural). */
  scale: number;
  hasZones: boolean;
}

function inspectModel(scene: THREE.Object3D): ModelInfo {
  scene.updateWorldMatrix(true, true);

  const meshes: THREE.Mesh[] = [];
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry) meshes.push(mesh);
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const scale = 2 / maxDimension;

  const hasZones = meshes.some(
    (mesh) =>
      mesh.geometry.attributes._zonea && mesh.geometry.attributes._zoneb,
  );

  return {
    meshes,
    offset: [-center.x * scale, -center.y * scale, -center.z * scale],
    scale,
    hasZones,
  };
}

export function GlbBrain(props: BrainSceneProps) {
  const {
    levels,
    pulse,
    reducedMotion = false,
    reveal = false,
    interactive = true,
  } = props;

  const group = useRef<THREE.Group>(null);
  const startedAt = useRef<number | null>(null);
  const pulses = useRef(new Float32Array(6));
  const current = useRef(new Float32Array(6));

  const { scene } = useGLTF(MODEL_URL);
  // Se clona porque el cache de `useGLTF` es global: si el canvas se desmonta,
  // las mallas originales quedan sueltas y la siguiente pantalla falla.
  const model = useMemo(() => inspectModel(scene.clone(true)), [scene]);

  const zoneColors = useMemo(
    () => ZONE_ORDER.map((id) => new THREE.Color(CATEGORIES[id].color)),
    [],
  );

  const uniforms = useMemo(
    () => ({
      uZoneColor: { value: zoneColors },
      uLevel: { value: new Float32Array(6) },
      uPulse: { value: new Float32Array(6) },
      uTime: { value: 0 },
      uReveal: { value: reveal ? 0 : 1 },
      uBase: { value: new THREE.Color("#16244a") },
      uRim: { value: new THREE.Color("#6b86ff") },
    }),
    [zoneColors, reveal],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glbVertexShader,
        fragmentShader: glbFragmentShader,
        uniforms,
        side: THREE.FrontSide,
      }),
    [uniforms],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    if (!pulse || reducedMotion) return;
    const index = ZONE_ORDER.indexOf(pulse.category);
    if (index >= 0) pulses.current[index] = 1;
  }, [pulse, reducedMotion]);

  useFrame((state, delta) => {
    const dt = Math.min(0.05, delta);

    // Por tiempo, no por fotogramas: así el reveal no queda a medias en equipos lentos.
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime;
    const revealProgress = reveal
      ? Math.min(1, (state.clock.elapsedTime - startedAt.current) / 2.2)
      : 1;
    const revealEase = 1 - Math.pow(1 - revealProgress, 3);

    const decay = Math.exp(-3.2 * dt);
    const smoothing = 1 - Math.exp(-5.5 * dt);

    for (let i = 0; i < 6; i++) {
      const id = ZONE_ORDER[i];
      const target = Math.min(1, Math.max(0, levels[id] ?? 0));
      current.current[i] += (target - current.current[i]) * smoothing;
      pulses.current[i] *= decay;

      const stagger = Math.min(1, Math.max(0, (revealEase - i * 0.07) / 0.65));
      uniforms.uLevel.value[i] = current.current[i] * stagger;
      uniforms.uPulse.value[i] = pulses.current[i] * stagger;
    }

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uReveal.value = reveal ? revealEase : 1;

    if (!group.current || reducedMotion) return;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.17) * 0.34 +
        0.55 +
        (interactive ? state.pointer.x * 0.14 : 0),
      1 - Math.exp(-1.8 * dt),
    );
    const targetX = interactive ? 0.2 + state.pointer.y * 0.08 : 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      1 - Math.exp(-2.5 * dt),
    );
  });

  // Sin atributos de zona el shader no puede pintar nada.
  if (!model.hasZones) {
    return <ProceduralBrain {...props} />;
  }

  return (
    <group ref={group} rotation={[0.2, 0.55, 0]}>
      <group position={model.offset} scale={model.scale}>
        {model.meshes.map((mesh) => (
          <primitive key={mesh.uuid} object={mesh} material={material} />
        ))}
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
