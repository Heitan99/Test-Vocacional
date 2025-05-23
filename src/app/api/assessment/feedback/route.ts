// Ruta de API para obtener retroalimentación instantánea
import { NextRequest, NextResponse } from 'next/server';
import { aiProviderRegistry, type UserResponse } from '@/lib/api/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const { response } = await request.json();
    
    console.log('🤖 Generando feedback con multi-IA para:', response);
    
    // Convertir la respuesta al formato UserResponse
    const userResponse: UserResponse = {
      questionId: response.questionId,
      type: response.type,
      value: response.value,
      timestamp: response.timestamp || Date.now()
    };
    
    // Usar el sistema de IA que ya tienes configurado
    const provider = aiProviderRegistry.getProvider();
    console.log(`🔧 Usando proveedor: ${provider.name}`);
    
    // Llamar al método getInstantFeedback que ya existe
    const feedback = await provider.getInstantFeedback(userResponse);
    
    if (feedback) {
      console.log('✅ Feedback generado por IA:', feedback);
      
      return NextResponse.json({ 
        feedback,
        success: true,
        source: "multi-AI",
        provider: provider.name
      });
    } else {
      // Fallback si la IA falla
      console.warn('⚠️ IA falló, usando fallback');
      
      return NextResponse.json({ 
        feedback: getFallbackFeedback(response),
        success: true,
        source: "fallback",
        provider: provider.name
      });
    }
    
  } catch (error) {
    console.error('❌ Error en feedback API:', error);
    
    return NextResponse.json({ 
      feedback: "Gracias por tu respuesta.",
      success: true,
      source: "error-fallback"
    });
  }
}

// Función de fallback (solo para emergencias)
function getFallbackFeedback(response: any): string {
  if (response.type === 'slider') {
    const value = Number(response.value);
    if (value >= 8) {
      return "¡Excelente! Esta es una fortaleza importante para ti.";
    } else if (value >= 5) {
      return "Interesante perspectiva. Esto puede ser un área de desarrollo.";
    } else {
      return "Gracias por tu honestidad. Todos tenemos diferentes preferencias.";
    }
  } else if (response.type === 'multipleChoice') {
    return "Tus intereses son muy valiosos para determinar tu perfil vocacional.";
  } else if (response.type === 'dragAndDrop') {
    return "Tu orden de preferencias nos ayuda a entender mejor tus motivaciones.";
  } else if (response.type === 'text') {
    return "Es un placer conocerte. Comencemos tu evaluación vocacional.";
  } else if (response.type === 'cardSort') {
    return "Tus valores personales son fundamentales para encontrar la carrera ideal.";
  }
  
  return "Gracias por tu respuesta.";
}

// Método GET para testing
export async function GET() {
  try {
    const provider = aiProviderRegistry.getProvider();
    const config = aiProviderRegistry.getConfig();
    
    return NextResponse.json({ 
      message: "Feedback API multi-IA funcionando correctamente",
      status: "ok",
      ai_enabled: true,
      current_provider: provider.name,
      config: {
        provider: config.provider,
        model: config.model,
        has_api_key: !!config.apiKey
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      message: "Error en configuración de IA",
      status: "error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
