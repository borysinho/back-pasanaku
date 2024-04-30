import { Request, Response } from "express";
import { catchedAsync } from "../exceptions";
import { obtenerPagosTurnos } from "../services";
import { HttpStatusCodes200, response } from "../utils";

const obtenerPagosDeUnTurno = async (req: Request, res: Response) => {
  // try {
  const { id_turno, id_jugador_juego } = req.params;

  const pagos = await obtenerPagosTurnos(
    parseInt(id_turno),
    parseInt(id_jugador_juego)
  );

  response(res, HttpStatusCodes200.ACCEPTED, pagos);
};

export default {
  obtenerPagosDeUnTurno: catchedAsync(obtenerPagosDeUnTurno),
};
