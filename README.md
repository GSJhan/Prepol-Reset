# PREPOL RESET - Juego Cívico Educativo

**PREPOL RESET** es un juego web educativo interactivo que enseña a los ciudadanos sobre cívica peruana, fiscalización del Estado y participación ciudadana. Está diseñado como una experiencia tipo Duolingo pero enfocada en educación cívica.

## 🎮 Características Principales

### 1. **Mapa Interactivo de 4 Distritos**
- **Mi Barrio**: Aprende sobre municipios, juntas vecinales y presupuestos locales
- **Mi Distrito**: Descubre obras públicas, denuncias y fiscalización
- **Mi Región**: Entiende el GORE, canon minero y leyes regionales
- **Mi País**: Aprende sobre el Congreso, leyes nacionales y voto informado

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

Cada rango requiere pasar un Examen de Rango (10 preguntas).

### 5. **Modo Multijugador 1v1**
- Duelos cívicos en tiempo real
- Compite contra amigos
- Apuesta tus Soles Cívicos
- El más rápido y preciso gana
- Historial de duelos

### 6. **Certificado Digital**
- Obtén tu certificado "Ciudadano Reset" al alcanzar el rango máximo
- Descargable en PDF
- Código único verificable
- Compartible en redes sociales

### 7. **Tabla de Clasificación Global**
- Ranking por Soles Cívicos
- Filtros por rango
- Medallas para top 3
- Estadísticas de jugadores

### 8. **Progressive Web App (PWA)**
- Instalable en móvil sin App Store
- Funciona offline
- Notificaciones push
- Acceso rápido desde pantalla de inicio

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 18+
- pnpm (gestor de paquetes)
- Base de datos MySQL/TiDB
- Cuenta Manus OAuth

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/GSJhan/Juego-web.git
cd Juego-web
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# DATABASE_URL=mysql://usuario:contraseña@host:puerto/prepol_reset
# VITE_APP_ID=tu_app_id
# JWT_SECRET=tu_jwt_secret
```

4. **Ejecutar migraciones de base de datos**
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

5. **Sembrar datos iniciales**
```bash
# Ejecutar script de seed data
node scripts/seed-data.mjs

# O usar el script ejecutable
./scripts/run-seed.sh
```

6. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Juego-web/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Home.tsx      # Pantalla de inicio
│   │   │   ├── Game.tsx      # Mapa de distritos
│   │   │   ├── LevelPlay.tsx # Motor de quizzes
│   │   │   ├── Duel.tsx      # Duelos 1v1
│   │   │   ├── Leaderboard.tsx # Ranking global
│   │   │   └── Certificate.tsx # Certificado
│   │   ├── components/       # Componentes reutilizables
│   │   └── lib/              # Utilidades
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   └── sw.js             # Service worker
│   └── index.html
├── server/                    # Backend Express + tRPC
│   ├── routers.ts            # Procedimientos tRPC
│   ├── db.ts                 # Helpers de base de datos
│   └── _core/                # Configuración central
├── drizzle/                  # Esquema de base de datos
│   └── schema.ts
├── scripts/
│   ├── seed-data.mjs         # Script para sembrar datos
│   └── run-seed.sh           # Ejecutable de seed
└── README.md
```

## 🎯 Flujo de Juego

### 1. **Inicio**
- El usuario accede a la pantalla de inicio
- Se autentica con Manus OAuth
- Ve su perfil con soles, rango y vidas

### 2. **Seleccionar Distrito**
- Elige uno de los 4 distritos
- Desbloquea nuevos distritos al subir de rango
- Ve los 3 niveles disponibles

### 3. **Jugar un Nivel**
- Lee la introducción de El Vigilante (caso cívico)
- Completa la lección de 2 minutos
- Responde 5 preguntas
- Recibe retroalimentación inmediata
- Gana soles y experiencia

### 4. **Sistema de Vidas**
- Empiezas con 3 vidas
- Pierdes una vida si fallas una pregunta
- Recupera vidas esperando 15-30 minutos
- O gasta soles cívicos para recuperar inmediatamente

