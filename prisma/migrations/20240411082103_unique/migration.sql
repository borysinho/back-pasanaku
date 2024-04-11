/*
  Warnings:

  - A unique constraint covering the columns `[usuario]` on the table `Jugadores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_usuario_key" ON "Jugadores"("usuario");
