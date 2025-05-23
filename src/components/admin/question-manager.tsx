// filepath: c:\Users\alexa\test-voca2.0\src\components\admin\question-manager.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// Tipos para las preguntas
interface Question {
  id: string;
  type: "slider" | "dragAndDrop" | "cardSort" | "text" | "multipleChoice";
  question: string;
  category: string;
  options?: { id: string; text: string }[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  created: string;
  active: boolean;
}

// Datos simulados
const mockQuestions: Question[] = [
  {
    id: "q1",
    type: "slider",
    question: "¿Qué tanto disfrutas resolver problemas lógicos?",
    category: "Habilidades Analíticas",
    min: 1,
    max: 10,
    minLabel: "No me gusta",
    maxLabel: "Me encanta",
    created: "2025-03-15",
    active: true,
  },
  {
    id: "q2",
    type: "multipleChoice",
    question: "Entre estas opciones, ¿cuál te resulta más interesante?",
    category: "Intereses Profesionales",
    options: [
      { id: "opt1", text: "Analizar datos y encontrar patrones" },
      { id: "opt2", text: "Diseñar interfaces y experiencias de usuario" },
      { id: "opt3", text: "Coordinar proyectos y liderar equipos" },
      { id: "opt4", text: "Investigar y experimentar con nuevas tecnologías" },
    ],
    created: "2025-03-20",
    active: true,
  },
  {
    id: "q3",
    type: "text",
    question: "Describe brevemente cuál sería tu entorno de trabajo ideal",
    category: "Preferencias Laborales",
    created: "2025-04-01",
    active: true,
  },
  {
    id: "q4",
    type: "cardSort",
    question: "Ordena estas actividades según tus preferencias",
    category: "Intereses",
    options: [
      { id: "card1", text: "Desarrollar código" },
      { id: "card2", text: "Diseñar interfaces" },
      { id: "card3", text: "Analizar datos" },
      { id: "card4", text: "Gestionar proyectos" },
    ],
    created: "2025-04-05",
    active: false,
  },
];

export function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  // Filtrar preguntas según búsqueda y filtro
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "active" && q.active) || 
                         (filter === "inactive" && !q.active) ||
                         (filter === q.type);
    return matchesSearch && matchesFilter;
  });

  // Eliminar una pregunta
  const deleteQuestion = (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  // Cambiar estado activo/inactivo
  const toggleActive = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, active: !q.active } : q))
    );
  };

  // Renderizar tipo de pregunta en español
  const getQuestionTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      slider: "Deslizador",
      dragAndDrop: "Arrastrar y Soltar",
      cardSort: "Ordenar Tarjetas",
      text: "Texto",
      multipleChoice: "Opción Múltiple",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Buscar preguntas..."
              className="w-full pl-10 rounded-md border border-input bg-transparent px-3 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            className="rounded-md border border-input bg-transparent px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            <option value="slider">Deslizador</option>
            <option value="dragAndDrop">Arrastrar y soltar</option>
            <option value="cardSort">Ordenar tarjetas</option>
            <option value="text">Texto</option>
            <option value="multipleChoice">Opción múltiple</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Nueva Pregunta
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Card key={question.id} className={!question.active ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle>{question.question}</CardTitle>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        {getQuestionTypeLabel(question.type)}
                      </span>
                      <span>{question.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(question.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        question.active
                          ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {question.active ? "Activo" : "Inactivo"}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {question.type === "multipleChoice" && question.options && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Opciones:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className="bg-muted/30 p-2 rounded text-sm"
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === "slider" && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Rango:</h4>
                    <div className="flex justify-between text-sm">
                      <span>
                        {question.minLabel} ({question.min})
                      </span>
                      <span>
                        {question.maxLabel} ({question.max})
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Creado: {question.created}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No se encontraron preguntas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredQuestions.length} de {questions.length} preguntas
        </div>
        <Button variant="outline">Cargar Más</Button>
      </div>
    </div>
  );
}
