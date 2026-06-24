// ========== FIREBASE CONFIG ==========
const firebaseConfig = {
    apiKey: "AIzaSyBJ2Rzx4w_7UwDl_0iV7uGoe22WIjBCiPg",
    authDomain: "prep0l-reset.firebaseapp.com",
    projectId: "prep0l-reset",
    storageBucket: "prep0l-reset.firebasestorage.app",
    messagingSenderId: "828820833195",
    appId: "1:828820833195:web:87eae0c3a0f778eb2908ee"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== GAME DATA ==========
const gameData = {
    levels: [
        { id: 0, name: 'El Municipio', mundo: 1, preguntas: 5, soles: 40 },
        { id: 1, name: 'La Junta Vecinal', mundo: 1, preguntas: 5, soles: 40 },
        { id: 2, name: 'Presupuesto', mundo: 1, preguntas: 5, soles: 40 },
        { id: 3, name: 'Fiscalización', mundo: 1, preguntas: 5, soles: 40 },
        { id: 4, name: 'Obras Públicas', mundo: 2, preguntas: 5, soles: 40 },
        { id: 5, name: 'Denuncia Fácil', mundo: 2, preguntas: 5, soles: 40 },
        { id: 6, name: 'El Regidor', mundo: 2, preguntas: 5, soles: 40 },
        { id: 7, name: 'Participación', mundo: 2, preguntas: 5, soles: 40 },
        { id: 8, name: 'El GORE', mundo: 3, preguntas: 5, soles: 40 },
        { id: 9, name: 'Canon Minero', mundo: 3, preguntas: 5, soles: 40 },
        { id: 10, name: 'Leyes Regionales', mundo: 3, preguntas: 5, soles: 40 },
        { id: 11, name: 'Presupuesto Regional', mundo: 3, preguntas: 5, soles: 40 },
        { id: 12, name: 'El Congreso', mundo: 4, preguntas: 5, soles: 40 },
        { id: 13, name: 'Las Leyes', mundo: 4, preguntas: 5, soles: 40 },
        { id: 14, name: 'Voto Informado', mundo: 4, preguntas: 5, soles: 40 },
        { id: 15, name: 'Ciudadanía', mundo: 4, preguntas: 5, soles: 40 }
    ],
    quizzes: [
        { levelId: 0, q: '¿Cuál es la función principal del alcalde?', o: ['Hacer leyes nacionales', 'Administrar servicios locales', 'Juzgar delitos', 'Controlar policía'], c: 1 },
        { levelId: 0, q: '¿Cuánto dura el mandato de un alcalde?', o: ['2 años', '3 años', '4 años', '5 años'], c: 2 },
        { levelId: 0, q: '¿Quiénes son los regidores?', o: ['Jueces', 'Consejeros elegidos', 'Policías', 'Maestros'], c: 1 },
        { levelId: 0, q: '¿Qué es el presupuesto municipal?', o: ['Dinero personal', 'Dinero para servicios públicos', 'Dinero de banco', 'Dinero privado'], c: 1 },
        { levelId: 0, q: '¿Puedes revocar a un alcalde?', o: ['No', 'Sí, con firma de ciudadanos', 'Solo el congreso', 'Nunca'], c: 1 },
        { levelId: 1, q: '¿Qué es una junta vecinal?', o: ['Una tienda', 'Organización de vecinos', 'Una escuela', 'Un banco'], c: 1 },
        { levelId: 1, q: '¿Quién preside la junta vecinal?', o: ['El alcalde', 'El presidente elegido', 'El regidor', 'El juez'], c: 1 },
        { levelId: 1, q: '¿Cuál es el objetivo principal?', o: ['Vender productos', 'Mejorar el barrio', 'Hacer dinero', 'Hacer leyes'], c: 1 },
        { levelId: 1, q: '¿Cómo participar en la junta?', o: ['Siendo mayor de edad', 'Siendo vecino del área', 'Siendo funcionario', 'Solo invitados'], c: 1 },
        { levelId: 1, q: '¿Qué actividades realiza?', o: ['Compras', 'Gestión comunitaria', 'Turismo', 'Agricultura'], c: 1 },
    ]
};

// ========== STATE ==========
let currentUser = null;
let currentLevel = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let lives = 3;
let levelCooldowns = {};
let cooldownUpdater = null;
let firebaseSyncTimer = null;

// ========== INIT ==========
window.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
    const userId = localStorage.getItem('prepol_userId');
    const username = localStorage.getItem('prepol_username');
    
    if (userId && username) {
        currentUser = { uid: userId, username: username };
        await loadUserDataFromFirebase();
        showPage('dashboardPage');
        startFirebaseSync();
    } else {
        showPage('loginPage');
    }
}

