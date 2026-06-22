# Despliegue en GitHub Pages - PREPOL RESET

Esta guía explica cómo desplegar PREPOL RESET en GitHub Pages para acceder con un link público como `https://gsjhan.github.io/Juego-web/`

## 🚀 Despliegue Rápido

### Opción 1: Despliegue Automático (Recomendado)

1. **Ejecutar el script de despliegue**:
   ```bash
   chmod +x scripts/deploy-gh-pages.sh
   ./scripts/deploy-gh-pages.sh
   ```

2. **Esperar a que se complete**
3. **Acceder a tu sitio**: `https://gsjhan.github.io/Juego-web/`

### Opción 2: Despliegue Manual

1. **Construir el proyecto**:
   ```bash
   pnpm install
   pnpm build
   ```

2. **Crear rama gh-pages** (primera vez):
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   git commit --allow-empty -m "Initial gh-pages commit"
   git checkout main
   ```

3. **Desplegar**:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

4. **Acceder a tu sitio**: `https://gsjhan.github.io/Juego-web/`

## 🔧 Configuración en GitHub

### Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Abre **Settings** → **Pages**
3. En "Source", selecciona **Deploy from a branch**
4. En "Branch", selecciona **gh-pages** y **/root**
5. Haz clic en **Save**

### Paso 2: Esperar a que se despliegue

- GitHub Pages tardará 1-2 minutos en desplegar
- Verás un link como `https://gsjhan.github.io/Juego-web/`

## 🌐 Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado como `prepol-reset.gsjhan.com`:

1. **Compra o configura tu dominio**
2. **En GitHub Pages Settings**:
   - Ve a **Settings** → **Pages**
   - En "Custom domain", ingresa tu dominio
   - Haz clic en **Save**

3. **Configura DNS** en tu proveedor de dominio:
   ```
   CNAME: gsjhan.github.io
   ```

4. **Espera a que se propague** (24-48 horas)

## 📝 Notas Importantes

### Base URL
- El proyecto está configurado con `base: '/Juego-web/'`
- Todos los links internos funcionarán correctamente
- Si usas un dominio personalizado, cambia `base: '/'`

### Actualizaciones
- Cada vez que hagas push a `main`, ejecuta el script de despliegue
- O usa git subtree para actualizar automáticamente

### Troubleshooting

**Error: "refusing to allow a GitHub App"**
- Solución: Usa el script sin workflows (ya está configurado así)

**El sitio no carga**
- Verifica que `base` en `vite.config.ts` es correcto
- Limpia el caché del navegador (Ctrl+Shift+Delete)
- Espera 5 minutos a que GitHub Pages se actualice

**Los estilos no cargan**
- Verifica que `base` incluye la ruta correcta
- Reconstruye: `pnpm build`

## 📊 Monitoreo

### Ver estado del despliegue
1. Ve a tu repositorio
2. Abre **Settings** → **Pages**
3. Verás el estado y la URL

### Ver logs
1. Ve a **Actions** (si está habilitado)
2. Busca el workflow más reciente
3. Haz clic para ver los detalles

## 🔄 Actualizar el Sitio

Después de hacer cambios:

```bash
# 1. Commit y push a main
git add .
git commit -m "Descripción del cambio"
git push origin main

# 2. Reconstruir y desplegar
pnpm build
git subtree push --prefix dist origin gh-pages

# O ejecutar el script
./scripts/deploy-gh-pages.sh
```

## 💡 Tips

- **Desarrollo local**: `pnpm dev` en `http://localhost:3000`
- **Build para producción**: `pnpm build` genera `/dist`
- **Limpiar caché**: Usa `Ctrl+Shift+Delete` en el navegador
- **Verificar build**: Abre `/dist/index.html` en el navegador

## 🎯 Resultado Final

Tu PREPOL RESET estará disponible en:
- **GitHub Pages**: `https://gsjhan.github.io/Juego-web/`
- **Dominio personalizado** (si configuraste): `https://tu-dominio.com`

¡Listo! Tu juego cívico está en línea. 🚀

---

**¿Problemas?** Revisa los logs en GitHub Actions o contacta al equipo.
