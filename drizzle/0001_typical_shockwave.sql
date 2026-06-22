CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateCode` varchar(50) NOT NULL,
	`userName` varchar(200) NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `certificates_certificateCode_unique` UNIQUE(`certificateCode`)
);
--> statement-breakpoint
CREATE TABLE `dailyReminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dailyReminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `districts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`districtNumber` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`rankUnlocked` enum('Vecino Alerta','Fiscalizador Jr.','Gobernador de Barrio','Ciudadano Reset') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `districts_id` PRIMARY KEY(`id`),
	CONSTRAINT `districts_districtNumber_unique` UNIQUE(`districtNumber`)
);
--> statement-breakpoint
CREATE TABLE `duelResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`duelId` int NOT NULL,
	`userId` int NOT NULL,
	`quizId` int NOT NULL,
	`selectedAnswer` enum('A','B','C','D') NOT NULL,
	`isCorrect` boolean NOT NULL,
	`timeSpentMs` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `duelResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `duels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`duelCode` varchar(20) NOT NULL,
	`player1Id` int NOT NULL,
	`player2Id` int,
	`status` enum('waiting','active','completed') NOT NULL DEFAULT 'waiting',
	`betAmount` int NOT NULL DEFAULT 0,
	`winnerId` int,
	`player1Score` int NOT NULL DEFAULT 0,
	`player2Score` int NOT NULL DEFAULT 0,
	`caseId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `duels_id` PRIMARY KEY(`id`),
	CONSTRAINT `duels_duelCode_unique` UNIQUE(`duelCode`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rank` int NOT NULL,
	`solsCivicos` int NOT NULL,
	`currentRank` varchar(50) NOT NULL,
	`totalDuelsWon` int NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`districtId` int NOT NULL,
	`levelNumber` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`vigilanteCaseIntro` text NOT NULL,
	`dataUnlock` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `levels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`levelId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`question` text NOT NULL,
	`optionA` text NOT NULL,
	`optionB` text NOT NULL,
	`optionC` text NOT NULL,
	`optionD` text NOT NULL,
	`correctAnswer` enum('A','B','C','D') NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rankExams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`districtId` int NOT NULL,
	`passed` boolean NOT NULL DEFAULT false,
	`score` int NOT NULL DEFAULT 0,
	`attempts` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rankExams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`levelId` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`attempts` int NOT NULL DEFAULT 0,
	`correctAnswers` int NOT NULL DEFAULT 0,
	`solsEarned` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `currentRank` enum('Ciudadano de a pie','Vecino Alerta','Fiscalizador Jr.','Gobernador de Barrio','Ciudadano Reset') DEFAULT 'Ciudadano de a pie' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `solsCivicos` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentLives` int DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `maxLives` int DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastLivesRecoveryTime` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `currentDistrict` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentLevel` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalQuizzesCompleted` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalDuelsPlayed` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalDuelsWon` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `streakDays` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastPlayDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `hasIntegrityShield` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `hasCertificate` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `certificateGeneratedAt` timestamp;