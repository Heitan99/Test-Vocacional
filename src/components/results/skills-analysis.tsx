"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssessmentResults } from "@/lib/api/assessment-client";

interface Skill {
  name: string;
  level: number;
}

interface Interest {
  category: string;
  score: number;
}

interface SkillsData {
  technical: Skill[];
  soft: Skill[];
  interests: Interest[];
}

interface SkillsAnalysisProps {
  skills?: SkillsData; // Opcional por ahora
}

export function SkillsAnalysis({ skills }: SkillsAnalysisProps) {
  // Datos mock para demostración
  const mockSkillsData = {
    technical: [
      { name: "Análisis de datos", level: 8 },
      { name: "Resolución de problemas", level: 9 },
      { name: "Pensamiento crítico", level: 8 },
      { name: "Programación", level: 6 },
      { name: "Diseño", level: 7 }
    ],
    soft: [
      { name: "Comunicación", level: 7 },
      { name: "Trabajo en equipo", level: 8 },
      { name: "Adaptabilidad", level: 7 },
      { name: "Liderazgo", level: 6 },
      { name: "Creatividad", level: 8 }
    ],
    interests: [
      { category: "Tecnología", score: 85 },
      { category: "Ciencias", score: 78 },
      { category: "Arte y Diseño", score: 72 },
      { category: "Negocios", score: 65 },
      { category: "Educación", score: 70 }
    ]
  };

  const skillsData = skills || mockSkillsData;

  return (
    <div className="space-y-8" data-motion="fadeIn">
      <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Análisis de Habilidades</h2>
        <p className="text-lg">
          Evaluación detallada de tus competencias técnicas, habilidades blandas e intereses profesionales.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Habilidades Técnicas */}
        <Card>
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
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Habilidades Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.technical.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}/10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Habilidades Blandas */}
        <Card>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Habilidades Interpersonales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.soft.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}/10</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(skill.level / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intereses */}
        <Card>
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
                <polygon points="12 2 15.09 8.26 22 9 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9 8.91 8.26 12 2" />
              </svg>
              Áreas de Interés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillsData.interests.map((interest, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{interest.category}</span>
                    <span className="text-sm text-muted-foreground">{interest.score}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary via-accent to-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${interest.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-xl">
        <h3 className="font-medium mb-2">Interpretación de Resultados</h3>
        <p className="text-muted-foreground">
          Este análisis refleja tus fortalezas actuales y áreas de oportunidad. Las habilidades técnicas pueden
          desarrollarse a través de capacitación específica, mientras que las habilidades interpersonales se fortalecen
          con la práctica y la experiencia. Usa esta información para identificar áreas de desarrollo profesional.
        </p>
      </div>
    </div>
  );
}