import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateAssessmentResults, getInstantFeedback, type UserResponse, type AssessmentResults } from '../api/assessment-client';

export interface Question {
  id: string;
  type: 'slider' | 'dragAndDrop' | 'cardSort' | 'text' | 'multipleChoice';
  question: string;
  description?: string;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  dependsOn?: string;
  condition?: (prevResponse: any) => boolean;
}

interface AssessmentStore {
  currentQuestion: number;
  questions: Question[];
  responses: UserResponse[];
  isLoading: boolean;
  isAssessmentComplete: boolean;
  results: AssessmentResults | null;
  updateResults: (results: AssessmentResults) => void;
  
  setCurrentQuestion: (step: number) => void;
  setQuestions: (questions: Question[]) => void;
  addResponse: (response: UserResponse) => Promise<void>;
  getNextQuestion: () => Promise<void>;
  startAssessment: () => void;
  completeAssessment: () => Promise<AssessmentResults | null>;
  reset: () => void;
}

const initialQuestions: Question[] = [
  {
    id: "q1",
    type: "text",
    question: "¿Cuál es tu nombre?",
    required: true
  },
  {
    id: "q2",
    type: "slider",
    question: "¿Qué tanto disfrutas trabajar con otras personas?",
    description: "Evalúa tu preferencia por trabajar en equipo o de forma independiente.",
    min: 1,
    max: 10,
    step: 1,
    required: true
  },
  {
    id: "q3",
    type: "dragAndDrop",
    question: "Ordena estas actividades según tu preferencia",
    options: [
      { id: "act1", content: "Resolver problemas matemáticos o técnicos" },
      { id: "act2", content: "Crear o diseñar algo nuevo" },
      { id: "act3", content: "Ayudar o enseñar a otros" },
      { id: "act4", content: "Analizar datos y encontrar patrones" },
      { id: "act5", content: "Persuadir o influir en otros" }
    ],
    required: true
  },
  {
    id: "q4",
    type: "multipleChoice",
    question: "¿Qué áreas te interesan más?",
    description: "Puedes seleccionar hasta 3 opciones",
    options: [
      "Tecnología y Computación",
      "Ciencias Naturales",
      "Humanidades y Ciencias Sociales",
      "Artes y Diseño",
      "Negocios y Finanzas",
      "Salud y Medicina",
      "Educación",
      "Ingeniería"
    ],
    required: true
  },
  {
    id: "q5",
    type: "cardSort",
    question: "Ordena estos valores según su importancia para ti",
    options: [
      { id: "val1", content: "Creatividad e Innovación" },
      { id: "val2", content: "Estabilidad y Seguridad" },
      { id: "val3", content: "Libertad e Independencia" },
      { id: "val4", content: "Ayudar a otros e Impacto Social" },
      { id: "val5", content: "Reconocimiento y Prestigio" }
    ],
    required: true
  }
];

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      currentQuestion: 0,
      questions: initialQuestions,
      responses: [],
      isLoading: false,
      isAssessmentComplete: false,
      results: null,
      updateResults: (results) => set({ results }),
      
      setCurrentQuestion: (step) => set({ currentQuestion: step }),
      
      setQuestions: (questions) => set({ questions }),
      
      addResponse: async (response) => {
        const { responses, questions, currentQuestion } = get();
        
        console.log("📝 Añadiendo respuesta:", response);
        
        const existingIndex = responses.findIndex(r => r.questionId === response.questionId);
        
        let newResponses;
        if (existingIndex >= 0) {
          newResponses = [...responses];
          newResponses[existingIndex] = response;
        } else {
          newResponses = [...responses, response];
        }
        
        set({ responses: newResponses });
        
        // Feedback simplificado (SIN BLOQUEO)
        setTimeout(async () => {
          try {
            const userResponse: UserResponse = {
              questionId: response.questionId,
              type: response.type || 'text',
              value: response.value,
              timestamp: response.timestamp || Date.now()
            };
            const feedback = await getInstantFeedback(userResponse);
            console.log("💬 Feedback:", feedback);
          } catch (error) {
            console.warn("⚠️ Error al obtener feedback (no crítico):", error);
          }
        }, 100);
        
        // Verificar si es la última pregunta
        if (currentQuestion >= questions.length - 1) {
          console.log("🏁 Última pregunta alcanzada, completando evaluación...");
          // ESPERAR UN POCO antes de completar
          setTimeout(async () => {
            try {
              await get().completeAssessment();
            } catch (error) {
              console.error("❌ Error al completar evaluación:", error);
            }
          }, 500);
        }
      },
      
      getNextQuestion: async () => {
        const { currentQuestion, questions } = get();
        
        if (currentQuestion < questions.length - 1) {
          set({ currentQuestion: currentQuestion + 1 });
        }
      },
      
      startAssessment: () => {
        console.log("🚀 Iniciando nueva evaluación");
        set({
          currentQuestion: 0,
          responses: [],
          isAssessmentComplete: false,
          results: null,
          isLoading: false
        });
      },
        completeAssessment: async () => {
        const { responses } = get();
        
        console.log("🔄 Completando evaluación...");
        
        const validResponses = responses.filter(r => 
          r && 
          r.questionId && 
          r.type && 
          r.value !== undefined && 
          r.value !== null
        );
        
        if (validResponses.length === 0) {
          console.error('❌ No hay respuestas válidas');
          return null;
        }

        set({ isLoading: true });
        
        try {
          const results = await generateAssessmentResults(validResponses);
          
          if (!results) {
            throw new Error('No se pudieron generar los resultados');
          }

          console.log("✅ Resultados generados:", results);
          
          // MARCAR COMO COMPLETO INMEDIATAMENTE
          set({ 
            results,
            isAssessmentComplete: true,
            isLoading: false 
          });
          
          // Guardar en localStorage como backup
          if (typeof window !== 'undefined') {
            localStorage.setItem('assessment-completed', 'true');
            localStorage.setItem('assessment-results', JSON.stringify(results));
          }
          
          return results;
        } catch (error) {
          console.error("❌ Error al generar resultados:", error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      reset: () => {
        console.log("🔄 Reseteando evaluación");
        localStorage.removeItem('assessment-completed');
        localStorage.removeItem('assessment-results');
        set({
          currentQuestion: 0,
          questions: initialQuestions,
          responses: [],
          isAssessmentComplete: false,
          results: null,
          isLoading: false
        });
      }
    }),
    {
      name: 'vocational-assessment-store',
      partialize: (state) => ({
        responses: state.responses,
        results: state.results,
        isAssessmentComplete: state.isAssessmentComplete
      })
    }
  )
);
