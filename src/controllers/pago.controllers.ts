import { Request, Response } from "express";
import { catchedAsync } from "../exceptions";
import { obtenerPagosTurnos } from "../services";
import { HttpStatusCodes200, response } from "../utils";

const obtenerPagosDeUnTurno = async (req: Request, res: Response) => {
  // try {
  const { id_turno } = req.params;

  const pagos = await obtenerPagosTurnos(parseInt(id_turno));

  response(res, HttpStatusCodes200.ACCEPTED, pagos);
};

export default {
  obtenerPagosDeUnTurno: catchedAsync(obtenerPagosDeUnTurno),
};
