/*
  Warnings:

  - You are about to drop the column `nombre` on the `Invitados` table. All the data in the column will be lost.
  - You are about to drop the column `correo` on the `Jugadores` table. All the data in the column will be lost.
  - You are about to drop the column `telf` on the `Jugadores` table. All the data in the column will be lost.
  - Added the required column `id_jugador` to the `Invitados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_invitado` to the `Invitados_Juegos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasena` to the `Jugadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `Jugadores` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Jugadores_correo_key";

-- DropIndex
DROP INDEX "Jugadores_nombre_key";

-- DropIndex
DROP INDEX "Jugadores_telf_key";

-- AlterTable
ALTER TABLE "Invitados" DROP COLUMN "nombre",
ADD COLUMN     "id_jugador" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Invitados_Juegos" ADD COLUMN     "nombre_invitado" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Jugadores" DROP COLUMN "correo",
DROP COLUMN "telf",
ADD COLUMN     "contrasena" TEXT NOT NULL,
ADD COLUMN     "usuario" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Invitados" ADD CONSTRAINT "Invitados_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
