import { Request, Response } from "express";
import { catchedAsync } from "../exceptions";
import { obtenerJuegosDondeSeHaExpulsado } from "../services";
import { HttpStatusCodes200, response } from "../utils";

const ctrlGetJuegosExpulsados = catchedAsync(
  async (req: Request, res: Response) => {
    const { id_jugador } = req.params;
    const juegosExpulsados = await obtenerJuegosDondeSeHaExpulsado(
      parseInt(id_jugador)
    );
    response(res, HttpStatusCodes200.OK, juegosExpulsados);
  }
);

export default {
  ctrlGetJuegosExpulsados,
};
