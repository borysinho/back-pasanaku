/*
  Warnings:

  - Made the column `qr` on table `Jugadores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Jugadores" ALTER COLUMN "qr" SET NOT NULL,
ALTER COLUMN "qr" SET DEFAULT '';
