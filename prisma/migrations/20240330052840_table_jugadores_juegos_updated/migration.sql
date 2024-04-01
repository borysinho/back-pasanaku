/*
  Warnings:

  - You are about to drop the column `detalle` on the `Jugadores_Juegos` table. All the data in the column will be lost.
  - You are about to drop the column `id_jugador_grupo_turno` on the `Jugadores_Juegos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jugadores_Juegos" DROP COLUMN "detalle",
DROP COLUMN "id_jugador_grupo_turno";
