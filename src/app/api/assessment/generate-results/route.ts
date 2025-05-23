import { NextRequest, NextResponse } from 'next/server';

interface UserResponse {
  questionId: string;
  type: string;
  value: any;
  timestamp: number;
}

interface GenerateResultsRequest {
  responses: UserResponse[];
}

interface AIProvider {
  id: string;
  name: string;
  models: string[];
  envKey: string;
  serverEnvKey: string;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    envKey: 'NEXT_PUBLIC_OPENAI_API_KEY',
    serverEnvKey: 'OPENAI_API_KEY'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    envKey: 'NEXT_PUBLIC_GEMINI_API_KEY',
    serverEnvKey: 'GEMINI_API_KEY'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    envKey: 'NEXT_PUBLIC_CLAUDE_API_KEY',
    serverEnvKey: 'CLAUDE_API_KEY'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    envKey: 'NEXT_PUBLIC_MISTRAL_API_KEY',
    serverEnvKey: 'MISTRAL_API_KEY'
  }
];

function getCurrentServerProvider(): AIProvider | null {
  const configuredProvider = process.env.AI_PROVIDER;
  const provider = AI_PROVIDERS.find(p => p.id === configuredProvider);
  
  if (!provider) return null;
  
  const hasApiKey = process.env[provider.serverEnvKey] && process.env[provider.serverEnvKey]!.trim() !== '';
  return hasApiKey ? provider : null;
}

const PROMPT_TEMPLATE = `
Actúa como un experto consejero vocacional. Analiza las siguientes respuestas de una evaluación vocacional y genera recomendaciones personalizadas.

Respuestas del usuario:
{responses}

Genera un análisis vocacional completo que incluya:
1. Un resumen de las fortalezas identificadas
2. Áreas de interés principales  
3. Recomendaciones de carreras específicas
4. Sugerencias de desarrollo profesional
5. Próximos pasos recomendados

Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:
{
  "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"],
  "interests": ["interés1", "interés2", "interés3"],
  "recommendedCareers": [
    {
      "title": "Nombre de la carrera",
      "description": "Descripción de por qué es recomendada",
      "match": 95
    }
  ],
  "developmentAreas": ["área1", "área2"],
  "nextSteps": ["paso1", "paso2", "paso3"],
  "summary": "Resumen general del perfil vocacional"
}
`;

export async function POST(request: NextRequest) {
  try {
    const provider = getCurrentServerProvider();
    
    if (!provider) {
      console.error('No hay proveedor de IA configurado o disponible');
      console.error('AI_PROVIDER:', process.env.AI_PROVIDER);
      console.error('Variables disponibles:', Object.keys(process.env).filter(key => key.includes('API_KEY')));
      
      return NextResponse.json(
        { error: 'No hay proveedor de IA configurado correctamente. Ve a configuración para establecer uno.' },
        { status: 500 }
      );
    }

    console.log(`Usando proveedor: ${provider.name}`);
    console.log(`API Key disponible para ${provider.serverEnvKey}:`, !!process.env[provider.serverEnvKey]);
    
    const requestData = await request.json() as GenerateResultsRequest;
    console.log('Datos recibidos:', JSON.stringify(requestData, null, 2));
    
    let results;
    
    try {
      switch (provider.id) {
        case 'openai':
          results = await generateWithOpenAI(requestData, provider);
          break;
        case 'gemini':
          results = await generateWithGemini(requestData, provider);
          break;
        case 'claude':
          results = await generateWithClaude(requestData, provider);
          break;
        case 'mistral':
          results = await generateWithMistral(requestData, provider);
          break;
        default:
          throw new Error(`Proveedor ${provider.id} no soportado`);
      }
    } catch (error: any) {
      // Detectar errores específicos de cuota
      if (error.message && error.message.startsWith('QUOTA_EXCEEDED:')) {
        console.warn('⚠️ Cuota de API excedida:', error.message);
        
        // Enviar respuesta específica para error de cuota
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      }
      // Relanzar otros errores
      throw error;
    }
    
    console.log('Resultados generados exitosamente');
    return NextResponse.json({ 
      success: true, 
      results,
      provider: provider.name 
    });
  } catch (error: any) {
    console.error('Error en la API de generación de resultados:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// OPENAI IMPLEMENTATION
async function generateWithOpenAI(requestData: GenerateResultsRequest, provider: AIProvider) {
  try {
    const OpenAI = require('openai');
    const apiKey = process.env[provider.serverEnvKey];
    
    if (!apiKey) {
      throw new Error(`No se encontró API key para ${provider.name}`);
    }
    
    const openai = new OpenAI({ apiKey });
    const model = process.env.AI_MODEL || 'gpt-3.5-turbo';
    
    console.log(`🔄 Generando con OpenAI modelo: ${model}`);
    
    const prompt = PROMPT_TEMPLATE.replace('{responses}', JSON.stringify(requestData.responses, null, 2));
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: "Eres un experto consejero vocacional. Responde únicamente en formato JSON válido." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    return parseAIResponse(text, 'OpenAI');
  } catch (error: any) {
    console.error('Error en generateWithOpenAI:', error);
    throw new Error(`Error al generar resultados con OpenAI: ${error.message}`);
  }
}

// GEMINI IMPLEMENTATION
async function generateWithGemini(requestData: GenerateResultsRequest, provider: AIProvider) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const apiKey = process.env[provider.serverEnvKey];
    
    if (!apiKey) {
      throw new Error(`No se encontró API key para ${provider.name}`);
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || 'gemini-1.5-flash' });
    
    console.log(`Generando con Gemini modelo: ${process.env.AI_MODEL || 'gemini-1.5-flash'}`);
    
    const prompt = PROMPT_TEMPLATE.replace('{responses}', JSON.stringify(requestData.responses, null, 2));
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No se recibió respuesta de Gemini');
    }

    return parseAIResponse(text, 'Gemini');
  } catch (error: any) {
    console.error('Error en generateWithGemini:', error);
    
    // Detectar error específico de cuota excedida
    if (error.message && error.message.includes('429') && error.message.includes('quota')) {
      throw new Error(`QUOTA_EXCEEDED:Gemini:Se ha excedido la cuota de solicitudes. Por favor, intenta nuevamente más tarde o utiliza otro proveedor de IA.`);
    }
    
    throw new Error(`Error al generar resultados con Gemini: ${error.message}`);
  }
}

