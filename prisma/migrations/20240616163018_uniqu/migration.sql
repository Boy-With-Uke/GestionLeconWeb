/*
  Warnings:

  - A unique constraint covering the columns `[titre]` on the table `Cours` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cours_titre_key` ON `Cours`(`titre`);
