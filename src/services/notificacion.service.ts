// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

import { Twilio } from "twilio";
import prisma from "./prisma.service";
import nodemailer from "nodemailer";
import { templateWhatsApp } from "../templates/whatsapp.template";
import { templateEMail } from "../templates/email.template";
import { Prisma } from "@prisma/client";
import { obtenerJuego } from "./juego.service";
import {
  obtenerCorreosInvitados,
  obtenerInvitado,
  obtenerTelefonosInvitados,
} from "./invitado.service";
import {
  HttpException,
  HttpStatusCodes400,
  HttpStatusCodes500,
} from "../utils";
import { stringify } from "querystring";
import { Address } from "cluster";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
        estado_invitacion: "NoEnviado",
        estado_notificacion_correo: "EnvioIncorrecto",
      });
    } else {
      const accepted = acceptedOrRejectedToString(
        invitacion.mailResult.accepted
      );
      const rejected = acceptedOrRejectedToString(
        invitacion.mailResult.rejected
      );

      actualizarEstadosCorreo(id_Juego, accepted, {
        estado_invitacion: "Enviado",
        estado_notificacion_correo: "EnvioCorrecto",
      });

      actualizarEstadosCorreo(id_Juego, rejected, {
        estado_invitacion: "Enviado",
        estado_notificacion_correo: "EnvioIncorrecto",
      });
    }

    return invitacion;
  } catch (error: any) {
    return new HttpException(HttpStatusCodes400.BAD_REQUEST, error.message);
  }
};

const enviarMensajeWhatsapp = async (para: string) => {
  try {
    const qr = process.env.LINK_QR_LITTLE || "";
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
            estado_invitacion: "Enviado",
            estado_notificacion_whatsapp: "EnvioIncorrecto",
          });
          resp.push({
            error: true,
            message: mensaje.getAttr(),
          });
        } else {
          actualizarEstadosWhatsApp([invitadoObtenido.id], idJuego, {
            estado_invitacion: "Enviado",
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
