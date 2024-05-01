/*
  Warnings:

  - The values [TiempoPagos] on the enum `EstadoTurnos` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoTurnos_new" AS ENUM ('Pasado', 'TiempoOfertas', 'TiempoOfertasFinalizado', 'TiempoPagosTurnos', 'TiempoPagosTurnosFinalizado', 'TiempoPagosMultas', 'TiempoPagosMultasFinalizado');
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" DROP DEFAULT;
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" TYPE "EstadoTurnos_new" USING ("estado_turno"::text::"EstadoTurnos_new");
ALTER TYPE "EstadoTurnos" RENAME TO "EstadoTurnos_old";
ALTER TYPE "EstadoTurnos_new" RENAME TO "EstadoTurnos";
DROP TYPE "EstadoTurnos_old";
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" SET DEFAULT 'TiempoOfertas';
COMMIT;
