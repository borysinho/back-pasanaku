-- DropForeignKey
ALTER TABLE "Invitados_Juegos" DROP CONSTRAINT "Invitados_Juegos_id_invitado_fkey";

-- DropForeignKey
ALTER TABLE "Invitados_Juegos" DROP CONSTRAINT "Invitados_Juegos_id_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugador_Grupo_Turno" DROP CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugador_Grupo_Turno" DROP CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_jugador_fkey";

-- DropForeignKey
ALTER TABLE "Turnos" DROP CONSTRAINT "Turnos_id_juego_fkey";

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
