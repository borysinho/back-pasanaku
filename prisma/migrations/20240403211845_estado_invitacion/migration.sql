/*
  Warnings:

  - The values [NoEnviado,EnvioCorrecto,EnvioFallido] on the enum `EstadoInvitacion` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoNotificacion" AS ENUM ('NoEnviado', 'EnvioCorrecto', 'EnvioIncorrecto');

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInvitacion_new" AS ENUM ('Preparado', 'Enviado', 'Aceptado', 'Rechazado', 'Cancelado');
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" DROP DEFAULT;
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" TYPE "EstadoInvitacion_new" USING ("estado_invitacion"::text::"EstadoInvitacion_new");
ALTER TYPE "EstadoInvitacion" RENAME TO "EstadoInvitacion_old";
ALTER TYPE "EstadoInvitacion_new" RENAME TO "EstadoInvitacion";
DROP TYPE "EstadoInvitacion_old";
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" SET DEFAULT 'Preparado';
COMMIT;

-- AlterTable
ALTER TABLE "Invitados_Juegos" ADD COLUMN     "estado_notificacion_correo" "EstadoNotificacion" NOT NULL DEFAULT 'NoEnviado',
ADD COLUMN     "estado_notificacion_whatsapp" "EstadoNotificacion" NOT NULL DEFAULT 'NoEnviado',
ALTER COLUMN "estado_invitacion" SET DEFAULT 'Preparado';
