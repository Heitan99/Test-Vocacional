// (Renombrar desde openai.ts a assessment-client.ts)

// Tipos para las respuestas del usuario
export interface UserResponse {
  questionId: string;
  type: 'slider' | 'dragAndDrop' | 'cardSort' | 'text' | 'multipleChoice';
  value: string | number | string[];
  timestamp: number;
}

// Tipos que coinciden con lo que devuelve el servidor
export interface AssessmentResults {
  // Carreras recomendadas
  careerRecommendations: CareerRecommendation[];
  
  // Perfil de personalidad
  personalityInsights: {
    type: string;
    description: string;
    strengths: string[];
    growthAreas: string[];
    recommendedEnvironments: string[];
  };
  
  // Evaluación de habilidades
  skillsAssessment: {
    technical: { name: string; level: number }[];
    soft: { name: string; level: number }[];
    interests: { category: string; score: number }[];
  };
  
  // Resumen general
  summary: string;
}

// AGREGAR tipos para compatibilidad con componentes existentes
export interface CareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  keySkills: string[];
  educationPaths: string[];
  industryTrends: string[];
}

// Función genérica que funciona con CUALQUIER IA
export async function generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
  try {
    console.log('📊 Enviando respuestas para generar resultados:', responses.length, 'respuestas');
    
    // IMPORTANTE: Usa la ruta correcta que implementaste
    const res = await fetch('/api/assessment/generate-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses })
    });

    const data = await res.json();
    
    // Verificar si hay un error específico de cuota excedida
    if (!res.ok) {
      if (data.error && data.error.startsWith('QUOTA_EXCEEDED:')) {
        console.warn('⚠️ Cuota de API excedida, generando resultados locales de respaldo');
        // Generar resultados simulados cuando se excede la cuota
        return generateFallbackResults(responses);
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    if (data.success && data.results) {
      console.log('✅ Resultados recibidos de la IA:', data.provider);
      
      // Transformar el formato devuelto por la API a la estructura de AssessmentResults
      return {
        careerRecommendations: data.results.recommendedCareers.map((career: any) => ({
          title: career.title,
          description: career.description,
          matchPercentage: career.match,
          keySkills: data.results.strengths.slice(0, 3),
          educationPaths: [career.title + " (Grado)", career.title + " (Postgrado)"],
          industryTrends: data.results.interests.slice(0, 2)
        })),
        personalityInsights: {
          type: data.results.strengths[0],
          description: data.results.summary,
          strengths: data.results.strengths,
          growthAreas: data.results.developmentAreas,
          recommendedEnvironments: data.results.nextSteps.slice(0, 2)
        },
        skillsAssessment: {
          technical: data.results.strengths.map((s: string, i: number) => ({
            name: s,
            level: Math.floor(Math.random() * 3) + 7
          })),
          soft: data.results.developmentAreas.map((s: string, i: number) => ({
            name: s,
            level: Math.floor(Math.random() * 3) + 6
          })),
          interests: data.results.interests.map((s: string, i: number) => ({
            category: s,
            score: Math.floor(Math.random() * 3) + 7
          }))
        },
        summary: data.results.summary
      };
    } else {
      throw new Error('Assessment API response was not successful');
    }
  } catch (error: any) {
    console.error('❌ Error al generar resultados:', error);
    
    // Si hay un error específico de cuota, generar resultados locales
    if (error.message && error.message.includes('QUOTA_EXCEEDED:')) {
      console.warn('⚠️ Generando resultados locales debido a error de cuota');
      return generateFallbackResults(responses);
    }
    
    return null;
  }
}

