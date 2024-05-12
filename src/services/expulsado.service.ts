import { EstadoInvitacion, Prisma } from "@prisma/client";
import prisma from "./prisma.service";

export const crearExpulsado = async (
  data: Prisma.ExpulsadosUncheckedCreateInput
) => {
  const expulsado = await prisma.expulsados.create({
    data,
  });

  return expulsado;
};

export const obtenerJuegosDondeSeHaExpulsado = async (id_jugador: number) => {
  const expulsados = await prisma.juegos.findMany({
    where: {
      jugadores_juegos: {
        some: {
          Expulsados: {
            some: {
              jugador: {
                id: id_jugador,
              },
            },
          },
        },
      },
    },
  });

  console.log({ expulsados });

  return expulsados;
};
