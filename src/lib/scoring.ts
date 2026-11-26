import {
  CATEGORIES,
  CATEGORY_IDS,
  getProfile,
  type Career,
  type CategoryId,
  type Profile,
} from "./riasec";
import { QUESTIONS, WEIGHTS, type Question } from "./questions";

export type Scores = Record<CategoryId, number>;
export type Answers = Record<string, number>;

export interface RankedCategory {
  id: CategoryId;
  name: string;
  color: string;
  /** Afinidad relativa 0-100 (el interés más alto = 100). */
  value: number;
}

export interface SuggestedCareer extends Career {
  match: number;
  category: CategoryId;
  color: string;
}

export interface TestResult {
  profile: Profile;
  scores: Scores;
  affinity: Scores;
  ranked: RankedCategory[];
  top: [CategoryId, CategoryId];
  careers: SuggestedCareer[];
  /** Diferencia entre el interés más alto y el más bajo: mide lo definido del perfil. */
  spread: number;
  balanced: boolean;
  answeredAt: string;
}

function emptyScores(): Scores {
  return CATEGORY_IDS.reduce((acc, id) => {
    acc[id] = 0;
    return acc;
  }, {} as Scores);
}

/** Puntaje máximo alcanzable por categoría según el peso de cada pregunta. */
export function maxScores(questions: Question[] = QUESTIONS): Scores {
  const max = emptyScores();
  for (const question of questions) {
    max[question.primary] += WEIGHTS.primary * 3;
    max[question.secondary] += WEIGHTS.secondary * 3;
  }
  return max;
}

/**
 * Calcula el perfil a partir de las respuestas.
 * Cada respuesta vale 0-3 y se pondera: 3 para el interés principal, 1 para el secundario.
 */
export function scoreAnswers(answers: Answers): TestResult {
  const raw = emptyScores();

  for (const question of QUESTIONS) {
    const level = answers[question.id];
    if (typeof level !== "number" || Number.isNaN(level)) continue;
    const value = Math.min(3, Math.max(0, Math.round(level)));
    raw[question.primary] += value * WEIGHTS.primary;
    raw[question.secondary] += value * WEIGHTS.secondary;
  }

  return buildResult(raw);
}

export function buildResult(raw: Scores): TestResult {
  const top = Math.max(...CATEGORY_IDS.map((id) => raw[id]), 0);
  const affinity = emptyScores();

  for (const id of CATEGORY_IDS) {
    // Relativo al interés dominante: el más alto siempre llega a 100.
    affinity[id] = top > 0 ? Math.max(4, Math.round((raw[id] / top) * 100)) : 0;
  }

  const ranked: RankedCategory[] = [...CATEGORY_IDS]
    .sort(
      (a, b) =>
        raw[b] - raw[a] || CATEGORY_IDS.indexOf(a) - CATEGORY_IDS.indexOf(b),
    )
    .map((id) => ({
      id,
      name: CATEGORIES[id].name,
      color: CATEGORIES[id].color,
      value: affinity[id],
    }));

  const [first, second] = ranked;
  const spread = first.value - ranked[ranked.length - 1].value;

  return {
    profile: getProfile(first.id, second.id),
    scores: raw,
    affinity,
    ranked,
    top: [first.id, second.id],
    careers: suggestCareers(ranked, affinity),
    spread,
    balanced: spread < 25,
    answeredAt: new Date().toISOString(),
  };
}

/** Toma 2 carreras del interés principal, 2 del segundo y 1 del tercero. */
function suggestCareers(
  ranked: RankedCategory[],
  affinity: Scores,
): SuggestedCareer[] {
  const plan: Array<[number, number]> = [
    [0, 2],
    [1, 2],
    [2, 1],
  ];
  const picked: SuggestedCareer[] = [];

  for (const [rank, count] of plan) {
    const entry = ranked[rank];
    if (!entry) continue;
    const careers = CATEGORIES[entry.id].careers.slice(0, count);
    careers.forEach((career, index) => {
      picked.push({
        ...career,
        category: entry.id,
        color: CATEGORIES[entry.id].color,
        match: Math.max(40, affinity[entry.id] - index * 4),
      });
    });
  }

  return picked.sort((a, b) => b.match - a.match).slice(0, 5);
}

/** Reconstruye un resultado desde un enlace compartido (solo afinidades). */
export function resultFromAffinity(values: number[]): TestResult {
  const raw = emptyScores();
  CATEGORY_IDS.forEach((id, index) => {
    raw[id] = Math.max(0, Math.round(values[index] ?? 0));
  });
  return buildResult(raw);
}

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every(
    (question) => typeof answers[question.id] === "number",
  );
}

export function answeredCount(answers: Answers): number {
  return QUESTIONS.filter(
    (question) => typeof answers[question.id] === "number",
  ).length;
}
