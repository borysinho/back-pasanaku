/*
  Warnings:

  - Added the required column `monto_pagado` to the `PagosTurnos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PagosTurnos" ADD COLUMN     "detalle" TEXT DEFAULT '',
ADD COLUMN     "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monto_pagado" INTEGER NOT NULL;
