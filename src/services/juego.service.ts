import {
  EstadoInvitacion,
  Jugadores_Juegos,
  Prisma,
  PrismaClient,
} from "@prisma/client";

import prisma from "./prisma.service";
import { HttpException, HttpStatusCodes400 } from "../utils";
import { existeId, obtenerJugador } from "./jugador.service";

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

export const crearJuego = async (
  id: number,
  payLoad: Prisma.JuegosCreateInput
  // {
  //   nombre,
  //   fecha_inicio,
  //   monto_total,
  //   moneda,
  //   lapso_turnos_dias,
  //   tiempo_puja_seg,
  // }: Prisma.JuegosCreateInput
) => {
  const fecha_inicio = new Date(payLoad.fecha_inicio);
  const existeNombreDeJuego = await existeNombreJuegoEnJugador(
    id,
    payLoad.nombre
  );

  const updatedPayLoad: Prisma.JuegosCreateInput = {
    ...payLoad,
    estado_juego: "Nuevo",
    fecha_inicio,
    cant_jugadores: 1,
    saldo_restante: payLoad.monto_total,
  };

  if (!existeNombreDeJuego) {
    const juego = await prisma.jugadores_Juegos.create({
      data: {
        jugador: { connect: { id } },
        juego: {
          create: updatedPayLoad,
          // create: {
          //   nombre,
          //   fecha_inicio: date,
          //   monto_total,
          //   moneda,
          //   estado_juego: "Nuevo",
          //   cant_jugadores: 1,
          //   lapso_turnos_dias,
          //   tiempo_puja_seg,
          // },
        },
        rol: "Creador",
      },
    });
    console.log(juego);

    return juego;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "Ya existe un nombre de juego para este jugador"
    );
  }
};

const buscarJugadorJuego = async (id_juego: number, id_jugador: number) => {
  const jugador_juego = await prisma.jugadores_Juegos.findMany({
    where: {
      id_juego,
      id_jugador,
    },
  });

  return jugador_juego;
};

const buscarInvitadoJuego = async (id_juego: number, id_invitado: number) => {
  const invitado_juego = await prisma.invitados_Juegos.findUnique({
    where: {
      id: {
        id_invitado,
        id_juego,
      },
    },
  });

  return invitado_juego;
};

export const aceptarInvitacion = async (
  id_juego: number,
  id_jugador: number,
  id_invitado: number
) => {
  const existeJugadorJuego = await buscarJugadorJuego(id_juego, id_jugador);

  const existeInvitadoJuego = await buscarInvitadoJuego(id_juego, id_invitado);

  console.log({ existeJugadorJuego, existeInvitadoJuego });

  if (
    existeJugadorJuego.length === 0 &&
    existeInvitadoJuego &&
    existeInvitadoJuego.estado_invitacion === "Pendiente"
  ) {
    const jugadorJuego = await prisma.jugadores_Juegos.create({
      data: {
        estado: "Participando",
        rol: "Jugador",
        jugador: {
          connect: { id: id_jugador },
        },
        juego: {
          connect: {
            id: id_juego,
          },
        },
      },
    });

    //Incrementamos el número de jugadores en tabla juegos
    const juego = await prisma.juegos.update({
      data: {
        cant_jugadores: {
          increment: 1,
        },
      },
      where: {
        id: id_juego,
      },
    });
    console.log({ jugadorJuego });

    //Actualizamos el estado de la invitación
    const invitados_juegos = await prisma.invitados_Juegos.update({
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
    if (existeJugadorJuego.length != 0) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "El jugador ya forma parte de este juego "
      );
    }
    if (!existeInvitadoJuego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "Se necesita que exista previamente una invitación al jugador para este juego"
      );
    }
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe una invitación pendiente de aceptación para este juego"
    );
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

