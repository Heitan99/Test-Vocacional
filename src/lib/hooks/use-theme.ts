"use client";

import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const { theme, setTheme: setNextTheme } = useNextTheme();
  
  // Estado para controlar la animación
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Actualiza el tema en el DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Si estamos animando, añadir la clase al cuerpo para deshabilitar las transiciones
    if (isAnimating) {
      document.body.classList.add('theme-animating');
      // Durante la animación, no cambiamos las clases CSS del tema
      // Esto se hará en la función de animación directamente
    } else {
      document.body.classList.remove('theme-animating');
    }
  }, [isAnimating]);

  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
  };

  return { 
    theme: theme as Theme, 
    setTheme, 
    isAnimating, 
    setIsAnimating 
  };
}
