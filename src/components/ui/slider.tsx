"use client";

import * as React from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  showLabels = false,
  minLabel,
  maxLabel,
}: SliderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(event.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      updateValue(event.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsDragging(true);
    updateValue(event.touches[0].clientX);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (isDragging) {
      updateValue(event.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const sliderWidth = rect.width;
    const position = Math.max(0, Math.min(sliderWidth, clientX - rect.left));
    const newPercentage = position / sliderWidth;
    let newValue = min + newPercentage * (max - min);

    // Snap to step increment
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }

    // Ensure value is within bounds
    newValue = Math.max(min, Math.min(max, newValue));
    
    onChange(newValue);
  };

  React.useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full px-1 py-4">
      {label && (
        <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
      )}
      <div className="relative w-full h-12">
        {/* Track background */}
        <div
          ref={sliderRef}
          className="absolute inset-0 h-2 bg-muted rounded-full cursor-pointer mt-5"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Filled track */}
          <div
            className="absolute h-2 bg-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Thumb */}
          <div
            ref={thumbRef}
            className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary shadow transform -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-grab ${
              isDragging ? "cursor-grabbing scale-110" : ""
            }`}
            style={{ left: `${percentage}%` }}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            tabIndex={0}
          />
        </div>
        
        {/* Value indicator */}
        <div 
          className="absolute -bottom-1 left-0 w-full flex justify-center mt-4 text-sm font-medium text-foreground transition-all duration-200"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
          <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground">
            {value}
          </span>
        </div>
        
        {/* Min/Max labels */}
        {showLabels && (
          <div className="absolute w-full flex justify-between text-xs text-muted-foreground mt-8">
            <span>{minLabel || min}</span>
            <span>{maxLabel || max}</span>
          </div>
        )}
      </div>
    </div>
  );
}
