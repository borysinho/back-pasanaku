// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
import https from "https";
import { google } from "googleapis";
import { Twilio } from "twilio";
import prisma from "./prisma.service";
import {} from "firebase-admin";
import nodemailer from "nodemailer";
import { templateWhatsApp } from "../templates/whatsapp.template";
import { templateEMail } from "../templates/email.template";
import { Jugadores, Jugadores_Juegos, Prisma } from "@prisma/client";
// import { obtenerJuego } from "./juego.service";
import { HttpException } from "../exceptions";
import {
  obtenerCorreosInvitados,
  obtenerInvitado,
  obtenerTelefonosInvitados,
} from "./invitado.service";
import {
  HttpStatusCodes400,
  HttpStatusCodes500,
  sumarSegundosAFecha,
  formatearTiempo,
  defaultFinOfertas,
  defaultInvitacionAJuego,
} from "../utils";
import Mail from "nodemailer/lib/mailer";

import { defaultInicioOfertas } from "../utils";
import {
  obtenerCuentaCreadaDeUnInvitado,
  obtenerJugador,
  obtenerJugadores,
  obtenerJugadoresDeJuego,
} from "./jugador.service";
import { obtenerTurnoPorId, obtenerTurnosDeJuego } from "./turno.service";
import {
  buscarJugadorJuego,
  buscarJugadorJuegoPorId,
  obtenerCreadorDeJuego,
  obtenerJuego,
} from "./juego.service";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const de = process.env.TWILIO_FROM_NUMBER;
const client = new Twilio(accountSid, authToken);
const correo_de = process.env.CORREO_DIR;
const correo_pass = process.env.CORREO_PASS;

const enviarInvitacionCorreo = async (
  para: string[],
  nombre_juego: string,
  link_app: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: correo_de,
      pass: correo_pass,
    },
  });

  const html: string = templateEMail(nombre_juego, link_app);

  const mailOptions = {
    from: correo_de,
    to: para,
    subject: "Invitación a Pasanaku",
    // text: "",
    html,
  };

  try {
    const { messageId, accepted, rejected, response } =
      await transporter.sendMail(mailOptions);
    return {
      mailResult: {
        error: false,
        messageId,
        accepted,
        rejected,
        response,
      },
    };
  } catch (err: any) {
    return new HttpException(HttpStatusCodes500.SERVICE_UNAVAILABLE, err);
  }

  // const res = transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     throw new Error(error.message);
  //   } else {
  //     console.log({ info });
  //     return { info };
  //   }
  // });

  // console.log({ res });
  // return res;
};

const acceptedOrRejectedToString = (value: (string | Mail.Address)[]) => {
  const acceptedRecipients: string[] = value.map(
    (recipient: string | Mail.Address) => {
      if (typeof recipient === "string") {
        return recipient;
      } else {
        return recipient.address;
      }
    }
  );

  return acceptedRecipients;
};

export const notificarPorCorreo = async (
  idsInvitados: { id: number }[],
  id_Juego: number
) => {
  const linkApp = process.env.LINK_APP || "";
  const juego = await obtenerJuego(id_Juego);
  if (juego) {
    const correos = await obtenerCorreosInvitados(idsInvitados);
    const invitacion = await enviarInvitacionCorreo(
      correos,
      juego.nombre,
      linkApp
    );

    //ACTUALIZAMOS LOS ESTADOS DEL ENVÍO DEL CORREO
    if (invitacion instanceof HttpException) {
      actualizarEstadosCorreo(id_Juego, correos, {
        estado_invitacion: "Pendiente",
        estado_notificacion_correo: "EnvioIncorrecto",
      });
    } else {
      const accepted = acceptedOrRejectedToString(
        invitacion.mailResult.accepted
      );
      const rejected = acceptedOrRejectedToString(
        invitacion.mailResult.rejected
      );

      if (accepted) {
        actualizarEstadosCorreo(id_Juego, accepted, {
          estado_invitacion: "Pendiente",
          estado_notificacion_correo: "EnvioCorrecto",
        });
      }

      if (rejected) {
        actualizarEstadosCorreo(id_Juego, rejected, {
          estado_invitacion: "Pendiente",
          estado_notificacion_correo: "EnvioIncorrecto",
        });
      }
    }

    return invitacion;
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No existe un juego con el id_juego especificado"
    );
  }
};

