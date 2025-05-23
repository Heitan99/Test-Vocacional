// filepath: c:\Users\alexa\test-voca2.0\src\app\admin\page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminAuth } from "@/components/admin/auth";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = (token: string) => {
    localStorage.setItem("admin_token", token);
    setIsAuthenticated(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-20">
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      {isAuthenticated ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <button
              onClick={handleLogout}
              className="text-sm bg-muted px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          <AdminDashboard />
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Acceso Administrativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminAuth onLogin={handleLogin} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
