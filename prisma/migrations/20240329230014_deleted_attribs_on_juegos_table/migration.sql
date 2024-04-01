/*
  Warnings:

  - You are about to drop the column `cant_invitados` on the `Juegos` table. All the data in the column will be lost.
  - You are about to drop the column `cant_participantes` on the `Juegos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Juegos" DROP COLUMN "cant_invitados",
DROP COLUMN "cant_participantes";
