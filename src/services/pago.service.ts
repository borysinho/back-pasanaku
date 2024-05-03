import { connect } from "http2";
import prisma from "./prisma.service";
import { HttpException } from "../exceptions";
import { HttpStatusCodes400, defaultNotificarPagoAGanador } from "../utils";
import { obtenerTurnoPorId } from "./turno.service";
import { sendFcmMessage } from "./notificacion.service";
export const obtenerPagosTurnos = async (id_turno: number) => {
  const pagos_turnos = await prisma.pagos.findMany({
    where: {
      pagos_turnos: {
        some: {
          id_turno,
        },
      },
    },
    include: {
      pagos_turnos: true,
    },
  });

  console.log({ pagos_turnos });
  return pagos_turnos;
};

export const obtenerPagosDeJugador_JuegoEnTurno = async (
  id_jugador_juego: number,
  id_turno: number
) => {
  const pagos = await prisma.pagos.findMany({
    where: {
      id_jugador_juego,
      pagos_turnos: {
        some: {
          id_turno,
        },
      },
    },
  });

  return pagos;
};

export const crearPagos_Turnos = async (
  id_jugador_juego_destinatario: number,
  id_jugador_remitente: number,
  id_turno: number,
  monto_pagado: number,
  detalle: string = ""
) => {
  const turno = await obtenerTurnoPorId(id_turno);
  if (!turno) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Turno no encontrado"
    );
  }
  const jugador_juego_remintente = await prisma.jugadores_Juegos.findFirst({
    where: {
      id_juego: turno.id_juego,
      id_jugador: id_jugador_remitente,
    },
  });

  if (!jugador_juego_remintente) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Jugador_Juego del Remitente no encontrado en el juego"
    );
  }

  if (turno.estado_turno !== "TiempoPagosTurnos") {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "El turno no se encuentra en la etapa de pagos"
    );
  }

  const jugador_juego_destinatario = await prisma.jugadores_Juegos.findUnique({
    where: {
      id: id_jugador_juego_destinatario,
    },
  });

  if (!jugador_juego_destinatario) {
    throw new Error("Jugador_Juego no encontrado");
  }

  const jugador_destinatario = await prisma.jugadores.findUnique({
    where: {
      id: jugador_juego_destinatario.id_jugador,
    },
  });

  if (!jugador_destinatario) {
    throw new Error("Jugador no encontrado");
  }

  const jugador_remitente = await prisma.jugadores.findUnique({
    where: {
      id: id_jugador_remitente,
    },
  });

  if (!jugador_remitente) {
    throw new Error("Jugador no encontrado");
  }

  const solicitudPago = await prisma.pagos.findFirst({
    where: {
      id_jugador_juego: jugador_juego_remintente.id,
      tipo_pago: "Turno",
      NOT: {
        pagos_turnos: {
          some: {
            id_turno,
          },
        },
      },
    },
  });

  if (solicitudPago === null) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "La solicitud de pago no ha sido previamente registrada"
    );
  }

  const pago_turno = await prisma.pagosTurnos.create({
    data: {
      id_pago: solicitudPago.id,
      id_turno,
      monto_pagado,
      detalle,
    },
  });

  const message = defaultNotificarPagoAGanador(
    jugador_juego_destinatario.id,
    jugador_destinatario.client_token,
    jugador_remitente.nombre,
    monto_pagado,
    detalle
  );
  require("util").inspect.defaultOptions.depth = null;
  console.log({ MensajeNotificacionDePago: message });
  sendFcmMessage(message);

  return pago_turno;
};

export const obtenerSolicitudesDePagoDeJugador_Juego = async (
  id_jugador_juego: number
) => {
  const pagos = await prisma.pagos.findMany({
    where: {
      id_jugador_juego,
      tipo_pago: "Turno",
      pagos_turnos: {
        none: {},
      },
    },
  });

  return pagos;
};
