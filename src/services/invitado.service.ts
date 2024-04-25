import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJuego } from "./juego.service";
import { HttpStatusCodes400, defaultInvitacionAJuego } from "../utils";
import { HttpException } from "../exceptions";
import {
  obtenerCuentaCreadaDeUnInvitado,
  obtenerJugador,
} from "./jugador.service";
import { sendFcmMessage } from "./notificacion.service";

export const crearInvitado = async (
  id_juego: number,
  id_jugador_creador: number,
  correo: string,
  telf: string,
  nombre_invitado: string
) => {
  const juego = await obtenerJuego(id_juego);

  if (juego) {
    const invitado = await prisma.invitados_Juegos.create({
      data: {
        nombre_invitado,
        juego: { connect: { id: id_juego } },
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

    console.log({ invitado });

    const cuentaJugadorInvitado = await obtenerCuentaCreadaDeUnInvitado(
      invitado.id_invitado
    );

    console.log({ cuentaJugadorInvitado });
    const cuentaJugadorCreador = await obtenerJugador(id_jugador_creador);

    if (cuentaJugadorInvitado && cuentaJugadorCreador) {
      const message = defaultInvitacionAJuego(
        id_juego,
        cuentaJugadorInvitado.id,
        juego.nombre,
        cuentaJugadorCreador.nombre,
        cuentaJugadorInvitado.client_token
      );

      sendFcmMessage(message);
    }

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
  const invitados = await prisma.invitados.findMany({
    include: {
      invitados_juegos: {},
    },
  });

  return invitados;
};

export const obtenerInvitadosDeJuego = async (id_juego: number) => {
  const invitados = await prisma.juegos.findMany({
    where: {
      id: id_juego,
    },
    include: {
      invitados_juegos: {
        include: {
          invitado: true,
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
