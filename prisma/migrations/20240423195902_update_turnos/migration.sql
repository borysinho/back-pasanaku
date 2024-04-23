-- DropForeignKey
ALTER TABLE "Jugador_Grupo_Turno" DROP CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey";

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
