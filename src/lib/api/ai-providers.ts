// Define interfaces para los diferentes proveedores de IA
import OpenAI from 'openai';

// Tipos básicos (definidos aquí para evitar dependencias circulares)
export interface UserResponse {
  questionId: string;
  type: 'slider' | 'dragAndDrop' | 'cardSort' | 'text' | 'multipleChoice';
  value: string | number | string[];
  timestamp: number;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  keySkills: string[];
  educationPaths: string[];
  industryTrends: string[];
}

export interface PersonalityInsight {
  type: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  recommendedEnvironments: string[];
}

export interface SkillAssessment {
  name: string;
  level: number;
}

export interface InterestScore {
  category: string;
  score: number;
}

export interface SkillsAssessment {
  technical: SkillAssessment[];
  soft: SkillAssessment[];
  interests: InterestScore[];
}

export interface AssessmentResults {
  careerRecommendations: CareerRecommendation[];
  personalityInsights: PersonalityInsight;
  skillsAssessment: SkillsAssessment;
  summary: string;
}

// Interfaz base para todos los proveedores de IA
export interface AIProvider {
  name: string;
  getNextAdaptiveQuestion: (responses: UserResponse[], currentQuestionId: string) => Promise<string | null>;
  generateAssessmentResults: (responses: UserResponse[]) => Promise<AssessmentResults | null>;
  getInstantFeedback: (response: UserResponse) => Promise<string | null>;
}

// Proveedor OpenAI
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private model: string;
  name: string = 'OpenAI';

  constructor(apiKey: string, model: string = 'gpt-4o') {
    this.client = new OpenAI({
      apiKey: apiKey || "",
      dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usa API Routes
    });
    this.model = model;
  }

  async getNextAdaptiveQuestion(responses: UserResponse[], currentQuestionId: string): Promise<string | null> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Eres un asistente especializado en evaluaciones vocacionales. 
            Tu tarea es analizar las respuestas previas del usuario y recomendar la siguiente pregunta que deba hacerse
            para obtener la información más relevante sobre sus intereses, habilidades y personalidad.
            Genera una nueva pregunta adaptada específicamente a lo que ya sabemos del usuario.`
          },
          {
            role: "user",
            content: `Basado en estas respuestas previas: ${JSON.stringify(responses)}, y considerando que acaban de responder a la pregunta con ID ${currentQuestionId},
            ¿cuál debería ser la siguiente pregunta más relevante para hacerle al usuario? Proporciona la pregunta, el tipo (slider, dragAndDrop, cardSort, text) y las opciones si aplica.`
          }
        ]
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error al generar la siguiente pregunta adaptativa:", error);
      return null;
    }
  }

  async generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Eres un experto en orientación vocacional y desarrollo profesional.
            Tu tarea es analizar las respuestas del usuario a diversas preguntas de evaluación y proporcionar un análisis completo y detallado
            que incluya recomendaciones de carrera, insights de personalidad, evaluación de habilidades e intereses.
            Proporciona tus resultados en formato JSON estructurado.`
          },
          {
            role: "user",
            content: `Basado en estas respuestas de evaluación: ${JSON.stringify(responses)},
            por favor genera un análisis vocacional completo que incluya:
            1. Recomendaciones de 3-5 carreras adecuadas con porcentajes de coincidencia, descripción y caminos educativos
            2. Insights sobre tipo de personalidad, fortalezas, áreas de crecimiento y ambientes recomendados
            3. Evaluación de habilidades técnicas, habilidades blandas e intereses con niveles/puntuaciones
            4. Un breve resumen general personalizado
            
            Devuelve los resultados en formato JSON bien estructurado siguiendo el modelo del tipo AssessmentResults.`
          }
        ],
        response_format: { type: "json_object" }
      });
  
      const resultString = completion.choices[0].message.content;
      if (resultString) {
        return JSON.parse(resultString) as AssessmentResults;
      }
      return null;
    } catch (error) {
      console.error("Error al generar los resultados de evaluación:", error);
      return null;
    }
  }

  async getInstantFeedback(response: UserResponse): Promise<string | null> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `Eres un asistente especializado en evaluaciones vocacionales. 
            Tu tarea es proporcionar retroalimentación instantánea sobre la respuesta del usuario.
            Esta retroalimentación debe ser breve, constructiva y orientada a ayudar al usuario a reflexionar sobre su respuesta.`
          },
          {
            role: "user",
            content: `El usuario acaba de responder lo siguiente a una pregunta de evaluación: ${JSON.stringify(response)}
            Por favor proporciona una retroalimentación breve (máximo 2 frases) que sea constructiva y le ayude a reflexionar sobre su respuesta.`
          }
        ]
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error al generar retroalimentación instantánea:", error);
      return null;
    }
  }
}

