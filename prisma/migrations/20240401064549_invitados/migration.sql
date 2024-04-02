/*
  Warnings:

  - You are about to drop the column `id_jugador` on the `Invitados` table. All the data in the column will be lost.
  - Added the required column `id_invitado` to the `Jugadores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitados" DROP CONSTRAINT "Invitados_id_jugador_fkey";

-- AlterTable
ALTER TABLE "Invitados" DROP COLUMN "id_jugador";

-- AlterTable
ALTER TABLE "Jugadores" ADD COLUMN     "id_invitado" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Jugadores" ADD CONSTRAINT "Jugadores_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
