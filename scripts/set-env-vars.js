#!/usr/bin/env node
/**
 * Script para configurar variables de entorno para producción
 * 
 * Uso:
 * 1. Ejecuta `node scripts/set-env-vars.js`
 * 2. Sigue las instrucciones
 * 
 * El script generará los comandos para configurar variables de entorno
 * según la plataforma de despliegue elegida (Vercel, Netlify, etc.)
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Configuración de Variables de Entorno para Producción ===\n');
console.log('Este script te ayudará a configurar de forma segura las API keys para tu entorno de producción.\n');

const promptPlatform = () => {
  console.log('¿En qué plataforma desplegarás tu aplicación?');
  console.log('1. Vercel');
  console.log('2. Netlify');
  console.log('3. Heroku');
  console.log('4. AWS');
  console.log('5. Otra (comando genérico)');
  
  rl.question('\nSelecciona una opción (1-5): ', (answer) => {
    const platform = ['vercel', 'netlify', 'heroku', 'aws', 'generic'][parseInt(answer) - 1];
    if (!platform) {
      console.log('Opción no válida. Inténtalo de nuevo.');
      return promptPlatform();
    }
    
    promptProviders(platform);
  });
};

const promptProviders = (platform) => {
  console.log('\n¿Qué proveedores de IA utilizarás? (separados por comas)');
  console.log('1. OpenAI');
  console.log('2. Gemini');
  console.log('3. Claude');
  console.log('4. Mistral');
  
  rl.question('\nSelecciona opciones (ej: 1,3,4): ', (answer) => {
    const selectedOptions = answer.split(',').map(opt => parseInt(opt.trim())).filter(Boolean);
    const providers = [];
    
    if (selectedOptions.includes(1)) providers.push('openai');
    if (selectedOptions.includes(2)) providers.push('gemini');
    if (selectedOptions.includes(3)) providers.push('claude');
    if (selectedOptions.includes(4)) providers.push('mistral');
    
    if (providers.length === 0) {
      console.log('Debes seleccionar al menos un proveedor. Inténtalo de nuevo.');
      return promptProviders(platform);
    }
    
    collectAPIKeys(platform, providers);
  });
};

const collectAPIKeys = async (platform, providers) => {
  const envVars = {};
  
  // Configure default provider
  if (providers.length > 0) {
    envVars['AI_PROVIDER'] = providers[0];
  }
  
  for (const provider of providers) {
    await new Promise(resolve => {
      rl.question(`\nIngresa la API Key para ${provider.toUpperCase()}: `, (answer) => {
        if (answer.trim()) {
          switch (provider) {
            case 'openai':
              envVars['OPENAI_API_KEY'] = answer.trim();
              break;
            case 'gemini':
              envVars['GEMINI_API_KEY'] = answer.trim();
              break;
            case 'claude':
              envVars['CLAUDE_API_KEY'] = answer.trim();
              break;
            case 'mistral':
              envVars['MISTRAL_API_KEY'] = answer.trim();
              break;
          }
        }
        resolve();
      });
    });
  }
  
  // Get default model
  await new Promise(resolve => {
    const defaultProvider = providers[0];
    let defaultModels;
    
    switch (defaultProvider) {
      case 'openai':
        defaultModels = 'gpt-4o, gpt-4, gpt-3.5-turbo';
        break;
      case 'gemini':
        defaultModels = 'gemini-pro, gemini-ultra';
        break;
      case 'claude':
        defaultModels = 'claude-3-opus, claude-3-sonnet, claude-3-haiku';
        break;
      case 'mistral':
        defaultModels = 'mistral-large, mistral-medium, mistral-small';
        break;
    }
    
    rl.question(`\nModelo predeterminado para ${defaultProvider.toUpperCase()} (opciones: ${defaultModels}): `, (answer) => {
      if (answer.trim()) {
        envVars['AI_MODEL'] = answer.trim();
      } else {
        // Set default model based on provider
        switch (defaultProvider) {
          case 'openai': envVars['AI_MODEL'] = 'gpt-4o'; break;
          case 'gemini': envVars['AI_MODEL'] = 'gemini-pro'; break;
          case 'claude': envVars['AI_MODEL'] = 'claude-3-opus'; break;
          case 'mistral': envVars['AI_MODEL'] = 'mistral-large'; break;
        }
      }
      resolve();
    });
  });
  
  generateCommands(platform, envVars);
};

const generateCommands = (platform, envVars) => {
  console.log('\n=== Comandos para configurar variables de entorno ===\n');
  
  switch (platform) {
    case 'vercel':
      console.log('# Comandos para Vercel CLI:');
      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`vercel env add ${key} production`);
      });
      console.log('\n# O configura estas variables en el panel de Vercel > Settings > Environment Variables\n');
      break;
      
    case 'netlify':
      console.log('# Comandos para Netlify CLI:');
      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`netlify env:set ${key} "${value}"`);
      });
      console.log('\n# O configura estas variables en el panel de Netlify > Site settings > Environment variables\n');
      break;
      
    case 'heroku':
      console.log('# Comandos para Heroku CLI:');
      let herokuCmd = 'heroku config:set';
      Object.entries(envVars).forEach(([key, value]) => {
        herokuCmd += ` ${key}="${value}"`;
      });
      console.log(herokuCmd);
      break;
      
    case 'aws':
      console.log('# Para AWS Amplify, configura estas variables en Console > App settings > Environment variables');
      console.log('# Para AWS Elastic Beanstalk, usa estos comandos:');
      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`eb setenv ${key}="${value}"`);
      });
      break;
      
    default:
      console.log('# Variables de entorno a configurar en tu plataforma:');
      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`${key}="${value}"`);
      });
  }
  
  // Generate .env file for reference (without actual keys)
  const envFileContent = Object.entries(envVars).map(([key, value]) => {
    // Replace API keys with placeholders for security
    if (key.includes('API_KEY')) {
      return `${key}=************`;
    }
    return `${key}=${value}`;
  }).join('\n');
  
  const envFilePath = path.join(process.cwd(), '.env.production.example');
  try {
    fs.writeFileSync(envFilePath, envFileContent);
    console.log(`\nSe ha creado un archivo de ejemplo en ${envFilePath}\n`);
  } catch (err) {
    console.error('Error al crear archivo de ejemplo:', err);
  }
  
  console.log('\nIMPORTANTE: Nunca incluyas API keys en archivos de tu repositorio de código.\n');
  console.log('Para más información sobre seguridad de API keys, consulta:');
  console.log('- https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables');
  console.log('- https://vercel.com/docs/security/env');
  
  rl.close();
};

promptPlatform();
