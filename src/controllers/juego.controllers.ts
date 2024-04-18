import { Request, Response } from "express";
import { EstadoInvitacion, Prisma } from "@prisma/client";
import {
  actualizarJuego,
  crearJuego,
  crearPuja,
  eliminarJuegoDeUnCreador,
  iniciarJuego,
  obtenerJuegos,
  obtenerJuegosConEstado,
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

const eliminarJuegoDeCreador = async (req: Request, res: Response) => {
  const { id_jugador, id_juego } = req.params;
  const juego = await eliminarJuegoDeUnCreador(
    parseInt(id_jugador),
    parseInt(id_juego)
  );

  response(res, HttpStatusCodes200.OK, juego);
};

const invitacionesPendientesDeJugador = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invitaciones = await obtenerJuegosConEstado(parseInt(id), [
    EstadoInvitacion.Pendiente,
  ]);

  response(res, HttpStatusCodes200.OK, invitaciones);
};

const iniciarUnJuego = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  console.log({ id_juego });

  const juegoIniciado = await iniciarJuego(parseInt(id_juego));

  response(res, HttpStatusCodes200.OK, juegoIniciado);
};

const establecerPuja = async (req: Request, res: Response) => {
  console.log({ body: req.body });
  const payLoad: Prisma.Jugador_Grupo_TurnoCreateInput = req.body;
  console.log({ payLoad });
  const { id_jugador, id_juego, id_turno } = req.params;

  const puja = await crearPuja(
    parseInt(id_jugador),
    parseInt(id_juego),
    parseInt(id_turno),
    payLoad
  );
  response(res, HttpStatusCodes200.OK, puja);
};

export default {
  crear: catchedAsync(crear),
  obtenerJuegosDeUnJugador: catchedAsync(obtenerJuegosDeUnJugador),
  obtenerJuegosDeTodosLosJugadores: catchedAsync(
    obtenerJuegosDeTodosLosJugadores
  ),
  actualizarJuegoDeCreador: catchedAsync(actualizarJuegoDeCreador),
  invitacionesPendientesDeJugador: catchedAsync(
    invitacionesPendientesDeJugador
  ),
  eliminarJuegoDeCreador: catchedAsync(eliminarJuegoDeCreador),
  iniciarUnJuego: catchedAsync(iniciarUnJuego),
  establecerPuja: catchedAsync(establecerPuja),
};
