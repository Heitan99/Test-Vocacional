// filepath: c:\Users\alexa\test-voca2.0\.lintstagedrc.js
module.exports = {
  // Lint y formatear archivos TypeScript y JavaScript
  '**/*.{ts,tsx,js}': [
    'eslint --fix',
    'prettier --write',
  ],
  // Formatear otros tipos de archivos
  '**/*.{json,css,md}': [
    'prettier --write',
  ],
}
