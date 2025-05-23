"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 text-primary"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <span className="font-bold text-xl">VocaTest</span>
          </Link>
        </div>
        <nav className="flex-1 flex items-center space-x-6 text-sm font-medium">
          <Link 
            href="/" 
            className="transition-colors hover:text-primary"
          >
            Inicio
          </Link>
          <Link 
            href="/assessment" 
            className="transition-colors hover:text-primary"
          >
            Evaluación
          </Link>
          <Link 
            href="/results" 
            className="transition-colors hover:text-primary"
          >
            Resultados
          </Link>
          <Link 
            href="/admin" 
            className="transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
