// ========== MODO DE EMERGENCIA (LOCAL STORAGE) ==========
// Si Firebase falla, el juego funcionará localmente
const USE_LOCAL_STORAGE = true; // Forzar uso local si hay problemas de config

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
    errorDiv.style.display = 'none';
    
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
        showError('📋 Completa todos los campos');
        return;
    }

    if (password !== confirmPassword) {
        showError('❌ Las contraseñas no coinciden');
        return;
    }

    try {
        // MODO LOCAL
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        if (users[username]) {
            showError('⚠️ Este usuario ya existe');
            return;
        }

        const newUser = {
            username: username,
            password: password,
            soles: 100,
            rank: 'Ciudadano',
            completedLevels: [],
            createdAt: new Date().toISOString()
        };

        users[username] = newUser;
        localStorage.setItem('prepol_users', JSON.stringify(users));
        
        // Intentar guardar en Firebase si está disponible
        if (typeof db !== 'undefined' && db !== null) {
            try {
                await db.collection('users').doc(username).set(newUser);
            } catch (e) { console.log("Firebase no disponible, guardado solo local"); }
        }

        showError('✅ ¡Cuenta creada exitosamente!', 'success');
        currentUser = newUser;
        localStorage.setItem('currentUser', username);
        
        setTimeout(() => {
            updateUI();
            updateLevelStates();
            showPage('dashboardPage');
        }, 1000);

    } catch (error) {
        showError('❌ Error al registrar');
    }
}

async function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('📋 Completa usuario y contraseña');
        return;
    }

    try {
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        let userData = users[username];

        // Si no está local, intentar Firebase
        if (!userData && typeof db !== 'undefined' && db !== null) {
            try {
                const userSnap = await db.collection('users').doc(username).get();
                if (userSnap.exists()) {
                    userData = userSnap.data();
                    // Sincronizar localmente
                    users[username] = userData;
                    localStorage.setItem('prepol_users', JSON.stringify(users));
                }
            } catch (e) { console.log("Firebase no disponible"); }
        }

        if (!userData) {
            showError('👤 Usuario no encontrado');
            return;
        }
        
        if (userData.password !== password) {
            showError('🔐 Contraseña incorrecta');
            return;
        }

        showError('✅ ¡Bienvenido!', 'success');
        currentUser = userData;
        localStorage.setItem('currentUser', username);
        
        setTimeout(() => {
            updateUI();
            updateLevelStates();
            showPage('dashboardPage');
        }, 500);
    } catch (error) {
        showError('❌ Error al iniciar sesión');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('loginPage');
}

// ========== FUNCIONES DE DATOS ==========

function updateUI() {
    if (!currentUser) return;
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    document.getElementById('solesDisplay').textContent = currentUser.soles;
    document.getElementById('rankDisplay').textContent = currentUser.rank;
    document.getElementById('perfilUsername').textContent = currentUser.username;
    document.getElementById('perfilSoles').textContent = currentUser.soles;
    document.getElementById('perfilRank').textContent = currentUser.rank;
    document.getElementById('perfilLevels').textContent = currentUser.completedLevels.length;
}

function updateLevelStates() {
    if (!currentUser) return;
    for (let i = 0; i < gameData.levels.length; i++) {
        const levelCard = document.getElementById(`nivel-${i}`);
        if (!levelCard) continue;

        if (i === 0 || currentUser.completedLevels.includes(i - 1)) {
            levelCard.classList.remove('locked');
        } else {
            levelCard.classList.add('locked');
        }

        if (currentUser.completedLevels.includes(i)) {
            levelCard.classList.add('completed');
        }
    }
}

async function saveProgress() {
    if (!currentUser) return;
    
    // Guardar Local
    let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
    users[currentUser.username] = currentUser;
    localStorage.setItem('prepol_users', JSON.stringify(users));

    // Intentar Firebase
    if (typeof db !== 'undefined' && db !== null) {
        try {
            await db.collection('users').doc(currentUser.username).update({
                soles: currentUser.soles,
                rank: currentUser.rank,
                completedLevels: currentUser.completedLevels
            });
        } catch (e) { console.log("Error sincronizando con Firebase"); }
    }
}

// ========== FUNCIONES DE UI ==========

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function showError(message, type = 'error') {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.className = 'error-message ' + (type === 'success' ? 'success' : '');
    setTimeout(() => errorDiv.style.display = 'none', 4000);
}

// ========== LÓGICA DEL JUEGO ==========

function startLevel(levelId) {
    if (levelId > 0 && !currentUser.completedLevels.includes(levelId - 1)) {
        showError('🔒 Completa el nivel anterior primero');
        return;
    }

    currentLevel = gameData.levels[levelId];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    lives = 3;

    document.getElementById('levelTitle').textContent = currentLevel.name;
    document.getElementById('livesDisplay').textContent = lives;
    document.getElementById('correctDisplay').textContent = correctAnswers;

    showQuestion();
    showPage('quizPage');
}

function showQuestion() {
    const quizzes = gameData.quizzes.filter(q => q.levelId === currentLevel.id);
    if (currentQuestionIndex >= quizzes.length) {
        finishLevel(true);
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
        button.onclick = () => {
            if (index === quiz.c) {
                correctAnswers++;
                document.getElementById('correctDisplay').textContent = correctAnswers;
                currentQuestionIndex++;
                showQuestion();
            } else {
                lives--;
                document.getElementById('livesDisplay').textContent = lives;
                if (lives <= 0) finishLevel(false);
                else {
                    currentQuestionIndex++;
                    showQuestion();
                }
            }
        };
        optionsContainer.appendChild(button);
    });
}

async function finishLevel(success) {
    if (success) {
        currentUser.soles += currentLevel.soles;
        if (!currentUser.completedLevels.includes(currentLevel.id)) {
            currentUser.completedLevels.push(currentLevel.id);
        }
        await saveProgress();
        updateUI();
        updateLevelStates();
        alert(`¡Felicidades! Ganaste ${currentLevel.soles} Soles`);
    } else {
        alert('Se acabaron las vidas. ¡Inténtalo de nuevo!');
    }
    showPage('dashboardPage');
}

// Inicialización al cargar
window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        if (users[savedUser]) {
            currentUser = users[savedUser];
            updateUI();
            updateLevelStates();
            showPage('dashboardPage');
        }
    }
};