// export const eliminarJuegoDeJugador = async (
//   id_jugador: number,
//   id_juego: number
// ) => {
//   const jugador_juego = await prisma.jugadores_Juegos.delete({
//     where: {
//       id_jugador,
//       id_juego
//     },
//     include: {
//       invitados_juegos: true,
//       jugadores_juegos: true,
//     },
//   });

//   return jugador_juego;
// };
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
      include: {
        jugadores_juegos: {
          include: {
            jugador: {
              select: {
                id: true,
                usuario: true,
                nombre: true,
              },
            },
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

const obtenerCreadorDeJuego = async (id_juego: number) => {
  const creador = await prisma.jugadores.findFirst({
    where: {
      jugadores_juegos: {
        some: {
          id_juego,
          rol: "Creador",
        },
      },
    },
  });
};

export const obtenerJuegosConEstado = async (
  id_jugador: number,
  estado: EstadoInvitacion[]
) => {
  const jugadorJuegosEstados = await prisma.jugadores.findMany({
    where: {
      id: id_jugador,
      invitado: {
        invitados_juegos: {},
      },
    },
    include: {
      invitado: {
        include: {
          invitados_juegos: {
            where: {
              estado_invitacion: {
                in: estado,
              },
            },
            include: {
              juego: {},
            },
          },
        },
      },
    },
  });

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

export const iniciarJuego = async (id_juego: number) => {
  const juegoIniciado = await prisma.juegos.update({
    where: {
      id: id_juego,
    },
    data: {
      estado_juego: "Iniciado",
    },
  });

  const turno = await prisma.turnos.create({
    data: {
      estado_turno: "Actual",
      monto_minimo_puja: Math.trunc((juegoIniciado.saldo_restante * 8) / 100),
      juego: {
        connect: { id: id_juego },
      },
    },
    include: {
      juego: true,
    },
  });

  console.log({
    monto_total: juegoIniciado.monto_total,
    cant_jugadores: juegoIniciado.cant_jugadores,
  });

  const montoAPagar: number = Math.trunc(
    juegoIniciado.monto_total / juegoIniciado.cant_jugadores
  );

  console.log(montoAPagar);

  const juego = await prisma.juegos.update({
    where: {
      id: id_juego,
    },
    data: {
      estado_juego: "Puja",
      saldo_restante: {
        decrement: montoAPagar,
      },
    },
    include: {
      turnos: true,
    },
  });
  console.log({ juego });

  return { juego, turno };
};

export const crearPuja = async (
  // id_jugador_juego: number,
  id_jugador: number,
  id_juego: number,
  id_turno: number,
  payLoad: Prisma.Jugador_Grupo_TurnoCreateInput
) => {
  console.log({ id_jugador, id_juego, id_turno });
  const juego = await prisma.juegos.findFirst({
    where: {
      id: id_juego,
    },
  });

  const turno = await prisma.turnos.findUnique({
    where: {
      id: id_turno,
    },
  });

  // TODO: Si el creador ingresa a cuenta de un jugador que incumplió los pagos, este proceso falla
  const jugador_juego = await prisma.jugadores_Juegos.findFirst({
    where: {
      id_jugador,
      id_juego,
    },
  });

  if (
    juego &&
    turno &&
    jugador_juego &&
    payLoad.monto_puja >= turno.monto_minimo_puja
  ) {
    const data: Prisma.Jugador_Grupo_TurnoCreateInput = {
      ...payLoad,
      turno: {
        connect: { id: id_turno },
      },
      jugadores_juegos: {
        connect: { id: jugador_juego.id },
      },
    };
    const jugador_grupo_turno = prisma.jugador_Grupo_Turno.create({
      data,
    });

    return jugador_grupo_turno;
  } else {
    if (!juego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el juego indicado"
      );
    }
    if (!turno) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el turno indicado"
      );
    }
    if (!jugador_juego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe el jugador_juego indicado"
      );
    }
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      `El monto mínimo de la puja debe ser mayor al 8% del saldo del turno`
    );
  }
};
