
let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        db.enablePersistence().catch(() => {});
    }
} catch (e) {}

const USE_LOCAL_STORAGE = true;
const LIVES_MAX = 3;
const LIVES_REGENERATION_TIME = 15 * 60 * 1000;

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

function getAvailableLives(user) {
    if (!user || !user.lastLivesLostTime) return LIVES_MAX;
    const now = new Date().getTime();
    const timePassed = now - user.lastLivesLostTime;
    return timePassed >= LIVES_REGENERATION_TIME ? LIVES_MAX : 0;
}

function getTimeUntilLivesRegenerate(user) {
    if (!user || !user.lastLivesLostTime) return 0;
    const now = new Date().getTime();
    const timePassed = now - user.lastLivesLostTime;
    if (timePassed >= LIVES_REGENERATION_TIME) return 0;
    return Math.ceil((LIVES_REGENERATION_TIME - timePassed) / 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

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
        { levelId: 0, q: '¿Cuál es la función principal del alcalde en una municipalidad?', o: ['Hacer leyes nacionales', 'Administrar servicios locales y representar al municipio', 'Juzgar delitos civiles', 'Controlar a la policía nacional'], c: 1 },
        { levelId: 0, q: '¿Cuánto dura el mandato de un alcalde en Perú?', o: ['2 años', '3 años', '4 años', '5 años'], c: 2 },
        { levelId: 0, q: '¿Cuál es la diferencia entre un alcalde y un regidor?', o: ['No hay diferencia', 'El alcalde es elegido por votación y el regidor es nombrado', 'El alcalde administra y el regidor es parte del consejo municipal', 'El regidor tiene más poder que el alcalde'], c: 2 },
        { levelId: 0, q: '¿Qué es el presupuesto municipal y cuál es su propósito?', o: ['Dinero personal del alcalde', 'Plan de gastos para servicios públicos del municipio', 'Dinero que presta el banco', 'Dinero privado de empresas'], c: 1 },
        { levelId: 0, q: '¿Mediante qué mecanismo puedes revocar a un alcalde?', o: ['No se puede revocar', 'Sí, con firma de ciudadanos en una petición formal', 'Solo el congreso puede hacerlo', 'Nunca se puede revocar'], c: 1 },
        { levelId: 1, q: '¿Qué es una Junta Vecinal y cuál es su rol en la comunidad?', o: ['Un partido político local', 'Una organización de vecinos que participa en decisiones comunitarias', 'Un grupo de policías comunitarios', 'Una empresa privada de servicios'], c: 1 },
        { levelId: 1, q: '¿Cuál es el objetivo principal de una Junta Vecinal?', o: ['Cobrar impuestos a los vecinos', 'Mejorar el barrio y representar intereses comunitarios', 'Vender productos a los vecinos', 'Organizar solo fiestas y eventos'], c: 1 },
        { levelId: 1, q: '¿Quién preside una Junta Vecinal y cómo es elegido?', o: ['El Alcalde la preside automáticamente', 'Un Presidente elegido por los vecinos de la junta', 'Un Regidor designado por el municipio', 'El Comisario de la zona'], c: 1 },
        { levelId: 1, q: '¿El cargo en una Junta Vecinal es remunerado?', o: ['Sí, ganan un sueldo fijo', 'No, es ad honorem (voluntario)', 'Solo los domingos se paga', 'A veces se paga'], c: 1 },
        { levelId: 1, q: '¿Quién reconoce oficialmente a una Junta Vecinal?', o: ['El Congreso de la República', 'La Municipalidad local', 'El Presidente de la República', 'La ONU'], c: 1 },
        { levelId: 2, q: '¿Cómo se determina el presupuesto municipal anualmente?', o: ['Lo decide solo el alcalde', 'Se elabora participativamente y es aprobado por el consejo municipal', 'Lo envía el gobierno central', 'Lo deciden los empresarios'], c: 1 },
        { levelId: 2, q: '¿En qué áreas se invierte principalmente el presupuesto municipal?', o: ['Solo en sueldos de empleados', 'Educación, salud, infraestructura, servicios básicos', 'Solo en obras de lujo', 'En viajes del alcalde'], c: 1 },
        { levelId: 2, q: '¿Qué es el presupuesto participativo?', o: ['Dinero que da el gobierno central', 'Proceso donde ciudadanos participan en decidir cómo se gasta parte del presupuesto', 'Dinero que piden prestado', 'Dinero que no se gasta'], c: 1 },
        { levelId: 2, q: '¿Quién fiscaliza que el presupuesto se gaste correctamente?', o: ['Solo el alcalde', 'La ciudadanía, regidores y órganos de control', 'Nadie lo fiscaliza', 'Solo el gobierno central'], c: 1 },
        { levelId: 2, q: '¿Cuál es la fuente principal de ingresos de un municipio?', o: ['Impuestos nacionales solamente', 'Impuestos locales, canon minero, transferencias del estado', 'Dinero de empresas privadas', 'Donaciones internacionales'], c: 1 },
        { levelId: 3, q: '¿Qué significa fiscalizar en el contexto municipal?', o: ['Cobrar más impuestos', 'Vigilar y controlar que se cumplan leyes y se gaste correctamente', 'Hacer auditorías privadas', 'Revisar solo gastos grandes'], c: 1 },
        { levelId: 3, q: '¿Quiénes pueden fiscalizar la gestión municipal?', o: ['Solo el alcalde', 'Ciudadanos, medios, órganos de control y sociedad civil', 'Solo el gobierno central', 'Solo los regidores'], c: 1 },
        { levelId: 3, q: '¿Qué es una auditoría municipal?', o: ['Un castigo al alcalde', 'Revisión detallada de cuentas y gastos para verificar legalidad', 'Un impuesto nuevo', 'Una reunión de vecinos'], c: 1 },
        { levelId: 3, q: '¿Cuál es el mecanismo de denuncia si encuentras corrupción?', o: ['No hay forma de denunciar', 'Puedes denunciar ante la Contraloría, Fiscalía u órganos de control', 'Solo los regidores pueden denunciar', 'Debes esperar a las elecciones'], c: 1 },
        { levelId: 3, q: '¿Qué es la Contraloría y qué función tiene?', o: ['Un banco municipal', 'Órgano que audita y fiscaliza la gestión pública', 'Una empresa privada', 'Un grupo de policías'], c: 1 },
        { levelId: 4, q: '¿Qué son las obras públicas?', o: ['Negocios privados del alcalde', 'Proyectos de infraestructura financiados con dinero público para beneficio colectivo', 'Trabajos que hacen solo los empleados municipales', 'Construcciones privadas en la ciudad'], c: 1 },
        { levelId: 4, q: '¿Cuál es el proceso para ejecutar una obra pública?', o: ['El alcalde decide y construye', 'Planificación, presupuesto, licitación, ejecución y supervisión', 'Se construye sin permiso', 'Solo se hacen si hay dinero extra'], c: 1 },
        { levelId: 4, q: '¿Qué es una licitación en obras públicas?', o: ['Un impuesto a los constructores', 'Proceso competitivo donde empresas presentan propuestas para ganar un contrato', 'Un permiso de construcción', 'Una multa por mala obra'], c: 1 },
        { levelId: 4, q: '¿Cuál es el objetivo de supervisar una obra pública?', o: ['Entretener al alcalde', 'Verificar que se cumpla con calidad, presupuesto y cronograma', 'Cobrar dinero extra', 'Nada, no es necesario'], c: 1 },
        { levelId: 4, q: '¿Quién puede denunciar una obra pública de mala calidad?', o: ['Solo los ingenieros', 'Cualquier ciudadano puede denunciar ante municipio o autoridades', 'Nadie puede denunciar', 'Solo el alcalde'], c: 1 },
        { levelId: 5, q: '¿Qué es un mecanismo de denuncia fácil?', o: ['Un castigo rápido', 'Sistema simplificado para que ciudadanos reporten problemas sin complicaciones', 'Una multa automática', 'Un permiso de construcción'], c: 1 },
        { levelId: 5, q: '¿Cuáles son ejemplos de problemas que puedes denunciar?', o: ['Solo robos', 'Baches, servicios deficientes, corrupción, obras incompletas', 'Nada se puede denunciar', 'Solo problemas de tráfico'], c: 1 },
        { levelId: 5, q: '¿Dónde puedes hacer una denuncia en tu municipio?', o: ['Solo en persona', 'Municipalidad, líneas telefónicas, plataformas online, redes sociales', 'No hay lugar para denunciar', 'Solo en la comisaría'], c: 1 },
        { levelId: 5, q: '¿Qué pasa después de hacer una denuncia?', o: ['Nada', 'Se registra, investiga y da seguimiento', 'Te multan por denunciar', 'Se ignora'], c: 1 },
        { levelId: 5, q: '¿Puedes denunciar de forma anónima?', o: ['No, siempre debes identificarte', 'Sí, muchos sistemas permiten denuncias anónimas', 'Solo si eres regidor', 'Depende del día'], c: 1 },
        { levelId: 6, q: '¿Quién es un regidor y cuál es su rol?', o: ['El alcalde', 'Representante elegido que forma parte del consejo municipal', 'Un empleado del municipio', 'Un policía'], c: 1 },
        { levelId: 6, q: '¿Cuántos regidores hay en un municipio?', o: ['Siempre 5', 'Varía según el tamaño del municipio', '1 siempre', '10 siempre'], c: 1 },
        { levelId: 6, q: '¿Cuál es la función principal del consejo municipal?', o: ['Ejecutar obras', 'Legislar localmente y fiscalizar al alcalde', 'Cobrar impuestos', 'Hacer campañas políticas'], c: 1 },
        { levelId: 6, q: '¿Pueden los regidores ser reelegidos?', o: ['No, solo un mandato', 'Sí, pueden ser reelegidos si los ciudadanos lo desean', 'Solo 2 veces', 'Nunca'], c: 1 },
        { levelId: 6, q: '¿Qué sucede si un regidor no cumple sus funciones?', o: ['Nada', 'Puede ser revocado por los ciudadanos', 'Recibe un premio', 'Sigue indefinidamente'], c: 1 },
        { levelId: 7, q: '¿Qué es la participación ciudadana?', o: ['Votar solo en elecciones', 'Involucrarse activamente en decisiones públicas y gestión municipal', 'Pagar impuestos', 'Trabajar en el municipio'], c: 1 },
        { levelId: 7, q: '¿Cuáles son formas de participación ciudadana?', o: ['Solo votar', 'Juntas vecinales, cabildos abiertos, presupuesto participativo, denuncias', 'No hay formas de participar', 'Solo firmar peticiones'], c: 1 },
        { levelId: 7, q: '¿Qué es un cabildo abierto?', o: ['Una reunión privada del alcalde', 'Asamblea pública donde ciudadanos dialogan con autoridades', 'Un evento de fiesta', 'Una votación'], c: 1 },
        { levelId: 7, q: '¿Por qué es importante la participación ciudadana?', o: ['No es importante', 'Mejora la gestión, transparencia y representa intereses de la comunidad', 'Solo para entretener', 'Para cobrar impuestos'], c: 1 },
        { levelId: 7, q: '¿Qué derechos tienes como ciudadano en tu municipio?', o: ['Ninguno', 'Acceso a información, participación, petición y fiscalización', 'Solo obedecer', 'Solo pagar'], c: 1 },
        { levelId: 8, q: '¿Qué es el GORE?', o: ['Un alcalde regional', 'Gobierno Regional que administra la región', 'Una municipalidad grande', 'Un banco'], c: 1 },
        { levelId: 8, q: '¿Quién lidera el GORE?', o: ['El Presidente de la República', 'El Gobernador Regional elegido por votación', 'El Alcalde', 'El Congresista'], c: 1 },
        { levelId: 8, q: '¿Cuál es la diferencia entre municipio y región?', o: ['No hay diferencia', 'Municipio es local, región agrupa varios municipios', 'Región es más pequeña', 'Son lo mismo'], c: 1 },
        { levelId: 8, q: '¿Qué responsabilidades tiene el GORE?', o: ['Ninguna', 'Educación, salud, infraestructura regional, desarrollo económico', 'Solo hacer leyes nacionales', 'Solo recolectar impuestos'], c: 1 },
        { levelId: 8, q: '¿Cuánto dura el mandato de un gobernador regional?', o: ['2 años', '4 años', '5 años', '6 años'], c: 1 },
        { levelId: 9, q: '¿Qué es el canon minero?', o: ['Un impuesto a los mineros', 'Porcentaje de ingresos de actividad minera que va a gobiernos locales', 'Una mina del gobierno', 'Un permiso de minería'], c: 1 },
        { levelId: 9, q: '¿A quiénes beneficia el canon minero?', o: ['Solo a la empresa minera', 'Gobiernos regionales y municipales de zonas mineras', 'Solo al gobierno central', 'A ninguno'], c: 1 },
        { levelId: 9, q: '¿En qué deben invertir el canon minero los gobiernos?', o: ['En gastos personales', 'En educación, salud, infraestructura y desarrollo', 'En viajes', 'En nada específico'], c: 1 },
        { levelId: 9, q: '¿Cuál es el porcentaje del canon minero?', o: ['1%', '5%', 'Varía según el mineral y acuerdos', '50%'], c: 2 },
        { levelId: 9, q: '¿Qué problema puede ocurrir con el canon minero?', o: ['Nada', 'Mal uso, corrupción o falta de planificación en su inversión', 'Que no haya minería', 'Que sea muy poco'], c: 1 },
        { levelId: 10, q: '¿Qué son las leyes regionales?', o: ['Leyes nacionales', 'Normas que emite el GORE para regular la región', 'Leyes internacionales', 'Leyes municipales'], c: 1 },
        { levelId: 10, q: '¿Quién aprueba las leyes regionales?', o: ['El Presidente', 'El Consejo Regional', 'El Alcalde', 'El Congreso'], c: 1 },
        { levelId: 10, q: '¿Pueden las leyes regionales contradecir leyes nacionales?', o: ['Sí, siempre', 'No, deben estar en concordancia con leyes nacionales', 'A veces', 'Depende del gobernador'], c: 1 },
        { levelId: 10, q: '¿Cuál es un ejemplo de ley regional?', o: ['Leyes de tránsito nacional', 'Ordenanzas sobre educación regional o protección ambiental', 'Leyes del Congreso', 'Leyes de la ONU'], c: 1 },
        { levelId: 10, q: '¿Dónde se publican las leyes regionales?', o: ['En Facebook', 'En el diario oficial El Peruano y portales regionales', 'No se publican', 'En la televisión'], c: 1 },
        { levelId: 11, q: '¿Qué es el presupuesto regional?', o: ['Dinero del gobernador', 'Plan de gastos anual de la región para obras y servicios', 'Dinero de las empresas', 'Un préstamo bancario'], c: 1 },
        { levelId: 11, q: '¿Quién aprueba el presupuesto regional?', o: ['El Alcalde', 'El Consejo Regional', 'El Presidente', 'El Congreso'], c: 1 },
        { levelId: 11, q: '¿Qué pasa si no se gasta todo el presupuesto regional?', o: ['Se lo queda el gobernador', 'Regresa al estado o se reprograma para el siguiente año', 'Se pierde para siempre', 'Se reparte entre vecinos'], c: 1 },
        { levelId: 11, q: '¿Cuál es la prioridad en el presupuesto regional?', o: ['Gastos de lujo', 'Salud, educación, infraestructura y desarrollo social', 'Viajes al extranjero', 'Publicidad política'], c: 1 },
        { levelId: 11, q: '¿Cómo puede el ciudadano vigilar el presupuesto regional?', o: ['No puede', 'A través de portales de transparencia y consejos de participación', 'Solo por noticias', 'Esperando a las elecciones'], c: 1 },
        { levelId: 12, q: '¿Qué es el Congreso de la República?', o: ['Un grupo de jueces', 'Órgano que representa a la nación y hace las leyes', 'El despacho del presidente', 'Una empresa pública'], c: 1 },
        { levelId: 12, q: '¿Cuántos congresistas hay en Perú?', o: ['100', '120', '130', '150'], c: 2 },
        { levelId: 12, q: '¿Cuál es la función de fiscalización del Congreso?', o: ['Cobrar impuestos', 'Controlar y vigilar los actos del gobierno y autoridades', 'Hacer obras públicas', 'Nombrar alcaldes'], c: 1 },
        { levelId: 12, q: '¿Cuánto dura el periodo de un congresista?', o: ['4 años', '5 años', '6 años', '3 años'], c: 1 },
        { levelId: 12, q: '¿Cómo se eligen los congresistas?', o: ['Por el Presidente', 'Por voto popular en elecciones generales', 'Por sorteo', 'Por el Alcalde'], c: 1 },
        { levelId: 13, q: '¿Qué es una ley?', o: ['Un consejo', 'Norma obligatoria establecida por la autoridad para regular la convivencia', 'Una opinión del presidente', 'Un deseo ciudadano'], c: 1 },
        { levelId: 13, q: '¿Cuál es el proceso para que una ley exista?', o: ['El presidente la escribe solo', 'Iniciativa, debate en comisiones, aprobación en pleno y promulgación', 'Se vota en Facebook', 'Solo se publica'], c: 1 },
        { levelId: 13, q: '¿Quién promulga las leyes en Perú?', o: ['El Alcalde', 'El Presidente de la República', 'El Juez', 'El Comisario'], c: 1 },
        { levelId: 13, q: '¿Qué es la Constitución Política?', o: ['Un libro de historia', 'La ley fundamental de un estado que define derechos y deberes', 'Un manual de funciones', 'Un contrato privado'], c: 1 },
        { levelId: 13, q: '¿Qué pasa si una ley va en contra de la Constitución?', o: ['No pasa nada', 'Es declarada inconstitucional y pierde validez', 'Se cambia la constitución', 'Se ignora la constitución'], c: 1 },
        { levelId: 14, q: '¿Qué es el voto informado?', o: ['Votar por el más famoso', 'Votar conociendo propuestas, candidatos y sus antecedentes', 'Votar por quien te regala cosas', 'Votar en blanco siempre'], c: 1 },
        { levelId: 14, q: '¿Dónde puedes encontrar información sobre los candidatos?', o: ['Solo en volantes', 'Portal del JNE (Voto Informado), planes de gobierno y noticias serias', 'En chismes de redes sociales', 'Preguntando a amigos'], c: 1 },
        { levelId: 14, q: '¿Por qué es importante leer el plan de gobierno?', o: ['Para saber qué promesas se cumplirán y cómo se harán', 'No es importante', 'Para ver las fotos', 'Para ver el logo'], c: 0 },
        { levelId: 14, q: '¿Qué es una tacha a un candidato?', o: ['Un premio', 'Cuestionamiento legal para impedir que un candidato postule por no cumplir requisitos', 'Una multa', 'Un aplauso'], c: 1 },
        { levelId: 14, q: '¿Cuál es la consecuencia de un voto no informado?', o: ['Ninguna', 'Elegir autoridades no aptas que pueden afectar el desarrollo del país', 'Que gane tu favorito', 'Que se repitan las elecciones'], c: 1 },
        { levelId: 15, q: '¿Qué significa ser ciudadano?', o: ['Solo vivir en un lugar', 'Tener derechos y deberes en una comunidad política organizada', 'Tener DNI solamente', 'Saber hablar español'], c: 1 },
        { levelId: 15, q: '¿A qué edad se adquiere la ciudadanía plena en Perú?', o: ['16 años', '18 años', '21 años', '15 años'], c: 1 },
        { levelId: 15, q: '¿Cuál es un deber ciudadano fundamental?', o: ['No trabajar', 'Respetar leyes, pagar impuestos y participar en la vida pública', 'Solo viajar', 'Solo estudiar'], c: 1 },
        { levelId: 15, q: '¿Qué es la ética pública?', o: ['Hacer lo que uno quiera', 'Actuar con honestidad y transparencia en el servicio a la comunidad', 'Cobrar por todo', 'Ser famoso'], c: 1 },
        { levelId: 15, q: '¿Cómo puedes ejercer tu ciudadanía a diario?', o: ['No haciendo nada', 'Respetando normas, cuidando espacios públicos y participando activamente', 'Solo durmiendo', 'Solo comprando cosas'], c: 1 }
    ]
};

