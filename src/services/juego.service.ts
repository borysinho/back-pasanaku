import { EstadoInvitacion, Prisma, PrismaClient } from "@prisma/client";

import prisma from "./prisma.service";
import { HttpException, HttpStatusCodes400 } from "../utils";
import { existeId, obtenerJugador } from "./jugador.service";

export const crearJuego = async (
  id: number,
  { nombre, fecha_inicio, monto_total, moneda }: Prisma.JuegosCreateInput
) => {
  const date = new Date(fecha_inicio);

  const existeNombreDeJuego = await existeNombreJuegoEnJugador(id, nombre);

  if (!existeNombreDeJuego) {
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
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Ya existe un nombre de juego para este jugador"
    );
  }
};

export const aceptarInvitacion = async (
  id_juego: number,
  id_jugador: number,
  id_invitado: number
) => {
  const juegoBuscado = await obtenerJuego(id_juego);
  const jugadorBuscado = await obtenerJugador(id_jugador);

  console.log({ jugadorBuscado, juegoBuscado });

  if (juegoBuscado && jugadorBuscado) {
    const jugadorJuego = await prisma.jugadores_Juegos.create({
      data: {
        estado: "Participando",
        rol: "Jugador",
        jugador: {
          connect: { id: id_jugador },
        },
        juego: {
          connect: { id: id_juego },
        },
      },
    });
    console.log({ jugadorBuscado });

    //Actualizamos el estado del juego del jugador
    const invitados_juegos = prisma.invitados_Juegos.update({
      where: {
        id: {
          id_juego,
          id_invitado,
        },
      },
      data: {
        estado_invitacion: "Aceptado",
      },
    });
    console.log({ invitados_juegos });

    return { jugador_juego: jugadorJuego, invitado_juego: invitados_juegos };
  } else {
    let message: string = "";
    if (!jugadorBuscado)
      message += `No existe un Jugador con el ID especificado.
    `;
    if (!juegoBuscado) message += `No existe un Juego con el ID especificado`;

    throw new HttpException(HttpStatusCodes400.BAD_REQUEST, message);
  }
};

export const actualizarJuego = async (
  id_jugador: number,
  id_juego: number,
  { nombre, fecha_inicio, monto_total, moneda }: Prisma.JuegosUpdateInput
) => {
  // const date = new Date(fecha_inicio);
  // const juegoBuscado = await obtenerJuego(id_juego);
  const jugador_juego = await prisma.jugadores_Juegos.findFirst({
    where: {
      id_juego,
      id_jugador,
      rol: "Creador",
    },
  });

  if (jugador_juego) {
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
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Validar que el rol del Jugador en el Juego especificado sea Creador"
    );
  }
};

export const eliminarJuegoDeUnCreador = async (
  id_jugador: number,
  id_juego: number
) => {
  const jugador_juego = await prisma.jugadores_Juegos.findFirst({
    where: {
      id_juego,
      id_jugador,
      rol: "Creador",
    },
  });

  if (jugador_juego) {
    const juego = await prisma.juegos.delete({
      where: {
        id: id_juego,
      },
    });

    return juego;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Validar que el rol del Jugador en el Juego especificado sea Creador"
    );
  }
};

export const obtenerJuego = async (id_juego: number) => {
  const juego = await prisma.juegos.findFirstOrThrow({
    where: { id: id_juego },
  });

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
  const jugador = await existeId(id_jugador);

  if (jugador) {
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
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No un jugador asociado al ID especificado"
    );
  }
};

const existeNombreJuegoEnJugador = async (
  id_jugador: number,
  nombre: string
) => {
  const jugador = await existeId(id_jugador);

  if (jugador) {
    const juegoJugador = await prisma.jugadores_Juegos.findFirst({
      where: {
        juego: {
          nombre,
        },
        jugador: {
          id: id_jugador,
        },
      },
    });

    return juegoJugador;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No un jugador asociado al ID especificado"
    );
  }
};

export const obtenerJuegosConEstado = async (
  id_jugador: number,
  estado: EstadoInvitacion[]
) => {
  const jugadorJuegosEstados = await prisma.jugadores.findMany({
    where: {
      id: id_jugador,
      invitado: {
        invitados_juegos: {
          some: {
            estado_invitacion: {
              in: estado,
            },
          },
        },
      },
    },
    include: {
      invitado: {
        include: {
          invitados_juegos: {
            include: {
              juego: {},
            },
          },
        },
      },
    },
  });

  console.log({ jugadorJuegosEstados });
  return jugadorJuegosEstados;
};

export const jugadorTieneJuegoPendiente = async (
  id_jugador: number,
  id_juego: number
) => {
  const juego = await prisma.jugadores.findMany({
    where: {
      id: id_jugador,
      invitado: {
        invitados_juegos: {
          every: {
            estado_invitacion: {
              equals: "Pendiente",
            },
            juego: {
              id: id_juego,
            },
          },
        },
      },
    },

    include: {
      invitado: {
        include: {
          invitados_juegos: {
            include: {
              juego: true,
            },
          },
        },
      },
    },
  });

  return juego;
};
