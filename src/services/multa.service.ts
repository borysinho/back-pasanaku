import {
  HttpStatusCodes400,
  defaultNotificarCreadorRemplazanteNoHaPagadoMulta,
  defaultNotificarCreadorVaAReemplazar,
  defaultNotificarJugadorExpulsado,
  defaultNotificarTodosLosPagosTurnosCompletados,
  defaultProgramarFinDeTiempoDePagosMultas,
  fechaHoraActual,
  programarInicioDeUnNuevoTurno,
  sumarSegundosAFecha,
} from "../utils";
import {
  actualizarJugador,
  obtenerCreadorDeJuego,
  obtenerJugador,
  obtenerJugadorExpulsadoDesdeJugador_Juego,
  obtenerJugador_JuegoPorId,
  obtenerJugadores_JuegosDeUnJuego,
} from "./jugador.service";
import {
  notificarTodosLosPagosFueronCompletados,
  sendFcmMessage,
} from "./notificacion.service";
import { validarQueTodosLosJugadores_JuegosHayanPagadoElTurno } from "./pago.service";
import prisma from "./prisma.service";
import { Jugadores_Juegos, Pagos, Prisma } from "@prisma/client";
import { obtenerTurnoPorId } from "./turno.service";
import { HttpException } from "../exceptions";
import { actualizarJugador_Juego, obtenerJuego } from "./juego.service";
import { crearExpulsado } from "./expulsado.service";

export const srvGetPagosMultas = async (
  id_jugador_juego: number,
  id_juego: number
) => {
  const pagosMultas = await prisma.pagosTurnos.findMany({
    where: {
      pago: {
        id_jugador_juego,
      },
      turno: {
        id_juego,
      },
    },
  });

  return pagosMultas;
};

export const srvGetPagosMultasById = async (
  id_solicitud_pago_multa: number,
  id_turno: number
) => {
  const pagoMulta = await prisma.pagosTurnos.findFirst({
    where: {
      id_pago: id_solicitud_pago_multa,
      id_turno,
    },
  });

  return pagoMulta;
};

export const srvCreatePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number,
  data: Prisma.PagosTurnosCreateInput
) => {
  const pagoMulta = await prisma.pagosTurnos.create({
    data: {
      ...data,
      pago: {
        connect: {
          id: id_solicitud_pago_multa,
        },
      },
      turno: {
        connect: {
          id: id_turno,
        },
      },
    },
  });

  // Obtenemos el jugador_juego del pago que se está realizando
  const jugador_juego = await prisma.jugadores_Juegos.findFirst({
    where: {
      Pagos: {
        some: {
          pagos_turnos: {
            some: {
              id_pago: pagoMulta.id_pago,
            },
          },
        },
      },
    },
  });

  if (jugador_juego && jugador_juego.estado === "RemplazandoExpulsado") {
    const turno = await prisma.turnos.findUnique({
      where: {
        id: id_turno,
      },
    });

    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "Turno no encontrado"
      );
    }

    defaultProgramarFinDeTiempoDePagosMultas(
      sumarSegundosAFecha(fechaHoraActual(), 15),
      id_turno
    );
  }

  return pagoMulta;
};

export const srvUpdatePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number,
  data: Prisma.PagosTurnosUpdateInput
) => {
  const pagoMulta = await prisma.pagosTurnos.update({
    where: {
      id: {
        id_pago: id_solicitud_pago_multa,
        id_turno,
      },
    },
    data,
  });

  return pagoMulta;
};

export const srvDeletePagosMultas = async (
  id_solicitud_pago_multa: number,
  id_turno: number
) => {
  const pagoMulta = await prisma.pagosTurnos.delete({
    where: {
      id: {
        id_pago: id_solicitud_pago_multa,
        id_turno,
      },
    },
  });

  return pagoMulta;
};

