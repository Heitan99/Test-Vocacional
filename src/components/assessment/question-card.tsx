"use client";

import { useState, useEffect } from "react";
import { Question } from "@/lib/store/assessment-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SliderQuestion } from "./question-types/slider-question";
import { DragAndDropQuestion } from "./question-types/drag-and-drop-question";
import { CardSortQuestion } from "./question-types/card-sort-question";
import { TextQuestion } from "./question-types/text-question";
import { MultipleChoiceQuestion } from "./question-types/multiple-choice-question";

interface QuestionCardProps {
  question: Question;
  onResponse: (response: any) => void;
  currentResponse?: any;
}

export function QuestionCard({ question, onResponse, currentResponse }: QuestionCardProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [animateCard, setAnimateCard] = useState(false);

  // Efecto para limpiar el feedback cuando cambia la pregunta
  useEffect(() => {
    setFeedbackMessage(null);
    
    // Iniciar animación de entrada al cambiar de pregunta
    setAnimateCard(true);
    const timer = setTimeout(() => {
      setAnimateCard(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [question.id]);

  // Función para mostrar la retroalimentación
  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    
    // Ocultar el mensaje después de unos segundos
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };
  
  // Verificar si es una pregunta de nombre
  const isNameQuestion = question.type === "text" && 
    (question.question.toLowerCase().includes("nombre") || question.id === "q1");
  
  // Clases condicionales para la tarjeta
  const getCardClasses = () => {
    let baseClasses = "w-full transition-all duration-500 border";
    
    if (isNameQuestion) {
      baseClasses += " border-primary/30 shadow-lg dark:shadow-primary/5";
    } else {
      baseClasses += " border-muted/20";
    }
    
    if (animateCard) {
      baseClasses += " card-hover";
    }
    
    return baseClasses;
  };
  
  // Renderizar el componente adecuado según el tipo de pregunta
  const renderQuestionComponent = () => {
    switch (question.type) {
      case "slider":
        return (
          <SliderQuestion
            min={question.min || 0}
            max={question.max || 10}
            step={question.step || 1}
            onResponse={(value) => {
              onResponse(value);
              showFeedback(`Has seleccionado: ${value}`);
            }}
            initialValue={currentResponse}
          />
        );
      case "dragAndDrop":
        return (
          <DragAndDropQuestion
            options={question.options || []}
            onResponse={(value) => {
              onResponse(value);
              showFeedback("¡Excelente organización!");
            }}
            initialValue={currentResponse}
          />
        );
      case "cardSort":
        return (
          <CardSortQuestion
            cards={question.options || []}
            onResponse={(value) => {
              onResponse(value);
              showFeedback("¡Orden guardado correctamente!");
            }}
            initialValue={currentResponse}
          />
        );
      case "multipleChoice":
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            onResponse={(value) => {
              onResponse(value);
              showFeedback("¡Selección guardada!");
            }}
            initialValue={currentResponse}
          />
        );
      case "text":
      default:
        return (
          <TextQuestion
            onResponse={(value) => {
              onResponse(value);
              const feedbackMessage = isNameQuestion 
                ? `¡Hola, ${value}! Encantado de conocerte.` 
                : "¡Respuesta guardada!";
              showFeedback(feedbackMessage);
            }}
            initialValue={currentResponse}
            isName={isNameQuestion}
            placeholder={isNameQuestion ? "Escribe tu nombre aquí..." : "Escribe tu respuesta aquí..."}
          />
        );
    }
  };

  return (
    <Card className={getCardClasses()}>
      <CardHeader className={`${isNameQuestion ? 'pb-2 pt-6' : ''} ${isNameQuestion ? 'bg-primary/5 dark:bg-primary/10 rounded-t-lg' : ''}`}>
        <CardTitle className={`text-2xl ${isNameQuestion ? 'text-primary text-center mb-4' : ''}`}>
          {isNameQuestion ? '👋 ' : ''}{question.question}
        </CardTitle>
        {question.description && (
          <CardDescription className={isNameQuestion ? 'text-center' : ''}>
            {question.description}
          </CardDescription>
        )}
        {isNameQuestion && !question.description && (
          <CardDescription className="text-center">
            Nos encantaría conocerte. Tu nombre nos ayudará a personalizar esta experiencia para ti.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={`${isNameQuestion ? 'pt-6 pb-6' : 'py-6'} ${isNameQuestion ? 'bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10' : ''}`}>
        {renderQuestionComponent()}
        
        {/* Retroalimentación */}
        {feedbackMessage && (
          <div className="mt-6 p-3 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-md text-center animate-fadeIn">
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-primary font-medium">{feedbackMessage}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
