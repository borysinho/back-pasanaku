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

    // const mensajesWhatsapp = await notificarPorWhatsapp(
    //   parseInt(id),
    //   idsInvitados
    // );

    // const mensajesCorreo = await enviarInvitacionCorreo(
    //   ["quirogaborys@hotmail.com", "borysquiroga@gmail.com"],
    //   "AV. Alemana",
    //   "https://drive.google.com/file/d/1kHFx2S7z4wrb8nLYPowPIYVRov-WCvRf/view"
    // );

    const mensajesCorreo = await notificarPorCorreo(idsInvitados, parseInt(id));

    return res.status(201).json({
      message: "Registro agregado correctamente",
      // data: [mensajesWhatsapp],
      data: [mensajesCorreo],
    });
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en notificaciones.controller.testWhatsapp",
      error: error.message,
    });
  }
};
