# 🐕 PREPOL RESET - Juego Cívico Educativo

**PREPOL RESET** es un juego web educativo interactivo inspirado en Duolingo que enseña cívica peruana de una forma divertida y adictiva.

## 🎮 Características Principales

### 1. **Mapa Interactivo de 4 Distritos**
- 🏘️ **Mi Barrio**: Municipios, juntas vecinales y presupuestos locales
- 🏢 **Mi Distrito**: Obras públicas, denuncias y fiscalización
- 🏛️ **Mi Región**: GORE, canon minero y leyes regionales
- 🇵🇪 **Mi País**: Congreso, leyes nacionales y voto informado

### 2. **Motor de Quizzes Educativo**
- 12 niveles con 5 preguntas cada uno (60 quizzes total)
- Lecciones de 2 minutos máximo
- Personaje guía: **El Vigilante** 🐕
- Retroalimentación inmediata con explicaciones
- Sistema de 3 vidas por sesión

### 3. **Economía de Soles Cívicos**
- Gana soles completando niveles
- Gasta soles para recuperar vidas
- Apuesta en duelos multijugador
- Ranking global por soles ganados

### 4. **Sistema de Rangos Progresivos**
- 🟡 **Vecino Alerta** (Nivel 1-3)
- 🔵 **Fiscalizador Jr.** (Nivel 4-6)
- 🟣 **Gobernador de Barrio** (Nivel 7-9)
- 👑 **Ciudadano Reset** (Nivel 10-12)

### 5. **Modo Multijugador 1v1**
- Duelos cívicos en tiempo real
- Compite contra amigos
- Apuesta tus Soles Cívicos
- El más rápido y preciso gana

### 6. **Tabla de Clasificación Global**
- Ranking por Soles Cívicos
- Filtros por rango
- Medallas para top 3
- Estadísticas de jugadores

### 7. **Progressive Web App (PWA)**
- Instalable en móvil sin App Store
- Funciona offline
- Acceso rápido desde pantalla de inicio

## 🚀 Instalación Rápida

### Opción 1: Ejecutar localmente (Recomendado)

```bash
# 1. Clonar o descargar el proyecto
git clone https://github.com/GSJhan/Juego-web.git
cd prepol-reset-html

# 2. Iniciar servidor local
python -m http.server 8000

# 3. Abrir en navegador
# http://localhost:8000
```

### Opción 2: Desplegar en GitHub Pages

```bash
# 1. Crear rama gh-pages
git checkout --orphan gh-pages

# 2. Agregar archivos
git add .
git commit -m "Deploy PREPOL RESET"

# 3. Empujar a GitHub
git push origin gh-pages

# 4. Configurar GitHub Pages
# Settings → Pages → Source: gh-pages

# 5. Tu sitio estará en:
# https://gsjhan.github.io/Juego-web/
```

## 📁 Estructura del Proyecto

```
prepol-reset-html/
├── index.html          # Página principal
├── app.js              # Lógica del juego
├── styles.css          # Estilos y animaciones
├── manifest.json       # Configuración PWA
├── sw.js               # Service Worker
├── package.json        # Metadatos del proyecto
├── .gitignore          # Archivos a ignorar
└── README.md           # Este archivo
```

## 🎯 Cómo Jugar

### Flujo Principal

1. **Inicio**: Accede a la pantalla de inicio
2. **Selecciona Distrito**: Elige uno de los 4 distritos
3. **Elige Nivel**: Selecciona un nivel (1-3 por distrito)
4. **Responde Preguntas**: Contesta 5 preguntas sobre cívica
5. **Gana Soles**: Obtén recompensas por respuestas correctas
6. **Sube de Rango**: Completa todos los niveles y aprueba el examen
7. **Duelos**: Compite contra otros jugadores
8. **Leaderboard**: Consulta el ranking global

### Sistema de Vidas

- Empiezas con **3 vidas**
- Pierdes una vida si fallas una pregunta
- Recupera vidas esperando 15-30 minutos
- O gasta **50 Soles Cívicos** para recuperar inmediatamente

### Soles Cívicos

- **+100 soles** por completar un nivel
- **+20 soles** por cada respuesta correcta
- **-50 soles** para recuperar una vida
- **Apuestas** en duelos multijugador

## 🛠️ Desarrollo

### Agregar Nuevas Preguntas

Edita `app.js` y busca la función `generateQuizzes()`:

```javascript
{
    id: 1,
    question: '¿Tu pregunta aquí?',
    options: [
        'Opción correcta',
        'Opción incorrecta 1',
        'Opción incorrecta 2',
        'Opción incorrecta 3'
    ],
    correct: 0, // Índice de la opción correcta
    explanation: 'Explicación de la respuesta'
}
```

### Personalizar Colores

En `styles.css`, edita las variables CSS:

```css
:root {
    --primary-yellow: #fbbf24;
    --primary-orange: #f97316;
    --primary-purple: #a855f7;
    /* ... más colores */
}
```

### Agregar Nuevos Distritos

En `app.js`, edita el array `this.districts`:

```javascript
{
    id: 5,
    name: 'Nuevo Distrito',
    emoji: '🎯',
    color: '#color-aqui',
    description: 'Descripción del distrito',
    levels: 3,
    unlocked: false
}
```

## 📱 Instalar como App

### En Android
1. Abre PREPOL RESET en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar app"
4. Confirma

### En iOS
1. Abre PREPOL RESET en Safari
2. Toca el botón Compartir
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma

## 🔐 Almacenamiento Local

El juego guarda tu progreso automáticamente en `localStorage`:

```javascript
// Datos guardados
{
    currentDistrict: 1,
    currentLevel: 1,
    lives: 3,
    soles: 100,
    rank: 'Vecino Alerta',
    completedLevels: ['1-1', '1-2'],
    score: 0
}
```

## 🐛 Reporte de Bugs

Si encuentras un bug:

1. Describe el problema detalladamente
2. Incluye pasos para reproducirlo
3. Adjunta capturas de pantalla
4. Abre un issue en GitHub

## 📊 Estadísticas del Juego

- **60 preguntas** sobre cívica peruana
- **12 niveles** progresivos
- **4 distritos** con temas diferentes
- **4 rangos** para alcanzar
- **Duelos 1v1** multijugador
- **Leaderboard** global

## 🎨 Diseño Visual

- **Tema**: Dark mode con gradientes azul-púrpura
- **Colores**: Amarillo (#fbbf24), Naranja (#f97316), Púrpura (#a855f7)
- **Tipografía**: Poppins (Google Fonts)
- **Animaciones**: Suaves y responsivas
- **Responsive**: Optimizado para móvil, tablet y desktop

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver LICENSE para más detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Autor**: Skip
- **GitHub**: [@GSJhan](https://github.com/GSJhan)
- **Proyecto**: [Juego-web](https://github.com/GSJhan/Juego-web)

## 🙏 Agradecimientos

- Diseño inspirado en Duolingo
- Datos cívicos de fuentes oficiales peruanas
- Comunidad de desarrollo web
- Todos los contribuidores

---

**¡Aprende cívica mientras juegas! Sé un Ciudadano Reset. 🐕👑**
