import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import { HttpException } from "../exceptions";
import { HttpStatusCodes400 } from "../utils";
import { buscarInvitado } from "./invitado.service";

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
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
    },
  });

  return jugador;
};

// export const crearJugadorRelacionandoAInvitado = async (
export const crearJugadorAPartirDeInvitacion = async (
  { nombre, usuario, contrasena, client_token }: Prisma.JugadoresCreateInput,
  { telf, correo }: Prisma.InvitadosCreateInput
) => {
  const invitadoBuscado = await buscarInvitado(correo, telf);

  if (invitadoBuscado) {
    const jugador = await prisma.jugadores.create({
      data: {
        nombre,
        usuario,
        contrasena,
        client_token,
        invitado: {
          connect: {
            correo,
            telf,
          },
        },
      },

      select: {
        id: true,
        nombre: true,
        usuario: true,
        invitado: true,
      },
    });

    return jugador;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe un invitado asociado a ese Correo y Teléfono"
    );
  }
};

export const obtenerJugador = async (id: number) => {
  const jugador = await prisma.jugadores.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
      client_token: true,
    },
  });

  return jugador;
};

export const obtenerJugadores = async () => {
  const jugadores = await prisma.jugadores.findMany({
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
    },
  });

  return jugadores;
};

export const actualizarJugador = async (
  { nombre, contrasena }: Prisma.JugadoresUpdateInput,
  { correo, telf }: Prisma.InvitadosUpdateInput,
  id: number
) => {
  const jugadorBuscado = await obtenerJugador(id);

  if (jugadorBuscado) {
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
      select: {
        id: true,
        nombre: true,
        usuario: true,
        invitado: true,
      },
    });

    return jugador;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe un jugador con el ID indicado"
    );
  }
};

export const eliminarJugador = async (id: number) => {
  const jugadorBuscado = await obtenerJugador(id);
  if (jugadorBuscado) {
    const jugador = await prisma.jugadores.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        nombre: true,
        usuario: true,
        invitado: true,
      },
    });

    return jugador;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe un jugador con el ID indicado"
    );
  }
};

export const existeEmail = async (correo: string) => {
  const jugador = await prisma.invitados.findUnique({
    where: {
      correo,
    },
    select: {
      id: true,
      correo: true,
      telf: true,
      jugadores: {
        select: {
          id: true,
          nombre: true,
          usuario: true,
        },
      },
    },
  });

  return jugador !== null;
};

export const existeId = async (id: number) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
    },
  });

  return jugador !== null;
};

export const existeTelf = async (telf: string) => {
  const jugador = await prisma.invitados.findUnique({
    where: {
      telf,
    },
    select: {
      id: true,
      correo: true,
      telf: true,
      jugadores: {
        select: {
          id: true,
          nombre: true,
          usuario: true,
        },
      },
    },
  });

  return jugador !== null;
};

export const obtenerCuentaCreadaDeUnInvitado = async (id_invitado: number) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      id_invitado: id_invitado,
    },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
      client_token: true,
    },
  });

  return jugador;
};

export const existeUsuario = async (usuario: string) => {
  const jugador = await prisma.jugadores.findUnique({
    where: {
      usuario,
    },
    select: {
      id: true,
      nombre: true,
      usuario: true,
    },
  });

  return jugador;
};

export const validarCuenta = async ({
  usuario,
  contrasena,
}: Prisma.JugadoresWhereUniqueInput) => {
  const cuenta = await prisma.jugadores.findUnique({
    where: {
      usuario,
      contrasena,
    },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      client_token: true,
    },
  });

  return cuenta;
};

export const obtenerJugadoresDeJuego = async (id_juego: number) => {
  const jugadores = await prisma.jugadores.findMany({
    where: {
      jugadores_juegos: {
        some: {
          id_juego,
        },
      },
    },
  });

  console.log({ jugadores });
  return jugadores;
};

export const actualizarTokenFireBase = async (
  id_jugador: number,
  client_token: string
) => {
  const jugador = prisma.jugadores.update({
    where: {
      id: id_jugador,
    },
    data: {
      client_token,
    },
  });

  return jugador;
};
