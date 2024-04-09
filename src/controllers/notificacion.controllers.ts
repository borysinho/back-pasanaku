import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  notificarPorCorreo,
  notificarPorWhatsapp,
} from "../services/notificacion.service";

export const notificaciones = async (req: Request, res: Response) => {
  try {
    const { idsInvitados } = req.body;
    const { id } = req.params;

    const mensajesCorreo = await notificarPorCorreo(idsInvitados, parseInt(id));

    const mensajesWhatsapp = await notificarPorWhatsapp(
      parseInt(id),
      idsInvitados
    );

    return res.status(201).json({
      message: "Registro agregado correctamente",
      // data: [mensajesWhatsapp],
      data: [mensajesWhatsapp, mensajesCorreo],
      // data: [mensajesCorreo],
    });
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en notificaciones.controller.notificaciones",
      error: error.message,
    });
  }
};
