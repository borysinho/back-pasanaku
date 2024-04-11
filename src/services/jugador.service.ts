import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";

// const prisma = new PrismaClient();

// export const crearJugadorSinRelacionarAInvitado = async (
export const crearJugadorSinSerInvitado = async (
  { nombre, usuario, contrasena }: Prisma.JugadoresCreateInput,
  { telf, correo }: Prisma.InvitadosCreateInput
) => {
  const jugador = await prisma.jugadores.create({
    data: {
      nombre,
      usuario,
      contrasena,
      invitado: {
        create: {
          correo,
          telf,
        },
      },
    },
  });

  return jugador;
};

// export const crearJugadorRelacionandoAInvitado = async (
export const crearJugadorAPartirDeInvitacion = async (
  { nombre, usuario, contrasena }: Prisma.JugadoresCreateInput,
  { telf, correo }: Prisma.InvitadosCreateInput
) => {
  const jugador = await prisma.jugadores.create({
    data: {
      nombre,
      usuario,
      contrasena,
      invitado: {
        connect: {
          correo,
          telf,
        },
      },
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
  { nombre, contrasena }: Prisma.JugadoresUpdateInput,
  { correo, telf }: Prisma.InvitadosUpdateInput,
  id: number
) => {
  const jugador = await prisma.jugadores.update({
    where: {
      id,
    },
    data: {
      nombre,
      contrasena,
      invitado: {
        update: {
          correo,
          telf,
        },
      },
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
  const jugador = await prisma.invitados.findUnique({
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
  const jugador = await prisma.invitados.findUnique({
    where: {
      telf,
    },
  });

  return jugador !== null;
};

export const existeInvitado = async ({
  correo,
  telf,
}: Prisma.InvitadosWhereUniqueInput) => {
  const existe = await prisma.invitados.findUnique({
    where: {
      correo,
      telf,
    },
  });

  return true && existe;
};
