"use client";

import { useEffect } from 'react';

export function useResultsAnimation() {
  useEffect(() => {
    // Animación simple sin framer-motion
    const elements = document.querySelectorAll('[data-motion="fadeIn"]');
    
    elements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        // Aplicar animación CSS simple
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, []);
}