import { Request, Response } from "express";
import {
  eliminarTurnosDeJuego,
  iniciarTurno,
  notificarInicioOfertas,
  obtenerGanadorDeturno,
  obtenerTodosLosTurnos,
  obtenerTurnosDeJuego,
  registrarOferta,
} from "../services";
import { HttpStatusCodes200, HttpStatusCodes400, response } from "../utils";
import { HttpException, catchedAsync } from "../exceptions";

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

const establecerPuja = async (req: Request, res: Response) => {
  const { monto_puja } = req.body;
  console.log({ monto_puja });
  const { id_jugador, id_juego, id_turno } = req.params;

  const puja = await registrarOferta(
    parseInt(id_jugador),
    parseInt(id_juego),
    parseInt(id_turno),
    monto_puja
  );
  response(res, HttpStatusCodes200.OK, puja);
};

const iniciarUnTurno = async (req: Request, res: Response) => {
  const { id_juego } = req.params;

  if (id_juego) {
    const turno = await iniciarTurno(parseInt(id_juego));
    await notificarInicioOfertas(parseInt(id_juego));

    response(res, HttpStatusCodes200.OK, { turno });
  } else {
    throw new HttpException(
      HttpStatusCodes400.NOT_FOUND,
      "Se esperaba el id del juego"
    );
  }
};

export default {
  eliminarTurnosJuego: catchedAsync(eliminarTurnosJuego),
  obtenerTurnosJuego: catchedAsync(obtenerTurnosJuego),
  obtenerGanadorTurno: catchedAsync(obtenerGanadorTurno),
  obtenerTodosTurnos: catchedAsync(obtenerTodosTurnos),
  iniciarUnTurno: catchedAsync(iniciarUnTurno),
  establecerPuja: catchedAsync(establecerPuja),
};
