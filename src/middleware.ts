import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { aiProviderRegistry } from '@/lib/api/ai-providers';

export async function middleware(request: NextRequest) {
  // Si la ruta es /api/config y es una petición POST
  if (request.nextUrl.pathname === '/api/config' && request.method === 'POST') {
    try {
      // Procesar la solicitud normalmente
      const response = await NextResponse.next();

      // Si la respuesta fue exitosa, forzar una recarga de la configuración
      if (response.ok) {
        // En producción, las variables de entorno son inmutables
        // Pero en desarrollo podemos forzar una recarga
        if (process.env.NODE_ENV === 'development') {
          // Recargar la configuración del registro de proveedores
          aiProviderRegistry.loadEnvironmentConfig();
        }
      }

      return response;
    } catch (error) {
      console.error('Error en middleware:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configurar el middleware para que solo se ejecute en las rutas específicas
export const config = {
  matcher: '/api/config',
};
