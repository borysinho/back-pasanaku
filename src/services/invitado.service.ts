import { EstadoInvitacion, Prisma } from "@prisma/client";
import prisma from "./prisma.service";
import { obtenerJuego } from "./juego.service";
import {
  HttpStatusCodes400,
  defaultInvitacionAJuego,
  fechaHoraActual,
} from "../utils";
import { HttpException } from "../exceptions";
import {
  obtenerCuentaCreadaDeUnInvitado,
  obtenerJugador,
} from "./jugador.service";
import {
  notificarPorCorreo,
  notificarPorWhatsapp,
  sendFcmMessage,
} from "./notificacion.service";

export const existeInvitadoJuego = async (
  id_juego: number,
  correo: string,
  telf: string
) => {
  const invitado = await buscarInvitado(correo, telf);
  const juego = await obtenerJuego(id_juego);

  if (invitado && juego) {
    const invitado_juego = await prisma.invitados_Juegos.findUnique({
      where: {
        id: {
          id_invitado: invitado.id,
          id_juego: juego.id,
        },
      },
    });

    return { invitado, juego, invitado_juego };
  } else {
    return { invitado, juego, invitado_juego: null };
  }
};

export const buscarCorreo = async (correo: string) => {
  const invitado = await prisma.invitados.findUnique({
    where: {
      correo,
    },
  });

  return invitado;
};

export const buscarTelefono = async (telf: string) => {
  const invitado = await prisma.invitados.findUnique({
    where: {
      telf,
    },
  });

  return invitado;
};

const upsertInvitadosJuegos = async (
  id_juego: number,
  id_invitado: number,
  estado_invitacion: EstadoInvitacion,
  nombre_invitado: string
) => {
  const invitado = await prisma.invitados_Juegos.upsert({
    where: {
      id: {
        id_invitado,
        id_juego,
      },
    },
    update: {
      estado_invitacion,
    },
    create: {
      id_invitado,
      id_juego,
      estado_invitacion: "Pendiente",
      nombre_invitado,
    },
    select: {
      nombre_invitado: true,
      estado_invitacion: true,
      estado_notificacion_correo: true,
      estado_notificacion_whatsapp: true,
      periodo: true,
      fecha: true,
    },
  });

  return invitado;
};

const crearInvitadoEInvitado_Juego = async (
  id_juego: number,
  nombre_invitado: string,
  correo: string,
  telf: string
  // data: Prisma.InvitadosCreateInput
) => {
  // Creamos el invitado y luego creamos el detalle entre invitados y juegos

  const invitado = await prisma.invitados.create({
    data: {
      telf,
      correo,

      invitados_juegos: {
        create: {
          id_juego,
          nombre_invitado,
          fecha: fechaHoraActual(),
        },
      },
    },
    include: {
      invitados_juegos: true,
    },
  });

  return invitado;
};

export const obtenerInvitadosJuegosPorID = async (
  id_invitado: number,
  id_juego: number
) => {
  const invitados_juegos = await prisma.invitados_Juegos.findUnique({
    where: {
      id: {
        id_invitado,
        id_juego,
      },
    },
  });

  return invitados_juegos;
};

