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
import {
  actualizarJuego,
  buscarJugadorJuego,
  buscarJugadorJuegoPorId,
  obtenerJuego,
} from "./juego.service";
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
  const pujas = prisma.pujas.findMany({});

  return pujas;
};

export const eliminarTurnosDeJuego = async (id_juego: number) => {
  const turnos = await prisma.turnos.deleteMany({
    where: {
      id_juego,
    },
  });

  const juegos = prisma.juegos.updateMany({
    data: {
      monto_total: 9000,
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
      return { jugador, turno };
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
  const jugador_grupo_turno = await prisma.pujas.upsert({
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

const habilitadoParaPujar = async (id_jugador_juego: number) => {
  // La idea principal de esta función es verificar si el jugador ya ha ganado el turno previamente. Si es así, no podrá pujar nuevamente.
  // Para ello, se debe verificar si existe un turno ganador del juego con su ID de jugador
  // Si existe, no podrá pujar nuevamente
  // Si no existe, podrá pujar nuevamente
  const jugador_juego = await buscarJugadorJuegoPorId(id_jugador_juego);

  // Si el id_jugador_juego existe (Si el jugador ya es parte del juego)
  if (jugador_juego) {
    // Obtenemos el juego
    const juego = await buscarJugadorJuegoPorId(jugador_juego.id_juego);

    // Si existe el juego, podemos continuar
    if (juego) {
      // Buscamos en todos los turnos si existe un turno ganador del juego con su ID de jugador
      const turnos = await prisma.turnos.findMany({
        where: {
          id_juego: juego.id,
          id_ganador_jugador_juego: id_jugador_juego,
        },
      });

      if (turnos.length > 0) {
        // Si existe un turno ganador del juego con su ID de jugador, no podrá pujar nuevamente
        console.log(
          `El jugador id:${jugador_juego.id_jugador} ya ha ganado un  previamente`
        );
        return false;
      } else {
        // Si no existe, podrá pujar nuevamente
        console.log(
          `El jugador id:${jugador_juego.id_jugador} puede pujar nuevamente debido a que no existe un turno ganador del juego con su ID de jugador`
        );
        return true;
      }
      // Está habilitado para pujar si existe un turno ganador del juego con su ID de jugador
    } else {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el juego con el ID especificado"
      );
    }
    // Verificamos si ya ha ganado el turno previamente
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "El ID especificado para jugador_juego no existe"
    );
  }
};

export const registrarOferta = async (
  id_jugador_juego: number,
  id_turno: number,
  monto: number
) => {
  // Verificamos si el jugador está habilitado para pujar, es decir, si no ha ganado el turno previamente

  const turno = await obtenerTurnoPorId(id_turno);
  if (turno) {
    // Calculamos si es tiempo de ofertas
    const esTiempoDeOfertas = tiempoDeOfertas(
      turno.fecha_inicio_puja,
      turno.tiempo_puja_seg
    );

    // Validamos si es tiempo de ofertas
    if (esTiempoDeOfertas) {
      const jugadorHbilitado = await habilitadoParaPujar(id_jugador_juego);

      // Si está habilitado para pujar
      if (jugadorHbilitado) {
        // Obtenemos el jugador_juego
        const jugador_juego = await buscarJugadorJuegoPorId(id_jugador_juego);

        console.log({ jugador_juego });

        // Si el id_jugador_juego existe (Si el jugador ya es parte del juego)
        if (jugador_juego) {
          // Obtenemos los ID's del jugador y del juego
          const id_jugador = jugador_juego.id_jugador;
          const id_juego = jugador_juego.id_juego;

          // Obtenemos el juego
          const juego = await obtenerJuego(id_juego);

          // Obtenemos el turno

          // Si existe el juego, podemos registrar ofertas
          if (juego) {
            // Validamos si el monto de la oferta es mayor o igual al monto mínimo de la puja
            if (monto >= turno.monto_minimo_puja) {
              const jugador_grupo_turno = await actuacrearJugador_Grupo_Turno(
                id_turno,
                jugador_juego.id,
                monto
              );
              console.log({ jugador_grupo_turno });
              return jugador_grupo_turno;
            } else {
              throw new HttpException(
                HttpStatusCodes400.BAD_REQUEST,
                `El monto mínimo de la puja debe ser mayor a ${turno.monto_minimo_puja} ${juego.moneda}. del saldo del turno`
              );
            }
          } else {
            if (!juego) {
              throw new HttpException(
                HttpStatusCodes400.BAD_REQUEST,
                "No existe el juego indicado"
              );
            } else {
              throw new HttpException(
                HttpStatusCodes400.BAD_REQUEST,
                "No existe el juego con el ID especificado"
              );
            }
          }
        } else {
          throw new HttpException(
            HttpStatusCodes400.BAD_REQUEST,
            "No existe jugador_juego con el ID especificado"
          );
        }
      } else {
        throw new HttpException(
          HttpStatusCodes400.BAD_REQUEST,
          "El jugador ya ha ganado el turno previamente"
        );
      }
    } else {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No es tiempo de ofertas."
      );
    }
    console.log({ esTiempoDeOfertas });
  } else {
    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el turno indicado"
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

  // Saldo restante es el monto total - ( cuota mensual * nro turno )
  // Cuota mensual es monto total / cantidad de jugadores
  const cuota_mensual: number = Math.trunc(monto_total / cant_jugadores);
  console.log({ cuota_mensual, monto_total, cant_jugadores });
  const saldo_restante: number =
    monto_total - cuota_mensual * nro_turno + cuota_mensual;
  console.log({
    saldo_restante,
    monto_total,
    cuota_mensual,
    nro_turno,
  });

  // El monto mínimo de puja es (saldo restante * 100) / 8
  const monto_minimo_puja = Math.trunc((saldo_restante * 8) / 100);

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
  console.log({ juego });

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
      // No existen turnos sin finalizar, podemos continuar.
    } else {
      // Obtenemos todos los turnos que se hayan creado para este juego
      const turnosDeJuego = await obtenerTurnosDeJuego(id_juego);

      // Validamos si no llegamos ya al final de los turnos
      console.log({ turnosDeJuego, cant_jugadores: juego.cant_jugadores });
      if (turnosDeJuego.length === juego.cant_jugadores) {
        throw new HttpException(
          HttpStatusCodes400.BAD_REQUEST,
          "Ha llegado al máximo de turnos creados"
        );
        // Hay turnos disponibles, se puede crear uno adicional
      } else {
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
    }
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe el juego con el ID especificado"
    );
  }
};
