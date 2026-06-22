// PREPOL RESET - Lógica del Juego

class PrepolGame {
    constructor() {
        this.currentPage = 'home';
        this.currentDistrict = null;
        this.currentLevel = null;
        this.currentQuestion = 0;
        this.playerData = {
            name: 'Jugador',
            soles: 100,
            lives: 3,
            rank: 'Vecino Alerta',
            totalScore: 0,
            completedLevels: []
        };
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.showPage('homePage');
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.showPage('gamePage'));
        document.getElementById('backBtn').addEventListener('click', () => this.showPage('homePage'));
        document.getElementById('backQuizBtn').addEventListener('click', () => this.showPage('gamePage'));
        document.getElementById('backDuelBtn').addEventListener('click', () => this.showPage('gamePage'));
        document.getElementById('backLeaderboardBtn').addEventListener('click', () => this.showPage('gamePage'));
        document.getElementById('duelBtn').addEventListener('click', () => this.showPage('duelPage'));
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showPage('leaderboardPage'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // District cards
        document.querySelectorAll('.district-card').forEach((card, index) => {
            card.addEventListener('click', () => this.selectDistrict(index));
        });

        // Duel buttons
        document.getElementById('quickDuelBtn')?.addEventListener('click', () => this.startDuel('quick'));
        document.getElementById('friendDuelBtn')?.addEventListener('click', () => this.startDuel('friend'));

        // Betting buttons
        document.querySelectorAll('.btn-bet').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                this.startQuiz(amount);
            });
        });

        document.getElementById('cancelBetBtn')?.addEventListener('click', () => {
            document.getElementById('bettingModal').style.display = 'none';
        });
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
        document.getElementById(pageId).style.display = 'block';
        this.currentPage = pageId;

        if (pageId === 'gamePage') {
            this.updatePlayerStats();
        } else if (pageId === 'leaderboardPage') {
            this.loadLeaderboard();
        }
    }

    selectDistrict(index) {
        this.currentDistrict = index;
        const districtNames = ['Mi Barrio', 'Mi Distrito', 'Mi Región', 'Mi País'];
        alert(`Has seleccionado: ${districtNames[index]}\n\nSelecciona un nivel para comenzar.`);
        // Aquí iría la lógica para mostrar los niveles
    }

    startQuiz(betAmount = 0) {
        if (this.playerData.lives <= 0) {
            alert('No te quedan vidas. Espera 15-30 minutos o gasta Soles Cívicos.');
            return;
        }

        this.showPage('quizPage');
        this.currentQuestion = 0;
        this.loadQuestion();
    }

    loadQuestion() {
        const questions = this.getQuestions();
        if (this.currentQuestion >= questions.length) {
            this.completeLevel();
            return;
        }

        const q = questions[this.currentQuestion];
        document.getElementById('questionText').textContent = q.question;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => this.answerQuestion(index, q.correct));
            optionsContainer.appendChild(btn);
        });

        // Update progress
        const progress = ((this.currentQuestion + 1) / questions.length) * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }

    answerQuestion(selectedIndex, correctIndex) {
        const isCorrect = selectedIndex === correctIndex;
        const feedbackCard = document.getElementById('feedbackCard');
        const feedbackSection = document.getElementById('feedbackSection');
        const options = document.querySelectorAll('.option-btn');

        options.forEach(opt => opt.disabled = true);

        if (isCorrect) {
            feedbackCard.className = 'feedback-card';
            feedbackCard.innerHTML = '✅ ¡Correcto! Ganaste 20 Soles Cívicos.';
            this.playerData.soles += 20;
            this.playerData.totalScore += 20;
        } else {
            feedbackCard.className = 'feedback-card incorrect';
            feedbackCard.innerHTML = '❌ Respuesta incorrecta. Pierdes una vida.';
            this.playerData.lives--;
        }

        feedbackSection.style.display = 'block';
        document.getElementById('nextBtn').style.display = 'block';
        document.getElementById('nextBtn').onclick = () => {
            this.currentQuestion++;
            feedbackSection.style.display = 'none';
            this.loadQuestion();
        };

        this.updatePlayerStats();
    }

    completeLevel() {
        alert(`¡Felicidades! Completaste el nivel.\nGanaste 100 Soles Cívicos.\nTotal: ${this.playerData.soles} Soles`);
        this.playerData.soles += 100;
        this.checkRankUp();
        this.saveData();
        this.showPage('gamePage');
    }

    checkRankUp() {
        const ranks = ['Vecino Alerta', 'Fiscalizador Jr.', 'Gobernador de Barrio', 'Ciudadano Reset'];
        const levelThresholds = [0, 300, 600, 1000];

        for (let i = ranks.length - 1; i >= 0; i--) {
            if (this.playerData.totalScore >= levelThresholds[i]) {
                this.playerData.rank = ranks[i];
                break;
            }
        }
    }

    startDuel(mode) {
        alert(`Modo: ${mode === 'quick' ? 'Duelo Rápido' : 'Duelo con Amigo'}\n\nFuncionalidad en desarrollo.`);
    }

    loadLeaderboard() {
        const leaderboardData = [
            { position: 1, name: 'Carlos', soles: 2500, rank: 'Ciudadano Reset' },
            { position: 2, name: 'María', soles: 2100, rank: 'Gobernador de Barrio' },
            { position: 3, name: 'Juan', soles: 1800, rank: 'Gobernador de Barrio' },
            { position: 4, name: 'Tú', soles: this.playerData.soles, rank: this.playerData.rank },
            { position: 5, name: 'Ana', soles: 1200, rank: 'Fiscalizador Jr.' },
        ];

        const tbody = document.getElementById('leaderboardBody');
        tbody.innerHTML = '';

        leaderboardData.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.position}</td>
                <td>${player.name}</td>
                <td>${player.soles}</td>
                <td>${player.rank}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePlayerStats() {
        document.getElementById('solesDisplay').textContent = this.playerData.soles;
        document.getElementById('rankDisplay').textContent = this.playerData.rank;
        document.getElementById('livesDisplay').textContent = '❤️'.repeat(this.playerData.lives) + '🖤'.repeat(3 - this.playerData.lives);
        document.getElementById('playerAvatar').textContent = this.playerData.name.charAt(0).toUpperCase();
        document.getElementById('quizLives').textContent = '❤️'.repeat(this.playerData.lives) + '🖤'.repeat(3 - this.playerData.lives);
    }

    getQuestions() {
        return [
            {
                question: '¿Cuál es la función principal de un municipio?',
                options: ['Legislar leyes nacionales', 'Administrar servicios locales', 'Dirigir el país', 'Controlar provincias'],
                correct: 1
            },
            {
                question: '¿Quién preside el Congreso de la República?',
                options: ['El Presidente', 'El Jefe de Gabinete', 'El Presidente del Congreso', 'El Fiscal General'],
                correct: 2
            },
            {
                question: '¿Cuántos años dura un período presidencial en Perú?',
                options: ['3 años', '4 años', '5 años', '6 años'],
                correct: 2
            },
            {
                question: '¿Qué es una junta vecinal?',
                options: ['Un grupo de vecinos organizados', 'Una tienda de barrio', 'Una escuela', 'Un hospital'],
                correct: 0
            },
            {
                question: '¿Cuál es el derecho fundamental de todo ciudadano?',
                options: ['Trabajar gratis', 'Votar', 'No pagar impuestos', 'Ignorar leyes'],
                correct: 1
            }
        ];
    }

    saveData() {
        localStorage.setItem('prepolGameData', JSON.stringify(this.playerData));
    }

    loadData() {
        const saved = localStorage.getItem('prepolGameData');
        if (saved) {
            this.playerData = JSON.parse(saved);
        }
    }

    logout() {
        this.saveData();
        alert('Progreso guardado. ¡Hasta pronto!');
        location.reload();
    }
}

// Iniciar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PrepolGame();
});
