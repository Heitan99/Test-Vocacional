"use client";

import { forwardRef } from 'react';
import { animate } from 'motion';

// Definición manual de MotionProps ya que 'motion' no exporta ese tipo directamente
type MotionProps = Record<string, any>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  withRipple?: boolean;
  motionProps?: MotionProps;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      disabled = false,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      withRipple = true,
      motionProps,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    const sizes = {
      sm: 'h-9 px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
    };
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (withRipple && !disabled && !isLoading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${x - diameter / 2}px`;
        circle.style.top = `${y - diameter / 2}px`;
        circle.classList.add('ripple-effect');
        
        const ripple = button.querySelector('.ripple-container');
        
        if (ripple) {
          // Limpiar efectos anteriores para evitar acumulación
          ripple.innerHTML = '';
          ripple.appendChild(circle);
          setTimeout(() => {
            if (ripple.contains(circle)) {
              ripple.removeChild(circle);
            }
          }, 600);
        }
      }
      
      // Llamar al onClick inmediatamente, sin esperar al efecto visual
      props.onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} relative overflow-hidden`}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
        <span className="ripple-container absolute inset-0 pointer-events-none"></span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
