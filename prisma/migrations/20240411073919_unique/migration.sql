/*
  Warnings:

  - A unique constraint covering the columns `[id_invitado]` on the table `Jugadores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_id_invitado_key" ON "Jugadores"("id_invitado");
