-- CreateTable
CREATE TABLE "Jugadores_Invitados" (
    "id_jugador" INTEGER NOT NULL,
    "id_invitado" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_Invitados_id_jugador_key" ON "Jugadores_Invitados"("id_jugador");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_Invitados_id_invitado_key" ON "Jugadores_Invitados"("id_invitado");

-- AddForeignKey
ALTER TABLE "Jugadores_Invitados" ADD CONSTRAINT "Jugadores_Invitados_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Invitados" ADD CONSTRAINT "Jugadores_Invitados_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
