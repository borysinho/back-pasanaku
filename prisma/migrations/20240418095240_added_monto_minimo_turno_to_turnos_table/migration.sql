-- DropForeignKey
ALTER TABLE "Jugador_Grupo_Turno" DROP CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugador_Grupo_Turno" DROP CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_jugador_fkey";

-- AlterTable
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "periodo" SET DEFAULT 'Mensual';

-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "monto_minimo_puja" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
