"use client";

import React, { useEffect, useRef } from "react";
import { animate } from "motion";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  showStepLabels?: boolean;
  showPercentage?: boolean;
  stepLabels?: string[];
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  showStepLabels = true,
  showPercentage = true,
  stepLabels,
  className = "",
}: ProgressIndicatorProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const completedPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (progressBarRef.current) {
      animate(
        progressBarRef.current,
        { transform: `scaleX(${completedPercentage / 100})` } as any,
        { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
      );
    }
  }, [currentStep, totalSteps, completedPercentage]);

  const renderSteps = () => {
    return Array.from({ length: totalSteps }, (_, index) => {
      const isCurrent = index + 1 === currentStep;
      const isCompleted = index + 1 < currentStep;

      return (
        <div 
          key={index} 
          className={`relative flex flex-col items-center ${index === 0 ? 'ml-0' : ''}`}
          style={{ width: `${100 / totalSteps}%` }}
        >
          <div 
            className={`
              h-6 w-6 rounded-full flex items-center justify-center z-10 transition-all duration-300
              ${isCompleted 
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                : isCurrent 
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse" 
                  : "bg-muted text-muted-foreground"}
            `}
          >
            {isCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span className="text-xs">{index + 1}</span>
            )}
          </div>
          
          {showStepLabels && (
            <span className={`absolute mt-8 text-xs text-center w-full px-1 transition-all duration-300
              ${isCurrent ? "font-medium text-foreground" : "text-muted-foreground"}
            `}>
              {stepLabels && stepLabels[index] ? stepLabels[index] : `Paso ${index + 1}`}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative mb-10">
        {/* Progress bar background */}
        <div className="absolute top-3 left-0 h-1 w-full bg-muted rounded-full overflow-hidden" />
        
        {/* Active progress bar */}
        <div 
          ref={progressBarRef}
          className="absolute top-3 left-0 h-1 bg-gradient-to-r from-primary/80 to-primary rounded-full origin-left progress-bar-animated" 
          style={{ width: `${completedPercentage}%` }}
        />
        
        {/* Step indicators */}
        <div className="relative flex justify-between">
          {renderSteps()}
        </div>      
      </div>
      
      {showPercentage && (
        <div className="flex justify-between items-center text-sm">
          <div className="text-muted-foreground flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <span>{currentStep} de {totalSteps} completados</span>
          </div>
          <div className="font-medium px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {Math.round(completedPercentage)}% completado
          </div>
        </div>
      )}
    </div>
  );
}
