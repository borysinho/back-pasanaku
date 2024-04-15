import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  aceptarInvitacion,
  actualizarJuego,
  crearJuego,
  eliminarJuegoDeUnCreador,
  obtenerInvitacionesDeJugador,
  obtenerJuegos,
  obtenerJuegosDeJugador,
} from "../services/juego.service";
import { HttpStatusCodes200, catchedAsync, response } from "../utils";

const crear = async (req: Request, res: Response) => {
  const { id } = req.params;

  const datosJuego: Prisma.JuegosCreateInput = req.body;
  console.log({ id, body: datosJuego });
  const juego = await crearJuego(parseInt(id), datosJuego);

  response(res, HttpStatusCodes200.OK, juego);
};

const obtenerJuegosDeUnJugador = async (req: Request, res: Response) => {
  const { id } = req.params;
  const juegos = await obtenerJuegosDeJugador(parseInt(id));

  response(res, HttpStatusCodes200.OK, juegos);
};

const obtenerJuegosDeTodosLosJugadores = async (
  req: Request,
  res: Response
) => {
  const juegos = await obtenerJuegos();
  response(res, HttpStatusCodes200.OK, juegos);
};

const actualizarJuegoDeCreador = async (req: Request, res: Response) => {
  const { id_jugador, id_juego } = req.params;
  const { nombre, fecha_inicio, monto_total, moneda } = req.body;
  const date = new Date(fecha_inicio);
  const juego = await actualizarJuego(
    parseInt(id_jugador),
    parseInt(id_juego),
    {
      nombre,
      fecha_inicio: date,
      monto_total,
      moneda,
    }
  );

  response(res, HttpStatusCodes200.OK, juego);
};

const aceptarInvitacionDeJuego = async (req: Request, res: Response) => {
  const { id_juego, id_jugador } = req.params;
  const detalleIngreso = await aceptarInvitacion(
    parseInt(id_juego),
    parseInt(id_jugador)
  );

  response(res, HttpStatusCodes200.OK, detalleIngreso);
};

const invitacionesDeJugador = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invitaciones = await obtenerInvitacionesDeJugador(parseInt(id));

  response(res, HttpStatusCodes200.OK, invitaciones);
};

const eliminarJuegoDeCreador = async (req: Request, res: Response) => {
  const { id_jugador, id_juego } = req.params;
  const juego = await eliminarJuegoDeUnCreador(
    parseInt(id_jugador),
    parseInt(id_juego)
  );

  response(res, HttpStatusCodes200.OK, juego);
};

export default {
  crear: catchedAsync(crear),
  obtenerJuegosDeUnJugador: catchedAsync(obtenerJuegosDeUnJugador),
  obtenerJuegosDeTodosLosJugadores: catchedAsync(
    obtenerJuegosDeTodosLosJugadores
  ),
  actualizarJuegoDeCreador: catchedAsync(actualizarJuegoDeCreador),
  aceptarInvitacionDeJuego: catchedAsync(aceptarInvitacionDeJuego),
  invitacionesDeJugador: catchedAsync(invitacionesDeJugador),
  eliminarJuegoDeCreador: catchedAsync(eliminarJuegoDeCreador),
};
