import type { CategoryId } from "./riasec";

export interface Question {
  id: string;
  /** Afirmación en primera persona. */
  text: string;
  primary: CategoryId;
  secondary: CategoryId;
}

export const WEIGHTS = { primary: 3, secondary: 1 } as const;

export const SCALE = [
  { value: 0, label: "Nada", hint: "No me identifica" },
  { value: 1, label: "Poco", hint: "A veces" },
  { value: 2, label: "Bastante", hint: "Me identifica" },
  { value: 3, label: "Mucho", hint: "Es totalmente yo" },
] as const;

/** 18 afirmaciones: tres por cada interés RIASEC. */
export const QUESTIONS: Question[] = [
  {
    id: "q01",
    text: "Armar o reparar algo con mis propias manos.",
    primary: "R",
    secondary: "C",
  },
  {
    id: "q02",
    text: "Investigar un tema hasta entender cada detalle.",
    primary: "I",
    secondary: "C",
  },
  {
    id: "q03",
    text: "Crear algo original: una imagen, un texto, una canción.",
    primary: "A",
    secondary: "E",
  },
  {
    id: "q04",
    text: "Escuchar a alguien y ayudarlo a encontrar su camino.",
    primary: "S",
    secondary: "A",
  },
  {
    id: "q05",
    text: "Convencer a otros de una idea en la que creo.",
    primary: "E",
    secondary: "S",
  },
  {
    id: "q06",
    text: "Ordenar información y mantener todo bajo control.",
    primary: "C",
    secondary: "I",
  },
  {
    id: "q07",
    text: "Trabajar al aire libre, con herramientas o máquinas.",
    primary: "R",
    secondary: "E",
  },
  {
    id: "q08",
    text: "Resolver problemas complejos con datos y lógica.",
    primary: "I",
    secondary: "R",
  },
  {
    id: "q09",
    text: "Diseñar la estética de un proyecto de principio a fin.",
    primary: "A",
    secondary: "C",
  },
  {
    id: "q10",
    text: "Explicar algo hasta que la otra persona lo entienda.",
    primary: "S",
    secondary: "I",
  },
  {
    id: "q11",
    text: "Liderar un proyecto y tomar las decisiones difíciles.",
    primary: "E",
    secondary: "C",
  },
  {
    id: "q12",
    text: "Seguir un método claro y revisar que no haya errores.",
    primary: "C",
    secondary: "R",
  },
  {
    id: "q13",
    text: "Entender cómo funciona un motor, un circuito o una estructura.",
    primary: "R",
    secondary: "I",
  },
  {
    id: "q14",
    text: "Hacer experimentos para comprobar una idea.",
    primary: "I",
    secondary: "A",
  },
  {
    id: "q15",
    text: "Expresar ideas que no se pueden decir con palabras.",
    primary: "A",
    secondary: "S",
  },
  {
    id: "q16",
    text: "Coordinar un grupo para lograr un objetivo común.",
    primary: "S",
    secondary: "E",
  },
  {
    id: "q17",
    text: "Arriesgarme con algo propio aunque no haya garantías.",
    primary: "E",
    secondary: "R",
  },
  {
    id: "q18",
    text: "Planificar con presupuesto, plazos y detalles.",
    primary: "C",
    secondary: "E",
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
