/**
 * Shaders del cerebro.
 * El color de cada zona se calcula en el fragment shader a partir de la
 * distancia al centro del interés, así que no hace falta texturizar el mesh.
 */

const ZONE_UNIFORMS = /* glsl */ `
uniform vec3 uZonePos[6];
uniform vec3 uZoneColor[6];
uniform float uLevel[6];
uniform float uPulse[6];
uniform float uTime;
uniform float uReveal;
`;

export const brainVertexShader = /* glsl */ `
attribute float aFold;

varying vec3 vPos;
varying vec3 vNormalView;
varying vec3 vViewDir;
varying float vFold;

void main() {
  vPos = position;
  vFold = aFold;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewDir = normalize(-viewPosition.xyz);
  gl_Position = projectionMatrix * viewPosition;
}
`;

export const brainFragmentShader = /* glsl */ `
precision highp float;

${ZONE_UNIFORMS}

uniform vec3 uBase;
uniform vec3 uRim;

varying vec3 vPos;
varying vec3 vNormalView;
varying vec3 vViewDir;
varying float vFold;

float hash13(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  bool front = gl_FrontFacing;
  vec3 N = normalize(vNormalView);
  // Las caras internas (paredes de la cisura) se iluminan al revés y más oscuro.
  if (!front) N = -N;
  vec3 V = normalize(vViewDir);

  // Luz principal + relleno: sin esto las circunvoluciones no se leen.
  vec3 keyLight = normalize(vec3(-0.45, 0.8, 0.55));
  vec3 fillLight = normalize(vec3(0.75, -0.2, 0.35));
  float key = max(dot(N, keyLight), 0.0);
  float fill = max(dot(N, fillLight), 0.0);

  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);

  float grain = hash13(floor(vPos * 26.0));
  vec3 color = uBase * (0.42 + key * 1.25 + fill * 0.38 + grain * 0.05);

  // Oclusión en los surcos: los valles de las circunvoluciones quedan oscuros.
  float fold = smoothstep(0.08, 0.6, vFold);
  color *= mix(0.22, 1.0, fold);

  // Brillo húmedo muy sutil sobre las crestas.
  vec3 H = normalize(keyLight + V);
  color += vec3(0.35, 0.45, 0.8) * pow(max(dot(N, H), 0.0), 26.0) * 0.2 * fold;

  color += uRim * fresnel * 0.34;

  for (int i = 0; i < 6; i++) {
    float d = distance(vPos, uZonePos[i]);
    float halo = pow(smoothstep(0.85, 0.02, d), 2.2);
    float core = smoothstep(0.3, 0.0, d);
    float level = uLevel[i] * uReveal;
    float pulse = uPulse[i] * uReveal;

    color += uZoneColor[i] * (halo * (0.03 + level * 0.95) + core * level * 0.6);
    color += uZoneColor[i] * pulse * (halo * 1.1 + core * 1.6)
      * (0.72 + 0.28 * sin(uTime * 7.0 - d * 10.0));
  }

  // Vetas tenues que recorren la superficie.
  float veins = smoothstep(
    0.5,
    1.0,
    sin(vPos.x * 11.0 + uTime * 0.3) * sin(vPos.y * 13.0) * sin(vPos.z * 9.0)
  );
  color += uRim * veins * 0.05;

  // Las paredes internas de la cisura quedan en penumbra.
  color *= front ? 1.0 : 0.5;

  gl_FragColor = vec4(color, 1.0);
}
`;

export const nodeVertexShader = /* glsl */ `
${ZONE_UNIFORMS}

attribute float aSize;
attribute float aSeed;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewPosition;

  vec3 color = vec3(0.42, 0.5, 0.82) * 0.4;
  float energy = 0.0;

  for (int i = 0; i < 6; i++) {
    float d = distance(position, uZonePos[i]);
    float influence = pow(smoothstep(0.78, 0.0, d), 1.7);
    energy += influence * uLevel[i];
    color += uZoneColor[i] * influence
      * (0.12 + uLevel[i] * 0.95 + uPulse[i] * 1.35);
  }

  float twinkle = 0.68 + 0.32 * sin(uTime * (1.1 + aSeed * 2.2) + aSeed * 41.0);

  vColor = color;
  vAlpha = (0.32 + energy * 0.95) * twinkle * uReveal;
  gl_PointSize = aSize * (1.0 + energy * 1.2) * (34.0 / max(0.1, -viewPosition.z));
}
`;

export const nodeFragmentShader = /* glsl */ `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float alpha = pow(smoothstep(0.5, 0.0, d), 1.6);
  gl_FragColor = vec4(vColor, alpha * vAlpha);
}
`;
