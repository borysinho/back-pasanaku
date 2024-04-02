import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import {
  actualizarInvitado,
  crearInvitado,
  eliminarInvitado,
  obtenerInvitado,
  obtenerInvitados,
  obtenerInvitadosDeJuego,
} from "../services/invitado.service";

export const crear = async (req: Request, res: Response) => {
  try {
    const { idjuego } = req.params;
    const datosInvitado: Prisma.InvitadosCreateInput = req.body;
    const { nombre } = req.body;
    const invitado = await crearInvitado(
      parseInt(idjuego),
      datosInvitado,
      nombre
    );
    return res.status(201).json({
      message: "Registro agregado correctamente",
      data: invitado,
    });
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en juego.controller.crear",
      error: error.message,
    });
  }
};

export const mostrarUno = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const invitado = await obtenerInvitado(parseInt(id));
    console.log({ invitado });
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitado,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controller.mostrarUno",
      error,
    });
  }
};

export const mostrarTodos = async (req: Request, res: Response) => {
  try {
    const invitados = await obtenerInvitados();
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitados,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controller.mostrarTodos",
      error,
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invitadoData: Prisma.InvitadosUpdateInput = req.body;
    const invitado = await actualizarInvitado(parseInt(id), invitadoData);
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitado,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controller.actualizar",
      error,
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invitado = await eliminarInvitado(parseInt(id));
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitado,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controller.eliminar",
      error,
    });
  }
};

export const invitadosJuego = async (req: Request, res: Response) => {
  try {
    const { idjuego } = req.params;
    const invitados = await obtenerInvitadosDeJuego(parseInt(idjuego));
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitados,
    });
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en juego.controller.invitadosJuego",
      error: error.message,
    });
  }
};
