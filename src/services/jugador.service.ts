import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";

// const prisma = new PrismaClient();

export const crearJugador = async ({
  nombre,
  correo,
  telf,
}: Prisma.JugadoresCreateInput) => {
  const jugador = await prisma.jugadores.create({
    data: {
      nombre,
      correo,
      telf,
    },
  });

  return jugador;
};

export const obtenerJugador = async (id: number) => {
  const jugador = await prisma.jugadores.findUnique({
    where: { id },
  });

  return jugador;
};

export const obtenerJugadores = async () => {
  const jugadores = await prisma.jugadores.findMany();

  return jugadores;
};

export const actualizarJugador = async (
  { nombre, correo, telf }: Prisma.JugadoresUpdateInput,
  id: number
) => {
  const jugador = await prisma.jugadores.update({
    where: { id },
    data: {
      nombre,
      correo,
      telf,
    },
  });

  return jugador;
};

export const eliminarJugador = async (id: number) => {
  const jugador = await prisma.jugadores.delete({
    where: {
      id: id,
    },
  });

  return jugador;
};

export const existeEmail = async (correo: string) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      correo,
    },
  });

  return jugador !== null;
};

export const existeId = async (id: number) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      id,
    },
  });

  return jugador !== null;
};

export const existeTelf = async (telf: string) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      telf,
    },
  });

  return jugador !== null;
};
