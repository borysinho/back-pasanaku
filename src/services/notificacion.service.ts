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
import {
  Jugadores,
  Jugadores_Juegos,
  Moneda,
  Prisma,
  Turnos,
} from "@prisma/client";
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
  defaultGanadorDeTurno,
  defaultInicioDePagos,
  programarNotificarInicioDePagos,
  // programarDeterminarGanadorDeJuego,
  // programarDeterminarSiLosPagosDeTurnosFueronRealizados,
  defaultInicioDePagosAlGanador,
  programarFinDeTiempoDePagos,
  defaultFinDeTiempoDePagos,
} from "../utils";
import Mail from "nodemailer/lib/mailer";

import { defaultInicioOfertas } from "../utils";
import {
  obtenerCuentaCreadaDeUnInvitado,
  obtenerJugador,
  obtenerJugadores,
  obtenerJugadoresDeJuego,
  obtenerJugadores_JuegosDeUnJuego,
} from "./jugador.service";
import { obtenerTurnoPorId, obtenerTurnosDeJuego } from "./turno.service";
import {
  buscarJugadorJuego,
  buscarJugadorJuegoPorId,
  obtenerCreadorDeJuego,
  obtenerJuego,
} from "./juego.service";
import { Console } from "console";

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
    const de = process.env.TWILIO_FROM_NUMBER || "";
    // console.log(`whatsapp:${para}`);
    // console.log(process.env.TWILIO_FROM_NUMBER);

    console.log({
      // mediaUrl: [qr],
      from: `whatsapp:${de}`,
      to: `whatsapp:${para}`,
      body: templateWhatsApp,
    });

    const { to, status } = await client.messages.create({
      mediaUrl: [qr],
      from: `whatsapp:${de}`,
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

const registrarSolicitudDePago = async (
  id_jugador_juego_iterando: number,
  id_turno: number,
  monto_a_pagar: number,
  moneda: Moneda,
  nombre_juego: string,
  nombre_jugador: string
) => {
  //Si NO existe ya una orden de pago para ese jugador con ese turno, entonces registramos

  const existe_pago = await prisma.pagos.findFirst({
    where: {
      id_jugador_juego: id_jugador_juego_iterando,
      tipo_pago: "Turno",
      pagos_turnos: {
        some: {
          id_turno,
        },
      },
    },
  });

  console.log({ existe_pago });

  // No existe la orden de pago, procedemos a registrar una
  if (existe_pago === null) {
    const pago = await prisma.pagos.create({
      data: {
        id_jugador_juego: id_jugador_juego_iterando,
        monto: monto_a_pagar,
        detalle: `Cobro de ${monto_a_pagar} ${moneda}. del juego ${nombre_juego} para ${nombre_jugador}`,
      },
    });
    console.log({ SolicitudDePago: pago });
  }
};

export const notificarGanadorDeTurno = async (id_juego: number) => {
  // Obtenemos el turno que se está jugando en el momento

  console.log(`NOTIFICANDOOOOOOOOOOOOOOOOOOO GANADOR DE TURNO ${id_juego}`);

  // Obtenemos los turnos de un juego que están en tiempo de ofertas
  const turnoEnTiempoDeOfertas = await prisma.turnos.findMany({
    where: {
      id_juego,
      estado_turno: "TiempoOfertas",
    },
  });

  // Obtenemos el juego
  const juego = await obtenerJuego(id_juego);

  console.log({ JUEGOOOOOO: juego });

  // Si solo existe un turno en tiempo de ofertas y el juego existe
  if (turnoEnTiempoDeOfertas.length === 1 && juego !== null) {
    // Solo hay un turno en tiempo de ofertas y está guardado en la variable turnoEnTiempoDeOfertas
    const id_turno = turnoEnTiempoDeOfertas[0].id;

    // Obtenemos la primera de todas las pujas ordenado de mayor a menor
    const jugador_grupo_turno = await prisma.pujas.findFirst({
      where: {
        id_turno,
      },
      orderBy: {
        monto_puja: "desc",
      },
    });

    console.log({ JUGADOR_GRUPO_TURNO: jugador_grupo_turno });

    // Obtenemos los participantes
    const jugador_juego = await participantesDeJuego(id_juego);

    console.log({ JUGADOR_JUEGOOOO: jugador_juego });

    let jugador_juego_ganador: Jugadores_Juegos;

    // variable que guarda el monto con el que ganó el turno
    let monto_pujado_para_ganar: number = 0;

    console.log({ MONTOPUJADOPARAGANAR: monto_pujado_para_ganar });

    // Preguntamos si NO hubo pujas
    if (jugador_grupo_turno === null) {
      // No hubo ganador, seleccionamos un ganador entre los jugadores que no han han ganado un turno
      console.log({ JUGADOR_GRUPO_TURNO: "jugador_grupo_turno === null)" });
      // Seleccionamos los turnos que tienen ganadores
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

      console.log({ TURNOSCONGANADORES: turnosConGanadores });

      // Seleccionamos el id de todos los jugadores que componen el juego
      const todosLosJugadoresDelJuego: number[] = jugador_juego.map(
        (j) => j.id
      );

      // Seleccionamos todos los jugadores que no han ganado un turno
      const jugadoresQueNoHanGanadoTurno = [
        ...todosLosJugadoresDelJuego,
      ].filter((element) => !turnosConGanadores.includes(element));

      // console.log({
      //   turnosConGanadores,
      //   participantesJuego: todosLosJugadoresDelJuego,
      //   resta: jugadoresQueNoHanGanadoTurno,
      // });

      // Función para obtener un número aleatorio
      const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      };

      // Obtenemos un ganador aleatorio
      const ganadorRandomico =
        jugadoresQueNoHanGanadoTurno[
          getRandomInt(jugadoresQueNoHanGanadoTurno.length - 1)
        ];
      // console.log({ ganadorRandomico });

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
      console.log({ JUGADOR_JUEGO_GANADORSANGOOO: jugador_juego_ganador });

      // Guardamos el monto con el que ganó el turno
      monto_pujado_para_ganar = jugador_grupo_turno.monto_puja;
    }

    // Obtenemos el jugador ganador
    const jugador_ganador = await obtenerJugador(
      jugador_juego_ganador.id_jugador
    );

    console.log({ JUGADORRRRRRR_GANADORRRRRR: jugador_ganador });

    if (jugador_ganador !== null) {
      // console.log({ jugador_ganador });

      // Actualizamos el ganador del turno
      const turno_ganador = await actualizarGanadorDeTurno(
        id_turno,
        jugador_juego_ganador.id
      );

      console.log({ TURNANGO_GANADORSANGO: turno_ganador });

      // Si hubo pujas, el monto  a pagar es el monto mensual - (el valor de la puja / (cantidad de participantes - 1))
      // Si no hubo pujas, el monto a pagar es el monto mensual
      const monto_mensual = Math.round(
        juego.monto_total / juego.cant_jugadores
      );

      const monto_a_pagar =
        monto_pujado_para_ganar === 0
          ? monto_mensual
          : monto_mensual -
            Math.round(monto_pujado_para_ganar / (juego.cant_jugadores - 1));

      console.log({ MONTO_A_PAGAR: monto_a_pagar });

      // Actualizamos el estado del turno y el monto a pagar
      const turno_actualizado = await prisma.turnos.update({
        where: {
          id: id_turno,
        },
        data: {
          estado_turno: "TiempoOfertasFinalizado",
          monto_pago: monto_a_pagar,
        },
      });

      console.log({ TURNO_ACTUALIZADO: turno_actualizado });

      // Obtenemos los participantes del juego
      const participantes = await participantesDeJuego(id_juego);
      console.log({ PARTICIPANTESSSSS: participantes });

      // Recorremos todos los participantes del juego para notificarlos
      for (const key in participantes) {
        const jugadorJuegoEnBucle = participantes[key];

        // console.log({ jugadorJuegoEnBucle });

        // Obtenemos el jugador del participante
        const jugadorEnBucle = await prisma.jugadores.findUnique({
          where: {
            id: jugadorJuegoEnBucle.id_jugador,
          },
        });
        console.log({ JUGADORENBUCLEEE: jugadorEnBucle });

        if (jugadorEnBucle !== null) {
          // Registramos la solicitud de pago solo si el jugador en bucle no es el ganador del turno
          if (jugadorEnBucle.id !== jugador_juego_ganador.id_jugador) {
            await registrarSolicitudDePago(
              jugadorJuegoEnBucle.id,
              turno_actualizado.id,
              monto_a_pagar,
              juego.moneda,
              juego.nombre,
              jugadorEnBucle.nombre
            );
          }

          // Empezamos a notificar solo a los que tienen token
          if (jugadorEnBucle.client_token !== "") {
            console.log({
              NOTIFICA_CON_TOKEN: `(jugadorEnBucle !== null && jugadorEnBucle.client_token !== "")`,
            });
            let message;

            // Si el jugador seleccionado es el ganador del turno, armamos un mensaje personalizado para él en caso de que tenga o no tenga QR subido
            if (jugadorEnBucle.id === jugador_juego_ganador.id_jugador) {
              console.log({
                ES_EL_PUTO_GANADOR:
                  "if (jugadorEnBucle.id === jugador_juego_ganador.id_jugador)",
              });
              message = defaultGanadorDeTurno(
                jugador_ganador.id,
                jugadorJuegoEnBucle.id,
                jugador_ganador.qr !== "",
                monto_pujado_para_ganar,
                juego.moneda,
                jugadorEnBucle.client_token
              );
            } else {
              // Si no es el ganador del turno, registramos una solicitud de pago para el jugador en bucle y luego lo notificamos
              console.log({
                NO_ES_EL_PUTO_GANADOR:
                  "else if (jugadorEnBucle.id === jugador_juego_ganador.id_jugador)",
              });

              message = defaultFinOfertas(
                jugadorEnBucle.client_token,
                id_juego,
                jugador_juego_ganador.id,
                jugadorJuegoEnBucle.id,
                juego.nombre,
                jugador_ganador.nombre,
                monto_pujado_para_ganar,
                juego.moneda
              );
            }

            require("util").inspect.defaultOptions.depth = null;
            // console.log({ EnviandoNotificacion: message });
            sendFcmMessage(message);
          }
        }
      }

      // Si el jugador ganador tiene un QR subido, actualizamos el estado a TiempoPagosTurnos y luego programamos la notificación para el inicio de pagos
      if (jugador_ganador.qr !== "") {
        const turno_actualizado = await prisma.turnos.update({
          where: {
            id: id_turno,
          },
          data: {
            estado_turno: "TiempoPagosTurnos",
          },
        });

        programarNotificarInicioDePagos(
          turno_actualizado.fecha_inicio_pago,
          turno_actualizado.id
        );
      } else {
        // Si el jugador ganador NO tiene un QR subido, tenemos que esperar que suba su QR para poder continuar con el proceso. El método que va a ejecutar será el update del jugador.
        // No realizamos ninguna acción
      }
    }

    return jugador_grupo_turno;
  } else {
    // turno.length === 1 && juego !== null
    if (turnoEnTiempoDeOfertas.length !== 1) {
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

export const notificarInicioDePagosDeTurnos = async (id_turno: number) => {
  /**
   * 1. Actualizamos el estado del turno a "TiempoPagosTurnos" y el monto de pago para cada jugador. El monto de pago debe ser actualizado respecto a la puja realizada para obtener el turno. Si la puja del ganador es > 0 entonces ese monto se divide entre todos los demás participantes debiendo pagar menos en su cuota del turno y el ganador recibe el monto del turno menos el monto de la puja
   * 2. Obtenemos el juego para notificar con el nombre del juego
   * 3. Obtenemos un listado de todos los jugadores que participan en el juego (jugadores_juegos)
   * 4. Recorremos cada uno de los jugadores_juegos y notificamos (en caso que tengan un token de Firebase) a cada uno de ellos que el proceso de pagos ha iniciado
   */

  // Obtenemos el turno
  const turno = await prisma.turnos.update({
    where: {
      id: id_turno,
    },
    data: {
      estado_turno: "TiempoPagosTurnos",
    },
  });

  // Obtenemos el juego
  if (turno) {
    // Obtenemos el juego
    const juego = await obtenerJuego(turno.id_juego);
    if (!juego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se encontró un juego con el ID indicado"
      );
    }
    // Obtenemos los jugadores que participan en el juego
    const jugadores_juegos = await obtenerJugadores_JuegosDeUnJuego(juego.id);
    if (jugadores_juegos.length === 0) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se encontraron jugadores que participen en el juego"
      );
    }
    // Recorremos cada uno de los jugadores_juegos y notificamos a cada uno de ellos que el proceso de pagos ha iniciado
    let message: Object = {};
    jugadores_juegos.forEach(async (jugador_juego) => {
      const jugador = await obtenerJugador(jugador_juego.id_jugador);
      if (
        jugador &&
        jugador.client_token !== "" &&
        jugador_juego.id !== turno.id_ganador_jugador_juego
      ) {
        message = defaultInicioDePagos(
          jugador_juego.id,
          jugador.id,
          juego.nombre,
          jugador.qr,
          turno.monto_pago,
          juego.moneda,
          jugador.client_token
        );
      } else {
        if (
          jugador &&
          jugador.client_token !== "" &&
          jugador_juego.id === turno.id_ganador_jugador_juego
        ) {
          message = defaultInicioDePagosAlGanador(
            jugador_juego.id,
            jugador_juego.id,
            juego.nombre,
            jugador.client_token
          );
        } else {
          // No hacer nada
        }
      }
      if (Object.keys(message).length !== 0) {
        require("util").inspect.defaultOptions.depth = null;
        // console.log({ message });
        sendFcmMessage(message);
      }
    });

    // Programamos el fin del tiempo de pagos
    programarFinDeTiempoDePagos(
      sumarSegundosAFecha(turno.fecha_inicio_pago, turno.tiempo_pago_seg),
      turno.id
    );

    return { turno };
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No se encontró un turno con el ID indicado"
    );
  }
};

