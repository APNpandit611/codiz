-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyQuizCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailyQuizReset" TIMESTAMP(3);