// CLAUDE IMPLEMENTATION
async function generateWithClaude(requestData: GenerateResultsRequest, provider: AIProvider) {
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const apiKey = process.env[provider.serverEnvKey];
    
    if (!apiKey) {
      throw new Error(`No se encontró API key para ${provider.name}`);
    }
    
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.AI_MODEL || 'claude-3-haiku-20240307';
    
    console.log(`Generando con Claude modelo: ${model}`);
    
    const prompt = PROMPT_TEMPLATE.replace('{responses}', JSON.stringify(requestData.responses, null, 2));
    
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const text = message.content[0]?.text;
    if (!text) {
      throw new Error('No se recibió respuesta de Claude');
    }

    return parseAIResponse(text, 'Claude');
  } catch (error: any) {
    console.error('Error en generateWithClaude:', error);
    throw new Error(`Error al generar resultados con Claude: ${error.message}`);
  }
}

// MISTRAL IMPLEMENTATION
async function generateWithMistral(requestData: GenerateResultsRequest, provider: AIProvider) {
  try {
    const MistralClient = require('@mistralai/mistralai').default;
    const apiKey = process.env[provider.serverEnvKey];
    
    if (!apiKey) {
      throw new Error(`No se encontró API key para ${provider.name}`);
    }
    
    const client = new MistralClient(apiKey);
    const model = process.env.AI_MODEL || 'mistral-small-latest';
    
    console.log(`Generando con Mistral modelo: ${model}`);
    
    const prompt = PROMPT_TEMPLATE.replace('{responses}', JSON.stringify(requestData.responses, null, 2));
    
    const chatResponse = await client.chat({
      model: model,
      messages: [
        { role: "system", content: "Eres un experto consejero vocacional. Responde únicamente en formato JSON válido." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      maxTokens: 1500,
    });

    const text = chatResponse.choices[0]?.message?.content;
    if (!text) {
      throw new Error('No se recibió respuesta de Mistral');
    }

    return parseAIResponse(text, 'Mistral');
  } catch (error: any) {
    console.error('Error en generateWithMistral:', error);
    throw new Error(`Error al generar resultados con Mistral: ${error.message}`);
  }
}

function parseAIResponse(text: string, providerName: string) {
  console.log(`Respuesta cruda de ${providerName}:`, text);
  
  try {
    // Buscar JSON en la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No se encontró JSON válido en la respuesta');
    }
    
    const cleanedJson = jsonMatch[0]
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const results = JSON.parse(cleanedJson);
    console.log('Resultados parseados correctamente:', results);
    
    if (!results.strengths || !results.interests || !results.recommendedCareers) {
      throw new Error('Respuesta incompleta de la IA');
    }
    
    return {
      ...results,
      isGeneratedByAI: true
    };
  } catch (parseError) {
    console.error(`Error al parsear JSON de ${providerName}:`, parseError);
    console.error('Texto completo recibido:', text);
    
    throw new Error(`No se pudo generar una recomendación personalizada. Por favor, intenta nuevamente.`);
  }
}
