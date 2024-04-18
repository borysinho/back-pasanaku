/*
  Warnings:

  - Added the required column `monto_puja` to the `Jugador_Grupo_Turno` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoTurnos" AS ENUM ('Pasado', 'Actual', 'Futuro');

-- AlterTable
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "periodo" SET DEFAULT 'Mensual, de preferencia el 5 de cada mes.';

-- AlterTable
ALTER TABLE "Jugador_Grupo_Turno" ADD COLUMN     "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monto_puja" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "estado_turno" "EstadoTurnos" NOT NULL DEFAULT 'Futuro';

-- DropEnum
DROP TYPE "Periodos";
