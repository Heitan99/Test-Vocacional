/**
 * Modelo RIASEC adaptado al español.
 * Seis intereses, tres familias cromáticas y quince perfiles combinados.
 */

export type CategoryId = "R" | "I" | "A" | "S" | "E" | "C";
export type FamilyId = "tecnica" | "creativa" | "humana";

export const CATEGORY_IDS: CategoryId[] = ["R", "I", "A", "S", "E", "C"];

export interface Career {
  name: string;
  why: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  /** Verbo corto para titulares: "Construir", "Investigar"... */
  verb: string;
  family: FamilyId;
  color: string;
  /** Color con alfa, útil para fondos suaves. */
  soft: string;
  description: string;
  strengths: string[];
  careers: Career[];
}

export const FAMILIES: Record<
  FamilyId,
  { name: string; color: string; soft: string }
> = {
  tecnica: {
    name: "Ciencia y técnica",
    color: "#38b6ff",
    soft: "rgba(56, 182, 255, 0.14)",
  },
  creativa: {
    name: "Creación e impulso",
    color: "#ff4fa3",
    soft: "rgba(255, 79, 163, 0.14)",
  },
  humana: {
    name: "Personas y estructura",
    color: "#2fe6b1",
    soft: "rgba(47, 230, 177, 0.14)",
  },
};

export const CATEGORIES: Record<CategoryId, Category> = {
  R: {
    id: "R",
    name: "Realista",
    verb: "Construir",
    family: "tecnica",
    color: "#ff7a59",
    soft: "rgba(255, 122, 89, 0.14)",
    description:
      "Prefieres lo concreto: herramientas, máquinas, cuerpos y espacios reales. Aprendes haciendo y te gusta ver el resultado de tu trabajo.",
    strengths: ["Resolución práctica", "Coordinación física", "Autonomía"],
    careers: [
      {
        name: "Ingeniería industrial",
        why: "Diseñar y optimizar sistemas físicos con resultados medibles.",
      },
      {
        name: "Arquitectura técnica",
        why: "Convertir planos en espacios habitables y seguros.",
      },
      {
        name: "Mecánica y automoción",
        why: "Diagnosticar y reparar sistemas que se mueven.",
      },
      {
        name: "Gastronomía",
        why: "Trabajo manual, ritmo intenso y producto tangible.",
      },
    ],
  },
  I: {
    id: "I",
    name: "Investigador",
    verb: "Comprender",
    family: "tecnica",
    color: "#38b6ff",
    soft: "rgba(56, 182, 255, 0.14)",
    description:
      "Te mueve entender por qué las cosas funcionan. Disfrutas analizar, experimentar y resolver problemas que requieren paciencia y rigor.",
    strengths: ["Pensamiento analítico", "Curiosidad", "Precisión"],
    careers: [
      {
        name: "Ciencia de datos",
        why: "Encontrar patrones y convertir datos en decisiones.",
      },
      {
        name: "Medicina",
        why: "Diagnóstico basado en evidencia y razonamiento clínico.",
      },
      {
        name: "Biotecnología",
        why: "Investigar sistemas vivos para resolver problemas reales.",
      },
      {
        name: "Ciberseguridad",
        why: "Analizar amenazas y anticipar fallos antes de que ocurran.",
      },
    ],
  },
  A: {
    id: "A",
    name: "Artístico",
    verb: "Crear",
    family: "creativa",
    color: "#ff4fa3",
    soft: "rgba(255, 79, 163, 0.14)",
    description:
      "Necesitas expresar lo que ves de una forma que no existe todavía. Te atraen el diseño, la imagen, la palabra y los procesos abiertos.",
    strengths: ["Originalidad", "Sensibilidad estética", "Pensamiento lateral"],
    careers: [
      {
        name: "Diseño UX/UI",
        why: "Dar forma a experiencias digitales con criterio estético.",
      },
      {
        name: "Cine y audiovisual",
        why: "Contar historias combinando imagen, ritmo y sonido.",
      },
      {
        name: "Arquitectura",
        why: "Crear espacios que también son una idea.",
      },
      {
        name: "Producción musical",
        why: "Componer, mezclar y construir atmósferas sonoras.",
      },
    ],
  },
  S: {
    id: "S",
    name: "Social",
    verb: "Acompañar",
    family: "humana",
    color: "#2fe6b1",
    soft: "rgba(47, 230, 177, 0.14)",
    description:
      "Te realizas cuando el trabajo tiene personas al otro lado. Escuchas, enseñas y haces que un grupo funcione mejor.",
    strengths: ["Empatía", "Comunicación", "Facilitación"],
    careers: [
      {
        name: "Psicología",
        why: "Comprender y acompañar procesos humanos complejos.",
      },
      {
        name: "Docencia",
        why: "Explicar, motivar y ver crecer a otras personas.",
      },
      {
        name: "Trabajo social",
        why: "Diseñar soluciones junto a comunidades reales.",
      },
      {
        name: "Enfermería",
        why: "Cuidado directo con alto impacto cotidiano.",
      },
    ],
  },
  E: {
    id: "E",
    name: "Emprendedor",
    verb: "Impulsar",
    family: "creativa",
    color: "#ffc93c",
    soft: "rgba(255, 201, 60, 0.14)",
    description:
      "Te energiza convencer, liderar y mover recursos hacia una idea. Tomas decisiones con información incompleta y asumes el riesgo.",
    strengths: ["Iniciativa", "Persuasión", "Visión de conjunto"],
    careers: [
      {
        name: "Marketing y growth",
        why: "Entender audiencias y hacer crecer un producto.",
      },
      {
        name: "Emprendimiento",
        why: "Construir algo propio desde cero y validarlo.",
      },
      {
        name: "Derecho corporativo",
        why: "Negociar, argumentar y defender posiciones.",
      },
      {
        name: "Dirección de proyectos",
        why: "Alinear equipos, plazos y presupuestos hacia un objetivo.",
      },
    ],
  },
  C: {
    id: "C",
    name: "Convencional",
    verb: "Organizar",
    family: "humana",
    color: "#9b7bff",
    soft: "rgba(155, 123, 255, 0.14)",
    description:
      "Te gusta que las cosas estén bien hechas y a tiempo. Disfrutas los sistemas claros, los datos ordenados y la mejora continua.",
    strengths: ["Método", "Atención al detalle", "Confiabilidad"],
    careers: [
      {
        name: "Auditoría y contabilidad",
        why: "Revisar, cuadrar y garantizar que todo encaje.",
      },
      {
        name: "Análisis financiero",
        why: "Modelar escenarios con rigor y criterio.",
      },
      {
        name: "Logística",
        why: "Optimizar flujos, plazos y recursos.",
      },
      {
        name: "Gestión de calidad",
        why: "Definir procesos y verificar que se cumplan.",
      },
    ],
  },
};

