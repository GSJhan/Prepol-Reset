// ============================================
// PREPOL RESET - Aplicación Principal
// ============================================

class PrepolReset {
    constructor() {
        this.currentPage = 'home';
        this.currentUser = null;
        this.gameState = {
            currentDistrict: null,
            currentLevel: null,
            currentQuestion: 0,
            lives: 3,
            soles: 100,
            rank: 'Vecino Alerta',
            completedLevels: [],
            score: 0
        };
        
        this.districts = [
            {
                id: 1,
                name: 'Mi Barrio',
                emoji: '🏘️',
                color: '#3b82f6',
                description: 'Aprende sobre municipios, juntas vecinales y presupuestos locales',
                levels: 3,
                unlocked: true
            },
            {
                id: 2,
                name: 'Mi Distrito',
                emoji: '🏢',
                color: '#a855f7',
                description: 'Descubre obras públicas, denuncias y fiscalización',
                levels: 3,
                unlocked: true
            },
            {
                id: 3,
                name: 'Mi Región',
                emoji: '🏛️',
                color: '#ec4899',
                description: 'Entiende el GORE, canon minero y leyes regionales',
                levels: 3,
                unlocked: false
            },
            {
                id: 4,
                name: 'Mi País',
                emoji: '🇵🇪',
                color: '#fbbf24',
                description: 'Aprende sobre el Congreso, leyes nacionales y voto informado',
                levels: 3,
                unlocked: false
            }
        ];

        this.quizzes = this.generateQuizzes();
        this.leaderboard = this.generateLeaderboard();
        
        this.init();
    }

    init() {
        this.loadGameState();
        this.registerServiceWorker();
        AOS.init();
        this.render();
    }

