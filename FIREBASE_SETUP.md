# 🔧 Guía de Configuración de Firebase para PREPOL RESET

## Cambio Principal: Sistema de Usuario y Contraseña Puro

A diferencia de la versión anterior, **ahora el login es solo con Usuario y Contraseña**, sin necesidad de correo electrónico. Los datos se guardan directamente en Firestore bajo el nombre de usuario como ID del documento.

## Paso 1: Obtener tus Credenciales de Firebase

### 1.1 Accede a Firebase Console
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Crear proyecto"** o selecciona uno existente

### 1.2 Obtén tu Configuración Web
1. En la consola de Firebase, ve a **Configuración del proyecto** (ícono de engranaje)
2. Selecciona la pestaña **"General"**
3. Desplázate hacia abajo hasta la sección **"Tus aplicaciones"**
4. Si no tienes una app web, haz clic en el ícono `</>` para crear una
5. Copia la configuración que se muestra (verás un objeto con `apiKey`, `authDomain`, etc.)

## Paso 2: Crear Base de Datos Firestore

1. En la consola de Firebase, ve a **Firestore Database**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** (para desarrollo)
4. Elige la ubicación más cercana a tu región
5. Haz clic en **"Crear"**

### Reglas de Seguridad de Firestore (Importante)
Después de crear la base de datos, ve a la pestaña **"Reglas"** y reemplaza el contenido con:

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

Luego haz clic en **"Publicar"**.

> **Nota**: Estas son reglas de prueba. Para producción, implementa validaciones más estrictas.

## Paso 3: Actualizar tu Código

### 3.1 Abre el archivo `js/firebase-config.js`

Reemplaza los valores de placeholder con tus credenciales reales:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyD...",                              // Tu API Key
    authDomain: "prepol-reset.firebaseapp.com",        // Tu Auth Domain
    projectId: "prepol-reset",                         // Tu Project ID
    storageBucket: "prepol-reset.appspot.com",         // Tu Storage Bucket
    messagingSenderId: "123456789",                    // Tu Messaging Sender ID
    appId: "1:123456789:web:abcdef123456"              // Tu App ID
};
```

### 3.2 Verifica que `index.html` cargue los scripts en orden correcto

```html
<!-- FIREBASE SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"></script>

<!-- FIREBASE CONFIG -->
<script src="js/firebase-config.js"></script>

<!-- APP JS -->
<script src="js/app.js"></script>
```

## Paso 4: ¡Listo! Prueba tu Aplicación

1. Abre `index.html` en tu navegador
2. Haz clic en **"Registrarse"**
3. Crea una cuenta (ej: usuario: `juan`, contraseña: `1234`)
4. ¡Deberías ver el dashboard!
5. Prueba a cerrar sesión y vuelve a iniciar sesión

---

## Estructura de Datos en Firestore

Cuando un usuario se registra, se crea un documento en la colección `users` con el **nombre de usuario como ID**:

```
/users/juan
├── username: "juan"
├── password: "1234"
├── soles: 100
├── rank: "Ciudadano"
├── completedLevels: []
└── createdAt: "2024-01-01T12:00:00.000Z"
```

---

## Solución de Problemas

### ❌ "Firebase no está configurado correctamente"
**Solución:** Verifica que `firebase-config.js` esté en la carpeta `js/` y que los valores sean correctos.

### ❌ "Este usuario ya existe"
**Solución:** El usuario ya fue registrado. Intenta con otro nombre de usuario.

### ❌ "Usuario no encontrado"
**Solución:** El usuario no está registrado. Intenta registrarte primero o verifica que escribiste correctamente el nombre de usuario.

### ❌ "Contraseña incorrecta"
**Solución:** Verifica que escribiste correctamente la contraseña. Recuerda que es sensible a mayúsculas/minúsculas.

### ❌ "Permiso denegado" al guardar datos
**Solución:** Las reglas de Firestore no están configuradas. Sigue el paso 2 nuevamente y asegúrate de publicar las reglas.

---

## Próximos Pasos

Una vez que todo funcione:
1. Cambia las reglas de Firestore a **modo de producción** para mayor seguridad
2. Implementa hash de contraseñas (actualmente se guardan en texto plano, solo para desarrollo)
3. Agrega validación de nombres de usuario (sin caracteres especiales, etc.)
4. Agrega más contenido de preguntas en `gameData.quizzes`

---

## ¿Necesitas ayuda?

1. **Abre la consola del navegador** (F12 o Ctrl+Shift+I)
2. Ve a la pestaña **"Console"**
3. Intenta registrarte o iniciar sesión
4. Busca mensajes de error en rojo
5. Cópialos y comparte para obtener ayuda

---

**¡Éxito! 🚀**
