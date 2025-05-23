"use client";

import { useState, useEffect } from "react";
import { animate } from "motion";

interface MultipleChoiceQuestionProps {
  options: string[];
  onResponse: (value: string[]) => void;
  initialValue?: string[];
  maxSelections?: number;
}

export function MultipleChoiceQuestion({
  options,
  onResponse,
  initialValue,
  maxSelections = 3,
}: MultipleChoiceQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialValue || []);
  
  // Actualizar el estado cuando cambia initialValue
  useEffect(() => {
    if (initialValue) {
      setSelectedOptions(initialValue);
    }
  }, [initialValue]);

  const toggleOption = (option: string) => {
    // Si ya está seleccionada, deseleccionarla
    if (selectedOptions.includes(option)) {
      const updatedOptions = selectedOptions.filter((item) => item !== option);
      setSelectedOptions(updatedOptions);
      onResponse(updatedOptions);
    } 
    // Si no está seleccionada y no hemos alcanzado el máximo, seleccionarla
    else if (selectedOptions.length < maxSelections) {
      const updatedOptions = [...selectedOptions, option];
      setSelectedOptions(updatedOptions);
      onResponse(updatedOptions);
      
      // Animar el elemento seleccionado
      const element = document.getElementById(`option-${option.replace(/\s+/g, '-').toLowerCase()}`);
      if (element) {
        animate(
          element,
          { scale: [1, 1.05, 1] },
          { duration: 0.3 }
        );
      }
    }
  };

  return (
    <div className="py-4">
      <div className="mb-6 bg-muted/30 dark:bg-muted/10 rounded-lg p-4 border border-muted">
        <div className="flex items-center mb-2">
          <span className="mr-2 text-primary">📋</span>
          <p className="text-muted-foreground">
            Selecciona hasta <span className="font-medium text-primary">{maxSelections}</span> opciones que mejor se adapten a tus preferencias.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tu progreso:</span>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mr-3">
              <div 
                className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all"
                style={{ width: `${(selectedOptions.length / maxSelections) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-primary">
              {selectedOptions.length}/{maxSelections}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          const optionId = `option-${option.replace(/\s+/g, '-').toLowerCase()}`;
          
          return (
            <div
              key={option}
              id={optionId}
              className={`
                relative p-4 rounded-lg cursor-pointer border-2 transition-all duration-300
                ${isSelected 
                  ? "border-primary bg-primary/10 shadow-md dark:bg-primary/5" 
                  : "border-muted hover:border-primary/50 hover:bg-muted/10"}
              `}
              onClick={() => toggleOption(option)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected ? "border-primary" : "border-muted-foreground"}
                  `}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                  )}
                </div>
                <span className={`transition-all ${isSelected ? "font-medium text-primary" : ""}`}>{option}</span>
              </div>
              {isSelected && (
                <span className="absolute top-1 right-2 text-xs text-primary font-medium">seleccionado</span>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedOptions.length === maxSelections && (
        <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Has alcanzado el máximo de selecciones permitidas. Deselecciona alguna opción si quieres cambiar tu elección.</span>
        </div>
      )}
    </div>
  );
}
