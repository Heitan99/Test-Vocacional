"use client";

import { useState, useEffect } from "react";

interface TextQuestionProps {
  onResponse: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
  isName?: boolean;
}

export function TextQuestion({ 
  onResponse, 
  initialValue,
  placeholder = "Escribe tu respuesta aquí...",
  isName = false
}: TextQuestionProps) {
  const [text, setText] = useState<string>(initialValue || "");
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Actualizar el recuento de caracteres cuando cambia el texto
  useEffect(() => {
    setCharacterCount(text.length);
  }, [text]);
  
  // Actualizar el valor cuando cambia initialValue
  useEffect(() => {
    if (initialValue !== undefined) {
      setText(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (text.trim()) {
      onResponse(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onResponse(text);
    }
  };
  return (
    <div className="space-y-4">
      {isName ? (
        <div className="relative transition-all">
          <div className={`absolute inset-0 bg-primary/5 rounded-lg -z-10 transition-all ${isFocused ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              value={text}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className="w-full p-3 text-lg border-b-2 border-primary/20 focus:border-primary bg-transparent focus:outline-none transition-all"
              placeholder={placeholder}
              type="text"
            />
          </div>
          <div className="flex justify-between items-center pl-12 text-sm text-muted-foreground mt-2">
            <span>Tu nombre nos ayudará a personalizar los resultados</span>
            {text && <span className="text-primary font-medium">¡Gracias, {text}!</span>}
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setIsFocused(true)}
            className={`w-full min-h-[150px] p-4 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all ${isFocused ? 'border-primary shadow-lg' : 'border-input'}`}
            placeholder={placeholder}
            rows={6}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {characterCount} caracteres
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            text.trim()
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isName ? "Continuar" : "Guardar Respuesta"}
        </button>
      </div>
      
      {!isName && (
        <div className="text-sm text-muted-foreground mt-4 p-4 bg-muted/20 rounded-lg border border-muted">
          <p className="font-medium mb-2">Consejos para responder:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Sé honesto y reflexivo en tu respuesta.</li>
            <li>No hay respuestas correctas o incorrectas.</li>
            <li>Tus respuestas son confidenciales y nos ayudan a brindarte mejores recomendaciones.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
