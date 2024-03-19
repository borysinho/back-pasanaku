import { Request, Response } from "express";
import {
  actualizarJugador,
  eliminarJugador,
  crearJugador,
  obtenerJugadores,
  existeEmail,
} from "../services/jugador.service";

export const crear = async (req: Request, res: Response) => {
  const { nombre, email } = req.body;
  const jugador = await crearJugador({
    nombre,
    email,
  });

  return res.status(201).json({
    message: "Jugador creado correctamente",
    data: jugador,
  });
};

export const mostrar = async (req: Request, res: Response) => {
  const jugadores = await obtenerJugadores();
  return res.status(201).json({
    message: "Lista de jugadores",
    data: jugadores,
  });
};

export const actualizar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  console.log({ req });
  const { nombre, email } = req.body;
  const jugador = await actualizarJugador(
    {
      nombre,
      email,
    },
    id
  );
  return res.status(201).json({
    message: "Datos Actualizados Correctamente",
    data: jugador,
  });
};

export const eliminar = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const jugador = await eliminarJugador(id);

  return res.status(201).json({
    message: "Jugador eliminado correctamente",
    data: jugador,
  });
};

export const correo = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existe = await existeEmail(email);

  return res.status(201).json({
    message: "Ejecutado buscar Email",
    data: existe,
  });
};
