/*
  Warnings:

  - You are about to drop the `Pagos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PagosTurnos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pagos" DROP CONSTRAINT "Pagos_id_jugador_juego_fkey";

-- DropForeignKey
ALTER TABLE "PagosTurnos" DROP CONSTRAINT "PagosTurnos_id_pago_fkey";

-- DropForeignKey
ALTER TABLE "PagosTurnos" DROP CONSTRAINT "PagosTurnos_id_turno_fkey";

-- DropTable
DROP TABLE "Pagos";

-- DropTable
DROP TABLE "PagosTurnos";

-- CreateTable
CREATE TABLE "OrdenDePago" (
    "id" SERIAL NOT NULL,
    "tipo_pago" "TipoPago" NOT NULL DEFAULT 'Turno',
    "monto" INTEGER NOT NULL,
    "detalle" TEXT,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jugador_juego" INTEGER NOT NULL,

    CONSTRAINT "OrdenDePago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleDePago" (
    "id_pago" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "monto_pagado" INTEGER NOT NULL,
    "detalle" TEXT DEFAULT '',
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DetalleDePago_pkey" PRIMARY KEY ("id_pago","id_turno")
);

-- AddForeignKey
ALTER TABLE "OrdenDePago" ADD CONSTRAINT "OrdenDePago_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleDePago" ADD CONSTRAINT "DetalleDePago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "OrdenDePago"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleDePago" ADD CONSTRAINT "DetalleDePago_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
