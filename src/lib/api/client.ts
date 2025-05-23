// Cliente para llamadas a la API segura
// Usar esta función en componentes del cliente en lugar de llamar directamente a OpenAI

import { UserResponse, AssessmentResults } from '@/lib/api/assessment-client';

/**
 * Genera resultados de evaluación vocacional a través de la API segura del servidor
 * Esta función es segura para usar desde el cliente porque no expone API keys
 */
export async function generateAssessmentResults(responses: UserResponse[]): Promise<AssessmentResults | null> {
  try {
    console.log('Enviando respuestas al servidor:', responses);
    
    const response = await fetch('/api/assessment/generate-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del servidor:', errorText);
      
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error || `Error del servidor: ${response.status}`);
      } catch {
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
    }

    const result = await response.json() as AssessmentResults;
    console.log('Resultados recibidos:', result);
    return result;
  } catch (error) {
    console.error('Error al generar resultados de evaluación:', error);
    return null;
  }
}

/**
 * Obtiene retroalimentación instantánea sobre una respuesta del usuario
 */
export async function getInstantFeedback(response: UserResponse): Promise<string | null> {
  try {
    const apiResponse = await fetch('/api/assessment/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ response }),
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      throw new Error(error.error || 'Error al obtener retroalimentación');
    }

    const data = await apiResponse.json();
    return data.feedback;
  } catch (error) {
    console.error('Error al obtener retroalimentación instantánea:', error);
    return null;
  }
}

/**
 * Obtiene la siguiente pregunta adaptativa basada en respuestas previas
 */
export async function getNextAdaptiveQuestion(responses: UserResponse[], currentQuestionId: string): Promise<string | null> {
  try {
    const apiResponse = await fetch('/api/assessment/next-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses, currentQuestionId }),
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      throw new Error(error.error || 'Error al obtener la siguiente pregunta');
    }

    const data = await apiResponse.json();
    return data.question;
  } catch (error) {
    console.error('Error al generar la siguiente pregunta adaptativa:', error);
    return null;
  }
}
