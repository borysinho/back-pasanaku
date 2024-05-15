import {
  HttpStatusCodes400,
  defaultNotificarCreadorNoHaPagadoMulta,
  defaultNotificarCreadorRemplazanteNoHaPagadoMulta,
  defaultNotificarCreadorVaAReemplazar,
  defaultNotificarJugadorExpulsado,
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
import {
  obtenerJugadores_JuegosQueNoHanPagadoElTurno,
  validarQueTodosLosJugadores_JuegosHayanPagadoElTurno,
} from "./pago.service";
import prisma from "./prisma.service";
import { Jugadores_Juegos, Pagos, Prisma } from "@prisma/client";
import { obtenerTurnoPorId } from "./turno.service";
import { HttpException } from "../exceptions";
import {
  actualizarJuego,
  actualizarJugador_Juego,
  obtenerJuego,
} from "./juego.service";
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

const registrarSolicitudesDePagoPorMulta = async (id_turno: number) => {
  // Obtenemos los jugadores_juegos que no pagaron su turno
  const jugadores_juegos_no_pagaron =
    await obtenerJugadores_JuegosQueNoHanPagadoElTurno(id_turno);

  // Obtenemos el valor del turno
  const turno = await obtenerTurnoPorId(id_turno);
  if (!turno) {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Turno no encontrado"
    );
  }
  // Aplicamos una multa del 20% del valor del turno a los jugadores_juegos que no pagaron
  // const multa = 0.2;
  for (const key in jugadores_juegos_no_pagaron) {
    const jugador_juego_no_pago = jugadores_juegos_no_pagaron[key];

    const multa = turno.monto_pago * 0.2;

    const solicitud_pago = await prisma.pagos.create({
      data: {
        id_jugador_juego: jugador_juego_no_pago.id,
        monto: multa,
        tipo_pago: "Multa",
        detalle: "Multa por no pagar turno",
      },
    });
  }
};

export const inicioDePagoDeMultas = async (id_turno: number) => {
  /**
  1. Al ejecutarse el inicio tiempo de multas, valida si todos pagaron. 
	1.1 Si todos pagaron, se coloca el estado del turno en finalizado, se notifica a los usuarios que el turno finalizó y que todos los jugadores pagaron sus cuotas correctamente y se programa el inicio del siguiente turno para unos segundos después.
	1.2 Si no pagaron todos se registra una solicitud de pago por multa y luego se programa la ejecución del fin de tiempo de multas.
   */
  const todos_pagaron =
    await validarQueTodosLosJugadores_JuegosHayanPagadoElTurno(id_turno);
  console.log({ todos_pagaron });
  if (todos_pagaron) {
    console.log("TODOS PAGARON SUS TURNOS, PROGRAMAMOS EL SIGUIENTE TURNO");
    const turno = await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "Finalizado",
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
    console.log(
      "NO TODOS PAGARON SUS TURNOS, PROGRAMAMOS EL FIN DE TIEMPO DE MULTAS"
    );

    // Actualizamos el turno a TiempoPagosMultas
    const turno = await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "TiempoPagosMultas",
      },
    });
    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "Turno no encontrado"
      );
    }

    // Registramos una solicitud de pago de multas
    await registrarSolicitudesDePagoPorMulta(id_turno);

    defaultProgramarFinDeTiempoDePagosMultas(
      sumarSegundosAFecha(fechaHoraActual(), turno.tiempo_pago_multas_seg),
      id_turno
    );
  }
};

