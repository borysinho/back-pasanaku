import { EstadoTurnos, Prisma, Turnos } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJugador } from "./jugador.service";
import { HttpException } from "../exceptions";
import {
  HttpStatusCodes400,
  fechaHoraActual,
  programarGanadorDeJuego,
  sumarSegundosAFecha,
  tiempoDeOfertas,
} from "../utils";
import { actualizarJuego, obtenerJuego } from "./juego.service";
import { notificarInicioOfertas } from "./notificacion.service";

export const crearTurno = async (
  id_juego: number,
  payLoad: Prisma.TurnosCreateInput
) => {
  // const data: Prisma.TurnosCreateInput = { ...payLoad };
  const turno = prisma.turnos.create({
    data: payLoad,
  });

  return turno;
};

export const obtenerPujas = async () => {
  const pujas = prisma.jugador_Grupo_Turno.findMany({});

  return pujas;
};

export const eliminarTurnosDeJuego = async (id_juego: number) => {
  const turnos = await prisma.turnos.deleteMany({
    where: {
      id_juego,
    },
  });

  return turnos;
};

export const obtenerTurnosDeJuego = async (id_juego: number) => {
  const turnos = await prisma.turnos.findMany({
    where: {
      id_juego,
    },
  });

  return turnos;
};

export const obtenerTurnoPorId = async (id_turno: number) => {
  const turno = await prisma.turnos.findUnique({
    where: {
      id: id_turno,
    },
  });

  return turno;
};

export const obtenerTodosLosTurnos = async () => {
  return await prisma.turnos.findMany({});
};

export const obtenerGanadorDeturno = async (id_turno: number) => {
  const turno = await obtenerTurnoPorId(id_turno);
  if (turno != null) {
    if (turno.id_ganador_jugador_juego !== null) {
      const jugador = await obtenerJugador(turno.id_ganador_jugador_juego);
      return jugador;
    } else {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se ha actualizado el ganador del turno"
      );
    }
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe el turno especificado"
    );
  }
};

const actuacrearJugador_Grupo_Turno = async (
  id_turno: number,
  id_jugador_juego: number,
  monto_puja: number
) => {
  const jugador_grupo_turno = await prisma.jugador_Grupo_Turno.upsert({
    where: {
      id: {
        id_turno,
        id_jugador_juego,
      },
    },
    update: {
      monto_puja: monto_puja,
    },
    create: {
      monto_puja: monto_puja,
      turno: { connect: { id: id_turno } },
      jugadores_juegos: { connect: { id: id_jugador_juego } },
    },
  });

  return jugador_grupo_turno;
};

export const registrarOferta = async (
  // id_jugador_juego: number,
  id_jugador: number,
  id_juego: number,
  id_turno: number,
  // payLoad: Prisma.Jugador_Grupo_TurnoCreateInput
  monto: number
) => {
  console.log({ id_jugador, id_juego, id_turno });

  // Obtenemos el juego
  const juego = await obtenerJuego(id_juego);

  // Obtenemos todos los jugador_juego
  const jugadores_juegos = await prisma.jugadores_Juegos.findMany({
    where: {
      id_juego,
      id_jugador,
    },
  });

  // Obtenemos el turno
  const turno = await obtenerTurnoPorId(id_turno);

  // Si existe juego, el turno y ademas el jugador es parte del juego, podemos registrar ofertas
  if (juego && turno && jugadores_juegos.length > 0) {
    // Calculamos si es tiempo de ofertas
    const esTiempoDeOfertas = tiempoDeOfertas(
      turno.fecha_inicio_puja,
      turno.tiempo_puja_seg
    );

    // Validamos si es tiempo de ofertas
    if (esTiempoDeOfertas) {
      console.log({ esTiempoDeOfertas });
      console.log({ jugadores_juegos });

      // Validamos si el monto de la oferta es mayor o igual al monto mínimo de la puja
      if (monto >= turno.monto_minimo_puja) {
        //El creador puede ingresar a la misma partida por suplencia de otro jugador, por lo que puede un jugador puede ingresar mas de 1 vez al juego.
        // Recorremos cada registro de jugador_juego
        jugadores_juegos.forEach(async (jugador_juego) => {
          // Actualizamos o creamos el monto de la oferta
          const jugador_grupo_turno = await actuacrearJugador_Grupo_Turno(
            id_turno,
            jugador_juego.id,
            monto
          );
          console.log({ jugador_grupo_turno });
          return jugador_grupo_turno;
        });
      } else {
        throw new HttpException(
          HttpStatusCodes400.BAD_REQUEST,
          `El monto mínimo de la puja debe ser mayor al 8% del saldo del turno`
        );
      }
    } else {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No es tiempo de ofertas."
      );
    }
  } else {
    if (!juego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el juego indicado"
      );
    }
    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el turno indicado"
      );
    }
    if (jugadores_juegos.length === 0) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el jugador_juego indicado"
      );
    }
  }
};

