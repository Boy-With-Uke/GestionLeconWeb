/*
  Warnings:

  - Added the required column `filiere` to the `Classe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Classe` ADD COLUMN `filiere` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Filiere` (
    `id_filiere` INTEGER NOT NULL AUTO_INCREMENT,
    `nomFiliere` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Filiere_id_filiere_key`(`id_filiere`),
    UNIQUE INDEX `Filiere_nomFiliere_key`(`nomFiliere`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Classe` ADD CONSTRAINT `Classe_filiere_fkey` FOREIGN KEY (`filiere`) REFERENCES `Filiere`(`id_filiere`) ON DELETE CASCADE ON UPDATE CASCADE;