export const inicioDePagoDeMultas = async (id_turno: number) => {
  /**
  1. Al ejecutarse el inicio tiempo de multas, valida si todos pagaron. 
	1.1 Si todos pagaron, se coloca el estado del turno en finalizado, se notifica a los usuarios que el turno finalizó y que todos los jugadores pagaron sus cuotas correctamente y se programa el inicio del siguiente turno para unos segundos después.
	1.2 Si no pagaron todos se programa la ejecución del fin de tiempo de multas.
   */
  const todos_pagaron =
    await validarQueTodosLosJugadores_JuegosHayanPagadoElTurno(id_turno);
  if (todos_pagaron) {
    await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "Finalizado",
      },
    });

    console.log(
      "Todos pagaron, se notifica a los jugadores y se programa el siguiente turno"
    );

    const turno = await prisma.turnos.findUnique({
      where: {
        id: id_turno,
      },
    });

    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "Turno no encontrado"
      );
    }

    // Notificamos a todos los jugadores que los pagos fueron completados
    await notificarTodosLosPagosFueronCompletados(id_turno);
    // Programamos el siguiente turno
    programarInicioDeUnNuevoTurno(
      sumarSegundosAFecha(fechaHoraActual(), 10),
      turno.id_juego,
      turno.tiempo_puja_seg,
      turno.tiempo_puja_seg + 15,
      turno.tiempo_pago_seg,
      turno.tiempo_pago_multas_seg
    );
  } else {
    // No todos pagaron, se programa el fin de tiempo de multas
  }
};

export const obtenerSolicitudesDePagoDeMultaDeJugador_Juego = async (
  // id_jugador_juego: number,
  jugadores_juegos: Jugadores_Juegos[]
) => {
  const pagos = await prisma.pagos.findMany({
    where: {
      id_jugador_juego: {
        in: jugadores_juegos.map((jugador_juego) => jugador_juego.id),
      },
      tipo_pago: "Multa",
      pagos_turnos: {
        none: {},
      },
    },
  });

  return pagos;
};

const obtenerSolicitudesDePagosDeMultasSinPagar = async (id_turno: number) => {
  const turno = await obtenerTurnoPorId(id_turno);

  if (!turno) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Turno no encontrado"
    );
  }

  const jugadores_juegos = await obtenerJugadores_JuegosDeUnJuego(
    turno.id_juego
  );

  if (!jugadores_juegos) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No se encontraron jugadores en el juego"
    );
  }

  const solicitudes = await obtenerSolicitudesDePagoDeMultaDeJugador_Juego(
    jugadores_juegos
  );

  return solicitudes;
};

const obtenerJugadores_JuegosDeUnaListaDeSolicitudesDePago = async (
  solicitudes: Pagos[]
) => {
  const jugadores_juegos = await prisma.jugadores_Juegos.findMany({
    where: {
      id: {
        in: solicitudes.map((solicitud) => solicitud.id_jugador_juego),
      },
    },
  });

  return jugadores_juegos;
};

const expulsarJugadorPorNoPagarMulta = async (id_jugador_juego: number) => {
  /**
   * 1. Agregamos al jugador a la lista de Expulsados
   * 2. Cambiamos el id_jugador del jugador_juego al creador del juego y colocamos el estado en RemplazandoExpulsado
   */
  const jugador_juego = await obtenerJugador_JuegoPorId(id_jugador_juego);
  if (!jugador_juego) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Jugador_Juego no encontrado"
    );
  }

  // Agregar al jugador a la lista de Expulsados
  const expulsado = await crearExpulsado({
    id_jugador: jugador_juego.id_jugador,
    id_jugador_juego: jugador_juego.id,
    detalle: "No pagó su multa",
    fecha: fechaHoraActual(),
  });

  const creador = await obtenerCreadorDeJuego(jugador_juego.id_juego);

  if (!creador) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Creador no encontrado"
    );
  }
  // Actualizamos el jugador_juego apuntando al creador del juego y colocamos el estado en RemplazandoExpulsado
  const jugador_juego_actualizado = await actualizarJugador_Juego(
    jugador_juego.id,
    {
      id_jugador: creador.id,
      estado: "RemplazandoExpulsado",
    }
  );

  const jugador_expulsado = await obtenerJugador(expulsado.id_jugador);

  return jugador_expulsado;
};

