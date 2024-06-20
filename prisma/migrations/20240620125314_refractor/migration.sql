/*
  Warnings:

  - You are about to drop the `Cours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coursContenantEvaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coursContenantLecon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usersFav` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Cours` DROP FOREIGN KEY `Cours_matiereConcernee_fkey`;

-- DropForeignKey
ALTER TABLE `coursContenantEvaluation` DROP FOREIGN KEY `coursContenantEvaluation_coursId_fkey`;

-- DropForeignKey
ALTER TABLE `coursContenantEvaluation` DROP FOREIGN KEY `coursContenantEvaluation_evaluationsId_fkey`;

-- DropForeignKey
ALTER TABLE `coursContenantLecon` DROP FOREIGN KEY `coursContenantLecon_coursId_fkey`;

-- DropForeignKey
ALTER TABLE `coursContenantLecon` DROP FOREIGN KEY `coursContenantLecon_lessonId_fkey`;

-- DropForeignKey
ALTER TABLE `usersFav` DROP FOREIGN KEY `usersFav_coursId_fkey`;

-- DropForeignKey
ALTER TABLE `usersFav` DROP FOREIGN KEY `usersFav_userId_fkey`;

-- DropTable
DROP TABLE `Cours`;

-- DropTable
DROP TABLE `coursContenantEvaluation`;

-- DropTable
DROP TABLE `coursContenantLecon`;

-- DropTable
DROP TABLE `usersFav`;

-- CreateTable
CREATE TABLE `matiereContenantLecon` (
    `matieresId` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `matiereContenantLecon_matieresId_lessonId_key`(`matieresId`, `lessonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matiereContenantEvaluation` (
    `matieresId` INTEGER NOT NULL,
    `evaluationsId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `matiereContenantEvaluation_matieresId_evaluationsId_key`(`matieresId`, `evaluationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersFavLecon` (
    `lessonId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usersFavLecon_userId_lessonId_key`(`userId`, `lessonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersFavEvalution` (
    `evaluationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usersFavEvalution_userId_evaluationId_key`(`userId`, `evaluationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `matiereContenantLecon` ADD CONSTRAINT `matiereContenantLecon_matieresId_fkey` FOREIGN KEY (`matieresId`) REFERENCES `Matiere`(`id_matiere`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matiereContenantLecon` ADD CONSTRAINT `matiereContenantLecon_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lecon`(`id_lecon`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matiereContenantEvaluation` ADD CONSTRAINT `matiereContenantEvaluation_matieresId_fkey` FOREIGN KEY (`matieresId`) REFERENCES `Matiere`(`id_matiere`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matiereContenantEvaluation` ADD CONSTRAINT `matiereContenantEvaluation_evaluationsId_fkey` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluation`(`id_evaluation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersFavLecon` ADD CONSTRAINT `usersFavLecon_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lecon`(`id_lecon`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersFavLecon` ADD CONSTRAINT `usersFavLecon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersFavEvalution` ADD CONSTRAINT `usersFavEvalution_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation`(`id_evaluation`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersFavEvalution` ADD CONSTRAINT `usersFavEvalution_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
