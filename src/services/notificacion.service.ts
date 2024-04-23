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
import { obtenerJuego } from "./juego.service";
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
} from "../utils";
import Mail from "nodemailer/lib/mailer";

import { defaultInicioOfertas } from "../utils";
import {
  obtenerJugador,
  obtenerJugadores,
  obtenerJugadoresDeJuego,
} from "./jugador.service";

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
  idsInvitados: [],
  id_Juego: number
) => {
  try {
    const linkApp = process.env.LINK_APP || "";
    const { nombre } = await obtenerJuego(id_Juego);
    const correos = await obtenerCorreosInvitados(idsInvitados);
    const invitacion = await enviarInvitacionCorreo(correos, nombre, linkApp);

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
  } catch (error: any) {
    return new HttpException(HttpStatusCodes400.BAD_REQUEST, error.message);
  }
};

const enviarMensajeWhatsapp = async (para: string) => {
  try {
    const qr = process.env.LINK_QR || "";
    const { to, status } = await client.messages.create({
      mediaUrl: [qr],
      from: `whatsapp:${de}`,
      to: `whatsapp:${para}`,
      body: templateWhatsApp,
    });
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
    return new HttpException(HttpStatusCodes500.SERVICE_UNAVAILABLE, error);
  }
};

export const notificarPorWhatsapp = async (
  idJuego: number,
  idsInvitados: []
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

function sendFcmMessage(fcmMessage: Object) {
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

export const notificarInicioOfertas = async (id_juego: number) => {
  const juego = await obtenerJuego(id_juego);
  const jugadores: Jugadores[] = await obtenerJugadoresDeJuego(id_juego);
  let resp: { jugador: string; enviado: boolean; mensaje?: string }[] = [];

  if (juego && jugadores.length > 0) {
    const fecha_fin = sumarSegundosAFecha(
      juego.fecha_inicio_puja,
      juego.tiempo_puja_seg
    );

    jugadores.forEach((jugador) => {
      if (jugador.client_token != "") {
        const message = defaultInicioOfertas(
          jugador.client_token,
          juego.nombre,
          juego.id,
          fecha_fin,
          juego.tiempo_puja_seg
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

  console.log("Proceso: Notificar ganador de juego");
  const turno = await prisma.turnos.findMany({
    where: {
      id_juego,
      estado_turno: "Actual",
    },
  });

  const juego = await obtenerJuego(id_juego);

  if (turno.length === 1) {
    // Hay un turno que está en juego con estado "Actual"
    const id_turno = turno[0].id;

    // Obtenemos la primera de todas las pujas ordenado de mayor a menor
    const jugador_grupo_turno = await prisma.jugador_Grupo_Turno.findFirst({
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
    // Preguntamos si no hubo pujas
    if (jugador_grupo_turno === null) {
      // No hubo ganador, seleccionamos un ganador entre los participantes

      //Obtenemos un número randómico entre los participantes
      const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      };

      // Obtenemos el ganador
      jugador_juego_ganador =
        jugador_juego[getRandomInt(jugador_juego.length - 1)];
    } else {
      // Hubo al menos alguien que ofertó y el ganador es el primero de la lista jugador_grupo_turno
      // jugador_juego_ganador = jugador_grupo_turno[0].;
      jugador_juego_ganador = await prisma.jugadores_Juegos.findUniqueOrThrow({
        where: {
          id: jugador_grupo_turno.id_jugador_juego,
        },
      });
    }

    const jugador_ganador = await obtenerJugador(
      jugador_juego_ganador.id_jugador
    );

    //Actualizamos el ganador del turno
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
    participantes.forEach(async (element) => {
      const jugador = await prisma.jugadores.findUniqueOrThrow({
        where: {
          id: element.id_jugador,
        },
      });

      // Si tienen un token para notificaciones las enviamos
      if (jugador.client_token) {
        const message = defaultFinOfertas(
          jugador.client_token,
          id_juego,
          jugador_juego_ganador.id,
          juego.nombre,
          jugador_ganador.nombre
        );
        //Aqui notificamos
        console.log({ EnviandoNotificacion: message });
        sendFcmMessage(message);
      }
    });

    console.log({ jugador_grupo_turno });
    return jugador_grupo_turno;
  }
};
