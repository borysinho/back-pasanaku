import { Request, Response } from "express";
import { eliminarTurnosDeJuego } from "../services";
import { HttpStatusCodes200, response } from "../utils";
import { catchedAsync } from "../exceptions";

const eliminarTurno = async (req: Request, res: Response) => {
  const { id_juego } = req.params;
  const turno = await eliminarTurnosDeJuego(parseInt(id_juego));
  response(res, HttpStatusCodes200.OK, turno);
};

export default {
  eliminarTurno: catchedAsync(eliminarTurno),
};
