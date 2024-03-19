import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearJugador = async ({
  nombre,
  email,
}: Prisma.jugadorCreateInput) => {
  const jugador = await prisma.jugador.create({
    data: {
      nombre,
      email,
    },
  });

  return jugador;
};

export const obtenerJugadores = async () => {
  const jugadores = await prisma.jugador.findMany();

  return jugadores;
};

export const actualizarJugador = async (
  { nombre, email }: Prisma.jugadorUpdateInput,
  id: number
) => {
  const jugador = await prisma.jugador.update({
    where: { id },
    data: {
      nombre,
      email,
    },
  });

  return jugador;
};

export const eliminarJugador = async (id: number) => {
  const jugador = await prisma.jugador.delete({
    where: {
      id: id,
    },
  });

  return jugador;
};

export const existeEmail = async (email: string) => {
  try {
    const jugador = await prisma.jugador.findFirst({
      where: {
        email,
      },
    });
  } catch (error) {
    return undefined;
  }
};
