import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {
  actualizarJugador,
  eliminarJugador,
  crearJugador,
  obtenerJugadores,
  obtenerJugador,
} from "../services/jugador.service";

export const crear = async (req: Request, res: Response) => {
  try {
    const { nombre, correo, telf } = req.body;
    const jugador = await crearJugador({
      nombre,
      correo,
      telf,
    });

    return res.status(201).json({
      message: "Jugador creado correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controller.crear",
      Errors: error,
    });
  }
};

export const mostrarTodos = async (req: Request, res: Response) => {
  try {
    const jugadores = await obtenerJugadores();
    return res.status(201).json({
      message: "Lista de jugadores",
      data: jugadores,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controller.mostrarTodos",
      Errors: error,
    });
  }
};

export const mostrarUno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const jugador = await obtenerJugador(parseInt(id));
    return res.status(201).json({
      message: "Lista de jugadores",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.controller.mostrarUno",
      Errors: error,
    });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, correo, telf } = req.body;
    const jugador = await actualizarJugador(
      {
        nombre,
        correo,
        telf,
      },
      id
    );
    return res.status(201).json({
      message: "Datos Actualizados Correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.actualizar.actualizar",
      Errors: error,
    });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const jugador = await eliminarJugador(id);

    return res.status(201).json({
      message: "Jugador eliminado correctamente",
      data: jugador,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en jugador.actualizar.eliminar",
      Errors: error,
    });
  }
};
