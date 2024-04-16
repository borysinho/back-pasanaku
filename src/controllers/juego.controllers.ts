import { Request, Response } from "express";
import { EstadoInvitacion, Prisma } from "@prisma/client";
import {
  aceptarInvitacion,
  actualizarJuego,
  crearJuego,
  eliminarJuegoDeUnCreador,
  obtenerJuegosConEstado,
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
  const { id_juego, id_jugador, id_invitado } = req.params;
  const detalleIngreso = await aceptarInvitacion(
    parseInt(id_juego),
    parseInt(id_jugador),
    parseInt(id_invitado)
  );

  response(res, HttpStatusCodes200.OK, detalleIngreso);
};

const invitacionesDeJugador = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const { EstadoInvitacion } = req.body;
  // console.log({ EstadoInvitacion });
  // const estadoInvitacion: EstadoInvitacion[] = [
  //   "Aceptado",
  //   "Cancelado",
  //   "Pendiente",
  //   "Rechazado",
  // ];

  const estadoInvitacion: EstadoInvitacion[] = req.body.EstadoInvitacion;
  const invitaciones = await obtenerJuegosConEstado(
    parseInt(id),
    estadoInvitacion
  );

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

const aceptarJuego = async (req: Request, res: Response) => {};

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
