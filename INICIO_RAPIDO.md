# ⚡ Guía de Inicio Rápido - PREPOL RESET

## ✨ Cambio Principal: Login Solo con Usuario y Contraseña

**Ya no necesitas correo electrónico.** El sistema es igual al de `aventuras-numericas`: solo **Usuario** y **Contraseña**.

---

## Lo que necesitas para que funcione el login/registro

### 1️⃣ Obtén tus Credenciales de Firebase (5 minutos)

**Opción A: Si tienes un proyecto Firebase existente**
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Haz clic en el ícono de engranaje ⚙️ → **Configuración del proyecto**
4. Desplázate a **"Tus aplicaciones"** y busca tu app web
5. Copia el objeto de configuración que ves (contiene `apiKey`, `authDomain`, etc.)

**Opción B: Si no tienes proyecto Firebase**
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Crear proyecto"**
3. Nombre: `prepol-reset` (o el que prefieras)
4. Sigue los pasos
5. Una vez creado, ve a **Configuración del proyecto** → **"Tus aplicaciones"**
6. Haz clic en `</>` para crear una app web
7. Copia la configuración

### 2️⃣ Reemplaza los valores en tu código

Abre el archivo **`js/firebase-config.js`** y reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD...",                              // ← Tu API Key
    authDomain: "tu-proyecto.firebaseapp.com",         // ← Tu Auth Domain
    projectId: "tu-proyecto",                          // ← Tu Project ID
    storageBucket: "tu-proyecto.appspot.com",          // ← Tu Storage Bucket
    messagingSenderId: "123456789",                    // ← Tu Messaging Sender ID
    appId: "1:123456789:web:abcdef123456"              // ← Tu App ID
};
```

### 3️⃣ Crea una Base de Datos Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"**
4. Elige tu región
5. Haz clic en **"Crear"**

### 4️⃣ Configura las Reglas de Seguridad

1. En Firestore, ve a la pestaña **"Reglas"**
2. Reemplaza todo el contenido con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

### 5️⃣ ¡Listo! Prueba tu aplicación

1. Abre `index.html` en tu navegador
2. Haz clic en **"Registrarse"**
3. Crea una cuenta (ej: usuario: `juan`, contraseña: `1234`)
4. ¡Deberías ver el dashboard!
5. Prueba a cerrar sesión y vuelve a iniciar sesión

---

## ¿Qué cambios se hicieron en tu código?

✅ **Nuevo archivo: `js/firebase-config.js`**
- Contiene la configuración de Firebase
- Se carga antes de `app.js`

✅ **Actualizado: `js/app.js`**
- **Ya no usa autenticación por email**
- Usa Firestore directamente con el nombre de usuario como ID
- Mejor manejo de errores
- Mensajes más claros

✅ **Actualizado: `index.html`**
- Ahora carga `firebase-config.js` en el orden correcto

---

## Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Login** | Usuario + Correo | Solo Usuario |
| **Contraseña** | Autenticación Firebase Auth | Almacenada en Firestore |
| **Base de datos** | Firestore | Firestore |
| **Experiencia** | Necesitaba correo | Más simple, como aventuras-numericas |

---

## Troubleshooting

### ❌ "Firebase no está configurado correctamente"
**Solución:** Verifica que `firebase-config.js` esté en la carpeta `js/` y que los valores sean correctos.

### ❌ "Este usuario ya existe"
**Solución:** El usuario ya fue registrado. Intenta con otro nombre de usuario.

### ❌ "Usuario no encontrado"
**Solución:** El usuario no está registrado. Intenta registrarte primero.

### ❌ "Contraseña incorrecta"
**Solución:** Verifica que escribiste correctamente la contraseña. Es sensible a mayúsculas/minúsculas.

### ❌ "Permiso denegado" al guardar datos
**Solución:** Las reglas de Firestore no están configuradas. Sigue el paso 4 nuevamente.

---

## Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `js/firebase-config.js` | **NUEVO** - Tu configuración de Firebase |
| `js/app.js` | Lógica de la aplicación (actualizado) |
| `index.html` | HTML principal (actualizado) |
| `FIREBASE_SETUP.md` | Guía detallada de configuración |

---

## ¿Necesitas ayuda?

1. **Abre la consola del navegador** (F12 o Ctrl+Shift+I)
2. Ve a la pestaña **"Console"**
3. Intenta registrarte o iniciar sesión
4. Busca mensajes de error en rojo
5. Cópialos y comparte para obtener ayuda

---

**¡Éxito! 🚀**
