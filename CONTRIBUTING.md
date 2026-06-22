# Guía de Contribución - PREPOL RESET

¡Gracias por tu interés en contribuir a PREPOL RESET! Esta guía te ayudará a entender cómo contribuir al proyecto.

## 🤝 Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug:

1. **Verifica que no esté reportado**: Busca en [Issues](https://github.com/GSJhan/Juego-web/issues)
2. **Abre un nuevo issue** con:
   - Título descriptivo
   - Descripción detallada del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)
   - Información del sistema (OS, navegador, versión)

### 2. Sugerir Mejoras

Para sugerir una mejora:

1. Abre un issue con etiqueta `enhancement`
2. Describe la mejora detalladamente
3. Explica por qué sería útil
4. Proporciona ejemplos o mockups (si aplica)

### 3. Enviar Pull Requests

#### Preparación

1. **Fork el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/Juego-web.git
   cd Juego-web
   ```

2. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/nombre-del-bug
   ```

3. **Instala dependencias**
   ```bash
   pnpm install
   ```

#### Desarrollo

1. **Haz tus cambios**
   - Sigue el estilo de código existente
   - Escribe código limpio y legible
   - Agrega comentarios donde sea necesario

2. **Prueba tus cambios**
   ```bash
   pnpm test
   pnpm check
   ```

3. **Commit con mensajes claros**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git commit -m "fix: corregir bug en componente X"
   ```

   Usa prefijos:
   - `feat:` para nuevas características
   - `fix:` para correcciones
   - `docs:` para documentación
   - `style:` para cambios de formato
   - `refactor:` para refactorización
   - `test:` para tests
   - `chore:` para tareas de mantenimiento

4. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

5. **Abre un Pull Request**
   - Describe los cambios
   - Referencia issues relacionados (#123)
   - Explica por qué estos cambios son necesarios

## 📝 Estándares de Código

### TypeScript

- Usa tipos explícitos
- Evita `any`
- Comenta tipos complejos

```typescript
// ✅ Bien
interface UserProfile {
  id: number;
  name: string;
  solsCivicos: number;
}

function getUserProfile(userId: number): Promise<UserProfile> {
  // ...
}

// ❌ Evitar
function getUser(id: any): any {
  // ...
}
```

### React

- Usa componentes funcionales
- Hooks en lugar de clases
- Nombres descriptivos

```typescript
// ✅ Bien
export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <Card>
      <h3>{question.text}</h3>
      {/* ... */}
    </Card>
  );
}

// ❌ Evitar
class QuizCard extends React.Component {
  // ...
}
```

### Estilos

- Usa Tailwind CSS
- Prefiere clases sobre inline styles
- Mantén consistencia visual

```tsx
// ✅ Bien
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Contenido
</div>

// ❌ Evitar
<div style={{ backgroundColor: "blue", color: "white", padding: "16px" }}>
  Contenido
</div>
```

### Base de Datos

- Usa Drizzle ORM
- Define tipos explícitos
- Comenta queries complejas

```typescript
// ✅ Bien
export async function getUserWithProgress(userId: number) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  return user[0];
}
```

## 🧪 Testing

### Escribir Tests

```typescript
import { describe, it, expect } from "vitest";

describe("QuizLogic", () => {
  it("should calculate score correctly", () => {
    const score = calculateScore(5, 4); // 5 preguntas, 4 correctas
    expect(score).toBe(80);
  });

  it("should award soles for passing level", () => {
    const soles = calculateReward(true, 1); // passed, level 1
    expect(soles).toBeGreaterThan(0);
  });
});
```

### Ejecutar Tests

```bash
pnpm test              # Ejecutar todos
pnpm test -- quiz      # Tests específicos
pnpm test -- --ui      # UI interactiva
```

## 📚 Documentación

### Comentarios en Código

```typescript
// ✅ Bien
/**
 * Calcula los soles ganados al completar un nivel
 * @param levelId - ID del nivel completado
 * @param isPassed - Si el nivel fue aprobado
 * @returns Cantidad de soles ganados
 */
function calculateLevelReward(levelId: number, isPassed: boolean): number {
  // ...
}

// ❌ Evitar
// calcula soles
function calcSoles(l: number, p: boolean): number {
  // ...
}
```

### Actualizar Documentación

Si tus cambios afectan:
- Instalación → Actualiza `README.md`
- Despliegue → Actualiza `DEPLOYMENT.md`
- API → Documenta en código y comentarios
- Nuevas características → Agrega a lista de características

## 🎨 Cambios de UI/UX

1. **Proporciona mockups o capturas**
2. **Explica la razón del cambio**
3. **Asegura consistencia visual**
4. **Prueba en móvil y desktop**
5. **Verifica accesibilidad**

## 🔄 Proceso de Review

1. **Revisión automática**
   - TypeScript check
   - Linting
   - Tests

2. **Revisión de código**
   - Mantenedor revisa cambios
   - Sugiere mejoras si es necesario
   - Aprueba o solicita cambios

3. **Merge**
   - Una vez aprobado, se mergea a `main`
   - Se crea release si es necesario

## 📋 Checklist para PR

- [ ] Código sigue estándares del proyecto
- [ ] Tests pasan (`pnpm test`)
- [ ] TypeScript compila (`pnpm check`)
- [ ] Sin warnings o errores
- [ ] Documentación actualizada
- [ ] Cambios están en una rama separada
- [ ] Commits tienen mensajes claros
- [ ] PR describe los cambios

## 🚀 Áreas donde Puedes Contribuir

### Fácil (Bueno para comenzar)
- [ ] Mejorar documentación
- [ ] Corregir typos
- [ ] Agregar más preguntas de quizzes
- [ ] Mejorar estilos CSS

### Intermedio
- [ ] Agregar nuevos niveles/distritos
- [ ] Mejorar rendimiento
- [ ] Agregar tests
- [ ] Refactorizar componentes

### Avanzado
- [ ] Implementar nuevas características
- [ ] Optimizar base de datos
- [ ] Mejorar PWA
- [ ] Agregar análisis avanzado

## 💬 Comunicación

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas y ideas
- **Pull Requests**: Para cambios de código
- **Email**: Para asuntos privados

## 📜 Licencia

Al contribuir, aceptas que tus cambios se distribuyan bajo la licencia MIT del proyecto.

## 🙏 Gracias

¡Gracias por contribuir a PREPOL RESET! Tu ayuda hace que este proyecto sea mejor para todos.

---

**¡Feliz contribuyendo!** 🎉
