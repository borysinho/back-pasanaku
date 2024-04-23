/*
  Warnings:

  - You are about to drop the column `id_ganador_jugador_grupo_turno` on the `Turnos` table. All the data in the column will be lost.
  - Added the required column `id_ganador_jugador_juego` to the `Turnos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turnos" DROP COLUMN "id_ganador_jugador_grupo_turno",
ADD COLUMN     "id_ganador_jugador_juego" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_ganador_jugador_juego_fkey" FOREIGN KEY ("id_ganador_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
