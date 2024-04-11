/*
  Warnings:

  - You are about to drop the `Jugadores_Invitados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jugadores_Invitados" DROP CONSTRAINT "Jugadores_Invitados_id_invitado_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Invitados" DROP CONSTRAINT "Jugadores_Invitados_id_jugador_fkey";

-- DropTable
DROP TABLE "Jugadores_Invitados";
