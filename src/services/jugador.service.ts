import { Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import { HttpException } from "../exceptions";
import {
  HttpStatusCodes400,
  fechaHoraActual,
  programarNotificarInicioDePagos,
  sumarSegundosAFecha,
} from "../utils";
import { buscarInvitado } from "./invitado.service";

// const prisma = new PrismaClient();

// export const crearJugadorSinRelacionarAInvitado = async (
export const crearJugadorSinSerInvitado = async (
  { nombre, usuario, contrasena, qr }: Prisma.JugadoresCreateInput,
  { telf, correo }: Prisma.InvitadosCreateInput
) => {
  const jugador = await prisma.jugadores.create({
    data: {
      nombre,
      usuario,
      contrasena,
      qr,
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
      qr: true,
      invitado: true,
    },
  });

  return jugador;
};

// export const crearJugadorRelacionandoAInvitado = async (
export const crearJugadorAPartirDeInvitacion = async (
  // {
  //   nombre,
  //   usuario,
  //   contrasena,
  //   client_token,
  //   qr,
  // }
  input: Prisma.JugadoresCreateInput,
  { telf, correo }: Prisma.InvitadosCreateInput
) => {
  const invitadoBuscado = await buscarInvitado(correo, telf);

  if (invitadoBuscado) {
    const jugador = await prisma.jugadores.create({
      data: {
        ...input,
        invitado: {
          connect: {
            correo,
            telf,
          },
        },
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
  const jugador = await prisma.jugadores.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      usuario: true,
      invitado: true,
      client_token: true,
      qr: true,
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
      qr: true,
    },
  });

  return jugadores;
};

const actualizarTurnoSiCorresponde = async (id_jugador: number) => {
  // Validamos si tiene registrado su QR y además si el es ganador de un turno que está en estado "TiempoEsperandoQR", entonces cambiamos el turno a "TiempoPagosTurnos" e iniciamos el tiempo de pagos
  // Obtenemos un listado de los turnos que están en estado "TiempoEsperandoQR" y que el jugador es ganador

  console.log("Actualizando turno si corresponde");
  const jugador_juego = await prisma.jugadores_Juegos.findMany({
    where: {
      id_jugador,
    },
  });

  jugador_juego.forEach(async (jugador_en_juego) => {
    const turnos_ganador_jugador = await prisma.turnos.findMany({
      where: {
        estado_turno: "TiempoEsperandoQR",
        id_ganador_jugador_juego: jugador_en_juego.id,
      },
    });

    console.log({ horaActual: fechaHoraActual() });
    console.log({ jugador_en_juego });
    console.log({ turnos_ganador_jugador });

    if (turnos_ganador_jugador.length > 0) {
      // Actualizamos el turno a "TiempoPagosTurnos" y actualizamos la fecha de inicio de pagos
      turnos_ganador_jugador.forEach(async (turno_en_bucle) => {
        const turno = await prisma.turnos.update({
          where: {
            id: turno_en_bucle.id,
          },
          data: {
            estado_turno: "TiempoPagosTurnos",
            fecha_inicio_pago: fechaHoraActual(),
          },
        });
        console.log({ TURNOENESPERA_QR: turno });

        // Programamos el fin de tiempo de pagos
        programarNotificarInicioDePagos(
          sumarSegundosAFecha(fechaHoraActual(), 5),
          turno.id
        );
      });
    }
  });
};

export const actualizarJugador = async (
  { nombre, contrasena, qr }: Prisma.JugadoresUpdateInput,
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
        qr,
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
        qr: true,
        invitado: true,
      },
    });

    await actualizarTurnoSiCorresponde(id);

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
        qr: true,
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
      qr: true,
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
      qr: true,
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
      qr: true,
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
      qr: true,
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

export const obtenerJugadores_JuegosDeUnJuego = async (id_juego: number) => {
  const jugadores_juegos = await prisma.jugadores_Juegos.findMany({
    where: {
      id_juego,
    },
  });

  return jugadores_juegos;
};

export const obtenerJugador_JuegoPorId = async (id_jugador_juego: number) => {
  const jugador_juego = await prisma.jugadores_Juegos.findUnique({
    where: {
      id: id_jugador_juego,
    },
  });

  return jugador_juego;
};

export const obtenerJugadorExpulsadoDesdeJugador_Juego = async (
  id_jugador_juego: number
) => {
  const jugador = await prisma.jugadores.findMany({
    where: {
      Expulsados: {
        some: {
          id_jugador_juego,
        },
      },
    },
  });

  if (jugador.length === 1) {
    return jugador[0];
  } else {
    return null;
  }
};

export const obtenerCreadorDeJuego = async (id_juego: number) => {
  const jugador = await prisma.jugadores.findFirst({
    where: {
      jugadores_juegos: {
        some: {
          id_juego,
          rol: "Creador",
        },
      },
    },
  });

  return jugador;
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
    select: {
      id: true,
      nombre: true,
      usuario: true,
      client_token: true,
      qr: true,
    },
  });

  return jugador;
};
