"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface SliderQuestionProps {
  min: number;
  max: number;
  step?: number;
  onResponse: (value: number) => void;
  initialValue?: number;
}

export function SliderQuestion({
  min,
  max,
  step = 1,
  onResponse,
  initialValue,
}: SliderQuestionProps) {
  const [value, setValue] = useState<number>(initialValue || Math.floor((max + min) / 2));

  // Actualizar el valor cuando cambia initialValue (por ejemplo, al volver a una pregunta anterior)
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    onResponse(newValue);
  };

  return (
    <div className="py-8">
      {/* Labels para explicar los extremos del slider */}
      <div className="flex justify-between mb-8 transition-all">
        <div className="p-2 bg-muted/30 dark:bg-muted/10 rounded-md border border-muted flex items-center">
          <span className="text-sm font-medium text-muted-foreground mr-1">{min}</span>
          <span className="text-xs">- Muy bajo</span>
        </div>
        <div className="p-2 bg-muted/30 dark:bg-muted/10 rounded-md border border-muted flex items-center">
          <span className="text-sm font-medium text-muted-foreground mr-1">{max}</span>
          <span className="text-xs">- Muy alto</span>
        </div>
      </div>
      
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        showLabels={true}
      />
      
      {/* Descripción del valor seleccionado */}
      <div className="mt-10 p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg transition-all">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span className="font-medium">Tu selección:</span>
          </div>
          <div className="text-xl font-bold text-primary">{value}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {value <= min + (max - min) * 0.2 && (
            <div className="flex items-center">
              <span className="mr-2">😕</span>
              <span>Muy bajo nivel de interés o habilidad en esta área.</span>
            </div>
          )}
          {value > min + (max - min) * 0.2 && value <= min + (max - min) * 0.4 && (
            <div className="flex items-center">
              <span className="mr-2">🙂</span>
              <span>Nivel bajo de interés o habilidad en esta área.</span>
            </div>
          )}
          {value > min + (max - min) * 0.4 && value <= min + (max - min) * 0.6 && (
            <div className="flex items-center">
              <span className="mr-2">😊</span>
              <span>Nivel medio de interés o habilidad en esta área.</span>
            </div>
          )}
          {value > min + (max - min) * 0.6 && value <= min + (max - min) * 0.8 && (
            <div className="flex items-center">
              <span className="mr-2">😃</span>
              <span>Nivel alto de interés o habilidad en esta área.</span>
            </div>
          )}
          {value > min + (max - min) * 0.8 && (
            <div className="flex items-center">
              <span className="mr-2">🤩</span>
              <span>Nivel muy alto de interés o habilidad en esta área.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
