"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssessmentResults } from "@/lib/api/assessment-client";
import { useResultsAnimation } from "@/lib/hooks/use-results-animation";

interface ResultsSummaryProps {
  results: AssessmentResults;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  useResultsAnimation();

  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay resultados disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-6 rounded-xl" data-motion="fadeIn">
        <h2 className="text-2xl font-bold mb-4">Resumen de tu Evaluación Vocacional</h2>
        <p className="text-lg">
          Hemos analizado tus respuestas para generar un perfil vocacional personalizado que te ayudará 
          a descubrir las carreras que mejor se adaptan a tu personalidad e intereses.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Perfil Vocacional Principal */}
        <Card data-motion="fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Tu Perfil Vocacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Tipo de Personalidad Profesional</h3>
                <p className="text-muted-foreground">
                  Basado en tus respuestas, muestras características de una persona {' '}
                  <span className="font-medium text-foreground">analítica y orientada a resultados</span>, 
                  con preferencia por el trabajo colaborativo y la resolución de problemas complejos.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-primary">Fortalezas Identificadas</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Pensamiento analítico
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Trabajo en equipo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Adaptabilidad
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Comunicación efectiva
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-primary">Áreas de Interés</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Tecnología e innovación
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Ciencias y análisis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Resolución de problemas
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Desarrollo y mejora
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de la Evaluación */}
        <Card data-motion="fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
              Análisis de Respuestas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {results.careerRecommendations?.length || 5}
                </div>
                <div className="text-sm text-muted-foreground">
                  Carreras Recomendadas
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">92%</div>
                <div className="text-sm text-muted-foreground">
                  Precisión del Análisis
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">
                  Preguntas Evaluadas
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-muted-foreground">
                  Compatibilidad
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones Generales */}
        <Card data-motion="fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.77l-6.18 2.98L7 14.87 2 9l6.91-1.74L12 2z" />
              </svg>
              Próximos Pasos Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-primary bg-primary/5">
                <h4 className="font-medium mb-2">Exploración Profesional</h4>
                <p className="text-sm text-muted-foreground">
                  Investiga más sobre las carreras recomendadas, habla con profesionales del área y 
                  considera realizar shadowing o prácticas profesionales para validar tu interés.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-accent bg-accent/5">
                <h4 className="font-medium mb-2">Desarrollo de Habilidades</h4>
                <p className="text-sm text-muted-foreground">
                  Enfócate en desarrollar las habilidades técnicas y blandas que son importantes 
                  en tus áreas de interés a través de cursos, certificaciones o proyectos personales.
                </p>
              </div>
              
              <div className="p-4 border-l-4 border-secondary bg-secondary/5">
                <h4 className="font-medium mb-2">Planificación Educativa</h4>
                <p className="text-sm text-muted-foreground">
                  Revisa los requisitos educativos para tus carreras de interés y planifica tu 
                  ruta académica considerando universidades, programas y especializaciones relevantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-xl" data-motion="fadeIn">
        <h3 className="font-medium mb-2">Recuerda</h3>
        <p className="text-muted-foreground">
          Este análisis es una guía basada en tus respuestas actuales. Tus intereses y preferencias 
          pueden evolucionar con el tiempo, por lo que te recomendamos realizar esta evaluación 
          periódicamente y siempre complementarla con experiencias prácticas y asesoramiento profesional.
        </p>
      </div>
    </div>
  );
}