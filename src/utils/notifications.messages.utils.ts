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
  let title = "";
  let body = "";
  if (tiene_qr) {
    title = `¡Eres el ganador!`;
    body = `¡Felicidades! Has ganado el turno con ${monto_puja} ${moneda}.`;
    if (monto_puja === 0) {
      body = `¡Felicidades! Has ganado el turno aleatoriamente.`;
    }
  } else {
    title = `Ganaste el turno con ${monto_puja} ${moneda}`;
    body = `Sube tu QR para que los demás jugadores puedan realizar su pago correspondiente.`;
  }

  const message: TFBMessage = {
    token,
    notification: {
      title,
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
      body: `Se te notificará conforme vayas recibiendo los pagos.`,
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
      body: `Estás remplazando a ${nombreJugadorExpulsado} en el juego ${nombreJuego} y tienes una multa pendiente.
El juego se ha detenido hasta que realices el pago de tu multa.`,
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

export const defaultNotificarCreadorNoHaPagadoMulta = (
  id_jugador_juego: number,
  token: string,
  nombreJuego: string
) => {
  const message: TFBMessage = {
    token,
    notification: {
      title: "No se ha pagado la multa",
      body: `Eres el creador del juego ${nombreJuego} y no has pagado tu multa pendiente.
El juego se ha detenido hasta que realices el pago de tu multa.`,
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
      body: `Se ha expulsado a ${nombreJugadorExpulsado} en el juego ${nombreJuego} y debes pagar su multa para que el juego continúe.
En tu lista de juegos podrás identificar un juego como reemplazante.`,
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

  return { message };
};

export const defaultNotificarNadiePagoMulta = (
  id_juego: number,
  nombreJuego: string,
  token_creador: string
) => {
  const message: TFBMessage = {
    token: token_creador,
    notification: {
      title: "Nadie ha pagado la multa",
      body: `Nadie ha pagado la multa en el juego ${nombreJuego} y el juego ha finalizado.`,
    },
    data: {
      event: "nadie-pago-multa",
      id_juego: id_juego.toString(),
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};
