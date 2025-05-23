// Ruta de API para obtener la siguiente pregunta adaptativa
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Obtener la API key del servidor
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada en el servidor' },
        { status: 500 }
      );
    }

    const model = process.env.AI_MODEL || 'gpt-4o';
    const requestData = await request.json();
    
    if (!requestData.responses || !requestData.currentQuestionId) {
      return NextResponse.json(
        { error: 'Formato de solicitud inválido' },
        { status: 400 }
      );
    }

    // Inicializar el cliente de OpenAI con la clave del servidor
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Hacer la llamada a la API
    const completion = await openai.chat.completions.create({
      model: model,
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
          content: `Basado en estas respuestas previas: ${JSON.stringify(requestData.responses)}, y considerando que acaban de responder a la pregunta con ID ${requestData.currentQuestionId},
          ¿cuál debería ser la siguiente pregunta más relevante para hacerle al usuario? Proporciona la pregunta, el tipo (slider, dragAndDrop, cardSort, text) y las opciones si aplica.`
        }
      ]
    });

    const question = completion.choices[0].message.content;
    
    return NextResponse.json({ question });
    
  } catch (error: any) {
    console.error('Error en la API Route:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
