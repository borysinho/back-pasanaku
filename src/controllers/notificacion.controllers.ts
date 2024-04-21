import { Request, Response } from "express";
import { catchedAsync, HttpException } from "../exceptions";
import {
  notificarInicioOfertas,
  notificarPorCorreo,
  notificarPorWhatsapp,
} from "../services/notificacion.service";
import { HttpStatusCodes200, HttpStatusCodes400, response } from "../utils";
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

const inicioDeOfertas = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  if (id_juego) {
    const ofertas = await notificarInicioOfertas(parseInt(id_juego));
    console.log({ ofertas });
    response(res, HttpStatusCodes200.ACCEPTED, ofertas);
  } else {
    throw new HttpException(
      HttpStatusCodes400.NOT_FOUND,
      "Se esperaba id_juego"
    );
  }
  // const push = enviarNotificacionPush(
  //
  // );
};

export default {
  enviarCorreoYWhatsAppAInvitados: catchedAsync(
    enviarCorreoYWhatsAppAInvitados
  ),
  inicioDeOfertas: catchedAsync(inicioDeOfertas),
};
