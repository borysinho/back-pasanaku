-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Creador', 'Jugador');

-- AlterTable
ALTER TABLE "Jugadores_Juegos" ADD COLUMN     "rol" "Roles" NOT NULL DEFAULT 'Jugador';
