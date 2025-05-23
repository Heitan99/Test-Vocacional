export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  envKey: string;
  serverEnvKey: string;
}

export const AI_PROVIDERS: AIProvider[] = [
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
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    envKey: 'NEXT_PUBLIC_CLAUDE_API_KEY',
    serverEnvKey: 'CLAUDE_API_KEY'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    models: ['mistral-large', 'mistral-medium', 'mistral-small'],
    envKey: 'NEXT_PUBLIC_MISTRAL_API_KEY',
    serverEnvKey: 'MISTRAL_API_KEY'
  }
];

// Función para verificar qué APIs están disponibles en el cliente
export function getAvailableProviders(): AIProvider[] {
  if (typeof window === 'undefined') return []; // Para SSR
  
  return AI_PROVIDERS.filter(provider => {
    const apiKey = process.env[provider.envKey];
    return apiKey && apiKey.trim() !== '';
  });
}

// Función para obtener el proveedor configurado
export function getCurrentProvider(): AIProvider | null {
  if (typeof window === 'undefined') return null; // Para SSR
  
  const configuredProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
  const provider = AI_PROVIDERS.find(p => p.id === configuredProvider);
  
  if (!provider) return null;
  
  // Verificar que tenga API key
  const hasApiKey = process.env[provider.envKey] && process.env[provider.envKey]!.trim() !== '';
  
  return hasApiKey ? provider : null;
}

// Función para verificar APIs del servidor
export function getServerAvailableProviders(): AIProvider[] {
  return AI_PROVIDERS.filter(provider => {
    const apiKey = process.env[provider.serverEnvKey];
    return apiKey && apiKey.trim() !== '';
  });
}

export function getCurrentServerProvider(): AIProvider | null {
  const configuredProvider = process.env.AI_PROVIDER;
  const provider = AI_PROVIDERS.find(p => p.id === configuredProvider);
  
  if (!provider) return null;
  
  // Verificar que tenga API key en el servidor
  const hasApiKey = process.env[provider.serverEnvKey] && process.env[provider.serverEnvKey]!.trim() !== '';
  
  return hasApiKey ? provider : null;
}