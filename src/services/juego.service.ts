import { Prisma } from "@prisma/client";

import prisma from "./prisma.service";

export const crearJuego = async (
  id: number,
  { nombre, fecha_inicio, monto_total, moneda }: Prisma.JuegosCreateInput
) => {
  try {
    const date = new Date(fecha_inicio);
    const juego = await prisma.jugadores_Juegos.create({
      data: {
        jugador: { connect: { id } },
        juego: {
          create: {
            nombre,
            fecha_inicio: date,
            monto_total,
            moneda,
            estado_juego: "Nuevo",
          },
        },
        rol: "Creador",
      },
    });

    return juego;
  } catch (error: any) {
    // console.log(error.message);
    throw new Error(
      `Error en juego.service.crearJuego. Message: ${error.message}`
    );
  }
};

export const actualizarJuego = async (
  id_juego: number,
  { nombre, fecha_inicio, monto_total, moneda }: Prisma.JuegosUpdateInput
) => {
  // const date = new Date(fecha_inicio);
  const juego = await prisma.juegos.update({
    where: {
      id: id_juego,
    },
    data: {
      nombre,
      fecha_inicio,
      monto_total,
      moneda,
    },
  });

  return juego;
};

export const eliminarJuego = async (id: number) => {
  const juego = await prisma.juegos.delete({
    where: {
      id: id,
    },
  });

  return juego;
};

export const obtenerJuego = async (id_juego: number) => {
  const juego = await prisma.juegos.findUnique({ where: { id: id_juego } });

  return juego;
};

export const obtenerJuegos = async () => {
  const juegos = await prisma.jugadores_Juegos.findMany({
    include: {
      jugador: {},
      juego: {},
    },
  });

  return juegos;
};

export const obtenerJuegosDeJugador = async (id_jugador: number) => {
  const juegos = await prisma.juegos.findMany({
    where: {
      jugadores_juegos: {
        some: {
          id_jugador,
        },
      },
    },
  });

  return juegos;
};
