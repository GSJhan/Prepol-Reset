// ========== MODO DE EMERGENCIA (LOCAL STORAGE) ==========
const USE_LOCAL_STORAGE = true;

// ========== UTILIDADES ==========
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRankByPoints(soles) {
    if (soles >= 1000) return '🌟 Ciudadano Experto';
    if (soles >= 750) return '⭐ Ciudadano Avanzado';
    if (soles >= 500) return '✨ Ciudadano Informado';
    if (soles >= 250) return '🎖️ Ciudadano Activo';
    return '👤 Ciudadano';
}

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
        // NIVEL 0: El Municipio
        { levelId: 0, q: '¿Cuál es la función principal del alcalde en una municipalidad?', o: ['Hacer leyes nacionales', 'Administrar servicios locales y representar al municipio', 'Juzgar delitos civiles', 'Controlar a la policía nacional'], c: 1 },
        { levelId: 0, q: '¿Cuánto dura el mandato de un alcalde en Perú?', o: ['2 años', '3 años', '4 años', '5 años'], c: 2 },
        { levelId: 0, q: '¿Cuál es la diferencia entre un alcalde y un regidor?', o: ['No hay diferencia', 'El alcalde es elegido por votación y el regidor es nombrado', 'El alcalde administra y el regidor es parte del consejo municipal', 'El regidor tiene más poder que el alcalde'], c: 2 },
        { levelId: 0, q: '¿Qué es el presupuesto municipal y cuál es su propósito?', o: ['Dinero personal del alcalde', 'Plan de gastos para servicios públicos del municipio', 'Dinero que presta el banco', 'Dinero privado de empresas'], c: 1 },
        { levelId: 0, q: '¿Mediante qué mecanismo puedes revocar a un alcalde?', o: ['No se puede revocar', 'Sí, con firma de ciudadanos en una petición formal', 'Solo el congreso puede hacerlo', 'Nunca se puede revocar'], c: 1 },
        
        // NIVEL 1: La Junta Vecinal
        { levelId: 1, q: '¿Qué es una Junta Vecinal y cuál es su rol en la comunidad?', o: ['Un partido político local', 'Una organización de vecinos que participa en decisiones comunitarias', 'Un grupo de policías comunitarios', 'Una empresa privada de servicios'], c: 1 },
        { levelId: 1, q: '¿Cuál es el objetivo principal de una Junta Vecinal?', o: ['Cobrar impuestos a los vecinos', 'Mejorar el barrio y representar intereses comunitarios', 'Vender productos a los vecinos', 'Organizar solo fiestas y eventos'], c: 1 },
        { levelId: 1, q: '¿Quién preside una Junta Vecinal y cómo es elegido?', o: ['El Alcalde la preside automáticamente', 'Un Presidente elegido por los vecinos de la junta', 'Un Regidor designado por el municipio', 'El Comisario de la zona'], c: 1 },
        { levelId: 1, q: '¿El cargo en una Junta Vecinal es remunerado?', o: ['Sí, ganan un sueldo fijo', 'No, es ad honorem (voluntario)', 'Solo los domingos se paga', 'A veces se paga'], c: 1 },
        { levelId: 1, q: '¿Quién reconoce oficialmente a una Junta Vecinal?', o: ['El Congreso de la República', 'La Municipalidad local', 'El Presidente de la República', 'La ONU'], c: 1 },
        
        // NIVEL 2: Presupuesto
        { levelId: 2, q: '¿Cómo se determina el presupuesto municipal anualmente?', o: ['Lo decide solo el alcalde', 'Se elabora participativamente y es aprobado por el consejo municipal', 'Lo envía el gobierno central', 'Lo deciden los empresarios'], c: 1 },
        { levelId: 2, q: '¿En qué áreas se invierte principalmente el presupuesto municipal?', o: ['Solo en sueldos de empleados', 'Educación, salud, infraestructura, servicios básicos', 'Solo en obras de lujo', 'En viajes del alcalde'], c: 1 },
        { levelId: 2, q: '¿Qué es el presupuesto participativo?', o: ['Dinero que da el gobierno central', 'Proceso donde ciudadanos participan en decidir cómo se gasta parte del presupuesto', 'Dinero que piden prestado', 'Dinero que no se gasta'], c: 1 },
        { levelId: 2, q: '¿Quién fiscaliza que el presupuesto se gaste correctamente?', o: ['Solo el alcalde', 'La ciudadanía, regidores y órganos de control', 'Nadie lo fiscaliza', 'Solo el gobierno central'], c: 1 },
        { levelId: 2, q: '¿Cuál es la fuente principal de ingresos de un municipio?', o: ['Impuestos nacionales solamente', 'Impuestos locales, canon minero, transferencias del estado', 'Dinero de empresas privadas', 'Donaciones internacionales'], c: 1 },
        
        // NIVEL 3: Fiscalización
        { levelId: 3, q: '¿Qué significa fiscalizar en el contexto municipal?', o: ['Cobrar más impuestos', 'Vigilar y controlar que se cumplan leyes y se gaste correctamente', 'Hacer auditorías privadas', 'Revisar solo gastos grandes'], c: 1 },
        { levelId: 3, q: '¿Quiénes pueden fiscalizar la gestión municipal?', o: ['Solo el alcalde', 'Ciudadanos, medios, órganos de control y sociedad civil', 'Solo el gobierno central', 'Solo los regidores'], c: 1 },
        { levelId: 3, q: '¿Qué es una auditoría municipal?', o: ['Un castigo al alcalde', 'Revisión detallada de cuentas y gastos para verificar legalidad', 'Un impuesto nuevo', 'Una reunión de vecinos'], c: 1 },
        { levelId: 3, q: '¿Cuál es el mecanismo de denuncia si encuentras corrupción?', o: ['No hay forma de denunciar', 'Puedes denunciar ante la Contraloría, Fiscalía u órganos de control', 'Solo los regidores pueden denunciar', 'Debes esperar a las elecciones'], c: 1 },
        { levelId: 3, q: '¿Qué es la Contraloría y qué función tiene?', o: ['Un banco municipal', 'Órgano que audita y fiscaliza la gestión pública', 'Una empresa privada', 'Un grupo de policías'], c: 1 },
        
        // NIVEL 4: Obras Públicas
        { levelId: 4, q: '¿Qué son las obras públicas?', o: ['Negocios privados del alcalde', 'Proyectos de infraestructura financiados con dinero público para beneficio colectivo', 'Trabajos que hacen solo los empleados municipales', 'Construcciones privadas en la ciudad'], c: 1 },
        { levelId: 4, q: '¿Cuál es el proceso para ejecutar una obra pública?', o: ['El alcalde decide y construye', 'Planificación, presupuesto, licitación, ejecución y supervisión', 'Se construye sin permiso', 'Solo se hacen si hay dinero extra'], c: 1 },
        { levelId: 4, q: '¿Qué es una licitación en obras públicas?', o: ['Un impuesto a los constructores', 'Proceso competitivo donde empresas presentan propuestas para ganar un contrato', 'Un permiso de construcción', 'Una multa por mala obra'], c: 1 },
        { levelId: 4, q: '¿Cuál es el objetivo de supervisar una obra pública?', o: ['Entretener al alcalde', 'Verificar que se cumpla con calidad, presupuesto y cronograma', 'Cobrar dinero extra', 'Nada, no es necesario'], c: 1 },
        { levelId: 4, q: '¿Quién puede denunciar una obra pública de mala calidad?', o: ['Solo los ingenieros', 'Cualquier ciudadano puede denunciar ante municipio o autoridades', 'Nadie puede denunciar', 'Solo el alcalde'], c: 1 },
        
        // NIVEL 5: Denuncia Fácil
        { levelId: 5, q: '¿Qué es un mecanismo de denuncia fácil?', o: ['Un castigo rápido', 'Sistema simplificado para que ciudadanos reporten problemas sin complicaciones', 'Una multa automática', 'Un permiso de construcción'], c: 1 },
        { levelId: 5, q: '¿Cuáles son ejemplos de problemas que puedes denunciar?', o: ['Solo robos', 'Baches, servicios deficientes, corrupción, obras incompletas', 'Nada se puede denunciar', 'Solo problemas de tráfico'], c: 1 },
        { levelId: 5, q: '¿Dónde puedes hacer una denuncia en tu municipio?', o: ['Solo en persona', 'Municipalidad, líneas telefónicas, plataformas online, redes sociales', 'No hay lugar para denunciar', 'Solo en la comisaría'], c: 1 },
        { levelId: 5, q: '¿Qué pasa después de hacer una denuncia?', o: ['Nada', 'Se registra, investiga y da seguimiento', 'Te multan por denunciar', 'Se ignora'], c: 1 },
        { levelId: 5, q: '¿Puedes denunciar de forma anónima?', o: ['No, siempre debes identificarte', 'Sí, muchos sistemas permiten denuncias anónimas', 'Solo si eres regidor', 'Depende del día'], c: 1 },
        
        // NIVEL 6: El Regidor
        { levelId: 6, q: '¿Quién es un regidor y cuál es su rol?', o: ['El alcalde', 'Representante elegido que forma parte del consejo municipal', 'Un empleado del municipio', 'Un policía'], c: 1 },
        { levelId: 6, q: '¿Cuántos regidores hay en un municipio?', o: ['Siempre 5', 'Varía según el tamaño del municipio', '1 siempre', '10 siempre'], c: 1 },
        { levelId: 6, q: '¿Cuál es la función principal del consejo municipal?', o: ['Ejecutar obras', 'Legislar localmente y fiscalizar al alcalde', 'Cobrar impuestos', 'Hacer campañas políticas'], c: 1 },
        { levelId: 6, q: '¿Pueden los regidores ser reelegidos?', o: ['No, solo un mandato', 'Sí, pueden ser reelegidos si los ciudadanos lo desean', 'Solo 2 veces', 'Nunca'], c: 1 },
        { levelId: 6, q: '¿Qué sucede si un regidor no cumple sus funciones?', o: ['Nada', 'Puede ser revocado por los ciudadanos', 'Recibe un premio', 'Sigue indefinidamente'], c: 1 },
        
        // NIVEL 7: Participación
        { levelId: 7, q: '¿Qué es la participación ciudadana?', o: ['Votar solo en elecciones', 'Involucrarse activamente en decisiones públicas y gestión municipal', 'Pagar impuestos', 'Trabajar en el municipio'], c: 1 },
        { levelId: 7, q: '¿Cuáles son formas de participación ciudadana?', o: ['Solo votar', 'Juntas vecinales, cabildos abiertos, presupuesto participativo, denuncias', 'No hay formas de participar', 'Solo firmar peticiones'], c: 1 },
        { levelId: 7, q: '¿Qué es un cabildo abierto?', o: ['Una reunión privada del alcalde', 'Asamblea pública donde ciudadanos dialogan con autoridades', 'Un evento de fiesta', 'Una votación'], c: 1 },
        { levelId: 7, q: '¿Por qué es importante la participación ciudadana?', o: ['No es importante', 'Mejora la gestión, transparencia y representa intereses de la comunidad', 'Solo para entretener', 'Para cobrar impuestos'], c: 1 },
        { levelId: 7, q: '¿Qué derechos tienes como ciudadano en tu municipio?', o: ['Ninguno', 'Acceso a información, participación, petición y fiscalización', 'Solo obedecer', 'Solo pagar'], c: 1 },
        
        // NIVEL 8: El GORE
        { levelId: 8, q: '¿Qué es el GORE?', o: ['Un alcalde regional', 'Gobierno Regional que administra la región', 'Una municipalidad grande', 'Un banco'], c: 1 },
        { levelId: 8, q: '¿Quién lidera el GORE?', o: ['El Presidente de la República', 'El Gobernador Regional elegido por votación', 'El Alcalde', 'El Congresista'], c: 1 },
        { levelId: 8, q: '¿Cuál es la diferencia entre municipio y región?', o: ['No hay diferencia', 'Municipio es local, región agrupa varios municipios', 'Región es más pequeña', 'Son lo mismo'], c: 1 },
        { levelId: 8, q: '¿Qué responsabilidades tiene el GORE?', o: ['Ninguna', 'Educación, salud, infraestructura regional, desarrollo económico', 'Solo hacer leyes nacionales', 'Solo recolectar impuestos'], c: 1 },
        { levelId: 8, q: '¿Cuánto dura el mandato de un gobernador regional?', o: ['2 años', '4 años', '5 años', '6 años'], c: 1 },
        
        // NIVEL 9: Canon Minero
        { levelId: 9, q: '¿Qué es el canon minero?', o: ['Un impuesto a los mineros', 'Porcentaje de ingresos de actividad minera que va a gobiernos locales', 'Una mina del gobierno', 'Un permiso de minería'], c: 1 },
        { levelId: 9, q: '¿A quiénes beneficia el canon minero?', o: ['Solo a la empresa minera', 'Gobiernos regionales y municipales de zonas mineras', 'Solo al gobierno central', 'A ninguno'], c: 1 },
        { levelId: 9, q: '¿En qué deben invertir el canon minero los gobiernos?', o: ['En gastos personales', 'En educación, salud, infraestructura y desarrollo', 'En viajes', 'En nada específico'], c: 1 },
        { levelId: 9, q: '¿Cuál es el porcentaje del canon minero?', o: ['1%', '5%', 'Varía según el mineral y acuerdos', '50%'], c: 2 },
        { levelId: 9, q: '¿Qué problema puede ocurrir con el canon minero?', o: ['Nada', 'Mal uso, corrupción o falta de planificación en su inversión', 'Que no haya minería', 'Que sea muy poco'], c: 1 },
        
        // NIVEL 10: Leyes Regionales
        { levelId: 10, q: '¿Qué son las leyes regionales?', o: ['Leyes nacionales', 'Normas que emite el GORE para regular la región', 'Leyes internacionales', 'Leyes municipales'], c: 1 },
        { levelId: 10, q: '¿Quién aprueba las leyes regionales?', o: ['El Presidente', 'El Consejo Regional', 'El Alcalde', 'El Congreso'], c: 1 },
        { levelId: 10, q: '¿Pueden las leyes regionales contradecir leyes nacionales?', o: ['Sí, siempre', 'No, deben estar en concordancia con leyes nacionales', 'A veces', 'Depende del gobernador'], c: 1 },
        { levelId: 10, q: '¿Cuál es un ejemplo de ley regional?', o: ['Leyes de tránsito nacional', 'Ordenanzas sobre educación regional o protección ambiental', 'Leyes del Congreso', 'Leyes internacionales'], c: 1 },
        { levelId: 10, q: '¿Quién fiscaliza el cumplimiento de leyes regionales?', o: ['Nadie', 'Ciudadanía, órganos de control y poder judicial', 'Solo el gobernador', 'Solo el Congreso'], c: 1 },
        
        // NIVEL 11: Presupuesto Regional
        { levelId: 11, q: '¿Cómo se forma el presupuesto regional?', o: ['Lo decide solo el gobernador', 'Ingresos tributarios, canon minero, transferencias del estado', 'Dinero que pide prestado', 'Dinero de empresas'], c: 1 },
        { levelId: 11, q: '¿En qué invierte principalmente el presupuesto regional?', o: ['En gastos personales', 'Educación, salud, infraestructura, desarrollo económico', 'En entretenimiento', 'En nada'], c: 1 },
        { levelId: 11, q: '¿Quién aprueba el presupuesto regional?', o: ['El gobernador solo', 'El Consejo Regional', 'El Alcalde', 'El Presidente'], c: 1 },
        { levelId: 11, q: '¿Pueden los ciudadanos participar en decisiones del presupuesto regional?', o: ['No', 'Sí, a través de presupuesto participativo y cabildos', 'Solo los regidores', 'Solo los empresarios'], c: 1 },
        { levelId: 11, q: '¿Qué sucede si el presupuesto regional se gasta mal?', o: ['Nada', 'Puede haber investigación, sanciones y revocatoria', 'Se ignora', 'Se premia'], c: 1 },
        
        // NIVEL 12: El Congreso
        { levelId: 12, q: '¿Qué es el Congreso de la República?', o: ['Un municipio grande', 'Órgano legislativo que representa al país y hace leyes nacionales', 'Una empresa', 'Un banco'], c: 1 },
        { levelId: 12, q: '¿Cuántos congresistas hay en Perú?', o: ['50', '100', '130', '200'], c: 2 },
        { levelId: 12, q: '¿Cuál es la función principal del Congreso?', o: ['Ejecutar obras', 'Hacer leyes, fiscalizar al ejecutivo, representar al pueblo', 'Cobrar impuestos', 'Juzgar delitos'], c: 1 },
        { levelId: 12, q: '¿Cuánto dura el mandato de un congresista?', o: ['2 años', '4 años', '5 años', '6 años'], c: 1 },
        { levelId: 12, q: '¿Quién elige a los congresistas?', o: ['El Presidente', 'Los ciudadanos mediante votación', 'El Poder Judicial', 'Los gobernadores'], c: 1 },
        
        // NIVEL 13: Las Leyes
        { levelId: 13, q: '¿Cuál es el proceso para crear una ley?', o: ['El Presidente la crea solo', 'Propuesta, debate, votación en Congreso, promulgación', 'Los ciudadanos la votan', 'Se crea sin proceso'], c: 1 },
        { levelId: 13, q: '¿Quién puede proponer una ley?', o: ['Solo el Presidente', 'Congresistas, ciudadanos (iniciativa legislativa), poder ejecutivo', 'Solo los alcaldes', 'Solo los jueces'], c: 1 },
        { levelId: 13, q: '¿Qué es una ley de iniciativa legislativa?', o: ['Una ley que hace el Congreso', 'Ley propuesta por ciudadanos con firmas', 'Una ley del Presidente', 'Una ley regional'], c: 1 },
        { levelId: 13, q: '¿Quién promulga una ley?', o: ['El Congreso', 'El Presidente de la República', 'Los ciudadanos', 'Los alcaldes'], c: 1 },
        { levelId: 13, q: '¿Puede el Presidente rechazar una ley aprobada?', o: ['No, siempre se aprueba', 'Sí, mediante veto que puede ser rechazado por Congreso', 'Siempre la rechaza', 'Depende del día'], c: 1 },
        
        // NIVEL 14: Voto Informado
        { levelId: 14, q: '¿Qué es el voto informado?', o: ['Votar sin pensar', 'Votar basándose en información verificada sobre candidatos', 'Votar por amigos', 'No votar'], c: 1 },
        { levelId: 14, q: '¿Dónde puedes buscar información sobre candidatos?', o: ['Ningún lugar', 'Medios, propuestas públicas, plataformas electorales, debates', 'Solo en redes sociales', 'Solo en periódicos viejos'], c: 1 },
        { levelId: 14, q: '¿Cuál es la importancia del voto informado?', o: ['Ninguna', 'Mejora calidad de representantes y decisiones públicas', 'Solo para pasar tiempo', 'Para cobrar dinero'], c: 1 },
        { levelId: 14, q: '¿Qué debes verificar antes de votar?', o: ['Nada', 'Propuestas, experiencia, antecedentes, coherencia del candidato', 'Solo el nombre', 'Solo la edad'], c: 1 },
        { levelId: 14, q: '¿Cómo identificar información falsa sobre candidatos?', o: ['No se puede', 'Verificar fuentes, contrastar información, revisar datos oficiales', 'Creer todo lo que ves', 'Ignorar todo'], c: 1 },
        
        // NIVEL 15: Ciudadanía
        { levelId: 15, q: '¿Qué es la ciudadanía?', o: ['Solo tener DNI', 'Condición de miembro de una comunidad con derechos y deberes', 'Ser rico', 'Ser mayor de edad'], c: 1 },
        { levelId: 15, q: '¿Cuáles son los derechos fundamentales de un ciudadano?', o: ['Ninguno', 'Voto, libertad de expresión, acceso a justicia, participación', 'Solo trabajar', 'Solo pagar impuestos'], c: 1 },
        { levelId: 15, q: '¿Cuáles son los deberes de un ciudadano?', o: ['Ninguno', 'Pagar impuestos, respetar leyes, participar en defensa del país', 'Solo obedecer', 'Solo votar'], c: 1 },
        { levelId: 15, q: '¿Cómo ejerces tu ciudadanía activamente?', o: ['No se puede', 'Votando, participando, denunciando, fiscalizando, informándose', 'Solo pagando', 'Solo trabajando'], c: 1 },
        { levelId: 15, q: '¿Cuál es el propósito final de la ciudadanía?', o: ['Ninguno', 'Construir una sociedad democrática, justa y participativa', 'Solo obedecer', 'Solo enriquecerse'], c: 1 }
    ]
};