export const notificarFinDePagosDeTurnos = async (id_turno: number) => {
  /**
   * 1. Actualizamos el estado del turno a "TiempoPagosTurnosFinalizado"
   * 2. Obtenemos el juego para notificar con el nombre del juego
   * 3. Obtenemos un listado de todos los jugadores que participan en el juego (jugadores_juegos)
   * 4. Recorremos cada uno de los jugadores_juegos y notificamos (en caso que tengan un token de Firebase) a cada uno de ellos que el proceso de pagos ha finalizado
   */

  // Obtenemos el turno
  const turno = await prisma.turnos.update({
    where: {
      id: id_turno,
    },
    data: {
      estado_turno: "Finalizado",
    },
  });

  // Obtenemos el juego
  if (turno) {
    // Obtenemos el juego
    const juego = await obtenerJuego(turno.id_juego);
    if (!juego) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se encontró un juego con el ID indicado"
      );
    }
    // Obtenemos los jugadores que participan en el juego
    const jugadores_juegos = await obtenerJugadores_JuegosDeUnJuego(juego.id);
    if (jugadores_juegos.length === 0) {
      throw new HttpException(
        HttpStatusCodes400.BAD_REQUEST,
        "No se encontraron jugadores que participen en el juego"
      );
    }
    // Recorremos cada uno de los jugadores_juegos y notificamos a cada uno de ellos que el proceso de pagos ha finalizado
    let message: Object = {};
    jugadores_juegos.forEach(async (jugador_juego) => {
      const jugador = await obtenerJugador(jugador_juego.id_jugador);
      if (jugador && jugador.client_token !== "") {
        message = defaultFinDeTiempoDePagos(
          jugador_juego.id,
          jugador.id,
          juego.nombre,
          jugador.client_token
        );
      }
      if (Object.keys(message).length !== 0) {
        require("util").inspect.defaultOptions.depth = null;
        // console.log({ message });
        sendFcmMessage(message);
      }
    });

    const turno_actualizado = await prisma.turnos.update({
      where: {
        id: id_turno,
      },
      data: {
        estado_turno: "Finalizado",
      },
    });

    return { turno };
  } else {
    throw new HttpException(
      HttpStatusCodes400.BAD_REQUEST,
      "No se encontró un turno con el ID indicado"
    );
  }
};
