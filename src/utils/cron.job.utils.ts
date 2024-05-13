import cron from "node-cron";
import { HttpException } from "../exceptions";
import { HttpStatusCodes500 } from "./http.status.code.utils";
import {
  inicioDePagoDeMultas,
  iniciarTurno,
  finDePagoMultas,
} from "../services";
import {
  notificarFinDePagosDeTurnos,
  notificarGanadorDeTurno,
  notificarInicioDePagosDeTurnos,
} from "../services";

const cronExpresion = (fechaHora: Date) => {
  return `${fechaHora.getSeconds()} ${fechaHora.getMinutes()} ${fechaHora.getHours()} ${fechaHora.getDate()} ${
    fechaHora.getMonth() + 1
  } *`;
};

// Función para programar un evento en una fecha y hora específica
export const programarDeterminarGanadorDeJuego = (
  fechaHora: Date,
  id_juego: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando notificaciones para juego ${id_juego}. Fecha: ${fechaHora}`
    );
    cron.schedule(expr, async function () {
      console.log(
        `Tiempo de pujas finalizado. Notificando a participantes el ganador del juego ${id_juego}`
      );
      await notificarGanadorDeTurno(id_juego);
      console.log("Notificaciones de ganador de turno enviadas");
    });
    return { error: false, data: "Notificaciones programadas correctamente" };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar las notificaciones"
    );
  }
};

export const programarNotificarInicioDePagos = (
  fechaHora: Date,
  id_turno: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando las notificaciones para el inicio de los Pagos para el turno id:${id_turno} en fecha ${
        fechaHora.toLocaleDateString
      } ${fechaHora.toLocaleTimeString()}`
    );
    cron.schedule(expr, async function () {
      console.log(
        `Envinado notificaciones sobre el inicio de Pagos para el Turno id:${id_turno}.`
      );
      await notificarInicioDePagosDeTurnos(id_turno);
      console.log(
        "Proceso envío de notificaciones del inicio de Pagos Finalizado."
      );
    });
    return { error: false, data: "Notificaciones programadas correctamente" };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar las notificaciones"
    );
  }
};

// Este proceso se encarga de dar inicio a los pagos de un turno. Durante este tiempo los jugadores podrán realizar sus pagos
// Se necesita el id del turno y la fecha y hora en la que se desea que inicie el proceso.
export const programarFinDeTiempoDePagos = (
  fechaHora: Date,
  id_turno: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando fin de Pagos para el turno ${id_turno} en fecha ${fechaHora.toLocaleDateString()}`
    );
    cron.schedule(expr, async function () {
      console.log(`Tiempo de Pagos Finalizado para el turno ${id_turno}.`);
      await notificarFinDePagosDeTurnos(id_turno);
      console.log("Procesode Fin de Pagos terminado.");
    });
    return { error: false, data: "Notificaciones programadas correctamente" };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar si los pagos fueron realizados correctamente"
    );
  }
};

// Este proceso se encarga de programar el inicio del tiempo de pago de las multas de un turno.
// Se necesita el id del turno y la fecha y hora en la que se desea que inicie el proceso.
export const programarInicioDeTiempoDePagoDeMultas = (
  fechaHora: Date,
  id_turno: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando inicio de Pagos de Multas para el turno ${id_turno} en fecha ${fechaHora.toLocaleDateString()}`
    );
    cron.schedule(expr, async function () {
      console.log(`Inicio de Pagos de Multas para el turno ${id_turno}.`);
      inicioDePagoDeMultas(id_turno);
      console.log("Proceso de inicio de Pagos terminado.");
    });
    return { error: false, data: "Notificaciones programadas correctamente" };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar si los pagos fueron realizados correctamente"
    );
  }
};

// Este proceso se encarga de iniciar un nuevo turno enviando nuevos tiempos de pujas y pagos.
export const programarInicioDeUnNuevoTurno = (
  fechaHora: Date,
  id_juego: number,
  tiempo_puja_seg: number,
  tiempo_inicio_pago_seg: number,
  tiempo_pago_seg: number,
  tiempo_pago_multas_seg: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando inicio de un nuevo turno para el juego ${id_juego} en fecha ${fechaHora.toLocaleDateString()}`
    );
    cron.schedule(expr, async function () {
      console.log(`Inicio de un nuevo turno para el juego ${id_juego}.`);
      await iniciarTurno(
        id_juego,
        tiempo_puja_seg,
        tiempo_inicio_pago_seg,
        tiempo_pago_seg,
        tiempo_pago_multas_seg
      );
      console.log("Proceso de inicio de un nuevo turno terminado.");
    });
    return {
      error: false,
      data: "Proceso de inicio de nuevo turno ejecutado correctamente",
    };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar si los pagos fueron realizados correctamente"
    );
  }
};

export const defaultProgramarFinDeTiempoDePagosMultas = (
  fechaHora: Date,
  id_turno: number
) => {
  // Convertimos la fecha y hora a formato cron
  const expr = cronExpresion(fechaHora);

  // Programamos el evento
  try {
    console.log(
      `Programando fin de Pagos de Multas para el turno ${id_turno} en fecha ${fechaHora.toLocaleDateString()}`
    );
    cron.schedule(expr, async function () {
      console.log(
        `Ejecutando proceso Fin de Pagos de Multas para el turno ${id_turno}.`
      );
      await finDePagoMultas(id_turno);
      console.log("Proceso de fin de Pagos terminado.");
    });
    return {
      error: false,
      data: "Proceso de Fin de Pagos de Multas ejecutado correctamente",
    };
  } catch (error: any) {
    throw new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      "Error al programar si los pagos fueron realizados correctamente"
    );
  }
};
