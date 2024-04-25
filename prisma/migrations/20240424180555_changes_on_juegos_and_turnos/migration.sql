/*
  Warnings:

  - The values [Tiempo_Ofertas,Tiempo_Pago] on the enum `EstadoTurnos` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fecha_inicio_puja` on the `Juegos` table. All the data in the column will be lost.
  - You are about to drop the column `saldo_restante` on the `Juegos` table. All the data in the column will be lost.
  - You are about to drop the column `tiempo_puja_seg` on the `Juegos` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoTurnos_new" AS ENUM ('Pasado', 'Actual', 'Futuro');
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" DROP DEFAULT;
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" TYPE "EstadoTurnos_new" USING ("estado_turno"::text::"EstadoTurnos_new");
ALTER TYPE "EstadoTurnos" RENAME TO "EstadoTurnos_old";
ALTER TYPE "EstadoTurnos_new" RENAME TO "EstadoTurnos";
DROP TYPE "EstadoTurnos_old";
ALTER TABLE "Turnos" ALTER COLUMN "estado_turno" SET DEFAULT 'Futuro';
COMMIT;

-- AlterTable
ALTER TABLE "Juegos" DROP COLUMN "fecha_inicio_puja",
DROP COLUMN "saldo_restante",
DROP COLUMN "tiempo_puja_seg";

-- AlterTable
ALTER TABLE "Turnos" ADD COLUMN     "fecha_inicio_puja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "saldo_restante" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tiempo_puja_seg" INTEGER NOT NULL DEFAULT 120,
ALTER COLUMN "estado_turno" SET DEFAULT 'Futuro';
