-- CreateEnum
CREATE TYPE "Estado_Jugadores_Juego" AS ENUM ('Participando', 'RetiroForzoso', 'RetiroVoluntario');

-- AlterTable
ALTER TABLE "Jugadores_Juegos" ADD COLUMN     "estado" "Estado_Jugadores_Juego" NOT NULL DEFAULT 'Participando';
