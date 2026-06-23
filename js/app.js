// ========== INICIALIZAR FIREBASE ==========
// La configuración se carga desde firebase-config.js
// Las referencias a auth y db ya están disponibles globalmente

console.log('✅ Firebase inicializado correctamente');

// ========== DATOS DEL JUEGO ==========
const gameData = {
    levels: [
        { id: 0, name: 'El Municipio', mundo: 1, preguntas: 5, soles: 50 },
        { id: 1, name: 'La Junta Vecinal', mundo: 1, preguntas: 5, soles: 50 },
        { id: 2, name: 'Presupuesto', mundo: 1, preguntas: 5, soles: 50 },
        { id: 3, name: 'Fiscalización', mundo: 1, preguntas: 5, soles: 50 },
        { id: 4, name: 'Obras Públicas', mundo: 2, preguntas: 5, soles: 50 },
        { id: 5, name: 'Denuncia Fácil', mundo: 2, preguntas: 5, soles: 50 },
        { id: 6, name: 'El Regidor', mundo: 2, preguntas: 5, soles: 50 },
        { id: 7, name: 'Participación', mundo: 2, preguntas: 5, soles: 50 },
        { id: 8, name: 'El GORE', mundo: 3, preguntas: 5, soles: 50 },
        { id: 9, name: 'Canon Minero', mundo: 3, preguntas: 5, soles: 50 },
        { id: 10, name: 'Leyes Regionales', mundo: 3, preguntas: 5, soles: 50 },
        { id: 11, name: 'Presupuesto Regional', mundo: 3, preguntas: 5, soles: 50 },
        { id: 12, name: 'El Congreso', mundo: 4, preguntas: 5, soles: 50 },
        { id: 13, name: 'Las Leyes', mundo: 4, preguntas: 5, soles: 50 },
        { id: 14, name: 'Voto Informado', mundo: 4, preguntas: 5, soles: 50 },
        { id: 15, name: 'Ciudadanía', mundo: 4, preguntas: 5, soles: 50 }
    ],
    quizzes: [
        { levelId: 0, q: '¿Cuál es la función principal del alcalde?', o: ['Hacer leyes nacionales', 'Administrar servicios locales', 'Juzgar delitos', 'Controlar policía'], c: 1 },
        { levelId: 0, q: '¿Cuánto dura el mandato de un alcalde?', o: ['2 años', '3 años', '4 años', '5 años'], c: 3 },
        { levelId: 0, q: '¿Quiénes son los regidores?', o: ['Jueces', 'Consejeros elegidos', 'Policías', 'Maestros'], c: 1 },
        { levelId: 0, q: '¿Qué es el presupuesto municipal?', o: ['Dinero personal', 'Dinero para servicios públicos', 'Dinero de banco', 'Dinero privado'], c: 1 },
        { levelId: 0, q: '¿Puedes revocar a un alcalde?', o: ['No', 'Sí, con firma de ciudadanos', 'Solo el congreso', 'Nunca'], c: 1 },
    ]
};

// ========== ESTADO DEL JUEGO ==========
let currentUser = null;
let currentLevel = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let lives = 3;

// ========== FUNCIONES DE AUTENTICACIÓN ==========

function toggleForm(event) {
    event.preventDefault();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none'; // Limpiar errores previos
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

async function registerUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirmPassword) {
        showError('Completa todos los campos');
        return;
    }

    if (username.length < 3) {
        showError('El usuario debe tener al menos 3 caracteres');
        return;
    }

    if (password.length < 4) {
        showError('La contraseña debe tener al menos 4 caracteres');
        return;
    }

    if (password !== confirmPassword) {
        showError('Las contraseñas no coinciden');
        return;
    }

    try {
        // Validar que Firebase esté inicializado
        if (!db) {
            showError('Firebase no está configurado correctamente. Verifica firebase-config.js');
            console.error('Firebase no inicializado:', { db });
            return;
        }

        console.log('Intentando registrar usuario:', username);
        
        // Verificar si el usuario ya existe
        const userRef = db.collection('users').doc(username);
        const userSnap = await userRef.get();
        
        if (userSnap.exists()) {
            showError('Este usuario ya existe');
            return;
        }

        // Crear el nuevo usuario
        await userRef.set({
            username: username,
            password: password, // Nota: En producción, esto debería estar hasheado
            soles: 100,
            rank: 'Ciudadano',
            completedLevels: [],
            createdAt: new Date().toISOString()
        });
        
        console.log('Usuario registrado:', username);

        currentUser = { username: username };
        localStorage.setItem('currentUser', username);
        loadUserData();
        showPage('dashboardPage');
    } catch (error) {
        console.error('Error al registrar:', error);
        let errorMessage = 'Error al registrar';
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
    }
}