export const crearInvitado = async (
  id_juego: number,
  nombre_invitado: string,
  correo: string,
  telf: string
) => {
  // El juego debe estar creado previamente
  const juego = await obtenerJuego(id_juego);
  if (juego) {
    const invitado_correo = await buscarCorreo(correo);
    const invitado_telf = await buscarTelefono(telf);

    // Si el correo y el telefono ya están registrados previamente en otra invitación, entonces ambos deben coincidir en una misma invitación
    if (invitado_correo && invitado_telf) {
      console.log("invitado_correo && invitado_telf EXISTEN");
      if (invitado_correo.id === invitado_telf.id) {
        // Si coinciden, conectamos el registro del invitado con un registro nuevo de detalle entre invitados y juegos
        console.log(
          "invitado_correo.id === invitado_telf.id SON IGUALES, el invitado YA EXISTE y se procede a crear el detalle o conectar a uno existente"
        );
        // Preguntamos si existe el detalle entre invitados y juegos, no existe, lo creamos, caso contrario, no hacemos nada
        const invitado_juego = await obtenerInvitadosJuegosPorID(
          invitado_correo.id,
          id_juego
        );

        // Si el detalle existe, actualizamos el estado de la invitación
        if (!invitado_juego) {
          // Si el detalle no existe, lo creamos
          console.log(
            "invitado_juego NO EXISTE, se procede a crear el detalle"
          );
          return await upsertInvitadosJuegos(
            id_juego,
            invitado_correo.id,
            "Pendiente",
            nombre_invitado
          );
        } else {
          console.log("invitado_juego EXISTE, no se realiza ninguna acción");
          return invitado_juego;
        }
      } else {
        // Existen tanto el correo como el teléfono pero ya están previamente registrados en invitaciones distintas
        throw new HttpException(
          HttpStatusCodes400.NOT_ACCEPTABLE,
          "El correo y teléfono especificados ya se encuentran registrados previamente, pero en invitaciones distintas."
        );
      }
    } else {
      // Puede existir el correo o puede existir el teléfono
      // Si existe solo el teléfono registrado en una invitación pero no el correo, generamos un error
      if (invitado_telf) {
        throw new HttpException(
          HttpStatusCodes400.NOT_ACCEPTABLE,
          "El teléfono ya se encuentra registrado en otra invitación. Proveer un nro. de teléfono distinto o proveer el mismo correo del nro. de teléfono previamente registrado"
        );
      } else {
        // Si existe solo el correo registrado en una invitación pero no el teléfono, generamos un error
        if (invitado_correo) {
          throw new HttpException(
            HttpStatusCodes400.NOT_ACCEPTABLE,
            "El correo ya se encuentra registrado en otra invitación. Proveer correo distinto o proveer el mismo nro. de teléfono del correo previamente registrado"
          );
        } else {
          // No existe ni el correo ni el teléfono, entonces registramos el invitado enviando el id_invitado = 0 para que no coincida y lo cree al invitado
          console.log(
            "invitado_correo.id !== invitado_telf.id NO EXISTE ni el correo ni el teléfono previamente registrado. Se procede a crear el INVITADO y a crear el DETALLE entre invitados y juegos"
          );
          return await crearInvitadoEInvitado_Juego(
            id_juego,
            nombre_invitado,
            correo,
            telf
          );
        }
      }
    }
  } else {
    throw new HttpException(
      HttpStatusCodes400.NOT_ACCEPTABLE,
      "El juego especificado no existe"
    );
  }
};

// const enviarNotificacionPush = async (
//   id_invitado: number,
//   id_jugador_creador: number
// ) => {
//   // Obtenemos la cuenta del jugador al que se le invitó
//   // Si el jugador_creador existe y además el jugador_invitado ya se ha creado cuenta, entonces enviar notificación
//   // Caso contrario:
//   // Si el jugador_creador no existe, es porque el cliente envió incorrectamente los datos y debería retornar una excepción
//   // Si el jugador_invitado no se ha creado cuenta, se debería enviar las notificaciones para descargar el juego

//   const cuentaJugadorInvitado = await obtenerCuentaCreadaDeUnInvitado(
//     id_invitado
//   );
//   const cuentaJugadorCreador = await obtenerJugador(id_jugador_creador);
//   console.log({ cuentaJugadorInvitado, cuentaJugadorCreador });

//   if (cuentaJugadorCreador && ) {

//   } else {

//   }

//   if (cuentaJugadorInvitado && cuentaJugadorCreador) {
//     const message = defaultInvitacionAJuego(
//       id_juego,
//       cuentaJugadorInvitado.id,
//       juego.nombre,
//       cuentaJugadorCreador.nombre,
//       cuentaJugadorInvitado.client_token
//     );

//     sendFcmMessage(message);
//   }
// };

// export const crearInvitado = async (
//   id_juego: number,
//   correo: string,
//   telf: string,
//   nombre_invitado: string
// ) => {
//   console.log({ id_juego, correo, telf, nombre_invitado });
//   return await upSertInvitadosJuegos(id_juego, nombre_invitado, correo, telf);
// };

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

export const obtenerCorreosInvitados = async (
  idsInvitados: { id: number }[]
) => {
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

export const obtenerTelefonosInvitados = async (
  idsInvitados: { id: number }[]
) => {
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
