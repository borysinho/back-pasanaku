-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_id_ganador_jugador_juego_fkey";

-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "fecha_inicio_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tiempo_pago_seg" INTEGER NOT NULL DEFAULT 240;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_ganador_jugador_juego_fkey" FOREIGN KEY ("id_ganador_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
