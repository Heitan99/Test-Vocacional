'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Eye, EyeOff, Settings } from 'lucide-react';

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

export function AISettings() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [currentProvider, setCurrentProvider] = useState<AIProvider | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [apiKeys, setApiKeys] = useState<{[key: string]: string}>({});
  const [showApiKey, setShowApiKey] = useState(false);
  const [detectedModels, setDetectedModels] = useState<{[key: string]: string[]}>({});
  const [isDetectingModels, setIsDetectingModels] = useState(false);

  // Función para detectar modelos disponibles para un proveedor
  const detectAvailableModels = async (providerId: string, apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') return;
    
    setIsDetectingModels(true);
    
    try {
      // Consultar al backend para obtener modelos disponibles
      const response = await fetch('/api/admin/ai-config/detect-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: providerId,
          apiKey: apiKey
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.models && Array.isArray(data.models)) {
          setDetectedModels(prev => ({
            ...prev,
            [providerId]: data.models
          }));
          
          // Si ya teníamos seleccionado un modelo que no está en la lista, actualizamos
          if (selectedProvider === providerId) {
            const isCurrentModelAvailable = data.models.includes(selectedModel);
            if (!isCurrentModelAvailable && data.models.length > 0) {
              setSelectedModel(data.models[0]);
            }
          }
          
          console.log(`Modelos detectados para ${providerId}:`, data.models);
        }
      } else {
        console.error('Error detectando modelos:', await response.text());
      }
    } catch (error) {
      console.error('Error al consultar modelos disponibles:', error);
    } finally {
      setIsDetectingModels(false);
    }
  };

  const getApiKeyFromEnv = (provider: AIProvider): string => {
    // Comprobar primero el localStorage (tiene prioridad)
    try {
      const storedKey = localStorage.getItem(provider.envKey);
      if (storedKey && storedKey.trim() !== '') {
        return storedKey;
      }
    } catch (e) {
      console.log('Error accediendo a localStorage:', e);
    }
    
    // Si no hay en localStorage, intentar con variables de entorno
    // En Next.js, podemos acceder directamente a variables NEXT_PUBLIC_ en el cliente
    if (provider.id === 'gemini') {
      return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    } else if (provider.id === 'openai') {
      return process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    } else if (provider.id === 'claude') {
      return process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
    } else if (provider.id === 'mistral') {
      return process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
    }
    
    return '';
  };

  const getCurrentProvider = (): AIProvider | null => {
    // Intentamos obtener el proveedor configurado
    const configuredProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
    const provider = AI_PROVIDERS.find(p => p.id === configuredProvider);
    
    if (!provider) return null;
    
    // Verificamos si tiene API key
    const apiKey = getApiKeyFromEnv(provider);
    const hasApiKey = apiKey && apiKey.trim() !== '';
    
    return hasApiKey ? provider : null;
  };  useEffect(() => {
    // Esta función se ejecuta solo en el lado del cliente
    const initializeApiKeys = () => {
      const keys: {[key: string]: string} = {};
      
      // Primero, cargamos los valores directamente de las variables de entorno NEXT_PUBLIC_
      const envGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      const envOpenAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
      const envClaudeKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
      const envMistralKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
      
      console.log('Environment Gemini API Key:', envGeminiKey ? `Found (${envGeminiKey.length} chars)` : 'Not found');
      
      // Intentamos cargar claves API para cada proveedor
      AI_PROVIDERS.forEach(provider => {
        // Primero intentamos desde localStorage (prioridad)
        try {
          const storedKey = localStorage.getItem(provider.envKey);
          if (storedKey && storedKey.trim() !== '') {
            keys[provider.id] = storedKey;
            console.log(`Provider ${provider.id}: API Key found in localStorage (length ${storedKey.length})`);
            return;
          }
        } catch (e) {
          console.log('Error accediendo a localStorage:', e);
        }
        
        // Si no está en localStorage, usamos las variables de entorno
        let envKey = '';
        if (provider.id === 'gemini') envKey = envGeminiKey;
        else if (provider.id === 'openai') envKey = envOpenAIKey;
        else if (provider.id === 'claude') envKey = envClaudeKey;
        else if (provider.id === 'mistral') envKey = envMistralKey;
        
        if (envKey && envKey.trim() !== '') {
          keys[provider.id] = envKey;
          console.log(`Provider ${provider.id}: API Key found in env vars (length ${envKey.length})`);
        } else {
          console.log(`Provider ${provider.id}: No API Key found`);
        }
      });
      
      setApiKeys(keys);
      
      // Obtener el proveedor configurado actualmente
      const configuredProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
        // Para Gemini, forzamos la selección si tenemos la clave o está configurado como predeterminado
      const geminiProvider = AI_PROVIDERS.find(p => p.id === 'gemini');
      
      if (geminiProvider && (keys['gemini'] || configuredProvider === 'gemini')) {
        setSelectedProvider('gemini');
        setCurrentProvider(geminiProvider);
        
        // Intentar detectar los modelos disponibles para Gemini si tenemos API key
        if (keys['gemini']) {
          detectAvailableModels('gemini', keys['gemini']);
          // No establecemos un modelo predeterminado, esperamos a la detección
        } else if (process.env.NEXT_PUBLIC_AI_MODEL) {
          // Si hay un modelo configurado en variables de entorno, lo usamos temporalmente
          setSelectedModel(process.env.NEXT_PUBLIC_AI_MODEL);
        }
        return;
      }
        // Si no hay Gemini configurado, continuamos con el flujo normal
      if (configuredProvider) {
        const provider = AI_PROVIDERS.find(p => p.id === configuredProvider);
        if (provider) {
          setSelectedProvider(provider.id);
          setCurrentProvider(provider);
          
          // Si hay una variable de entorno con el modelo actual, la usamos temporalmente
          if (process.env.NEXT_PUBLIC_AI_MODEL) {
            setSelectedModel(process.env.NEXT_PUBLIC_AI_MODEL);
          }
          
          // Intentar detectar los modelos disponibles si tenemos API key
          if (keys[provider.id]) {
            detectAvailableModels(provider.id, keys[provider.id]);
          }
          return;
        }
      }
      
      // Fallback a la primera opción disponible sin establecer un modelo predeterminado
      if (AI_PROVIDERS.length > 0) {
        setSelectedProvider(AI_PROVIDERS[0].id);
      }
    };
    
    // Solo intentamos inicializar después de que el componente está montado (cliente)
    if (typeof window !== 'undefined') {
      initializeApiKeys();
    }
  }, []);
  const handleSave = async () => {
    if (!selectedProvider || !selectedModel) {
      setSaveMessage('Por favor selecciona un proveedor y modelo válidos');
      return;
    }

    const provider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (!provider) {
      setSaveMessage('Proveedor no válido');
      return;
    }

    // Guardar la API key en localStorage si existe
    if (apiKeys[selectedProvider]) {
      try {
        // Guardamos en localStorage
        localStorage.setItem(provider.envKey, apiKeys[selectedProvider]);
        console.log(`API Key para ${provider.name} guardada en localStorage`);
        
        // También asignamos a la variable global para uso inmediato
        if (typeof window !== 'undefined') {
          (window as any)[provider.envKey] = apiKeys[selectedProvider];
        }
      } catch (error) {
        console.error('Error guardando API key en localStorage:', error);
      }
    } else {
      setSaveMessage('Por favor ingresa una API key válida para el proveedor seleccionado');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          apiKey: apiKeys[selectedProvider] // Enviar la clave API al backend
        }),
      });

      if (response.ok) {
        setSaveMessage('Configuración guardada correctamente');
        
        // Actualizamos el proveedor actual en la interfaz
        if (provider) {
          setCurrentProvider(provider);
        }
        
        // Recargamos la página después de unos segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        try {
          const errorData = await response.json();
          setSaveMessage(`Error al guardar la configuración: ${errorData.error || 'Error desconocido'}`);
        } catch {
          setSaveMessage('Error al guardar la configuración. Por favor intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSaveMessage('Error al conectar con el servidor');
    } finally {
      setIsSaving(false);
    }
  };
  const handleApiKeyChange = (providerId: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [providerId]: value
    }));
    
    // Si la API key tiene al menos 20 caracteres, intentar detectar modelos disponibles
    // Se usa un temporizador para no hacer demasiadas solicitudes mientras el usuario escribe
    if (value && value.length >= 20) {
      // Usamos un valor de timeout para evitar hacer peticiones con cada tecla
      const timeoutId = setTimeout(() => {
        detectAvailableModels(providerId, value);
      }, 1000); // Espera 1 segundo después de que el usuario deje de escribir
      
      // Limpiar el timeout anterior
      return () => clearTimeout(timeoutId);
    }
  };
  // Función para manejar el cambio de proveedor
  const handleProviderChange = (providerId: string) => {
    // Si es el mismo proveedor, no hacemos nada
    if (providerId === selectedProvider) return;
    
    // Establecer el nuevo proveedor
    setSelectedProvider(providerId);
    
    // Limpiar el mensaje de guardado al cambiar de proveedor
    setSaveMessage('');
    
    // Reiniciar el estado de mostrar/ocultar API key
    setShowApiKey(false);
    
    // Obtener el proveedor seleccionado
    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      // Verificar si tenemos modelos detectados para este proveedor
      const hasDetectedModels = detectedModels[providerId] && detectedModels[providerId].length > 0;
        // Intentar usar modelos detectados si están disponibles
      if (hasDetectedModels) {
        // Si el modelo actual está configurado y es válido, mantenerlo
        const currentEnvModel = process.env.NEXT_PUBLIC_AI_MODEL;
        const isCurrentModelAvailable = detectedModels[providerId].includes(currentEnvModel || '');
        
        if (provider.id === process.env.NEXT_PUBLIC_AI_PROVIDER && isCurrentModelAvailable) {
          setSelectedModel(currentEnvModel || detectedModels[providerId][0]);
        } else {
          setSelectedModel(detectedModels[providerId][0]); // Usa el primer modelo detectado
        }
      } else {
        // Si no hay modelos detectados, limpiar la selección actual
        setSelectedModel('');
        
        // Si tenemos una API key, intentar detectar modelos
        if (apiKeys[providerId] && apiKeys[providerId].trim() !== '') {
          detectAvailableModels(providerId, apiKeys[providerId]);
        }
      }
    }
  };
  const selectedProviderData = AI_PROVIDERS.find(p => p.id === selectedProvider);
  
  // Efecto para reiniciar el estado de visualización de API key cuando cambia el proveedor
  useEffect(() => {
    // Reiniciar el estado de mostrar/ocultar API key cuando cambia el proveedor
    setShowApiKey(false);
    
      // Selecciona automáticamente el primer modelo del proveedor seleccionado (si hay modelos detectados)
    if (selectedProviderData) {
      // Verificamos si tenemos modelos detectados para este proveedor
      if (detectedModels[selectedProvider] && detectedModels[selectedProvider].length > 0) {
        const modelIsInDetected = detectedModels[selectedProvider].includes(selectedModel);
        if (!modelIsInDetected) {
          setSelectedModel(detectedModels[selectedProvider][0]);
        }
      } else {
        // Si no hay modelos detectados, limpiamos la selección actual
        setSelectedModel('');
      }
    }
  }, [selectedProvider, selectedProviderData, detectedModels, selectedModel]);

  // Generar una versión enmascarada de la API key (con puntos/bullets)
  const getMaskedApiKey = (key: string): string => {
    if (!key) return '';
    if (key.length <= 8) return '••••••••';
    
    // Para APIs de Google (como Gemini), tienen un formato especial
    if (key.startsWith('AIza')) {
      return 'AIza' + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
    }
    
    // Para el resto de APIs
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings className="h-5 w-5" />
            Configuración de Inteligencia Artificial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          
          {currentProvider && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200">Configuración Activa</span>
              </div>
              <p className="text-green-700 dark:text-green-300">
                Usando <strong>{currentProvider.name}</strong> con modelo <strong>{process.env.NEXT_PUBLIC_AI_MODEL}</strong>
              </p>
            </div>
          )}

          <div className="space-y-4 bg-card p-5 rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-foreground border-b border-border pb-2">Configurar IA</h3>
              <div className="grid gap-6 md:grid-cols-1">              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Proveedor de IA
                </label>                <Select 
                  value={selectedProvider} 
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger className="border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProviderData && (
                <>                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Clave API para {selectedProviderData.name}
                    </label>
                    <div className="relative mb-1">                      <input
                        type={showApiKey ? "text" : "password"}
                        className="w-full p-2 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-primary pr-10"
                        placeholder={`Introduce tu clave API para ${selectedProviderData.name}`}
                        value={apiKeys[selectedProvider] || ''}
                        onChange={(e) => handleApiKeyChange(selectedProvider, e.target.value)}
                        key={`api-input-${selectedProvider}`} // Esto forzará la recreación del componente al cambiar el proveedor
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowApiKey(!showApiKey)}
                        aria-label={showApiKey ? "Ocultar clave API" : "Mostrar clave API"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>                    {/* Mostrar la API Key enmascarada con mejor diseño */}
                    {apiKeys[selectedProvider] && (
                      <div 
                        className="bg-primary/10 border border-primary/20 rounded-md py-2 px-3 mb-2"
                        key={`api-display-${selectedProvider}`} // Esto forzará la recreación del componente al cambiar el proveedor
                      >
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-primary flex items-center">
                            <span className="mr-2">API Key detectada:</span> 
                            <code className="font-mono bg-background border border-border px-2 py-0.5 rounded text-foreground">
                              {showApiKey ? apiKeys[selectedProvider] : getMaskedApiKey(apiKeys[selectedProvider])}
                            </code>
                          </p>
                        </div>
                      </div>
                    )}
                      <p className="text-xs text-muted-foreground mt-1">
                      {apiKeys[selectedProvider] ? 
                        'La clave se guardará localmente en tu navegador. Usa el botón de ojo para mostrar/ocultar la API key.' : 
                        'Introduce una clave API para continuar'
                      }
                    </p>
                  </div>
                    <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-foreground">
                        Modelo
                      </label>
                      {isDetectingModels && (
                        <span className="text-xs text-primary flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Detectando modelos disponibles...
                        </span>
                      )}
                    </div>                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="border-input bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="Selecciona un modelo" />
                      </SelectTrigger>                      <SelectContent>
                        {/* Mostrar solo modelos detectados por la API */}
                        {detectedModels[selectedProvider] && detectedModels[selectedProvider].length > 0 && (
                          detectedModels[selectedProvider].map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                              {model === process.env.NEXT_PUBLIC_AI_MODEL && selectedProvider === process.env.NEXT_PUBLIC_AI_PROVIDER && 
                                " (actual)"}
                            </SelectItem>
                          ))
                        )}{isDetectingModels && (
                          <SelectItem key="loading-models" value="loading-models" disabled className="text-muted-foreground flex items-center">
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Detectando modelos disponibles...
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                      {detectedModels[selectedProvider] && detectedModels[selectedProvider].length > 0 
                        ? `Se han detectado ${detectedModels[selectedProvider].length} modelos disponibles para tu API key.` 
                        : 'Para usar este proveedor, ingresa una API key válida para detectar automáticamente los modelos disponibles.'}
                    </p>
                  </div>
                </>
              )}            </div>            <Button 
              onClick={handleSave}
              disabled={isSaving || !selectedProvider || !selectedModel || !(detectedModels[selectedProvider] && detectedModels[selectedProvider].length > 0)}
              className="w-full mt-4"
            >
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>

            {saveMessage && (
              <p className={`text-sm p-2 rounded mt-2 ${saveMessage.includes('Error') ? 'text-destructive bg-destructive/10 border border-destructive/20' : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'}`}>
                {saveMessage}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}