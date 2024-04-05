/*
  Warnings:

  - The values [Preparado] on the enum `EstadoInvitacion` will be removed. If these variants are still used in the database, this will fail.
  - The values [NoEnviado] on the enum `EstadoNotificacion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoInvitacion_new" AS ENUM ('NoEnviado', 'Enviado', 'Aceptado', 'Rechazado', 'Cancelado');
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" DROP DEFAULT;
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" TYPE "EstadoInvitacion_new" USING ("estado_invitacion"::text::"EstadoInvitacion_new");
ALTER TYPE "EstadoInvitacion" RENAME TO "EstadoInvitacion_old";
ALTER TYPE "EstadoInvitacion_new" RENAME TO "EstadoInvitacion";
DROP TYPE "EstadoInvitacion_old";
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" SET DEFAULT 'NoEnviado';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EstadoNotificacion_new" AS ENUM ('EnvioCorrecto', 'EnvioIncorrecto');
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_correo" DROP DEFAULT;
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_whatsapp" DROP DEFAULT;
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_whatsapp" TYPE "EstadoNotificacion_new" USING ("estado_notificacion_whatsapp"::text::"EstadoNotificacion_new");
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_correo" TYPE "EstadoNotificacion_new" USING ("estado_notificacion_correo"::text::"EstadoNotificacion_new");
ALTER TYPE "EstadoNotificacion" RENAME TO "EstadoNotificacion_old";
ALTER TYPE "EstadoNotificacion_new" RENAME TO "EstadoNotificacion";
DROP TYPE "EstadoNotificacion_old";
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_correo" SET DEFAULT 'EnvioCorrecto';
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_whatsapp" SET DEFAULT 'EnvioCorrecto';
COMMIT;

-- AlterTable
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_invitacion" SET DEFAULT 'NoEnviado',
ALTER COLUMN "estado_notificacion_correo" SET DEFAULT 'EnvioCorrecto',
ALTER COLUMN "estado_notificacion_whatsapp" SET DEFAULT 'EnvioCorrecto';
