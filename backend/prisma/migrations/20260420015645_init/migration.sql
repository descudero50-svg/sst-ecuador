/*
  Warnings:

  - You are about to drop the `Riesgo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `empresaId` to the `Checklist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Trabajador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Riesgo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pregunta" TEXT NOT NULL,
    "cumple" BOOLEAN NOT NULL DEFAULT false,
    "empresaId" INTEGER NOT NULL,
    CONSTRAINT "Checklist_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checklist" ("cumple", "id", "pregunta") SELECT "cumple", "id", "pregunta" FROM "Checklist";
DROP TABLE "Checklist";
ALTER TABLE "new_Checklist" RENAME TO "Checklist";
CREATE TABLE "new_Trabajador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "riesgo" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,
    CONSTRAINT "Trabajador_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trabajador" ("area", "cargo", "id", "nombre", "riesgo") SELECT "area", "cargo", "id", "nombre", "riesgo" FROM "Trabajador";
DROP TABLE "Trabajador";
ALTER TABLE "new_Trabajador" RENAME TO "Trabajador";
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,
    CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Usuario" ("email", "id", "password", "rol") SELECT "email", "id", "password", "rol" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
