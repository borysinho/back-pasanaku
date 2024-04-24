import { Request, Response } from "express";
import {
  eliminarTurnosDeJuego,
  obtenerGanadorDeturno,
  obtenerTodosLosTurnos,
  obtenerTurnosDeJuego,
} from "../services";
import { HttpStatusCodes200, response } from "../utils";
import { catchedAsync } from "../exceptions";

const eliminarTurnosJuego = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  const turno = await eliminarTurnosDeJuego(parseInt(id_juego));
  response(res, HttpStatusCodes200.OK, turno);
};

const obtenerTurnosJuego = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  const turnos = await obtenerTurnosDeJuego(parseInt(id_juego));
  response(res, HttpStatusCodes200.OK, turnos);
};

const obtenerGanadorTurno = async (req: Request, res: Response) => {
  const { id_turno } = req.params;
  const ganador = await obtenerGanadorDeturno(parseInt(id_turno));
  response(res, HttpStatusCodes200.OK, ganador);
};

const obtenerTodosTurnos = async (req: Request, res: Response) => {
  const ganador = await obtenerTodosLosTurnos();
  response(res, HttpStatusCodes200.OK, ganador);
};

export default {
  eliminarTurnosJuego: catchedAsync(eliminarTurnosJuego),
  obtenerTurnosJuego: catchedAsync(obtenerTurnosJuego),
  obtenerGanadorTurno: catchedAsync(obtenerGanadorTurno),
  obtenerTodosTurnos: catchedAsync(obtenerTodosTurnos),
};
