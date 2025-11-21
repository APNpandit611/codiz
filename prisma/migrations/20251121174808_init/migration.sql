/*
  Warnings:

  - You are about to drop the column `dailyQuizCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dailyQuizReset` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "dailyQuizCount",
DROP COLUMN "dailyQuizReset";
