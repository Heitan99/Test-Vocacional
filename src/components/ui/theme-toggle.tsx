"use client"

import { useTheme } from "next-themes"
import { useState, useRef } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleThemeChange = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Crear overlay de fondo para suavizar la transición
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '9998'
    overlay.style.transition = 'opacity 0.6s ease-out'
    overlay.style.opacity = '0'

    // Crear el elemento de animación principal con gradiente
    const bubble = document.createElement('div')
    bubble.style.position = 'fixed'
    bubble.style.left = `${centerX}px`
    bubble.style.top = `${centerY}px`
    bubble.style.width = '0px'
    bubble.style.height = '0px'
    bubble.style.borderRadius = '50%'
    bubble.style.background = theme === 'dark' 
      ? 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.6) 100%)'
      : 'radial-gradient(circle, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.6) 100%)'
    bubble.style.transform = 'translate(-50%, -50%)'
    bubble.style.pointerEvents = 'none'
    bubble.style.zIndex = '9999'
    bubble.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    bubble.style.boxShadow = theme === 'dark' 
      ? '0 0 100px rgba(255,255,255,0.3)' 
      : '0 0 100px rgba(0,0,0,0.3)'

    document.body.appendChild(overlay)
    document.body.appendChild(bubble)

    // Iniciar las animaciones
    setTimeout(() => {
      overlay.style.opacity = '1'
      const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2.2
      bubble.style.width = `${maxDimension}px`
      bubble.style.height = `${maxDimension}px`
    }, 10)

    // Cambiar el tema y comenzar fade out
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark")
      bubble.style.opacity = '0'
      bubble.style.transform = 'translate(-50%, -50%) scale(1.1)'
    }, 400)

    // Fade out del overlay
    setTimeout(() => {
      overlay.style.opacity = '0'
    }, 600)

    // Limpiar después de la animación
    setTimeout(() => {
      if (document.body.contains(bubble)) {
        document.body.removeChild(bubble)
      }
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
      }
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleThemeChange}
      disabled={isAnimating}
      className="relative rounded-md p-2 hover:bg-accent transition-colors duration-200 disabled:opacity-70"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-700 dark:rotate-[360deg] dark:scale-0" />
      <Moon className="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 rotate-0 scale-0 transition-all duration-700 dark:rotate-[360deg] dark:scale-100" />
    </button>
  )
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  )
}

function Moon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  )
}