async function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Completa usuario y contraseña');
        return;
    }

    try {
        // Validar que Firebase esté inicializado
        if (!db) {
            showError('Firebase no está configurado correctamente. Verifica firebase-config.js');
            console.error('Firebase no inicializado:', { db });
            return;
        }

        console.log('Intentando iniciar sesión:', username);
        
        // Buscar el usuario en Firestore
        const userRef = db.collection('users').doc(username);
        const userSnap = await userRef.get();
        
        if (!userSnap.exists()) {
            showError('Usuario no encontrado');
            return;
        }
        
        const userData = userSnap.data();
        
        // Verificar contraseña
        if (userData.password !== password) {
            showError('Contraseña incorrecta');
            return;
        }

        console.log('Sesión iniciada:', username);

        currentUser = { username: username };
        localStorage.setItem('currentUser', username);
        loadUserData();
        showPage('dashboardPage');
    } catch (error) {
        console.error('Error al ingresar:', error);
        let errorMessage = 'Usuario o contraseña incorrectos';
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        showError(errorMessage);
    }
}

async function logout() {
    try {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        showPage('loginPage');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// ========== FUNCIONES DE DATOS ==========

async function loadUserData() {
    if (!currentUser) return;

    try {
        const userRef = db.collection('users').doc(currentUser.username);
        const userSnap = await userRef.get();
        
        if (userSnap.exists()) {
            const data = userSnap.data();
            currentUser.soles = data.soles || 100;
            currentUser.rank = data.rank || 'Ciudadano';
            currentUser.completedLevels = data.completedLevels || [];

            updateUI();
            updateLevelStates();
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

async function updateUserData() {
    if (!currentUser) return;

    try {
        await db.collection('users').doc(currentUser.username).update({
            soles: currentUser.soles,
            rank: currentUser.rank,
            completedLevels: currentUser.completedLevels
        });
    } catch (error) {
        console.error('Error al actualizar datos:', error);
    }
}

async function loadLeaderboard() {
    try {
        const snapshot = await db.collection('users')
            .orderBy('soles', 'desc')
            .limit(10)
            .get();

        const leaderboardBody = document.getElementById('leaderboardBody');
        leaderboardBody.innerHTML = '';

        let position = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${position}</td>
                <td>${data.username}</td>
                <td>${data.soles}</td>
                <td>${data.rank}</td>
            `;
            leaderboardBody.appendChild(row);
            position++;
        });
    } catch (error) {
        console.error('Error al cargar leaderboard:', error);
    }
}

// ========== FUNCIONES DE UI ==========

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';

    if (pageId === 'leaderboardPage') {
        loadLeaderboard();
    }
}

function updateUI() {
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('solesDisplay').textContent = currentUser.soles;
    document.getElementById('rankDisplay').textContent = currentUser.rank;
    document.getElementById('perfilUsername').textContent = currentUser.username;
    document.getElementById('perfilSoles').textContent = currentUser.soles;
    document.getElementById('perfilRank').textContent = currentUser.rank;
    document.getElementById('perfilLevels').textContent = currentUser.completedLevels.length;
}

function updateLevelStates() {
    for (let i = 0; i < gameData.levels.length; i++) {
        const levelCard = document.getElementById(`nivel-${i}`);
        if (!levelCard) continue;

        if (i === 0) {
            levelCard.classList.remove('locked');
        } else if (currentUser.completedLevels.includes(i - 1)) {
            levelCard.classList.remove('locked');
        } else {
            levelCard.classList.add('locked');
        }

        if (currentUser.completedLevels.includes(i)) {
            levelCard.classList.add('completed');
        }
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    console.error('Error mostrado:', message);
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// ========== FUNCIONES DEL JUEGO ==========

function startLevel(levelId) {
    if (levelId > 0 && !currentUser.completedLevels.includes(levelId - 1)) {
        showError('Completa el nivel anterior primero');
        return;
    }

    currentLevel = gameData.levels[levelId];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    lives = 3;

    document.getElementById('levelTitle').textContent = `Nivel ${levelId + 1}: ${currentLevel.name}`;
    document.getElementById('livesDisplay').textContent = lives;
    document.getElementById('correctDisplay').textContent = correctAnswers;

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

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    quiz.o.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => answerQuestion(index, quiz.c);
        optionsContainer.appendChild(button);
    });
}

function answerQuestion(selectedIndex, correctIndex) {
    if (selectedIndex === correctIndex) {
        correctAnswers++;
        document.getElementById('correctDisplay').textContent = correctAnswers;
        currentQuestionIndex++;
        setTimeout(showQuestion, 500);
    } else {
        lives--;
        document.getElementById('livesDisplay').textContent = lives;

        if (lives <= 0) {
            finishLevel(false);
        } else {
            currentQuestionIndex++;
            setTimeout(showQuestion, 500);
        }
    }
}

async function finishLevel(success = correctAnswers >= 4) {
    if (success) {
        currentUser.soles += currentLevel.soles;
        if (!currentUser.completedLevels.includes(currentLevel.id)) {
            currentUser.completedLevels.push(currentLevel.id);
        }
        await updateUserData();
        updateUI();
        updateLevelStates();
        alert(`¡Ganaste ${currentLevel.soles} Soles! Total: ${currentUser.soles}`);
    } else {
        alert('Perdiste todas las vidas. Intenta de nuevo.');
    }
    backToDashboard();
}

function backToDashboard() {
    showPage('dashboardPage');
}
