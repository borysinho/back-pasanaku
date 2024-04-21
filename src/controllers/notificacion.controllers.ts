import { Request, Response } from "express";
import { catchedAsync, HttpException } from "../exceptions";
import {
  enviarNotificacionPush,
  notificarPorCorreo,
  notificarPorWhatsapp,
} from "../services/notificacion.service";
import { HttpStatusCodes200, response } from "../utils";
import { EstadoInvitacion } from "@prisma/client";
import { aceptarInvitacion, obtenerJuegosConEstado } from "../services";

const enviarCorreo = async (id_juego: number, idsInvitados: []) => {
  const mensajesCorreo = await notificarPorCorreo(idsInvitados, id_juego);

  if (mensajesCorreo instanceof HttpException) {
    return { mailResult: mensajesCorreo.getAttr() };
  } else {
    return mensajesCorreo;
  }
};

const enviarCorreoYWhatsAppAInvitados = async (req: Request, res: Response) => {
  // try {
  const { idsInvitados } = req.body;
  const { id } = req.params;
  const mensajesCorreo = await enviarCorreo(parseInt(id), idsInvitados);

  const mensajesWhatsapp = await notificarPorWhatsapp(
    parseInt(id),
    idsInvitados
  );

  response(res, HttpStatusCodes200.ACCEPTED, {
    mensajesCorreo,
    mensajesWhatsapp,
  });
};

const testPush = async (req: Request, res: Response) => {
  const push = enviarNotificacionPush(
    "eqQtiK74StiTzSKqk-O8CK:APA91bGVlO4p1dy9o2I9cmzGqo1R8eYMKMWTp-qS29_NC-dJPkJfT_Qkk5ETyNNyS8CXqxXbyJqJ0i2lzTr2NzRYbq_4Cw-41nppYNLNTt5eZBjO-TJ1QUJLAPhsTAPz1eDtlKca6yJn"
  );
  response(res, HttpStatusCodes200.ACCEPTED, push);
};

export default {
  enviarCorreoYWhatsAppAInvitados: catchedAsync(
    enviarCorreoYWhatsAppAInvitados
  ),
  testPush: catchedAsync(testPush),
};