const enviarMensajeWhatsapp = async (para: string) => {
  try {
    const qr = process.env.LINK_QR || "";
    console.log(`whatsapp:${para}`);
    console.log(process.env.TWILIO_FROM_NUMBER);

    const { to, status } = await client.messages.create({
      mediaUrl: [qr],
      from: process.env.TWILIO_FROM_NUMBER,
      to: `whatsapp:${para}`,
      body: templateWhatsApp,
    });

    console.log("twilio: ", to, status);
    return {
      error: false,
      to,
      status,
    };
    // .then((message: any) => {
    //   return message;
    // })
    // .catch((error: any) => {
    //   console.error(error.message);
    //   throw new Error(error.message);
    // });
  } catch (error: any) {
    console.log(error);
    return new HttpException(HttpStatusCodes500.SERVICE_UNAVAILABLE, error);
  }
};

export const notificarPorWhatsapp = async (
  idJuego: number,
  idsInvitados: { id: number }[]
) => {
  let resp: any = [];
  try {
    const telefonos = await obtenerTelefonosInvitados(idsInvitados);
    for (const element of idsInvitados) {
      const { id: id_invitado } = element;

      const invitadoObtenido = await obtenerInvitado(id_invitado);

      if (invitadoObtenido) {
        const mensaje = await enviarMensajeWhatsapp(invitadoObtenido.telf);

        //ACTUALIZAMOS LOS ESTADOS DEL ENVÍO
        if (mensaje instanceof HttpException) {
          actualizarEstadosWhatsApp([invitadoObtenido.id], idJuego, {
            estado_invitacion: "Pendiente",
            estado_notificacion_whatsapp: "EnvioIncorrecto",
          });
          resp.push({
            error: true,
            message: mensaje.getAttr(),
          });
        } else {
          actualizarEstadosWhatsApp([invitadoObtenido.id], idJuego, {
            estado_invitacion: "Pendiente",
            estado_notificacion_whatsapp: "EnvioCorrecto",
          });
          resp.push(mensaje);
        }
      }
    }

    return { whatsAppResult: resp };
  } catch (error: any) {
    const myError = new HttpException(
      HttpStatusCodes500.SERVICE_UNAVAILABLE,
      error
    );
    resp.push(myError.getAttr());
    return { whatsAppResult: resp };
  }
};

const notificarUnirseAJuegoPush = async (
  id_juego: number,
  idsInvitados: { id: number }[]
) => {
  const juego = await obtenerJuego(id_juego);

  let resp: { jugador: string; enviado: boolean; mensaje?: string }[] = [];
  if (juego) {
    // idsInvitados.forEach(async (value) => {

    for (const id in idsInvitados) {
      if (Object.prototype.hasOwnProperty.call(idsInvitados, id)) {
        const value = idsInvitados[id];

        // Con validaciones previas, asumimos que todos los ID's obtenidos por parámetros corresponden únicamente a ID's de usuarios que ya se han creado cuenta pero que no se han unido a un juego

        // Obtenemos la cuenta del jugador
        const cuentaJugador = await obtenerCuentaCreadaDeUnInvitado(value.id);

        // Si existe la cuenta del jugador y además existe el token de firebase
        if (cuentaJugador && cuentaJugador.client_token !== "") {
          // Buscamos el creador del juego desde el ID del juego
          const cuentaCreador = await obtenerCreadorDeJuego(juego.id);

          // Si obtenemos el creador del juego, podemos enviar la notificación
          if (cuentaCreador) {
            const message = defaultInvitacionAJuego(
              juego.id,
              cuentaJugador.id,
              juego.nombre,
              cuentaCreador.nombre,
              cuentaJugador.client_token
            );
            sendFcmMessage(message);
            resp.push({
              jugador: cuentaJugador.nombre,
              enviado: true,
            });
          } else {
            resp.push({
              enviado: false,
              jugador: cuentaJugador.nombre,
              mensaje: `No se encontró la cuenta del creador del juego. Juego.ID: ${juego.id}`,
            });
          }
        } else {
          if (!cuentaJugador) {
            resp.push({
              enviado: true,
              jugador: `invidato.id: ${value.id}`,
              mensaje: `No se encontró la cuenta del jugador con el ID de invitado: ${value.id} `,
            });
          } else {
            // cuentaJugador.client_token === ""; el token de FireBase está vacío
            resp.push({
              enviado: true,
              jugador: cuentaJugador.nombre, // `invidato.id: ${value.id}`,
              mensaje: `El jugador se ha creado una cuenta pero no tiene un token de FireBase asignado: ${value.id} `,
            });
          }
        }
      }
    }
    // });
  } else {
    resp.push({
      enviado: true,
      jugador: `juego.id: ${id_juego}`, // `invidato.id: ${value.id}`,
      mensaje: `No se encuentra el juego para el ID ${id_juego} `,
    });
  }
  return resp;
};

