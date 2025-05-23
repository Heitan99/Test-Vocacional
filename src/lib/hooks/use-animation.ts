import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';

interface UseAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollAnimation(
  animation: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight',
  options: UseAnimationOptions = {}
) {
  const { threshold = 0.2, rootMargin = '0px', once = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Map of animation configurations
    const animations = {
      fadeIn: { opacity: [0, 1], duration: 0.6, easing: [0.33, 1, 0.68, 1] },
      slideUp: { 
        opacity: [0, 1], 
        y: [40, 0], 
        duration: 0.8, 
        easing: [0.33, 1, 0.68, 1] 
      },
      slideDown: { 
        opacity: [0, 1], 
        y: [-40, 0], 
        duration: 0.8, 
        easing: [0.33, 1, 0.68, 1] 
      },
      slideLeft: { 
        opacity: [0, 1], 
        x: [40, 0], 
        duration: 0.8, 
        easing: [0.33, 1, 0.68, 1] 
      },
      slideRight: { 
        opacity: [0, 1], 
        x: [-40, 0], 
        duration: 0.8, 
        easing: [0.33, 1, 0.68, 1] 
      }
    };
    
    // Set initial styles
    element.style.opacity = '0';
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated)) {
            animate(element, animations[animation]);
            setHasAnimated(true);
            
            if (once) {
              observer.unobserve(element);
            }
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [animation, threshold, rootMargin, once, hasAnimated]);
  
  return ref;
}

export function useMotionAnimate() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-motion]');
    
    elements.forEach((element) => {
      const animation = element.getAttribute('data-motion');
      const delay = parseInt(element.getAttribute('data-motion-delay') || '0');
      
      if (!animation) return;
      
      // Hide element initially
      (element as HTMLElement).style.opacity = '0';
      
      // Check if element is in viewport on load
      const rect = element.getBoundingClientRect();
      const isInViewport = 
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      
      if (isInViewport) {
        setTimeout(() => {
          animateElement(element as HTMLElement, animation);
        }, delay);
      } else {
        // Set up intersection observer for elements not in viewport
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                animateElement(entry.target as HTMLElement, animation);
              }, delay);
              observer.unobserve(entry.target);
            }
          });
        });
        
        observer.observe(element);
      }
    });
    
    function animateElement(element: HTMLElement, animation: string) {
      switch (animation) {
        case 'fadeIn':
          animate(element, { opacity: [0, 1] }, { duration: 0.6 });
          break;
        case 'slideUp':
          animate(
            element, 
            { opacity: [0, 1], y: [20, 0] }as any, 
            { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
          );
          break;
        case 'slideDown':
          animate(
            element, 
            { opacity: [0, 1], y: [-20, 0] }as any, 
            { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
          );
          break;
        case 'slideLeft':
          animate(
            element, 
            { opacity: [0, 1], x: [20, 0] }as any, 
            { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
          );
          break;
        case 'slideRight':
          animate(
            element, 
            { opacity: [0, 1], x: [-20, 0] }as any, 
            { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
          );
          break;
      }
    }
    
    return () => {
      document.querySelectorAll('[data-motion]').forEach((element) => {
        const observer = new IntersectionObserver(() => {});
        observer.unobserve(element);
      });
    };
  }, []);
}

export function useParallaxEffect(speed = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elementTop = element.getBoundingClientRect().top + scrollY;
      const offset = (scrollY - elementTop) * speed;
      
      element.style.transform = `translateY(${offset}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);
  
  return ref;
}
