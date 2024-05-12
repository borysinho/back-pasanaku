/*
  Warnings:

  - The values [RetiroForzoso,RetiroVoluntario] on the enum `Estado_Jugadores_Juego` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Estado_Jugadores_Juego_new" AS ENUM ('Participando', 'RemplazandoExpulsado');
ALTER TABLE "Jugadores_Juegos" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "Jugadores_Juegos" ALTER COLUMN "estado" TYPE "Estado_Jugadores_Juego_new" USING ("estado"::text::"Estado_Jugadores_Juego_new");
ALTER TYPE "Estado_Jugadores_Juego" RENAME TO "Estado_Jugadores_Juego_old";
ALTER TYPE "Estado_Jugadores_Juego_new" RENAME TO "Estado_Jugadores_Juego";
DROP TYPE "Estado_Jugadores_Juego_old";
ALTER TABLE "Jugadores_Juegos" ALTER COLUMN "estado" SET DEFAULT 'Participando';
COMMIT;

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_jugador_fkey";

-- DropForeignKey
ALTER TABLE "Jugadores_Juegos" DROP CONSTRAINT "Jugadores_Juegos_id_jugador_juego_retirado_fkey";

-- AlterTable
ALTER TABLE "Jugadores_Juegos" ADD COLUMN     "jugadoresId" INTEGER;

-- CreateTable
CREATE TABLE "Expulsados" (
    "id_jugador" INTEGER NOT NULL,
    "id_jugador_juego" INTEGER NOT NULL,
    "detalle" TEXT,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expulsados_pkey" PRIMARY KEY ("id_jugador","id_jugador_juego")
);

-- AddForeignKey
ALTER TABLE "Expulsados" ADD CONSTRAINT "Expulsados_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expulsados" ADD CONSTRAINT "Expulsados_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_jugadoresId_fkey" FOREIGN KEY ("jugadoresId") REFERENCES "Jugadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
