/*
  Warnings:

  - The values [Invitacion] on the enum `EstadoJuego` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoJuego_new" AS ENUM ('Nuevo', 'EnviandoInvitaciones', 'ListoParaEmpezar', 'Iniciado', 'Finalizado');
ALTER TABLE "Juegos" ALTER COLUMN "estado_juego" DROP DEFAULT;
ALTER TABLE "Juegos" ALTER COLUMN "estado_juego" TYPE "EstadoJuego_new" USING ("estado_juego"::text::"EstadoJuego_new");
ALTER TYPE "EstadoJuego" RENAME TO "EstadoJuego_old";
ALTER TYPE "EstadoJuego_new" RENAME TO "EstadoJuego";
DROP TYPE "EstadoJuego_old";
ALTER TABLE "Juegos" ALTER COLUMN "estado_juego" SET DEFAULT 'Nuevo';
COMMIT;
