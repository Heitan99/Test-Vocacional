import * as THREE from "three";
import { CATEGORY_IDS, type CategoryId } from "@/lib/riasec";

/**
 * Centros de actividad de cada interés, en espacio local del cerebro.
 * El shader calcula la distancia de cada vértice a estos puntos.
 */
export const ZONE_POSITIONS: Record<CategoryId, [number, number, number]> = {
  R: [0.62, -0.26, 0.04],
  I: [-0.5, 0.46, 0.42],
  A: [0.5, 0.4, 0.56],
  S: [-0.64, -0.1, 0.44],
  E: [0.5, 0.44, -0.54],
  C: [-0.56, -0.2, -0.5],
};

/** Orden estable usado por todos los uniforms del shader. */
export const ZONE_ORDER = CATEGORY_IDS;

/* ------------------------------------------------------------------ */
/*  Ruido de valor 3D (sin dependencias)                               */
/* ------------------------------------------------------------------ */

function hash3(x: number, y: number, z: number): number {
  let h =
    Math.imul(x, 374761393) +
    Math.imul(y, 668265263) +
    Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function noise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = fade(x - xi);
  const fy = fade(y - yi);
  const fz = fade(z - zi);

  const c000 = hash3(xi, yi, zi);
  const c100 = hash3(xi + 1, yi, zi);
  const c010 = hash3(xi, yi + 1, zi);
  const c110 = hash3(xi + 1, yi + 1, zi);
  const c001 = hash3(xi, yi, zi + 1);
  const c101 = hash3(xi + 1, yi, zi + 1);
  const c011 = hash3(xi, yi + 1, zi + 1);
  const c111 = hash3(xi + 1, yi + 1, zi + 1);

  const x00 = lerp(c000, c100, fx);
  const x10 = lerp(c010, c110, fx);
  const x01 = lerp(c001, c101, fx);
  const x11 = lerp(c011, c111, fx);

  return lerp(lerp(x00, x10, fy), lerp(x01, x11, fy), fz);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ------------------------------------------------------------------ */
/*  Deformación                                                        */
/* ------------------------------------------------------------------ */

/**
 * Convierte un punto de la esfera unitaria en la superficie de un
 * hemisferio: elipsoide + lóbulo temporal + cerebelo + circunvoluciones.
 *
 * `side` es 1 (derecho) o -1 (izquierdo). El hemisferio ya viene recortado
 * en x = 0, así que la cisura interhemisférica aparece como un surco real.
 */
export function deformBrain(
  unit: THREE.Vector3,
  side: 1 | -1,
  out: THREE.Vector3 = new THREE.Vector3(),
): { position: THREE.Vector3; fold: number } {
  let x = Math.abs(unit.x) * 0.95;
  let y = unit.y * 0.72;
  let z = unit.z * 1.18;

  // La mitad inferior es más chata: el cerebro se apoya sobre la base del cráneo.
  if (y < 0) y *= 0.82;

  // Base más angosta que la bóveda.
  const baseTaper = 1 - 0.13 * (1 - smoothstep(-0.85, -0.05, y));
  x *= baseTaper;
  z *= baseTaper;

  // El lóbulo frontal se afina hacia adelante.
  const frontTaper = 1 - 0.22 * smoothstep(0.15, 1.1, z);
  x *= frontTaper;
  y *= 1 - 0.06 * smoothstep(0.4, 1.2, z);

  // Lóbulos temporales: ensanche lateral en la mitad inferior.
  const temporal =
    Math.exp(-Math.pow((y + 0.1) / 0.42, 2)) * Math.exp(-Math.pow(z / 0.72, 2));
  x *= 1 + temporal * 0.09;

  // Cerebelo: masa redondeada en la parte inferior trasera.
  const bx = 0;
  const by = -0.46;
  const bz = -0.74;
  const bumpDistance = Math.hypot(x - bx, y - by, z - bz);
  const bump = Math.max(0, 1 - bumpDistance / 0.7);
  if (bump > 0) {
    const push = bump * bump * 0.14;
    const inv = 1 / Math.max(0.001, bumpDistance);
    x += (x - bx) * inv * push;
    y += (y - by) * inv * push * 0.85;
    z += (z - bz) * inv * push;
  }

  // Circunvoluciones: ruido con crestas (ridged) sobre un dominio deformado,
  // así las crestas serpentean como giros reales en vez de grumos.
  const seed = side === 1 ? 0 : 41.7;
  const wx = noise3(x * 2.3 + 5.1 + seed, y * 2.3 + 1.7, z * 2.3 + 7.3) - 0.5;
  const wy = noise3(x * 2.3 + 13.4 + seed, y * 2.3 + 9.2, z * 2.3 + 3.6) - 0.5;
  const wz = noise3(x * 2.3 + 2.8 + seed, y * 2.3 + 11.9, z * 2.3 + 5.4) - 0.5;

  const qx = x + wx * 0.42;
  const qy = y + wy * 0.42;
  const qz = z + wz * 0.42;

  const n1 = noise3(qx * 5.6 + seed, qy * 5.6 + 7.7, qz * 5.6 + 1.9);
  const n2 = noise3(qx * 12.8 + 19.3 + seed, qy * 12.8 + 5.1, qz * 12.8 + 11.4);
  const n3 = noise3(qx * 25.4 + 7.1 + seed, qy * 25.4 + 3.3, qz * 25.4 + 13.7);

  // Giros anchos y chatos separados por surcos angostos y profundos.
  const wide = smoothstep(0.28, 0.62, n1 * 0.68 + n2 * 0.32);
  const fine = smoothstep(0.34, 0.64, n3);
  const height = wide * 0.78 + fine * 0.22;
  const displacement = (height - 0.6) * 0.155;

  const dir = out.set(x, y, z).normalize();
  x += dir.x * displacement;
  y += dir.y * displacement;
  z += dir.z * displacement;

  // Separación entre hemisferios: la cisura se abre más cerca de la bóveda.
  x += 0.014 + 0.034 * smoothstep(-0.4, 0.5, y);

  return { position: out.set(x * side, y, z), fold: height };
}

/* ------------------------------------------------------------------ */
/*  Geometrías                                                         */
/* ------------------------------------------------------------------ */

/**
 * La costura de SphereGeometry duplica vértices: promediamos las normales
 * de posiciones idénticas para que no se vea una línea vertical.
 */
function smoothSeamNormals(geometry: THREE.BufferGeometry) {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const normal = geometry.attributes.normal as THREE.BufferAttribute;
  const groups = new Map<string, { x: number; y: number; z: number }>();
  const keys = new Array<string>(position.count);

  for (let i = 0; i < position.count; i++) {
    const key = `${position.getX(i).toFixed(4)}|${position
      .getY(i)
      .toFixed(4)}|${position.getZ(i).toFixed(4)}`;
    keys[i] = key;
    const acc = groups.get(key);
    if (acc) {
      acc.x += normal.getX(i);
      acc.y += normal.getY(i);
      acc.z += normal.getZ(i);
    } else {
      groups.set(key, {
        x: normal.getX(i),
        y: normal.getY(i),
        z: normal.getZ(i),
      });
    }
  }

  for (let i = 0; i < position.count; i++) {
    const acc = groups.get(keys[i])!;
    const length = Math.hypot(acc.x, acc.y, acc.z) || 1;
    normal.setXYZ(i, acc.x / length, acc.y / length, acc.z / length);
  }

  normal.needsUpdate = true;
}

export function createHemisphereGeometry(
  side: 1 | -1,
  segments = 150,
): THREE.BufferGeometry {
  const heightSegments = Math.round(segments * 0.72);
  // Mitad del hemisferio derecho (x >= 0) o izquierdo (x <= 0).
  const phiStart = side === 1 ? Math.PI / 2 : -Math.PI / 2;
  const geometry = new THREE.SphereGeometry(
    1,
    segments,
    heightSegments,
    phiStart,
    Math.PI,
  );

  const position = geometry.attributes.position as THREE.BufferAttribute;
  const unit = new THREE.Vector3();
  const deformed = new THREE.Vector3();
  const folds = new Float32Array(position.count);

  for (let i = 0; i < position.count; i++) {
    unit.fromBufferAttribute(position, i).normalize();
    const { position: point, fold } = deformBrain(unit, side, deformed);
    position.setXYZ(i, point.x, point.y, point.z);
    folds[i] = fold;
  }

  position.needsUpdate = true;
  geometry.setAttribute("aFold", new THREE.BufferAttribute(folds, 1));
  geometry.computeVertexNormals();
  smoothSeamNormals(geometry);
  geometry.computeBoundingSphere();

  return geometry;
}

/**
 * Nodos neuronales apoyados sobre la superficie real de los hemisferios.
 * Se toman vértices al azar y se los desplaza unos micrómetros por fuera.
 */
export function createNodeGeometry(
  sources: THREE.BufferGeometry[],
  count: number,
): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const perSource = Math.max(1, Math.floor(count / sources.length));

  let index = 0;

  for (const source of sources) {
    const sourcePosition = source.attributes.position as THREE.BufferAttribute;
    const sourceNormal = source.attributes.normal as THREE.BufferAttribute;
    const stride = Math.max(1, Math.floor(sourcePosition.count / perSource));

    for (let i = 0; i < perSource && index < count; i++) {
      const sourceIndex = (i * stride + (i % 11)) % sourcePosition.count;

      const px = sourcePosition.getX(sourceIndex);
      const py = sourcePosition.getY(sourceIndex);
      const pz = sourcePosition.getZ(sourceIndex);
      const nx = sourceNormal.getX(sourceIndex);
      const ny = sourceNormal.getY(sourceIndex);
      const nz = sourceNormal.getZ(sourceIndex);

      const lift = 0.006 + hash3(index * 7, 3, 11) * 0.009;

      positions[index * 3] = px + nx * lift;
      positions[index * 3 + 1] = py + ny * lift;
      positions[index * 3 + 2] = pz + nz * lift;

      sizes[index] = 0.45 + hash3(index * 13, 7, 3) * 1.1;
      seeds[index] = hash3(index * 5, 11, 17);
      index += 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.computeBoundingSphere();

  return geometry;
}
