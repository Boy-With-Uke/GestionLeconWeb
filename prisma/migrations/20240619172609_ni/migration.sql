/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Matiere` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Matiere_nom_key` ON `Matiere`(`nom`);