### 5. **Subir de Rango**
- Completa todos los niveles de un rango
- Aprueba el Examen de Rango (10 preguntas)
- Desbloquea nuevo rango y distrito

### 6. **Duelos Multijugador**
- Crea una sala de duelo (apuesta soles)
- Comparte código con un amigo
- Ambos responden el mismo caso cívico
- El más rápido y preciso gana los soles

### 7. **Certificado**
- Alcanza el rango de Ciudadano Reset
- Obtén tu certificado digital
- Descárgalo en PDF
- Comparte tu logro

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo

# Construcción
pnpm build            # Compila para producción
pnpm start            # Inicia servidor de producción

# Testing
pnpm test             # Ejecuta pruebas con Vitest
pnpm check            # Verifica tipos TypeScript

# Base de datos
pnpm drizzle-kit generate  # Genera migraciones
pnpm drizzle-kit migrate   # Ejecuta migraciones

# Seed data
node scripts/seed-data.mjs # Siembra datos iniciales
./scripts/run-seed.sh      # Ejecuta seed (script)
```

### Agregar Nuevas Preguntas

1. Edita `scripts/seed-data.mjs`
2. Agrega objetos a `quizzesData`
3. Ejecuta `node scripts/seed-data.mjs`

### Crear Nuevos Niveles

1. Edita `scripts/seed-data.mjs`
2. Agrega a `levelData` con `districtId` y `levelNumber`
3. Agrega 5 preguntas correspondientes
4. Ejecuta seed data

## 📊 Base de Datos

### Tablas Principales

- **users**: Perfil del jugador, soles, rango, vidas
- **districts**: Los 4 distritos del juego
- **levels**: 12 niveles (3 por distrito)
- **quizzes**: 60 preguntas (5 por nivel)
- **userProgress**: Progreso del jugador en niveles
- **rankExams**: Exámenes de rango
- **duels**: Duelos 1v1 y apuestas
- **leaderboard**: Ranking global
- **certificates**: Certificados digitales

## 🔐 Seguridad

- Autenticación con Manus OAuth
- Validación de datos en servidor
- Protección de rutas con `protectedProcedure`
- Encriptación de sesiones
- Validación de transacciones de soles

## 📱 PWA (Progressive Web App)

PREPOL RESET es una PWA completa:

- **Instalable**: Agrégalo a tu pantalla de inicio
- **Offline**: Funciona sin conexión
- **Notificaciones**: Recibe recordatorios para jugar
- **Rápido**: Carga en segundos
- **Seguro**: HTTPS obligatorio

### Instalar en Móvil

1. Abre PREPOL RESET en tu navegador
2. Toca el menú (⋮) o busca "Instalar"
3. Confirma la instalación
4. ¡Listo! Aparecerá un icono en tu pantalla de inicio

## 🎨 Diseño Visual

- **Tema**: Dark mode con gradientes azul-púrpura
- **Colores**: Azul (#3b82f6), Púrpura (#a855f7), Amarillo (#fbbf24)
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: shadcn/ui + Tailwind CSS 4
- **Animaciones**: Framer Motion para transiciones suaves

## 📈 Métricas y Analytics

- Seguimiento de progreso del jugador
- Estadísticas de duelos ganados/perdidos
- Tiempo promedio por nivel
- Análisis de preguntas difíciles
- Retención de usuarios

## 🐛 Reporte de Bugs

Si encuentras un bug:

1. Describe el problema detalladamente
2. Incluye pasos para reproducirlo
3. Adjunta capturas de pantalla
4. Abre un issue en GitHub

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- **Autor**: Skip
- **Email**: [tu-email]
- **GitHub**: [GSJhan](https://github.com/GSJhan)

## 🙏 Agradecimientos

- Diseño inspirado en Duolingo
- Datos cívicos de fuentes oficiales peruanas
- Comunidad de desarrollo web

---

**¡Aprende cívica mientras juegas! Sé un Ciudadano Reset.** 🐕👑
