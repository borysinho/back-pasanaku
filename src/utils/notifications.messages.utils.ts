import { Moneda } from "@prisma/client";
import { formatearTiempo } from "./fechas.utils";

type TFBNotification = {
  title?: string;
  body?: string;
  image?: string;
};

export type TFBMessage = {
  token?: string;

  notification: TFBNotification;
  data: Object;
  android?: {
    priority: string;
  };
};

export const defaultInicioOfertas = (
  token: string,
  nombre_juego: string,
  id_juego: number,
  id_jugador_notif: number,
  fecha_fin: Date,
  tiempo_restante_seg: number
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Inicio de ofertas para ${nombre_juego}`,
      body: `Tiene ${formatearTiempo(
        tiempo_restante_seg
      )} para poder realizar su oferta`,
    },
    data: {
      event: "inicio-ofertas",
      id_juego: id_juego.toString(),
      id_jugador_notif: id_jugador_notif.toString(),
      fecha_fin:
        fecha_fin.toLocaleDateString() + " " + fecha_fin.toLocaleTimeString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultFinOfertas = (
  token: string,
  id_juego: number,
  id_jugador_ganador: number,
  id_jugador_notif: number,
  nombre_juego: string,
  nombre_ganador: string,
  monto_puja: number,
  moneda: Moneda
) => {
  const mensaje: string =
    monto_puja === 0
      ? `${nombre_ganador} ganó aleatoriamente el turno. 
¡Felicidades!`
      : `${nombre_ganador} ganó el turno con ${monto_puja} ${moneda}.
¡Felicidades!`;
  const message: TFBMessage = {
    token,
    notification: {
      title: `Fin de ofertas para ${nombre_juego}`,
      body: mensaje,
    },
    data: {
      event: "fin-ofertas",
      id_juego: id_juego.toString(),
      id_jugador_ganador: id_jugador_ganador.toString(),
      id_jugador_notif: id_jugador_notif.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultInvitacionAJuego = (
  id_juego: number,
  id_jugador: number,
  nombre_juego: string,
  nombre_creador: string,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Invitación a juego ${nombre_juego}`,
      body: `${nombre_creador} te ha invitado a unirte al juego ${nombre_juego}.`,
    },
    data: {
      event: "invitacion-juego",
      id_juego: id_juego.toString(),
      id_jugador: id_jugador.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultGanadorDeTurno = (
  id_jugador: number,
  id_jugador_notif: number,
  tiene_qr: boolean,
  monto_puja: number,
  moneda: Moneda,
  token: string
) => {
  const event = tiene_qr ? "fin-ofertas" : "ganador-debe-subir-qr";
  const body = tiene_qr
    ? `¡Felicidades! Has ganado el turno con ${monto_puja} ${moneda}.`
    : `¡Felicidades! Has ganado el turno con ${monto_puja} ${moneda}. 
Sube tu QR para que los demás jugadores puedan realizar su pago correspondiente.`;
  const message: TFBMessage = {
    token,
    notification: {
      title: "¡Eres el ganador!",
      body,
    },
    data: {
      event,
      id_jugador: id_jugador.toString(),
      id_jugador_notif: id_jugador_notif.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultInicioDePagos = (
  id_jugador_juego: number,
  id_jugador_notif: number,
  nombre_juego: string,
  qr: string,
  monto_a_pagar: number,
  moneda: Moneda,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Inicio de pagos para ${nombre_juego}`,
      body: `Realiza tu pago de ${monto_a_pagar} ${moneda}.`,
      image: qr,
    },
    data: {
      event: "inicio-pagos",
      id_jugador_juego: id_jugador_juego.toString(),
      id_jugador_notif: id_jugador_notif.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};
