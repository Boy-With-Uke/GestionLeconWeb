/*
  Warnings:

  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `matiereContenantEvaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usersFavEvalution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `matiereContenantEvaluation` DROP FOREIGN KEY `matiereContenantEvaluation_evaluationsId_fkey`;

-- DropForeignKey
ALTER TABLE `matiereContenantEvaluation` DROP FOREIGN KEY `matiereContenantEvaluation_matieresId_fkey`;

-- DropForeignKey
ALTER TABLE `usersFavEvalution` DROP FOREIGN KEY `usersFavEvalution_evaluationId_fkey`;

-- DropForeignKey
ALTER TABLE `usersFavEvalution` DROP FOREIGN KEY `usersFavEvalution_userId_fkey`;

-- AlterTable
ALTER TABLE `Lecon` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'LESSON';

-- DropTable
DROP TABLE `Evaluation`;

-- DropTable
DROP TABLE `matiereContenantEvaluation`;

-- DropTable
DROP TABLE `usersFavEvalution`;
