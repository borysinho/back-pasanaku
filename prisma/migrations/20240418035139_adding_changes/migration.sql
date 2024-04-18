-- AlterTable
ALTER TABLE "Invitados_Juegos" ADD COLUMN     "periodo" TEXT NOT NULL DEFAULT 'Mensual';

-- AlterTable
ALTER TABLE "Juegos" ADD COLUMN     "cant_jugadores" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lapso_turnos_dias" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "tiempo_puja_seg" INTEGER NOT NULL DEFAULT 120;