// ========== ESTADO DEL JUEGO ==========
let currentUser = null;
let currentLevel = null;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let lives = 3;
let shuffledOptions = [];

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
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        if (users[username]) {
            showError('⚠️ Este usuario ya existe');
            return;
        }

        const newUser = {
            username: username,
            password: password,
            soles: 100,
            rank: '👤 Ciudadano',
            completedLevels: [],
            createdAt: new Date().toISOString()
        };

        users[username] = newUser;
        localStorage.setItem('prepol_users', JSON.stringify(users));
        
        if (typeof db !== 'undefined' && db !== null) {
            try {
                await db.collection('users').doc(username).set(newUser);
            } catch (e) { console.log("Firebase no disponible"); }
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

        if (!userData && typeof db !== 'undefined' && db !== null) {
            try {
                const userSnap = await db.collection('users').doc(username).get();
                if (userSnap.exists()) {
                    userData = userSnap.data();
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
    
    let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
    users[currentUser.username] = currentUser;
    localStorage.setItem('prepol_users', JSON.stringify(users));

    if (typeof db !== 'undefined' && db !== null) {
        try {
            await db.collection('users').doc(currentUser.username).update({
                soles: currentUser.soles,
                rank: currentUser.rank,
                completedLevels: currentUser.completedLevels
            });
        } catch (e) { console.log("Error sincronizando"); }
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

function backToDashboard() {
    showPage('dashboardPage');
}

// ========== LÓGICA DEL JUEGO ==========

function startLevel(levelId) {
    if (levelId > 0 && !currentUser.completedLevels.includes(levelId - 1)) {
        showError('🔒 Completa el nivel anterior primero');
        return;
    }

    const quizzes = gameData.quizzes.filter(q => q.levelId === levelId);
    if (quizzes.length === 0) {
        showError('🚧 Este nivel aún no tiene preguntas disponibles');
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

    // Aleatorizar opciones
    shuffledOptions = shuffleArray(quiz.o.map((option, index) => ({ text: option, originalIndex: index })));

    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        button.onclick = () => {
            if (option.originalIndex === quiz.c) {
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
        currentUser.rank = getRankByPoints(currentUser.soles);
        
        if (!currentUser.completedLevels.includes(currentLevel.id)) {
            currentUser.completedLevels.push(currentLevel.id);
        }
        
        await saveProgress();
        updateUI();
        updateLevelStates();
        alert(`🎉 ¡Felicidades! Ganaste ${currentLevel.soles} Soles\n💰 Total: ${currentUser.soles} Soles\n🏅 Rango: ${currentUser.rank}`);
    } else {
        alert('💔 Se acabaron las vidas. ¡Inténtalo de nuevo!');
    }
    showPage('dashboardPage');
}

// Inicialización
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
