"use client";

export function ProfileDropdown() {
  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-1 rounded-md bg-secondary/10 px-3 py-2 hover:bg-secondary/20"
      >
        <span>Invitado</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-4 w-4"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