export const notificarDescargarOUnirse = async (
  id_juego: number,
  idsInvitados: { id: number }[]
) => {
  // Separamos en listas diferentes los invitados a los que se les debe notificar que se descarguen la aplicación por Correo y WhatsApp y a los usuarios que se les debe notificar para que se unan a una partida mendiante una notificación Push

  let unirse: { id: number }[] = [];
  let descargar: { id: number }[] = [];

  console.log({ id_juego, idsInvitados });

  // idsInvitados.forEach(async (value) => {
  for (const id in idsInvitados) {
    // console.log({ id });
    const value = idsInvitados[id];
    // console.log({ value });
    const jugador = await obtenerCuentaCreadaDeUnInvitado(value.id);
    // console.log({ jugador });
    if (jugador) {
      // Si existe el jugador y además NO existe el detalle entre jugador y juego (NO se ha unido al juego)
      const jugador_juego = await buscarJugadorJuego(id_juego, jugador.id);
      // console.log({ jugador_juego });
      if (jugador_juego.length === 0) {
        // Adicionamos el ID invitado a la lista de ID's para unirse
        unirse.push(value);
        // console.log({ unirse });
      } else {
        // Existe la cuenta del jugador y además ya se ha unido, no hacemos nada
      }
    } else {
      // El invitado aún no se ha creado cuenta, se adiciona el ID invitado a la lista de ID's para descargar
      descargar.push(value);
      // console.log({ descargar });
    }
  }

  let mensajesCorreo = null;
  let mensajesWhatsapp = null;

  console.log({ descargar, unirse });

  // Obtenemos la respuesta del envío de notificaciones por correo
  if (descargar.length > 0) {
    const respCorreo = await notificarPorCorreo(descargar, id_juego);
    mensajesCorreo =
      respCorreo instanceof HttpException
        ? { mailResult: respCorreo.getAttr() }
        : respCorreo;

    // Obtenemos la respuesta del envío de notificaciones por WhatsApp
    mensajesWhatsapp = await notificarPorWhatsapp(id_juego, descargar);
  }
  console.log({ mensajesCorreo, mensajesWhatsapp });

  let pushUnirse = null;
  if (unirse.length > 0) {
    pushUnirse = await notificarUnirseAJuegoPush(id_juego, unirse);
  }

  console.log({ pushUnirse });
  return { mensajesCorreo, mensajesWhatsapp, pushUnirse };
};

const actualizarEstadosWhatsApp = async (
  idsInvitados: number[],
  id_juego: number,
  estado: Prisma.Invitados_JuegosUpdateInput
) => {
  console.log({ idsInvitados });
  const estadoInvitacion = await prisma.invitados_Juegos.updateMany({
    where: {
      id_juego,
      id_invitado: {
        in: idsInvitados,
      },
    },
    data: estado,
  });

  console.log({ estadoInvitacion });

  return estadoInvitacion;
};