let currentUser = null;
let currentLevel = null;
let currentLevelQuizzes = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let lives = 3;
let shuffledOptions = [];
let livesUpdateInterval = null;

async function registerUser() {
    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;

    if (!username || !password) {
        showError('📋 Completa todos los campos');
        return;
    }
    if (password.length < 4) {
        showError('🔐 La contraseña debe tener al menos 4 caracteres');
        return;
    }
    if (password !== confirmPass) {
        showError('❌ Las contraseñas no coinciden');
        return;
    }

    try {
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        
        if (db) {
            try {
                const userSnap = await db.collection('users').doc(username).get();
                if (userSnap.exists()) {
                    showError('⚠️ Este usuario ya existe');
                    return;
                }
            } catch (e) {}
        }

        if (users[username]) {
            showError('⚠️ Este usuario ya existe');
            return;
        }

        const newUser = {
            username, password, soles: 100, rank: '👤 Ciudadano',
            completedLevels: [], availableLives: LIVES_MAX,
            lastLivesLostTime: null, createdAt: new Date().toISOString()
        };

        users[username] = newUser;
        localStorage.setItem('prepol_users', JSON.stringify(users));
        
        if (db) {
            db.collection('users').doc(username).set(newUser).catch(() => {});
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

        if (db) {
            try {
                const userSnap = await db.collection('users').doc(username).get();
                if (userSnap.exists()) {
                    userData = userSnap.data();
                    users[username] = userData;
                    localStorage.setItem('prepol_users', JSON.stringify(users));
                }
            } catch (e) {}
        }

        if (!userData || userData.password !== password) {
            showError(userData ? '🔐 Contraseña incorrecta' : '👤 Usuario no encontrado');
            return;
        }

        showError('✅ ¡Bienvenido!', 'success');
        currentUser = userData;
        localStorage.setItem('currentUser', username);
        
        setTimeout(() => {
            updateUI();
            updateLevelStates();
            showPage('dashboardPage');
            startLivesUpdateInterval();
        }, 500);
    } catch (error) {
        showError('❌ Error al iniciar sesión');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    if (livesUpdateInterval) clearInterval(livesUpdateInterval);
    showPage('loginPage');
}

async function deleteAccount() {
    if (!currentUser) return;
    if (!confirm("¿Borrar cuenta permanentemente?")) return;

    const username = currentUser.username;
    try {
        if (db) db.collection('users').doc(username).delete().catch(() => {});
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        delete users[username];
        localStorage.setItem('prepol_users', JSON.stringify(users));
        logout();
    } catch (error) {}
}

function updateUI() {
    if (!currentUser) return;
    const elements = {
        'usernameDisplay': currentUser.username,
        'solesDisplay': currentUser.soles,
        'rankDisplay': currentUser.rank,
        'perfilUsername': currentUser.username,
        'perfilSoles': currentUser.soles,
        'perfilRank': currentUser.rank,
        'perfilLevels': currentUser.completedLevels.length
    };
    
    for (const [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }
    
    const availableLives = getAvailableLives(currentUser);
    const livesEl = document.getElementById('livesAvailableDisplay');
    if (livesEl) livesEl.textContent = availableLives;

    const timerContainer = document.getElementById('livesTimerContainer');
    if (timerContainer) {
        if (availableLives === 0) {
            timerContainer.style.display = 'block';
            const timeRemaining = getTimeUntilLivesRegenerate(currentUser);
            const countdownEl = document.getElementById('livesCountdown');
            if (countdownEl) countdownEl.textContent = formatTime(timeRemaining);
        } else {
            timerContainer.style.display = 'none';
        }
    }
}

function updateLevelStates() {
    if (!currentUser) return;
    const availableLives = getAvailableLives(currentUser);
    
    gameData.levels.forEach((level, i) => {
        const levelCard = document.getElementById(`nivel-${i}`);
        if (!levelCard) return;

        if (availableLives === 0) {
            levelCard.classList.add('locked');
            levelCard.style.opacity = '0.5';
            levelCard.style.cursor = 'not-allowed';
            return;
        }

        levelCard.style.opacity = '1';
        levelCard.style.cursor = 'pointer';

        if (i === 0 || currentUser.completedLevels.includes(i - 1)) {
            levelCard.classList.remove('locked');
        } else {
            levelCard.classList.add('locked');
        }

        if (currentUser.completedLevels.includes(i)) {
            levelCard.classList.add('completed');
        } else {
            levelCard.classList.remove('completed');
        }
    });
}

async function saveProgress() {
    if (!currentUser) return;
    let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
    users[currentUser.username] = currentUser;
    localStorage.setItem('prepol_users', JSON.stringify(users));

    if (db) {
        db.collection('users').doc(currentUser.username).set({
            ...currentUser,
            lastUpdated: new Date().toISOString()
        }, { merge: true }).catch(() => {});
    }
}

function startLivesUpdateInterval() {
    if (livesUpdateInterval) clearInterval(livesUpdateInterval);
    livesUpdateInterval = setInterval(() => {
        if (currentUser) {
            const availableLives = getAvailableLives(currentUser);
            const timeRemaining = getTimeUntilLivesRegenerate(currentUser);
            
            if (timeRemaining === 0 && currentUser.availableLives === 0) {
                currentUser.availableLives = LIVES_MAX;
                currentUser.lastLivesLostTime = null;
                saveProgress();
                updateUI();
                updateLevelStates();
            } else if (availableLives === 0) {
                const countdownEl = document.getElementById('livesCountdown');
                if (countdownEl) countdownEl.textContent = formatTime(timeRemaining);
            }
        }
    }, 1000);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    const target = document.getElementById(pageId);
    if (target) target.style.display = 'block';
}

function showError(message, type = 'error') {
    const errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.className = 'error-message ' + (type === 'success' ? 'success' : '');
    setTimeout(() => errorDiv.style.display = 'none', 4000);
}

function backToDashboard() {
    showPage('dashboardPage');
}

function startLevel(levelId) {
    const availableLives = getAvailableLives(currentUser);
    if (availableLives === 0) {
        showError(`❌ No tienes vidas disponibles.`);
        return;
    }

    if (levelId > 0 && !currentUser.completedLevels.includes(levelId - 1)) {
        showError('🔒 Completa el nivel anterior primero');
        return;
    }

    const quizzes = gameData.quizzes.filter(q => q.levelId === levelId);
    if (quizzes.length === 0) return;

    currentLevel = gameData.levels[levelId];
    currentLevelQuizzes = shuffleArray([...quizzes]);
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
    if (correctAnswers >= 5) {
        finishLevel(true);
        return;
    }

    const quiz = currentLevelQuizzes[currentQuestionIndex];
    document.getElementById('questionText').textContent = quiz.q;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    shuffledOptions = shuffleArray(quiz.o.map((option, index) => ({ text: option, originalIndex: index })));

    shuffledOptions.forEach((option) => {
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
                if (lives <= 0) {
                    finishLevel(false);
                } else {
                    const failedQuiz = currentLevelQuizzes.splice(currentQuestionIndex, 1)[0];
                    currentLevelQuizzes.push(failedQuiz);
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
        alert(`🎉 ¡Ganaste ${currentLevel.soles} Soles!`);
    } else {
        currentUser.availableLives = 0;
        currentUser.lastLivesLostTime = new Date().getTime();
        await saveProgress();
        updateUI();
        updateLevelStates();
        alert(`💔 Se acabaron las vidas.`);
    }
    showPage('dashboardPage');
}

window.onload = async () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        let users = JSON.parse(localStorage.getItem('prepol_users') || '{}');
        currentUser = users[savedUser];

        if (db) {
            try {
                const userSnap = await db.collection('users').doc(savedUser).get();
                if (userSnap.exists()) {
                    currentUser = userSnap.data();
                    users[savedUser] = currentUser;
                    localStorage.setItem('prepol_users', JSON.stringify(users));
                }
            } catch (e) {}
        }

        if (currentUser) {
            updateUI();
            updateLevelStates();
            showPage('dashboardPage');
            startLivesUpdateInterval();
        }
    }
};