    generateQuizzes() {
        return {
            1: [ // Distrito 1 - Nivel 1
                {
                    id: 1,
                    question: '¿Cuál es la función principal de una municipalidad?',
                    options: [
                        'Administrar los recursos locales y prestar servicios',
                        'Crear leyes nacionales',
                        'Administrar la policía nacional',
                        'Controlar el comercio internacional'
                    ],
                    correct: 0,
                    explanation: 'La municipalidad es responsable de administrar los recursos locales y prestar servicios básicos a la comunidad.'
                },
                {
                    id: 2,
                    question: '¿Qué es una junta vecinal?',
                    options: [
                        'Una organización de vecinos para gestionar problemas locales',
                        'Un tribunal de justicia',
                        'Una empresa privada',
                        'Un banco comunitario'
                    ],
                    correct: 0,
                    explanation: 'Las juntas vecinales son organizaciones de vecinos que se reúnen para resolver problemas de su comunidad.'
                },
                {
                    id: 3,
                    question: '¿Cuál es el presupuesto participativo?',
                    options: [
                        'Un proceso donde los ciudadanos deciden cómo gastar parte del presupuesto municipal',
                        'El salario del alcalde',
                        'El dinero que gasta el gobierno nacional',
                        'Una multa por no pagar impuestos'
                    ],
                    correct: 0,
                    explanation: 'El presupuesto participativo permite que los ciudadanos decidan en qué proyectos invertir el dinero municipal.'
                },
                {
                    id: 4,
                    question: '¿Quién es elegido por voto popular en una municipalidad?',
                    options: [
                        'El alcalde y los regidores',
                        'Solo el alcalde',
                        'El presidente de la república',
                        'Los jueces'
                    ],
                    correct: 0,
                    explanation: 'El alcalde y los regidores son elegidos por voto popular en las elecciones municipales.'
                },
                {
                    id: 5,
                    question: '¿Cuál es el período de gestión de un alcalde?',
                    options: [
                        '4 años',
                        '5 años',
                        '6 años',
                        '3 años'
                    ],
                    correct: 0,
                    explanation: 'El período de gestión de un alcalde es de 4 años, sin reelección inmediata.'
                }
            ],
            2: [ // Distrito 1 - Nivel 2
                {
                    id: 6,
                    question: '¿Qué es una denuncia ciudadana?',
                    options: [
                        'Un informe que presenta un ciudadano sobre irregularidades o delitos',
                        'Una multa',
                        'Un permiso municipal',
                        'Un contrato laboral'
                    ],
                    correct: 0,
                    explanation: 'Una denuncia ciudadana es un informe que presenta un ciudadano sobre irregularidades o delitos que ha presenciado.'
                },
                {
                    id: 7,
                    question: '¿Dónde se pueden presentar denuncias sobre corrupción?',
                    options: [
                        'En la Contraloría General de la República',
                        'En una tienda',
                        'En un banco',
                        'En una escuela'
                    ],
                    correct: 0,
                    explanation: 'La Contraloría General de la República es la entidad encargada de recibir denuncias sobre corrupción.'
                },
                {
                    id: 8,
                    question: '¿Qué es fiscalización?',
                    options: [
                        'Vigilancia y control del cumplimiento de leyes y normas',
                        'Crear nuevas leyes',
                        'Administrar dinero',
                        'Vender productos'
                    ],
                    correct: 0,
                    explanation: 'La fiscalización es la vigilancia y control para asegurar que se cumplan las leyes y normas.'
                },
                {
                    id: 9,
                    question: '¿Quién puede hacer fiscalización ciudadana?',
                    options: [
                        'Cualquier ciudadano',
                        'Solo los políticos',
                        'Solo los policías',
                        'Solo los abogados'
                    ],
                    correct: 0,
                    explanation: 'Cualquier ciudadano tiene el derecho y la responsabilidad de hacer fiscalización ciudadana.'
                },
                {
                    id: 10,
                    question: '¿Cuál es el objetivo de la fiscalización ciudadana?',
                    options: [
                        'Asegurar que los funcionarios públicos cumplan sus deberes',
                        'Ganar dinero',
                        'Crear conflictos',
                        'Viajar al extranjero'
                    ],
                    correct: 0,
                    explanation: 'El objetivo es asegurar que los funcionarios públicos cumplan sus deberes y rindan cuentas.'
                }
            ],
            3: [ // Distrito 1 - Nivel 3
                {
                    id: 11,
                    question: '¿Qué es una obra pública?',
                    options: [
                        'Un proyecto construido con dinero del Estado para beneficio de la comunidad',
                        'Una tienda privada',
                        'Una casa particular',
                        'Un restaurante'
                    ],
                    correct: 0,
                    explanation: 'Una obra pública es un proyecto construido con dinero del Estado para beneficio de la comunidad.'
                },
                {
                    id: 12,
                    question: '¿Quién supervisa las obras públicas?',
                    options: [
                        'La Contraloría y los ciudadanos',
                        'Solo el alcalde',
                        'Solo los ingenieros',
                        'Solo los bancos'
                    ],
                    correct: 0,
                    explanation: 'La Contraloría y los ciudadanos tienen la responsabilidad de supervisar las obras públicas.'
                },
                {
                    id: 13,
                    question: '¿Qué es un acta de inspección?',
                    options: [
                        'Un documento que registra el estado de una obra pública',
                        'Un permiso de construcción',
                        'Un contrato laboral',
                        'Una factura'
                    ],
                    correct: 0,
                    explanation: 'Un acta de inspección es un documento que registra el estado y avance de una obra pública.'
                },
                {
                    id: 14,
                    question: '¿Cuál es el proceso para reportar una obra abandonada?',
                    options: [
                        'Presentar una denuncia a la municipalidad o Contraloría',
                        'Esperar a que se termine sola',
                        'No hacer nada',
                        'Vender el terreno'
                    ],
                    correct: 0,
                    explanation: 'Debes presentar una denuncia a la municipalidad o a la Contraloría para reportar una obra abandonada.'
                },
                {
                    id: 15,
                    question: '¿Qué derechos tiene un ciudadano respecto a las obras públicas?',
                    options: [
                        'Derecho a información, participación y fiscalización',
                        'Ningún derecho',
                        'Solo el derecho a usar',
                        'Solo el derecho a criticar'
                    ],
                    correct: 0,
                    explanation: 'Los ciudadanos tienen derecho a información, participación y fiscalización de las obras públicas.'
                }
            ]
        };
    }