// ========== AUTH ==========
function toggleForm(event) {
    if (event) event.preventDefault();
    document.getElementById('loginForm').style.display = 
        document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = 
        document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
}

async function registerUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        showError('Completa todos los campos');
        return;
    }
    if (password.length < 4) {
        showError('Mínimo 4 caracteres');
        return;
    }
    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    try {
        const existing = await db.collection('users').where('username', '==', username).get();
        if (!existing.empty) {
            showError('Usuario ya existe');
            return;
        }

        const docRef = await db.collection('users').add({
            username: username,
            password: password, // Guardar texto plano como pidió el usuario
            soles: 100,
            rank: 'Ciudadano',
            completedLevels: [],
            levelCooldowns: {},
            lives: 3
        });

        currentUser = { uid: docRef.id, username: username };
        localStorage.setItem('prepol_userId', docRef.id);
        localStorage.setItem('prepol_username', username);

        await loadUserDataFromFirebase();
        showSuccess('¡Cuenta creada!');
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        setTimeout(() => {
            showPage('dashboardPage');
            startFirebaseSync();
        }, 1500);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Completa los campos');
        return;
    }

    try {
        const snapshot = await db.collection('users').where('username', '==', username).get();
        if (snapshot.empty) {
            showError('Usuario o contraseña incorrectos');
            return;
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Soporte para contraseñas antiguas (Base64) y nuevas (texto plano)
        let savedPassword = userData.password;
        let isCorrect = false;

        if (savedPassword === password) {
            isCorrect = true;
        } else {
            try {
                if (atob(savedPassword) === password) {
                    isCorrect = true;
                }
            } catch (e) {
                // No era Base64
            }
        }

        if (!isCorrect) {
            showError('Usuario o contraseña incorrectos');
            return;
        }

        currentUser = { uid: userDoc.id, username: username };
        localStorage.setItem('prepol_userId', userDoc.id);
        localStorage.setItem('prepol_username', username);

        await loadUserDataFromFirebase();
        showSuccess('¡Bienvenido!');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        setTimeout(() => {
            showPage('dashboardPage');
            startFirebaseSync();
        }, 1000);
    } catch (error) {
        showError('Error: ' + error.message);
    }
}

async function logout() {
    currentUser = null;
    if (cooldownUpdater) clearInterval(cooldownUpdater);
    if (typeof firebaseSyncTimer === 'function') firebaseSyncTimer(); // Detener onSnapshot
    else if (firebaseSyncTimer) clearInterval(firebaseSyncTimer);

    localStorage.removeItem('prepol_userId');
    localStorage.removeItem('prepol_username');

    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';

    showPage('loginPage');
}

// ========== FIREBASE ==========
async function loadUserDataFromFirebase() {
    if (!currentUser) return;

    try {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            const data = doc.data();
            currentUser.soles = data.soles || 100;
            currentUser.rank = data.rank || 'Ciudadano';
            currentUser.completedLevels = data.completedLevels || [];
            currentUser.lives = data.lives || 3;
            levelCooldowns = data.levelCooldowns || {};

            updateUI();
            updateLevelStates();
            updateCooldownDisplays();
            startCooldownUpdater();
        }
    } catch (error) {
        console.error('Error cargando:', error);
    }
}

async function saveToFirebase() {
    if (!currentUser) return;

    try {
        await db.collection('users').doc(currentUser.uid).update({
            soles: currentUser.soles,
            rank: currentUser.rank,
            completedLevels: currentUser.completedLevels,
            levelCooldowns: levelCooldowns,
            lives: currentUser.lives
        });
    } catch (error) {
        console.error('Error guardando:', error);
    }
}

function startFirebaseSync() {
    if (firebaseSyncTimer) clearInterval(firebaseSyncTimer);

    // Usar onSnapshot para sincronización en tiempo real sin polling manual
    firebaseSyncTimer = db.collection('users').doc(currentUser.uid).onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            
            // Sincronizar vidas y cooldowns
            currentUser.lives = (data.lives !== undefined) ? data.lives : 3;
            levelCooldowns = data.levelCooldowns || {};
            
            // Actualizar UI inmediatamente
            updateUI();
            updateLevelStates();
            updateCooldownDisplays();
            
            // Si el usuario está en el quiz y se queda sin vidas externamente, sacarlo
            const quizPage = document.getElementById('quizPage');
            if (quizPage && quizPage.style.display === 'block' && currentUser.lives <= 0) {
                finishLevel(false);
            }
        }
    }, (error) => {
        console.error('Error en onSnapshot:', error);
    });
}

