-- CreateTable
CREATE TABLE "Riesgo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "probabilidad" INTEGER NOT NULL,
    "consecuencia" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL
);
