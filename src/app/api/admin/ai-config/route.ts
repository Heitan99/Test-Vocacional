import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { provider, model } = await request.json();
    
    console.log('🔧 Actualizando configuración de IA:', { provider, model });
    
    // Leer el archivo .env.local actual
    const envPath = join(process.cwd(), '.env.local');
    let envContent = '';
    
    try {
      const fs = require('fs');
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      console.log('Creando nuevo archivo .env.local');
    }
    
    // Actualizar o agregar las variables
    const lines = envContent.split('\n');
    const updatedLines = [];
    let foundAIProvider = false;
    let foundAIModel = false;
    let foundClientProvider = false;
    let foundClientModel = false;
    
    for (const line of lines) {
      if (line.startsWith('AI_PROVIDER=')) {
        updatedLines.push(`AI_PROVIDER=${provider}`);
        foundAIProvider = true;
      } else if (line.startsWith('AI_MODEL=')) {
        updatedLines.push(`AI_MODEL=${model}`);
        foundAIModel = true;
      } else if (line.startsWith('NEXT_PUBLIC_AI_PROVIDER=')) {
        updatedLines.push(`NEXT_PUBLIC_AI_PROVIDER=${provider}`);
        foundClientProvider = true;
      } else if (line.startsWith('NEXT_PUBLIC_AI_MODEL=')) {
        updatedLines.push(`NEXT_PUBLIC_AI_MODEL=${model}`);
        foundClientModel = true;
      } else {
        updatedLines.push(line);
      }
    }
    
    // Agregar variables que no existían
    if (!foundAIProvider) {
      updatedLines.push(`AI_PROVIDER=${provider}`);
    }
    if (!foundAIModel) {
      updatedLines.push(`AI_MODEL=${model}`);
    }
    if (!foundClientProvider) {
      updatedLines.push(`NEXT_PUBLIC_AI_PROVIDER=${provider}`);
    }
    if (!foundClientModel) {
      updatedLines.push(`NEXT_PUBLIC_AI_MODEL=${model}`);
    }
    
    // Escribir el archivo actualizado
    const newEnvContent = updatedLines.join('\n');
    await writeFile(envPath, newEnvContent, 'utf8');
    
    console.log('✅ Configuración de IA actualizada correctamente');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuración guardada correctamente' 
    });
  } catch (error) {
    console.error('❌ Error al guardar configuración de IA:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 }
    );
  }
}