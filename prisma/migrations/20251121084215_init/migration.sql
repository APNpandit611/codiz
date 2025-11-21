/*
  Warnings:

  - You are about to drop the column `correct_answer_index` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `choiceAnswerIndex` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "correct_answer_index",
ADD COLUMN     "choiceAnswerIndex" INTEGER NOT NULL;
