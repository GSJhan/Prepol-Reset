import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== GAME DATA =====
  game: router({
    // Get all districts
    getDistricts: publicProcedure.query(async () => {
      return await db.getDistricts();
    }),

    // Get levels for a district
    getLevelsByDistrict: publicProcedure
      .input(z.object({ districtId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLevelsByDistrictId(input.districtId);
      }),

    // Get quizzes for a level
    getQuizzesByLevel: publicProcedure
      .input(z.object({ levelId: z.number() }))
      .query(async ({ input }) => {
        return await db.getQuizzesByLevelId(input.levelId);
      }),

    // Get user profile with game stats
    getUserProfile: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        currentRank: user.currentRank,
        solsCivicos: user.solsCivicos,
        currentLives: user.currentLives,
        maxLives: user.maxLives,
        currentDistrict: user.currentDistrict,
        currentLevel: user.currentLevel,
        totalQuizzesCompleted: user.totalQuizzesCompleted,
        totalDuelsPlayed: user.totalDuelsPlayed,
        totalDuelsWon: user.totalDuelsWon,
        streakDays: user.streakDays,
        hasCertificate: user.hasCertificate,
        hasIntegrityShield: user.hasIntegrityShield,
        lastLivesRecoveryTime: user.lastLivesRecoveryTime,
      };
    }),
  }),

  // ===== QUIZ GAMEPLAY =====
  quiz: router({
    // Submit quiz answers
    submitQuiz: protectedProcedure
      .input(z.object({
        levelId: z.number(),
        answers: z.array(z.object({
          quizId: z.number(),
          selectedAnswer: z.enum(["A", "B", "C", "D"]),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        // Check lives
        if (user.currentLives <= 0) {
          throw new TRPCError({ 
            code: "FORBIDDEN", 
            message: "No tienes vidas disponibles" 
          });
        }

        // Calculate score
        let correctCount = 0;
        const feedback = [];

        for (const answer of input.answers) {
          const quiz = await db.getQuizById(answer.quizId);
          if (!quiz) continue;

          const isCorrect = quiz.correctAnswer === answer.selectedAnswer;
          if (isCorrect) correctCount++;

          feedback.push({
            quizId: answer.quizId,
            isCorrect,
            explanation: quiz.explanation,
          });
        }

        // Determine if passed (4 out of 5 correct)
        const passed = correctCount >= 4;
        const solsEarned = passed ? 50 : 0;

        // Update user progress
        await db.createOrUpdateUserProgress(ctx.user.id, input.levelId, correctCount, solsEarned);

        // Update user stats
        const dbInstance = await db.getDb();
        if (passed) {
          // Update soles and quizzes completed
          if (dbInstance) {
            await dbInstance.update(users)
              .set({
                solsCivicos: user.solsCivicos + solsEarned,
                totalQuizzesCompleted: user.totalQuizzesCompleted + 1,
              })
              .where(eq(users.id, ctx.user.id));
          }
        } else {
          // Lose a life
          const newLives = Math.max(0, user.currentLives - 1);
          if (dbInstance) {
            await dbInstance.update(users)
              .set({
                currentLives: newLives,
              })
              .where(eq(users.id, ctx.user.id));
          }
        }

        return {
          passed,
          correctCount,
          totalQuestions: input.answers.length,
          solsEarned,
          feedback,
        };
      }),

    // Recover a life (costs 10 soles or wait 15-30 min)
    recoverLife: protectedProcedure.mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (user.currentLives >= user.maxLives) {
        throw new TRPCError({ 
          code: "FORBIDDEN", 
          message: "Ya tienes todas tus vidas" 
        });
      }

      // Check if can recover by time (15-30 min)
      if (user.lastLivesRecoveryTime) {
        const now = new Date();
        const timeSinceRecovery = now.getTime() - user.lastLivesRecoveryTime.getTime();
        const minRecoveryTime = 15 * 60 * 1000; // 15 minutes

        if (timeSinceRecovery >= minRecoveryTime) {
          // Can recover for free
          const dbInstance6 = await db.getDb();
          if (dbInstance6) {
            await dbInstance6.update(users)
              .set({
                currentLives: user.currentLives + 1,
                lastLivesRecoveryTime: new Date(),
              })
              .where(eq(users.id, ctx.user.id));
          }

          return { success: true, method: "time" };
        }
      }

      // Otherwise, use soles (10 soles per life)
      if (user.solsCivicos < 10) {
        throw new TRPCError({ 
          code: "FORBIDDEN", 
          message: "No tienes suficientes Soles Cívicos" 
        });
      }

      const dbInstance7 = await db.getDb();
      if (dbInstance7) {
        await dbInstance7.update(users)
          .set({
            currentLives: user.currentLives + 1,
            solsCivicos: user.solsCivicos - 10,
            lastLivesRecoveryTime: new Date(),
          })
          .where(eq(users.id, ctx.user.id));
      }

      return { success: true, method: "soles" };
    }),
  }),

  // ===== RANK EXAMS =====
  rankExam: router({
    // Submit rank exam
    submitRankExam: protectedProcedure
      .input(z.object({
        districtId: z.number(),
        answers: z.array(z.object({
          quizId: z.number(),
          selectedAnswer: z.enum(["A", "B", "C", "D"]),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        // Calculate score
        let correctCount = 0;
        for (const answer of input.answers) {
          const quiz = await db.getQuizById(answer.quizId);
          if (quiz && quiz.correctAnswer === answer.selectedAnswer) {
            correctCount++;
          }
        }

        // Create exam record
        await db.createRankExam(ctx.user.id, input.districtId, correctCount);

        // If passed (7+ out of 10), promote user
        const passed = correctCount >= 7;
        if (passed) {
          const rankProgression = [
            "Ciudadano de a pie",
            "Vecino Alerta",
            "Fiscalizador Jr.",
            "Gobernador de Barrio",
            "Ciudadano Reset",
          ];

          const newRankIndex = Math.min(input.districtId + 1, rankProgression.length - 1);
          const newRank = rankProgression[newRankIndex];

          const dbInstance2 = await db.getDb();
          if (dbInstance2) {
            await dbInstance2.update(users)
              .set({
                currentRank: newRank as any,
                currentDistrict: input.districtId + 1,
                currentLevel: 1,
              })
              .where(eq(users.id, ctx.user.id));
          }

          // If reached "Ciudadano Reset", generate certificate
          if (newRank === "Ciudadano Reset") {
            await db.createCertificate(ctx.user.id, user.name || "Usuario");
            const dbInstance3 = await db.getDb();
            if (dbInstance3) {
              await dbInstance3.update(users)
                .set({
                  hasCertificate: true,
                  certificateGeneratedAt: new Date(),
                })
                .where(eq(users.id, ctx.user.id));
            }
          }
        }

        return {
          passed,
          score: correctCount,
          totalQuestions: input.answers.length,
        };
      }),
  }),

  // ===== DUELS (1v1 MULTIPLAYER) =====
  duel: router({
    // Create a new duel room
    createDuel: protectedProcedure
      .input(z.object({ betAmount: z.number().min(0) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        if (user.solsCivicos < input.betAmount) {
          throw new TRPCError({ 
            code: "FORBIDDEN", 
            message: "No tienes suficientes Soles Cívicos para apostar" 
          });
        }

        const duel = await db.createDuel(ctx.user.id, input.betAmount);
        return duel;
      }),

    // Join a waiting duel
    joinDuel: protectedProcedure
      .input(z.object({ duelCode: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserById(ctx.user.id);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });

        const duel = await db.getDuelByCode(input.duelCode);
        if (!duel) throw new TRPCError({ code: "NOT_FOUND" });

        if (duel.player1Id === ctx.user.id) {
          throw new TRPCError({ 
            code: "FORBIDDEN", 
            message: "No puedes unirte a tu propio duelo" 
          });
        }

        if (user.solsCivicos < duel.betAmount) {
          throw new TRPCError({ 
            code: "FORBIDDEN", 
            message: "No tienes suficientes Soles Cívicos para este duelo" 
          });
        }

        // Deduct soles from both players
        const dbInstance4 = await db.getDb();
        if (dbInstance4) {
          await dbInstance4.update(users)
            .set({
              solsCivicos: user.solsCivicos - duel.betAmount,
            })
            .where(eq(users.id, ctx.user.id));
        }

        const player1 = await db.getUserById(duel.player1Id);
        if (player1) {
          const dbInstance5 = await db.getDb();
          if (dbInstance5) {
            await dbInstance5.update(users)
              .set({
                solsCivicos: player1.solsCivicos - duel.betAmount,
              })
              .where(eq(users.id, duel.player1Id));
          }
        }

        // Join the duel
        await db.joinDuel(duel.id, ctx.user.id);

        return duel;
      }),

    // Get duel by code
    getDuel: publicProcedure
      .input(z.object({ duelCode: z.string() }))
      .query(async ({ input }) => {
        return await db.getDuelByCode(input.duelCode);
      }),

    // Get waiting duel
    getWaitingDuel: publicProcedure.query(async () => {
      return await db.getWaitingDuel();
    }),
  }),

  // ===== LEADERBOARD =====
  leaderboard: router({
    // Get top players
    getTop: publicProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await db.getLeaderboard(input.limit);
      }),
  }),

  // ===== CERTIFICATES =====
  certificate: router({
    // Get user certificate
    getCertificate: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCertificateByUserId(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
