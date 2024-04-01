import { Request, Response } from "express";
import {
  actualizarJuego,
  crearJuego,
  obtenerJuegos,
  obtenerJuegosDeJugador,
} from "../services/juego.service";
import { Prisma } from "@prisma/client";
import { parse } from "path";

export const crear = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const datosJuego: Prisma.JuegosCreateInput = req.body;
    const juego = await crearJuego(parseInt(id), datosJuego);

    return res.status(201).json({
      message: "Juego creado correctamente",
      data: juego,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(402).json({
      message: "Error en juego.controller.crear",
      error: error.message,
    });
  }
};

export const obtenerJuegosDeCreador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const juegos = await obtenerJuegosDeJugador(parseInt(id));

    return res.status(201).json({
      message: `Lista de Juegos de jugador id: ${parseInt(id)}`,
      data: juegos,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controllers.obtenerJuegosDeCreador",
      error,
    });
  }
};

export const obtenerJuegosDeTodosLosJugadores = async (
  req: Request,
  res: Response
) => {
  try {
    const juegos = await obtenerJuegos();

    return res.status(201).json({
      message: "Listado de todos los juegos",
      data: juegos,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controllers.obtenerJuegosDeTodosLosJugadores",
      error,
    });
  }
};

export const actualizarJuegoDeCreador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, fecha_inicio, monto_total, moneda } = req.body;
    const date = new Date(fecha_inicio);
    const juego = await actualizarJuego(parseInt(id), {
      nombre,
      fecha_inicio: date,
      monto_total,
      moneda,
    });
    return res.status(201).json({
      message: "Datos de juego actualizados",
      data: juego,
    });
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controllers.actualizarJuego",
      error,
    });
  }
};

export const eliminarJuegoDeCreador = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    return res.status(402).json({
      message: "Error en juego.controllers.eliminarJuegoDeCreador",
      error,
    });
  }
};
