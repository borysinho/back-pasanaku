-- AlterEnum
ALTER TYPE "EstadoNotificacion" ADD VALUE 'NoEnviado';

-- AlterTable
ALTER TABLE "Invitados_Juegos" ALTER COLUMN "estado_notificacion_correo" SET DEFAULT 'NoEnviado',
ALTER COLUMN "estado_notificacion_whatsapp" SET DEFAULT 'NoEnviado';
