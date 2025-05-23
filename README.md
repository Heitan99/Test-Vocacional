This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Configuración de Variables de Entorno

Este proyecto utiliza diferentes proveedores de IA que requieren API keys para funcionar.

#### Desarrollo Local

Para desarrollo local, ya hemos creado un archivo `.env.local` para ti. Solo necesitas:

1. Editar `.env.local` y agregar tus API keys para los proveedores que deseas utilizar:
   ```
   NEXT_PUBLIC_AI_PROVIDER=openai
   NEXT_PUBLIC_AI_MODEL=gpt-4o
   NEXT_PUBLIC_OPENAI_API_KEY=tu-api-key-aquí
   ```

2. Durante el desarrollo, puedes usar estas variables con prefijo `NEXT_PUBLIC_` para pruebas.

#### Configuración para Producción

Para entornos de producción, hemos implementado un enfoque de seguridad robusto:

1. **API Keys protegidas**: Las claves se almacenan en variables de entorno del servidor sin el prefijo `NEXT_PUBLIC_`
2. **API Routes seguras**: Todas las llamadas a APIs de IA se realizan desde el servidor mediante API Routes
3. **No exposición al cliente**: Las claves nunca se exponen en el navegador

Para configurar el entorno de producción:

```bash
node scripts/set-env-vars.js
```

Este script te guiará para configurar las variables en tu plataforma de despliegue (Vercel, Netlify, etc.).

#### Uso de API Routes Seguras

Hemos implementado API Routes seguras en:
- `/api/assessment/generate-results` - Para generar resultados de evaluación
- `/api/assessment/feedback` - Para retroalimentación instantánea
- `/api/assessment/next-question` - Para preguntas adaptativas

Utiliza las funciones del cliente en `src/lib/api/client.ts` que manejan automáticamente estas rutas seguras.

### Desarrollo Local

Una vez configuradas las variables de entorno, inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente a medida que editas el archivo.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
