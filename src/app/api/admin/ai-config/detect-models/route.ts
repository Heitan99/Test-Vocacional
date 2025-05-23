import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  provider: string;
  apiKey: string;
}

/**
 * Detecta los modelos disponibles para un proveedor de IA con una API key específica
 */
export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { provider, apiKey } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Provider y API key son requeridos' },
        { status: 400 }
      );
    }

    // Modelos disponibles según el proveedor
    // En un entorno de producción, esto debería consultar realmente a las APIs de los proveedores
    // para obtener los modelos disponibles para esa clave específica
    let models: string[] = [];

    switch (provider) {
      case 'openai':
        // En producción, haríamos una llamada a la API de OpenAI para obtener modelos disponibles
        // Aquí simularemos una detección basada en la longitud y formato de la API key
        if (apiKey.startsWith('sk-')) {
          models = ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo'];
        }
        break;

      case 'gemini':
        // Para Gemini, verificamos el formato típico de las claves de Google API
        if (apiKey.startsWith('AIza')) {
          models = ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
        }
        break;

      case 'claude':
        // Para Claude, sus claves tienen un formato específico
        if (apiKey.length > 30) {
          models = ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-2.1'];
        }
        break;

      case 'mistral':
        // Para Mistral, verificamos el formato típico
        if (apiKey.startsWith('mis_') || apiKey.length > 30) {
          models = ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'mistral-large', 'mistral-medium', 'mistral-small', 'open-mixtral-8x7b'];
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Proveedor no soportado' },
          { status: 400 }
        );
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error al detectar modelos:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
