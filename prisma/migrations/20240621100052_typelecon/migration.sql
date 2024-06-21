/*
  Warnings:

  - You are about to drop the column `type` on the `lecon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lecon` DROP COLUMN `type`,
    ADD COLUMN `typeLecon` VARCHAR(191) NOT NULL DEFAULT 'LESSON';
