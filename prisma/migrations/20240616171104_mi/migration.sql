/*
  Warnings:

  - You are about to drop the `utilisateurSuivantLeCours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `utilisateurSuivantLeCours` DROP FOREIGN KEY `utilisateurSuivantLeCours_coursId_fkey`;

-- DropForeignKey
ALTER TABLE `utilisateurSuivantLeCours` DROP FOREIGN KEY `utilisateurSuivantLeCours_userId_fkey`;

-- DropTable
DROP TABLE `utilisateurSuivantLeCours`;

-- CreateTable
CREATE TABLE `usersFav` (
    `coursId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usersFav_userId_coursId_key`(`userId`, `coursId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usersFav` ADD CONSTRAINT `usersFav_coursId_fkey` FOREIGN KEY (`coursId`) REFERENCES `Cours`(`id_cours`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersFav` ADD CONSTRAINT `usersFav_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
