/*
  Warnings:

  - A unique constraint covering the columns `[nomClasse]` on the table `Classe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Classe_nomClasse_key` ON `Classe`(`nomClasse`);
