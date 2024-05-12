/*
  Warnings:

  - You are about to drop the column `jugadoresId` on the `Jugadores_Juegos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_jugadoresId_fkey";

-- AlterTable
ALTER TABLE "Jugadores_Juegos" DROP COLUMN "jugadoresId";

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