    generateLeaderboard() {
        return [
            { rank: 1, name: 'Juan P.', soles: 5420, rankName: 'Ciudadano Reset', avatar: 'JP' },
            { rank: 2, name: 'María G.', soles: 4890, rankName: 'Gobernador de Barrio', avatar: 'MG' },
            { rank: 3, name: 'Carlos M.', soles: 4560, rankName: 'Gobernador de Barrio', avatar: 'CM' },
            { rank: 4, name: 'Ana L.', soles: 4120, rankName: 'Fiscalizador Jr.', avatar: 'AL' },
            { rank: 5, name: 'Luis R.', soles: 3890, rankName: 'Fiscalizador Jr.', avatar: 'LR' },
            { rank: 6, name: 'Sofia T.', soles: 3450, rankName: 'Vecino Alerta', avatar: 'ST' },
            { rank: 7, name: 'Diego V.', soles: 3120, rankName: 'Vecino Alerta', avatar: 'DV' },
            { rank: 8, name: 'Patricia H.', soles: 2890, rankName: 'Vecino Alerta', avatar: 'PH' }
        ];
    }

    loadGameState() {
        const saved = localStorage.getItem('prepolGameState');
        if (saved) {
            this.gameState = JSON.parse(saved);
        }
    }

    saveGameState() {
        localStorage.setItem('prepolGameState', JSON.stringify(this.gameState));
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('Service Worker registration failed:', err);
            });
        }
    }

    render() {
        const app = document.getElementById('app');
        
        switch(this.currentPage) {
            case 'home':
                app.innerHTML = this.renderHome();
                break;
            case 'game':
                app.innerHTML = this.renderGame();
                break;
            case 'quiz':
                app.innerHTML = this.renderQuiz();
                break;
            case 'duel':
                app.innerHTML = this.renderDuel();
                break;
            case 'leaderboard':
                app.innerHTML = this.renderLeaderboard();
                break;
            default:
                app.innerHTML = this.renderHome();
        }
        
        this.attachEventListeners();
        AOS.refresh();
    }

    renderHome() {
        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                </div>
            </nav>

            <div class="hero-section">
                <div class="container py-5">
                    <div class="row align-items-center">
                        <div class="col-lg-6" data-aos="fade-right">
                            <h1 class="display-4 fw-900 mb-4" style="background: linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                Aprende Cívica<br>Mientras Juegas
                            </h1>
                            <p class="lead mb-4" style="color: #cbd5e1;">
                                Descubre cómo funciona el Estado peruano, aprende a fiscalizar y conviértete en un <span style="color: #fbbf24; font-weight: bold;">Ciudadano Reset</span>. Tipo Duolingo pero para cívica.
                            </p>
                            
                            <div class="features mb-5">
                                <div class="feature-item mb-3" data-aos="fade-up" data-aos-delay="100">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">⚡</div>
                                        <div>
                                            <h5 class="mb-0">Lecciones Rápidas</h5>
                                            <small style="color: #cbd5e1;">2 minutos + 5 preguntas</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="feature-item mb-3" data-aos="fade-up" data-aos-delay="200">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">👥</div>
                                        <div>
                                            <h5 class="mb-0">Duelos 1v1</h5>
                                            <small style="color: #cbd5e1;">Compite y apuesta Soles</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="feature-item mb-3" data-aos="fade-up" data-aos-delay="300">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🏆</div>
                                        <div>
                                            <h5 class="mb-0">4 Rangos</h5>
                                            <small style="color: #cbd5e1;">Hasta Ciudadano Reset</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button class="btn btn-lg btn-primary-custom" onclick="app.goToGame()">
                                Comienza Ahora <i class="fas fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                        <div class="col-lg-6" data-aos="fade-left">
                            <div style="position: relative; height: 400px;">
                                <div class="district-card-home barrio" style="position: absolute; top: 20px; left: 20px;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;">🏘️</div>
                                    <div style="font-size: 1.25rem; font-weight: bold;">Mi Barrio</div>
                                </div>
                                <div class="district-card-home distrito" style="position: absolute; top: 20px; right: 20px;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;">🏢</div>
                                    <div style="font-size: 1.25rem; font-weight: bold;">Mi Distrito</div>
                                </div>
                                <div class="district-card-home region" style="position: absolute; bottom: 20px; left: 20px;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;">🏛️</div>
                                    <div style="font-size: 1.25rem; font-weight: bold;">Mi Región</div>
                                </div>
                                <div class="district-card-home pais" style="position: absolute; bottom: 20px; right: 20px;">
                                    <div style="font-size: 3rem; margin-bottom: 10px;">🇵🇪</div>
                                    <div style="font-size: 1.25rem; font-weight: bold;">Mi País</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-section py-5">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3" data-aos="fade-up">
                            <div class="stat-card text-center">
                                <div class="stat-number">60</div>
                                <div class="stat-label">Preguntas</div>
                            </div>
                        </div>
                        <div class="col-md-3" data-aos="fade-up" data-aos-delay="100">
                            <div class="stat-card text-center">
                                <div class="stat-number">12</div>
                                <div class="stat-label">Niveles</div>
                            </div>
                        </div>
                        <div class="col-md-3" data-aos="fade-up" data-aos-delay="200">
                            <div class="stat-card text-center">
                                <div class="stat-number">4</div>
                                <div class="stat-label">Distritos</div>
                            </div>
                        </div>
                        <div class="col-md-3" data-aos="fade-up" data-aos-delay="300">
                            <div class="stat-card text-center">
                                <div class="stat-number">∞</div>
                                <div class="stat-label">Diversión</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="why-section py-5">
                <div class="container">
                    <h2 class="text-center mb-5" style="font-size: 2.5rem; font-weight: 900;">¿Por Qué PREPOL RESET?</h2>
                    <div class="row">
                        <div class="col-md-4" data-aos="fade-up">
                            <div class="why-card text-center">
                                <div style="font-size: 3rem; margin-bottom: 20px;">🎮</div>
                                <h4>Aprende Jugando</h4>
                                <p style="color: #cbd5e1;">La educación cívica no tiene que ser aburrida. Aprende mientras te diviertes.</p>
                            </div>
                        </div>
                        <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                            <div class="why-card text-center">
                                <div style="font-size: 3rem; margin-bottom: 20px;">⚡</div>
                                <h4>Rápido y Efectivo</h4>
                                <p style="color: #cbd5e1;">Lecciones de 2 minutos. Perfecto para aprender en el camino.</p>
                            </div>
                        </div>
                        <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                            <div class="why-card text-center">
                                <div style="font-size: 3rem; margin-bottom: 20px;">👑</div>
                                <h4>Sé un Ciudadano Reset</h4>
                                <p style="color: #cbd5e1;">Alcanza el rango máximo y obtén tu certificado digital verificable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cta-section py-5 text-center">
                <div class="container">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🐕</div>
                    <h2 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 20px;">El Vigilante te espera</h2>
                    <p class="lead mb-4" style="color: #cbd5e1; max-width: 500px; margin-left: auto; margin-right: auto;">
                        ¿Listo para aprender cívica de una forma diferente? ¡Comienza tu aventura ahora!
                    </p>
                    <button class="btn btn-lg btn-primary-custom" onclick="app.goToGame()">
                        Comenzar Ahora <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>

            <footer class="py-4" style="border-top: 1px solid rgba(255,255,255,0.1); text-align: center; color: #cbd5e1;">
                <div class="container">
                    <p>PREPOL RESET © 2026 - Aprende Cívica, Fiscaliza el Estado, Sé un Ciudadano Reset</p>
                </div>
            </footer>
        `;
    }

    renderGame() {
        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                    <div class="d-flex gap-3">
                        <button class="btn btn-sm btn-outline-light" onclick="app.goToLeaderboard()">
                            <i class="fas fa-trophy me-2"></i>Ranking
                        </button>
                        <button class="btn btn-sm btn-outline-light" onclick="app.goToDuel()">
                            <i class="fas fa-users me-2"></i>Duelos
                        </button>
                        <button class="btn btn-sm btn-outline-light" onclick="app.goToHome()">
                            <i class="fas fa-home me-2"></i>Inicio
                        </button>
                    </div>
                </div>
            </nav>

            <div class="container py-5">
                <div class="game-header mb-5">
                    <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 20px;">Selecciona un Distrito</h1>
                    <div class="player-stats d-flex gap-3 justify-content-center flex-wrap">
                        <div class="stat-badge">
                            <span style="font-size: 1.5rem;">💰</span>
                            <div>
                                <small>Soles Cívicos</small>
                                <div style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">${this.gameState.soles}</div>
                            </div>
                        </div>
                        <div class="stat-badge">
                            <span style="font-size: 1.5rem;">❤️</span>
                            <div>
                                <small>Vidas</small>
                                <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">${this.gameState.lives}</div>
                            </div>
                        </div>
                        <div class="stat-badge">
                            <span style="font-size: 1.5rem;">🏅</span>
                            <div>
                                <small>Rango</small>
                                <div style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">${this.gameState.rank}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    ${this.districts.map((district, index) => `
                        <div class="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 100}">
                            <div class="district-card-game ${!district.unlocked ? 'locked' : ''}" onclick="${district.unlocked ? `app.selectDistrict(${district.id})` : ''}">
                                <div class="d-flex align-items-center mb-3">
                                    <span style="font-size: 2.5rem; margin-right: 15px;">${district.emoji}</span>
                                    <div>
                                        <h3 style="margin: 0; font-weight: 900;">${district.name}</h3>
                                        <small style="color: #cbd5e1;">${district.levels} Niveles</small>
                                    </div>
                                </div>
                                <p style="color: #cbd5e1; margin-bottom: 15px;">${district.description}</p>
                                <div class="levels-grid">
                                    ${Array.from({length: district.levels}, (_, i) => `
                                        <button class="level-btn ${this.gameState.completedLevels.includes(`${district.id}-${i+1}`) ? 'completed' : ''}" 
                                                onclick="event.stopPropagation(); app.startLevel(${district.id}, ${i+1})">
                                            Nivel ${i+1}
                                        </button>
                                    `).join('')}
                                </div>
                                ${!district.unlocked ? '<div style="position: absolute; top: 10px; right: 10px;"><i class="fas fa-lock" style="font-size: 1.5rem;"></i></div>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderQuiz() {
        const levelKey = `${this.gameState.currentDistrict}-${this.gameState.currentLevel}`;
        const questions = this.quizzes[levelKey] || [];
        const currentQ = questions[this.gameState.currentQuestion];
        
        if (!currentQ) {
            return this.renderLevelComplete();
        }

        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                </div>
            </nav>

            <div class="container py-5" style="max-width: 800px;">
                <div class="quiz-header mb-4">
                    <div class="progress" style="height: 8px;">
                        ${Array.from({length: questions.length}, (_, i) => `
                            <div class="progress-bar ${i < this.gameState.currentQuestion ? 'completed' : i === this.gameState.currentQuestion ? 'active' : ''}" 
                                 style="width: ${100/questions.length}%"></div>
                        `).join('')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span style="font-size: 1.25rem; font-weight: bold;">Pregunta ${this.gameState.currentQuestion + 1}/${questions.length}</span>
                        <div class="lives">
                            ${Array.from({length: 3}, (_, i) => `
                                <span style="font-size: 1.5rem; ${i >= this.gameState.lives ? 'opacity: 0.3;' : ''}">❤️</span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="vigilante-card mb-4">
                    <div style="display: flex; gap: 15px;">
                        <div style="font-size: 2.5rem;">🐕</div>
                        <div>
                            <h5 style="margin: 0; font-weight: 900;">El Vigilante</h5>
                            <p style="color: #cbd5e1; margin-top: 5px;">Caso ${this.gameState.currentQuestion + 1}: Aprende sobre cívica peruana y fiscalización del Estado.</p>
                        </div>
                    </div>
                </div>

                <div class="question-card mb-4">
                    <h4 class="question-text">${currentQ.question}</h4>
                    <div class="options">
                        ${currentQ.options.map((option, index) => `
                            <button class="option-btn" onclick="app.selectAnswer(${index})">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div id="feedback" class="feedback"></div>

                <div class="d-flex gap-2">
                    <button class="btn btn-outline-light" onclick="app.goToGame()">
                        <i class="fas fa-arrow-left me-2"></i>Volver
                    </button>
                </div>
            </div>
        `;
    }

    renderLevelComplete() {
        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                </div>
            </nav>

            <div class="container py-5 text-center" style="max-width: 600px;">
                <div style="font-size: 5rem; margin-bottom: 20px; animation: bounce 1s infinite;">🎉</div>
                <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 20px;">¡Nivel Completado!</h1>
                <p class="lead mb-4" style="color: #cbd5e1;">Has ganado <span style="color: #fbbf24; font-weight: bold;">+100 Soles Cívicos</span></p>
                
                <div class="mb-5">
                    <h5 style="margin-bottom: 15px;">Resumen</h5>
                    <div class="stat-card" style="text-align: left;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Preguntas Correctas:</span>
                            <span style="color: #10b981; font-weight: bold;">5/5</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Tiempo:</span>
                            <span style="color: #3b82f6; font-weight: bold;">1:45</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Soles Ganados:</span>
                            <span style="color: #fbbf24; font-weight: bold;">+100</span>
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button class="btn btn-primary-custom flex-grow-1" onclick="app.goToGame()">
                        Siguiente Nivel
                    </button>
                    <button class="btn btn-outline-light flex-grow-1" onclick="app.goToGame()">
                        Volver al Mapa
                    </button>
                </div>
            </div>
        `;
    }

    renderDuel() {
        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                    <button class="btn btn-sm btn-outline-light" onclick="app.goToGame()">
                        <i class="fas fa-arrow-left me-2"></i>Volver
                    </button>
                </div>
            </nav>

            <div class="container py-5">
                <h1 class="text-center mb-5" style="font-size: 2.5rem; font-weight: 900;">Duelos Cívicos</h1>
                
                <div class="row">
                    <div class="col-md-6 mb-4" data-aos="fade-right">
                        <div class="duel-mode-card">
                            <div style="font-size: 3rem; margin-bottom: 20px;">👥</div>
                            <h4 style="font-weight: 900;">Duelo Local</h4>
                            <p style="color: #cbd5e1;">Compite contra un amigo en el mismo dispositivo</p>
                            <button class="btn btn-primary-custom w-100" onclick="app.startLocalDuel()">
                                Comenzar Duelo
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6 mb-4" data-aos="fade-left">
                        <div class="duel-mode-card">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🌐</div>
                            <h4 style="font-weight: 900;">Duelo Online</h4>
                            <p style="color: #cbd5e1;">Compite contra jugadores de todo el mundo</p>
                            <button class="btn btn-primary-custom w-100" onclick="alert('Próximamente disponible')">
                                Próximamente
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-5 pt-5 border-top">
                    <h3 class="mb-4">Cómo Funciona</h3>
                    <div class="row">
                        <div class="col-md-4" data-aos="fade-up">
                            <div class="how-card">
                                <div style="font-size: 2rem; margin-bottom: 10px;">1️⃣</div>
                                <h5>Apuesta Soles</h5>
                                <p style="color: #cbd5e1;">Decide cuántos Soles Cívicos quieres apostar</p>
                            </div>
                        </div>
                        <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
                            <div class="how-card">
                                <div style="font-size: 2rem; margin-bottom: 10px;">2️⃣</div>
                                <h5>Responde Preguntas</h5>
                                <p style="color: #cbd5e1;">Ambos jugadores responden el mismo caso</p>
                            </div>
                        </div>
                        <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
                            <div class="how-card">
                                <div style="font-size: 2rem; margin-bottom: 10px;">3️⃣</div>
                                <h5>¡Gana!</h5>
                                <p style="color: #cbd5e1;">El más rápido y preciso se lleva los Soles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLeaderboard() {
        return `
            <nav class="navbar navbar-dark bg-dark sticky-top" style="background: linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%) !important; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div class="container-fluid">
                    <span class="navbar-brand mb-0 h1">
                        <span style="font-size: 1.5rem; margin-right: 10px;">🐕</span>
                        <span style="background: linear-gradient(135deg, #fbbf24 0%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">PREPOL RESET</span>
                    </span>
                    <button class="btn btn-sm btn-outline-light" onclick="app.goToGame()">
                        <i class="fas fa-arrow-left me-2"></i>Volver
                    </button>
                </div>
            </nav>

            <div class="container py-5">
                <h1 class="text-center mb-5" style="font-size: 2.5rem; font-weight: 900;">🏆 Ranking Global</h1>
                
                <div class="leaderboard-table-container">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th style="width: 10%;">Posición</th>
                                <th style="width: 40%;">Jugador</th>
                                <th style="width: 30%;">Rango</th>
                                <th style="width: 20%;">Soles</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.leaderboard.map(player => `
                                <tr>
                                    <td>
                                        <span class="rank rank-${player.rank === 1 ? 'top-1' : player.rank === 2 ? 'top-2' : player.rank === 3 ? 'top-3' : ''}" style="font-weight: 900;">
                                            ${player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                                        </span>
                                    </td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div class="player-avatar">${player.avatar}</div>
                                            <span>${player.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #fbbf24;">${player.rankName}</span>
                                    </td>
                                    <td>
                                        <span class="soles" style="font-weight: 900;">${player.soles.toLocaleString()}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Métodos de navegación
    goToHome() {
        this.currentPage = 'home';
        this.render();
    }

    goToGame() {
        this.currentPage = 'game';
        this.render();
    }

    goToDuel() {
        this.currentPage = 'duel';
        this.render();
    }

    goToLeaderboard() {
        this.currentPage = 'leaderboard';
        this.render();
    }

    selectDistrict(districtId) {
        this.gameState.currentDistrict = districtId;
        this.currentPage = 'game';
        this.render();
    }

    startLevel(districtId, levelNumber) {
        this.gameState.currentDistrict = districtId;
        this.gameState.currentLevel = levelNumber;
        this.gameState.currentQuestion = 0;
        this.currentPage = 'quiz';
        this.render();
    }

    selectAnswer(index) {
        const levelKey = `${this.gameState.currentDistrict}-${this.gameState.currentLevel}`;
        const questions = this.quizzes[levelKey] || [];
        const currentQ = questions[this.gameState.currentQuestion];
        
        const feedback = document.getElementById('feedback');
        const isCorrect = index === currentQ.correct;
        
        if (isCorrect) {
            feedback.className = 'feedback show correct';
            feedback.innerHTML = `<strong>✓ ¡Correcto!</strong> ${currentQ.explanation}`;
            this.gameState.score += 20;
            this.gameState.soles += 20;
        } else {
            feedback.className = 'feedback show incorrect';
            feedback.innerHTML = `<strong>✗ Incorrecto</strong> ${currentQ.explanation}`;
            this.gameState.lives -= 1;
            if (this.gameState.lives < 0) this.gameState.lives = 0;
        }

        this.saveGameState();

        // Desabilitar opciones
        document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);

        // Siguiente pregunta
        setTimeout(() => {
            this.gameState.currentQuestion += 1;
            if (this.gameState.currentQuestion >= questions.length) {
                const levelId = `${this.gameState.currentDistrict}-${this.gameState.currentLevel}`;
                if (!this.gameState.completedLevels.includes(levelId)) {
                    this.gameState.completedLevels.push(levelId);
                }
                this.saveGameState();
            }
            this.render();
        }, 2000);
    }

    startLocalDuel() {
        alert('Modo duelo local - Próximamente con interfaz completa');
    }

    attachEventListeners() {
        // Los event listeners se agregan mediante onclick en el HTML
    }
}

// Inicializar la aplicación
const app = new PrepolReset();
