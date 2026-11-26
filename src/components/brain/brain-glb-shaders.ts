/**
 * Shaders del cerebro real (`/cerebro.glb`).
 * El modelo trae los pesos de cada interés por vértice:
 *   _ZONEA = (R, I, A, S)
 *   _ZONEB = (E, C, tronco, cavidad)
 * `cavidad` va de 0 (cresta) a 1 (fondo del surco) y se usa como oclusión.
 */

export const glbVertexShader = /* glsl */ `
attribute vec4 _zonea;
attribute vec4 _zoneb;

varying vec3 vNormalView;
varying vec3 vViewDir;
varying vec4 vZoneA;
varying vec4 vZoneB;

void main() {
  vZoneA = _zonea;
  vZoneB = _zoneb;

  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewDir = normalize(-viewPosition.xyz);

  gl_Position = projectionMatrix * viewPosition;
}
`;

export const glbFragmentShader = /* glsl */ `
uniform vec3 uZoneColor[6];
uniform float uLevel[6];
uniform float uPulse[6];
uniform float uTime;
uniform float uReveal;
uniform vec3 uBase;
uniform vec3 uRim;

varying vec3 vNormalView;
varying vec3 vViewDir;
varying vec4 vZoneA;
varying vec4 vZoneB;

/** Peso de la zona i: 0-3 vienen de _ZONEA, 4-5 de _ZONEB. */
float zoneWeight(int index) {
  if (index == 0) return vZoneA.r;
  if (index == 1) return vZoneA.g;
  if (index == 2) return vZoneA.b;
  if (index == 3) return vZoneA.a;
  if (index == 4) return vZoneB.x;
  return vZoneB.y;
}

void main() {
  vec3 N = normalize(vNormalView);
  vec3 V = normalize(vViewDir);
  if (!gl_FrontFacing) N = -N;

  // Luz de estudio: clave arriba a la izquierda, relleno opuesto.
  vec3 keyLight = normalize(vec3(-0.45, 0.75, 0.55));
  vec3 fillLight = normalize(vec3(0.7, -0.2, 0.35));
  vec3 halfVector = normalize(keyLight + V);

  float key = max(dot(N, keyLight), 0.0);
  float fill = max(dot(N, fillLight), 0.0);
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.5);

  float cavity = clamp(vZoneB.w, 0.0, 1.0);
  float trunk = clamp(vZoneB.z, 0.0, 1.0);

  // 0 en la cresta, 1 en el fondo del surco.
  float crest = 1.0 - cavity;

  // Base azul oscura: casi negra, la forma la dibuja la luz de borde.
  vec3 color = uBase * (0.32 + key * 0.55 + fill * 0.12);
  color *= mix(1.0, 0.03, cavity);
  color *= 1.0 - trunk * 0.6;

  // Brillo especular tenue: solo en las crestas, para leer las circunvoluciones.
  float spec = pow(max(dot(N, halfVector), 0.0), 48.0);
  color += vec3(0.58, 0.7, 1.0) * spec * 0.16 * crest * crest;

  // Emisión: color_i * peso_i * nivel_i, más el pulso de la última respuesta.
  vec3 emission = vec3(0.0);
  float weightSum = 0.0;
  for (int i = 0; i < 6; i++) {
    float weight = zoneWeight(i);
    weightSum += weight;

    float level = uLevel[i] * uReveal;
    float pulse = uPulse[i] * uReveal;
    float flicker = 0.7 + 0.3 * sin(uTime * 7.0 + float(i) * 1.9);
    // Respiración lenta: el cerebro se siente vivo aunque el nivel no cambie.
    float breath = 0.93 + 0.07 * sin(uTime * 0.9 + float(i) * 1.1);

    emission += uZoneColor[i] * weight * (level * breath + pulse * flicker * 1.8);
  }

  // Las zonas se solapan en los bordes: normalizamos para que el cruce no
  // sature a blanco.
  emission /= max(1.0, weightSum);
  // El tronco encefálico no participa del mapa de intereses.
  emission *= 1.0 - trunk * 0.92;
  // En el surco casi no hay emisión: el brillo vive en las crestas.
  emission *= pow(crest, 1.35);

  color += emission * 1.35;

  // Luz de borde: separa el cerebro del fondo. Se apaga en los surcos para no
  // dibujar una línea clara en cada pliegue.
  color += uRim * fresnel * 0.42 * pow(crest, 2.0) * (1.0 - trunk * 0.9);
  color += uRim * 0.02;

  gl_FragColor = vec4(color, 1.0);
}
`;
