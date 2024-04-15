import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJuego } from "./juego.service";
import { HttpException, HttpStatusCodes400 } from "../utils";

export const crearInvitado = async (
  id: number,
  correo: string,
  telf: string,
  nombre_invitado: string
  // { nombre_invitado }: Prisma.Invitados_JuegosCreateInput
) => {
  const juego = await obtenerJuego(id);

  if (juego) {
    const invitado = await prisma.invitados_Juegos.create({
      data: {
        nombre_invitado,
        juego: { connect: { id } },
        invitado: {
          connectOrCreate: {
            where: {
              correo,
              telf,
            },
            create: {
              correo,
              telf,
            },
          },
        },
      },
    });

    return invitado;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe un juego asociado al ID especificado"
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

export const actualizarInvitadosJuegos = async (
  data: Prisma.Invitados_JuegosUpdateInput,
  id_juego: number,
  id_invitado: number
) => {
  try {
    const estados = await prisma.invitados_Juegos.update({
      where: {
        id: {
          id_invitado,
          id_juego,
        },
      },
      data,
    });

    return estados;
  } catch (error: any) {
    throw new Error(
      `Error en invitado.service.crearInvitado. Message: ${error.message}`
    );
  }
};

export const buscarInvitado = async (
  correo: string,
  telf: string
  // }: Prisma.InvitadosWhereUniqueInput
) => {
  const invitado = await prisma.invitados.findUnique({
    where: {
      correo,
      telf,
    },
  });

  return invitado;
};