export const solicitudesDePogoMultaDeListaDeJugador_Juego = async (
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

export const srvSolicitudesDePagoMultaSinPagarDeJugador_Juego = async (
  id_jugador_juego: number
) => {
  const pagos = await prisma.pagos.findMany({
    where: {
      id_jugador_juego,
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

  const solicitudes = await solicitudesDePogoMultaDeListaDeJugador_Juego(
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

const finalizarPorFaltaDePago = async (id_turno: number) => {
  const turno = await prisma.turnos.update({
    where: {
      id: id_turno,
    },
    data: {
      estado_turno: "Finalizado",
    },
  });

  await actualizarJuego(turno.id_juego, { estado_juego: "Finalizado" });
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
  // let programar_nuevo_turno = true;

  // Verificamos si todos han pagado sus multas
  const solicitudesDePagoMultaSinPagar =
    await obtenerSolicitudesDePagosDeMultasSinPagar(id_turno);

  const participantes = await obtenerJugadores_JuegosDeUnJuego(id_turno);

  if (solicitudesDePagoMultaSinPagar.length + 1 === participantes.length) {
    // Nadie pagó sus multas, el juego finaliza
    console.log("NADIE PAGÓ SUS MULTAS, EL JUEGO FINALIZA");
    await finalizarPorFaltaDePago(id_turno);
    return;
  }

  console.log({ SOLICITUDES_SIN_PAGAR: solicitudesDePagoMultaSinPagar });

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
    console.log("NO HAY MULTAS SIN PAGAR, PROGRAMAMOS EL SIGUIENTE TURNO");
    // Se notifica a los usuarios que el turno finalizó, que todos los jugadores pagaron sus cuotas correctamente y se inicia un nuevo turno
    // Corrección, solo se iniciará un nuevo turno sin notificar a los usuarios debido a que sería redundante

    // Actualizamos el turno a Finalizado
    const turno = await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "Finalizado",
      },
    });

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
    console.log("HAY MULTAS SIN PAGAR, PROCESAMOS LOS JUGADORES");
    const jugadores_juegos_no_pagaron =
      await obtenerJugadores_JuegosDeUnaListaDeSolicitudesDePago(
        solicitudesDePagoMultaSinPagar
      );

    console.log({ jugadores_juegos_no_pagaron });

    // Recorremos únicamente los jugadores_juegos que no pagaron
    for (const key in jugadores_juegos_no_pagaron) {
      const jugador_juego_no_pago = jugadores_juegos_no_pagaron[key];

      console.log({ jugador_juego_no_pago });

      const jugador_no_pago = await obtenerJugador(
        jugador_juego_no_pago.id_jugador
      );

      if (!jugador_no_pago) {
        throw new HttpException(
          HttpStatusCodes400.BAD_REQUEST,
          "Jugador no encontrado"
        );
      }

      if (
        (jugador_juego_no_pago.estado === "RemplazandoExpulsado" ||
          jugador_juego_no_pago.rol === "Creador") &&
        jugador_no_pago.client_token !== ""
      ) {
        // Obtenemos el jugador para enviar la notificación

        // Obtenemos el jugador_expulsado para enviar la notificación
        const jugador_expulsado =
          await obtenerJugadorExpulsadoDesdeJugador_Juego(
            jugador_juego_no_pago.id
          );

        if (!jugador_expulsado) {
          throw new HttpException(
            HttpStatusCodes400.BAD_REQUEST,
            "Jugador expulsado no encontrado"
          );
        }

        if (jugador_no_pago.client_token !== "") {
          let message;
          if (jugador_juego_no_pago.rol === "Creador") {
            message = defaultNotificarCreadorNoHaPagadoMulta(
              jugador_juego_no_pago.id,
              jugador_no_pago.client_token,
              juego.nombre
            );
          } else {
            message = defaultNotificarCreadorRemplazanteNoHaPagadoMulta(
              jugador_juego_no_pago.id,
              jugador_no_pago.client_token,
              jugador_expulsado.nombre,
              juego.nombre
            );
          }
          sendFcmMessage(message);
        }

        // Se establece la bandera indicando que el juego se debe programar en false
        // programar_nuevo_turno = false;
      } else {
        // El jugador_juego que se está analizando NO es el creador
        // Expulsamos al jugador por no pagar la multa
        const jugador_expulsado = await expulsarJugadorPorNoPagarMulta(
          jugador_juego_no_pago.id
        );

        console.log({ jugador_expulsado });

        if (!jugador_expulsado) {
          throw new HttpException(
            HttpStatusCodes400.BAD_REQUEST,
            "Jugador expulsado no encontrado"
          );
        }

        // Notificamos al jugador que ha sido expulsado por no cumplir con los pagos si tiene token
        if (jugador_expulsado.client_token !== "") {
          const messageJugadorExpulsado = defaultNotificarJugadorExpulsado(
            jugador_expulsado.id,
            juego.id,
            juego.nombre,
            jugador_expulsado.client_token
          );
          require("util").inspect.defaultOptions.depth = null;
          console.log({ messageJugadorExpulsado });

          sendFcmMessage(messageJugadorExpulsado);
        }

        const jugador_creador = await obtenerCreadorDeJuego(
          jugador_juego_no_pago.id_juego
        );

        if (!jugador_creador) {
          throw new HttpException(
            HttpStatusCodes400.BAD_REQUEST,
            "Creador no encontrado"
          );
        }

        // Notificamos al creador del juego que el jugador ha sido expulsado y que ingresará en su cuenta
        if (jugador_creador.client_token !== "") {
          const messageCreadorVaAReemplazar =
            defaultNotificarCreadorVaAReemplazar(
              jugador_creador.id,
              juego.id,
              jugador_expulsado.nombre,
              juego.nombre,
              jugador_creador.client_token
            );

          require("util").inspect.defaultOptions.depth = null;
          console.log({ messageCreadorVaAReemplazar });
          sendFcmMessage(messageCreadorVaAReemplazar);
        }
      }
    }
  }

  // Validamos el estado de la bandera preguntando si el juego se debe programar
  // if (programar_nuevo_turno) {
  //   // Se debe programar, entonces se programa el inicio del siguiente turno para unos segundos después.
  //   programarInicioDeUnNuevoTurno(
  //     sumarSegundosAFecha(fechaHoraActual(), 15),
  //     juego.id,
  //     turno.tiempo_puja_seg,
  //     turno.tiempo_puja_seg + 15,
  //     turno.tiempo_pago_seg,
  //     turno.tiempo_pago_multas_seg
  //   );
  // }
};

// obtenerSolicitudesDePagosDeMultasSinPagar(1);
