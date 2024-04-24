import { Prisma, Turnos } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJugador } from "./jugador.service";
import { HttpException } from "../exceptions";
import { HttpStatusCodes400 } from "../utils";

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
