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

export const defaultInicioDePagosAlGanador = (
  id_jugador_juego: number,
  id_jugador_notif: number,
  nombre_juego: string,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Inicio de pagos para ${nombre_juego}`,
      body: `Se ha iniciado el tiempo de realizar los pagos del turno.
Se te notificará conforme vayas recibiendo los pagos.`,
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

export const defaultFinDeTiempoDePagos = (
  id_jugador_juego: number,
  id_jugador_notif: number,
  nombre_juego: string,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Fin de pagos para ${nombre_juego}`,
      body: `El tiempo de pagos ha finalizado.`,
    },
    data: {
      event: "fin-pagos",
      id_jugador_juego: id_jugador_juego.toString(),
      id_jugador_notif: id_jugador_notif.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarPagoAGanador = (
  id_jugador_juego: number,
  token: string,
  nombre_remitente: string,
  monto: number,
  detalle: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: `Pago recibido de ${nombre_remitente}`,
      body: `Has recibido un pago de ${monto} de ${nombre_remitente}`,
    },
    data: {
      event: "pago-recibido",
      id_jugador_juego: id_jugador_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarTodosLosPagosTurnosCompletados = (
  id_jugador: number,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "Todos los pagos han sido completados",
      body: "Todos los pagos del turno han sido completados.",
    },
    data: {
      event: "todos-los-pagos-completados",
      id_jugador: id_jugador.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarFinDeJuego = (
  id_juego: number,
  token: string,
  nombre_juego: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "Fin de juego",
      body: `El juego ${nombre_juego} ha finalizado.`,
    },
    data: {
      event: "fin-juego",
      id_juego: id_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarCreadorRemplazanteNoHaPagadoMulta = (
  id_jugador_juego: number,
  token: string,
  nombreJugadorExpulsado: string,
  nombreJuego: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "No se ha pagado la multa",
      body: `Está remplazando a ${nombreJugadorExpulsado} en el juego ${nombreJuego} y tiene una multa pendiente.
El juego se ha detenido hasta que realice el pago de su multa.`,
    },
    data: {
      event: "creador-remplazante-no-ha-pagado-multa",
      id_jugador_juego: id_jugador_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarJugadorExpulsado = (
  id_jugador_expulsado: number,
  id_juego: number,
  nombreJuego: string,
  token: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "Expulsión de juego",
      body: `Has sido expulsado del juego ${nombreJuego}.`,
    },
    data: {
      event: "jugador-expulsado",
      id_jugador: id_jugador_expulsado.toString(),
      id_juego: id_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};

export const defaultNotificarCreadorVaAReemplazar = (
  id_jugador_creador: number,
  id_juego: number,
  nombreJugadorExpulsado: string,
  nombreJuego: string,
  token_creador: string
) => {
  const message: TFBMessage = {
    token: token_creador,
    notification: {
      title: "Reemplazo de jugador",
      body: `Vas a reemplazar a ${nombreJugadorExpulsado} en el juego ${nombreJuego} debido a que no pagó su multa.
En tu lista de juegos aparecerá "reemplazando a" para que puedas identificarlo.`,
    },
    data: {
      event: "creador-va-a-reemplazar",
      id_jugador_creador: id_jugador_creador.toString(),
      id_juego: id_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };
};
