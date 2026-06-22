#!/bin/bash

# Script para desplegar PREPOL RESET en GitHub Pages
# Uso: ./scripts/deploy-gh-pages.sh

set -e

echo "🚀 Preparando despliegue en GitHub Pages..."

# Verificar que estamos en la rama main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Error: Debes estar en la rama 'main' para desplegar"
  exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# Compilar TypeScript
echo "✅ Compilando TypeScript..."
pnpm check

# Construir proyecto
echo "🔨 Construyendo proyecto..."
pnpm build

# Crear rama gh-pages si no existe
if ! git rev-parse --verify gh-pages >/dev/null 2>&1; then
  echo "📝 Creando rama gh-pages..."
  git checkout --orphan gh-pages
  git rm -rf .
  git commit --allow-empty -m "Initial gh-pages commit"
  git checkout main
fi

# Desplegar
echo "📤 Desplegando a GitHub Pages..."
git subtree push --prefix dist origin gh-pages

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu sitio estará disponible en: https://gsjhan.github.io/Juego-web/"
echo ""
echo "💡 Tip: Si configuraste un dominio personalizado, aparecerá en esa URL"
