import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Ruta al archivo de configuración
const CONFIG_FILE = path.join(process.cwd(), '.env.local');

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { provider, apiKey, model } = data;

    // Validar datos requeridos
    if (!provider || !apiKey || !model) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Leer el archivo .env.local actual
    let envContent = await fs.readFile(CONFIG_FILE, 'utf-8');
    const envLines = envContent.split('\n');

    // Actualizar las variables relevantes
    const updates: { [key: string]: string } = {
      [`NEXT_PUBLIC_AI_PROVIDER`]: provider,
      [`NEXT_PUBLIC_AI_MODEL`]: model,
      [`NEXT_PUBLIC_${provider.toUpperCase()}_API_KEY`]: apiKey,
    };

    // Aplicar las actualizaciones
    for (const [key, value] of Object.entries(updates)) {
      const lineIndex = envLines.findIndex(line => 
        line.startsWith(`${key}=`) || line === ''
      );

      const newLine = `${key}=${value}`;

      if (lineIndex >= 0) {
        envLines[lineIndex] = newLine;
      } else {
        envLines.push(newLine);
      }
    }

    // Escribir el archivo actualizado
    await fs.writeFile(CONFIG_FILE, envLines.join('\n'));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar la configuración:', error);
    return NextResponse.json(
      { error: 'Error al guardar la configuración' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Leer el archivo .env.local
    const envContent = await fs.readFile(CONFIG_FILE, 'utf-8');
    const envLines = envContent.split('\n');
    
    // Extraer la configuración actual
    const config: { [key: string]: string } = {};
    
    envLines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });

    // Construir el objeto de respuesta
    const response = {
      provider: config['NEXT_PUBLIC_AI_PROVIDER'] || 'openai',
      model: config['NEXT_PUBLIC_AI_MODEL'] || '',
      apiKey: config[`NEXT_PUBLIC_${config['NEXT_PUBLIC_AI_PROVIDER']?.toUpperCase()}_API_KEY`] || '',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error al leer la configuración:', error);
    return NextResponse.json(
      { error: 'Error al leer la configuración' },
      { status: 500 }
    );
  }
}
