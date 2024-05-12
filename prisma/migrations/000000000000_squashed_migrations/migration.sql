-- CreateEnum
CREATE TYPE "EstadoJuego" AS ENUM ('Nuevo', 'Iniciado', 'Finalizado');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('BS', 'US');

-- CreateEnum
CREATE TYPE "EstadoNotificacion" AS ENUM ('EnvioCorrecto', 'EnvioIncorrecto');

-- CreateEnum
CREATE TYPE "EstadoInvitacion" AS ENUM ('Pendiente', 'Aceptado', 'Rechazado', 'Cancelado');

-- CreateEnum
CREATE TYPE "EstadoTurnos" AS ENUM ('Iniciado', 'TiempoOfertas', 'TiempoOfertasFinalizado', 'TiempoEsperandoQR', 'TiempoPagosTurnos', 'TiempoPagosTurnosFinalizado', 'TiempoPagosMultas', 'Finalizado');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Creador', 'Jugador');

-- CreateEnum
CREATE TYPE "Estado_Jugadores_Juego" AS ENUM ('Participando', 'RemplazandoExpulsado');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('Turno', 'Multa');

-- CreateTable
CREATE TABLE "Juegos" (
    "id" SERIAL NOT NULL,
    "estado_juego" "EstadoJuego" NOT NULL DEFAULT 'Nuevo',
    "moneda" "Moneda" NOT NULL DEFAULT 'BS',
    "nombre" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "monto_total" INTEGER NOT NULL,
    "cant_jugadores" INTEGER NOT NULL DEFAULT 0,
    "lapso_turnos_dias" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "Juegos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitados" (
    "id" SERIAL NOT NULL,
    "correo" TEXT NOT NULL,
    "telf" TEXT NOT NULL,

    CONSTRAINT "Invitados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitados_Juegos" (
    "id_invitado" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "estado_invitacion" "EstadoInvitacion" NOT NULL DEFAULT 'Pendiente',
    "estado_notificacion_whatsapp" "EstadoNotificacion" NOT NULL DEFAULT 'EnvioIncorrecto',
    "estado_notificacion_correo" "EstadoNotificacion" NOT NULL DEFAULT 'EnvioIncorrecto',
    "nombre_invitado" TEXT NOT NULL,
    "periodo" TEXT NOT NULL DEFAULT 'Mensual',
    "fecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitados_Juegos_pkey" PRIMARY KEY ("id_invitado","id_juego")
);

-- CreateTable
CREATE TABLE "Turnos" (
    "id" SERIAL NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "id_ganador_jugador_juego" INTEGER,
    "estado_turno" "EstadoTurnos" NOT NULL DEFAULT 'Iniciado',
    "fecha_turno" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fecha_inicio_puja" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tiempo_puja_seg" INTEGER NOT NULL DEFAULT 240,
    "fecha_inicio_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tiempo_pago_seg" INTEGER NOT NULL DEFAULT 240,
    "tiempo_pago_multas_seg" INTEGER NOT NULL DEFAULT 240,
    "nro_turno" INTEGER NOT NULL DEFAULT 1,
    "saldo_restante" INTEGER NOT NULL DEFAULT 0,
    "monto_minimo_puja" INTEGER NOT NULL DEFAULT 0,
    "monto_pago" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jugadores" (
    "id" SERIAL NOT NULL,
    "id_invitado" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "client_token" TEXT NOT NULL DEFAULT '',
    "qr" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Jugadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expulsados" (
    "id_jugador" INTEGER NOT NULL,
    "id_jugador_juego" INTEGER NOT NULL,
    "detalle" TEXT,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expulsados_pkey" PRIMARY KEY ("id_jugador","id_jugador_juego")
);

-- CreateTable
CREATE TABLE "Jugadores_Juegos" (
    "id" SERIAL NOT NULL,
    "rol" "Roles" NOT NULL DEFAULT 'Jugador',
    "estado" "Estado_Jugadores_Juego" NOT NULL DEFAULT 'Participando',
    "id_jugador" INTEGER NOT NULL,
    "id_juego" INTEGER NOT NULL,
    "fecha_ingreso" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jugadores_Juegos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jugador_Grupo_Turno" (
    "monto_puja" INTEGER NOT NULL,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jugador_juego" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,

    CONSTRAINT "Jugador_Grupo_Turno_pkey" PRIMARY KEY ("id_jugador_juego","id_turno")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "id" SERIAL NOT NULL,
    "tipo_pago" "TipoPago" NOT NULL DEFAULT 'Turno',
    "monto" INTEGER NOT NULL,
    "detalle" TEXT,
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_jugador_juego" INTEGER NOT NULL,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagosTurnos" (
    "id_pago" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "monto_pagado" INTEGER NOT NULL,
    "detalle" TEXT DEFAULT '',
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagosTurnos_pkey" PRIMARY KEY ("id_pago","id_turno")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitados_correo_key" ON "Invitados"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Invitados_telf_key" ON "Invitados"("telf");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_id_invitado_key" ON "Jugadores"("id_invitado");

-- CreateIndex
CREATE UNIQUE INDEX "Jugadores_usuario_key" ON "Jugadores"("usuario");

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitados_Juegos" ADD CONSTRAINT "Invitados_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_id_ganador_jugador_juego_fkey" FOREIGN KEY ("id_ganador_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores" ADD CONSTRAINT "Jugadores_id_invitado_fkey" FOREIGN KEY ("id_invitado") REFERENCES "Invitados"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expulsados" ADD CONSTRAINT "Expulsados_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expulsados" ADD CONSTRAINT "Expulsados_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_juego_fkey" FOREIGN KEY ("id_juego") REFERENCES "Juegos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugadores_Juegos" ADD CONSTRAINT "Jugadores_Juegos_id_jugador_fkey" FOREIGN KEY ("id_jugador") REFERENCES "Jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jugador_Grupo_Turno" ADD CONSTRAINT "Jugador_Grupo_Turno_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_id_jugador_juego_fkey" FOREIGN KEY ("id_jugador_juego") REFERENCES "Jugadores_Juegos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosTurnos" ADD CONSTRAINT "PagosTurnos_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "Pagos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagosTurnos" ADD CONSTRAINT "PagosTurnos_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turnos"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

