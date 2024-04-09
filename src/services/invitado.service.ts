import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";

export const crearInvitado = async (
  id_juego: number,
  { correo, telf }: Prisma.InvitadosCreateInput,
  nombre: string
) => {
  try {
    const invitado = await prisma.invitados.create({
      data: {
        correo,
        telf,
        invitados_juegos: {
          create: [
            {
              id_juego,
              nombre_invitado: nombre,
            },
          ],
        },
      },
    });
    return invitado;
  } catch (error: any) {
    throw new Error(
      `Error en invitado.service.crearInvitado. Message: ${error.message}`
    );
  }
};

export const obtenerInvitado = async (id: number) => {
  const invitado = await prisma.invitados.findUnique({
    where: {
      id,
    },
  });

  return invitado;
};

export const obtenerInvitados = async () => {
  const invitados = await prisma.invitados.findMany();

  return invitados;
};

export const obtenerInvitadosDeJuego = async (id_juego: number) => {
  const invitados = await prisma.invitados.findMany({
    where: {
      invitados_juegos: {
        some: {
          id_juego,
        },
      },
    },
  });
  return invitados;
};

export const actualizarInvitado = async (
  id: number,
  { correo, telf }: Prisma.InvitadosUpdateInput
) => {
  const invitado = await prisma.invitados.update({
    where: {
      id,
    },
    data: {
      correo,
      telf,
    },
  });

  return invitado;
};

export const eliminarInvitado = async (id: number) => {
  const invitado = await prisma.invitados.delete({
    where: {
      id,
    },
  });
};

export const obtenerCorreosInvitados = async (idsInvitados: []) => {
  const arrIds: any = [];
  for (const element of idsInvitados) {
    const { id: id_invitado } = element;
    arrIds.push(id_invitado);
  }

  const invitados = await prisma.invitados.findMany({
    select: {
      correo: true,
    },
    where: {
      id: { in: arrIds },
    },
  });

  const correos = [];

  for (const element in invitados) {
    if (Object.prototype.hasOwnProperty.call(invitados, element)) {
      const value: string = invitados[element].correo;
      correos.push(value);
    }
  }

  return correos;
};

export const obtenerTelefonosInvitados = async (idsInvitados: []) => {
  const arrIds: any = [];
  for (const element of idsInvitados) {
    const { id: id_invitado } = element;
    arrIds.push(id_invitado);
  }

  const invitados = await prisma.invitados.findMany({
    select: {
      telf: true,
    },
    where: {
      id: { in: arrIds },
    },
  });

  const telefonos = [];

  for (const element in invitados) {
    if (Object.prototype.hasOwnProperty.call(invitados, element)) {
      const value: string = invitados[element].telf;
      telefonos.push(value);
    }
  }

  return telefonos;
};