export interface Profile {
  key: string;
  title: string;
  essence: string;
  description: string;
  keywords: string[];
}

/** Los quince pares posibles, en ambos órdenes. */
const PAIRS: Array<{
  pair: [CategoryId, CategoryId];
  title: string;
  essence: string;
  description: string;
  keywords: string[];
}> = [
  {
    pair: ["R", "I"],
    title: "Técnico-Analítico",
    essence: "Entiendes el mundo desarmándolo.",
    description:
      "Combinas curiosidad científica con capacidad de ejecución. Te gusta entender cómo funciona algo y luego mejorarlo con tus manos. Rindes mejor cuando el problema es real y la solución se puede probar.",
    keywords: ["Precisión", "Prueba y error", "Sistemas"],
  },
  {
    pair: ["R", "A"],
    title: "Artesano Creativo",
    essence: "Piensas con las manos.",
    description:
      "Tu creatividad pasa por lo material: prototipos, espacios, objetos. Necesitas ver y tocar lo que imaginas. Unes sensibilidad estética con oficio técnico.",
    keywords: ["Oficio", "Forma", "Prototipos"],
  },
  {
    pair: ["R", "S"],
    title: "Mentor Práctico",
    essence: "Enseñas haciendo.",
    description:
      "Aprendes en la práctica y disfrutas transmitirlo. Te resulta natural mostrarle a otro cómo se hace algo, con paciencia y ejemplos concretos.",
    keywords: ["Ejemplo", "Paciencia", "Trabajo en terreno"],
  },
  {
    pair: ["R", "E"],
    title: "Emprendedor Técnico",
    essence: "Conviertes ideas en cosas que funcionan.",
    description:
      "Tienes iniciativa y no le temes al trabajo concreto. Prefieres lanzar una versión imperfecta y mejorarla antes que quedarte en el plano teórico.",
    keywords: ["Ejecución", "Riesgo", "Resultados"],
  },
  {
    pair: ["R", "C"],
    title: "Especialista Preciso",
    essence: "El detalle es tu ventaja.",
    description:
      "Te lucen los procesos claros y la ejecución impecable. Donde otros ven rutina, tú ves un sistema que se puede perfeccionar.",
    keywords: ["Método", "Confiabilidad", "Mejora"],
  },
  {
    pair: ["I", "A"],
    title: "Creativo-Analítico",
    essence: "Piensas con rigor, creas con libertad.",
    description:
      "Tu mente combina dos motores poco habituales: el análisis profundo y la intuición creativa. Puedes diseccionar un problema y, al mismo tiempo, imaginar una solución que nadie había considerado.",
    keywords: ["Curiosidad", "Originalidad", "Síntesis"],
  },
  {
    pair: ["I", "S"],
    title: "Científico Humano",
    essence: "Investigas para mejorar vidas.",
    description:
      "Buscas evidencia y te importa el impacto en las personas. Te atraen los problemas complejos donde los datos y la empatía se necesitan mutuamente.",
    keywords: ["Evidencia", "Empatía", "Impacto"],
  },
  {
    pair: ["I", "E"],
    title: "Estratega Visionario",
    essence: "Analizas el presente, diseñas el futuro.",
    description:
      "Lees el panorama con datos y te animas a actuar. Te gusta convertir información en una apuesta clara y convencer a otros de seguirla.",
    keywords: ["Estrategia", "Decisión", "Liderazgo"],
  },
  {
    pair: ["I", "C"],
    title: "Analista Metódico",
    essence: "El orden también es inteligencia.",
    description:
      "Transformas información compleja en decisiones claras. Tu fortaleza es la constancia: revisas, verificas y construyes conclusiones que resisten preguntas.",
    keywords: ["Rigor", "Datos", "Consistencia"],
  },
  {
    pair: ["A", "S"],
    title: "Comunicador Creativo",
    essence: "Creas para conectar.",
    description:
      "Usas la creatividad como puente hacia otras personas. Te importa que tu trabajo se entienda, se sienta y provoque algo en quien lo recibe.",
    keywords: ["Narrativa", "Empatía", "Expresión"],
  },
  {
    pair: ["A", "E"],
    title: "Creador de Marca",
    essence: "Tu creatividad busca audiencia.",
    description:
      "No te alcanza con crear: quieres que tu idea circule y crezca. Unes criterio estético con olfato para el negocio y la comunicación.",
    keywords: ["Marca", "Iniciativa", "Audiencia"],
  },
  {
    pair: ["A", "C"],
    title: "Diseñador Sistemático",
    essence: "Estética y estructura, a la vez.",
    description:
      "Te obsesiona que algo sea bello y funcione. Disfrutas construir sistemas de diseño, bibliotecas y procesos que sostienen la creatividad en el tiempo.",
    keywords: ["Sistemas", "Detalle", "Coherencia"],
  },
  {
    pair: ["S", "E"],
    title: "Líder Social",
    essence: "Movilizas personas hacia un propósito.",
    description:
      "Te importa el grupo y sabes cómo activarlo. Combinas escucha genuina con la decisión de tomar la iniciativa cuando hace falta.",
    keywords: ["Propósito", "Equipo", "Influencia"],
  },
  {
    pair: ["S", "C"],
    title: "Gestor Humano",
    essence: "Cuidas a las personas y los procesos.",
    description:
      "Organizas sin perder de vista a quién afecta cada decisión. Eres la persona que sostiene la cultura de un equipo mientras el trabajo avanza.",
    keywords: ["Cuidado", "Orden", "Confianza"],
  },
  {
    pair: ["E", "C"],
    title: "Ejecutivo Organizado",
    essence: "Decides rápido, ejecutas con método.",
    description:
      "Tienes ambición y la aterrizas en planes concretos. Sabes priorizar, medir y corregir el rumbo sin perder el objetivo de vista.",
    keywords: ["Ambición", "Método", "Resultados"],
  },
];

export const PROFILES: Record<string, Profile> = PAIRS.reduce(
  (acc, item) => {
    const [a, b] = item.pair;
    const base = {
      title: item.title,
      essence: item.essence,
      description: item.description,
      keywords: item.keywords,
    };
    acc[`${a}${b}`] = { key: `${a}${b}`, ...base };
    acc[`${b}${a}`] = { key: `${a}${b}`, ...base };
    return acc;
  },
  {} as Record<string, Profile>,
);

export function getProfile(first: CategoryId, second: CategoryId): Profile {
  return (
    PROFILES[`${first}${second}`] ?? {
      key: `${first}${second}`,
      title: CATEGORIES[first].name,
      essence: "Un perfil con un interés dominante claro.",
      description: CATEGORIES[first].description,
      keywords: CATEGORIES[first].strengths,
    }
  );
}
