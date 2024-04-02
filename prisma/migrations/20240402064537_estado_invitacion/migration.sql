/*
  Warnings:

  - The values [Enviado] on the enum `EstadoInvitacion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInvitacion_new" AS ENUM ('NoEnviado', 'EnvioCorrecto', 'EnvioFallido', 'Aceptado', 'Rechazado', 'Cancelado');
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" DROP DEFAULT;
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" TYPE "EstadoInvitacion_new" USING ("estado_invitacion"::text::"EstadoInvitacion_new");
ALTER TYPE "EstadoInvitacion" RENAME TO "EstadoInvitacion_old";
ALTER TYPE "EstadoInvitacion_new" RENAME TO "EstadoInvitacion";
DROP TYPE "EstadoInvitacion_old";
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" SET DEFAULT 'NoEnviado';
COMMIT;
