/*
  Warnings:

  - A unique constraint covering the columns `[titre]` on the table `Lecon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Lecon_titre_key` ON `Lecon`(`titre`);
