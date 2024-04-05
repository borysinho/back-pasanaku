// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

import { Twilio } from "twilio";
import prisma from "./prisma.service";
import nodemailer from "nodemailer";
import htmlMailInvitation from "../resources/mail.invitation.resources";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const linkApp = process.env.LINK_APP;
const de = process.env.TWILIO_FROM_NUMBER;
const client = new Twilio(accountSid, authToken);

const correo_de = process.env.CORREO_DIR;
const correo_pass = process.env.CORREO_PASS;

export const enviarInvitacionCorreo = async (para: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: correo_de,
      pass: correo_pass,
    },
  });

  const mailOptions = {
    from: correo_de,
    to: para,
    subject: "Invitación a Pasanaku",
    // text: "",
    html: `<p>Te han invitao a jugar Pasanaku. Puedes descargar la aplicación de ${linkApp}`,
  };

  // console.log({ transporter, mailOptions });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log({ info: info.response });
      return info.response;
      // console.log("Email sent: " + info.response);
    }
  });
};

const enviarMensajeWhatsapp = async (para: string) => {
  try {
    const mensaje = await client.messages.create({
      mediaUrl: ["https://i.ibb.co/rQPcxHS/Test-Link-QR.png"],
      from: `whatsapp:${de}`,
      to: `whatsapp:${para}`,
      body: `*¡Felicidades!* Usted ha sido invitado para ser parte de Pasanaku. 
          
  Para obtener la aplicación puede hacerlo escaneando el código QR o ingresando al siguiente enlace: _${linkApp}_`,
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

      if (invitadoObtenido) {
        const mensaje = await enviarMensajeWhatsapp(
          invitadoObtenido.invitado.telf
        );

        console.log({ mensaje });
        resp.push(mensaje);
      }
    }
    // idsInvitados.forEach(async (element) => {
    // });
    console.log({ resp });
    return resp;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