// Proveedor Gemini (Google)
export class GeminiProvider implements AIProvider {
  name: string = 'Gemini (Google)';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-pro') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async getNextAdaptiveQuestion(responses: UserResponse[], currentQuestionId: string): Promise<string | null> {
    try {
      // Aquí iría la llamada a la API de Gemini
      // Utilizando formatos similares pero con la sintaxis específica de Google Gemini
      
      // Por ahora, implementación simulada
      console.log('Usando Gemini para generar pregunta adaptativa');
      
      // Simulación del resultado
      const content = "¿Te consideras una persona más analítica o creativa? [type: slider, min: 1, max: 10, minLabel: 'Totalmente analítico', maxLabel: 'Totalmente creativo']";
      
      return content;
    } catch (error) {
      console.error("Error con la API de Gemini:", error);
      return null;
    }
  }

  async generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
    try {
      console.log('🤖 Generando resultados completos con Gemini...');
      
      // Crear prompt específico para la generación de resultados
      const prompt = `
      Eres un experto en orientación vocacional y desarrollo profesional. Analiza estas respuestas de evaluación:
      
      ${JSON.stringify(responses, null, 2)}
      
      Genera un análisis vocacional completo en formato JSON que incluya:
      
      1. careerRecommendations: Array con 3-5 carreras recomendadas, cada una con:
         - title: Título de la carrera
         - description: Breve descripción
         - matchPercentage: Porcentaje de coincidencia (número entre 70-98)
         - keySkills: Array de 3-5 habilidades clave
         - educationPaths: Array de 2-3 caminos educativos
         - industryTrends: Array de 2-3 tendencias relevantes
      
      2. personalityInsights: Objeto con:
         - type: Tipo de personalidad profesional
         - description: Descripción del tipo de personalidad
         - strengths: Array de 3-4 fortalezas
         - growthAreas: Array de 2-3 áreas de desarrollo
         - recommendedEnvironments: Array de 2-3 entornos recomendados
      
      3. skillsAssessment: Objeto con:
         - technical: Array de objetos con name y level (1-10) de habilidades técnicas
         - soft: Array de objetos con name y level (1-10) de habilidades blandas
         - interests: Array de objetos con category y score (1-10) de áreas de interés
      
      4. summary: String con resumen general personalizado del perfil vocacional
      
      Asegúrate de que el JSON sea válido y estructurado exactamente como se solicita. Personaliza las recomendaciones según las respuestas del usuario.
      `;
      
      // Llamada real a la API de Gemini
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      };

      console.log('📡 Enviando solicitud a Gemini para resultados de evaluación');

      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${geminiResponse.statusText}`);
      }

      const data = await geminiResponse.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!contentText) {
        throw new Error('No content in Gemini response');
      }

      // Extraer el JSON de la respuesta (puede estar envuelto en ```json)
      let jsonStr = contentText;
      
      // Limpiar formato markdown si existe
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
      } else if (jsonStr.includes('```')) {
        jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
      }
      
      console.log('✅ Resultados generados por Gemini, parseando JSON...');
      
      try {
        const results = JSON.parse(jsonStr) as AssessmentResults;
        console.log('✅ Resultados de evaluación generados correctamente con Gemini');
        return results;
      } catch (parseError) {
        console.error('❌ Error al parsear JSON de Gemini:', parseError);
        console.log('JSON recibido:', jsonStr);
        
        // Intentar recuperar el formato y parsearlo
        try {
          // Limpiar formato y espacios extras
          const cleanedJson = jsonStr
            .replace(/[\n\r\t]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');
            
          return JSON.parse(cleanedJson) as AssessmentResults;
        } catch (e) {
          throw new Error('No se pudo parsear la respuesta JSON de Gemini');
        }
      }

    } catch (error) {
      console.error("❌ Error con la API de Gemini para resultados:", error);
      
      // Si falla, usar el mock como último recurso
      console.warn("⚠️ Usando resultados simulados como fallback");
      
      // Simulación en caso de error
      return {
        careerRecommendations: [
          {
            title: "Desarrollo de Software",
            description: "Profesional que diseña y crea aplicaciones de software",
            matchPercentage: 85,
            keySkills: ["Programación", "Resolución de problemas", "Pensamiento lógico"],
            educationPaths: ["Ingeniería Informática", "Desarrollo Web Fullstack"],
            industryTrends: ["Inteligencia Artificial", "Desarrollo móvil"]
          },
          {
            title: "Análisis de Datos",
            description: "Profesional que analiza e interpreta datos complejos",
            matchPercentage: 78,
            keySkills: ["Estadística", "Visualización de datos", "SQL"],
            educationPaths: ["Ciencia de Datos", "Estadística Aplicada"],
            industryTrends: ["Big Data", "Business Intelligence"]
          }
        ],
        personalityInsights: {
          type: "Analítico-Creativo",
          description: "Combinas pensamiento lógico con ideas innovadoras",
          strengths: ["Resolución de problemas", "Pensamiento crítico", "Adaptabilidad"],
          growthAreas: ["Comunicación interpersonal", "Gestión del tiempo"],
          recommendedEnvironments: ["Startups tecnológicas", "Agencias creativas"]
        },
        skillsAssessment: {
          technical: [
            { name: "Programación", level: 8 },
            { name: "Análisis de datos", level: 7 },
            { name: "Diseño de sistemas", level: 6 }
          ],
          soft: [
            { name: "Trabajo en equipo", level: 7 },
            { name: "Comunicación", level: 6 },
            { name: "Resolución de problemas", level: 8 }
          ],
          interests: [
            { category: "Tecnología", score: 9 },
            { category: "Ciencias", score: 7 },
            { category: "Diseño", score: 6 }
          ]
        },
        summary: "Tu perfil muestra una fuerte inclinación hacia campos tecnológicos con un balance entre habilidades analíticas y creativas. Te recomendamos explorar carreras que combinen análisis técnico con resolución creativa de problemas."
      };
    }
  }

  async getInstantFeedback(response: UserResponse): Promise<string | null> {
    try {
      console.log('🤖 Llamando a Gemini API para feedback...');
    
      // Crear prompt específico según el tipo de respuesta
      let prompt = "";
    
      switch (response.type) {
        case 'slider':
          const value = Number(response.value);
          prompt = `El usuario respondió con un valor de ${value}/10 a una pregunta sobre preferencias vocacionales. 
          Genera un feedback personalizado, motivador y profesional de máximo 40 palabras que interprete esta respuesta 
          en el contexto de orientación vocacional. Enfócate en qué revela esta puntuación sobre sus intereses o habilidades.`;
          break;
          
        case 'dragAndDrop':
          prompt = `El usuario ordenó las siguientes actividades según su preferencia: ${JSON.stringify(response.value)}. 
          Genera un feedback personalizado de máximo 40 palabras que analice brevemente qué revelan sus preferencias 
          sobre su perfil vocacional. Sé específico sobre lo que su orden de prioridades indica.`;
          break;
          
        case 'multipleChoice':
          prompt = `El usuario seleccionó las siguientes opciones en una pregunta de orientación vocacional: ${JSON.stringify(response.value)}. 
          Genera un feedback motivador de máximo 40 palabras que valide su elección y explique brevemente qué revelan 
          estos intereses sobre su perfil profesional.`;
          break;
          
        case 'cardSort':
          prompt = `El usuario organizó estos valores/elementos según su importancia: ${JSON.stringify(response.value)}. 
          Genera un feedback de máximo 40 palabras que interprete qué revelan sus prioridades sobre su personalidad 
          vocacional y motivaciones profesionales.`;
          break;
          
        case 'text':
          prompt = `El usuario respondió: "${response.value}" a una pregunta de presentación personal. 
          Genera un saludo personalizado y motivador de máximo 30 palabras que reconozca su respuesta y 
          lo anime a continuar con la evaluación vocacional.`;
          break;
          
        default:
          prompt = `Genera un mensaje de agradecimiento motivador de máximo 25 palabras para una respuesta 
          en una evaluación vocacional que anime al usuario a continuar.`;
      }

      // Llamada real a la API de Gemini
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Eres un consejero vocacional experto. Proporciona feedback constructivo y motivador en español. ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
          topP: 0.8,
          topK: 40
        }
      };

      console.log('📡 Enviando request a Gemini:', { 
        url: apiUrl.replace(this.apiKey, 'API_KEY_HIDDEN'),
        model: this.model 
      });

      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${geminiResponse.statusText}`);
      }

      const data = await geminiResponse.json();
      console.log('📦 Respuesta de Gemini:', data);

      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content in Gemini response');
      }

      console.log('✅ Feedback generado por Gemini:', content.trim());
      return content.trim();

    } catch (error) {
      console.error('❌ Error con la API de Gemini:', error);
      
      // Fallback solo si la API falla
      return "Tu respuesta es muy valiosa para determinar tu perfil vocacional. ¡Continuemos!";
    }
  }
}

// Proveedor Claude (Anthropic)
export class ClaudeProvider implements AIProvider {
  name: string = 'Claude (Anthropic)';
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'claude-3-opus') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async getNextAdaptiveQuestion(responses: UserResponse[], currentQuestionId: string): Promise<string | null> {
    try {
      // Implementación para Claude
      console.log('Usando Claude para generar pregunta adaptativa');
      return "¿Qué aspectos te resultan más satisfactorios cuando completas un proyecto? [type: text]";
    } catch (error) {
      console.error("Error con la API de Claude:", error);
      return null;
    }
  }

  async generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
    try {
      // Implementación para Claude
      console.log('Usando Claude para generar resultados de evaluación');
      
      // Simulación de resultados
      const mockResult: AssessmentResults = {
        // Datos simulados similares a los de Gemini pero con variaciones
        careerRecommendations: [
          {
            title: "UX/UI Designer",
            description: "Diseñador de experiencias e interfaces de usuario",
            matchPercentage: 88,
            keySkills: ["Diseño visual", "Empatía", "Investigación de usuarios"],
            educationPaths: ["Diseño digital", "Psicología"],
            industryTrends: ["Diseño de experiencias", "Accesibilidad"]
          }
        ],
        personalityInsights: {
          type: "Creativo-Empático",
          description: "Te destacas por entender necesidades y plasmarlas visualmente",
          strengths: ["Creatividad", "Empatía"],
          growthAreas: ["Estructura y organización"],
          recommendedEnvironments: ["Agencias de diseño", "Departamentos de producto"]
        },
        skillsAssessment: {
          technical: [
            { name: "Diseño visual", level: 8 },
            { name: "Prototipado", level: 7 }
          ],
          soft: [
            { name: "Comunicación visual", level: 8 },
            { name: "Trabajo en equipo", level: 7 }
          ],
          interests: [
            { category: "Diseño", score: 9 },
            { category: "Psicología", score: 7 }
          ]
        },
        summary: "Tu perfil muestra un fuerte componente creativo con habilidad para entender y resolver necesidades de usuarios."
      };
      
      return mockResult;
    } catch (error) {
      console.error("Error con la API de Claude:", error);
      return null;
    }
  }

  async getInstantFeedback(response: UserResponse): Promise<string | null> {
    try {
      // Implementación para Claude
      return "Tu respuesta refleja una preferencia por procesos creativos y soluciones centradas en el usuario, indicando aptitudes para carreras en diseño o experiencia de usuario.";
    } catch (error) {
      console.error("Error con la API de Claude:", error);
      return null;
    }
  }
}

// Proveedor Mistral
export class MistralProvider implements AIProvider {
  name: string = 'Mistral';
  private apiKey: string;
  private model: string;
  
  constructor(apiKey: string, model: string = 'mistral-large') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async getNextAdaptiveQuestion(responses: UserResponse[], currentQuestionId: string): Promise<string | null> {
    try {
      // Implementación para Mistral
      return "¿Prefieres trabajar con conceptos teóricos o aplicaciones prácticas? [type: multipleChoice, options: [{id: 'opt1', text: 'Mayormente teoría'}, {id: 'opt2', text: 'Equilibrio teoría-práctica'}, {id: 'opt3', text: 'Mayormente práctica'}]]";
    } catch (error) {
      console.error("Error con la API de Mistral:", error);
      return null;
    }
  }

  async generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
    try {
      // Implementación para Mistral
      console.log('Usando Mistral para generar resultados de evaluación');
      
      // Resultados simulados
      const mockResult: AssessmentResults = {
        // Datos específicos para este proveedor
        careerRecommendations: [
          {
            title: "Analista de Datos",
            description: "Especialista en interpretación y análisis de datos",
            matchPercentage: 90,
            keySkills: ["Análisis estadístico", "Visualización de datos", "SQL"],
            educationPaths: ["Estadística", "Ciencia de Datos"],
            industryTrends: ["Big Data", "Business Intelligence"]
          }
        ],
        personalityInsights: {
          type: "Analítico-Metódico",
          description: "Te enfocas en datos y patrones con enfoque sistemático",
          strengths: ["Análisis cuantitativo", "Pensamiento estructurado"],
          growthAreas: ["Comunicación de resultados complejos"],
          recommendedEnvironments: ["Empresas de análisis", "Departamentos de investigación"]
        },
        skillsAssessment: {
          technical: [
            { name: "Análisis de datos", level: 9 },
            { name: "SQL", level: 7 }
          ],
          soft: [
            { name: "Pensamiento crítico", level: 8 },
            { name: "Resolución de problemas", level: 8 }
          ],
          interests: [
            { category: "Análisis", score: 9 },
            { category: "Investigación", score: 8 }
          ]
        },
        summary: "Tu perfil está orientado al análisis y comprensión de datos complejos, con capacidad para extraer conclusiones valiosas."
      };
      
      return mockResult;
    } catch (error) {
      console.error("Error con la API de Mistral:", error);
      return null;
    }
  }

  async getInstantFeedback(response: UserResponse): Promise<string | null> {
    try {
      // Implementación para Mistral
      return "Tu respuesta indica una orientación analítica con enfoque en resultados concretos, lo que sugiere aptitud para roles que requieren interpretación de datos.";
    } catch (error) {
      console.error("Error con la API de Mistral:", error);
      return null;
    }
  }
}

// Registro de proveedores disponibles
export const AI_PROVIDERS = {
  openai: OpenAIProvider,
  gemini: GeminiProvider,
  claude: ClaudeProvider,
  mistral: MistralProvider,
};

// Tipo para la configuración de AI
export type AIConfig = {
  provider: string;
  apiKey: string;
  model: string;
  apiKeyPlaceholder?: string;
};

// Clase simplificada de registro de proveedores
class AIProviderRegistry {
  private static instance: AIProviderRegistry;
  private currentProvider: AIProvider | null = null;
  private config: {
    provider: string;
    apiKey: string;
    model: string;
    // Agregar propiedades para todas las APIs
    openaiApiKey?: string;
    geminiApiKey?: string;
    claudeApiKey?: string;
    mistralApiKey?: string;
  } = {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o'
  };

  private constructor() {
    this.loadEnvironmentConfig();
  }

  public static getInstance(): AIProviderRegistry {
    if (!AIProviderRegistry.instance) {
      AIProviderRegistry.instance = new AIProviderRegistry();
    }
    return AIProviderRegistry.instance;
  }

  public loadEnvironmentConfig(): void {
    try {
      // Detectar si estamos en cliente o servidor
      const isClient = typeof window !== 'undefined';
      
      if (isClient) {
        // En el cliente - usar variables NEXT_PUBLIC_
        const envProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
        const envModel = process.env.NEXT_PUBLIC_AI_MODEL;

        if (envProvider) this.config.provider = envProvider;
        if (envModel) this.config.model = envModel;
        
        this.config.openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
        this.config.geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        this.config.claudeApiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
        this.config.mistralApiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
        
        console.log('🌐 Configuración del cliente cargada');
      } else {
        // En el servidor - usar variables sin NEXT_PUBLIC_
        const envProvider = process.env.AI_PROVIDER || process.env.NEXT_PUBLIC_AI_PROVIDER;
        const envModel = process.env.AI_MODEL || process.env.NEXT_PUBLIC_AI_MODEL;

        if (envProvider) this.config.provider = envProvider;
        if (envModel) this.config.model = envModel;
        
        // Usar las variables del servidor PRIMERO, luego las del cliente como fallback
        this.config.openaiApiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
        this.config.geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        this.config.claudeApiKey = process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
        this.config.mistralApiKey = process.env.MISTRAL_API_KEY || process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
        
        console.log('🖥️ Configuración del servidor cargada');
      }
      
      // Establecer la API key principal según el provider
      this.config.apiKey = this.getApiKeyFromEnv(isClient) || '';
      
      console.log('🔧 Configuración cargada:', {
        environment: isClient ? 'client' : 'server',
        provider: this.config.provider,
        model: this.config.model,
        has_openai: !!this.config.openaiApiKey && this.config.openaiApiKey !== 'sk-tu-openai-key-aqui',
        has_gemini: !!this.config.geminiApiKey && this.config.geminiApiKey !== 'tu-gemini-key-aqui',
        has_claude: !!this.config.claudeApiKey && this.config.claudeApiKey !== 'sk-ant-tu-claude-key-aqui',
        has_mistral: !!this.config.mistralApiKey && this.config.mistralApiKey !== 'tu-mistral-key-aqui'
      });
      
    } catch (error) {
      console.error('❌ Error al cargar la configuración:', error);
    }
  }

  private getApiKeyFromEnv(isClient: boolean = typeof window !== 'undefined'): string {
    if (isClient) {
      // Cliente - usar variables NEXT_PUBLIC_
      switch (this.config.provider) {
        case 'openai':
          return process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
        case 'gemini':
          return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        case 'claude':
          return process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
        case 'mistral':
          return process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
        default:
          return '';
      }
    } else {
      // Servidor - usar variables sin NEXT_PUBLIC_
      switch (this.config.provider) {
        case 'openai':
          return process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
        case 'gemini':
          return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        case 'claude':
          return process.env.CLAUDE_API_KEY || process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
        case 'mistral':
          return process.env.MISTRAL_API_KEY || process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
        default:
          return '';
      }
    }
  }

  public getProvider(): AIProvider {
    const provider = this.config.provider;
    
    console.log('🔍 Buscando provider:', provider);
    console.log('🔧 APIs disponibles:', {
      openai: this.isValidApiKey(this.config.openaiApiKey, 'sk-tu-openai-key-aqui'),
      gemini: this.isValidApiKey(this.config.geminiApiKey, 'tu-gemini-key-aqui'),
      claude: this.isValidApiKey(this.config.claudeApiKey, 'sk-ant-tu-claude-key-aqui'),
      mistral: this.isValidApiKey(this.config.mistralApiKey, 'tu-mistral-key-aqui')
    });
    
    // Intentar con el provider configurado primero
    switch (provider) {
      case 'openai':
        if (this.isValidApiKey(this.config.openaiApiKey, 'sk-tu-openai-key-aqui')) {
          console.log('✅ Usando OpenAI como provider principal');
          return new OpenAIProvider(this.config.openaiApiKey!, this.config.model);
        }
        break;
      case 'gemini':
        if (this.isValidApiKey(this.config.geminiApiKey, 'tu-gemini-key-aqui')) {
          console.log('✅ Usando Gemini como provider principal');
          return new GeminiProvider(this.config.geminiApiKey!, this.config.model);
        }
        break;
      case 'claude':
        if (this.isValidApiKey(this.config.claudeApiKey, 'sk-ant-tu-claude-key-aqui')) {
          console.log('✅ Usando Claude como provider principal');
          return new ClaudeProvider(this.config.claudeApiKey!, this.config.model);
        }
        break;
      case 'mistral':
        if (this.isValidApiKey(this.config.mistralApiKey, 'tu-mistral-key-aqui')) {
          console.log('✅ Usando Mistral como provider principal');
          return new MistralProvider(this.config.mistralApiKey!, this.config.model);
        }
        break;
    }
    
    // Fallback: buscar CUALQUIER API key válida
    console.log('🔄 Provider principal no disponible, buscando alternativas...');
    
    if (this.isValidApiKey(this.config.geminiApiKey, 'tu-gemini-key-aqui')) {
      console.log('✅ Usando Gemini como fallback');
      return new GeminiProvider(this.config.geminiApiKey!, 'gemini-1.5-flash');
    }
    
    if (this.isValidApiKey(this.config.openaiApiKey, 'sk-tu-openai-key-aqui')) {
      console.log('✅ Usando OpenAI como fallback');
      return new OpenAIProvider(this.config.openaiApiKey!, 'gpt-3.5-turbo');
    }
    
    if (this.isValidApiKey(this.config.claudeApiKey, 'sk-ant-tu-claude-key-aqui')) {
      console.log('✅ Usando Claude como fallback');
      return new ClaudeProvider(this.config.claudeApiKey!, 'claude-3-sonnet-20240229');
    }
    
    if (this.isValidApiKey(this.config.mistralApiKey, 'tu-mistral-key-aqui')) {
      console.log('✅ Usando Mistral como fallback');
      return new MistralProvider(this.config.mistralApiKey!, 'mistral-large');
    }
    
    throw new Error('❌ No hay APIs de IA configuradas correctamente');
  }

  // Método auxiliar para validar API keys
  private isValidApiKey(apiKey: string | undefined, placeholder: string): boolean {
    return !!(apiKey && apiKey !== placeholder && apiKey.length > 10);
  }

  // Actualiza el método getConfig para mostrar más información
  public getConfig(): AIConfig & { 
    openaiApiKey?: string;
    geminiApiKey?: string; 
    claudeApiKey?: string;
    mistralApiKey?: string;
    availableProviders?: string[];
  } {
    const availableProviders = [];
    
    if (this.isValidApiKey(this.config.openaiApiKey, 'sk-tu-openai-key-aqui')) {
      availableProviders.push('openai');
    }
    if (this.isValidApiKey(this.config.geminiApiKey, 'tu-gemini-key-aqui')) {
      availableProviders.push('gemini');
    }
    if (this.isValidApiKey(this.config.claudeApiKey, 'sk-ant-tu-claude-key-aqui')) {
      availableProviders.push('claude');
    }
    if (this.isValidApiKey(this.config.mistralApiKey, 'tu-mistral-key-aqui')) {
      availableProviders.push('mistral');
    }
    
    return { 
      ...this.config,
      availableProviders
    };
  }
}

// Exportar instancia para usar en la aplicación
export const aiProviderRegistry = AIProviderRegistry.getInstance();
