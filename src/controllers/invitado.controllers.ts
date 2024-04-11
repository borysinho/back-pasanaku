import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { Query } from "express-serve-static-core";
import {
  actualizarInvitado,
  buscarInvitado,
  crearInvitado,
  eliminarInvitado,
  obtenerCorreosInvitados,
  obtenerInvitado,
  obtenerInvitados,
  obtenerInvitadosDeJuego,
} from "../services/invitado.service";
import { existeIDInvitado } from "../services/jugador.service";

export const crear = async (req: Request, res: Response) => {
  try {
    const { idjuego } = req.params;
    const { telf, correo, nombre } = req.body;
    const invitado = await crearInvitado(
      parseInt(idjuego),
      correo,
      telf,
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
    const { id } = req.params;
    const invitado = await obtenerInvitado(parseInt(id));
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

export const correosInvitados = async (req: Request, res: Response) => {
  try {
    const { idsInvitados } = req.body;
    const invitados = await obtenerCorreosInvitados(idsInvitados);
    return res.status(201).json({
      message: "Se obtuvo correctamente los datos",
      data: invitados,
    });
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en juego.controller.correosInvitados",
      error: error.message,
    });
  }
};

interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}

export const validarDatosInvitado = async (
  req: TypedRequestQuery<{ telf: string; correo: string }>,
  res: Response
) => {
  try {
    const correo = req.query.correo;
    const telf = req.query.telf;

    const invitado = await buscarInvitado(correo, `+${telf}`);
    if (invitado) {
      const cuentaCreada = await existeIDInvitado(invitado.id);

      if (cuentaCreada) {
        return res.status(401).json({
          message: "Ya existe una cuenta registrada con ese teléfono y correo",
          data: cuentaCreada,
        });
      } else {
        return res.status(201).json({
          message: "Datos de invitacion validados",
          status: "correcto",
          data: invitado,
        });
      }
    } else {
      return res.status(428).json({
        message:
          "No se encuentran los datos del invitado. Verifique los datos e intente nuevamente",
        data: invitado,
      });
    }
  } catch (error: any) {
    return res.status(402).json({
      message: "Error en jugador.controllers.validarDatosInvitado",
      error: error.message,
    });
  }
};
