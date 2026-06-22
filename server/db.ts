import { eq, desc, and, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  districts, 
  levels, 
  quizzes, 
  userProgress, 
  rankExams,
  duels,
  leaderboard,
  certificates,
  dailyReminders
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== DISTRICTS & LEVELS =====
export async function getDistricts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(districts).orderBy(districts.districtNumber);
}

export async function getDistrictById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(districts).where(eq(districts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLevelsByDistrictId(districtId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(levels)
    .where(eq(levels.districtId, districtId))
    .orderBy(levels.levelNumber);
}

export async function getLevelById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(levels).where(eq(levels.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== QUIZZES =====
export async function getQuizzesByLevelId(levelId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(quizzes)
    .where(eq(quizzes.levelId, levelId))
    .orderBy(quizzes.questionNumber);
}

export async function getQuizById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== USER PROGRESS =====
export async function getUserProgress(userId: number, levelId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUserProgress(
  userId: number,
  levelId: number,
  correctAnswers: number,
  solsEarned: number
) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await getUserProgress(userId, levelId);
  
  if (existing) {
    return await db.update(userProgress)
      .set({
        attempts: existing.attempts + 1,
        correctAnswers: Math.max(existing.correctAnswers, correctAnswers),
        solsEarned: Math.max(existing.solsEarned, solsEarned),
        completed: correctAnswers >= 4, // 4 out of 5 correct
        completedAt: correctAnswers >= 4 ? new Date() : null,
      })
      .where(eq(userProgress.id, existing.id));
  } else {
    return await db.insert(userProgress).values({
      userId,
      levelId,
      attempts: 1,
      correctAnswers,
      solsEarned,
      completed: correctAnswers >= 4,
      completedAt: correctAnswers >= 4 ? new Date() : null,
    });
  }
}

// ===== RANK EXAMS =====
export async function getRankExamByUserAndDistrict(userId: number, districtId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rankExams)
    .where(and(eq(rankExams.userId, userId), eq(rankExams.districtId, districtId)))
    .orderBy(desc(rankExams.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createRankExam(userId: number, districtId: number, score: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const passed = score >= 7; // 7+ out of 10
  
  return await db.insert(rankExams).values({
    userId,
    districtId,
    passed,
    score,
    attempts: 1,
    completedAt: new Date(),
  });
}

// ===== DUELS =====
export async function getDuelByCode(duelCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(duels).where(eq(duels.duelCode, duelCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getWaitingDuel() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(duels)
    .where(and(eq(duels.status, "waiting"), isNull(duels.player2Id)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDuel(player1Id: number, betAmount: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const duelCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return await db.insert(duels).values({
    duelCode,
    player1Id,
    betAmount,
    status: "waiting",
  });
}

export async function joinDuel(duelId: number, player2Id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  return await db.update(duels)
    .set({
      player2Id,
      status: "active",
      startedAt: new Date(),
    })
    .where(eq(duels.id, duelId));
}

export async function completeDuel(duelId: number, winnerId: number, player1Score: number, player2Score: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  return await db.update(duels)
    .set({
      winnerId,
      player1Score,
      player2Score,
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(duels.id, duelId));
}

// ===== LEADERBOARD =====
export async function getLeaderboard(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(leaderboard)
    .orderBy(leaderboard.rank)
    .limit(limit);
}

export async function updateLeaderboard(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const user = await getUserById(userId);
  if (!user) return undefined;

  const existing = await db.select().from(leaderboard).where(eq(leaderboard.userId, userId)).limit(1);
  
  if (existing.length > 0) {
    return await db.update(leaderboard)
      .set({
        solsCivicos: user.solsCivicos,
        currentRank: user.currentRank,
        totalDuelsWon: user.totalDuelsWon,
      })
      .where(eq(leaderboard.userId, userId));
  } else {
    return await db.insert(leaderboard).values({
      userId,
      rank: 0, // Will be calculated separately
      solsCivicos: user.solsCivicos,
      currentRank: user.currentRank,
      totalDuelsWon: user.totalDuelsWon,
    });
  }
}

// ===== CERTIFICATES =====
export async function getCertificateByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates).where(eq(certificates.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCertificate(userId: number, userName: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const certificateCode = `PREPOL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return await db.insert(certificates).values({
    userId,
    userName,
    certificateCode,
  });
}

// ===== DAILY REMINDERS =====
export async function recordDailyReminder(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  return await db.insert(dailyReminders).values({
    userId,
  });
}
