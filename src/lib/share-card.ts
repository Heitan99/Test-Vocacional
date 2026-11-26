import { CATEGORIES, CATEGORY_IDS } from "./riasec";
import type { TestResult } from "./scoring";

const WIDTH = 1080;
const HEIGHT = 1350;

function rgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  colors: string[],
) {
  const nodes = CATEGORY_IDS.map((_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return {
      x: x + Math.cos(angle) * 16 * scale,
      y: y + Math.sin(angle) * 16 * scale,
      color: colors[index],
    };
  });

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.2;
  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(node.x, node.y);
    ctx.stroke();
  });

  nodes.forEach((node) => {
    ctx.beginPath();
    ctx.fillStyle = node.color;
    ctx.arc(node.x, node.y, 3.4 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(x, y, 4.2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Dibuja la tarjeta 1080×1350 lista para Instagram o para compartir. */
export async function renderShareCard(
  result: TestResult,
): Promise<HTMLCanvasElement> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el canvas");

  const family =
    typeof window !== "undefined"
      ? getComputedStyle(document.body).fontFamily || "sans-serif"
      : "sans-serif";

  const accent = CATEGORIES[result.top[0]].color;
  const secondary = CATEGORIES[result.top[1]].color;

  const font = (weight: number, size: number) => {
    ctx.font = `${weight} ${size}px ${family}`;
  };

  // Fondo
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#070912");
  background.addColorStop(0.55, "#080a15");
  background.addColorStop(1, "#04050a");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = (
    x: number,
    y: number,
    radius: number,
    color: string,
    alpha: number,
  ) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  };

  glow(WIDTH * 0.18, 120, 700, accent, 0.22);
  glow(WIDTH * 0.9, 420, 620, secondary, 0.16);
  glow(WIDTH * 0.5, 800, 620, "#5b6dff", 0.14);

  // Rejilla
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.028)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= WIDTH; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  // Marco
  ctx.save();
  roundRect(ctx, 36, 36, WIDTH - 72, HEIGHT - 72, 40);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Encabezado
  const logoColors = CATEGORY_IDS.map((id) => CATEGORIES[id].color);
  drawLogo(ctx, 92, 108, 1.15, logoColors);

  font(600, 34);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText("voca", 124, 110);

  font(500, 17);
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "4px";
  }
  ctx.textAlign = "right";
  ctx.fillText("TEST VOCACIONAL", WIDTH - 92, 110);
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "0px";
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.strokeStyle = "rgba(255,255,255,0.09)";
  ctx.beginPath();
  ctx.moveTo(92, 158);
  ctx.lineTo(WIDTH - 92, 158);
  ctx.stroke();

  // Perfil
  font(500, 19);
  ctx.fillStyle = rgba(accent, 0.85);
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "5px";
  }
  ctx.fillText("MI PERFIL VOCACIONAL", 92, 236);
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "0px";
  }

  let titleSize = 92;
  let titleLines: string[] = [];
  for (;;) {
    font(600, titleSize);
    titleLines = wrapText(ctx, result.profile.title, WIDTH - 184);
    if (titleLines.length <= 2 || titleSize <= 58) break;
    titleSize -= 6;
  }

  const titleTop = 306;
  const lineHeight = titleSize * 1.06;
  ctx.fillStyle = "#f6f8ff";
  titleLines.forEach((line, index) => {
    ctx.fillText(line, 92, titleTop + index * lineHeight);
  });

  const essenceY = titleTop + titleLines.length * lineHeight + 6;
  font(400, 30);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText(result.profile.essence, 92, essenceY);

  // Radar
  const cx = WIDTH / 2;
  const cy = Math.max(700, essenceY + 262);
  const radius = Math.min(166, 1010 - cy);
  const total = CATEGORY_IDS.length;
  const angleFor = (index: number) =>
    (Math.PI * 2 * index) / total - Math.PI / 2;
  const point = (index: number, value: number) => ({
    x: cx + Math.cos(angleFor(index)) * radius * value,
    y: cy + Math.sin(angleFor(index)) * radius * value,
  });

  // Halo detrás del radar
  glow(cx, cy, 360, accent, 0.16);

  ctx.save();
  [0.25, 0.5, 0.75, 1].forEach((ring) => {
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const { x, y } = point(i, ring);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle =
      ring === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.055)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  for (let i = 0; i < total; i++) {
    const { x, y } = point(i, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const dataPoints = CATEGORY_IDS.map((id, index) =>
    point(index, Math.max(0.06, result.affinity[id] / 100)),
  );

  ctx.beginPath();
  dataPoints.forEach(({ x, y }, index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();

  const fill = ctx.createLinearGradient(
    cx - radius,
    cy - radius,
    cx + radius,
    cy + radius,
  );
  fill.addColorStop(0, rgba(accent, 0.42));
  fill.addColorStop(1, rgba(secondary, 0.1));
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.save();
  ctx.shadowColor = rgba(accent, 0.8);
  ctx.shadowBlur = 26;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  dataPoints.forEach(({ x, y }, index) => {
    ctx.beginPath();
    ctx.fillStyle = CATEGORIES[CATEGORY_IDS[index]].color;
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Etiquetas del radar
  ctx.textAlign = "center";
  CATEGORY_IDS.forEach((id, index) => {
    const angle = angleFor(index);
    const lx = cx + Math.cos(angle) * (radius + 40);
    const ly = cy + Math.sin(angle) * (radius + 40);
    const value = result.affinity[id];

    font(500, 19);
    ctx.fillStyle = rgba(CATEGORIES[id].color, 0.9);
    ctx.fillText(
      CATEGORIES[id].name,
      lx,
      ly + (Math.sin(angle) > 0.4 ? 6 : -6),
    );

    font(400, 16);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(`${value}%`, lx, ly + (Math.sin(angle) > 0.4 ? 28 : 16));
  });
  ctx.textAlign = "left";

  // Carreras
  const careers = result.careers.slice(0, 3);
  const startY = 1052;

  font(500, 15);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "3px";
  }
  ctx.fillText("CARRERAS SUGERIDAS", 92, startY);
  if ("letterSpacing" in ctx) {
    (
      ctx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = "0px";
  }

  careers.forEach((career, index) => {
    const y = startY + 48 + index * 56;
    const color = CATEGORIES[career.category].color;

    ctx.beginPath();
    ctx.fillStyle = rgba(color, 0.9);
    ctx.arc(100, y - 8, 4, 0, Math.PI * 2);
    ctx.fill();

    font(500, 26);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    ctx.fillText(career.name, 120, y);

    font(500, 22);
    ctx.fillStyle = rgba(color, 0.9);
    ctx.textAlign = "right";
    ctx.fillText(`${career.match}%`, WIDTH - 92, y);
    ctx.textAlign = "left";

    ctx.strokeStyle = "rgba(255,255,255,0.055)";
    ctx.beginPath();
    ctx.moveTo(92, y + 24);
    ctx.lineTo(WIDTH - 92, y + 24);
    ctx.stroke();
  });

  // Pie
  font(400, 18);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText("18 preguntas · 3 minutos", 92, HEIGHT - 76);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillText("descubrí tu perfil", WIDTH - 92, HEIGHT - 76);
  ctx.textAlign = "left";

  return canvas;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen"));
    }, "image/png");
  });
}

export async function downloadShareCard(result: TestResult) {
  const canvas = await renderShareCard(result);
  const blob = await toBlob(canvas);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `voca-${slugify(result.profile.title)}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Usa la hoja de compartir nativa si acepta imágenes; si no, descarga. */
export async function shareResultCard(
  result: TestResult,
): Promise<"shared" | "downloaded"> {
  const canvas = await renderShareCard(result);
  const blob = await toBlob(canvas);
  const file = new File([blob], `voca-${slugify(result.profile.title)}.png`, {
    type: "image/png",
  });

  if (
    typeof navigator !== "undefined" &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "Mi perfil vocacional",
        text: `Mi perfil en voca es ${result.profile.title}.`,
      });
      return "shared";
    } catch {
      /* el usuario canceló: seguimos con la descarga */
    }
  }

  await downloadShareCard(result);
  return "downloaded";
}
