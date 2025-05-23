"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssessmentResults } from "@/lib/api/assessment-client";

interface PersonalityProfileProps {
  personality?: AssessmentResults['personalityInsights'];
}

export function PersonalityProfile({ personality }: PersonalityProfileProps) {
  // Datos por defecto si no se proporcionan
  const defaultPersonality: AssessmentResults['personalityInsights'] = {
    type: "Perfil Analítico-Creativo",
    description:
      "Combinas habilidades analíticas con creatividad, lo que te permite abordar problemas desde múltiples perspectivas y encontrar soluciones innovadoras.",
    strengths: [
      "Pensamiento crítico y analítico",
      "Creatividad para resolver problemas",
      "Capacidad de adaptación",
      "Trabajo en equipo efectivo",
    ],
    growthAreas: [
      "Desarrollo de habilidades de liderazgo",
      "Mejora en la comunicación pública",
      "Gestión del tiempo",
      "Toma de decisiones bajo presión",
    ],
    recommendedEnvironments: [
      "Equipos colaborativos",
      "Entornos innovadores",
      "Proyectos desafiantes",
      "Ambientes de aprendizaje continuo",
      "Culturas organizacionales flexibles",
    ],
  };

  const personalityData = personality || defaultPersonality;

  return (
    <div className="space-y-8" data-motion="fadeIn">
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Tu Perfil de Personalidad</h2>
        <p className="text-lg">
          Exploramos los rasgos que te definen y cómo influyen en tu desempeño
          profesional.
        </p>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {personalityData.type}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="italic">{personalityData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 2v4" />
                    <path d="m6.3 6.3 2.8 2.8" />
                    <path d="M2 12h4" />
                    <path d="m6.3 17.7 2.8-2.8" />
                    <path d="M12 22v-4" />
                    <path d="m17.7 17.7-2.8-2.8" />
                    <path d="M22 12h-4" />
                    <path d="m17.7 6.3-2.8 2.8" />
                  </svg>
                  Fortalezas
                </h3>
                <ul className="space-y-2">
                  {personalityData.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
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
                        className="mt-1 text-primary"
                      >
                        <path d="M12 22V8" />
                        <path d="m5 12 7-4 7 4" />
                        <path d="M5 12v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                        <path d="M11 2h2" />
                      </svg>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <path d="M18 6h-5c-1.1 0-2 .9-2 2v8" />
                    <path d="M9 16a2 2 0 0 0 2-2" />
                    <path d="M12 13a2 2 0 0 0 2-2" />
                    <path d="M15 10a2 2 0 0 0 2-2" />
                    <path d="M6 8v8" />
                    <path d="M9 8v2" />
                    <path d="M6 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                  Áreas de Crecimiento
                </h3>
                <ul className="space-y-2">
                  {personalityData.growthAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-2">
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
                        className="mt-1 text-accent"
                      >
                        <path d="M12 2v20" />
                        <path d="M17 8 7 12l10 4" />
                      </svg>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ambientes Laborales Recomendados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalityData.recommendedEnvironments.map((env, i) => (
              <div
                key={i}
                className="bg-muted/30 p-4 rounded-md border border-muted-foreground/10 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {i + 1}
                </div>
                <span>{env}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-6 rounded-xl mt-8">
        <h3 className="font-medium mb-2">¿Cómo usar este perfil?</h3>
        <p className="text-muted-foreground">
          Tu perfil de personalidad refleja cómo tiendes a procesar la
          información, tomar decisiones y relacionarte con el mundo.
          Comprender estos aspectos te ayuda a identificar entornos de trabajo
          donde puedas prosperar y áreas donde podrías enfrentar desafíos.
          Considera este perfil al explorar posibles carreras y desarrollar
          estrategias para tu crecimiento profesional.
        </p>
      </div>
    </div>
  );
}
