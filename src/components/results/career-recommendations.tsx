
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssessmentResults } from "@/lib/api/assessment-client";

interface CareerRecommendationsProps {
  careers: AssessmentResults['careerRecommendations'];
}

export function CareerRecommendations({ careers }: CareerRecommendationsProps) {
  if (!careers || careers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay recomendaciones de carrera disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-motion="fadeIn">
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Carreras Recomendadas para Ti</h2>
        <p className="text-lg">
          Basado en tus respuestas, estas son las carreras que mejor se adaptan a tu perfil profesional.
        </p>
      </div>

      <div className="grid gap-6">
        {careers.map((career, index) => (
          <Card key={`career-${index}`} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{career.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                      style={{ width: `${career.matchPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary">{career.matchPercentage}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {career.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-2 text-primary">Habilidades Clave</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Análisis y resolución de problemas</li>
                      <li>• Pensamiento crítico</li>
                      <li>• Comunicación efectiva</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-primary">Caminos Educativos</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Educación universitaria</li>
                      <li>• Cursos especializados</li>
                      <li>• Certificaciones profesionales</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg mt-4">
                  <h4 className="font-medium mb-1 text-primary">Perspectivas del Sector</h4>
                  <p className="text-sm text-muted-foreground">
                    Sector en crecimiento con alta demanda de profesionales cualificados y oportunidades de desarrollo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted p-6 rounded-xl mt-8">
        <h3 className="font-medium mb-2">¿Cómo usar estas recomendaciones?</h3>
        <p className="text-muted-foreground">
          Estas recomendaciones se basan en tus respuestas y preferencias. Te sugerimos investigar más sobre
          las carreras con mayor porcentaje de coincidencia, hablar con profesionales del área y considerar
          hacer prácticas o voluntariados para validar tu interés.
        </p>
      </div>
    </div>
  );
}
