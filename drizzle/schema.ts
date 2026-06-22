import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  boolean,
  decimal,
  json
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow + game progression
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Game progression
  currentRank: mysqlEnum("currentRank", [
    "Ciudadano de a pie",
    "Vecino Alerta",
    "Fiscalizador Jr.",
    "Gobernador de Barrio",
    "Ciudadano Reset"
  ]).default("Ciudadano de a pie").notNull(),
  
  solsCivicos: int("solsCivicos").default(0).notNull(),
  currentLives: int("currentLives").default(3).notNull(),
  maxLives: int("maxLives").default(3).notNull(),
  lastLivesRecoveryTime: timestamp("lastLivesRecoveryTime"),
  
  // Progression tracking
  currentDistrict: int("currentDistrict").default(1).notNull(), // 1-4
  currentLevel: int("currentLevel").default(1).notNull(), // 1-3 per district
  
  // Stats
  totalQuizzesCompleted: int("totalQuizzesCompleted").default(0).notNull(),
  totalDuelsPlayed: int("totalDuelsPlayed").default(0).notNull(),
  totalDuelsWon: int("totalDuelsWon").default(0).notNull(),
  streakDays: int("streakDays").default(0).notNull(),
  lastPlayDate: timestamp("lastPlayDate"),
  hasIntegrityShield: boolean("hasIntegrityShield").default(false).notNull(),
  
  // Certificate
  hasCertificate: boolean("hasCertificate").default(false).notNull(),
  certificateGeneratedAt: timestamp("certificateGeneratedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Districts (Barrio, Distrito, Región, País)
 */
export const districts = mysqlTable("districts", {
  id: int("id").autoincrement().primaryKey(),
  districtNumber: int("districtNumber").notNull().unique(), // 1-4
  name: varchar("name", { length: 100 }).notNull(), // "Mi Barrio", "Mi Distrito", etc.
  description: text("description"),
  rankUnlocked: mysqlEnum("rankUnlocked", [
    "Vecino Alerta",
    "Fiscalizador Jr.",
    "Gobernador de Barrio",
    "Ciudadano Reset"
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type District = typeof districts.$inferSelect;

/**
 * Levels within each district (3 per district)
 */
export const levels = mysqlTable("levels", {
  id: int("id").autoincrement().primaryKey(),
  districtId: int("districtId").notNull(),
  levelNumber: int("levelNumber").notNull(), // 1-3
  title: varchar("title", { length: 200 }).notNull(), // "El Municipio", "Obras Públicas", etc.
  description: text("description"),
  vigilanteCaseIntro: text("vigilanteCaseIntro").notNull(), // "El alcalde dice que no hay plata..."
  dataUnlock: text("dataUnlock"), // "Dato: Los regidores pueden pedir la vacancia..."
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Level = typeof levels.$inferSelect;

/**
 * Quiz questions (5 per level)
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  levelId: int("levelId").notNull(),
  questionNumber: int("questionNumber").notNull(), // 1-5
  question: text("question").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctAnswer: mysqlEnum("correctAnswer", ["A", "B", "C", "D"]).notNull(),
  explanation: text("explanation"), // Feedback after answer
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;

/**
 * User progress tracking
 */
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  levelId: int("levelId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  attempts: int("attempts").default(0).notNull(),
  correctAnswers: int("correctAnswers").default(0).notNull(),
  solsEarned: int("solsEarned").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;

/**
 * Rank exams (10 questions, taken after completing 3 levels)
 */
export const rankExams = mysqlTable("rankExams", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  districtId: int("districtId").notNull(),
  passed: boolean("passed").default(false).notNull(),
  score: int("score").default(0).notNull(), // 0-10
  attempts: int("attempts").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RankExam = typeof rankExams.$inferSelect;

/**
 * Duels (1v1 multiplayer)
 */
export const duels = mysqlTable("duels", {
  id: int("id").autoincrement().primaryKey(),
  duelCode: varchar("duelCode", { length: 20 }).notNull().unique(), // Room identifier
  player1Id: int("player1Id").notNull(),
  player2Id: int("player2Id"),
  status: mysqlEnum("status", ["waiting", "active", "completed"]).default("waiting").notNull(),
  betAmount: int("betAmount").default(0).notNull(), // Soles apostados
  winnerId: int("winnerId"),
  player1Score: int("player1Score").default(0).notNull(),
  player2Score: int("player2Score").default(0).notNull(),
  caseId: int("caseId"), // Reference to a quiz case
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
});

export type Duel = typeof duels.$inferSelect;

/**
 * Duel responses (tracking answers in real-time)
 */
export const duelResponses = mysqlTable("duelResponses", {
  id: int("id").autoincrement().primaryKey(),
  duelId: int("duelId").notNull(),
  userId: int("userId").notNull(),
  quizId: int("quizId").notNull(),
  selectedAnswer: mysqlEnum("selectedAnswer", ["A", "B", "C", "D"]).notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  timeSpentMs: int("timeSpentMs").notNull(), // Milliseconds to answer
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DuelResponse = typeof duelResponses.$inferSelect;

/**
 * Leaderboard (cached/denormalized for performance)
 */
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  rank: int("rank").notNull(),
  solsCivicos: int("solsCivicos").notNull(),
  currentRank: varchar("currentRank", { length: 50 }).notNull(),
  totalDuelsWon: int("totalDuelsWon").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Leaderboard = typeof leaderboard.$inferSelect;

/**
 * Certificates (for "Ciudadano Reset" achievement)
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  certificateCode: varchar("certificateCode", { length: 50 }).notNull().unique(), // QR code data
  userName: varchar("userName", { length: 200 }).notNull(),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;

/**
 * Daily notifications log (for "El Vigilante" reminders)
 */
export const dailyReminders = mysqlTable("dailyReminders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyReminder = typeof dailyReminders.$inferSelect;