// ========== UI ==========
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';

    if (pageId === 'leaderboardPage') {
        loadLeaderboard();
    }
    if (pageId === 'dashboardPage') {
        updateCooldownDisplays();
        startCooldownUpdater();
    }
}

function updateUI() {
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('heartsTopbar').textContent = currentUser.lives || 3;
    document.getElementById('solesDisplay').textContent = currentUser.soles;
    document.getElementById('rankDisplay').textContent = currentUser.rank;
    document.getElementById('perfilUsername').textContent = currentUser.username;
    document.getElementById('perfilSoles').textContent = currentUser.soles;
    document.getElementById('perfilRank').textContent = currentUser.rank;
    document.getElementById('perfilLevels').textContent = currentUser.completedLevels.length;
}

function updateLevelStates() {
    for (let i = 0; i < gameData.levels.length; i++) {
        const card = document.getElementById(`nivel-${i}`);
        if (!card) continue;

        // Reiniciar clases primero
        card.classList.remove('locked', 'completed');

        // Lógica de bloqueo
        if (currentUser.lives <= 0) {
            card.classList.add('locked');
        } else if (levelCooldowns[i] && levelCooldowns[i] > Date.now()) {
            card.classList.add('locked');
        } else if (i === 0) {
            // Nivel 1 siempre disponible si hay vidas
        } else if (currentUser.completedLevels.includes(i - 1)) {
            // Nivel disponible si el anterior está completado
        } else {
            card.classList.add('locked');
        }

        // Marca de completado
        if (currentUser.completedLevels.includes(i)) {
            card.classList.add('completed');
        }
    }
}

function updateCooldownDisplays() {
    let hasActiveCooldown = false;
    let closestTime = null;

    for (let i = 0; i < gameData.levels.length; i++) {
        const card = document.getElementById(`nivel-${i}`);
        const cooldownDiv = document.getElementById(`cooldown-${i}`);
        if (!card || !cooldownDiv) continue;

        const cooldownTime = levelCooldowns[i];
        if (cooldownTime && cooldownTime > Date.now()) {
            card.classList.add('locked');
            cooldownDiv.style.display = 'flex';
            const remaining = cooldownTime - Date.now();
            updateCooldownText(i, remaining);

            hasActiveCooldown = true;
            if (!closestTime || remaining < closestTime) closestTime = remaining;
        } else {
            cooldownDiv.style.display = 'none';
            // Solo remover locked si el usuario tiene vidas
            if (currentUser && currentUser.lives > 0) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
        }
    }

    const timerTopbar = document.getElementById('timerTopbar');
    const heartsTopbar = document.getElementById('heartsTopbar');

    // Lógica del temporizador global basada en vidas o cooldowns
    if (currentUser && currentUser.lives <= 0) {
        // Si no hay vidas, mostrar temporizador basado en el cooldown más cercano
        timerTopbar.style.display = 'flex';
        heartsTopbar.textContent = '0';
        if (closestTime) {
            updateTimerDisplay(closestTime);
        } else {
            const display = document.getElementById('timerDisplay');
            if (display) display.textContent = "--:--";
        }
    } else {
        // Si hay vidas, ocultar temporizador global a menos que haya un nivel específico bloqueado
        // Pero el requerimiento dice que si tiene 0 vidas no aparece el contador o no se conecta
        // Vamos a asegurar que si lives > 0, el contador desaparezca y se vean las vidas
        timerTopbar.style.display = 'none';
        heartsTopbar.textContent = currentUser.lives;
    }
}

function updateCooldownText(levelId, remainingTime) {
    const div = document.getElementById(`cooldown-${levelId}`);
    if (!div) return;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    div.innerHTML = `<div style="background: rgba(0,0,0,0.9); padding: 25px; border-radius: 15px; text-align: center; color: white; font-weight: bold; font-size: 1rem; backdrop-filter: blur(10px); border: 2px solid rgba(240,147,251,0.5);">⏱️ Reintentar en<br><span style="font-size: 1.5rem; margin-top: 8px; display: block;">${minutes}:${seconds.toString().padStart(2, '0')}</span></div>`;
}