const actuacrearTurno = async (
  id_turno: number,
  id_juego: number,
  dataCreate: Prisma.TurnosCreateWithoutJuegoInput
) => {
  const { fecha_inicio_puja, tiempo_puja_seg, ganador_jugador_juego } =
    dataCreate;
  const turno = await prisma.turnos.upsert({
    where: {
      id: id_turno,
      id_juego,
    },
    update: {
      fecha_inicio_puja,
      tiempo_puja_seg,
      ganador_jugador_juego,
    },
    create: {
      ...dataCreate,
      juego: {
        connect: {
          id: id_juego,
        },
      },
    },
    include: {
      juego: true,
    },
  });

  return turno;
};

const crearTurnoPreviaValidacion = async (
  id_juego: number,
  monto_total: number,
  cant_jugadores: number,
  tiempo_puja_seg: number
) => {
  // Obtenemos el número de turno que toca
  const turnosSortByNumber = await prisma.turnos.findMany({
    orderBy: {
      nro_turno: "desc",
    },
  });

  // Obtenemos el número de turno que corresponde
  const nro_turno: number =
    turnosSortByNumber.length === 0 ? 1 : turnosSortByNumber[0].nro_turno + 1;

  // Obtenemos la fecha y hora actual para el inicio del turno
  const ahora = fechaHoraActual();

  // Saldo restante es el monto total - ( cuota mensual * nro turno ) - cuota mensual
  // Cuota mensual es monto total / cantidad de jugadores
  const cuota_mensual: number = Math.trunc(monto_total / cant_jugadores);
  const saldo_restante: number =
    monto_total - cuota_mensual * nro_turno - cuota_mensual;

  // El monto mínimo de puja es (saldo restante * 100) / 8
  const monto_minimo_puja = Math.trunc((saldo_restante * 100) / 8);

  const turnoCreate: Prisma.TurnosCreateWithoutJuegoInput = {
    estado_turno: "TiempoOfertas",
    nro_turno,
    fecha_turno: ahora,
    fecha_inicio_puja: ahora,
    tiempo_puja_seg,
    saldo_restante,
    monto_minimo_puja,
  };

  const turno = await actuacrearTurno(0, id_juego, turnoCreate);

  return turno;
};

