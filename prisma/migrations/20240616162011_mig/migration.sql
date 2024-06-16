/*
  Warnings:

  - You are about to drop the column `enseignant` on the `Cours` table. All the data in the column will be lost.
  - Added the required column `classeUtilisateur` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cours` DROP COLUMN `enseignant`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `classeUtilisateur` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classeUtilisateur_fkey` FOREIGN KEY (`classeUtilisateur`) REFERENCES `Classe`(`id_classe`) ON DELETE CASCADE ON UPDATE CASCADE;