function updateTimerDisplay(remainingTime) {
    const display = document.getElementById('timerDisplay');
    if (!display) return;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startCooldownUpdater() {
    if (cooldownUpdater) clearInterval(cooldownUpdater);
    cooldownUpdater = setInterval(updateCooldownDisplays, 1000);
}

async function loadLeaderboard() {
    try {
        const snapshot = await db.collection('users')
            .orderBy('soles', 'desc')
            .limit(10)
            .get();

        const body = document.getElementById('leaderboardBody');
        body.innerHTML = '';

        let position = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            body.innerHTML += `<tr><td>${position}</td><td>${data.username}</td><td>${data.soles}</td><td>${data.rank}</td></tr>`;
            position++;
        });
    } catch (error) {
        console.error('Error leaderboard:', error);
    }
}

function showError(message) {
    const div = document.getElementById('errorMessage');
    div.textContent = message;
    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 5000);
}

function showSuccess(message) {
    const div = document.getElementById('successMessage');
    if (div) {
        div.textContent = message;
        div.style.display = 'block';
        setTimeout(() => div.style.display = 'none', 5000);
    }
}

// ========== GAME ==========
function startLevel(levelId) {
    if (currentUser.lives <= 0) {
        showError('❌ No tienes vidas. Espera a que el temporizador termine.');
        return;
    }

    if (levelCooldowns[levelId] && levelCooldowns[levelId] > Date.now()) {
        const minutos = Math.ceil((levelCooldowns[levelId] - Date.now()) / 60000);
        showError('⏱️ Intenta en ' + minutos + ' minutos');
        return;
    }

    if (levelId > 0 && !currentUser.completedLevels.includes(levelId - 1)) {
        showError('🔒 Completa el nivel anterior');
        return;
    }

    currentLevel = gameData.levels[levelId];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    lives = currentUser.lives; // Usar las vidas actuales del usuario

    document.getElementById('levelTitle').textContent = `Nivel ${levelId + 1}: ${currentLevel.name}`;
    document.getElementById('heartsDisplay').textContent = '❤️❤️❤️';
    document.getElementById('correctDisplay').textContent = '0';

    showQuestion();
    showPage('quizPage');
}

function showQuestion() {
    const quizzes = gameData.quizzes.filter(q => q.levelId === currentLevel.id);
    if (currentQuestionIndex >= quizzes.length) {
        finishLevel();
        return;
    }

    const quiz = quizzes[currentQuestionIndex];
    document.getElementById('questionText').textContent = quiz.q;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    quiz.o.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => answerQuestion(index, quiz.c);
        container.appendChild(btn);
    });
}

function answerQuestion(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);

    const correctButton = buttons[correctIndex];
    const selectedButton = buttons[selectedIndex];

    if (selectedIndex === correctIndex) {
        selectedButton.classList.add('correct');
        correctAnswers++;
        document.getElementById('correctDisplay').textContent = correctAnswers;

        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 800);
    } else {
        selectedButton.classList.add('incorrect');
        correctButton.classList.add('correct');
        lives--;
        const hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
        document.getElementById('heartsDisplay').textContent = hearts;

        setTimeout(() => {
            if (lives <= 0) {
                finishLevel(false);
            } else {
                currentQuestionIndex++;
                showQuestion();
            }
        }, 800);
    }
}

async function finishLevel(success = correctAnswers >= 4) {
    if (success) {
        currentUser.soles += currentLevel.soles;
        if (!currentUser.completedLevels.includes(currentLevel.id)) {
            currentUser.completedLevels.push(currentLevel.id);
        }
        delete levelCooldowns[currentLevel.id];
        // No resetear vidas a 3 automáticamente si ya tenía más, pero el juego parece basarse en 3
        currentUser.lives = 3;

        await saveToFirebase();
        // No necesitamos llamar a loadUserDataFromFirebase() porque onSnapshot lo hará

        document.getElementById('rewardLevelText').textContent = `Completaste: ${currentLevel.name}`;
        document.getElementById('rewardSoles').textContent = `+${currentLevel.soles}`;
        document.getElementById('rewardRank').textContent = currentUser.rank;
        document.getElementById('rewardTotal').textContent = currentUser.soles;

        showPage('rewardPage');
    } else {
        // Solo establecer cooldown si no existe uno activo o si es el nivel actual
        levelCooldowns[currentLevel.id] = Date.now() + (15 * 60 * 1000);
        currentUser.lives = 0;

        await saveToFirebase();
        
        // No detenemos los timers aquí para que el onSnapshot siga funcionando
        showPage('dashboardPage');
        showError('❌ Perdiste. Intenta en 15 minutos.');
    }
}

function backToDashboard() {
    if (cooldownUpdater) clearInterval(cooldownUpdater);
    if (firebaseSyncTimer) clearInterval(firebaseSyncTimer);
    loadUserDataFromFirebase();
    showPage('dashboardPage');
    startFirebaseSync();
}