const actualizarEstadosCorreo = async (
  id_juego: number,
  correos: string[],
  data: Prisma.Invitados_JuegosUpdateInput
) => {
  console.log({ correos });
  const invitados_juegos = prisma.invitados_Juegos.updateMany({
    where: {
      id_juego,
      invitado: {
        correo: {
          in: correos,
        },
      },
    },
    data,
  });

  console.log({ invitados_juegos });
  return invitados_juegos;
};

export const inicioDeOfertas = async (id_juego: number) => {
  const message = {
    notification: {
      title: "Titulo",
      body: "Cuerpo",
    },
  };
};

const keys_path: string = process.env.GOOGLE_APPLICATION_CREDENTIALS || "";
const PROJECT_ID = process.env.FB_PROJECT_ID;
const HOST = "fcm.googleapis.com";
const PATH = "/v1/projects/" + PROJECT_ID + "/messages:send";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

function getAccessToken() {
  return new Promise(function (resolve, reject) {
    const key = require(keys_path);
    const jwtClient = new google.auth.JWT(
      key.client_email,
      keys_path,
      key.private_key,
      SCOPES,
      key.client_email
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens?.access_token);
    });
  });
}

export function sendFcmMessage(fcmMessage: Object) {
  getAccessToken().then(function (accessToken) {
    const options = {
      hostname: HOST,
      path: PATH,
      method: "POST",
      // [START use_access_token]
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      // [END use_access_token]
    };

    const request = https.request(options, function (resp) {
      resp.setEncoding("utf8");
      resp.on("data", function (data) {
        console.log("Message sent to Firebase for delivery, response:");
        console.log(data);
      });
    });

    request.on("error", function (err) {
      console.log("Unable to send message to Firebase");
      console.log(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}

export const notificarInicioOfertas = async (
  id_juego: number,
  id_turno: number
) => {
  const juego = await obtenerJuego(id_juego);
  const turno = await obtenerTurnoPorId(id_turno);
  const jugadores: Jugadores[] = await obtenerJugadoresDeJuego(id_juego);

  let resp: { jugador: string; enviado: boolean; mensaje?: string }[] = [];

  if (juego && turno && jugadores.length > 0) {
    const fecha_fin = sumarSegundosAFecha(
      turno.fecha_inicio_puja,
      turno.tiempo_puja_seg
    );

    jugadores.forEach((jugador) => {
      if (jugador.client_token != "") {
        const message = defaultInicioOfertas(
          jugador.client_token,
          juego.nombre,
          juego.id,
          jugador.id,
          fecha_fin,
          turno.tiempo_puja_seg
        );

        sendFcmMessage(message);
        resp.push({
          jugador: jugador.nombre,
          enviado: true,
        });
      } else {
        resp.push({
          jugador: jugador.nombre,
          enviado: false,
          mensaje: "No se encontró un token de notificaciones para el jugador",
        });
      }
    });

    return resp;
  } else {
    if (!juego) {
      throw new HttpException(
        HttpStatusCodes400.NOT_FOUND,
        "No se encuentra el juego especificado"
      );
    }

    throw new HttpException(
      HttpStatusCodes400.NOT_FOUND,
      "No se encontraron jugadores que se hayan unido al juego"
    );
  }
};

const actualizarGanadorDeTurno = async (
  id_turno: number,
  id_jugador_juego: number
) => {
  const turno = await prisma.turnos.update({
    where: {
      id: id_turno,
    },
    data: {
      // id_ganador_jugador_grupo_turno: id_jugador_juego,
      id_ganador_jugador_juego: id_jugador_juego,
    },
  });

  return turno;
};

const participantesDeJuego = async (id_juego: number) => {
  const jugador_juego = await prisma.jugadores_Juegos.findMany({
    where: {
      id_juego,
    },
  });

  return jugador_juego;
};

export const notificarGanadorDeTurno = async (id_juego: number) => {
  // Obtenemos el turno que se está jugando en el momento

  console.log(`Proceso: Notificar ganador de juego ${id_juego}`);
  const turnoEscuchandoOfertas = await prisma.turnos.findMany({
    where: {
      id_juego,
      estado_turno: "TiempoOfertas",
    },
  });

  const juego = await obtenerJuego(id_juego);

  if (turnoEscuchandoOfertas.length === 1 && juego !== null) {
    // Hay un turno que está en juego con estado "Actual"
    const id_turno = turnoEscuchandoOfertas[0].id;

    // Obtenemos la primera de todas las pujas ordenado de mayor a menor
    const jugador_grupo_turno = await prisma.pujas.findFirst({
      where: {
        id_turno,
      },
      orderBy: {
        monto_puja: "desc",
      },
    });

    // Obtenemos los participantes
    const jugador_juego = await participantesDeJuego(id_juego);

    let jugador_juego_ganador: Jugadores_Juegos;

    // variable que guarda el monto con el que ganó el turno
    let monto_pujado_para_ganar: number = 0;

    // Preguntamos si NO hubo pujas
    if (jugador_grupo_turno === null) {
      // No hubo ganador, seleccionamos un ganador entre los jugadores que no han han ganado un turno

      // Seleccionamos los ganadores de los turnos
      const turnosConGanadores: number[] = (
        await prisma.turnos.findMany({
          where: {
            NOT: {
              id_ganador_jugador_juego: null,
            },
          },
        })
      )
        .map((t) => t.id_ganador_jugador_juego)
        .filter((id) => id !== null) as number[];

      const participantesJuego: number[] = jugador_juego.map((j) => j.id);

      const resta = [...participantesJuego].filter(
        (element) => !turnosConGanadores.includes(element)
      );

      console.log({ turnosConGanadores, participantesJuego, resta });

      // Función para obtener un número aleatorio
      const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      };

      // Obtenemos un ganador aleatorio
      const ganadorRandomico = resta[getRandomInt(resta.length - 1)];
      console.log({ ganadorRandomico });

      jugador_juego_ganador = await prisma.jugadores_Juegos.findUniqueOrThrow({
        where: {
          id: ganadorRandomico,
        },
      });
    } else {
      // Si hubo pujas, obtenemos al ganador
      jugador_juego_ganador = await prisma.jugadores_Juegos.findUniqueOrThrow({
        where: {
          id: jugador_grupo_turno.id_jugador_juego,
        },
      });

      // Guardamos el monto con el que ganó el turno
      monto_pujado_para_ganar = jugador_grupo_turno.monto_puja;
    }

    // Obtenemos el jugador ganador
    const jugador_ganador = await obtenerJugador(
      jugador_juego_ganador.id_jugador
    );

    console.log({ jugador_ganador });

    // Actualizamos el ganador del turno
    const turno_ganador = await actualizarGanadorDeTurno(
      id_turno,
      jugador_juego_ganador.id
    );

    // Actualizamos el estado del turno
    const turno_actualizado = await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "Pasado",
      },
    });

    // Obtenemos los participantes del juego
    const participantes = await participantesDeJuego(id_juego);

    // Recorremos todos los participantes del juego para notificarlos
    participantes.forEach(async (participante) => {
      const jugador = await prisma.jugadores.findUnique({
        where: {
          id: participante.id_jugador,
        },
      });

      // Si tienen un token para notificaciones las enviamos

      if (
        jugador !== null &&
        jugador.client_token &&
        jugador_ganador !== null
      ) {
        const message = defaultFinOfertas(
          jugador.client_token,
          id_juego,
          jugador_juego_ganador.id,
          participante.id,
          juego.nombre,
          jugador_ganador.nombre,
          monto_pujado_para_ganar,
          juego.moneda
        );
        //Aqui notificamos
        require("util").inspect.defaultOptions.depth = null;
        console.log({ EnviandoNotificacion: message });
        sendFcmMessage(message);
      }
    });

    return jugador_grupo_turno;
  } else {
    // turno.length === 1 && juego !== null
    if (turnoEscuchandoOfertas.length !== 1) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "El juego especificado no está en tiempo de Ofertas"
      );
    } else {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No existe un juego con el ID especificado"
      );
    }
  }
};

export const notificarInvitacionAJuego = async () => {};
