-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_juego_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_jugador_fkey";

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
