import { Request, Response } from "express";
import {
  notificarPorCorreo,
  notificarPorWhatsapp,
} from "../services/notificacion.service";
import {
  HttpException,
  HttpStatusCodes200,
  catchedAsync,
  response,
} from "../utils";
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

export default {
  enviarCorreoYWhatsAppAInvitados: catchedAsync(
    enviarCorreoYWhatsAppAInvitados
  ),
};
