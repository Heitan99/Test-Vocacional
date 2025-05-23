// filepath: c:\Users\alexa\test-voca2.0\src\components\admin\analytics-view.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Datos simulados para las analíticas
const analyticsData = {
  dailyUsage: [
    { date: "15/05", count: 12 },
    { date: "16/05", count: 18 },
    { date: "17/05", count: 22 },
    { date: "18/05", count: 15 },
    { date: "19/05", count: 20 },
    { date: "20/05", count: 25 },
    { date: "21/05", count: 14 },
  ],
  completionRate: 76.4,
  averageTime: "10.5 minutos",
  demographicData: {
    ageGroups: [
      { group: "16-18", percentage: 24 },
      { group: "19-22", percentage: 38 },
      { group: "23-26", percentage: 22 },
      { group: "27-35", percentage: 12 },
      { group: "36+", percentage: 4 },
    ],
    educationLevel: [
      { level: "Secundaria", percentage: 32 },
      { level: "Universidad", percentage: 48 },
      { level: "Postgrado", percentage: 5 },
      { level: "Formación Técnica", percentage: 15 },
    ],
  },
  topQuestions: [
    {
      id: "q15",
      text: "¿Prefieres trabajar en equipo o de manera independiente?",
      viewCount: 248,
      completionRate: 98.2,
    },
    {
      id: "q07",
      text: "¿Qué tanto disfrutas resolver problemas lógicos?",
      viewCount: 248,
      completionRate: 97.5,
    },
    {
      id: "q22",
      text: "¿Te interesa más analizar información o crear contenido?",
      viewCount: 245,
      completionRate: 95.1,
    },
  ],
};

export function AnalyticsView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.4% respecto al mes anterior
            </p>
            <div className="mt-4 h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-primary rounded-full"
                style={{ width: `${analyticsData.completionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.averageTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              -1.2 minutos respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones (7 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analyticsData.dailyUsage.reduce((sum, day) => sum + day.count, 0)}
            </div>
            <div className="mt-4 h-16 flex items-end justify-between gap-1">
              {analyticsData.dailyUsage.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary rounded-sm"
                    style={{
                      height: `${(day.count / 25) * 100}%`,
                    }}
                  ></div>
                  <span className="text-xs text-muted-foreground">{day.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos Demográficos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Grupos de Edad</h3>
                <div className="space-y-2">
                  {analyticsData.demographicData.ageGroups.map((group, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{group.group} años</span>
                        <span>{group.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${group.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Nivel Educativo</h3>
                <div className="space-y-2">
                  {analyticsData.demographicData.educationLevel.map((level, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{level.level}</span>
                        <span>{level.percentage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${level.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preguntas Más Efectivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topQuestions.map((question, i) => (
                <div key={i} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm line-clamp-2">
                      {question.text}
                    </span>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {question.completionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>ID: {question.id}</span>
                    <span>{question.viewCount} visualizaciones</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reportes Detallados</CardTitle>
            <div className="flex items-center gap-2">
              <select className="rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                <option value="last7days">Últimos 7 días</option>
                <option value="last30days">Últimos 30 días</option>
                <option value="last3months">Últimos 3 meses</option>
                <option value="last12months">Últimos 12 meses</option>
              </select>
              <Button size="sm" variant="outline" className="text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4 text-muted-foreground"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="9" x2="9" y1="21" y2="9" />
              </svg>
              <h3 className="text-lg font-medium mb-1">Visualizador de Reportes Avanzados</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Aquí podrás generar y visualizar informes detallados sobre el uso de la plataforma,
                patrones de respuesta y efectividad de las recomendaciones.
              </p>
              <Button>Generar Nuevo Reporte</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