export const finDePagoMultas = async (id_turno: number) => {
  // TODO: Realizar el proceso de fin de tiempo de multas
  /**
   * 
0. Establecemos una bandera que indica si el juego se debe programar en true
1. Se verifica si todos han pagado sus multas
	1.1 Si pagaron sus multas, se notifica a los usuarios que el turno finalizó, que todos los jugadores pagaron sus cuotas correctamente y se inicia un nuevo turno
	1.2 Si NO pagaron sus multas, obtenemos una lista de jugadores_juegos_no_pagaron que no pagaron sus multas y luego RECORREMOS a TODOS los participantes del juego 
		1.2.1 Si el jugador_juego que se está analizando NO ha pagado su multa:
			1.2.1.1 Si el jugador_juego que se está analizando ES el creador y está remplazando a otro jugador que ya lo expulsaron
				1.2.1.1.1 El creador del juego que está remplazando a otro jugador que ya fue expulsado, de manera obligatoria debe pagar, por lo que se notifica al creador que el juego no se reanudará hasta que pague.
				1.2.1.1.2 Se notifica al resto de los participantes que el juego se ha detenido en espera de los pagos restantes
				1.2.1.1.3 Se establece la bandera indicando que el juego se debe programar en false
			1.2.1.2 Si el jugador_juego que se está analizando NO es el creador
				1.2.1.2.1 Se coloca el estado de jugadores_juegos del jugador que incumplió en su pago en el estado RetiroFozoso.
				1.2.1.2.2 Se crea un nuevo registro en la tabla jugadores_juegos con el ID del creador del juego y con el ID del juego para que reemplace al jugador_juego retirado; y para identificar a qué jugador_juego está remplazando, se coloca el id_jugador_juego_retirado apuntando al id del jugador_juego que fue expulsado.
				1.2.1.2.3 Se notifica al jugador_juego que ha sido expulsado por no cumplir con los pagos y que se ejecutará la garantía del juego.
		1.2.2 Si el jugador_juego que se está analizando SI ha pagado su multa:
			1.2.2.1 Se valida si el jugador_juego que se está analizando es el creador del juego:
				1.2.2.2.1 Si es el creador, entonces se envía una notificación personalizada indicando que se ha expulsado a los jugadores_juegos_no_pagaron, que debe ejecutar las garantías de cada uno de ellos y que se está ingresando al juego en lugar de ellos para continuar el juego.
				1.2.2.2.2 Si NO es el creador, entonces se envía una notificación al jugador_juego que se está analizando indicando que se han expulsado a los jugadores_juegos_no_pagaron y que el creador del juego está tomando sus lugares.
	1.3 Se valida el estado de la bandera preguntando si el juego se debe programar 
		1.3.1 Si se debe programar, entonces se programa el inicio del siguiente turno para unos segundos después.
		1.3.2 Si NO se debe programar, se finaliza el proceso y se continuará cuando se pague el turno y la multa
   */

  // Establecemos una bandera que indica si el juego se debe programar en true
  let programar_juego = true;

  // Verificamos si todos han pagado sus multas
  const solicitudesDePagoMultaSinPagar =
    await obtenerSolicitudesDePagosDeMultasSinPagar(id_turno);

  // Obtenemos datos del turno
  const turno = await obtenerTurnoPorId(id_turno);

  if (!turno) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Turno no encontrado"
    );
  }

  // Obtenemos el juego para enviar el nombre del juego en las notificaciones
  const juego = await obtenerJuego(turno.id_juego);

  if (!juego) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Juego no encontrado"
    );
  }

  // Si no hay multas sin pagar
  if (solicitudesDePagoMultaSinPagar.length === 0) {
    // Se notifica a los usuarios que el turno finalizó, que todos los jugadores pagaron sus cuotas correctamente y se inicia un nuevo turno
    // Corrección, solo se iniciará un nuevo turno sin notificar a los usuarios debido a que sería redundante

    // Programamos el inicio del siguiente turno
    programarInicioDeUnNuevoTurno(
      sumarSegundosAFecha(fechaHoraActual(), 10),
      id_turno,
      turno.tiempo_puja_seg,
      turno.tiempo_puja_seg + 15,
      turno.tiempo_pago_seg,
      turno.tiempo_pago_multas_seg
    );
  } else {
    // No pagaron, obtenemos una lista de jugadores_juegos_no_pagaron que no pagaron sus multas y luego RECORREMOS a TODOS los participantes del juego
    const jugadores_juegos_no_pagaron =
      await obtenerJugadores_JuegosDeUnaListaDeSolicitudesDePago(
        solicitudesDePagoMultaSinPagar
      );

    const jugadores_juegos = await obtenerJugadores_JuegosDeUnJuego(
      turno.id_juego
    );

    if (jugadores_juegos.length === 0) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se encontraron jugadores en el juego"
      );
    }

    //Recorremos todos los participantes del juego
    for (const key in jugadores_juegos) {
      const jugador_juego = jugadores_juegos[key];

      const noHaPagado = jugadores_juegos_no_pagaron.find(
        (jugador_juego_no_pago) => jugador_juego_no_pago.id === jugador_juego.id
      );
      // Si el jugador_juego que se está analizando NO ha pagado su multa
      if (noHaPagado) {
        // Si el jugador_juego que se está analizando ES el creador y está remplazando a otro jugador que ya lo expulsaron

        if (jugador_juego.estado === "RemplazandoExpulsado") {
          // El creador del juego está remplazando a otro jugador que ya fue expulsado y de manera obligatoria debe pagar, por lo que se notifica al creador que el juego no se reanudará hasta que pague.

          // Obtenemos el jugador para enviar la notificación
          const jugador = await obtenerJugador(jugador_juego.id_jugador);
          if (!jugador) {
            throw new HttpException(
              HttpStatusCodes400.BAD_REQUEST,
              "Jugador no encontrado"
            );
          }

          // Obtenemos el jugador_expulsado para enviar la notificación
          const jugador_expulsado =
            await obtenerJugadorExpulsadoDesdeJugador_Juego(jugador_juego.id);

          if (!jugador_expulsado) {
            throw new HttpException(
              HttpStatusCodes400.BAD_REQUEST,
              "Jugador expulsado no encontrado"
            );
          }

          const message = defaultNotificarCreadorRemplazanteNoHaPagadoMulta(
            jugador_juego.id,
            jugador.client_token,
            jugador_expulsado.nombre,
            juego.nombre
          );

          sendFcmMessage(message);

          // Se establece la bandera indicando que el juego se debe programar en false
          programar_juego = false;
        } else {
          // El jugador_juego que se está analizando NO es el creador
          // Expulsamos al jugador por no pagar la multa
          const jugador_expulsado = await expulsarJugadorPorNoPagarMulta(
            jugador_juego.id
          );

          if (!jugador_expulsado) {
            throw new HttpException(
              HttpStatusCodes400.BAD_REQUEST,
              "Jugador expulsado no encontrado"
            );
          }

          const messageJugadorExpulsado = defaultNotificarJugadorExpulsado(
            jugador_expulsado.id,
            juego.id,
            juego.nombre,
            jugador_expulsado.client_token
          );

          sendFcmMessage(messageJugadorExpulsado);

          const jugador_creador = await obtenerCreadorDeJuego(
            jugador_juego.id_juego
          );

          if (!jugador_creador) {
            throw new HttpException(
              HttpStatusCodes400.BAD_REQUEST,
              "Creador no encontrado"
            );
          }

          const messageCreadorVaAReemplazar =
            defaultNotificarCreadorVaAReemplazar(
              jugador_creador.id,
              juego.id,
              jugador_expulsado.nombre,
              juego.nombre,
              jugador_creador.client_token
            );
        }
      } else {
        // El jugador_juego que se está analizando es un jugador que ha pagado, o no tiene una solicitud de pago de multa porque realizó el pago de su turno a tiempo
      }
    }
  }

  // Validamos el estado de la bandera preguntando si el juego se debe programar
  if (programar_juego) {
    // Se debe programar, entonces se programa el inicio del siguiente turno para unos segundos después.
    programarInicioDeUnNuevoTurno(
      sumarSegundosAFecha(fechaHoraActual(), 10),
      juego.id,
      turno.tiempo_puja_seg,
      turno.tiempo_puja_seg + 15,
      turno.tiempo_pago_seg,
      turno.tiempo_pago_multas_seg
    );
  }
};

// obtenerSolicitudesDePagosDeMultasSinPagar(1);
