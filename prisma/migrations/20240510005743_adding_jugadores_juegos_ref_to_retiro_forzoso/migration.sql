-- AlterTable
ALTER TABLE "Jugadores_Juegos" ADD COLUMN     "id_jugador_juego_retirado" INTEGER;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_juego_retirado_fkey" FOREIGN KEY ("id_jugador_juego_retirado") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
