import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";

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
