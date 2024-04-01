-- CreateEnum
CREATE TYPE "EstadoJuego" AS ENUM ('creado', 'invitacion', 'listoparaempezar', 'iniciado', 'finalizado');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('BS', 'US');

-- CreateEnum
CREATE TYPE "EstadoInvitacion" AS ENUM ('Enviado', 'Aceptado', 'Rechazado', 'Cancelado');

-- CreateEnum
CREATE TYPE "Periodos" AS ENUM ('Semanal', 'Quincenal', 'Mensual', 'Personalizado');

-- CreateTable
CREATE TABLE "Juegos" (
    "id" SERIAL NOT NULL,
    "estado_juego" "EstadoJuego" NOT NULL DEFAULT 'creado',
    "moneda" "Moneda" NOT NULL DEFAULT 'BS',
    "nombre" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "monto_total" INTEGER NOT NULL,
    "cant_invitados" INTEGER,
    "cant_participantes" INTEGER,

    CONSTRAINT "Juegos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitados" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telf" TEXT NOT NULL,

    CONSTRAINT "Invitados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitados_Juegos" (
    "id_invitado" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "estado_invitacion" "EstadoInvitacion" NOT NULL,
    "fecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitados_Juegos_pkey" PRIMARY KEY ("id_invitado","id_juego")
);

-- CreateTable
CREATE TABLE "Turnos" (
    "id" SERIAL NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "fecha_turno" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jugadores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telf" TEXT NOT NULL,

    CONSTRAINT "Jugadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jugadores_Juegos" (
    "id" SERIAL NOT NULL,
    "id_jugador" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "id_jugador_grupo_turno" INTEGER NOT NULL,
    "fecha_ingreso" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "detalle" TEXT,

    CONSTRAINT "Jugadores_Juegos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jugador_Grupo_Turno" (
    "id_jugador_juego" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,

    CONSTRAINT "Jugador_Grupo_Turno_pkey" PRIMARY KEY ("id_jugador_juego","id_turno")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitados_correo_key" ON "Invitados"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Invitados_telf_key" ON "Invitados"("telf");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_nombre_key" ON "Jugadores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_correo_key" ON "Jugadores"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_telf_key" ON "Jugadores"("telf");

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
