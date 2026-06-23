const firebaseConfig = {
  apiKey: "AIzaSyBJ2Rzx4w_7UwDl_0iV7uGoe22WIjBCiPg",
  authDomain: "prep0l-reset.firebaseapp.com",
  projectId: "prep0l-reset",
  storageBucket: "prep0l-reset.firebasestorage.app",
  messagingSenderId: "828820833195",
  appId: "1:828820833195:web:87eae0c3a0f778eb2908ee"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// Configurar Firestore para desarrollo (desactivar persistencia offline si es necesario)
db.settings({ experimentalForceLongPolling: true });

console.log('✅ Firebase y Firestore inicializados correctamente');
