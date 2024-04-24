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
  nombre_juego: string,
  nombre_ganador: string,
  monto_puja: number,
  moneda: Moneda
) => {
  const mensaje: string =
    monto_puja === 0
      ? `No se recibieron ofertas para el turno. 
El ganador del turno aleatoriamente es  ${nombre_ganador}. 
¡Felicidades!`
      : `El ganador del turno es ${nombre_ganador} con ${monto_puja} ${moneda}.
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
    },
    android: {
      priority: "HIGH",
    },
  };

  return { message };
};
