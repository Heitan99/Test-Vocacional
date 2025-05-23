"use client";

import { useState, useEffect } from "react";
import { useAssessmentStore } from "@/lib/store/assessment-store";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/assessment/question-card";

export default function AssessmentPage() {  
  const { 
    questions, 
    currentQuestion, 
    setCurrentQuestion, 
    responses,
    addResponse, 
    isLoading,
    isAssessmentComplete,
    completeAssessment,
    startAssessment,
    results,
  } = useAssessmentStore();
  
  const [fadeOut, setFadeOut] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const initAssessment = async () => {
      // Si hay resultados y la evaluación está completa, redirigir inmediatamente
      if (isAssessmentComplete && results) {
        console.log("Evaluación completa, redirigiendo a resultados", { results });
        window.location.href = "/results";
        return;
      }
      
      // Si estamos en la página de evaluación y hay una evaluación completa, reiniciar
      if (isAssessmentComplete && window.location.pathname === '/assessment') {
        console.log("Reiniciando evaluación para permitir una nueva");
        startAssessment();
        return;
      }
      
      // Si no hay respuestas y no está completa, iniciar nueva evaluación
      if (responses.length === 0 && !isAssessmentComplete) {
        console.log("Iniciando nueva evaluación");
        startAssessment();
      }
    };
    
    // Ejecutar inmediatamente
    initAssessment();
  }, [isAssessmentComplete, results, responses.length, startAssessment]);
  const handleNext = async () => {
    setDirection('next');
    setFadeOut(true);
    setAnimationKey(prev => prev + 1);
    
    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFadeOut(false);
      } else {
        console.log("Completando evaluación desde handleNext");
        try {
          const generatedResults = await completeAssessment();
          console.log("¿Evaluación completada?", isAssessmentComplete);
          console.log("Resultados generados:", generatedResults);
          
          // Forzar redirección a resultados si se generaron correctamente
          if (generatedResults) {
            console.log("Redirigiendo a resultados...");
            window.location.href = "/results";
            return;
          }
          
        } catch (error: any) {
          console.error("Error al completar la evaluación:", error);
          setFadeOut(false);
          
          // Verificar si es un error de cuota excedida
          const message = typeof error === 'string' ? error : error?.message || '';
          if (message.includes('QUOTA_EXCEEDED') || message.includes('429') || message.includes('cuota')) {
            const providerName = message.includes('Gemini') ? 'Google Gemini' : 
                               message.includes('OpenAI') ? 'OpenAI' : 
                               message.includes('Claude') ? 'Claude' : 'del servicio de IA';
            
            alert(`Se ha alcanzado el límite de uso ${providerName}. Generando un análisis básico basado en tus respuestas...`);
            
            // Intentar completar la evaluación nuevamente con el modo de respaldo
            try {
              const fallbackResults = await completeAssessment();
              if (fallbackResults) {
                console.log("Resultados de respaldo generados, redirigiendo...");
                window.location.href = "/results";
                return;
              }
            } catch (secondError) {
              console.error("Error en segundo intento:", secondError);
              alert("Hubo un error al procesar tus respuestas. Por favor, inténtalo de nuevo más tarde.");
            }
          } else {
            alert("Hubo un error al procesar tus respuestas. Por favor, inténtalo de nuevo.");
          }
          setFadeOut(false);
        }
      }
    }, 400);
  };

  const handlePrevious = () => {
    // Animación de salida
    setDirection('prev');
    setFadeOut(true);
    setAnimationKey(prev => prev + 1);
    
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
      setFadeOut(false);
    }, 400);
  };  const handleResponse = async (response: any) => {
    await addResponse({
      questionId: questions[currentQuestion].id,
      type: questions[currentQuestion].type,
      value: response,
      timestamp: Date.now()
    });
  };

  if (questions.length === 0) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Cargando evaluación...</h1>
          <div className="mx-auto w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const hasResponse = responses.some(r => r.questionId === currentQuestionData.id);
  const isLastQuestion = currentQuestion === questions.length - 1;
  
  // Clases de animación basadas en la dirección
  const getAnimationClasses = () => {
    if (fadeOut) {
      return direction === 'next' 
        ? 'opacity-0 transform translate-x-10' 
        : 'opacity-0 transform -translate-x-10';
    }
    return 'opacity-100 transform translate-x-0';
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-10">
        <ProgressIndicator 
          currentStep={currentQuestion + 1} 
          totalSteps={questions.length} 
        />
      </div>

      <div 
        key={animationKey}
        className={`transition-all duration-400 ease-in-out ${getAnimationClasses()}`}
      >
        <div className="bg-background dark:bg-background border border-muted/20 shadow-md dark:shadow-lg rounded-lg overflow-hidden">
          <QuestionCard 
            question={currentQuestionData} 
            onResponse={handleResponse}
            currentResponse={responses.find(r => r.questionId === currentQuestionData.id)?.value}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0 || isLoading}
          className="relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <span className="relative flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Anterior
          </span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!hasResponse || isLoading}
          isLoading={isLoading}
          className="relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-primary/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <span className="relative flex items-center">
            {isLastQuestion ? "Finalizar" : "Siguiente"}
            {!isLastQuestion && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
}