export const iniciarTurno = async (id_juego: number, tiempoPujaSeg: number) => {
  /**
   * Validaciones para iniciar turno
   *    - El juego debe existir
   *    - No debe existir ningún turno del mismo juego con estado TiempoOfertas o TiempoPagos
   */

  // Obtenemos el juego
  const juego = await obtenerJuego(id_juego);

  //Validamos si existe
  if (juego) {
    // Obtenemos todos los turnos del juego que puedan estar en TiempoOfertas o TiempoPagos
    const turnosDeJuegoEnOfertasOPagos = await prisma.turnos.findMany({
      where: {
        OR: [
          { estado_turno: "TiempoOfertas" },
          { estado_turno: "TiempoPagos" },
        ],
      },
    });

    // Validamos si existe al menos un turno de un juego en estado TiempoOfertas o TiempoPagos
    if (turnosDeJuegoEnOfertasOPagos.length > 0) {
      // Devolvemos un error indicando que no se puede iniciar un turno si no ha finalizado el anterior
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        `Existe al menos un turno del juego que no ha finalizado.
Detalles: ${turnosDeJuegoEnOfertasOPagos.toString()}`
      );
      // Podemos crear el turno de manera segura
    } else {
      // Obtenemos la cantidad de turnos que tiene el juego para actualizar el estado del juego si no hay ninguno
      const turnosDeJuego = await obtenerTurnosDeJuego(id_juego);

      // Validamos si no existe ningún turno previamente creado para el juego especificado
      if (turnosDeJuego.length === 0) {
        // Actualizamos el estado a "Iniciado"
        await actualizarJuego(id_juego, { estado_juego: "Iniciado" });
      }

      // Creamos un turno nuevo generando todos los datos necesarios
      const turno = await crearTurnoPreviaValidacion(
        id_juego,
        juego.monto_total,
        juego.cant_jugadores,
        tiempoPujaSeg
      );

      // Notificamos a los clientes el inicio de las ofertas
      await notificarInicioOfertas(id_juego, turno.id);

      // Programamos el cierre de las ofertas
      programarGanadorDeJuego(
        sumarSegundosAFecha(turno.fecha_inicio_puja, turno.tiempo_puja_seg),
        id_juego
      );

      return turno;
    }
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe el juego con el ID especificado"
    );
  }

  // const timeStamp = Date.now();
  // const fecha_actual = new Date(timeStamp);

  // // Actualizamos el estado del juego a "Iniciado" y la fecha para el inicio de puja en la hora actual
  // const juegoIniciado = await prisma.juegos.update({
  //   where: {
  //     id: id_juego,
  //   },
  //   data: {
  //     estado_juego: "Iniciado",
  //     fecha_inicio_puja: fecha_actual,
  //   },
  //   select: {
  //     nombre: true,
  //     estado_juego: true,
  //     saldo_restante: true,
  //     monto_total: true,
  //     cant_jugadores: true,
  //   },
  // });

  // // Creamos un turno y lo habilitamos como el turno en curso

  // const turno = await prisma.turnos.create({
  //   data: {
  //     estado_turno: "Tiempo_Ofertas",
  //     monto_minimo_puja: Math.trunc((juegoIniciado.saldo_restante * 8) / 100),
  //     juego: {
  //       connect: { id: id_juego },
  //     },
  //   },
  //   include: {
  //     juego: true,
  //   },
  // });

  // // console.log({
  // //   monto_total: juegoIniciado.monto_total,
  // //   cant_jugadores: juegoIniciado.cant_jugadores,
  // // });

  // // Calculamos el monto que se debe pagar
  // const montoAPagar: number = Math.trunc(
  //   juegoIniciado.monto_total / juegoIniciado.cant_jugadores
  // );

  // // console.log({ montoAPagar });

  // // Establecemos el monto que se debe pagar y colocamos el juego en estado "Puja"
  // const juego = await prisma.juegos.update({
  //   where: {
  //     id: id_juego,
  //   },
  //   data: {
  //     estado_juego: "Puja",
  //     saldo_restante: {
  //       decrement: montoAPagar,
  //     },
  //   },
  //   include: {
  //     turnos: true,
  //   },
  // });

  // // console.log({ juego });

  // // Programamos la notificación del ganador
  // if (juego) {
  //   const id_juego = juego.id;

  //   const fecha_fin = sumarSegundosAFecha(
  //     juego.fecha_inicio_puja,
  //     juego.tiempo_puja_seg
  //   );

  //   console.log({
  //     fecha_programada: fecha_fin,
  //     ParaHacer: "TENGO QUE PROGRAMAR EL ENVÍO DEL GANADOR DEL JUEGO",
  //   });
  //   // programarGanadorDeJuego(fecha_fin, id_juego);
  // }

  // const turno_actualizado = prisma.turnos.findUnique({
  //   where: {
  //     id: turno.id,
  //   },
  //   include: {
  //     juego: true,
  //   },
  // });

  // return turno_actualizado;
};
