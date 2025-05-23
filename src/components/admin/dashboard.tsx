// filepath: c:\Users\alexa\test-voca2.0\src\components\admin\dashboard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionManager } from "@/components/admin/question-manager";
import { AnalyticsView } from "@/components/admin/analytics-view";
import { AISettings } from "@/components/admin/ai-settings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Datos simulados para el panel de control
  const mockStats = {
    totalAssessments: 248,
    completedToday: 14,
    averageCompletionTime: "12.3 minutos",
    popularCareers: [
      { name: "Desarrollo de Software", count: 45 },
      { name: "Diseño UX/UI", count: 38 },
      { name: "Marketing Digital", count: 31 },
      { name: "Ciencia de Datos", count: 29 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}      <div className="flex overflow-x-auto pb-2 border-b">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Vista General
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "questions"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setActiveTab("questions")}
        >
          Gestión de Preguntas
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "analytics"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analíticas
        </button>        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "settings"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Configuración
        </button>
      </div>

      {/* Contenido según el tab seleccionado */}
      <div>
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Evaluaciones Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.totalAssessments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completadas Hoy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.completedToday}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tiempo Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.averageCompletionTime}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carreras Más Recomendadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStats.popularCareers.map((career, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{career.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="bg-muted h-2 w-32 rounded-full">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${
                                  (career.count / mockStats.popularCareers[0].count) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{career.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/questions/create" className="block">
                    <Button variant="outline" className="w-full justify-start text-left">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                      Crear Nueva Pregunta
                    </Button>
                  </Link>
                  <Link href="/admin/reports" className="block">
                    <Button variant="outline" className="w-full justify-start text-left">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Ver Reportes
                    </Button>
                  </Link>                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setActiveTab("ai-settings")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Configurar IA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}        {activeTab === "questions" && <QuestionManager />}
        {activeTab === "analytics" && <AnalyticsView />}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Configuración general de la plataforma */}
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Aquí puedes configurar las opciones generales de la plataforma de evaluación vocacional.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre de la Plataforma</label>
                    <input
                      type="text"
                      defaultValue="VocaAI - Descubrimiento Vocacional"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input id="enable-analytics" type="checkbox" defaultChecked />
                    <label htmlFor="enable-analytics" className="text-sm font-medium">
                      Habilitar analíticas avanzadas
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Guardar Cambios</Button>
              </CardFooter>
            </Card>
            
            {/* Configuración de IA */}
            <AISettings />
          </div>
        )}
      </div>
    </div>
  );
}
