-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `coursUtilisateur` INTEGER NULL,
    `niveauAccess` ENUM('USER', 'ENSEIGNANT', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_id_user_key`(`id_user`),
    UNIQUE INDEX `User_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Matiere` (
    `id_matiere` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `enseignantDelaMatiere` INTEGER NOT NULL,

    UNIQUE INDEX `Matiere_id_matiere_key`(`id_matiere`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cours` (
    `id_cours` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `dateDebut` DATETIME(3) NULL,
    `dateFin` DATETIME(3) NULL,
    `enseignant` VARCHAR(191) NULL,
    `matiereConcernee` INTEGER NOT NULL,

    UNIQUE INDEX `Cours_id_cours_key`(`id_cours`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classe` (
    `id_classe` INTEGER NOT NULL AUTO_INCREMENT,
    `nomClasse` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Classe_id_classe_key`(`id_classe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matiereDeLaClasse` (
    `classId` INTEGER NOT NULL,
    `matiereId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `matiereDeLaClasse_classId_matiereId_key`(`classId`, `matiereId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utilisateurSuivantLeCours` (
    `coursId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `utilisateurSuivantLeCours_userId_coursId_key`(`userId`, `coursId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coursContenantLecon` (
    `coursId` INTEGER NOT NULL,
    `lessonId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coursContenantLecon_coursId_lessonId_key`(`coursId`, `lessonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coursContenantEvaluation` (
    `coursId` INTEGER NOT NULL,
    `evaluationsId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coursContenantEvaluation_coursId_evaluationsId_key`(`coursId`, `evaluationsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `id_evaluation` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `typeEvaluation` ENUM('Controle', 'Examen') NOT NULL DEFAULT 'Controle',
    `dateLimite` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Evaluation_id_evaluation_key`(`id_evaluation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lecon` (
    `id_lecon` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `contenue` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Lecon_id_lecon_key`(`id_lecon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Matiere` ADD CONSTRAINT `Matiere_enseignantDelaMatiere_fkey` FOREIGN KEY (`enseignantDelaMatiere`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_matiereConcernee_fkey` FOREIGN KEY (`matiereConcernee`) REFERENCES `Matiere`(`id_matiere`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matiereDeLaClasse` ADD CONSTRAINT `matiereDeLaClasse_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Classe`(`id_classe`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matiereDeLaClasse` ADD CONSTRAINT `matiereDeLaClasse_matiereId_fkey` FOREIGN KEY (`matiereId`) REFERENCES `Matiere`(`id_matiere`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilisateurSuivantLeCours` ADD CONSTRAINT `utilisateurSuivantLeCours_coursId_fkey` FOREIGN KEY (`coursId`) REFERENCES `Cours`(`id_cours`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utilisateurSuivantLeCours` ADD CONSTRAINT `utilisateurSuivantLeCours_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursContenantLecon` ADD CONSTRAINT `coursContenantLecon_coursId_fkey` FOREIGN KEY (`coursId`) REFERENCES `Cours`(`id_cours`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursContenantLecon` ADD CONSTRAINT `coursContenantLecon_lessonId_fkey` FOREIGN KEY (`lessonId`) REFERENCES `Lecon`(`id_lecon`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursContenantEvaluation` ADD CONSTRAINT `coursContenantEvaluation_coursId_fkey` FOREIGN KEY (`coursId`) REFERENCES `Cours`(`id_cours`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursContenantEvaluation` ADD CONSTRAINT `coursContenantEvaluation_evaluationsId_fkey` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluation`(`id_evaluation`) ON DELETE RESTRICT ON UPDATE CASCADE;
