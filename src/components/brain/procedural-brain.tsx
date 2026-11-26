"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CATEGORIES } from "@/lib/riasec";
import type { BrainSceneProps } from "./brain-scene";
import {
  ZONE_ORDER,
  ZONE_POSITIONS,
  createHemisphereGeometry,
  createNodeGeometry,
} from "./brain-geometry";
import {
  brainFragmentShader,
  brainVertexShader,
  nodeFragmentShader,
  nodeVertexShader,
} from "./brain-shaders";

/**
 * Cerebro de respaldo, generado por código.
 * Se usa solo si `/cerebro.glb` no carga o no trae los atributos de zona.
 */
export function ProceduralBrain({
  levels,
  pulse,
  quality = "high",
  reducedMotion = false,
  reveal = false,
  interactive = true,
}: BrainSceneProps) {
  const group = useRef<THREE.Group>(null);
  const startedAt = useRef<number | null>(null);
  const pulses = useRef(new Float32Array(6));
  const current = useRef(new Float32Array(6));

  const geometries = useMemo(() => {
    const segments = quality === "low" ? 80 : 150;
    return {
      right: createHemisphereGeometry(1, segments),
      left: createHemisphereGeometry(-1, segments),
    };
  }, [quality]);

  const nodeGeometry = useMemo(
    () =>
      createNodeGeometry(
        [geometries.right, geometries.left],
        quality === "low" ? 800 : 2400,
      ),
    [geometries, quality],
  );

  const zonePositions = useMemo(
    () =>
      ZONE_ORDER.map((id) => {
        const [x, y, z] = ZONE_POSITIONS[id];
        return new THREE.Vector3(x, y, z);
      }),
    [],
  );

  const zoneColors = useMemo(
    () => ZONE_ORDER.map((id) => new THREE.Color(CATEGORIES[id].color)),
    [],
  );

  const uniforms = useMemo(
    () => ({
      uZonePos: { value: zonePositions },
      uZoneColor: { value: zoneColors },
      uLevel: { value: new Float32Array(6) },
      uPulse: { value: new Float32Array(6) },
      uTime: { value: 0 },
      uReveal: { value: reveal ? 0 : 1 },
      uBase: { value: new THREE.Color("#2a3566") },
      uRim: { value: new THREE.Color("#7c8dff") },
    }),
    [zonePositions, zoneColors, reveal],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: brainVertexShader,
        fragmentShader: brainFragmentShader,
        uniforms,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  );

  const nodeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodeVertexShader,
        fragmentShader: nodeFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  useEffect(() => {
    return () => {
      geometries.right.dispose();
      geometries.left.dispose();
      nodeGeometry.dispose();
      material.dispose();
      nodeMaterial.dispose();
    };
  }, [geometries, nodeGeometry, material, nodeMaterial]);

  useEffect(() => {
    if (!pulse || reducedMotion) return;
    const index = ZONE_ORDER.indexOf(pulse.category);
    if (index >= 0) pulses.current[index] = 1;
  }, [pulse, reducedMotion]);

  useFrame((state, delta) => {
    const dt = Math.min(0.05, delta);

    // Encendido por tiempo real, no por fotogramas.
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
      Math.sin(state.clock.elapsedTime * 0.17) * 0.42 +
        0.5 +
        (interactive ? state.pointer.x * 0.16 : 0),
      1 - Math.exp(-1.8 * dt),
    );
    const targetX = interactive ? 0.24 + state.pointer.y * 0.1 : 0.24;
    const targetZ = interactive ? -state.pointer.x * 0.06 : 0;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      1 - Math.exp(-2.5 * dt),
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetZ,
      1 - Math.exp(-2.5 * dt),
    );
  });

  return (
    <group ref={group} rotation={[0.24, 0.5, 0]}>
      <mesh geometry={geometries.right} material={material} />
      <mesh geometry={geometries.left} material={material} />
      <points geometry={nodeGeometry} material={nodeMaterial} />
    </group>
  );
}
