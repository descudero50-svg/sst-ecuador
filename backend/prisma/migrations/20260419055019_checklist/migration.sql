-- CreateTable
CREATE TABLE "Checklist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pregunta" TEXT NOT NULL,
    "cumple" BOOLEAN NOT NULL DEFAULT false
);
