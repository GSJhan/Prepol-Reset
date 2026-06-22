import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, levels, quizzes } from "../drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Sembrando datos iniciales...");

  // Distritos
  const districtData = [
    {
      districtNumber: 1,
      name: "Mi Barrio",
      description: "Aprende cómo funciona tu junta vecinal y qué hace el alcalde",
      rankUnlocked: "Vecino Alerta",
    },
    {
      districtNumber: 2,
      name: "Mi Distrito",
      description: "Entiende cómo se aprueban obras públicas y cómo denunciar",
      rankUnlocked: "Fiscalizador Jr.",
    },
    {
      districtNumber: 3,
      name: "Mi Región",
      description: "Descubre el Gobierno Regional y el canon minero",
      rankUnlocked: "Gobernador de Barrio",
    },
    {
      districtNumber: 4,
      name: "Mi País",
      description: "Aprende sobre el Congreso, las leyes y cómo votar bien",
      rankUnlocked: "Ciudadano Reset",
    },
  ];

  for (const district of districtData) {
    await db.insert(districts).values(district);
  }
  console.log("✓ Distritos creados");

  // Niveles por distrito
  const levelData = [
    // Distrito 1: Mi Barrio
    {
      districtId: 1,
      levelNumber: 1,
      title: "El Municipio",
      description: "Conoce la estructura municipal y funciones del alcalde",
      vigilanteCaseIntro:
        "El alcalde dice que no hay plata para agua pero inauguró un mirador. ¿Eso se puede?",
      dataUnlock: "Los regidores pueden pedir la vacancia del alcalde si no hace su chamba",
    },
    {
      districtId: 1,
      levelNumber: 2,
      title: "La Junta Vecinal",
      description: "Aprende qué es y cómo funciona una junta vecinal",
      vigilanteCaseIntro:
        "Tu junta vecinal quiere hacer una obra pero el municipio dice que no. ¿Qué pueden hacer?",
      dataUnlock: "Las juntas vecinales tienen poder para fiscalizar gastos municipales",
    },
    {
      districtId: 1,
      levelNumber: 3,
      title: "¿A dónde va la plata?",
      description: "Entiende el presupuesto municipal y dónde se gasta",
      vigilanteCaseIntro:
        "El presupuesto de tu municipio es de 100 millones. ¿Sabes en qué se gasta?",
      dataUnlock: "Todo presupuesto público debe ser publicado y es accesible para ciudadanos",
    },
    // Distrito 2: Mi Distrito
    {
      districtId: 2,
      levelNumber: 1,
      title: "Obras Públicas",
      description: "Aprende cómo se aprueban y fiscalizan las obras públicas",
      vigilanteCaseIntro:
        "Una obra pública lleva 5 años sin terminar. ¿Quién es responsable?",
      dataUnlock: "La Contraloría puede auditar cualquier obra pública",
    },
    {
      districtId: 2,
      levelNumber: 2,
      title: "Denuncia Fácil",
      description: "Conoce cómo denunciar corrupción y malas prácticas",
      vigilanteCaseIntro:
        "Ves que un funcionario se lleva materiales de una obra. ¿A quién denuncias?",
      dataUnlock: "Existen líneas de denuncia anónimas en la Contraloría y la OSCE",
    },
    {
      districtId: 2,
      levelNumber: 3,
      title: "El Regidor te defiende",
      description: "Entiende el rol de los regidores en la fiscalización",
      vigilanteCaseIntro:
        "Tu regidor quiere investigar un gasto sospechoso. ¿Tiene poder para hacerlo?",
      dataUnlock: "Los regidores forman comisiones de fiscalización en el municipio",
    },
    // Distrito 3: Mi Región
    {
      districtId: 3,
      levelNumber: 1,
      title: "El GORE Ayacucho",
      description: "Aprende sobre el Gobierno Regional y sus funciones",
      vigilanteCaseIntro:
        "El gobernador regional quiere hacer una carretera. ¿Quién aprueba?",
      dataUnlock: "El GORE tiene competencias en educación, salud y vías",
    },
    {
      districtId: 3,
      levelNumber: 2,
      title: "El Canon",
      description: "Entiende qué es el canon minero y cómo se distribuye",
      vigilanteCaseIntro:
        "Una mina genera millones. ¿A quién le corresponde ese dinero?",
      dataUnlock: "El canon minero se distribuye entre gobiernos locales y regionales",
    },
    {
      districtId: 3,
      levelNumber: 3,
      title: "Leyes Regionales",
      description: "Conoce cómo se hacen las ordenanzas regionales",
      vigilanteCaseIntro:
        "El GORE quiere cambiar una ley regional. ¿Quién tiene que votar?",
      dataUnlock: "El Consejo Regional vota las ordenanzas propuestas por el gobernador",
    },
    // Distrito 4: Mi País
    {
      districtId: 4,
      levelNumber: 1,
      title: "El Congreso",
      description: "Aprende cómo funciona el Congreso de la República",
      vigilanteCaseIntro:
        "El Congreso tiene 130 diputados. ¿Quién controla a quién?",
      dataUnlock: "El Congreso es el poder legislativo y aprueba todas las leyes",
    },
    {
      districtId: 4,
      levelNumber: 2,
      title: "Las Leyes",
      description: "Entiende cómo se hacen, debaten y aprueban las leyes",
      vigilanteCaseIntro:
        "Un diputado quiere hacer una ley sobre educación. ¿Cuántos pasos tiene?",
      dataUnlock: "Una ley pasa por 3 lecturas en el Congreso antes de aprobarse",
    },
    {
      districtId: 4,
      levelNumber: 3,
      title: "Voto Informado",
      description: "Aprende cómo votar bien y elegir representantes responsables",
      vigilanteCaseIntro:
        "Es tiempo de elecciones. ¿Cómo sabes si un candidato es confiable?",
      dataUnlock: "Investigar el historial de un candidato es clave para votar bien",
    },
  ];

  for (const level of levelData) {
    await db.insert(levels).values(level);
  }
  console.log("✓ Niveles creados");

  // Quizzes (5 por nivel = 60 total)
  const quizzesData = [
    // Nivel 1.1: El Municipio
    {
      levelId: 1,
      questionNumber: 1,
      question: "¿Cuál es la función principal del alcalde?",
      optionA: "Hacer leyes nacionales",
      optionB: "Administrar el municipio y ejecutar el presupuesto",
      optionC: "Controlar la policía nacional",
      optionD: "Representar al presidente",
      correctAnswer: "B",
      explanation:
        "El alcalde es el ejecutivo municipal y administra los recursos y servicios del municipio.",
    },
    {
      levelId: 1,
      questionNumber: 2,
      question: "¿Cuántos regidores hay en un municipio?",
      optionA: "Siempre 5",
      optionB: "Depende del tamaño del municipio",
      optionC: "Siempre 10",
      optionD: "Depende del gobernador",
      correctAnswer: "B",
      explanation:
        "El número de regidores varía según la población del municipio. Municipios grandes tienen más regidores.",
    },
    {
      levelId: 1,
      questionNumber: 3,
      question: "¿Qué es un regidor?",
      optionA: "Un policía municipal",
      optionB: "Un funcionario que vota leyes municipales",
      optionC: "Un trabajador de limpieza",
      optionD: "Un juez local",
      correctAnswer: "B",
      explanation:
        "Los regidores son representantes elegidos que conforman el Concejo Municipal y votan ordenanzas.",
    },
    {
      levelId: 1,
      questionNumber: 4,
      question: "¿Quién fiscaliza al alcalde?",
      optionA: "El presidente",
      optionB: "El gobernador regional",
      optionC: "El Concejo Municipal",
      optionD: "La policía",
      correctAnswer: "C",
      explanation:
        "El Concejo Municipal, conformado por regidores, fiscaliza al alcalde y puede pedir su vacancia.",
    },
    {
      levelId: 1,
      questionNumber: 5,
      question: "¿Cuál es el período de un alcalde?",
      optionA: "1 año",
      optionB: "2 años",
      optionC: "4 años",
      optionD: "6 años",
      correctAnswer: "C",
      explanation: "Los alcaldes son elegidos por 4 años y pueden ser reelegidos una sola vez.",
    },
    // Nivel 1.2: La Junta Vecinal
    {
      levelId: 2,
      questionNumber: 1,
      question: "¿Qué es una junta vecinal?",
      optionA: "Una reunión de amigos",
      optionB: "Una organización de vecinos para gestionar problemas del barrio",
      optionC: "Un grupo de vigilancia privada",
      optionD: "Una empresa de servicios",
      correctAnswer: "B",
      explanation:
        "Las juntas vecinales son organizaciones de vecinos que trabajan por el bienestar del barrio.",
    },
    {
      levelId: 2,
      questionNumber: 2,
      question: "¿Quién puede ser presidente de una junta vecinal?",
      optionA: "Solo el alcalde",
      optionB: "Un vecino elegido por la junta",
      optionC: "Un funcionario municipal",
      optionD: "El gobernador",
      correctAnswer: "B",
      explanation:
        "Los vecinos eligen democráticamente a su presidente de junta en una asamblea.",
    },
    {
      levelId: 2,
      questionNumber: 3,
      question: "¿Cuál es un poder de la junta vecinal?",
      optionA: "Hacer leyes nacionales",
      optionB: "Fiscalizar gastos municipales y proponer obras",
      optionC: "Contratar policías",
      optionD: "Cambiar impuestos",
      correctAnswer: "B",
      explanation:
        "Las juntas vecinales pueden fiscalizar gastos y proponer proyectos al municipio.",
    },
    {
      levelId: 2,
      questionNumber: 4,
      question: "¿Qué hace una junta vecinal si ve corrupción?",
      optionA: "Nada, no tiene poder",
      optionB: "Puede denunciar a la Contraloría",
      optionC: "Solo protestar",
      optionD: "Llamar a la policía",
      correctAnswer: "B",
      explanation:
        "Las juntas vecinales tienen derecho a denunciar irregularidades ante la Contraloría.",
    },
    {
      levelId: 2,
      questionNumber: 5,
      question: "¿Cuántos vecinos se necesitan para formar una junta?",
      optionA: "Mínimo 5",
      optionB: "Mínimo 10",
      optionC: "Mínimo 20",
      optionD: "No hay mínimo",
      correctAnswer: "A",
      explanation: "Se necesita un mínimo de 5 vecinos para constituir una junta vecinal.",
    },
    // Nivel 1.3: ¿A dónde va la plata?
    {
      levelId: 3,
      questionNumber: 1,
      question: "¿Qué es el presupuesto municipal?",
      optionA: "El dinero que gasta el alcalde en su casa",
      optionB: "El plan de ingresos y gastos del municipio",
      optionC: "El dinero que pagan los impuestos",
      optionD: "Solo para emergencias",
      correctAnswer: "B",
      explanation:
        "El presupuesto es el plan anual que detalla ingresos y gastos del municipio.",
    },
    {
      levelId: 3,
      questionNumber: 2,
      question: "¿De dónde obtiene dinero el municipio?",
      optionA: "Solo de impuestos",
      optionB: "Del gobierno nacional y canon",
      optionC: "Impuestos, canon, regalías y transferencias del estado",
      optionD: "Solo de préstamos",
      correctAnswer: "C",
      explanation:
        "Los municipios reciben dinero de impuestos locales, canon, regalías y transferencias estatales.",
    },
    {
      levelId: 3,
      questionNumber: 3,
      question: "¿Quién aprueba el presupuesto municipal?",
      optionA: "El alcalde solo",
      optionB: "El Concejo Municipal",
      optionC: "El gobernador",
      optionD: "Los vecinos",
      correctAnswer: "B",
      explanation:
        "El Concejo Municipal vota y aprueba el presupuesto propuesto por el alcalde.",
    },
    {
      levelId: 3,
      questionNumber: 4,
      question: "¿Es público el presupuesto municipal?",
      optionA: "No, es secreto",
      optionB: "Solo para funcionarios",
      optionC: "Sí, todo ciudadano puede verlo",
      optionD: "Solo en elecciones",
      correctAnswer: "C",
      explanation:
        "El presupuesto público es accesible para todos los ciudadanos por ley de transparencia.",
    },
    {
      levelId: 3,
      questionNumber: 5,
      question: "¿Qué pasa si el alcalde gasta dinero no presupuestado?",
      optionA: "Nada, es su dinero",
      optionB: "Es ilegal y puede ser denunciado",
      optionC: "Solo si es para emergencias",
      optionD: "El Concejo lo aprueba después",
      correctAnswer: "B",
      explanation:
        "Gastar dinero no presupuestado es irregular y puede ser denunciado a la Contraloría.",
    },
    // Nivel 2.1: Obras Públicas
    {
      levelId: 4,
      questionNumber: 1,
      question: "¿Qué es una obra pública?",
      optionA: "Una construcción privada",
      optionB: "Un proyecto financiado con dinero público para beneficio de la comunidad",
      optionC: "Una obra de arte",
      optionD: "Solo carreteras",
      correctAnswer: "B",
      explanation:
        "Las obras públicas son proyectos financiados con dinero público para beneficio colectivo.",
    },
    {
      levelId: 4,
      questionNumber: 2,
      question: "¿Quién aprueba una obra pública?",
      optionA: "El alcalde solo",
      optionB: "El Concejo Municipal",
      optionC: "Los vecinos",
      optionD: "El gobernador",
      correctAnswer: "B",
      explanation:
        "El Concejo Municipal aprueba las obras públicas propuestas por el alcalde.",
    },
    {
      levelId: 4,
      questionNumber: 3,
      question: "¿Quién fiscaliza las obras públicas?",
      optionA: "Nadie",
      optionB: "Solo el alcalde",
      optionC: "La Contraloría y supervisores",
      optionD: "El constructor",
      correctAnswer: "C",
      explanation:
        "La Contraloría y supervisores especializados fiscalizan que las obras cumplan estándares.",
    },
    {
      levelId: 4,
      questionNumber: 4,
      question: "¿Qué es la OSCE?",
      optionA: "Una empresa constructora",
      optionB: "Organismo que supervisa contrataciones públicas",
      optionC: "Un banco",
      optionD: "Una ONG",
      correctAnswer: "B",
      explanation:
        "La OSCE supervisa que las contrataciones públicas sean transparentes y competitivas.",
    },
    {
      levelId: 4,
      questionNumber: 5,
      question: "¿Qué pasa si una obra no cumple estándares?",
      optionA: "Se acepta igual",
      optionB: "Se rechaza y el constructor debe corregir",
      optionC: "Se paga igual",
      optionD: "Se ignora",
      correctAnswer: "B",
      explanation:
        "Las obras que no cumplen estándares deben ser corregidas antes de ser aceptadas.",
    },
    // Nivel 2.2: Denuncia Fácil
    {
      levelId: 5,
      questionNumber: 1,
      question: "¿Dónde puedo denunciar corrupción?",
      optionA: "Solo al alcalde",
      optionB: "A la Contraloría o línea de denuncia",
      optionC: "A mis amigos",
      optionD: "En redes sociales",
      correctAnswer: "B",
      explanation:
        "La Contraloría y líneas de denuncia anónimas son los canales oficiales para denuncias.",
    },
    {
      levelId: 5,
      questionNumber: 2,
      question: "¿Puedo denunciar de forma anónima?",
      optionA: "No, siempre debo dar mi nombre",
      optionB: "Sí, existen líneas anónimas",
      optionC: "Solo si tengo pruebas",
      optionD: "No, es ilegal",
      correctAnswer: "B",
      explanation:
        "Existen líneas de denuncia anónimas para proteger a los denunciantes.",
    },
    {
      levelId: 5,
      questionNumber: 3,
      question: "¿Qué debo hacer antes de denunciar?",
      optionA: "Nada, denunciar de una vez",
      optionB: "Reunir pruebas o evidencia",
      optionC: "Avisar al alcalde",
      optionD: "Esperar a que otros denuncien",
      correctAnswer: "B",
      explanation:
        "Es importante tener pruebas o evidencia antes de hacer una denuncia formal.",
    },
    {
      levelId: 5,
      questionNumber: 4,
      question: "¿Qué es la Contraloría?",
      optionA: "Un banco",
      optionB: "El órgano que fiscaliza el gasto público",
      optionC: "Una empresa privada",
      optionD: "Un tribunal",
      correctAnswer: "B",
      explanation:
        "La Contraloría es el órgano autónomo que fiscaliza el gasto público en todo el país.",
    },
    {
      levelId: 5,
      questionNumber: 5,
      question: "¿Puedo ser perseguido por denunciar?",
      optionA: "Sí, siempre",
      optionB: "No, hay protección legal para denunciantes",
      optionC: "Depende del alcalde",
      optionD: "Solo si miento",
      correctAnswer: "B",
      explanation:
        "La ley protege a los denunciantes de represalias y persecución.",
    },
    // Nivel 2.3: El Regidor te defiende
    {
      levelId: 6,
      questionNumber: 1,
      question: "¿Cuál es el rol de un regidor?",
      optionA: "Ejecutar obras",
      optionB: "Legislar y fiscalizar en el Concejo Municipal",
      optionC: "Trabajar solo para el alcalde",
      optionD: "Recolectar impuestos",
      correctAnswer: "B",
      explanation:
        "Los regidores legislan ordenanzas y fiscalizan al alcalde en el Concejo.",
    },
    {
      levelId: 6,
      questionNumber: 2,
      question: "¿Puede un regidor investigar gastos sospechosos?",
      optionA: "No, solo el alcalde",
      optionB: "Sí, a través de comisiones de fiscalización",
      optionC: "Solo con permiso del gobernador",
      optionD: "No, es peligroso",
      correctAnswer: "B",
      explanation:
        "Los regidores forman comisiones de fiscalización para investigar irregularidades.",
    },
    {
      levelId: 6,
      questionNumber: 3,
      question: "¿Qué es una comisión de fiscalización?",
      optionA: "Un grupo de policías",
      optionB: "Un grupo de regidores que investiga gastos públicos",
      optionC: "Un tribunal",
      optionD: "Una empresa auditora",
      correctAnswer: "B",
      explanation:
        "Las comisiones de fiscalización son grupos de regidores que investigan gastos e irregularidades.",
    },
    {
      levelId: 6,
      questionNumber: 4,
      question: "¿Puede un regidor proponer leyes?",
      optionA: "No, solo el alcalde",
      optionB: "Sí, en el Concejo Municipal",
      optionC: "Solo en elecciones",
      optionD: "No, es prohibido",
      correctAnswer: "B",
      explanation:
        "Los regidores pueden proponer ordenanzas que se debaten y votan en el Concejo.",
    },
    {
      levelId: 6,
      questionNumber: 5,
      question: "¿Quién elige a los regidores?",
      optionA: "El alcalde",
      optionB: "El gobernador",
      optionC: "Los ciudadanos en elecciones",
      optionD: "El presidente",
      correctAnswer: "C",
      explanation:
        "Los ciudadanos eligen a los regidores mediante sufragio en elecciones municipales.",
    },
    // Nivel 3.1: El GORE Ayacucho
    {
      levelId: 7,
      questionNumber: 1,
      question: "¿Qué es el GORE?",
      optionA: "Un municipio grande",
      optionB: "El Gobierno Regional",
      optionC: "Un banco",
      optionD: "Una empresa",
      correctAnswer: "B",
      explanation:
        "El GORE es el Gobierno Regional que administra una región del país.",
    },
    {
      levelId: 7,
      questionNumber: 2,
      question: "¿Cuáles son competencias del GORE?",
      optionA: "Solo carreteras",
      optionB: "Educación, salud, vías y desarrollo",
      optionC: "Solo leyes nacionales",
      optionD: "Solo impuestos",
      correctAnswer: "B",
      explanation:
        "El GORE tiene competencias en educación, salud, infraestructura vial y desarrollo regional.",
    },
    {
      levelId: 7,
      questionNumber: 3,
      question: "¿Quién es el gobernador regional?",
      optionA: "El alcalde de la capital",
      optionB: "El ejecutivo elegido de la región",
      optionC: "El presidente",
      optionD: "El prefecto",
      correctAnswer: "B",
      explanation:
        "El gobernador regional es el ejecutivo elegido democráticamente por los ciudadanos.",
    },
    {
      levelId: 7,
      questionNumber: 4,
      question: "¿Cuál es el período de un gobernador regional?",
      optionA: "1 año",
      optionB: "2 años",
      optionC: "4 años",
      optionD: "6 años",
      correctAnswer: "C",
      explanation:
        "Los gobernadores regionales son elegidos por 4 años y pueden ser reelegidos una vez.",
    },
    {
      levelId: 7,
      questionNumber: 5,
      question: "¿Quién fiscaliza al gobernador regional?",
      optionA: "El presidente",
      optionB: "El Consejo Regional",
      optionC: "El alcalde",
      optionD: "Nadie",
      correctAnswer: "B",
      explanation:
        "El Consejo Regional, conformado por consejeros, fiscaliza al gobernador.",
    },
    // Nivel 3.2: El Canon
    {
      levelId: 8,
      questionNumber: 1,
      question: "¿Qué es el canon minero?",
      optionA: "Un impuesto a los mineros",
      optionB: "Dinero que la minería aporta a gobiernos locales",
      optionC: "Una ley minera",
      optionD: "Un tipo de mina",
      correctAnswer: "B",
      explanation:
        "El canon minero es el dinero que las empresas mineras aportan a gobiernos locales y regionales.",
    },
    {
      levelId: 8,
      questionNumber: 2,
      question: "¿Cómo se distribuye el canon minero?",
      optionA: "Todo al municipio",
      optionB: "Entre municipios y GORE",
      optionC: "Al gobierno nacional",
      optionD: "A la empresa minera",
      correctAnswer: "B",
      explanation:
        "El canon se distribuye entre municipios, GORE y otras instituciones según ley.",
    },
    {
      levelId: 8,
      questionNumber: 3,
      question: "¿Cuál es la diferencia entre canon y regalía?",
      optionA: "No hay diferencia",
      optionB: "Canon es para gobiernos locales, regalía es para el estado",
      optionC: "Regalía es más grande",
      optionD: "Canon es más nuevo",
      correctAnswer: "B",
      explanation:
        "El canon va a gobiernos locales, mientras que las regalías van al estado nacional.",
    },
    {
      levelId: 8,
      questionNumber: 4,
      question: "¿Qué debe hacer un municipio con el canon?",
      optionA: "Gastarlo en lo que quiera",
      optionB: "Invertirlo en infraestructura y desarrollo",
      optionC: "Guardarlo en el banco",
      optionD: "Darlo al alcalde",
      correctAnswer: "B",
      explanation:
        "El canon debe invertirse en infraestructura, educación y desarrollo del territorio.",
    },
    {
      levelId: 8,
      questionNumber: 5,
      question: "¿Puedo fiscalizar cómo se gasta el canon?",
      optionA: "No, es privado",
      optionB: "Sí, es dinero público y debo conocer su uso",
      optionC: "Solo el alcalde",
      optionD: "Solo el GORE",
      correctAnswer: "B",
      explanation:
        "El canon es dinero público y todo ciudadano tiene derecho a fiscalizar su gasto.",
    },
    // Nivel 3.3: Leyes Regionales
    {
      levelId: 9,
      questionNumber: 1,
      question: "¿Qué es una ordenanza regional?",
      optionA: "Una ley nacional",
      optionB: "Una ley hecha por el GORE",
      optionC: "Un decreto del presidente",
      optionD: "Una orden del alcalde",
      correctAnswer: "B",
      explanation:
        "Una ordenanza regional es una ley hecha por el GORE que rige en la región.",
    },
    {
      levelId: 9,
      questionNumber: 2,
      question: "¿Quién vota las ordenanzas regionales?",
      optionA: "El gobernador solo",
      optionB: "El Consejo Regional",
      optionC: "El Congreso",
      optionD: "Los ciudadanos",
      correctAnswer: "B",
      explanation:
        "El Consejo Regional, conformado por consejeros elegidos, vota las ordenanzas.",
    },
    {
      levelId: 9,
      questionNumber: 3,
      question: "¿Puede el Consejo rechazar una ordenanza del gobernador?",
      optionA: "No, siempre la aprueba",
      optionB: "Sí, si considera que no es conveniente",
      optionC: "Solo si el alcalde lo pide",
      optionD: "No, es ilegal",
      correctAnswer: "B",
      explanation:
        "El Consejo Regional puede rechazar ordenanzas que considere inadecuadas.",
    },
    {
      levelId: 9,
      questionNumber: 4,
      question: "¿Qué temas pueden tener ordenanzas regionales?",
      optionA: "Solo educación",
      optionB: "Educación, salud, ambiente, vías y más",
      optionC: "Solo seguridad",
      optionD: "Ninguno, todo es nacional",
      correctAnswer: "B",
      explanation:
        "Las ordenanzas regionales pueden tratar educación, salud, ambiente, infraestructura y más.",
    },
    {
      levelId: 9,
      questionNumber: 5,
      question: "¿Debo cumplir una ordenanza regional?",
      optionA: "No, son solo sugerencias",
      optionB: "Sí, son leyes que rigen en la región",
      optionC: "Solo si quiero",
      optionD: "Solo si el gobernador lo ordena",
      correctAnswer: "B",
      explanation:
        "Las ordenanzas regionales son leyes obligatorias que rigen en la región.",
    },
    // Nivel 4.1: El Congreso
    {
      levelId: 10,
      questionNumber: 1,
      question: "¿Qué es el Congreso de la República?",
      optionA: "El poder ejecutivo",
      optionB: "El poder legislativo",
      optionC: "El poder judicial",
      optionD: "Una empresa",
      correctAnswer: "B",
      explanation:
        "El Congreso es el poder legislativo que hace y aprueba las leyes nacionales.",
    },
    {
      levelId: 10,
      questionNumber: 2,
      question: "¿Cuántos diputados hay en el Congreso?",
      optionA: "50",
      optionB: "100",
      optionC: "130",
      optionD: "200",
      correctAnswer: "C",
      explanation: "El Congreso tiene 130 diputados elegidos por los ciudadanos.",
    },
    {
      levelId: 10,
      questionNumber: 3,
      question: "¿Cuál es el período de un diputado?",
      optionA: "1 año",
      optionB: "2 años",
      optionC: "4 años",
      optionD: "5 años",
      correctAnswer: "D",
      explanation: "Los diputados son elegidos por 5 años y pueden ser reelegidos.",
    },
    {
      levelId: 10,
      questionNumber: 4,
      question: "¿Quién elige a los diputados?",
      optionA: "El presidente",
      optionB: "Los ciudadanos en elecciones",
      optionC: "El Congreso anterior",
      optionD: "Los gobernadores",
      correctAnswer: "B",
      explanation:
        "Los ciudadanos eligen a los diputados mediante sufragio en elecciones generales.",
    },
    {
      levelId: 10,
      questionNumber: 5,
      question: "¿Puede el Congreso destituir al presidente?",
      optionA: "No, nunca",
      optionB: "Sí, mediante vacancia o censura",
      optionC: "Solo el pueblo",
      optionD: "Solo el Poder Judicial",
      correctAnswer: "B",
      explanation:
        "El Congreso puede destituir al presidente mediante vacancia o censura.",
    },
    // Nivel 4.2: Las Leyes
    {
      levelId: 11,
      questionNumber: 1,
      question: "¿Cuántas lecturas tiene una ley en el Congreso?",
      optionA: "1",
      optionB: "2",
      optionC: "3",
      optionD: "4",
      correctAnswer: "C",
      explanation:
        "Una ley pasa por 3 lecturas en el Congreso: presentación, debate y votación final.",
    },
    {
      levelId: 11,
      questionNumber: 2,
      question: "¿Quién puede proponer una ley?",
      optionA: "Solo el presidente",
      optionB: "Solo los diputados",
      optionC: "El presidente, diputados y ciudadanos",
      optionD: "Solo el Poder Judicial",
      correctAnswer: "C",
      explanation:
        "Las leyes pueden ser propuestas por el ejecutivo, diputados y ciudadanos (iniciativa popular).",
    },
    {
      levelId: 11,
      questionNumber: 3,
      question: "¿Qué pasa después que el Congreso aprueba una ley?",
      optionA: "Entra en vigor inmediatamente",
      optionB: "Va al presidente para su firma",
      optionC: "Va al Poder Judicial",
      optionD: "Se publica en el diario",
      correctAnswer: "B",
      explanation:
        "Después de aprobada, la ley va al presidente para su firma y promulgación.",
    },
    {
      levelId: 11,
      questionNumber: 4,
      question: "¿Puede el presidente rechazar una ley?",
      optionA: "No, debe firmarla",
      optionB: "Sí, mediante veto",
      optionC: "Solo si no le gusta",
      optionD: "No, es inconstitucional",
      correctAnswer: "B",
      explanation:
        "El presidente puede vetar una ley, pero el Congreso puede insistir con mayoría calificada.",
    },
    {
      levelId: 11,
      questionNumber: 5,
      question: "¿Debo cumplir una ley aprobada por el Congreso?",
      optionA: "No, es opcional",
      optionB: "Sí, es obligatoria",
      optionC: "Solo si estoy de acuerdo",
      optionD: "Solo si la firma el presidente",
      correctAnswer: "B",
      explanation:
        "Las leyes aprobadas son obligatorias para todos los ciudadanos.",
    },
    // Nivel 4.3: Voto Informado
    {
      levelId: 12,
      questionNumber: 1,
      question: "¿Cuál es la importancia del voto informado?",
      optionA: "No tiene importancia",
      optionB: "Elegir buenos representantes basado en información",
      optionC: "Votar por amigos",
      optionD: "Votar por dinero",
      correctAnswer: "B",
      explanation:
        "El voto informado significa elegir representantes basándose en hechos e información verificada.",
    },
    {
      levelId: 12,
      questionNumber: 2,
      question: "¿Dónde puedo verificar el historial de un candidato?",
      optionA: "En redes sociales",
      optionB: "En bases de datos públicas, prensa y registros",
      optionC: "Solo en campaña",
      optionD: "No se puede",
      correctAnswer: "B",
      explanation:
        "El historial de candidatos está en bases de datos públicas, registros judiciales y prensa.",
    },
    {
      levelId: 12,
      questionNumber: 3,
      question: "¿Qué debo investigar de un candidato?",
      optionA: "Su apariencia",
      optionB: "Su historial, propuestas y antecedentes",
      optionC: "Su religión",
      optionD: "Su familia",
      correctAnswer: "B",
      explanation:
        "Debes investigar su historial, propuestas de gobierno y antecedentes legales.",
    },
    {
      levelId: 12,
      questionNumber: 4,
      question: "¿Es importante verificar promesas de campaña?",
      optionA: "No, todas son iguales",
      optionB: "Sí, debo verificar si las cumplió antes",
      optionC: "Solo si me gustan",
      optionD: "No, es perder tiempo",
      correctAnswer: "B",
      explanation:
        "Verificar si un candidato cumplió promesas anteriores es clave para votar informado.",
    },
    {
      levelId: 12,
      questionNumber: 5,
      question: "¿Qué es la corrupción política?",
      optionA: "Un error pequeño",
      optionB: "Usar el poder para beneficio personal",
      optionC: "Una opinión",
      optionD: "Algo normal",
      correctAnswer: "B",
      explanation:
        "La corrupción política es usar el poder público para beneficio personal o de allegados.",
    },
  ];

  for (const quiz of quizzesData) {
    await db.insert(quizzes).values(quiz);
  }
  console.log("✓ Quizzes creados");

  console.log("✅ Datos iniciales sembrados exitosamente");
  await connection.end();
}

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
