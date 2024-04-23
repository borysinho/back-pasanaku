import cron from "node-cron";
import { HttpException } from "../exceptions";
import { HttpStatusCodes500 } from "./http.status.code.utils";
import { notificarGanadorDeTurno } from "../services";

// Función para programar un evento en una fecha y hora específica
export const programarGanadorDeJuego = (fechaHora: Date, id_juego: number) => {
  // Convertimos la fecha y hora a formato cron
  const cronExpresion = `${fechaHora.getSeconds()} ${fechaHora.getMinutes()} ${fechaHora.getHours()} ${fechaHora.getDate()} ${
    fechaHora.getMonth() + 1
  } *`;

  // Programamos el evento
  try {
    cron.schedule(cronExpresion, async function () {
      console.log(
        `Tiempo de pujas finalizado. Notificando a participantes el ganador del juego ${id_juego}`
      );
      await notificarGanadorDeTurno(id_juego);
    });
    return { error: false, data: "Notificaciones programadas correctamente" };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar las notificaciones"
    );
  }
};
