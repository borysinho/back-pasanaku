/*
  Warnings:

  - You are about to drop the `DetalleDePago` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrdenDePago` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DetalleDePago" DROP CONSTRAINT "DetalleDePago_id_pago_fkey";

-- DropForeignKey
ALTER TABLE "DetalleDePago" DROP CONSTRAINT "DetalleDePago_id_turno_fkey";

-- DropForeignKey
ALTER TABLE "OrdenDePago" DROP CONSTRAINT "OrdenDePago_id_jugador_juego_fkey";

-- DropTable
DROP TABLE "DetalleDePago";

-- DropTable
DROP TABLE "OrdenDePago";

-- CreateTable
CREATE TABLE "Pagos" (
    "id" SERIAL NOT NULL,
    "tipo_pago" "TipoPago" NOT NULL DEFAULT 'Turno',
    "monto" INTEGER NOT NULL,
    "detalle" TEXT,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jugador_juego" INTEGER NOT NULL,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagosTurnos" (
    "id_pago" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "monto_pagado" INTEGER NOT NULL,
    "detalle" TEXT DEFAULT '',
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagosTurnos_pkey" PRIMARY KEY ("id_pago","id_turno")
);

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosTurnos" ADD CONSTRAINT "PagosTurnos_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pagos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosTurnos" ADD CONSTRAINT "PagosTurnos_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
