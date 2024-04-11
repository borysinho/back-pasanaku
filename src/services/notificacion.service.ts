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
  obtenerTelefonosInvitados,
} from "./invitado.service";

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
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error: any) {
    throw new Error(
      `Error en notificacion.service.enviarInvitacionCorreo. Message: ${error.message}`
    );
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

export const notificarPorCorreo = async (
  idsInvitados: [],
  id_Juego: number
) => {
  try {
    console.log({ idsInvitados, id_Juego });
    const linkApp = process.env.LINK_APP || "";
    console.log({ linkApp });
    const { nombre } = await obtenerJuego(id_Juego);
    console.log({ nombre });
    const correos = await obtenerCorreosInvitados(idsInvitados);
    console.log({ correos });
    const invitacion = await enviarInvitacionCorreo(correos, nombre, linkApp);
    console.log({ invitacion });

    return invitacion;
  } catch (error: any) {
    throw new Error(
      `Error en notificacion.service.notificarPorCorreo. Message: ${error.message}`
    );
  }
};

const enviarMensajeWhatsapp = async (para: string) => {
  try {
    const qr = process.env.LINK_QR_LITTLE || "";
    const mensaje = await client.messages.create({
      mediaUrl: [qr],
      from: `whatsapp:${de}`,
      to: `whatsapp:${para}`,
      body: templateWhatsApp,
    });
    return mensaje;
    // .then((message: any) => {
    //   return message;
    // })
    // .catch((error: any) => {
    //   console.error(error.message);
    //   throw new Error(error.message);
    // });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const notificarPorWhatsapp = async (
  idJuego: number,
  idsInvitados: []
) => {
  // const x: Prisma.Invitados_Juegos = {[]};

  try {
    const telefonos = await obtenerTelefonosInvitados(idsInvitados);

    console.log({ telefonos });

    let resp: any = [];

    for (const element of idsInvitados) {
      const { id: id_invitado } = element;

      const invitadoObtenido = await prisma.invitados_Juegos.update({
        where: {
          id: {
            id_invitado,
            id_juego: idJuego,
          },
        },

        data: {
          estado_invitacion: "Enviado",
        },

        include: {
          invitado: {},
        },
      });

      //TODO Actualizar los estados de las notificaciones y el estado de las invitaciones

      if (invitadoObtenido) {
        const mensaje = await enviarMensajeWhatsapp(
          invitadoObtenido.invitado.telf
        );

        console.log({ mensaje });

        resp.push(mensaje);
      }
    }

    return resp;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
