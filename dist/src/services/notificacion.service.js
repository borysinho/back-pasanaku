"use strict";
// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificarPorWhatsapp = exports.enviarInvitacionCorreo = void 0;
const twilio_1 = require("twilio");
const prisma_service_1 = __importDefault(require("./prisma.service"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const linkApp = process.env.LINK_APP;
const de = process.env.TWILIO_FROM_NUMBER;
const client = new twilio_1.Twilio(accountSid, authToken);
const correo_de = process.env.CORREO_DIR;
const correo_pass = process.env.CORREO_PASS;
const enviarInvitacionCorreo = (para) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
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
        }
        else {
            console.log({ info: info.response });
            return info.response;
            // console.log("Email sent: " + info.response);
        }
    });
});
exports.enviarInvitacionCorreo = enviarInvitacionCorreo;
const enviarMensajeWhatsapp = (para) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mensaje = yield client.messages.create({
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
    }
    catch (error) {
        throw new Error(error.message);
    }
});
const notificarPorWhatsapp = (idJuego, idsInvitados) => __awaiter(void 0, void 0, void 0, function* () {
    // const x: Prisma.Invitados_Juegos = {[]};
    try {
        let resp = [];
        for (const element of idsInvitados) {
            const { id: id_invitado } = element;
            const invitadoObtenido = yield prisma_service_1.default.invitados_Juegos.update({
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
                const mensaje = yield enviarMensajeWhatsapp(invitadoObtenido.invitado.telf);
                console.log({ mensaje });
                resp.push(mensaje);
            }
        }
        // idsInvitados.forEach(async (element) => {
        // });
        console.log({ resp });
        return resp;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.notificarPorWhatsapp = notificarPorWhatsapp;
