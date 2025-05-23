// filepath: c:\Users\alexa\test-voca2.0\src\components\admin\auth.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdminAuthProps {
  onLogin: (token: string) => void;
}

export function AdminAuth({ onLogin }: AdminAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // En una implementación real, esto debería conectarse a una API de autenticación
      // Por ahora, simularemos una validación básica para demostración
      if (username === "admin" && password === "password") {
        // En producción, esto sería un token JWT proporcionado por el backend
        const mockToken = "mock-admin-token-" + Date.now();
        setTimeout(() => {
          onLogin(mockToken);
          setIsLoading(false);
        }, 1000);
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error de autenticación");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></span>
              Verificando...
            </span>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
    </div>
  );
}