// Función para generar resultados de respaldo cuando hay problemas de API
function generateFallbackResults(responses: UserResponse[]): AssessmentResults {
  // Obtener el nombre del usuario si está disponible
  const nameResponse = responses.find(r => r.questionId === 'q1');
  const userName = nameResponse && typeof nameResponse.value === 'string' ? nameResponse.value : 'Usuario';
  
  // Analizar respuestas básicas para personalizar un poco los resultados
  const techInterested = responses.some(r => 
    r.type === 'multipleChoice' && 
    Array.isArray(r.value) && 
    r.value.some(v => v.includes('Tecnología') || v.includes('Computación'))
  );
  
  const artInterested = responses.some(r => 
    r.type === 'multipleChoice' && 
    Array.isArray(r.value) && 
    r.value.some(v => v.includes('Arte') || v.includes('Diseño'))
  );
  
  const socialInterested = responses.some(r => 
    r.type === 'multipleChoice' && 
    Array.isArray(r.value) && 
    r.value.some(v => v.includes('Social') || v.includes('Humanidades') || v.includes('Educación'))
  );
  
  // Generar carreras recomendadas basadas en intereses básicos
  const careers = [];
  if (techInterested) {
    careers.push({
      title: "Ingeniería en Sistemas",
      description: "Carrera enfocada en el desarrollo de software y sistemas informáticos.",
      matchPercentage: 92,
      keySkills: ["Programación", "Análisis de sistemas", "Resolución de problemas"],
      educationPaths: ["Grado en Ingeniería Informática", "Máster en Desarrollo de Software"],
      industryTrends: ["Inteligencia Artificial", "Desarrollo Web/Móvil"]
    });
    careers.push({
      title: "Ciencia de Datos",
      description: "Disciplina que combina estadística, matemáticas y programación para analizar grandes volúmenes de datos.",
      matchPercentage: 88,
      keySkills: ["Análisis estadístico", "Programación", "Visualización de datos"],
      educationPaths: ["Grado en Matemáticas o Informática", "Máster en Data Science"],
      industryTrends: ["Big Data", "Machine Learning"]
    });
  }
  
  if (artInterested) {
    careers.push({
      title: "Diseño Gráfico",
      description: "Profesión creativa enfocada en la comunicación visual y el diseño de materiales gráficos.",
      matchPercentage: 90,
      keySkills: ["Creatividad", "Software de diseño", "Comunicación visual"],
      educationPaths: ["Grado en Diseño Gráfico", "Cursos especializados en diseño digital"],
      industryTrends: ["Diseño UX/UI", "Diseño para redes sociales"]
    });
  }
  
  if (socialInterested) {
    careers.push({
      title: "Psicología",
      description: "Estudio científico de la mente y el comportamiento humano.",
      matchPercentage: 85,
      keySkills: ["Empatía", "Análisis comportamental", "Comunicación"],
      educationPaths: ["Grado en Psicología", "Máster en Psicología Clínica"],
      industryTrends: ["Psicología positiva", "Terapia online"]
    });
  }
  
  // Asegurar que siempre haya al menos una carrera sugerida
  if (careers.length === 0) {
    careers.push({
      title: "Administración de Empresas",
      description: "Carrera versátil enfocada en la gestión de organizaciones y recursos.",
      matchPercentage: 78,
      keySkills: ["Organización", "Liderazgo", "Análisis de negocios"],
      educationPaths: ["Grado en Administración", "MBA"],
      industryTrends: ["Emprendimiento", "Gestión sostenible"]
    });
  }
  
  // Generar un resumen personalizado
  const summary = `Hola ${userName}, según tus respuestas, muestras intereses en ${
    techInterested ? "áreas tecnológicas" : ""
  }${
    techInterested && artInterested ? " y " : ""
  }${
    artInterested ? "campos creativos" : ""
  }${
    (techInterested || artInterested) && socialInterested ? " y también " : ""
  }${
    socialInterested ? "áreas sociales y humanísticas" : ""
  }${
    !techInterested && !artInterested && !socialInterested ? "diversas disciplinas profesionales" : ""
  }. Tus fortalezas sugieren que podrías destacarte en roles que combinen estas áreas de interés.`;
  
  // Construir y devolver el objeto de resultados
  return {
    careerRecommendations: careers,
    personalityInsights: {
      type: techInterested ? "Analítico-Lógico" : artInterested ? "Creativo-Innovador" : "Social-Comunicativo",
      description: summary,
      strengths: [
        "Capacidad de análisis",
        "Creatividad",
        "Comunicación efectiva",
        "Adaptabilidad",
        "Resolución de problemas"
      ],
      growthAreas: [
        "Gestión del tiempo",
        "Comunicación asertiva",
        "Trabajo bajo presión"
      ],
      recommendedEnvironments: [
        "Entornos colaborativos",
        "Espacios que fomenten la creatividad",
        "Organizaciones con valores alineados"
      ]
    },
    skillsAssessment: {
      technical: [
        { name: "Análisis de información", level: 8 },
        { name: "Resolución de problemas", level: 7 },
        { name: "Uso de tecnología", level: 9 }
      ],
      soft: [
        { name: "Comunicación", level: 8 },
        { name: "Trabajo en equipo", level: 7 },
        { name: "Adaptabilidad", level: 9 }
      ],
      interests: [
        { category: techInterested ? "Tecnología" : "Ciencias", score: 8 },
        { category: artInterested ? "Arte y diseño" : "Humanidades", score: 7 },
        { category: socialInterested ? "Ciencias sociales" : "Negocios", score: 8 }
      ]
    },
    summary: summary
  };
}

// Función para obtener retroalimentación (funciona con cualquier IA)
export async function getInstantFeedback(response: UserResponse): Promise<string> {
  try {
    console.log('🔄 Obteniendo feedback (multi-IA):', response);
    
    const res = await fetch('/api/assessment/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.success) {
      // Mostrar información sobre la fuente del feedback
      console.log('🤖 Feedback recibido:', {
        text: data.feedback,
        source: data.source,
        model: data.model,
        provider: data.provider
      });
      
      return data.feedback;
    } else {
      throw new Error('Feedback API response was not successful');
    }
  } catch (error) {
    console.error('⚠️ Error al obtener feedback:', error);
    return 'Gracias por tu respuesta.';
  }
}

// Función helper para convertir resultados del servidor a formato esperado por componentes
export function convertToLegacyFormat(results: AssessmentResults): AssessmentResults {
  return {
    careerRecommendations: results.careerRecommendations.map(career => ({
      title: career.title,
      description: career.description,
      matchPercentage: career.matchPercentage,
      keySkills: career.keySkills || ["Análisis", "Creatividad", "Comunicación"],
      educationPaths: career.educationPaths || ["Universidad", "Cursos especializados"],
      industryTrends: career.industryTrends || ["Crecimiento del sector", "Digitalización"]
    })),
    personalityInsights: {
      type: results.personalityInsights.type || "Perfil Analítico-Creativo",
      description: results.personalityInsights.description || "Combinas habilidades analíticas con creatividad, lo que te permite abordar problemas desde múltiples perspectivas.",
      strengths: results.personalityInsights.strengths,
      growthAreas: results.personalityInsights.growthAreas,
      recommendedEnvironments: results.personalityInsights.recommendedEnvironments || ["Equipos colaborativos", "Entornos innovadores", "Proyectos desafiantes"]
    },
    skillsAssessment: {
      technical: results.skillsAssessment.technical || [
        { name: "Análisis de datos", level: 8 },
        { name: "Resolución de problemas", level: 9 },
        { name: "Pensamiento crítico", level: 8 }
      ],
      soft: results.skillsAssessment.soft || [
        { name: "Comunicación", level: 7 },
        { name: "Trabajo en equipo", level: 8 },
        { name: "Adaptabilidad", level: 7 }
      ],
      interests: results.skillsAssessment.interests || []
    },
    summary: results.summary
  };
}
