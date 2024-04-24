import { Prisma, Turnos } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJugador } from "./jugador.service";
import { HttpException } from "../exceptions";
import {
  HttpStatusCodes400,
  sumarSegundosAFecha,
  tiempoDeOfertas,
} from "../utils";

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

  const juego = await prisma.juegos.findUnique({
    where: {
      id: id_juego,
    },
  });

  if (juego) {
    const esTiempoDeOfertas = tiempoDeOfertas(
      juego.fecha_inicio_puja,
      juego.tiempo_puja_seg
    );

    if (esTiempoDeOfertas) {
      const turno = await prisma.turnos.findUnique({
        where: {
          id: id_turno,
        },
      });

      console.log({ esTiempoDeOfertas });

      // TODO: Si el creador ingresa a cuenta de un jugador que incumplió los pagos, este proceso falla
      const jugador_juego = await prisma.jugadores_Juegos.findFirst({
        where: {
          id_jugador,
          id_juego,
        },
      });

      console.log({ jugador_juego });

      if (turno && jugador_juego && monto >= turno.monto_minimo_puja) {
        const jugador_grupo_turno = await actuacrearJugador_Grupo_Turno(
          id_turno,
          jugador_juego.id,
          monto
        );
        console.log({ jugador_grupo_turno });
        return jugador_grupo_turno;
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
        if (!jugador_juego) {
          throw new HttpException(
            HttpStatusCodes400.BAD_REQUEST,
            "No existe el jugador_juego indicado"
          );
        }
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
  }
};

export const iniciarTurno = async (id_juego: number) => {
  // Obtenemos la fecha actual

  /**
   * Validaciones
   *    - No puede haber otro turno del mismo juego que esté
   */

  const timeStamp = Date.now();
  const fecha_actual = new Date(timeStamp);

  // Actualizamos el estado del juego a "Iniciado" y la fecha para el inicio de puja en la hora actual
  const juegoIniciado = await prisma.juegos.update({
    where: {
      id: id_juego,
    },
    data: {
      estado_juego: "Iniciado",
      fecha_inicio_puja: fecha_actual,
    },
    select: {
      nombre: true,
      estado_juego: true,
      saldo_restante: true,
      monto_total: true,
      cant_jugadores: true,
    },
  });

  // Creamos un turno y lo habilitamos como el turno en curso

  // TODO Arreglar para que se pueda iniciar 2 veces el mismo juego
  const turno = await prisma.turnos.create({
    data: {
      estado_turno: "Tiempo_Ofertas",
      monto_minimo_puja: Math.trunc((juegoIniciado.saldo_restante * 8) / 100),
      juego: {
        connect: { id: id_juego },
      },
    },
    include: {
      juego: true,
    },
  });

  // console.log({
  //   monto_total: juegoIniciado.monto_total,
  //   cant_jugadores: juegoIniciado.cant_jugadores,
  // });

  // Calculamos el monto que se debe pagar
  const montoAPagar: number = Math.trunc(
    juegoIniciado.monto_total / juegoIniciado.cant_jugadores
  );

  // console.log({ montoAPagar });

  // Establecemos el monto que se debe pagar y colocamos el juego en estado "Puja"
  const juego = await prisma.juegos.update({
    where: {
      id: id_juego,
    },
    data: {
      estado_juego: "Puja",
      saldo_restante: {
        decrement: montoAPagar,
      },
    },
    include: {
      turnos: true,
    },
  });

  // console.log({ juego });

  // Programamos la notificación del ganador
  if (juego) {
    const id_juego = juego.id;

    const fecha_fin = sumarSegundosAFecha(
      juego.fecha_inicio_puja,
      juego.tiempo_puja_seg
    );

    console.log({
      fecha_programada: fecha_fin,
      ParaHacer: "TENGO QUE PROGRAMAR EL ENVÍO DEL GANADOR DEL JUEGO",
    });
    // programarGanadorDeJuego(fecha_fin, id_juego);
  }

  const turno_actualizado = prisma.turnos.findUnique({
    where: {
      id: turno.id,
    },
    include: {
      juego: true,
    },
  });

  return turno_actualizado;
};
