/*
  Warnings:

  - A unique constraint covering the columns `[id_ganador_jugador_grupo_turno]` on the table `Turnos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "id_ganador_jugador_grupo_turno" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Turnos_id_ganador_jugador_grupo_turno_key" ON "Turnos"("id_ganador_jugador_grupo_turno");
