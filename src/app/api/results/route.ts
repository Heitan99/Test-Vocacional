import { NextResponse } from "next/server";
import { CATEGORY_IDS, type CategoryId } from "@/lib/riasec";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface StoredResult {
  id: string;
  profile: string;
  top: [CategoryId, CategoryId];
  affinity: Record<CategoryId, number>;
  createdAt: string;
}

/**
 * Almacenamiento en memoria: sirve para el MVP. En serverless cada instancia
 * tiene el suyo, así que en producción conviene cambiarlo por una base real.
 */
const globalStore = globalThis as typeof globalThis & {
  __vocaResults?: Map<string, StoredResult>;
};
const store = globalStore.__vocaResults ?? new Map<string, StoredResult>();
globalStore.__vocaResults = store;

const MAX_ENTRIES = 500;

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function isCategoryId(value: unknown): value is CategoryId {
  return (
    typeof value === "string" && CATEGORY_IDS.includes(value as CategoryId)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const payload = body as {
    profile?: unknown;
    affinity?: unknown;
    top?: unknown;
  };

  if (typeof payload.profile !== "string" || !payload.affinity) {
    return NextResponse.json(
      { error: "Faltan el perfil o las afinidades" },
      { status: 400 },
    );
  }

  const source = payload.affinity as Record<string, unknown>;
  const affinity = {} as Record<CategoryId, number>;

  for (const id of CATEGORY_IDS) {
    const value = Number(source[id]);
    if (!Number.isFinite(value)) {
      return NextResponse.json(
        { error: `Afinidad inválida para ${id}` },
        { status: 400 },
      );
    }
    affinity[id] = Math.max(0, Math.min(100, Math.round(value)));
  }

  const providedTop = Array.isArray(payload.top)
    ? payload.top.filter(isCategoryId)
    : [];

  const fallbackTop = [...CATEGORY_IDS].sort(
    (a, b) => affinity[b] - affinity[a],
  );

  const top: [CategoryId, CategoryId] = [
    providedTop[0] ?? fallbackTop[0],
    providedTop[1] ?? fallbackTop[1],
  ];

  const id = makeId();
  const result: StoredResult = {
    id,
    profile: payload.profile.slice(0, 64),
    top,
    affinity,
    createdAt: new Date().toISOString(),
  };

  store.set(id, result);

  // Descarta los más viejos si el Map crece demasiado.
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }

  return NextResponse.json(
    { id, url: `/resultado?r=${id}` },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const result = store.get(id);

  if (!result) {
    return NextResponse.json(
      { error: "Resultado no encontrado" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { result },
    { headers: { "Cache-Control": "no-store" } },
  );
}
