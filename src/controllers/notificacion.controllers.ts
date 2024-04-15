import { Prisma } from "@prisma/client";
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
import { body } from "express-validator";

const enviarCorreo = async (id_juego: number, idsInvitados: []) => {
  const mensajesCorreo = await notificarPorCorreo(idsInvitados, id_juego);

  if (mensajesCorreo instanceof HttpException) {
    console.log(mensajesCorreo.getAttr());

    return { mailResult: mensajesCorreo.getAttr() };
    // response(res, HttpStatusCodes200.OK, {
    //   mailResult: mensajesCorreo.getAttr(),
    // });
  } else {
    return mensajesCorreo;
    // response(res, HttpStatusCodes200.OK, {
    //   mailResult: mensajesCorreo,
    // });
  }
};

const enviarCorreoYWhatsAppAInvitados = async (req: Request, res: Response) => {
  // try {
  const { idsInvitados } = req.body;
  const { id } = req.params;
  const mensajesCorreo = await enviarCorreo(parseInt(id), idsInvitados);

  // const mensajesCorreo = await notificarPorCorreo(idsInvitados, parseInt(id));

  // if (mensajesCorreo instanceof HttpException) {
  //   console.log(mensajesCorreo.getAttr());

  //   response(res, HttpStatusCodes200.OK, {
  //     mailResult: mensajesCorreo.getAttr(),
  //   });
  // } else {
  //   response(res, HttpStatusCodes200.OK, {
  //     mailResult: mensajesCorreo,
  //   });
  // }

  const mensajesWhatsapp = await notificarPorWhatsapp(
    parseInt(id),
    idsInvitados
  );

  response(res, HttpStatusCodes200.ACCEPTED, {
    mensajesCorreo,
    mensajesWhatsapp,
  });
  // console.log({ mensajesWhatsapp });
  // return res.status(201).json({
  // message: "Registro agregado correctamente",
  // data: [mensajesWhatsapp],
  // data: [mensajesWhatsapp, mensajesCorreo],
  // data: [mensajesCorreo],
  // });
  // } catch (error: any) {
  //   return res.status(402).json({
  //     message: "Error en notificaciones.controller.notificaciones",
  //     error: error.message,
  //   });
  // }
};

export default {
  enviarCorreoYWhatsAppAInvitados: catchedAsync(
    enviarCorreoYWhatsAppAInvitados
  ),
};
